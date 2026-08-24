"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAdminFaq,
  deleteAdminFaq,
  updateAdminFaq,
} from "@/lib/api/adminFaqs";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  CreateAdminFaqPayload,
  UpdateAdminFaqPayload,
} from "@/types/adminFaq";

export function useCreateAdminFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminFaqPayload) => createAdminFaq(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FAQS.ALL,
      });
    },
  });
}

export function useUpdateAdminFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      faqId,
      payload,
    }: {
      faqId: number;
      payload: UpdateAdminFaqPayload;
    }) => updateAdminFaq(faqId, payload),

    onSuccess: (faq) => {
      queryClient.setQueryData(QUERY_KEYS.FAQS.DETAIL(faq.id), faq);

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FAQS.ALL,
      });
    },
  });
}

export function useDeleteAdminFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (faqId: number) => deleteAdminFaq(faqId),

    onSuccess: (_, faqId) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.FAQS.DETAIL(faqId),
      });

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FAQS.ALL,
      });
    },
  });
}
