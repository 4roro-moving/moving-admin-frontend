import type { AdminListResult } from "@/types/adminUser";

export type NoticeAudience = "ALL" | "CUSTOMER" | "MOVER";

export interface AdminNotice {
  id: number;
  title: string;
  content: string;
  audience: NoticeAudience;
  isPinned: boolean;
  isVisible: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNoticeListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  audience?: NoticeAudience;
  isVisible?: boolean;
}

export type AdminNoticeListResult = AdminListResult<AdminNotice>;

export interface CreateAdminNoticePayload {
  title: string;
  content: string;
  audience: NoticeAudience;
  isPinned: boolean;
  isVisible: boolean;
  sendNotification: boolean;
}

export interface UpdateAdminNoticePayload {
  title?: string;
  content?: string;
  audience?: NoticeAudience;
  isPinned?: boolean;
  isVisible?: boolean;
}
