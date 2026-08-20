import { createAdminListHook } from "@/hooks/createAdminListHook";
import {
  ADMIN_CUSTOMER_LIST_DEFAULT_LIMIT,
  fetchAdminCustomers,
} from "@/lib/api/adminCustomers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  AdminCustomerListItem,
  AdminCustomerListQuery,
} from "@/types/adminCustomer";

export const useAdminCustomers = createAdminListHook<
  AdminCustomerListQuery,
  AdminCustomerListItem
>({
  defaultLimit: ADMIN_CUSTOMER_LIST_DEFAULT_LIMIT,
  fetchFn: fetchAdminCustomers,
  queryKeyFn: QUERY_KEYS.CUSTOMERS.LIST,
});
