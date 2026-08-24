import type { AdminListResult } from "@/types/adminUser";

export type AdminInquiryCategory =
  | "SUSPENSION_APPEAL"
  | "ACCOUNT"
  | "SERVICE"
  | "ETC";

export type AdminInquiryStatus = "OPEN" | "ANSWERED" | "CLOSED";

export interface AdminInquiryListItem {
  id: number;
  category: AdminInquiryCategory;
  title: string;
  status: AdminInquiryStatus;
  handledBy: string | null;
  closedAt: string | null;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminInquiryParticipant {
  id: string;
  name: string;
}

export interface AdminInquiryMessage {
  id: number;
  senderId: string;
  content: string;
  isAdmin: boolean;
  isRead: boolean;
  createdAt: string;
  sender: AdminInquiryParticipant;
}

export interface AdminInquiryDetail extends AdminInquiryListItem {
  authorId: string;
  author: AdminInquiryParticipant;
  handler: AdminInquiryParticipant | null;
  messages: AdminInquiryMessage[];
}

export interface AdminInquiryListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: AdminInquiryStatus;
  openOnly?: boolean;
}

export type AdminInquiryListResult = AdminListResult<AdminInquiryListItem>;

export interface AnswerAdminInquiryPayload {
  content: string;
}
