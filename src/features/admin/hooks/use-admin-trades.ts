"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCapTrades,
  getCapTradeDetail,
  getCapTradeUnits,
} from "@/features/cap";
import type { LevelItem, UnitCourseItem } from "@/features/cap/types";
import { useAuthoringCourses, courseKeys } from "@/features/courses/hooks";
import {
  createCourse,
  updateCourse,
  publishCourse,
  unpublishCourse,
  deleteCourse,
} from "@/features/courses/api";
import type { CapLinkage } from "@/features/courses/types";
import { uploadScormPackage } from "@/features/storage";
import type { ApiError } from "@/shared/types";
import { useToast } from "@/shared/components/ui/toast";
import {
  attachScormPackage,
  courseHasContent,
  CourseContentError,
} from "../services/course-authoring-flow";

export function useAdminTrades() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const tradeIdParam =
    searchParams.get("tradeId") ||
    searchParams.get("trade") ||
    searchParams.get("slot");
  const levelParam = searchParams.get("level");

  const activeLevelNumber = levelParam ? parseInt(levelParam, 10) : null;

  const authoringQuery = useAuthoringCourses();

  const {
    data: capTrades = [],
    isLoading: isLoadingCapTrades,
    isError: isCapTradesError,
    error: capTradesError,
    refetch: refetchCapTrades,
  } = useQuery({
    queryKey: ["cap", "trades"],
    queryFn: getCapTrades,
    staleTime: 5 * 60 * 1000,
  });

  const activeTrade = useMemo(() => {
    if (!tradeIdParam) return null;
    const foundById = capTrades.find(
      (t) => t.id === tradeIdParam || t.slug === tradeIdParam,
    );
    if (foundById) return foundById;

    const slotIndex = parseInt(tradeIdParam, 10);
    if (!isNaN(slotIndex) && slotIndex >= 1 && slotIndex <= capTrades.length) {
      return capTrades[slotIndex - 1];
    }
    return null;
  }, [tradeIdParam, capTrades]);

  const activeTradeId = activeTrade?.id || tradeIdParam || null;

  const { data: activeTradeDetail = null } = useQuery({
    queryKey: ["cap", "trade-detail", activeTradeId],
    queryFn: () =>
      activeTradeId ? getCapTradeDetail(activeTradeId) : Promise.resolve(null),
    enabled: Boolean(activeTradeId),
    staleTime: 5 * 60 * 1000,
  });

  const { data: activeTradeUnits = [], isLoading: isLoadingUnits } = useQuery({
    queryKey: ["cap", "trade-units", activeTradeId],
    queryFn: () =>
      activeTradeId ? getCapTradeUnits(activeTradeId) : Promise.resolve([]),
    enabled: Boolean(activeTradeId),
    staleTime: 5 * 60 * 1000,
  });

  const currentLevels: LevelItem[] = useMemo(() => {
    if (!activeTrade) return [];

    const nosLevels =
      activeTradeDetail?.activeNosDocument?.qualificationLevels || [];
    const effectiveLevelCount =
      nosLevels.length || activeTrade.levelCount || 3;
    const unitsList = activeTradeUnits;
    const lmsCourses = (authoringQuery.data?.data || []).filter(
      (c) => c.status !== "archived",
    );

    return Array.from({ length: effectiveLevelCount }, (_, idx) => {
      const nosLevel = nosLevels[idx];
      const levelNum = nosLevel?.level ?? idx + 1;
      const qualificationLevelId = nosLevel?.id;

      let unitsInThisLevel =
        nosLevel?.units && nosLevel.units.length > 0
          ? nosLevel.units
          : unitsList.filter((u) => {
              if (qualificationLevelId && u.qualificationLevelId) {
                return u.qualificationLevelId === qualificationLevelId;
              }
              return ((u as { level?: number }).level || 1) === levelNum;
            });

      if (
        unitsInThisLevel.length === 0 &&
        levelNum === 1 &&
        nosLevels.length === 0 &&
        unitsList.length > 0
      ) {
        unitsInThisLevel = unitsList;
      }

      const totalUnits =
        unitsInThisLevel.length > 0
          ? unitsInThisLevel.length
          : Math.max(
              0,
              Math.floor((activeTrade.unitCount || 0) / effectiveLevelCount),
            );

      const publishedUnits = unitsInThisLevel.filter((u) => {
        const matchedCourse = lmsCourses.find((c) => {
          const linkageUnitId = c.capLinkage?.unitId;
          if (linkageUnitId && linkageUnitId === u.id) return true;
          const linkageUnitIds = Array.isArray(c.capLinkage?.unitIds)
            ? c.capLinkage.unitIds.filter(Boolean)
            : [];
          if (linkageUnitIds.includes(u.id)) return true;
          if (c.title?.trim().toLowerCase() === u.title?.trim().toLowerCase())
            return true;
          if (u.referenceNumber && c.description?.includes(u.referenceNumber))
            return true;
          return false;
        });
        return matchedCourse?.status === "published";
      }).length;

      return {
        id: `level-${levelNum}-${activeTrade.id}`,
        qualificationLevelId,
        level: levelNum,
        title: `NSQ Level ${levelNum} - ${activeTrade.name}`,
        status: publishedUnits > 0 ? "published" : "draft",
        totalUnits: totalUnits,
        publishedUnits: publishedUnits,
      };
    });
  }, [activeTrade, activeTradeDetail, activeTradeUnits, authoringQuery.data]);

  const activeLevel = useMemo(() => {
    if (!activeTrade || activeLevelNumber === null) return null;
    return currentLevels.find((lvl) => lvl.level === activeLevelNumber) || null;
  }, [activeTrade, activeLevelNumber, currentLevels]);

  const currentUnits: UnitCourseItem[] = useMemo(() => {
    if (!activeTrade || !activeLevelNumber || !activeTradeId) return [];

    const lmsCourses = (authoringQuery.data?.data || []).filter(
      (c) => c.status !== "archived",
    );

    const nosLevels =
      activeTradeDetail?.activeNosDocument?.qualificationLevels || [];
    const matchedNosLevel = nosLevels.find(
      (lvl) => lvl.level === activeLevelNumber,
    );
    const targetQualificationLevelId =
      matchedNosLevel?.id || activeLevel?.qualificationLevelId;

    let levelUnits =
      matchedNosLevel?.units && matchedNosLevel.units.length > 0
        ? matchedNosLevel.units
        : activeTradeUnits.filter((u) => {
            if (targetQualificationLevelId && u.qualificationLevelId) {
              return u.qualificationLevelId === targetQualificationLevelId;
            }
            return (
              ((u as { level?: number }).level || 1) === activeLevelNumber
            );
          });

    if (
      levelUnits.length === 0 &&
      activeLevelNumber === 1 &&
      nosLevels.length === 0 &&
      activeTradeUnits.length > 0
    ) {
      levelUnits = activeTradeUnits;
    }

    const matchedCourseIds = new Set<string>();

    const mappedCapUnits: UnitCourseItem[] = levelUnits.map((u, idx) => {
      const matchedCourse = lmsCourses.find((c) => {
        const linkageUnitId = c.capLinkage?.unitId;
        if (linkageUnitId && linkageUnitId === u.id) return true;
        const linkageUnitIds = Array.isArray(c.capLinkage?.unitIds)
          ? c.capLinkage.unitIds.filter(Boolean)
          : [];
        if (linkageUnitIds.includes(u.id)) return true;
        if (c.title?.trim().toLowerCase() === u.title?.trim().toLowerCase())
          return true;
        if (u.referenceNumber && c.description?.includes(u.referenceNumber))
          return true;
        return false;
      });

      if (matchedCourse?.id) {
        matchedCourseIds.add(matchedCourse.id);
      }

      return {
        id: u.id,
        referenceNumber:
          u.referenceNumber ||
          `U-${activeLevelNumber}-${String(idx + 1).padStart(2, "0")}`,
        title: u.title,
        status: matchedCourse?.status === "published" ? "published" : "draft",
        path: matchedCourse ? `/courses/${matchedCourse.id}` : "",
        courseId: matchedCourse?.id,
        price: matchedCourse?.price,
        levelNumber: activeLevelNumber,
      };
    });

    const extraTradeCourses: UnitCourseItem[] = lmsCourses
      .filter((c) => {
        if (matchedCourseIds.has(c.id)) return false;
        const matchesTrade =
          c.capLinkage?.tradeId === activeTrade.id ||
          (activeTrade.name &&
            c.description
              ?.toLowerCase()
              .includes(activeTrade.name.toLowerCase()));
        if (!matchesTrade) return false;
        const matchesLevelByLinkage =
          targetQualificationLevelId &&
          c.capLinkage?.qualificationLevelId &&
          c.capLinkage.qualificationLevelId !== targetQualificationLevelId;
        if (matchesLevelByLinkage) return false;
        const levelTag = `level ${activeLevelNumber}`;
        if (
          c.description &&
          /level\s+\d+/i.test(c.description) &&
          !c.description.toLowerCase().includes(levelTag)
        ) {
          return false;
        }
        return true;
      })
      .map((c, idx) => ({
        id: `course-${c.id}`,
        referenceNumber: `C-${activeLevelNumber}-${String(idx + 1).padStart(2, "0")}`,
        title: c.title,
        status: c.status === "published" ? "published" : "draft",
        path: `/courses/${c.id}`,
        courseId: c.id,
        price: c.price,
        levelNumber: activeLevelNumber,
      }));

    return [...mappedCapUnits, ...extraTradeCourses];
  }, [
    activeTrade,
    activeTradeDetail,
    activeLevel,
    activeLevelNumber,
    activeTradeId,
    activeTradeUnits,
    authoringQuery.data,
  ]);

  const handleSelectTrade = useCallback(
    (tradeId: string) => {
      router.push(`/admin/courses?tradeId=${tradeId}`);
    },
    [router],
  );

  const handleSelectLevel = useCallback(
    (levelNumber: number) => {
      if (!activeTradeId) return;
      router.push(
        `/admin/courses?tradeId=${activeTradeId}&level=${levelNumber}`,
      );
    },
    [router, activeTradeId],
  );

  const handleBackToTrades = useCallback(() => {
    router.push("/admin/courses");
  }, [router]);

  const handleBackToLevels = useCallback(() => {
    if (activeTradeId) {
      router.push(`/admin/courses?tradeId=${activeTradeId}`);
    } else {
      router.push("/admin/courses");
    }
  }, [router, activeTradeId]);

  const [isAddLevelModalOpen, setIsAddLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);

  const [isDeleteLevelConfirmOpen, setIsDeleteLevelConfirmOpen] =
    useState(false);
  const [deletingLevel, setDeletingLevel] = useState<LevelItem | null>(null);

  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitCourseItem | null>(null);

  const [isDeleteUnitConfirmOpen, setIsDeleteUnitConfirmOpen] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<UnitCourseItem | null>(null);

  const [isUploadZipModalOpen, setIsUploadZipModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddLevelModal = () => {
    setEditingLevel(null);
    setIsAddLevelModalOpen(true);
  };

  const openEditLevelModal = (level: LevelItem) => {
    setEditingLevel(level);
    setIsAddLevelModalOpen(true);
  };

  const closeAddLevelModal = () => {
    setEditingLevel(null);
    setIsAddLevelModalOpen(false);
  };

  const handleSaveLevel = (levelNumber: number, title: string) => {
    closeAddLevelModal();
  };

  const handleTogglePublishLevel = (levelNumber: number) => {
    // toggle publish
  };

  const openDeleteLevelConfirm = (level: LevelItem) => {
    setDeletingLevel(level);
    setIsDeleteLevelConfirmOpen(true);
  };

  const closeDeleteLevelConfirm = () => {
    setDeletingLevel(null);
    setIsDeleteLevelConfirmOpen(false);
  };

  const confirmDeleteLevel = () => {
    closeDeleteLevelConfirm();
  };

  // Unit Actions
  // Draft left behind when a new unit's course saved but its content/publish step failed,
  // so resubmitting the modal updates that course instead of creating a duplicate.
  const draftUnitCourseIdRef = useRef<string | null>(null);

  const openAddUnitModal = () => {
    draftUnitCourseIdRef.current = null;
    setEditingUnit(null);
    setIsAddUnitModalOpen(true);
  };

  const openEditUnitModal = (unit: UnitCourseItem) => {
    draftUnitCourseIdRef.current = null;
    setEditingUnit(unit);
    setIsAddUnitModalOpen(true);
  };

  const closeAddUnitModal = () => {
    setEditingUnit(null);
    setIsAddUnitModalOpen(false);
  };

  const handleSaveUnit = async (payload: {
    referenceNumber: string;
    title: string;
    description?: string;
    price?: number;
    packageAssetId?: string | null;
    isPublished?: boolean;
  }) => {
    const targetLevel =
      activeLevel ||
      currentLevels.find((lvl) => lvl.level === editingUnit?.levelNumber) ||
      currentLevels[0];

    if (!activeTrade || !targetLevel) return;
    setIsSubmitting(true);
    try {
      let courseId =
        editingUnit?.courseId || draftUnitCourseIdRef.current || undefined;

      // Refuse to publish an empty unit up front, before anything is written.
      if (
        payload.isPublished &&
        !payload.packageAssetId &&
        !(courseId && (await courseHasContent(courseId)))
      ) {
        throw new Error(
          'Upload a SCORM package to publish this unit, or untick "Publish immediately" to save it as a draft.',
        );
      }

      // The modal uploads the package before Save is enabled, so we only get a finished assetId.
      const { packageAssetId } = payload;

      const price = {
        amountMinorUnits: String(Math.round((payload.price || 0) * 100)),
        currency: "NGN",
      };

      if (courseId) {
        await updateCourse(courseId, {
          title: payload.title,
          description: payload.description,
          price,
        });
      } else {
        const realUnitId =
          editingUnit?.id && !editingUnit.id.startsWith("unit-")
            ? editingUnit.id
            : null;

        const capLinkage: CapLinkage = {
          sectorId: activeTrade.sectorId || activeTrade.sector?.id || null,
          tradeId: activeTrade.id || null,
          ...(targetLevel.qualificationLevelId
            ? { qualificationLevelId: targetLevel.qualificationLevelId }
            : {}),
          ...(realUnitId ? { unitId: realUnitId } : {}),
        };

        const createCoursePayload = {
          title: payload.title,
          description:
            payload.description ||
            `Competency unit ${payload.referenceNumber} for ${activeTrade.name}, Level ${targetLevel.level}`,
          price,
          completionPolicy: {
            minPercent: 80,
            requireAllRequiredItems: true,
            requirePassedAssessments: true,
          },
        };

        let course;
        try {
          course = await createCourse({
            ...createCoursePayload,
            capLinkage,
          });
        } catch (createErr: unknown) {
          const apiErr = createErr as ApiError | undefined;
          const isLinkageError =
            apiErr?.code === "validation_error" ||
            apiErr?.details?.some(
              (d) =>
                d.field?.includes("capLinkage") ||
                d.field?.includes("capLinkage.unitId"),
            ) ||
            apiErr?.message?.includes("cannot resolve CapLinkage ancestors") ||
            apiErr?.message?.includes("Unknown CAP unitId") ||
            apiErr?.message?.includes("Request validation failed");

          if (isLinkageError) {
            console.warn(
              "CAP linkage could not be resolved or validated by LMS, retrying course creation:",
              apiErr?.details || apiErr?.message,
            );
            if (capLinkage.unitId) {
              try {
                course = await createCourse({
                  ...createCoursePayload,
                  capLinkage: {
                    sectorId: capLinkage.sectorId ?? null,
                    tradeId: capLinkage.tradeId ?? null,
                    ...(capLinkage.qualificationLevelId
                      ? {
                          qualificationLevelId:
                            capLinkage.qualificationLevelId,
                        }
                      : {}),
                  },
                });
              } catch {
                course = await createCourse({
                  ...createCoursePayload,
                });
              }
            } else {
              course = await createCourse({
                ...createCoursePayload,
              });
            }
          } else {
            throw createErr;
          }
        }

        courseId = course.id;
        draftUnitCourseIdRef.current = courseId;
      }

      if (packageAssetId) {
        try {
          await attachScormPackage(courseId, packageAssetId, payload.title);
        } catch (attachErr) {
          throw new CourseContentError(courseId, attachErr);
        }
      }

      if (payload.isPublished) {
        await publishCourse(courseId);
      } else if (editingUnit?.status === "published" && courseId) {
        await unpublishCourse(courseId);
      }

      draftUnitCourseIdRef.current = null;
      closeAddUnitModal();
    } catch (err: unknown) {
      const apiErr = err as ApiError | undefined;
      const detailsStr = apiErr?.details
        ?.map((d) => `${d.field ? `${d.field}: ` : ""}${d.issue || ""}`)
        .filter(Boolean)
        .join("; ");
      console.error(
        "Failed to save unit course to LMS:",
        apiErr?.message,
        detailsStr || apiErr?.details || err,
      );
      throw err;
    } finally {
      await queryClient.invalidateQueries({
        queryKey: courseKeys.authoringLists(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["cap", "trade-units", activeTradeId],
      });
      setIsSubmitting(false);
    }
  };

  const [publishingUnitId, setPublishingUnitId] = useState<string | null>(null);

  const handleTogglePublishUnit = async (unit: UnitCourseItem) => {
    if (!unit.courseId) {
      openEditUnitModal(unit);
      return;
    }

    setPublishingUnitId(unit.id);
    try {
      if (unit.status === "published") {
        await unpublishCourse(unit.courseId);
      } else {
        await publishCourse(unit.courseId);
      }
    } catch (err: unknown) {
      console.error("Failed to toggle publish status for unit:", err);
      throw err;
    } finally {
      setPublishingUnitId(null);
      await queryClient.invalidateQueries({
        queryKey: courseKeys.authoringLists(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["cap", "trade-units", activeTradeId],
      });
    }
  };

  const openDeleteUnitConfirm = (unit: UnitCourseItem) => {
    setDeletingUnit(unit);
    setIsDeleteUnitConfirmOpen(true);
  };

  const closeDeleteUnitConfirm = () => {
    setDeletingUnit(null);
    setIsDeleteUnitConfirmOpen(false);
  };

  const confirmDeleteUnit = async () => {
    if (!deletingUnit?.courseId) {
      toast({
        type: "info",
        title: "No Course Attached",
        description:
          "This unit does not have an attached LMS course to delete.",
      });
      closeDeleteUnitConfirm();
      return;
    }

    setIsSubmitting(true);
    try {
      await deleteCourse(deletingUnit.courseId);
      queryClient.removeQueries({
        queryKey: courseKeys.authoringDetail(deletingUnit.courseId),
      });
      queryClient.removeQueries({
        queryKey: courseKeys.detail(deletingUnit.courseId),
      });
      await queryClient.invalidateQueries({
        queryKey: courseKeys.authoringLists(),
      });
      await queryClient.invalidateQueries({
        queryKey: courseKeys.lists(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["cap", "trade-units", activeTradeId],
      });
      toast({
        type: "success",
        title: "Course Deleted",
        description: "Course deleted successfully.",
      });
      closeDeleteUnitConfirm();
    } catch (err: unknown) {
      const apiErr = err as ApiError | undefined;
      toast({
        type: "error",
        title: "Couldn't Delete Course",
        description:
          apiErr?.message || "Failed to delete course. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload SCORM ZIP
  const openUploadZipModal = () => {
    setIsUploadZipModalOpen(true);
  };

  const closeUploadZipModal = () => {
    setIsUploadZipModalOpen(false);
  };

  const handleUploadZip = async (
    file: File,
    onProgress?: (percent: number) => void,
  ) => {
    if (!activeTrade || !activeLevel) return;
    setIsSubmitting(true);
    try {
      const packageAssetId = await uploadScormPackage(file, onProgress);
      const courseTitle = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ");

      const capLinkage: CapLinkage = {
        sectorId: activeTrade.sectorId || activeTrade.sector?.id || null,
        tradeId: activeTrade.id || null,
        ...(activeLevel.qualificationLevelId
          ? { qualificationLevelId: activeLevel.qualificationLevelId }
          : {}),
      };

      const coursePayload = {
        title: courseTitle,
        description: `Imported SCORM course unit for ${activeTrade.name} (Level ${activeLevel.level})`,
        price: { amountMinorUnits: "0", currency: "NGN" },
        completionPolicy: {
          minPercent: 80,
          requireAllRequiredItems: true,
          requirePassedAssessments: true,
        },
      };

      let course;
      try {
        course = await createCourse({
          ...coursePayload,
          capLinkage,
        });
      } catch (createErr: unknown) {
        console.warn(
          "Course creation with capLinkage failed in handleUploadZip, retrying without capLinkage:",
          (createErr as ApiError)?.message,
        );
        course = await createCourse(coursePayload);
      }

      try {
        await attachScormPackage(course.id, packageAssetId, courseTitle);
      } catch (attachErr) {
        throw new CourseContentError(course.id, attachErr);
      }
    } catch (err: unknown) {
      const apiErr = err as ApiError | undefined;
      const detailsStr = apiErr?.details
        ?.map((d) => `${d.field ? `${d.field}: ` : ""}${d.issue || ""}`)
        .filter(Boolean)
        .join("; ");
      console.error(
        "Failed to upload SCORM course:",
        apiErr?.message,
        detailsStr || apiErr?.details || err,
      );
      throw err;
    } finally {
      await queryClient.invalidateQueries({
        queryKey: courseKeys.authoringLists(),
      });
      await queryClient.invalidateQueries({
        queryKey: ["cap", "trade-units", activeTradeId],
      });
      setIsSubmitting(false);
    }
  };

  return {
    // Current navigation state
    activeTradeId,
    activeLevelNumber,
    activeTrade,
    activeLevel,

    // Data lists
    capTrades,
    currentLevels,
    currentUnits,
    activeTradeUnits,
    activeTradeDetail,

    // Loading & error states
    isLoadingCapTrades,
    isCapTradesError,
    capTradesError,
    refetchCapTrades,
    isLoadingUnits,
    isSubmitting,

    // Navigation actions
    handleSelectTrade,
    handleSelectLevel,
    handleBackToTrades,
    handleBackToLevels,

    // Levels CRUD
    isAddLevelModalOpen,
    editingLevel,
    openAddLevelModal,
    openEditLevelModal,
    closeAddLevelModal,
    handleSaveLevel,
    handleTogglePublishLevel,

    isDeleteLevelConfirmOpen,
    deletingLevel,
    openDeleteLevelConfirm,
    closeDeleteLevelConfirm,
    confirmDeleteLevel,
    handleConfirmDeleteLevel: confirmDeleteLevel,

    // Units CRUD
    isAddUnitModalOpen,
    editingUnit,
    openAddUnitModal,
    openEditUnitModal,
    closeAddUnitModal,
    handleSaveUnit,
    handleTogglePublishUnit,
    publishingUnitId,

    isDeleteUnitConfirmOpen,
    deletingUnit,
    openDeleteUnitConfirm,
    closeDeleteUnitConfirm,
    confirmDeleteUnit,
    handleConfirmDeleteUnit: confirmDeleteUnit,

    // SCORM ZIP Upload
    isUploadZipModalOpen,
    openUploadZipModal,
    closeUploadZipModal,
    handleUploadZip,
    handleUploadZipPackage: handleUploadZip,
  };
}
