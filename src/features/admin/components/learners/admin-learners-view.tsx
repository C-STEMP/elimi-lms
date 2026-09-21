"use client";

import React from "react";
import { AdminHeader } from "../overview/admin-header";
import { LearnersTopActions } from "./learners-top-actions";
import { LearnersSearchFilterBar } from "./learners-search-filter-bar";
import { LearnersTable } from "./learners-table";
import { EnrollLearnerModal } from "./enroll-learner-modal";
import { EnrollConfirmModal } from "./enroll-confirm-modal";
import { EnrollSuccessModal } from "./enroll-success-modal";
import { SuspendLearnerConfirmModal } from "./suspend-learner-confirm-modal";
import { SuspendLearnerSuccessModal } from "./suspend-learner-success-modal";
import { useAdminLearners } from "../../hooks/use-admin-learners";

export const AdminLearnersView: React.FC = () => {
  const {
    learners,
    searchQuery,
    setSearchQuery,
    selectedIds,
    toggleSelectAll,
    toggleSelectLearner,
    viewMode,
    setViewMode,
    isEnrollOpen,
    enrollForm,
    setEnrollForm,
    openEnrollModal,
    closeEnrollModal,
    handleEnrollSubmit,
    isEnrollConfirmOpen,
    closeEnrollConfirm,
    confirmEnroll,
    isEnrollSuccessOpen,
    closeEnrollSuccess,
    isSuspendConfirmOpen,
    isSuspendSuccessOpen,
    openSuspendConfirm,
    closeSuspendConfirm,
    confirmSuspend,
    closeSuspendSuccess,
  } = useAdminLearners();

  return (
    <div className="flex-1 flex flex-col gap-4 pb-6">
      <AdminHeader title="Learners" />

      <LearnersTopActions onAddLearner={openEnrollModal} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-2xs overflow-hidden">
        <LearnersSearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <LearnersTable
          learners={learners}
          selectedIds={selectedIds}
          onToggleSelectAll={toggleSelectAll}
          onToggleSelectLearner={toggleSelectLearner}
          onSuspend={openSuspendConfirm}
        />
      </div>

      <EnrollLearnerModal
        isOpen={isEnrollOpen}
        data={enrollForm}
        onChange={setEnrollForm}
        onClose={closeEnrollModal}
        onSubmit={handleEnrollSubmit}
      />

      <EnrollConfirmModal
        isOpen={isEnrollConfirmOpen}
        onConfirm={confirmEnroll}
        onCancel={closeEnrollConfirm}
      />

      <EnrollSuccessModal
        isOpen={isEnrollSuccessOpen}
        onClose={closeEnrollSuccess}
      />

      <SuspendLearnerConfirmModal
        isOpen={isSuspendConfirmOpen}
        onConfirm={confirmSuspend}
        onCancel={closeSuspendConfirm}
      />

      <SuspendLearnerSuccessModal
        isOpen={isSuspendSuccessOpen}
        onClose={closeSuspendSuccess}
      />
    </div>
  );
};
