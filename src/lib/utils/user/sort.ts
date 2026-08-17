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
  if (sorts.includes(descending)) {
    return sorts.map((sort) => (sort === descending ? ascending : sort));
  }
  if (sorts.includes(ascending)) {
    return sorts.filter((sort) => sort !== ascending);
  }
  return [...sorts, descending];
}

export function toggleRequiredListSort<TSort extends string>(
  sorts: readonly TSort[],
  descending: TSort,
  ascending: TSort,
): TSort[] {
  if (sorts.includes(ascending)) {
    return sorts.map((sort) => (sort === ascending ? descending : sort));
  }

  if (sorts.includes(descending)) {
    return sorts.map((sort) => (sort === descending ? ascending : sort));
  }

  return [...sorts, ascending];
}
