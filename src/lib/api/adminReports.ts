import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import { ADMIN_REPORT_LIST_PAGE_LIMIT } from "@/lib/constants/adminReports";
import type { ApiResponse } from "@/types/api";
import type {
  AdminReportDetail,
  AdminReportListQuery,
  AdminReportListItem,
  AdminReportListResult,
  AdminReportModerationPayload,
  AdminReportSummary,
} from "@/types/adminReport";

function buildReportListSearchParams(query: AdminReportListQuery = {}): URLSearchParams {
  const page = query.page ?? 1;
  const limit = query.limit ?? ADMIN_REPORT_LIST_PAGE_LIMIT;
  const keyword = query.keyword?.trim();

  const search = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort: query.sort ?? "LATEST",
  });

  if (query.status && query.status !== "ALL") {
    search.set("status", query.status);
  }

  if (query.targetType && query.targetType !== "ALL") {
    search.set("targetType", query.targetType);
  }

  if (query.reason && query.reason !== "ALL") {
    search.set("reason", query.reason);
  }

  if (keyword) {
    search.set("keyword", keyword);
  }

  return search;
}

export async function fetchAdminReports(
  query: AdminReportListQuery = {},
): Promise<AdminReportListResult> {
  const result = await fetchInstance.getPaginated<AdminReportListItem[]>(
    `${API_ROUTES.ADMIN.REPORTS}?${buildReportListSearchParams(query).toString()}`,
  );

  return {
    items: result.data,
    pagination: result.pagination,
  };
}

export async function fetchAdminReportSummary(): Promise<AdminReportSummary> {
  const limit = 1;
  const [total, pending, resolved, rejected] = await Promise.all([
    fetchAdminReports({ page: 1, limit, sort: "LATEST" }),
    fetchAdminReports({ page: 1, limit, sort: "LATEST", status: "PENDING" }),
    fetchAdminReports({ page: 1, limit, sort: "LATEST", status: "RESOLVED" }),
    fetchAdminReports({ page: 1, limit, sort: "LATEST", status: "REJECTED" }),
  ]);

  return {
    totalCount: total.pagination.totalCount,
    pendingCount: pending.pagination.totalCount,
    resolvedCount: resolved.pagination.totalCount,
    rejectedCount: rejected.pagination.totalCount,
  };
}

export async function fetchAdminReportDetail(reportId: number): Promise<AdminReportDetail> {
  const body = await fetchInstance.get<ApiResponse<AdminReportDetail>>(
    `${API_ROUTES.ADMIN.REPORTS}/${String(reportId)}`,
  );

  return body.data;
}

export async function moderateAdminReport(
  reportId: number,
  payload: AdminReportModerationPayload,
): Promise<AdminReportListItem> {
  const body = await fetchInstance.patch<ApiResponse<AdminReportListItem>>(
    `${API_ROUTES.ADMIN.REPORTS}/${String(reportId)}`,
    payload,
  );

  return body.data;
}
