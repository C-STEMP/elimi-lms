import {
  createUploadUrl,
  confirmUpload,
  uploadFile,
} from "@/features/storage/api";

export type UploadProgressCallback = (percent: number) => void;

/**
 * Uploads payload using chunked streaming transmission to bypass Apache / reverse-proxy
 * request body size and buffer limitations, with real-time byte upload progress reporting.
 */
async function uploadPayloadChunked(
  uploadUrl: string,
  file: File,
  onProgress?: UploadProgressCallback
): Promise<void> {
  const totalBytes = file.size;
  let uploadedBytes = 0;

  // 1. Attempt chunked streaming transmission via Fetch API (duplex: "half")
  // Modern browsers send Transfer-Encoding: chunked when body is a ReadableStream.
  try {
    if (typeof ReadableStream !== "undefined" && typeof file.stream === "function") {
      const stream = file.stream();
      const progressStream = new TransformStream<Uint8Array, Uint8Array>({
        transform(chunk, controller) {
          uploadedBytes += chunk.byteLength;
          if (onProgress && totalBytes > 0) {
            const pct = Math.min(99, Math.round((uploadedBytes / totalBytes) * 100));
            onProgress(pct);
          }
          controller.enqueue(chunk);
        },
      });

      const chunkedBody = stream.pipeThrough(progressStream);

      const res = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/zip",
        },
        body: chunkedBody,
        // @ts-expect-error duplex is required by the Fetch standard for streaming bodies
        duplex: "half",
      });

      if (res.ok) {
        if (onProgress) onProgress(100);
        return;
      }

      console.warn(
        `Chunked fetch returned status ${res.status}. Falling back to chunked XHR upload...`
      );
    }
  } catch (streamErr) {
    console.warn(
      "Fetch stream chunking error or unsupported, falling back to XHR upload:",
      streamErr
    );
  }

  // 2. Fallback to XMLHttpRequest with byte-level progress reporting
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
        reject(
          new Error(
            `Presigned upload failed with HTTP ${xhr.status}: ${
              xhr.statusText || "Server Error"
            }`
          )
        );
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during SCORM package upload to cloud storage."));
    };

    xhr.ontimeout = () => {
      reject(new Error("Timeout during SCORM package upload."));
    };

    xhr.send(file);
  });
}

/**
 * Uploads a SCORM .zip package to Orchestrator storage using chunked payload submission.
 * 1. Obtains presigned upload URL from Orchestrator (/storage/upload-url).
 * 2. Transmits payload in chunked stream with real-time byte progress reporting.
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

    await uploadPayloadChunked(uploadInfo.uploadUrl, file, onProgress);

    const confirmed = await confirmUpload({ assetId: uploadInfo.assetId });
    return confirmed.assetId;
  } catch (err) {
    presignedError = err;
    console.error("Presigned chunked upload failed:", err);
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
