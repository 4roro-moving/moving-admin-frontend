"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  createAdminTerms,
  deleteAdminTerms,
  publishAdminTerms,
  updateAdminTerms,
} from "@/lib/api/adminTerms";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type {
  CreateAdminTermsPayload,
  UpdateAdminTermsPayload,
} from "@/types/adminTerms";

export function useCreateAdminTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminTermsPayload) => createAdminTerms(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TERMS.ALL });
    },
  });
}

export function useUpdateAdminTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      termsId,
      payload,
    }: {
      termsId: number;
      payload: UpdateAdminTermsPayload;
    }) => updateAdminTerms(termsId, payload),

    onSuccess: (terms) => {
      queryClient.setQueryData(QUERY_KEYS.TERMS.DETAIL(terms.id), terms);

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TERMS.ALL });
    },
  });
}

/**
 * 게시.
 *
 * 서버가 같은 유형의 기존 게시본을 ARCHIVED 로 내리므로, 내 항목 하나만
 * 갱신하면 목록의 다른 행이 옛 상태로 남습니다. 목록 전체를 무효화합니다.
 */
export function usePublishAdminTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (termsId: number) => publishAdminTerms(termsId),

    onSuccess: (terms) => {
      queryClient.setQueryData(QUERY_KEYS.TERMS.DETAIL(terms.id), terms);

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TERMS.ALL });
    },
  });
}

export function useDeleteAdminTerms() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (termsId: number) => deleteAdminTerms(termsId),

    onSuccess: (_, termsId) => {
      queryClient.removeQueries({ queryKey: QUERY_KEYS.TERMS.DETAIL(termsId) });

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TERMS.ALL });
    },
  });
}
