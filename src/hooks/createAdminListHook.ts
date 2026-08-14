"use client";

import {
  keepPreviousData,
  useQuery,
  useQueryClient,
  type QueryKey,
} from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

import type { AdminListQueryBase, AdminListResult } from "@/types/adminUser";

interface CreateAdminListHookOptions<TQuery extends AdminListQueryBase, TItem> {
  defaultLimit: number;
  fetchFn: (query: TQuery) => Promise<AdminListResult<TItem>>;
  queryKeyFn: (
    query: TQuery & { page: number; limit: number; keyword: string },
  ) => QueryKey;
}

/** 공통 React Query 목록 훅을 생성하는 팩토리입니다. */
export function createAdminListHook<TQuery extends AdminListQueryBase, TItem>({
  defaultLimit,
  fetchFn,
  queryKeyFn,
}: CreateAdminListHookOptions<TQuery, TItem>) {
  return function useAdminList(query: TQuery) {
    const page = query.page ?? 1;
    const limit = query.limit ?? defaultLimit;
    const keyword = query.keyword?.trim() ?? "";
    const queryClient = useQueryClient();

    // query 자체를 얕은 비교 대신 직렬화해서 의존성으로 사용
    // (movers의 regionId/moveType처럼 하위 훅마다 필드가 달라 개별 나열이 어려움)
    const serializedQuery = JSON.stringify({ ...query, page, limit, keyword });

    const normalizedQuery = useMemo(
      () =>
        ({ ...query, page, limit, keyword: keyword || undefined }) as TQuery,
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [serializedQuery],
    );

    const result = useQuery({
      queryKey: queryKeyFn({
        ...normalizedQuery,
        page,
        limit,
        keyword,
      } as TQuery & {
        page: number;
        limit: number;
        keyword: string;
      }),
      queryFn: () => fetchFn(normalizedQuery),
      placeholderData: keepPreviousData,
      staleTime: 30_000,
    });

    useEffect(() => {
      if (!result.data?.pagination.hasNext) return;

      const nextPage = page + 1;
      const nextQuery = { ...normalizedQuery, page: nextPage } as TQuery;

      void queryClient.prefetchQuery({
        queryKey: queryKeyFn({
          ...nextQuery,
          page: nextPage,
          limit,
          keyword,
        } as TQuery & {
          page: number;
          limit: number;
          keyword: string;
        }),
        queryFn: () => fetchFn(nextQuery),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [serializedQuery, queryClient, result.data?.pagination.hasNext]);

    return result;
  };
}
