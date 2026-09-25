import {
  createUploadUrl,
  confirmUpload,
  uploadFile,
} from "@/features/storage/api";
import type { StorageAsset } from "@/features/storage/types";
import type { ApiError } from "@/shared/types";

export type UploadProgressCallback = (percent: number) => void;

/**
   * Client-side cap for SCORM zips. Packages of 115MB+ exist, so this sits well above them.
   * The effective limit is whatever Orchestrator / the storage provider accepts.
   */
export const MAX_SCORM_PACKAGE_MB = 200;

/** Cloudinary rejects single requests over 100MB; chunks must be at least 5MB (except the last). */
const CLOUDINARY_CHUNK_BYTES = 20 * 1024 * 1024;

function isCloudinaryUrl(uploadUrl: string): boolean {
  try {
    return new URL(uploadUrl).hostname.endsWith("cloudinary.com");
  } catch {
    return false;
  }
}

function cloudinaryErrorReason(xhr: XMLHttpRequest): string {
  // Cloudinary puts the reason in the JSON body and the x-cld-error header.
  let reason = xhr.getResponseHeader("x-cld-error") || "";
  try {
    reason = JSON.parse(xhr.responseText)?.error?.message || reason;
  } catch {
    // non-JSON body — keep the header / status text
  }
  return reason || xhr.statusText || "Server Error";
}

type SendOptions = {
  method: "PUT" | "POST";
  body: XMLHttpRequestBodyInit;
  headers?: Record<string, string>;
  onBytes?: (loaded: number) => void;
};

function send(uploadUrl: string, file: File, { method, body, headers, onBytes }: SendOptions) {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, uploadUrl, true);
    Object.entries(headers ?? {}).forEach(([key, value]) => xhr.setRequestHeader(key, value));

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onBytes) onBytes(event.loaded);
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(
          new Error(
            `Cloud storage rejected the upload (HTTP ${xhr.status}): ${cloudinaryErrorReason(xhr)}`
          )
        );
      }
    };

    xhr.onerror = () => {
      // An early 4xx while the body is still streaming makes the provider drop the
      // connection — the browser only reports that as a network error.
      reject(
        new Error(
          `Cloud storage closed the connection while uploading this ${(file.size / 1024 / 1024).toFixed(
            1
          )} MB package. Please check your connection and try again.`
        )
      );
    };

    xhr.ontimeout = () => {
      reject(new Error("Timeout during SCORM package upload."));
    };

    xhr.send(body);
  });
}

/**
 * Sends the file to the signed URL from /storage/upload-url.
 * Cloudinary signed URLs (…/upload?api_key=…&signature=…) only accept a multipart POST
 * with a `file` field — a raw PUT is answered with a 400. The file goes up in chunks
 * (X-Unique-Upload-Id + Content-Range) so large packages stay under the per-request cap.
 * Any other provider gets a plain presigned PUT.
 */
async function uploadPayload(
  uploadUrl: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<void> {
  // Hold at 99 — 100 is reported once Orchestrator confirms the asset.
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
  for (let start = 0; start < file.size || start === 0; start += CLOUDINARY_CHUNK_BYTES) {
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

/** Confirm polling: first retry after 2s, backing off to 5s, giving up after 5 minutes. */
const CONFIRM_INITIAL_DELAY_MS = 2_000;
const CONFIRM_MAX_DELAY_MS = 5_000;
const CONFIRM_TIMEOUT_MS = 5 * 60_000;

/** Statuses meaning "the provider hasn't finished processing yet" — keep polling. */
const CONFIRM_RETRY_STATUSES = new Set([202, 404, 409, 423, 425, 429]);

function isRetryableConfirmError(err: unknown): boolean {
  const status = (err as Partial<ApiError> | null)?.status;
  // null status = the request never got a response (network blip) — worth retrying too.
  if (status === null || status === undefined) return true;
  return CONFIRM_RETRY_STATUSES.has(status) || status >= 500;
}

function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error) return err.message;
  const message = (err as Partial<ApiError> | null)?.message;
  return typeof message === "string" && message ? message : fallback;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Polls /storage/confirm until Orchestrator reports the asset ready (returns it with a url).
 * Large packages are processed asynchronously after the PUT, so the first confirm may
 * answer "not found / not ready" for a while.
 */
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
          "Please try again in a few minutes."
        )}`
      );
    }
    await sleep(delay);
    delay = Math.min(CONFIRM_MAX_DELAY_MS, Math.round(delay * 1.5));
  }
}

/**
 * Uploads a SCORM .zip package to Orchestrator storage via the signed-URL route.
 * 1. Obtains a signed upload URL from Orchestrator (/storage/upload-url).
 * 2. Sends the file to that URL (chunked multipart POST for Cloudinary) with byte progress.
 * 3. Polls /storage/confirm until the asset is processed.
 *
 * The direct /storage/upload route is only used if a signed URL can't be issued at all —
 * large packages routinely fail through it with network errors, and once the PUT has
 * started, re-sending the whole file would only mask the real failure.
 */
export async function uploadScormPackage(
  file: File,
  onProgress?: UploadProgressCallback
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
    console.error("Could not get a signed upload URL, falling back to direct upload:", err);
    try {
      const directAsset = await uploadFile({ file, purpose: "lms_scorm_package" });
      if (onProgress) onProgress(100);
      return directAsset.assetId;
    } catch (directErr) {
      throw new Error(
        errorMessage(
          directErr,
          "Failed to upload SCORM package. Please check your network connection and try again."
        )
      );
    }
  }

  await uploadPayload(uploadInfo.uploadUrl, file, onProgress);

  try {
    const confirmed = await pollConfirmUpload(uploadInfo.assetId);
    if (onProgress) onProgress(100);
    return confirmed.assetId;
  } catch (err) {
    throw new Error(errorMessage(err, "Failed to confirm the SCORM package upload."));
  }
}
