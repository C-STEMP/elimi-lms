import type { AxiosResponse } from "axios";
import type { ApiList, ApiSuccess } from "@/shared/types";

export async function unwrapItem<T>(
  request: Promise<AxiosResponse<ApiSuccess<T>>>
): Promise<T> {
  const { data } = await request;
  return data.data;
}

export async function unwrapList<T>(
  request: Promise<AxiosResponse<ApiList<T>>>
): Promise<ApiList<T>> {
  const { data } = await request;
  return data;
}
