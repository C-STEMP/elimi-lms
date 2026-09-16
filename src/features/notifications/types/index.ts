import type { PaginationParams } from "@/shared/types";

export type NotificationChannel = "email" | "in_app" | "sms";
export type NotificationStatus = "pending" | "sent" | "failed" | "read";

export type Notification = {
  id: string;
  platform: string;
  channel: NotificationChannel;
  templateId?: string;
  payload?: Record<string, unknown>;
  status: NotificationStatus;
  readAt?: string | null;
  sentAt?: string | null;
  createdAt: string;
};

export type NotificationPreferences = {
  email: boolean;
  in_app: boolean;
  sms: boolean;
};

export type NotificationsQuery = PaginationParams & {
  platform: string;
};

export type GenericMessage = {
  message?: string;
};
