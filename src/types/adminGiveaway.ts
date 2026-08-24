import type { Pagination } from "@/types/pagination";

export type AdminGiveawaySort = "LATEST" | "OLDEST" | "REPORT_HIGH";

export type AdminGiveawayStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";

/** GET /api/admin/giveaways 쿼리. BE listAdminGiveawaysQuerySchema 와 맞춤 */
export interface AdminGiveawayListQuery {
  page?: number;
  limit?: number;
  keyword?: string;
  sort?: AdminGiveawaySort;
  isHidden?: boolean;
}

export interface AdminGiveawayAuthor {
  id: string;
  name: string;
  email: string;
}

export interface AdminGiveawayRegion {
  id: number;
  name: string;
}

export interface AdminGiveawayLatestModeration {
  action: "HIDE" | "UNHIDE";
  reason: string | null;
  adminName: string;
  createdAt: string;
}

/** 목록·숨김/복구 응답 data 한 건. BE AdminGiveawayListItem 의 JSON 형태 */
export interface AdminGiveawayItem {
  id: number;
  contentType: "GIVEAWAY";
  isHidden: boolean;
  status: AdminGiveawayStatus;
  title: string;
  description: string;
  author: AdminGiveawayAuthor;
  region: AdminGiveawayRegion | null;
  reportCount: number;
  latestModeration: AdminGiveawayLatestModeration | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminGiveawayListResult {
  items: AdminGiveawayItem[];
  pagination: Pagination;
}

/** POST .../hide body. BE hideGiveawayBodySchema 와 동일 */
export interface AdminGiveawayHidePayload {
  reason: string;
}
