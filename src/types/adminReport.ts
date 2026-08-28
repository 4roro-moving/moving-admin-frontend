import type { Pagination } from "@/types/pagination";

export type AdminReportStatus = "PENDING" | "RESOLVED" | "REJECTED";

export type AdminReportTargetType =
  | "CUSTOMER"
  | "REVIEW"
  | "MOVER"
  | "RESIDENCE_REVIEW"
  | "GIVEAWAY";

export type AdminReportSort = "LATEST" | "OLDEST";

export type AdminReportReason =
  | "SPAM"
  | "ABUSE"
  | "FALSE_INFO"
  | "INAPPROPRIATE"
  | "PRIVACY"
  | "OTHER";

export interface AdminReportListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: AdminReportStatus | "ALL";
  targetType?: AdminReportTargetType | "ALL";
  reason?: AdminReportReason | "ALL";
  sort?: AdminReportSort;
}

export interface AdminReportReporter {
  id: string;
  name: string;
  email: string;
  role: "CUSTOMER" | "MOVER" | "ADMIN";
}

export interface AdminReportHandler {
  id: string;
  name: string;
  email: string;
}

export interface AdminReportImageItem {
  id: number;
  imageUrl: string;
}

export interface AdminReviewReportTarget {
  type: "REVIEW";
  id: number;
  rating: number;
  content: string;
  isHidden: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  mover: {
    id: string;
    name: string;
    nickname: string | null;
  };
}

export interface AdminMoverReportTarget {
  type: "MOVER";
  id: string;
  name: string;
  email: string;
  nickname: string | null;
  isActive: boolean;
}

export interface AdminCustomerReportTarget {
  type: "CUSTOMER";
  id: string;
  name: string;
  email: string;
  imageUrl: string | null;
  isActive: boolean;
}

export interface AdminResidenceReviewReportTarget {
  type: "RESIDENCE_REVIEW";
  id: number;
  title: string;
  content: string;
  rating: number;
  isHidden: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  region: {
    id: number;
    name: string;
  };
}

export interface AdminGiveawayReportTarget {
  type: "GIVEAWAY";
  id: number;
  title: string;
  description: string;
  status: "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";
  isHidden: boolean;
  createdAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
  region: {
    id: number;
    name: string;
  } | null;
  images: {
    id: number;
    imageKey: string;
    sortOrder: number;
  }[];
}

export type AdminReportTarget =
  | AdminReviewReportTarget
  | AdminMoverReportTarget
  | AdminCustomerReportTarget
  | AdminResidenceReviewReportTarget
  | AdminGiveawayReportTarget;

export interface AdminReportListItem {
  id: number;
  targetType: AdminReportTargetType;
  targetId: string;
  status: AdminReportStatus;
  reason: AdminReportReason;
  detail: string | null;
  createdAt: string;
  updatedAt: string;
  reporter: AdminReportReporter;
  handler: AdminReportHandler | null;
  handlerNote: string | null;
  handledAt: string | null;
}

export interface AdminReportDetail extends AdminReportListItem {
  target: AdminReportTarget | null;
  images: AdminReportImageItem[];
}

export interface AdminReportListResult {
  items: AdminReportListItem[];
  pagination: Pagination;
}

export interface AdminReportSummary {
  totalCount: number;
  pendingCount: number;
  resolvedCount: number;
  rejectedCount: number;
}

export interface AdminReportModerationPayload {
  status: Extract<AdminReportStatus, "RESOLVED" | "REJECTED">;
  handlerNote: string;
}
