import type { PaginationParams } from "@/shared/types";

export type ConversationKind = "direct" | "group" | "broadcast";
export type NotifyChannel = "in_app" | "email" | "sms";

export type ChatMessage = {
  id: string;
  conversationId: string;
  authorUserId: string;
  body: string;
  createdAt: string;
};

export type Conversation = {
  id: string;
  platform: string;
  kind: ConversationKind;
  title?: string | null;
  createdByUserId: string;
  createdAt: string;
  participantUserIds: string[];
  lastMessage?: ChatMessage;
};

export type ConversationDetail = Conversation & {
  messages: ChatMessage[];
};

export type ConversationsQuery = PaginationParams & {
  platform: string;
  kind?: ConversationKind;
};

export type MessagesQuery = PaginationParams;

export type CreateConversationInput = {
  platform: string;
  kind?: ConversationKind;
  title?: string;
  /** Other Orchestrator user ids — do not include the caller. */
  participantUserIds: string[];
  body: string;
  notify?: { channels?: NotifyChannel[] };
};

export type SendMessageInput = {
  body: string;
  notify?: { channels?: NotifyChannel[] };
};
