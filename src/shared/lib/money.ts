import type { Money } from "@/shared/types";

export function formatMoney(money: Money): string {
  const amount = Number(money.amountMinorUnits) / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: money.currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${money.currency} ${amount.toLocaleString()}`;
  }
}

export function isFree(money: Money): boolean {
  return Number(money.amountMinorUnits) <= 0;
}
