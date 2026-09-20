import {
  createUploadUrl,
  confirmUpload,
  uploadFile,
} from "@/features/storage/api";

/**
 * Uploads a SCORM .zip package to Orchestrator storage.
 * Attempts presigned URL upload first; falls back to direct upload.
 */
export async function uploadScormPackage(file: File): Promise<string> {
  try {
    const uploadInfo = await createUploadUrl({
      fileName: file.name,
      mimeType: file.type || "application/zip",
      purpose: "lms_scorm_package",
    });

    const uploadRes = await fetch(uploadInfo.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type || "application/zip",
      },
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload to presigned URL failed: ${uploadRes.status}`);
    }

    const confirmed = await confirmUpload({ assetId: uploadInfo.assetId });
    return confirmed.assetId;
  } catch {
    const directAsset = await uploadFile({
      file,
      purpose: "lms_scorm_package",
    });
    return directAsset.assetId;
  }
}
