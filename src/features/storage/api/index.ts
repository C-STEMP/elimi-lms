import {
  orchestratorClient,
  orchestratorDirectClient,
  withDirectAuth,
} from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type {
  ConfirmUploadInput,
  CreateUploadUrlInput,
  GenericMessage,
  ResolveAssetsInput,
  ResolveAssetsResult,
  StorageAsset,
  UploadFileInput,
  UploadUrlResult,
} from "@/features/storage/types";

function postUpload(
  formData: FormData,
  accessToken: string,
  onProgress?: (percent: number) => void,
) {
  return unwrapItem<StorageAsset>(
    orchestratorDirectClient.post("/storage/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.min(
            99,
            Math.round((progressEvent.loaded * 100) / progressEvent.total),
          );
          onProgress(percent);
        }
      },
    }),
  );
}

export async function uploadFile({
  file,
  purpose,
  onProgress,
}: UploadFileInput) {
  const formData = new FormData();
  formData.append("file", file);
  if (purpose) formData.append("purpose", purpose);
  return withDirectAuth((accessToken) =>
    postUpload(formData, accessToken, onProgress),
  );
}

export function createUploadUrl(input: CreateUploadUrlInput) {
  return unwrapItem<UploadUrlResult>(
    orchestratorClient.post("/storage/upload-url", input),
  );
}

export function confirmUpload(input: ConfirmUploadInput) {
  return unwrapItem<StorageAsset>(
    orchestratorClient.post("/storage/confirm", input),
  );
}

export function resolveAssets(input: ResolveAssetsInput) {
  return unwrapItem<ResolveAssetsResult>(
    orchestratorClient.post("/storage/resolve", input),
  );
}

export function deleteAsset(assetId: string) {
  return unwrapItem<GenericMessage>(
    orchestratorClient.delete(`/storage/${assetId}`),
  );
}
