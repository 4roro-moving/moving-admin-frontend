export type SortDirection = "none" | "desc" | "asc";

export function nextSortDirection(direction: SortDirection): SortDirection {
  return direction === "none" ? "desc" : direction === "desc" ? "asc" : "none";
}
