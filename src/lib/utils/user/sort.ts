/** 정렬 화살표가 표현하는 상태입니다. */
export type SortDirection = "none" | "desc" | "asc";

/** 특정 열의 현재 정렬 방향을 반환합니다. */
export function getListSortDirection<TSort extends string>(
  sorts: readonly TSort[],
  descending: TSort,
  ascending: TSort,
): SortDirection {
  if (sorts.includes(descending)) return "desc";
  if (sorts.includes(ascending)) return "asc";
  return "none";
}

/** 기본 정렬 값이 없는 열: 내림차순 → 오름차순 → 해제 순으로 전환하며, 해제되지 않는 한  최근 조작한 정렬이 1순위로 이동합니다. */
export function toggleListSort<TSort extends string>(
  sorts: readonly TSort[],
  descending: TSort,
  ascending: TSort,
): TSort[] {
  const remainingSorts = sorts.filter(
    (sort) => sort !== descending && sort !== ascending,
  );

  if (sorts.includes(descending)) {
    return [ascending, ...remainingSorts];
  }
  if (sorts.includes(ascending)) {
    return remainingSorts;
  }
  return [descending, ...remainingSorts];
}

/** 기본 정렬 값이 있는 열(예: 가입일): 해제 없이 내림차순 ↔ 오름차순만 전환하며, 항상 최근 조작한 정렬이 1순위가 됩니다. */
export function toggleRequiredListSort<TSort extends string>(
  sorts: readonly TSort[],
  descending: TSort,
  ascending: TSort,
): TSort[] {
  const remainingSorts = sorts.filter(
    (sort) => sort !== descending && sort !== ascending,
  );

  if (sorts.includes(ascending)) {
    return [descending, ...remainingSorts];
  }

  if (sorts.includes(descending)) {
    return [ascending, ...remainingSorts];
  }

  return [ascending, ...remainingSorts];
}
