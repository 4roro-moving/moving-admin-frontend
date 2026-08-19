/**
 * Next.js의 `searchParams`를 읽고 기본 타입으로 검증하는 유틸입니다.
 * 화면별 필터 규칙은 `user/listSearchParams.ts`에서 관리합니다.
 */
export type SearchParamsInput = Record<string, string | string[] | undefined>;

/** 반복 전달된 값은 첫 번째만 반환합니다. */
export function getSearchParam(
  searchParams: SearchParamsInput,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

/** 양의 정수인지 확인하고, 범위를 벗어나면 기본값을 반환합니다. */
export function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  maximum?: number,
): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) &&
    parsed >= 1 &&
    (!maximum || parsed <= maximum)
    ? parsed
    : fallback;
}
