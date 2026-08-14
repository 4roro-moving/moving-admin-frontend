import type { AdminMoverStatus } from "@/types/adminMover";
import type { AdminProfileFilterValue } from "@/types/adminUser";
import {
  buildQueryString,
  getSearchParam,
  parsePositiveInteger,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export type MoverProfileFilter = AdminProfileFilterValue;

export interface MoverListFilters {
  keyword: string;
  status: "ALL" | AdminMoverStatus;
  profile: MoverProfileFilter;
  fromDate: string;
  toDate: string;
  sort:
    | "LATEST"
    | "OLDEST"
    | "PENDING_DESC"
    | "PENDING_ASC"
    | "CONFIRMED_DESC"
    | "CONFIRMED_ASC"
    | "RATING_DESC"
    | "RATING_ASC"
    | "CAREER_DESC"
    | "CAREER_ASC";
  page: number;
  limit: number;
}

export const MOVER_LIST_DEFAULTS: MoverListFilters = {
  keyword: "", status: "ALL", profile: "ALL", fromDate: "", toDate: "", sort: "LATEST", page: 1, limit: 20,
};

export function parseMoverListFilters(params: SearchParamsInput): MoverListFilters {
  const status = getSearchParam(params, "status");
  const profile = getSearchParam(params, "profile");
  const sort = getSearchParam(params, "sort");
  return {
    keyword: getSearchParam(params, "keyword")?.trim() ?? "",
    status: status === "ACTIVE" || status === "SUSPENDED" || status === "WITHDRAWN" ? status : "ALL",
    profile: profile === "COMPLETED" || profile === "INCOMPLETE" ? profile : "ALL",
    fromDate: getSearchParam(params, "fromDate") ?? "",
    toDate: getSearchParam(params, "toDate") ?? "",
    sort:
      sort === "OLDEST" ||
      sort === "PENDING_DESC" ||
      sort === "PENDING_ASC" ||
      sort === "CONFIRMED_DESC" ||
      sort === "CONFIRMED_ASC" ||
      sort === "RATING_DESC" ||
      sort === "RATING_ASC" ||
      sort === "CAREER_DESC" ||
      sort === "CAREER_ASC"
        ? sort
        : "LATEST",
    page: parsePositiveInteger(getSearchParam(params, "page"), 1),
    limit: parsePositiveInteger(getSearchParam(params, "limit"), 20, 100),
  };
}

export function buildMoverListQueryString(filters: MoverListFilters) {
  return buildQueryString(filters, MOVER_LIST_DEFAULTS);
}
