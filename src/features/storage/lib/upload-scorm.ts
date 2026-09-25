import {
  createUploadUrl,
  confirmUpload,
  uploadFile,
} from "@/features/storage/api";
import type { StorageAsset } from "@/features/storage/types";
import type { ApiError } from "@/shared/types";

export type UploadProgressCallback = (percent: number) => void;
export const MAX_SCORM_PACKAGE_MB = 200;

const CLOUDINARY_CHUNK_BYTES = 20 * 1024 * 1024;

function isCloudinaryUrl(uploadUrl: string): boolean {
  try {
    return new URL(uploadUrl).hostname.endsWith("cloudinary.com");
  } catch {
    return false;
  }
}

function cloudinaryErrorReason(xhr: XMLHttpRequest): string {
  let reason = "";
  try {
    reason = JSON.parse(xhr.responseText)?.error?.message || "";
  } catch {
    // non-JSON body — fall back to the status text
  }
  return reason || xhr.statusText || "Server Error";
}

type SendOptions = {
  method: "PUT" | "POST";
  body: XMLHttpRequestBodyInit;
  headers?: Record<string, string>;
  onBytes?: (loaded: number) => void;
};

function send(
  uploadUrl: string,
  file: File,
  { method, body, headers, onBytes }: SendOptions,
) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, uploadUrl, true);
    Object.entries(headers ?? {}).forEach(([key, value]) =>
      xhr.setRequestHeader(key, value),
    );

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onBytes) onBytes(event.loaded);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(
            `Cloud storage rejected the upload (HTTP ${xhr.status}): ${cloudinaryErrorReason(xhr)}`,
          ),
        );
      }
    };

    xhr.onerror = () => {
      reject(
        new Error(
          `Cloud storage closed the connection while uploading this ${(
            file.size /
            1024 /
            1024
          ).toFixed(
            1,
          )} MB package. Please check your connection and try again.`,
        ),
      );
    };

    xhr.ontimeout = () => {
      reject(new Error("Timeout during SCORM package upload."));
    };

    xhr.send(body);
  });
}

async function uploadPayload(
  uploadUrl: string,
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<void> {
  const report = (loaded: number) => {
    if (onProgress && file.size > 0) {
      onProgress(Math.min(99, Math.round((loaded / file.size) * 100)));
    }
  };

  if (!isCloudinaryUrl(uploadUrl)) {
    await send(uploadUrl, file, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type || "application/zip" },
      onBytes: report,
    });
    return;
  }

  const uploadId = crypto.randomUUID();
  for (
    let start = 0;
    start < file.size || start === 0;
    start += CLOUDINARY_CHUNK_BYTES
  ) {
    const end = Math.min(start + CLOUDINARY_CHUNK_BYTES, file.size);
    const formData = new FormData();
    formData.append("file", file.slice(start, end), file.name);
    await send(uploadUrl, file, {
      method: "POST",
      body: formData,
      headers: {
        "X-Unique-Upload-Id": uploadId,
        "Content-Range": `bytes ${start}-${Math.max(end - 1, 0)}/${file.size}`,
      },
      onBytes: (loaded) => report(start + Math.min(loaded, end - start)),
    });
    if (end >= file.size) break;
  }
}

const CONFIRM_INITIAL_DELAY_MS = 2_000;
const CONFIRM_MAX_DELAY_MS = 5_000;
const CONFIRM_TIMEOUT_MS = 5 * 60_000;

const CONFIRM_RETRY_STATUSES = new Set([202, 404, 409, 423, 425, 429]);

function isRetryableConfirmError(err: unknown): boolean {
  const status = (err as Partial<ApiError> | null)?.status;
  if (status === null || status === undefined) return true;
  return CONFIRM_RETRY_STATUSES.has(status) || status >= 500;
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  const message = (err as Partial<ApiError> | null)?.message;
  return typeof message === "string" && message ? message : fallback;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function pollConfirmUpload(assetId: string): Promise<StorageAsset> {
  const deadline = Date.now() + CONFIRM_TIMEOUT_MS;
  let delay = CONFIRM_INITIAL_DELAY_MS;
  let lastError: unknown = null;

  while (true) {
    try {
      const asset = await confirmUpload({ assetId });
      if (asset?.assetId && asset.url) return asset;
    } catch (err) {
      if (!isRetryableConfirmError(err)) throw err;
      lastError = err;
    }

    if (Date.now() + delay > deadline) {
      throw new Error(
        `The package uploaded, but storage did not finish processing it in time. ${errorMessage(
          lastError,
          "Please try again in a few minutes.",
        )}`,
      );
    }
    await sleep(delay);
    delay = Math.min(CONFIRM_MAX_DELAY_MS, Math.round(delay * 1.5));
  }
}

export async function uploadScormPackage(
  file: File,
  onProgress?: UploadProgressCallback,
): Promise<string> {
  const mimeType = file.type || "application/zip";

  let uploadInfo;
  try {
    uploadInfo = await createUploadUrl({
      fileName: file.name,
      mimeType,
      purpose: "lms_scorm_package",
    });
  } catch (err) {
    console.error(
      "Could not get a signed upload URL, falling back to direct upload:",
      err,
    );
    try {
      const directAsset = await uploadFile({
        file,
        purpose: "lms_scorm_package",
      });
      if (onProgress) onProgress(100);
      return directAsset.assetId;
    } catch (directErr) {
      throw new Error(
        errorMessage(
          directErr,
          "Failed to upload SCORM package. Please check your network connection and try again.",
        ),
      );
    }
  }

  await uploadPayload(uploadInfo.uploadUrl, file, onProgress);

  try {
    const confirmed = await pollConfirmUpload(uploadInfo.assetId);
    if (onProgress) onProgress(100);
    return confirmed.assetId;
  } catch (err) {
    throw new Error(
      errorMessage(err, "Failed to confirm the SCORM package upload."),
    );
  }
}
