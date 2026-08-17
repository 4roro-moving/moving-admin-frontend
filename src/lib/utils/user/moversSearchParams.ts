import type { AdminMoverListSort } from "@/types/adminMover";
import {
  createAdminListSearchParams,
  parseAdminListSearchFilters,
  type AdminListSearchFilters,
} from "./listSearchParams";
import type { SearchParamsInput } from "@/lib/utils/urlSearchParams";

export type MoverListFilters = AdminListSearchFilters<AdminMoverListSort>;

export const MOVER_LIST_DEFAULTS: MoverListFilters = {
  keyword: "",
  status: "ALL",
  profile: "ALL",
  fromDate: "",
  toDate: "",
  sorts: [],
  page: 1,
  limit: 20,
};

const MOVER_LIST_SORTS = new Set<AdminMoverListSort>([
  "PENDING_DESC",
  "PENDING_ASC",
  "CONFIRMED_DESC",
  "CONFIRMED_ASC",
  "RATING_DESC",
  "RATING_ASC",
  "CAREER_DESC",
  "CAREER_ASC",
  "CREATED_AT_DESC",
  "CREATED_AT_ASC",
]);

export function parseMoverListFilters(
  params: SearchParamsInput,
): MoverListFilters {
  return parseAdminListSearchFilters(params, MOVER_LIST_SORTS);
}

export function buildMoverListQueryString(filters: MoverListFilters) {
  return createAdminListSearchParams(filters).toString();
}
