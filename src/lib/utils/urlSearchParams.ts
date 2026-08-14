export type SearchParamsInput = Record<string, string | string[] | undefined>;

export function getSearchParam(
  searchParams: SearchParamsInput,
  key: string,
): string | undefined {
  const value = searchParams[key];
  return Array.isArray(value) ? value[0] : value;
}

export function parsePositiveInteger(
  value: string | undefined,
  fallback: number,
  maximum?: number,
): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && (!maximum || parsed <= maximum)
    ? parsed
    : fallback;
}

/**
 * 필터 객체를 쿼리스트링으로 직렬화.
 * defaults와 값이 같은 필드는 생략, serialize로 커스텀 변환 가능.
 */
export function buildQueryString<T extends object>(
  filters: T,
  defaults: T,
  serialize: Partial<{
    [K in keyof T]: (value: T[K]) => string | undefined;
  }> = {},
): string {
  const params = new URLSearchParams();

  (Object.keys(defaults) as Array<keyof T>).forEach((key) => {
    const value = filters[key];
    if (value === defaults[key] || value === undefined || value === "") return;

    const custom = serialize[key];
    const stringValue = custom ? custom(value) : String(value);
    if (stringValue) {
      params.set(key as string, stringValue);
    }
  });

  return params.toString();
}
