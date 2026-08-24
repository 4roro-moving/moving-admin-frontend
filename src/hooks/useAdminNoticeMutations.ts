"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAdminNotice,
  deleteAdminNotice,
  updateAdminNotice,
} from "@/lib/api/adminNotices";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  CreateAdminNoticePayload,
  UpdateAdminNoticePayload,
} from "@/types/adminNotice";

export function useCreateAdminNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminNoticePayload) =>
      createAdminNotice(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTICES.ALL,
      });
    },
  });
}

export function useUpdateAdminNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      noticeId,
      payload,
    }: {
      noticeId: number;
      payload: UpdateAdminNoticePayload;
    }) => updateAdminNotice(noticeId, payload),

    onSuccess: (notice) => {
      queryClient.setQueryData(QUERY_KEYS.NOTICES.DETAIL(notice.id), notice);

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTICES.ALL,
      });
    },
  });
}

export function useDeleteAdminNotice() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noticeId: number) => deleteAdminNotice(noticeId),

    onSuccess: (_, noticeId) => {
      queryClient.removeQueries({
        queryKey: QUERY_KEYS.NOTICES.DETAIL(noticeId),
      });

      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.NOTICES.ALL,
      });
    },
  });
}
