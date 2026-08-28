"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

export function useAdminListUrlFilters<
  T extends { keyword: string; page: number },
>(filters: T, buildQuery: (filters: T) => string) {
  const pathname = usePathname();
  const latestFiltersRef = useRef(filters);
  const pendingQueryRef = useRef<string | undefined>(undefined);
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const isKeywordDirtyRef = useRef(false);

  useEffect(() => {
    const query = buildQuery(filters);
    if (pendingQueryRef.current && pendingQueryRef.current !== query) return;
    pendingQueryRef.current = undefined;
    latestFiltersRef.current = filters;
    if (!isKeywordDirtyRef.current) setKeywordInput(filters.keyword);
  }, [buildQuery, filters]);

  const replaceFilters = useCallback(
    (patch: Partial<T>) => {
      const next = { ...latestFiltersRef.current, ...patch };
      const query = buildQuery(next);
      pendingQueryRef.current = query;
      latestFiltersRef.current = next;
      window.history.replaceState(
        null,
        "",
        query ? `${pathname}?${query}` : pathname,
      );
    },
    [buildQuery, pathname],
  );

  return {
    keywordInput,
    setKeywordInput: (value: string) => {
      isKeywordDirtyRef.current = true;
      setKeywordInput(value);
    },
    submitKeyword: () => {
      isKeywordDirtyRef.current = false;
      replaceFilters({ keyword: keywordInput.trim(), page: 1 } as Partial<T>);
    },
    clearKeyword: () => {
      isKeywordDirtyRef.current = false;
      setKeywordInput("");
      replaceFilters({ keyword: "", page: 1 } as Partial<T>);
    },
    replaceFilters,
  };
}
