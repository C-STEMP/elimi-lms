import { orchestratorClient } from "@/shared/api/clients";
import { unwrapList } from "@/shared/api/response";
import type { Country, Lga, LgasQuery, State, StatesQuery } from "@/features/address/types";

export function getCountries() {
  return unwrapList<Country>(orchestratorClient.get("/address/countries"));
}

export function getStates(params: StatesQuery) {
  return unwrapList<State>(orchestratorClient.get("/address/states", { params }));
}

export function getLgas(params: LgasQuery) {
  return unwrapList<Lga>(orchestratorClient.get("/address/lgas", { params }));
}
