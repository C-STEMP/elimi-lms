export type StorageAsset = {
  /** Durable reference — consuming features should persist this, not just the url. */
  assetId: string;
  url: string;
  provider: string;
  type: string;
  metadata?: {
    size?: number;
    mimeType?: string;
    width?: number;
    height?: number;
  };
};

export type GenericMessage = {
  message?: string;
};

export type UploadFileInput = {
  file: File;
  purpose?: string;
};

export type CreateUploadUrlInput = {
  fileName: string;
  mimeType: string;
  purpose: string;
};

export type UploadUrlResult = {
  uploadUrl: string;
  assetId: string;
  expiresAt: string;
};

export type ConfirmUploadInput = {
  assetId: string;
};

export type ResolveAssetsInput = {
  assetIds: string[];
};

export type ResolvedAsset = {
  assetId: string;
  url: string;
};

export type ResolveAssetsResult = {
  assets: ResolvedAsset[];
};
