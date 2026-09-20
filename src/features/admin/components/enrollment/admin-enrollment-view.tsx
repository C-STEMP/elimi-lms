"use client";

import React from "react";
import { AdminHeader } from "../overview/admin-header";
import { EnrollmentTopActions } from "./enrollment-top-actions";
import { EnrollmentSearchFilterBar } from "./enrollment-search-filter-bar";
import { EnrollmentTable } from "./enrollment-table";
import { CoursesPagination } from "../courses/courses-pagination";
import { EnrollLearnersModal } from "./enroll-learners-modal";
import { ExportDataModal } from "./export-data-modal";
import { EnrollmentSuccessModal } from "./enrollment-success-modal";
import { useAdminEnrollment } from "../../hooks/use-admin-enrollment";

export const AdminEnrollmentView: React.FC = () => {
  const {
    enrollments,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    isEnrollOpen,
    enrollForm,
    setEnrollForm,
    addCourseField,
    updateCourseField,
    openEnrollModal,
    closeEnrollModal,
    handleEnrollSubmit,
    isEnrollSuccessOpen,
    closeEnrollSuccess,
    isExportOpen,
    exportForm,
    setExportForm,
    openExportModal,
    closeExportModal,
    handleExportSubmit,
    isExportSuccessOpen,
    closeExportSuccess,
  } = useAdminEnrollment();

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      <AdminHeader title="Enrollment" />

      <EnrollmentTopActions
        onExport={openExportModal}
        onEnrol={openEnrollModal}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <EnrollmentSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <EnrollmentTable enrollments={enrollments} />
      </div>

      <CoursesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <EnrollLearnersModal
        isOpen={isEnrollOpen}
        data={enrollForm}
        onChange={setEnrollForm}
        onAddCourse={addCourseField}
        onUpdateCourse={updateCourseField}
        onClose={closeEnrollModal}
        onSubmit={handleEnrollSubmit}
      />

      <ExportDataModal
        isOpen={isExportOpen}
        data={exportForm}
        onChange={setExportForm}
        onClose={closeExportModal}
        onSubmit={handleExportSubmit}
      />

      <EnrollmentSuccessModal
        isOpen={isEnrollSuccessOpen}
        onClose={closeEnrollSuccess}
      />

      <EnrollmentSuccessModal
        isOpen={isExportSuccessOpen}
        title="Congratulations"
        message="Data Exported Successfully"
        onClose={closeExportSuccess}
      />
    </div>
  );
};
