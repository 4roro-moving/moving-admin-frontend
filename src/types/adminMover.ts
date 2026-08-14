import type {
  AdminAccountStatus,
  AdminListApiQuery,
  AdminListApiSort,
  AdminListItemBase,
  AdminListOpenFilter,
  AdminListResult,
} from "@/types/adminUser";

export type AdminMoverStatus = AdminAccountStatus;
export type AdminMoverOpenFilter = AdminListOpenFilter;
export type AdminMoveType = "SMALL" | "HOME" | "OFFICE";
export type AdminMoverListSort =
  | AdminListApiSort
  | "CONFIRMED_DESC"
  | "CONFIRMED_ASC"
  | "RATING_DESC"
  | "RATING_ASC"
  | "CAREER_DESC"
  | "CAREER_ASC";

export interface AdminMoverListQuery extends AdminListApiQuery<AdminMoverListSort> {
  regionId?: number;
  moveType?: AdminMoveType;
}

export interface AdminMoverListItem extends AdminListItemBase {
  nickname: string | null;
  career: number | null;
  averageRating: number;
  reviewCount: number;
  confirmedCount: number;
  serviceAreas: string[];
  serviceTypes: AdminMoveType[];
}

export type AdminMoverListResult = AdminListResult<AdminMoverListItem>;
