"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as notificationsApi from "@/features/notifications/api";
import type {
  NotificationPreferences,
  NotificationsQuery,
} from "@/features/notifications/types";

export const notificationKeys = {
  all: ["notifications"] as const,
  lists: () => [...notificationKeys.all, "list"] as const,
  list: (params: NotificationsQuery) => [...notificationKeys.lists(), params] as const,
  unreadCount: (platform: string) =>
    [...notificationKeys.all, "unreadCount", platform] as const,
  preferences: () => [...notificationKeys.all, "preferences"] as const,
};

export function useNotifications(params: NotificationsQuery) {
  return useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => notificationsApi.getNotifications(params),
  });
}

export function useUnreadCount(platform: string) {
  return useQuery({
    queryKey: notificationKeys.unreadCount(platform),
    queryFn: () => notificationsApi.getUnreadCount(platform),
    enabled: Boolean(platform),
  });
}

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationKeys.preferences(),
    queryFn: () => notificationsApi.getNotificationPreferences(),
  });
}

export function useUpdateNotificationPreferences() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: NotificationPreferences) =>
      notificationsApi.updateNotificationPreferences(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.preferences() });
    },
  });
}

export function useMarkNotificationRead(platform: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.markNotificationRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(platform) });
    },
  });
}

export function useMarkAllRead(platform: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.markAllRead(platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(platform) });
    },
  });
}

export function useDeleteNotification(platform: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationsApi.deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(platform) });
    },
  });
}

export function useDeleteAllNotifications(platform: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => notificationsApi.deleteAllNotifications(platform),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: notificationKeys.unreadCount(platform) });
    },
  });
}
