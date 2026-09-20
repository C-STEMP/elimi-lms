export interface PlatformConfigFormData {
  emailAddress: string;
  phoneNumber: string;
  termsText: string;
  termsFile: File | null;
  privacyText: string;
  privacyFile: File | null;
  refundText: string;
  refundFile: File | null;
}
