import { orchestratorClient } from "@/shared/api/clients";
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

/** Small files and direct uploads (photos, logos, SCORM packages) — uploaded directly through Orchestrator. */
export function uploadFile({ file, purpose, onProgress }: UploadFileInput) {
  const formData = new FormData();
  formData.append("file", file);
  if (purpose) formData.append("purpose", purpose);
  return unwrapItem<StorageAsset>(
    orchestratorClient.post("/storage/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total && onProgress) {
          const percent = Math.min(
            99,
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
          onProgress(percent);
        }
      },
    })
  );
}

/** Large files (evidence docs, SCORM packages) — client uploads to uploadUrl, then confirms. */
export function createUploadUrl(input: CreateUploadUrlInput) {
  return unwrapItem<UploadUrlResult>(orchestratorClient.post("/storage/upload-url", input));
}

export function confirmUpload(input: ConfirmUploadInput) {
  return unwrapItem<StorageAsset>(orchestratorClient.post("/storage/confirm", input));
}

export function resolveAssets(input: ResolveAssetsInput) {
  return unwrapItem<ResolveAssetsResult>(orchestratorClient.post("/storage/resolve", input));
}

export function deleteAsset(assetId: string) {
  return unwrapItem<GenericMessage>(orchestratorClient.delete(`/storage/${assetId}`));
}
