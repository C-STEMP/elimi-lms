"use client";

import { useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthoringCourses, courseKeys } from "@/features/courses/hooks";
import { publishCourse, unpublishCourse } from "@/features/courses/api";
import { createCourseWithScorm, CourseContentError } from "../services/course-authoring-flow";
import { useToast } from "@/shared/components/ui/toast";
import type { ApiError } from "@/shared/types";
import {
  INITIAL_STEP_ONE,
  INITIAL_STEP_TWO,
  DEFAULT_PAINT_THUMBNAIL,
} from "../constants/courses-data";
import type {
  AdminCourseFilter,
  AdminCourseItem,
  CreateCourseStepOneData,
  CreateCourseStepTwoData,
} from "../types/courses";

export function useAdminCourses() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const authoringQuery = useAuthoringCourses();

  const [activeTab, setActiveTab] = useState<AdminCourseFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createStep, setCreateStep] = useState<1 | 2>(1);
  const [stepOneData, setStepOneData] = useState<CreateCourseStepOneData>(INITIAL_STEP_ONE);
  const [stepTwoData, setStepTwoData] = useState<CreateCourseStepTwoData>(INITIAL_STEP_TWO);
  const [isCreateSuccessOpen, setIsCreateSuccessOpen] = useState(false);
  const [createdCourseId, setCreatedCourseId] = useState<string | null>(null);
  const draftCourseIdRef = useRef<string | null>(null);
  const [deleteCourseId, setDeleteCourseId] = useState<string | null>(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isDeleteSuccessOpen, setIsDeleteSuccessOpen] = useState(false);

  const mappedCourses: AdminCourseItem[] = useMemo(() => {
    return (authoringQuery.data?.data ?? []).map((c) => {
      const amount = Number(c.price?.amountMinorUnits || 0) / 100;
      return {
        id: c.id,
        title: c.title,
        description: c.description || "",
        price: amount === 0 ? "Free" : `₦${amount.toLocaleString()}`,
        isFree: amount === 0,
        status: (c.status as "published" | "draft") || "draft",
        thumbnailUrl: c.thumbnailAssetId || DEFAULT_PAINT_THUMBNAIL,
      };
    });
  }, [authoringQuery.data]);

  const filteredCourses = useMemo(() => {
    return mappedCourses.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const match = !q || c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
      if (!match) return false;
      if (activeTab === "free") return c.isFree;
      if (activeTab === "paid") return !c.isFree;
      if (activeTab === "published") return c.status === "published";
      if (activeTab === "drafts") return c.status === "draft";
      return true;
    });
  }, [mappedCourses, activeTab, searchQuery]);

  const handleCreateCourse = async () => {
    setIsSubmitting(true);
    try {
      const res = await createCourseWithScorm({
        stepOne: stepOneData,
        stepTwo: stepTwoData,
        existingCourseId: draftCourseIdRef.current,
      });
      draftCourseIdRef.current = null;
      setCreatedCourseId(res.id || null);
      setIsCreateOpen(false);
      setIsCreateSuccessOpen(true);
    } catch (err) {
      // Keep the modal open so the admin can fix the file and retry against the same draft.
      if (err instanceof CourseContentError) draftCourseIdRef.current = err.courseId;
      toast({
        type: "error",
        title: "Couldn't Create Course",
        description: (err as ApiError)?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
    }
  };

  const handlePublishCourse = async (courseId: string) => {
    try {
      await publishCourse(courseId);
      toast({ type: "success", title: "Course Published", description: "The course is now live in the catalogue." });
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    } catch (err) {
      const apiError = err as ApiError;
      toast({
        type: "error",
        title: "Couldn't Publish Course",
        description:
          apiError?.code === "lms.course.not_publishable"
            ? "This course has no content yet. Add a module with at least one item (e.g. a SCORM package) before publishing."
            : apiError?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const handleUnpublishCourse = async (courseId: string) => {
    try {
      await unpublishCourse(courseId);
      queryClient.invalidateQueries({ queryKey: courseKeys.authoringLists() });
      queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
    } catch (err) {
      toast({
        type: "error",
        title: "Couldn't Unpublish Course",
        description: (err as ApiError)?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return {
    courses: filteredCourses,
    isLoading: authoringQuery.isLoading,
    isSubmitting,
    isError: authoringQuery.isError,
    error: authoringQuery.error,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isCreateOpen,
    createStep,
    setCreateStep,
    stepOneData,
    setStepOneData,
    stepTwoData,
    setStepTwoData,
    openCreateModal: () => {
      draftCourseIdRef.current = null;
      setStepOneData(INITIAL_STEP_ONE);
      setStepTwoData(INITIAL_STEP_TWO);
      setCreateStep(1);
      setIsCreateOpen(true);
    },
    closeCreateModal: () => setIsCreateOpen(false),
    handleCreateCourse,
    handlePublishCourse,
    handleUnpublishCourse,
    isCreateSuccessOpen,
    createdCourseId,
    closeCreateSuccess: () => setIsCreateSuccessOpen(false),
    isDeleteConfirmOpen,
    isDeleteSuccessOpen,
    deleteCourseId,
    openDeleteConfirm: (id: string) => { setDeleteCourseId(id); setIsDeleteConfirmOpen(true); },
    closeDeleteConfirm: () => { setIsDeleteConfirmOpen(false); setDeleteCourseId(null); },
    confirmDelete: () => {
      setDeleteCourseId(null);
      setIsDeleteConfirmOpen(false);
      setIsDeleteSuccessOpen(true);
    },
    closeDeleteSuccess: () => { setIsDeleteSuccessOpen(false); setDeleteCourseId(null); },
  };
}
