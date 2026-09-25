"use client";

import React, { useState } from "react";
import { Modal } from "antd";
import { FiX, FiBriefcase, FiCheck } from "react-icons/fi";
import type { Trade } from "@/features/cap/types";

export interface AssignTradeModalProps {
  isOpen: boolean;
  slotNumber: number | null;
  availableTrades: Trade[];
  onClose: () => void;
  onAssign: (
    slotNumber: number,
    tradeId: string,
    customTitle?: string,
    customDesc?: string
  ) => void;
}

export const AssignTradeModal: React.FC<AssignTradeModalProps> = ({
  isOpen,
  slotNumber,
  availableTrades,
  onClose,
  onAssign,
}) => {
  const [selectedTradeId, setSelectedTradeId] = useState<string>("");
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");

  // Preselect the first trade while rendering when the modal opens or the list changes.
  const [prevDeps, setPrevDeps] = useState({ isOpen, availableTrades });
  if (prevDeps.isOpen !== isOpen || prevDeps.availableTrades !== availableTrades) {
    setPrevDeps({ isOpen, availableTrades });
    if (isOpen) {
      const first = availableTrades[0];
      setSelectedTradeId(first?.id || "");
      setCustomTitle(first?.name || "");
      setCustomDesc(first?.description || "");
    }
  }

  const handleTradeChange = (tradeId: string) => {
    setSelectedTradeId(tradeId);
    const trade = availableTrades.find((t) => t.id === tradeId);
    if (trade) {
      setCustomTitle(trade.name);
      setCustomDesc(trade.description || "");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotNumber || !selectedTradeId) return;
    onAssign(slotNumber, selectedTradeId, customTitle.trim(), customDesc.trim());
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={520}
      styles={{
        mask: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(36, 16, 20, 0.45)",
        },
        body: { padding: "1.75rem" },
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-solid/10 text-primary-solid flex items-center justify-center shrink-0">
            <FiBriefcase className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-primary">
              Assign Trade to Slot {slotNumber}
            </h2>
            <p className="text-xs text-neutral-secondary">
              Select an accredited trade directly from the CAP backend catalogue.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-neutral-secondary hover:text-neutral-primary p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
        >
          <FiX className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Select Trade (from CAP Backend)
          </label>
          {availableTrades.length === 0 ? (
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-neutral-secondary">
              No trades returned from CAP backend yet. Please check backend connection.
            </div>
          ) : (
            <select
              value={selectedTradeId}
              onChange={(e) => handleTradeChange(e.target.value)}
              className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors"
            >
              {availableTrades.map((trade) => (
                <option key={trade.id} value={trade.id}>
                  {trade.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Display Title
          </label>
          <input
            type="text"
            required
            value={customTitle}
            onChange={(e) => setCustomTitle(e.target.value)}
            placeholder="e.g. Electrical Installation, Maintenance and Repairs"
            className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            value={customDesc}
            onChange={(e) => setCustomDesc(e.target.value)}
            placeholder="Detailed description of the trade, practical applications, and industry skills..."
            className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors resize-none leading-relaxed"
          />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-neutral-secondary font-semibold text-xs transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!selectedTradeId || availableTrades.length === 0}
            className="py-2.5 px-5 rounded-xl bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
          >
            <FiCheck className="w-3.5 h-3.5" />
            <span>Confirm & Assign</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
