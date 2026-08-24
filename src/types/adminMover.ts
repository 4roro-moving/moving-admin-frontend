import type {
  AdminListApiQuery,
  AdminListApiSort,
  AdminListItemBase,
  AdminListResult,
} from "@/types/adminUser";

export type AdminMoveType = "SMALL" | "HOME" | "OFFICE";

export const ADMIN_MOVER_REGION_OPTIONS = [
  { label: "서울", value: 1 },
  { label: "부산", value: 2 },
  { label: "대구", value: 3 },
  { label: "인천", value: 4 },
  { label: "광주", value: 5 },
  { label: "대전", value: 6 },
  { label: "울산", value: 7 },
  { label: "세종", value: 8 },
  { label: "경기", value: 9 },
  { label: "강원", value: 10 },
  { label: "충북", value: 11 },
  { label: "충남", value: 12 },
  { label: "전북", value: 13 },
  { label: "전남", value: 14 },
  { label: "경북", value: 15 },
  { label: "경남", value: 16 },
  { label: "제주", value: 17 },
] as const;

export const ADMIN_MOVER_MOVE_TYPE_OPTIONS = [
  { label: "소형/원룸 이사", value: "SMALL" },
  { label: "가정 이사", value: "HOME" },
  { label: "사무실 이사", value: "OFFICE" },
] as const satisfies ReadonlyArray<{ label: string; value: AdminMoveType }>;
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
