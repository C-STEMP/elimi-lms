"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminHeader } from "../overview/admin-header";
import { CoursesFilterBar } from "./courses-filter-bar";
import { CoursesGrid } from "./courses-grid";
import { CreateCourseModal } from "./create-course-modal";
import { CreateCourseSuccessModal } from "./create-course-success-modal";
import { DeleteCourseConfirmModal } from "./delete-course-confirm-modal";
import { DeleteCourseSuccessModal } from "./delete-course-success-modal";
import { useAdminCourses } from "../../hooks/use-admin-courses";

export const AdminCoursesView: React.FC = () => {
  const router = useRouter();
  const {
    courses,
    isError,
    error,
    activeTab,
    setActiveTab,
    isCreateOpen,
    createStep,
    setCreateStep,
    stepOneData,
    setStepOneData,
    stepTwoData,
    setStepTwoData,
    openCreateModal,
    closeCreateModal,
    handleCreateCourse,
    handlePublishCourse,
    handleUnpublishCourse,
    isSubmitting,
    isCreateSuccessOpen,
    createdCourseId,
    closeCreateSuccess,
    isDeleteConfirmOpen,
    isDeleteSuccessOpen,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
    closeDeleteSuccess,
  } = useAdminCourses();

  const goToCoursePreview = (id: string) => router.push(`/courses/${id}`);

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      <AdminHeader title="Courses" />

      <CoursesFilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateClick={openCreateModal}
      />

      {isError ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center flex flex-col items-center justify-center gap-2">
          <p className="text-base font-semibold text-neutral-primary">
            Couldn&apos;t load courses
          </p>
          <p className="text-xs text-neutral-secondary max-w-sm">
            {error?.code === "lms.onboarding.incomplete"
              ? "Your staff/instructor profile isn't set up yet — finish onboarding to manage courses."
              : error?.message || "Something went wrong. Please try again."}
          </p>
          {error?.code === "lms.onboarding.incomplete" && (
            <Link
              href="/onboarding"
              className="mt-2 text-xs font-semibold text-secondary hover:text-secondary-hover"
            >
              Complete onboarding
            </Link>
          )}
        </div>
      ) : (
        <CoursesGrid
          courses={courses}
          onDelete={openDeleteConfirm}
          onPreview={goToCoursePreview}
          onPublish={handlePublishCourse}
          onUnpublish={handleUnpublishCourse}
        />
      )}

      <CreateCourseModal
        isOpen={isCreateOpen}
        step={createStep}
        stepOneData={stepOneData}
        stepTwoData={stepTwoData}
        isSubmitting={isSubmitting}
        onStepChange={setCreateStep}
        onStepOneChange={setStepOneData}
        onStepTwoChange={setStepTwoData}
        onClose={closeCreateModal}
        onSubmit={handleCreateCourse}
      />

      <CreateCourseSuccessModal
        isOpen={isCreateSuccessOpen}
        onPreview={
          createdCourseId ? () => goToCoursePreview(createdCourseId) : undefined
        }
        onClose={closeCreateSuccess}
      />

      <DeleteCourseConfirmModal
        isOpen={isDeleteConfirmOpen}
        onConfirm={confirmDelete}
        onCancel={closeDeleteConfirm}
      />

      <DeleteCourseSuccessModal
        isOpen={isDeleteSuccessOpen}
        onClose={closeDeleteSuccess}
      />
    </div>
  );
};
