import {
  createUploadUrl,
  confirmUpload,
  uploadFile,
} from "@/features/storage/api";

export type UploadProgressCallback = (percent: number) => void;

/**
 * Client-side cap for SCORM zips. Packages of 115MB+ exist, so this sits well above them.
 * The effective limit is whatever Orchestrator / the storage provider accepts.
 */
export const MAX_SCORM_PACKAGE_MB = 200;

/**
 * PUTs the file to the presigned storage URL with byte-level progress reporting.
 * Uses XHR rather than a streaming fetch body: streamed request bodies need HTTP/2,
 * and Cloudinary's upload endpoint negotiates HTTP/1.1 (ERR_ALPN_NEGOTIATION_FAILED).
 */
function uploadPayload(
  uploadUrl: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", uploadUrl, true);
    xhr.setRequestHeader("Content-Type", file.type || "application/zip");

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress && event.total > 0) {
        const pct = Math.min(99, Math.round((event.loaded / event.total) * 100));
        onProgress(pct);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        if (onProgress) onProgress(100);
        resolve();
      } else {
        // Cloudinary puts the reason in the JSON body and the x-cld-error header.
        let reason = xhr.getResponseHeader("x-cld-error") || "";
        try {
          reason = JSON.parse(xhr.responseText)?.error?.message || reason;
        } catch {
          // non-JSON body — keep the header / status text
        }
        reject(
          new Error(
            `Cloud storage rejected the upload (HTTP ${xhr.status}): ${
              reason || xhr.statusText || "Server Error"
            }`
          )
        );
      }
    };

    xhr.onerror = () => {
      // Cloudinary answers an over-limit file with a 400 while the body is still streaming,
      // then drops the connection — the browser only reports that as a network error.
      reject(
        new Error(
          `Cloud storage closed the connection while uploading this ${(file.size / 1024 / 1024).toFixed(
            1
          )} MB package. This usually means the file is larger than the storage account allows.`
        )
      );
    };

    xhr.ontimeout = () => {
      reject(new Error("Timeout during SCORM package upload."));
    };

    xhr.send(file);
  });
}

/**
 * Uploads a SCORM .zip package to Orchestrator storage.
 * 1. Obtains presigned upload URL from Orchestrator (/storage/upload-url).
 * 2. PUTs the file to that URL with real-time byte progress reporting.
 * 3. Confirms upload with Orchestrator (/storage/confirm).
 */
export async function uploadScormPackage(
  file: File,
  onProgress?: UploadProgressCallback
): Promise<string> {
  let presignedError: unknown = null;
  try {
    const uploadInfo = await createUploadUrl({
      fileName: file.name,
      mimeType: file.type || "application/zip",
      purpose: "lms_scorm_package",
    });

    await uploadPayload(uploadInfo.uploadUrl, file, onProgress);

    const confirmed = await confirmUpload({ assetId: uploadInfo.assetId });
    return confirmed.assetId;
  } catch (err) {
    presignedError = err;
    console.error("Presigned upload failed:", err);
  }

  // Fallback: direct upload through Orchestrator (for smaller packages or if presigned URL is unavailable)
  try {
    console.info("Attempting direct upload fallback...");
    const directAsset = await uploadFile({
      file,
      purpose: "lms_scorm_package",
    });
    if (onProgress) onProgress(100);
    return directAsset.assetId;
  } catch (directErr) {
    console.error("Direct upload fallback also failed:", directErr);
    const finalErr = presignedError || directErr;
    throw finalErr instanceof Error
      ? finalErr
      : new Error(
          "Failed to upload SCORM package. Please check your network connection and try again."
        );
  }
}
