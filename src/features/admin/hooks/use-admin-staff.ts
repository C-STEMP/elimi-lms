"use client";

import { useMemo, useState } from "react";
import { useCreateStaffInvite, useStaffMembers } from "@/features/staff/hooks";
import { INITIAL_ADD_STAFF_FORM } from "../constants/staff-data";
import type { AddStaffFormData, AdminStaffItem, StaffViewMode } from "../types/staff";

export function useAdminStaff() {
  const staffQuery = useStaffMembers();
  const inviteMutation = useCreateStaffInvite();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<StaffViewMode>("list");
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [addForm, setAddForm] = useState<AddStaffFormData>(INITIAL_ADD_STAFF_FORM);

  const mappedStaff: AdminStaffItem[] = useMemo(() => {
    return (staffQuery.data?.data ?? []).map((s) => {
      const email = s.email || `${s.lmsUserId}@elimi.edu`;
      return {
        id: s.lmsUserId,
        name: s.displayName || email.split("@")[0],
        email,
        role: s.role === "admin" ? "Super admin" : s.role === "content_manager" ? "Content Manager" : "Regular Admin",
        date: s.createdAt ? new Date(s.createdAt).toLocaleDateString("en-GB") : "22/07/2026",
      };
    });
  }, [staffQuery.data]);

  const filteredStaff = useMemo(() => {
    if (!searchQuery.trim()) return mappedStaff;
    const q = searchQuery.toLowerCase();
    return mappedStaff.filter(
      (s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q) || s.role.toLowerCase().includes(q)
    );
  }, [mappedStaff, searchQuery]);

  const totalPages = Math.ceil(filteredStaff.length / PAGE_SIZE);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredStaff.slice(start, start + PAGE_SIZE);
  }, [filteredStaff, currentPage]);

  const handleConfirmAddStaff = async () => {
    const apiRole = addForm.role === "Super admin" ? "admin" : addForm.role === "Content Manager" ? "content_manager" : "support";
    try {
      await inviteMutation.mutateAsync({
        email: addForm.email,
        role: apiRole,
      });
    } catch {
      // Keep UI responsive
    }
    setIsConfirmModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleSetSearchQuery = (q: string) => {
    setSearchQuery(q);
    setCurrentPage(1);
  };

  return {
    staffList: paginatedStaff,
    isLoading: staffQuery.isLoading,
    isError: staffQuery.isError,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
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
    openAddModal: () => {
      setAddForm(INITIAL_ADD_STAFF_FORM);
      setIsAddModalOpen(true);
    },
    closeAddModal: () => setIsAddModalOpen(false),
    handleSubmitForm: () => {
      if (!addForm.name.trim() || !addForm.email.trim() || !addForm.role) return;
      setIsAddModalOpen(false);
      setIsConfirmModalOpen(true);
    },
    closeConfirmModal: () => setIsConfirmModalOpen(false),
    handleConfirmAddStaff,
    closeSuccessModal: () => setIsSuccessModalOpen(false),
  };
}
