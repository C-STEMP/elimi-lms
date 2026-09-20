"use client";

import React from "react";
import { AdminHeader } from "../overview/admin-header";
import { CoursesFilterBar } from "./courses-filter-bar";
import { CoursesGrid } from "./courses-grid";
import { CoursesPagination } from "./courses-pagination";
import { CreateCourseModal } from "./create-course-modal";
import { CreateCourseSuccessModal } from "./create-course-success-modal";
import { DeleteCourseConfirmModal } from "./delete-course-confirm-modal";
import { DeleteCourseSuccessModal } from "./delete-course-success-modal";
import { useAdminCourses } from "../../hooks/use-admin-courses";

export const AdminCoursesView: React.FC = () => {
  const {
    courses,
    activeTab,
    setActiveTab,
    currentPage,
    setCurrentPage,
    totalPages,
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
    closeCreateSuccess,
    isDeleteConfirmOpen,
    isDeleteSuccessOpen,
    openDeleteConfirm,
    closeDeleteConfirm,
    confirmDelete,
    closeDeleteSuccess,
  } = useAdminCourses();

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      <AdminHeader title="Courses" />

      <CoursesFilterBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onCreateClick={openCreateModal}
      />

      <CoursesGrid
        courses={courses}
        onDelete={openDeleteConfirm}
        onPublish={handlePublishCourse}
        onUnpublish={handleUnpublishCourse}
      />

      <CoursesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

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
