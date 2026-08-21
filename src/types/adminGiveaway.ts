import type { Pagination } from "@/types/pagination";

export type AdminGiveawaySort = "LATEST" | "OLDEST" | "REPORT_HIGH";

export type AdminGiveawayStatus = "AVAILABLE" | "IN_PROGRESS" | "COMPLETED";

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
