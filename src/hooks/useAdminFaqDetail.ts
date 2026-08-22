"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminFaq } from "@/lib/api/adminFaqs";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export function useAdminFaqDetail(faqId: number | null) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey:
      faqId !== null
        ? QUERY_KEYS.FAQS.DETAIL(faqId)
        : ([...QUERY_KEYS.FAQS.ALL, "detail"] as const),

    queryFn: () => {
      if (faqId === null) {
        throw new Error("FAQ ID가 없습니다.");
      }

      return fetchAdminFaq(faqId);
    },

    enabled: isAuthenticated && faqId !== null,
  });
}
