import type { Pagination } from "@/types/pagination";
import type {
  AdminReportReason,
  AdminReportStatus,
  AdminReportTargetType,
} from "@/types/adminReport";

export type AdminAccountStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN";

export interface AdminAccountStatusUpdatePayload {
  action: "SUSPEND" | "RELEASE";
  reason: string;
  internalNote?: string;
}

export interface AdminAccountStatusUpdateResult {
  id: string;
  status: Exclude<AdminAccountStatus, "WITHDRAWN">;
  suspension: {
    id: number;
    action: AdminAccountStatusUpdatePayload["action"];
    reason: string;
    adminId: string;
    createdAt: string;
  };
}

export interface AdminSuspensionHistory {
  totalCount: number;
  items: Array<{
    id: number;
    action: AdminAccountStatusUpdatePayload["action"];
    reason: string;
    internalNote: string | null;
    createdAt: string;
    admin: {
      id: string;
      name: string;
    };
  }>;
}

export interface AdminReportHistoryItem {
  id: number;
  reason: AdminReportReason;
  status: AdminReportStatus;
  createdAt: string;
}

export interface AdminTargetReportHistoryItem extends AdminReportHistoryItem {
  targetType: AdminReportTargetType;
  targetId: string;
}

export interface AdminReportHistory<
  TItem extends AdminReportHistoryItem = AdminReportHistoryItem,
> {
  totalCount: number;
  items: TItem[];
}

export type AdminTargetReportHistory =
  AdminReportHistory<AdminTargetReportHistoryItem>;

export type AdminInquiryCategory = "SUSPENSION_APPEAL" | (string & {});
export type AdminInquiryStatus = "OPEN" | "CLOSED" | (string & {});

export interface AdminInquiryHistory {
  totalCount: number;
  openCount: number;
  items: Array<{
    id: number;
    category: AdminInquiryCategory;
    title: string;
    status: AdminInquiryStatus;
    lastMessageAt: string;
    createdAt: string;
    handledBy: {
      id: string;
      name: string;
    } | null;
  }>;
}
export type AdminProfileFilterValue = "ALL" | "COMPLETED" | "INCOMPLETE";
export type AdminListOpenFilter =
  | "status"
  | "profile"
  | "date"
  | "limit"
  | null;

export type AdminListApiSort =
  | "PENDING_DESC"
  | "PENDING_ASC"
  | "OPEN_INQUIRY_DESC"
  | "OPEN_INQUIRY_ASC"
  | "CREATED_AT_DESC"
  | "CREATED_AT_ASC";

export const ADMIN_STATUS_LABEL: Record<AdminAccountStatus, string> = {
  ACTIVE: "활성",
  SUSPENDED: "정지",
  WITHDRAWN: "탈퇴",
};

export const ADMIN_STATUS_CLASS: Record<AdminAccountStatus, string> = {
  ACTIVE:
    "bg-status-active-background text-status-active-foreground ring-status-active-ring",
  SUSPENDED:
    "bg-status-suspended-background text-status-suspended-foreground ring-status-suspended-ring",
  WITHDRAWN: "bg-background-hover text-text-subtle ring-border",
};

export interface AdminListItemBase {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  status: AdminAccountStatus;
  isProfileCompleted: boolean;
  receivedReportCount: number;
  pendingReceivedReportCount: number;
  openInquiryCount: number;
  createdAt: string;
}

export interface AdminListQueryBase {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: AdminAccountStatus;
  isProfileCompleted?: boolean;
  fromDate?: string;
  toDate?: string;
}

export interface AdminListApiQuery<
  TSort extends string = AdminListApiSort,
> extends Omit<AdminListQueryBase, "sort"> {
  sorts?: TSort[];
}

export interface AdminListResult<TItem> {
  items: TItem[];
  pagination: Pagination;
}
