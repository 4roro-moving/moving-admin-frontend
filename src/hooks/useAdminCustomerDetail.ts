"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminCustomerDetail } from "@/lib/api/adminCustomers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";

export function useAdminCustomerDetail(customerId: string | null) {
  return useQuery({
    queryKey: customerId
      ? QUERY_KEYS.CUSTOMERS.DETAIL(customerId)
      : QUERY_KEYS.CUSTOMERS.DETAIL_PLACEHOLDER,
    queryFn: () => {
      if (!customerId) {
        throw new Error("고객 ID가 필요합니다.");
      }

      return fetchAdminCustomerDetail(customerId);
    },
    enabled: Boolean(customerId),
  });
}
