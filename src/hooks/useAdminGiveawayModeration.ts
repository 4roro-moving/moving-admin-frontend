"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { hideAdminGiveaway, unhideAdminGiveaway } from "@/lib/api/adminGiveaways";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminGiveawayHidePayload } from "@/types/adminGiveaway";

interface HideVariables {
  giveawayId: number;
  reason: string;
}

interface UnhideVariables {
  giveawayId: number;
}

export function useAdminGiveawayModeration() {
  const queryClient = useQueryClient();

  const invalidateGiveaways = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.GIVEAWAYS.ALL });
  };

  const hideMutation = useMutation({
    mutationFn: ({ giveawayId, reason }: HideVariables) =>
      hideAdminGiveaway(giveawayId, {
        reason,
      } satisfies AdminGiveawayHidePayload),
    onSuccess: invalidateGiveaways,
  });

  const unhideMutation = useMutation({
    mutationFn: ({ giveawayId }: UnhideVariables) => unhideAdminGiveaway(giveawayId),
    onSuccess: invalidateGiveaways,
  });

  return {
    hideMutation,
    unhideMutation,
    isPending: hideMutation.isPending || unhideMutation.isPending,
  };
}
