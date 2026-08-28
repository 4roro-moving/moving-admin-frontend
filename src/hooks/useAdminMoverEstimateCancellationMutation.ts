"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { cancelAdminEstimate } from "@/lib/api/adminEstimates";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminEstimateCancellationPayload } from "@/types/adminEstimate";

interface CancelMoverEstimateVariables {
  moverId: string;
  customerId: string;
  estimateId: number;
  payload: AdminEstimateCancellationPayload;
}

export function useAdminMoverEstimateCancellationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ estimateId, payload }: CancelMoverEstimateVariables) =>
      cancelAdminEstimate(estimateId, payload),
    onSuccess: async (_data, { moverId, customerId }) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.MOVERS.DETAIL(moverId),
        }),
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.CUSTOMERS.DETAIL(customerId),
        }),
      ]);
    },
  });
}
