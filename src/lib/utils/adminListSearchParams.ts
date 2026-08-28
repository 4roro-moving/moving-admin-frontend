export function parsePositivePageParam(
  value: string | null,
  fallback = 1,
): number {
  if (!value) {
    return fallback;
  }

  const numeric = Number(value);

  if (!Number.isInteger(numeric) || numeric <= 0) {
    return fallback;
  }

  return numeric;
}

export function parseBooleanSearchParam(
  value: string | null,
): boolean | undefined {
  if (value === "true") {
    return true;
  }

  if (value === "false") {
    return false;
  }

  return undefined;
}

export function parseKeywordSearchParam(value: string | null): string {
  return value?.trim() ?? "";
}

export function buildUpdatedSearchParams(
  searchParams: { toString(): string },
  updates: Record<string, string | null | undefined>,
) {
  const nextParams = new URLSearchParams(searchParams.toString());

  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      nextParams.delete(key);
      return;
    }

    nextParams.set(key, value);
  });

  return nextParams;
}
