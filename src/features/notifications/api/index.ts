import { orchestratorClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type {
  GenericMessage,
  Notification,
  NotificationPreferences,
  NotificationsQuery,
} from "@/features/notifications/types";

export function getNotifications(params: NotificationsQuery) {
  return unwrapList<Notification>(orchestratorClient.get("/notifications", { params }));
}

export function deleteAllNotifications(platform: string) {
  return unwrapItem<GenericMessage>(
    orchestratorClient.delete("/notifications", { params: { platform } })
  );
}

export function getUnreadCount(platform: string) {
  return unwrapItem<{ count: number }>(
    orchestratorClient.get("/notifications/unread-count", { params: { platform } })
  );
}

export function markAllRead(platform: string) {
  return unwrapItem<GenericMessage>(
    orchestratorClient.patch("/notifications/read-all", null, { params: { platform } })
  );
}

export function getNotificationPreferences() {
  return unwrapItem<NotificationPreferences>(
    orchestratorClient.get("/notifications/preferences")
  );
}

export function updateNotificationPreferences(input: NotificationPreferences) {
  return unwrapItem<NotificationPreferences>(
    orchestratorClient.put("/notifications/preferences", input)
  );
}

export function markNotificationRead(id: string) {
  return unwrapItem<GenericMessage>(orchestratorClient.patch(`/notifications/${id}/read`));
}

export function deleteNotification(id: string) {
  return unwrapItem<GenericMessage>(orchestratorClient.delete(`/notifications/${id}`));
}
