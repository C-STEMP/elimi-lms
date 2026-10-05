import axios from "axios";
import { orchestratorClient, orchestratorDirectClient } from "@/shared/api/clients";
import { unwrapItem } from "@/shared/api/response";
import type { ApiError } from "@/shared/types";
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

async function getAccessToken(forceRefresh = false): Promise<string> {
  const res = await axios.get<{ data: { accessToken: string } }>(
    `/api/auth/access-token${forceRefresh ? "?refresh=1" : ""}`,
  );
  return res.data.data.accessToken;
}

function postUpload(formData: FormData, accessToken: string, onProgress?: (percent: number) => void) {
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
            Math.round((progressEvent.loaded * 100) / progressEvent.total)
          );
          onProgress(percent);
        }
      },
    })
  );
}

/**
 * Small files and uploads (photos, logos, SCORM packages) — sent straight from the browser to
 * Orchestrator /storage/upload (not via /api/proxy). Retries once with a refreshed token on 401.
 */
export async function uploadFile({ file, purpose, onProgress }: UploadFileInput) {
  const formData = new FormData();
  formData.append("file", file);
  if (purpose) formData.append("purpose", purpose);
  try {
    return await postUpload(formData, await getAccessToken(), onProgress);
  } catch (err) {
    if ((err as Partial<ApiError> | null)?.status !== 401) throw err;
    return postUpload(formData, await getAccessToken(true), onProgress);
  }
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
