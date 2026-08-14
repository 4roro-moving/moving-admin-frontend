import { createAdminListHook } from "@/hooks/createAdminListHook";
import {
  ADMIN_MEMBER_LIST_DEFAULT_LIMIT,
  fetchAdminMembers,
} from "@/lib/api/adminMembers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  AdminMemberListItem,
  AdminMemberListQuery,
} from "@/types/adminMember";

export const useAdminMembers = createAdminListHook<
  AdminMemberListQuery,
  AdminMemberListItem
>({
  defaultLimit: ADMIN_MEMBER_LIST_DEFAULT_LIMIT,
  fetchFn: fetchAdminMembers,
  queryKeyFn: QUERY_KEYS.MEMBERS.LIST,
});
