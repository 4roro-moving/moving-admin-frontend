"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  answerAdminInquiry,
  closeAdminInquiry,
} from "@/lib/api/adminInquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AnswerAdminInquiryPayload } from "@/types/adminInquiry";

export function useAnswerAdminInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      inquiryId,
      payload,
    }: {
      inquiryId: number;
      payload: AnswerAdminInquiryPayload;
    }) => answerAdminInquiry(inquiryId, payload),

    onSuccess: (inquiry) => {
      queryClient.setQueryData(QUERY_KEYS.INQUIRIES.DETAIL(inquiry.id), inquiry);

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INQUIRIES.ALL,
      });
    },
  });
}

export function useCloseAdminInquiry() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (inquiryId: number) => closeAdminInquiry(inquiryId),

    onSuccess: (inquiry) => {
      queryClient.setQueryData(QUERY_KEYS.INQUIRIES.DETAIL(inquiry.id), inquiry);

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.INQUIRIES.ALL,
      });
    },
  });
}
