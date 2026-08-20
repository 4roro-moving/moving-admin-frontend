"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelAdminEstimate } from "@/lib/api/adminEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminEstimateCancellationPayload } from "@/types/adminEstimate";

interface CancelAdminEstimateVariables {
  customerId: string;
  estimateId: number;
  payload: AdminEstimateCancellationPayload;
}

export function useAdminEstimateCancellationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ estimateId, payload }: CancelAdminEstimateVariables) =>
      cancelAdminEstimate(estimateId, payload),
    onSuccess: async (_data, { customerId }) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.CUSTOMERS.DETAIL(customerId),
      });
    },
  });
}
