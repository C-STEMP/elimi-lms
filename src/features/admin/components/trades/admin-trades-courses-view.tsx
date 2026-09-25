"use client";

import React from "react";
import { AdminHeader } from "../overview/admin-header";
import { AdminTradesListView } from "./admin-trades-list-view";
import { TradeLevelsView } from "./trade-levels-view";
import { CourseUnitsView } from "./course-units-view";
import { AddEditLevelModal } from "./add-edit-level-modal";
import { AddEditUnitModal } from "./add-edit-unit-modal";
import { UploadCoursesZipModal } from "./upload-courses-zip-modal";
import { ConfirmDialog } from "./confirm-dialog";
import { useAdminTrades } from "../../hooks/use-admin-trades";

export const AdminTradesCoursesView: React.FC = () => {
  const {
    activeTradeId,
    activeLevelNumber,
    activeTrade,
    activeLevel,
    currentLevels,
    currentUnits,

    capTrades,
    isSubmitting,

    handleSelectTrade,
    handleSelectLevel,
    handleBackToTrades,
    handleBackToLevels,

    isAddLevelModalOpen,
    editingLevel,
    openAddLevelModal,
    openEditLevelModal,
    closeAddLevelModal,
    handleSaveLevel,

    isDeleteLevelConfirmOpen,
    deletingLevel,
    openDeleteLevelConfirm,
    closeDeleteLevelConfirm,
    handleConfirmDeleteLevel,

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
    handleConfirmDeleteUnit,

    isUploadZipModalOpen,
    openUploadZipModal,
    closeUploadZipModal,
    handleUploadZipPackage,

    isLoadingCapTrades,
    isCapTradesError,
    refetchCapTrades,
  } = useAdminTrades();

  return (
    <div className="flex-1 flex flex-col gap-4 pb-8">
      <AdminHeader title="Trades & Courses" />

      {activeTradeId === null && (
        <AdminTradesListView
          trades={capTrades}
          isLoading={isLoadingCapTrades}
          isError={isCapTradesError}
          onRefresh={refetchCapTrades}
          onSelectTrade={handleSelectTrade}
        />
      )}

      {activeTradeId !== null && activeLevelNumber === null && activeTrade && (
        <TradeLevelsView
          trade={activeTrade}
          levels={currentLevels}
          onBackToTrades={handleBackToTrades}
          onManageUnits={handleSelectLevel}
          onAddLevel={openAddLevelModal}
          onEditLevel={openEditLevelModal}
          onDeleteLevel={openDeleteLevelConfirm}
        />
      )}

      {activeTradeId !== null &&
        activeLevelNumber !== null &&
        activeTrade &&
        activeLevel && (
          <CourseUnitsView
            trade={activeTrade}
            level={activeLevel}
            units={currentUnits}
            onBackToLevels={handleBackToLevels}
            onAddUnitManually={openAddUnitModal}
            onUploadZip={openUploadZipModal}
            onEditUnit={openEditUnitModal}
            onDeleteUnit={openDeleteUnitConfirm}
          />
        )}

      <AddEditLevelModal
        isOpen={isAddLevelModalOpen}
        level={editingLevel}
        slotNumber={null}
        onClose={closeAddLevelModal}
        onSave={handleSaveLevel}
      />

      <AddEditUnitModal
        isOpen={isAddUnitModalOpen}
        unit={editingUnit}
        tradeName={activeTrade?.name}
        levelNumber={activeLevelNumber || editingUnit?.levelNumber || null}
        isSubmitting={isSubmitting}
        onClose={closeAddUnitModal}
        onSave={handleSaveUnit}
      />

      <UploadCoursesZipModal
        isOpen={isUploadZipModalOpen}
        tradeName={activeTrade?.name}
        levelNumber={activeLevelNumber}
        isSubmitting={isSubmitting}
        onClose={closeUploadZipModal}
        onUpload={handleUploadZipPackage}
      />

      <ConfirmDialog
        isOpen={isDeleteLevelConfirmOpen}
        title="Delete Level?"
        description={`Are you sure you want to delete ${deletingLevel?.title}? All configured units under this level will also be affected.`}
        confirmLabel="Yes, Delete Level"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteLevel}
        onCancel={closeDeleteLevelConfirm}
      />

      <ConfirmDialog
        isOpen={isDeleteUnitConfirmOpen}
        title="Delete Course Unit?"
        description={`Are you sure you want to delete ${deletingUnit?.title}?`}
        confirmLabel="Yes, Delete Unit"
        cancelLabel="Cancel"
        onConfirm={handleConfirmDeleteUnit}
        onCancel={closeDeleteUnitConfirm}
      />
    </div>
  );
};
