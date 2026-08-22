import type { AdminListResult } from "@/types/adminUser";

export interface AdminFaq {
  id: number;
  question: string;
  answer: string;
  sortOrder: number;
  isVisible: boolean;
  authorId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminFaqListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  isVisible?: boolean;
}

export type AdminFaqListResult = AdminListResult<AdminFaq>;

export interface CreateAdminFaqPayload {
  question: string;
  answer: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface UpdateAdminFaqPayload {
  question?: string;
  answer?: string;
  sortOrder?: number;
  isVisible?: boolean;
}
