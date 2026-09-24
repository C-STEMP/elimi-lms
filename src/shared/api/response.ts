import type { AxiosResponse } from "axios";
import type { ApiList, ApiSuccess } from "@/shared/types";

export async function unwrapItem<T>(
  request: Promise<AxiosResponse<ApiSuccess<T> | T>>
): Promise<T> {
  const { data } = await request;
  if (data && typeof data === "object" && "data" in data && (data as { data: unknown }).data !== undefined) {
    return (data as { data: T }).data;
  }
  return data as T;
}

export async function unwrapList<T>(
  request: Promise<AxiosResponse<ApiList<T>>>
): Promise<ApiList<T>> {
  const { data } = await request;
  return data;
}
