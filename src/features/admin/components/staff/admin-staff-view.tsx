"use client";

import React from "react";
import { AdminHeader } from "../overview/admin-header";
import { StaffTopActions } from "./staff-top-actions";
import { StaffSearchFilterBar } from "./staff-search-filter-bar";
import { StaffTable } from "./staff-table";
import { CoursesPagination } from "../courses/courses-pagination";
import { AddStaffModal } from "./add-staff-modal";
import { AddStaffConfirmModal } from "./add-staff-confirm-modal";
import { AddStaffSuccessModal } from "./add-staff-success-modal";
import { useAdminStaff } from "../../hooks/use-admin-staff";

export const AdminStaffView: React.FC = () => {
  const {
    staffList,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    currentPage,
    setCurrentPage,
    totalPages,
    isAddModalOpen,
    isConfirmModalOpen,
    isSuccessModalOpen,
    addForm,
    setAddForm,
    openAddModal,
    closeAddModal,
    handleSubmitForm,
    closeConfirmModal,
    handleConfirmAddStaff,
    closeSuccessModal,
  } = useAdminStaff();

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      <AdminHeader title="Staff" />

      <StaffTopActions onAddStaff={openAddModal} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <StaffSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <StaffTable staffList={staffList} />
      </div>

      <CoursesPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <AddStaffModal
        isOpen={isAddModalOpen}
        data={addForm}
        onChange={setAddForm}
        onClose={closeAddModal}
        onSubmit={handleSubmitForm}
      />

      <AddStaffConfirmModal
        isOpen={isConfirmModalOpen}
        onConfirm={handleConfirmAddStaff}
        onCancel={closeConfirmModal}
      />

      <AddStaffSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={closeSuccessModal}
      />
    </div>
  );
};
