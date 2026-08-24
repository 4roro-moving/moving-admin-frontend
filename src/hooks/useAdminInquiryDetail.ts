"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminInquiry } from "@/lib/api/adminInquiries";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export function useAdminInquiryDetail(inquiryId: number | null) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey:
      inquiryId !== null
        ? QUERY_KEYS.INQUIRIES.DETAIL(inquiryId)
        : ([...QUERY_KEYS.INQUIRIES.ALL, "detail"] as const),

    queryFn: () => {
      if (inquiryId === null) {
        throw new Error("문의 ID가 없습니다.");
      }

      return fetchAdminInquiry(inquiryId);
    },

    enabled: isAuthenticated && inquiryId !== null,
  });
}
