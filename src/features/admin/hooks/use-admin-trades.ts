"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getCapTrades,
  getCapTradeDetail,
  getCapTradeUnits,
} from "@/features/cap";
import type {
  LevelItem,
  UnitCourseItem,
  Trade,
  Unit,
} from "@/features/cap/types";
import {
  useAuthoringCourses,
  courseKeys,
} from "@/features/courses/hooks";
import {
  createCourse,
  updateCourse,
  createModule,
  createItem,
  publishCourse,
} from "@/features/courses/api";
import { uploadScormPackage } from "@/features/storage";

export function useAdminTrades() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Navigation from search params
  const tradeIdParam = searchParams.get("tradeId") || searchParams.get("trade") || searchParams.get("slot");
  const levelParam = searchParams.get("level");

  const activeLevelNumber = levelParam ? parseInt(levelParam, 10) : null;

  // Real backend queries
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

  // Resolve active trade from list or query parameter
  const activeTrade = useMemo(() => {
    if (!tradeIdParam) return null;
    // Check if tradeId matches by id, slug, or 1-based index
    const foundById = capTrades.find((t) => t.id === tradeIdParam || t.slug === tradeIdParam);
    if (foundById) return foundById;

    const slotIndex = parseInt(tradeIdParam, 10);
    if (!isNaN(slotIndex) && slotIndex >= 1 && slotIndex <= capTrades.length) {
      return capTrades[slotIndex - 1];
    }
    return null;
  }, [tradeIdParam, capTrades]);

  const activeTradeId = activeTrade?.id || tradeIdParam || null;

  // Real backend query for active trade detail (NOS) from CAP
  const {
    data: activeTradeDetail = null,
    isLoading: isLoadingTradeDetail,
  } = useQuery({
    queryKey: ["cap", "trade-detail", activeTradeId],
    queryFn: () => (activeTradeId ? getCapTradeDetail(activeTradeId) : Promise.resolve(null)),
    enabled: Boolean(activeTradeId),
    staleTime: 5 * 60 * 1000,
  });

  // Real backend query for active trade units from CAP
  const {
    data: activeTradeUnits = [],
    isLoading: isLoadingUnits,
    refetch: refetchTradeUnits,
  } = useQuery({
    queryKey: ["cap", "trade-units", activeTradeId],
    queryFn: () => (activeTradeId ? getCapTradeUnits(activeTradeId) : Promise.resolve([])),
    enabled: Boolean(activeTradeId),
    staleTime: 5 * 60 * 1000,
  });

  // Compute levels for active trade from levelCount and real units
  const currentLevels: LevelItem[] = useMemo(() => {
    if (!activeTrade) return [];

    const effectiveLevelCount = activeTrade.levelCount || 3;
    const unitsList = activeTradeUnits;

    return Array.from({ length: effectiveLevelCount }, (_, idx) => {
      const levelNum = idx + 1;
      const unitsInThisLevel = unitsList.filter(
        (u) => ((u as { level?: number }).level || 1) === levelNum
      );
      const totalUnits = unitsInThisLevel.length > 0 ? unitsInThisLevel.length : Math.max(0, Math.floor((activeTrade.unitCount || 0) / effectiveLevelCount));

      return {
        id: `level-${levelNum}-${activeTrade.id}`,
        level: levelNum,
        title: `NSQ Level ${levelNum} - ${activeTrade.name}`,
        status: "published",
        totalUnits: totalUnits,
        publishedUnits: totalUnits,
      };
    });
  }, [activeTrade, activeTradeUnits]);

  // Active level object
  const activeLevel = useMemo(() => {
    if (!activeTrade || activeLevelNumber === null) return null;
    return currentLevels.find((lvl) => lvl.level === activeLevelNumber) || null;
  }, [activeTrade, activeLevelNumber, currentLevels]);

  // Real units for current trade and level, correlated with real LMS authoring courses
  const currentUnits: UnitCourseItem[] = useMemo(() => {
    if (!activeTrade || !activeLevelNumber || !activeTradeId) return [];

    const lmsCourses = authoringQuery.data?.data || [];

    // Filter CAP units for this level
    let levelUnits = activeTradeUnits.filter(
      (u) => ((u as { level?: number }).level || 1) === activeLevelNumber
    );

    // If CAP returned units without explicit level tag and this is Level 1, show all units
    if (levelUnits.length === 0 && activeLevelNumber === 1 && activeTradeUnits.length > 0) {
      levelUnits = activeTradeUnits;
    }

    return levelUnits.map((u, idx) => {
      // Find matching LMS course
      const matchedCourse = lmsCourses.find(
        (c) =>
          c.capLinkage?.unitId === u.id ||
          c.title?.toLowerCase() === u.title?.toLowerCase()
      );

      return {
        id: u.id,
        referenceNumber: u.referenceNumber || `U-${activeLevelNumber}-${String(idx + 1).padStart(2, "0")}`,
        title: u.title,
        status: matchedCourse?.status === "published" ? "published" : "draft",
        path: matchedCourse ? `/courses/${matchedCourse.id}` : "",
        courseId: matchedCourse?.id,
        price: matchedCourse?.price,
        levelNumber: activeLevelNumber,
      };
    });
  }, [activeTrade, activeLevelNumber, activeTradeId, activeTradeUnits, authoringQuery.data]);

  // Navigation handlers
  const handleSelectTrade = useCallback(
    (tradeId: string) => {
      router.push(`/admin/courses?tradeId=${tradeId}`);
    },
    [router]
  );

  const handleSelectLevel = useCallback(
    (levelNumber: number) => {
      if (!activeTradeId) return;
      router.push(`/admin/courses?tradeId=${activeTradeId}&level=${levelNumber}`);
    },
    [router, activeTradeId]
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

  // Modals state
  const [isAddLevelModalOpen, setIsAddLevelModalOpen] = useState(false);
  const [editingLevel, setEditingLevel] = useState<LevelItem | null>(null);

  const [isDeleteLevelConfirmOpen, setIsDeleteLevelConfirmOpen] = useState(false);
  const [deletingLevel, setDeletingLevel] = useState<LevelItem | null>(null);

  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<UnitCourseItem | null>(null);

  const [isDeleteUnitConfirmOpen, setIsDeleteUnitConfirmOpen] = useState(false);
  const [deletingUnit, setDeletingUnit] = useState<UnitCourseItem | null>(null);

  const [isUploadZipModalOpen, setIsUploadZipModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Level Actions
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
  const openAddUnitModal = () => {
    setEditingUnit(null);
    setIsAddUnitModalOpen(true);
  };

  const openEditUnitModal = (unit: UnitCourseItem) => {
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
    scormFile?: File | null;
    isPublished?: boolean;
    onProgress?: (percent: number) => void;
  }) => {
    const targetLevel =
      activeLevel ||
      currentLevels.find((lvl) => lvl.level === editingUnit?.levelNumber) ||
      currentLevels[0];

    if (!activeTrade || !targetLevel) return;
    setIsSubmitting(true);
    try {
      let courseId = editingUnit?.courseId;

      if (courseId) {
        await updateCourse(courseId, {
          title: payload.title,
          description: payload.description,
          price: {
            amountMinorUnits: String(Math.round((payload.price || 0) * 100)),
            currency: "NGN",
          },
        });
      } else {
        const realUnitId =
          editingUnit?.id && !editingUnit.id.startsWith("unit-") ? editingUnit.id : null;

        const capLinkage = {
          sectorId: activeTrade.sectorId || activeTrade.sector?.id || null,
          tradeId: activeTrade.id || null,
          unitId: realUnitId,
        };

        const course = await createCourse({
          title: payload.title,
          description:
            payload.description ||
            `Competency unit ${payload.referenceNumber} for ${activeTrade.name}, Level ${targetLevel.level}`,
          price: {
            amountMinorUnits: String(Math.round((payload.price || 0) * 100)),
            currency: "NGN",
          },
          completionPolicy: {
            minPercent: 80,
            requireAllRequiredItems: true,
            requirePassedAssessments: true,
          },
          capLinkage,
        });
        courseId = course.id;
      }

      if (courseId && payload.scormFile) {
        try {
          const packageAssetId = await uploadScormPackage(
            payload.scormFile,
            payload.onProgress
          );
          const courseModule = await createModule(courseId, {
            title: "Module 1: Course Content",
            order: 1,
          });
          await createItem(courseId, courseModule.id, {
            title: payload.title,
            type: "scorm_package",
            order: 1,
            required: true,
            packageAssetId,
          });
        } catch (scormErr) {
          console.error("Failed to attach SCORM file for unit:", scormErr);
        }
      }

      if (courseId && payload.isPublished) {
        try {
          await publishCourse(courseId);
        } catch (pubErr) {
          console.warn("Could not publish course immediately:", pubErr);
        }
      }
      await queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
      await queryClient.invalidateQueries({ queryKey: ["cap", "trade-units", activeTradeId] });
      closeAddUnitModal();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: { message?: string } } };
        message?: string;
      };
      const detail =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error?.message ||
        axiosErr?.message ||
        JSON.stringify(axiosErr?.response?.data || {});
      console.error("Failed to save unit course to LMS:", detail, err);
      throw err;
    } finally {
      setIsSubmitting(false);
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

  const confirmDeleteUnit = () => {
    closeDeleteUnitConfirm();
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
    onProgress?: (percent: number) => void
  ) => {
    if (!activeTrade || !activeLevel) return;
    setIsSubmitting(true);
    try {
      const packageAssetId = await uploadScormPackage(file, onProgress);
      const courseTitle = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

      const capLinkage = {
        sectorId: activeTrade.sectorId || activeTrade.sector?.id || null,
        tradeId: activeTrade.id || null,
        unitId: null,
      };

      const course = await createCourse({
        title: courseTitle,
        description: `Imported SCORM course unit for ${activeTrade.name} (Level ${activeLevel.level})`,
        price: { amountMinorUnits: "0", currency: "NGN" },
        completionPolicy: {
          minPercent: 80,
          requireAllRequiredItems: true,
          requirePassedAssessments: true,
        },
        capLinkage,
      });

      const courseModule = await createModule(course.id, {
        title: "Module 1: Course Content",
        order: 1,
      });

      await createItem(course.id, courseModule.id, {
        title: courseTitle,
        type: "scorm_package",
        order: 1,
        required: true,
        packageAssetId,
      });

      await queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
      await queryClient.invalidateQueries({ queryKey: ["cap", "trade-units", activeTradeId] });
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { message?: string; error?: { message?: string } } };
        message?: string;
      };
      const detail =
        axiosErr?.response?.data?.message ||
        axiosErr?.response?.data?.error?.message ||
        axiosErr?.message ||
        JSON.stringify(axiosErr?.response?.data || {});
      console.error("Failed to upload SCORM course:", detail, err);
      throw err;
    } finally {
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
