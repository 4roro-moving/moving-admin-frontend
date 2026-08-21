"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAdminCustomerStatus } from "@/lib/api/adminCustomers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminCustomerStatusUpdatePayload } from "@/types/adminCustomerDetail";

interface UpdateCustomerStatusVariables {
  customerId: string;
  payload: AdminCustomerStatusUpdatePayload;
}

export function useAdminCustomerStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ customerId, payload }: UpdateCustomerStatusVariables) =>
      updateAdminCustomerStatus(customerId, payload),
    onSuccess: async (_data, { customerId }) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CUSTOMERS.DETAIL(customerId),
      });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CUSTOMERS.ALL });
    },
  });
}
