export type Bank = {
  id: number;
  name: string;
  slug: string;
  /** Paystack bank code — pass this, not the display name, to resolve. */
  code: string;
  type: string;
  currency: string;
  country: string;
};

export type ResolvedBankAccount = {
  accountName: string;
};

export type ResolveBankAccountInput = {
  accountNumber: string;
  bankCode: string;
};

export type BanksQuery = {
  /** Paystack country name convention, e.g. "nigeria", "ghana". Defaults to "nigeria". */
  country?: string;
};
