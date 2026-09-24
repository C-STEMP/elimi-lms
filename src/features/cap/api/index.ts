import { capClient } from "@/shared/api/clients";
import type { Trade, TradeDetail, Unit, Sector } from "../types";

/**
 * List all sectors from CAP
 */
export async function getCapSectors(): Promise<Sector[]> {
  try {
    const res = await capClient.get("/sectors");
    const body = res?.data;
    const list = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    if (Array.isArray(list)) {
      return list;
    }
  } catch (err) {
    console.error("Failed to fetch sectors from CAP backend:", err);
  }
  return [];
}

/**
 * List trades for a specific sector from CAP
 */
export async function getCapTradesBySector(sectorId: string): Promise<Trade[]> {
  try {
    const res = await capClient.get(`/sectors/${sectorId}/trades`);
    const body = res?.data;
    const list = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    if (Array.isArray(list)) {
      return list;
    }
  } catch (err) {
    console.error(`Failed to fetch trades for sector ${sectorId}:`, err);
  }
  return [];
}

/**
 * List all trades across sectors from CAP
 */
export async function getCapTrades(): Promise<Trade[]> {
  // 1. Try direct /trades endpoint
  try {
    const res = await capClient.get("/trades");
    const body = res?.data;
    const list = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    if (Array.isArray(list) && list.length > 0) {
      return list;
    }
  } catch (err) {
    console.warn("Direct /trades fetch failed, attempting sector aggregation:", err);
  }

  // 2. Query via /sectors -> /sectors/:id/trades
  try {
    const sectors = await getCapSectors();
    if (Array.isArray(sectors) && sectors.length > 0) {
      const tradeArrays = await Promise.all(
        sectors.map((s) => getCapTradesBySector(s.id).catch(() => []))
      );
      const allTrades = tradeArrays.flat();
      const seen = new Set<string>();
      return allTrades.filter((t) => {
        const key = t.id || t.name;
        if (!key || seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
  } catch (err) {
    console.error("Failed to fetch trades via sectors from CAP backend:", err);
  }

  return [];
}

/**
 * Get a specific trade with its active NOS from CAP
 */
export async function getCapTradeDetail(tradeId: string): Promise<TradeDetail | null> {
  if (!tradeId) return null;
  try {
    const res = await capClient.get(`/trades/${tradeId}`);
    const body = res?.data;
    const item = (body && typeof body === "object" && "data" in body) ? body.data : body;
    if (item && item.id) {
      return item as TradeDetail;
    }
  } catch (err) {
    console.error(`Failed to fetch trade detail for ${tradeId}:`, err);
  }
  return null;
}

/**
 * List learning units for a trade (optionally filtered by level) from CAP
 */
export async function getCapTradeUnits(tradeId: string, level?: number): Promise<Unit[]> {
  if (!tradeId) return [];
  try {
    const query = level !== undefined && level !== null ? `?level=${level}` : "";
    const res = await capClient.get(`/trades/${tradeId}/units${query}`);
    const body = res?.data;
    const list = Array.isArray(body?.data) ? body.data : Array.isArray(body) ? body : [];
    if (Array.isArray(list)) {
      return list;
    }
  } catch (err) {
    console.error(`Failed to fetch units for trade ${tradeId}:`, err);
  }
  return [];
}
