import {
  ADMIN_MOVER_REGION_OPTIONS,
  type AdminMoveType,
  type AdminMoverListSort,
} from "@/types/adminMover";
import {
  createAdminListSearchParams,
  parseAdminListSearchFilters,
  type AdminListSearchFilters,
} from "./listSearchParams";
import {
  getSearchParam,
  parsePositiveInteger,
  type SearchParamsInput,
} from "@/lib/utils/urlSearchParams";

export interface MoverListFilters
  extends AdminListSearchFilters<AdminMoverListSort> {
  regionId: number | null;
  moveType: "ALL" | AdminMoveType;
}

export const MOVER_LIST_DEFAULTS: MoverListFilters = {
  keyword: "",
  status: "ALL",
  regionId: null,
  moveType: "ALL",
  profile: "ALL",
  fromDate: "",
  toDate: "",
  sorts: [],
  page: 1,
  limit: 20,
};

const MOVER_REGION_IDS = new Set<number>(
  ADMIN_MOVER_REGION_OPTIONS.map(({ value }) => value),
);

const MOVER_LIST_SORTS = new Set<AdminMoverListSort>([
  "PENDING_DESC",
  "PENDING_ASC",
  "OPEN_INQUIRY_DESC",
  "OPEN_INQUIRY_ASC",
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
  const regionId = parsePositiveInteger(getSearchParam(params, "regionId"), 0);
  const moveType = getSearchParam(params, "moveType");

  return {
    ...parseAdminListSearchFilters(params, MOVER_LIST_SORTS),
    regionId: MOVER_REGION_IDS.has(regionId) ? regionId : null,
    moveType:
      moveType === "SMALL" || moveType === "HOME" || moveType === "OFFICE"
        ? moveType
        : "ALL",
  };
}

export function buildMoverListQueryString(filters: MoverListFilters) {
  const params = createAdminListSearchParams(filters);

  if (filters.regionId) params.set("regionId", String(filters.regionId));
  if (filters.moveType !== "ALL") params.set("moveType", filters.moveType);

  return params.toString();
}
