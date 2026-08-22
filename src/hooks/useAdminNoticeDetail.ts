"use client";

import { useQuery } from "@tanstack/react-query";

import { fetchAdminNotice } from "@/lib/api/adminNotices";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export function useAdminNoticeDetail(noticeId: number | null) {
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey:
      noticeId !== null
        ? QUERY_KEYS.NOTICES.DETAIL(noticeId)
        : ([...QUERY_KEYS.NOTICES.ALL, "detail"] as const),

    queryFn: () => {
      if (noticeId === null) {
        throw new Error("공지사항 ID가 없습니다.");
      }

      return fetchAdminNotice(noticeId);
    },

    enabled: isAuthenticated && noticeId !== null,
  });
}
