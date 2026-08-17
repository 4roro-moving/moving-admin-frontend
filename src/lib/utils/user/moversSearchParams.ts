import type { AdminMoverListSort, AdminMoverStatus } from "@/types/adminMover";
import type { AdminProfileFilterValue } from "@/types/adminUser";
import {
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
  sorts: AdminMoverListSort[];
  page: number;
  limit: number;
}

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

function getSorts(params: SearchParamsInput): AdminMoverListSort[] {
  const values = params.sorts;
  const rawSorts = Array.isArray(values) ? values : values ? [values] : [];
  return rawSorts.filter(
    (sort, index): sort is AdminMoverListSort =>
      MOVER_LIST_SORTS.has(sort as AdminMoverListSort) &&
      rawSorts.indexOf(sort) === index,
  );
}

export function parseMoverListFilters(
  params: SearchParamsInput,
): MoverListFilters {
  const status = getSearchParam(params, "status");
  const profile = getSearchParam(params, "profile");
  return {
    keyword: getSearchParam(params, "keyword")?.trim() ?? "",
    status:
      status === "ACTIVE" || status === "SUSPENDED" || status === "WITHDRAWN"
        ? status
        : "ALL",
    profile:
      profile === "COMPLETED" || profile === "INCOMPLETE" ? profile : "ALL",
    fromDate: getSearchParam(params, "fromDate") ?? "",
    toDate: getSearchParam(params, "toDate") ?? "",
    sorts: getSorts(params),
    page: parsePositiveInteger(getSearchParam(params, "page"), 1),
    limit: parsePositiveInteger(getSearchParam(params, "limit"), 20, 100),
  };
}

export function buildMoverListQueryString(filters: MoverListFilters) {
  const params = new URLSearchParams();
  if (filters.keyword) {
    params.set("keyword", filters.keyword);
  }
  if (filters.status !== "ALL") {
    params.set("status", filters.status);
  }
  if (filters.profile !== "ALL") {
    params.set("profile", filters.profile);
  }
  if (filters.fromDate) {
    params.set("fromDate", filters.fromDate);
  }
  if (filters.toDate) {
    params.set("toDate", filters.toDate);
  }

  filters.sorts.forEach((sort) => params.append("sorts", sort));

  if (filters.page !== 1) {
    params.set("page", String(filters.page));
  }
  if (filters.limit !== 20) {
    params.set("limit", String(filters.limit));
  }

  return params.toString();
}
