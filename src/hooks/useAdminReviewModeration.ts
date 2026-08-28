"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { hideAdminReview, unhideAdminReview } from "@/lib/api/adminReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReviewActionReasonPayload } from "@/types/adminReview";

interface HideVariables {
  reviewId: number;
  reason: string;
}

interface UnhideVariables {
  reviewId: number;
  reason?: string;
}

export function useAdminReviewModeration() {
  const queryClient = useQueryClient();

  const invalidateReviews = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REVIEWS.ALL });
    // REVIEW 숨김/복원은 MoverProfile 공개 통계와 대시보드 콘텐츠 집계를 즉시 갱신한다.
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MOVERS.ALL });
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DASHBOARD.ALL });
  };

  const hideMutation = useMutation({
    mutationFn: ({ reviewId, reason }: HideVariables) =>
      hideAdminReview(reviewId, { reason } satisfies AdminReviewActionReasonPayload),
    onSuccess: invalidateReviews,
  });

  const unhideMutation = useMutation({
    mutationFn: ({ reviewId, reason }: UnhideVariables) => {
      const trimmedReason = reason?.trim();
      return unhideAdminReview(
        reviewId,
        trimmedReason ? ({ reason: trimmedReason } satisfies AdminReviewActionReasonPayload) : undefined,
      );
    },
    onSuccess: invalidateReviews,
  });

  return {
    hideMutation,
    unhideMutation,
    isPending: hideMutation.isPending || unhideMutation.isPending,
  };
}
