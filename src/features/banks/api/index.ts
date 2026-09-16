import { orchestratorClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type {
  Bank,
  BanksQuery,
  ResolveBankAccountInput,
  ResolvedBankAccount,
} from "@/features/banks/types";

export function getBanks(params?: BanksQuery) {
  return unwrapList<Bank>(orchestratorClient.get("/banks", { params }));
}

export function resolveBankAccount(input: ResolveBankAccountInput) {
  return unwrapItem<ResolvedBankAccount>(orchestratorClient.post("/banks/resolve", input));
}
