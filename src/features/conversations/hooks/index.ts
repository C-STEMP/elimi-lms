"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as conversationsApi from "@/features/conversations/api";
import type {
  ConversationsQuery,
  CreateConversationInput,
  MessagesQuery,
  SendMessageInput,
} from "@/features/conversations/types";

export const conversationKeys = {
  all: ["conversations"] as const,
  lists: () => [...conversationKeys.all, "list"] as const,
  list: (params: ConversationsQuery) => [...conversationKeys.lists(), params] as const,
  messages: (conversationId: string) =>
    [...conversationKeys.all, conversationId, "messages"] as const,
  messageList: (conversationId: string, params?: MessagesQuery) =>
    [...conversationKeys.messages(conversationId), params ?? {}] as const,
};

export function useConversations(params: ConversationsQuery) {
  return useQuery({
    queryKey: conversationKeys.list(params),
    queryFn: () => conversationsApi.getConversations(params),
  });
}

/** Callers own their own polling interval via the query's `refetchInterval` option. */
export function useMessages(conversationId: string, params?: MessagesQuery) {
  return useQuery({
    queryKey: conversationKeys.messageList(conversationId, params),
    queryFn: () => conversationsApi.getMessages(conversationId, params),
    enabled: Boolean(conversationId),
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateConversationInput) =>
      conversationsApi.createConversation(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}

export function useSendMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SendMessageInput) =>
      conversationsApi.sendMessage(conversationId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: conversationKeys.messages(conversationId) });
      queryClient.invalidateQueries({ queryKey: conversationKeys.lists() });
    },
  });
}
