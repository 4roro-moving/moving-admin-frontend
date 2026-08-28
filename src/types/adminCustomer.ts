import type {
  AdminListApiQuery,
  AdminListApiSort,
  AdminListOpenFilter,
  AdminListResult,
  AdminListItemBase,
} from "@/types/adminUser";

export type AdminAuthProvider = "LOCAL" | "GOOGLE" | "NAVER" | "KAKAO";
export type AdminCustomerAuthProviderFilter = "ALL" | AdminAuthProvider;
export type AdminCustomerOpenFilter = AdminListOpenFilter | "provider";

export const ADMIN_AUTH_PROVIDERS = [
  "LOCAL",
  "GOOGLE",
  "NAVER",
  "KAKAO",
] as const satisfies readonly AdminAuthProvider[];

export interface AdminCustomerListItem extends AdminListItemBase {
  authProvider: AdminAuthProvider;
}

export interface AdminCustomerListQuery extends AdminListApiQuery<AdminListApiSort> {
  authProvider?: AdminAuthProvider;
}

export type AdminCustomerListResult = AdminListResult<AdminCustomerListItem>;
