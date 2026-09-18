const PENDING_CHECKOUT_KEY = "elimi_pending_checkout";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export type PendingCheckout = {
  enrollmentId: string;
  courseId: string;
};

/**
 * Paystack's hosted checkout returns to a backend-configured callback_url
 * with its own reference param, not one we control — so which enrollment
 * this checkout was for has to survive the round trip via localStorage.
 */
export const checkoutStorage = {
  getPending(): PendingCheckout | null {
    if (!isBrowser()) return null;
    const raw = window.localStorage.getItem(PENDING_CHECKOUT_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PendingCheckout;
    } catch {
      return null;
    }
  },
  setPending(value: PendingCheckout): void {
    if (!isBrowser()) return;
    window.localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(value));
  },
  clearPending(): void {
    if (!isBrowser()) return;
    window.localStorage.removeItem(PENDING_CHECKOUT_KEY);
  },
};
