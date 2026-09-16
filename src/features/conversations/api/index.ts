import { orchestratorClient } from "@/shared/api/clients";
import { unwrapItem, unwrapList } from "@/shared/api/response";
import type {
  ChatMessage,
  Conversation,
  ConversationDetail,
  ConversationsQuery,
  CreateConversationInput,
  MessagesQuery,
  SendMessageInput,
} from "@/features/conversations/types";

export function getConversations(params: ConversationsQuery) {
  return unwrapList<Conversation>(orchestratorClient.get("/conversations", { params }));
}

export function createConversation(input: CreateConversationInput) {
  return unwrapItem<ConversationDetail>(orchestratorClient.post("/conversations", input));
}

export function getMessages(conversationId: string, params?: MessagesQuery) {
  return unwrapList<ChatMessage>(
    orchestratorClient.get(`/conversations/${conversationId}/messages`, { params })
  );
}

export function sendMessage(conversationId: string, input: SendMessageInput) {
  return unwrapItem<ChatMessage>(
    orchestratorClient.post(`/conversations/${conversationId}/messages`, input)
  );
}
