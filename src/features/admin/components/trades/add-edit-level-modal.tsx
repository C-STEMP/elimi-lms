"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import { FiX, FiCheck, FiLayers } from "react-icons/fi";
import type { LevelItem } from "@/features/cap/types";

export interface AddEditLevelModalProps {
  isOpen: boolean;
  level: LevelItem | null;
  slotNumber: number | null;
  onClose: () => void;
  onSave: (levelNumber: number, title: string) => void;
}

export const AddEditLevelModal: React.FC<AddEditLevelModalProps> = ({
  isOpen,
  level,
  slotNumber,
  onClose,
  onSave,
}) => {
  const [levelNum, setLevelNum] = useState<number>(1);
  const [title, setTitle] = useState("");

  useEffect(() => {
    if (level) {
      setLevelNum(level.level);
      setTitle(level.title);
    } else {
      setLevelNum(1);
      setTitle("");
    }
  }, [level, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(levelNum, title.trim());
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      closable={false}
      footer={null}
      centered
      width={480}
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
          <div className="w-10 h-10 rounded-xl bg-[#75152b]/10 text-primary-solid flex items-center justify-center shrink-0">
            <FiLayers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-neutral-primary">
              {level ? "Edit Qualification Level" : "Add Qualification Level"}
            </h2>
            <p className="text-xs text-neutral-secondary">
              Configure NSQ level details for Trade Slot {slotNumber}.
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
            Level (NSQ Standard)
          </label>
          <select
            value={levelNum}
            disabled={Boolean(level)}
            onChange={(e) => setLevelNum(parseInt(e.target.value, 10))}
            className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors disabled:opacity-60"
          >
            {[1, 2, 3, 4, 5, 6, 7].map((num) => (
              <option key={num} value={num}>
                NSQ Level {num}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-neutral-primary mb-1.5">
            Level Title
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. NSQ Level 1 - Foundation Craft Practice"
            className="w-full bg-input-bg border border-gray-200/80 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-neutral-primary focus:bg-white focus:border-secondary focus:outline-none transition-colors"
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
            className="py-2.5 px-5 rounded-xl bg-primary-solid hover:bg-primary-hover active:scale-[0.98] text-white font-semibold text-xs transition-all shadow-2xs cursor-pointer flex items-center gap-1.5"
          >
            <FiCheck className="w-3.5 h-3.5" />
            <span>{level ? "Save Changes" : "Create Level"}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
