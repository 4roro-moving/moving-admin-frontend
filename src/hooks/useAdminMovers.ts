import { createAdminListHook } from "@/hooks/createAdminListHook";
import {
  ADMIN_MOVER_LIST_DEFAULT_LIMIT,
  fetchAdminMovers,
} from "@/lib/api/adminMovers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  AdminMoverListItem,
  AdminMoverListQuery,
} from "@/types/adminMover";

export const useAdminMovers = createAdminListHook<
  AdminMoverListQuery,
  AdminMoverListItem
>({
  defaultLimit: ADMIN_MOVER_LIST_DEFAULT_LIMIT,
  fetchFn: fetchAdminMovers,
  queryKeyFn: QUERY_KEYS.MOVERS.LIST,
});
