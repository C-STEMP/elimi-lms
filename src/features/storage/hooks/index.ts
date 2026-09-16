"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as storageApi from "@/features/storage/api";
import type {
  ConfirmUploadInput,
  CreateUploadUrlInput,
  UploadFileInput,
} from "@/features/storage/types";

export const storageKeys = {
  all: ["storage"] as const,
  resolved: (assetIds: string[]) => [...storageKeys.all, "resolved", assetIds] as const,
};

export function useUploadFile() {
  return useMutation({
    mutationFn: (input: UploadFileInput) => storageApi.uploadFile(input),
  });
}

export function useCreateUploadUrl() {
  return useMutation({
    mutationFn: (input: CreateUploadUrlInput) => storageApi.createUploadUrl(input),
  });
}

export function useConfirmUpload() {
  return useMutation({
    mutationFn: (input: ConfirmUploadInput) => storageApi.confirmUpload(input),
  });
}

/** Batch-resolve durable assetIds to current delivery URLs. */
export function useResolveAssets(assetIds: string[]) {
  return useQuery({
    queryKey: storageKeys.resolved(assetIds),
    queryFn: () => storageApi.resolveAssets({ assetIds }),
    enabled: assetIds.length > 0,
  });
}

export function useDeleteAsset() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (assetId: string) => storageApi.deleteAsset(assetId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: storageKeys.all });
    },
  });
}
