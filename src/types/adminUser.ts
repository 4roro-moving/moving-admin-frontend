import type { Pagination } from "@/types/pagination";

export type AdminAccountStatus = "ACTIVE" | "SUSPENDED" | "WITHDRAWN";
export type AdminListSort = "LATEST" | "OLDEST";
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
  sort?: AdminListSort;
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
