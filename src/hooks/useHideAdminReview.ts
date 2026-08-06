"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { hideAdminReview } from "@/lib/api/adminReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReviewActionReasonPayload } from "@/types/adminReview";

interface HideAdminReviewVariables {
  reviewId: number;
  reason: string;
}

export function useHideAdminReview() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, reason }: HideAdminReviewVariables) =>
      hideAdminReview(reviewId, { reason } satisfies AdminReviewActionReasonPayload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ALL });
    },
  });
}
