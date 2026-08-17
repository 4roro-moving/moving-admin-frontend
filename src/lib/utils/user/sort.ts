export type SortDirection = "none" | "desc" | "asc";

export function getListSortDirection<TSort extends string>(
  sorts: readonly TSort[],
  descending: TSort,
  ascending: TSort,
): SortDirection {
  if (sorts.includes(descending)) return "desc";
  if (sorts.includes(ascending)) return "asc";
  return "none";
}

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
