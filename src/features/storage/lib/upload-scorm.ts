import { uploadFile } from "@/features/storage/api";
import type { ApiError } from "@/shared/types";

export type UploadProgressCallback = (percent: number) => void;

/**
 * Client-side cap for SCORM zips. Packages of 115MB+ exist, so this sits well above them.
 * The effective limit is whatever Orchestrator / the storage provider accepts.
 */
export const MAX_SCORM_PACKAGE_MB = 200;

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  const message = (err as Partial<ApiError> | null)?.message;
  return typeof message === "string" && message ? message : fallback;
}

/**
 * Uploads a SCORM .zip package to Orchestrator storage using direct multipart /storage/upload.
 */
export async function uploadScormPackage(
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<string> {
  try {
    const asset = await uploadFile({
      file,
      purpose: "lms_scorm_package",
      onProgress,
    });
    if (onProgress) onProgress(100);
    return asset.assetId;
  } catch (err) {
    throw new Error(
      errorMessage(
        err,
        "Failed to upload SCORM package. Please check your network connection and try again.",
      ),
    );
  }
}
