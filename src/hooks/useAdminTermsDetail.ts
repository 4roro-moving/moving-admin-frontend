"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminTerms } from "@/lib/api/adminTerms";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

/**
 * 약관 상세.
 *
 * 목록 응답에는 본문(content)이 없으므로, 편집기를 열 때 이 훅으로 따로 가져옵니다.
 */
export function useAdminTermsDetail(termsId: number | null) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey:
      termsId !== null
        ? QUERY_KEYS.TERMS.DETAIL(termsId)
        : ([...QUERY_KEYS.TERMS.ALL, "detail"] as const),

    queryFn: () => {
      if (termsId === null) {
        throw new Error("약관 ID가 없습니다.");
      }

      return fetchAdminTerms(termsId);
    },

    enabled: isAuthenticated && termsId !== null,
  });
}
