import type { TradeSlot, LevelItem, UnitCourseItem, Trade } from "./types";

export const TOTAL_CATALOGUE_SLOTS = 12;

/**
 * Creates 12 empty catalogue slots.
 * Slots are populated dynamically with real data fetched from the backend API.
 */
export function createInitialEmptySlots(): TradeSlot[] {
  return Array.from({ length: TOTAL_CATALOGUE_SLOTS }, (_, idx) => ({
    slotNumber: idx + 1,
    tradeId: null,
    name: "",
    description: "",
    status: "empty",
    levelsCount: 0,
    unitsCount: 0,
    hasImage: false,
  }));
}
