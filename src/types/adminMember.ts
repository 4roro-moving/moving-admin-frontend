import type {
  AdminListApiQuery,
  AdminListApiSort,
  AdminListOpenFilter,
  AdminListResult,
  AdminListItemBase,
} from "@/types/adminUser";

export type AdminAuthProvider = "LOCAL" | "GOOGLE" | "NAVER" | "KAKAO";
export type AdminMemberAuthProviderFilter = "ALL" | AdminAuthProvider;
export type AdminMemberOpenFilter = AdminListOpenFilter | "provider";

export const ADMIN_AUTH_PROVIDERS = [
  "LOCAL",
  "GOOGLE",
  "NAVER",
  "KAKAO",
] as const satisfies readonly AdminAuthProvider[];

export interface AdminMemberListItem extends AdminListItemBase {
  authProvider: AdminAuthProvider;
}

export interface AdminMemberListQuery extends AdminListApiQuery<AdminListApiSort> {
  authProvider?: AdminAuthProvider;
}

export type AdminMemberListResult = AdminListResult<AdminMemberListItem>;
