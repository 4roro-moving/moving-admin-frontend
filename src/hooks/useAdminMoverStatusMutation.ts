"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateAdminMoverStatus } from "@/lib/api/adminMovers";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminAccountStatusUpdatePayload } from "@/types/adminUser";

interface UpdateMoverStatusVariables {
  moverId: string;
  payload: AdminAccountStatusUpdatePayload;
}

export function useAdminMoverStatusMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ moverId, payload }: UpdateMoverStatusVariables) =>
      updateAdminMoverStatus(moverId, payload),
    onSuccess: async (_data, { moverId }) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MOVERS.DETAIL(moverId),
      });
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MOVERS.ALL });
    },
  });
}
