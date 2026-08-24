"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  hideAdminResidenceReview,
  unhideAdminResidenceReview,
} from "@/lib/api/adminResidenceReviews";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminResidenceReviewHidePayload } from "@/types/adminResidenceReview";

interface HideVariables {
  residenceReviewId: number;
  reason: string;
}

interface UnhideVariables {
  residenceReviewId: number;
}

export function useAdminResidenceReviewModeration() {
  const queryClient = useQueryClient();

  const invalidateResidenceReviews = () => {
    void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RESIDENCE_REVIEWS.ALL });
  };

  const hideMutation = useMutation({
    mutationFn: ({ residenceReviewId, reason }: HideVariables) =>
      hideAdminResidenceReview(residenceReviewId, {
        reason,
      } satisfies AdminResidenceReviewHidePayload),
    onSuccess: invalidateResidenceReviews,
  });

  const unhideMutation = useMutation({
    mutationFn: ({ residenceReviewId }: UnhideVariables) =>
      unhideAdminResidenceReview(residenceReviewId),
    onSuccess: invalidateResidenceReviews,
  });

  return {
    hideMutation,
    unhideMutation,
    isPending: hideMutation.isPending || unhideMutation.isPending,
  };
}
