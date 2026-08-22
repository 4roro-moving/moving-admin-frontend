import AdminJoinedDateFilter from "@/components/admin/users/AdminJoinedDateFilter";
import { type AdminListColumn } from "@/components/admin/users/AdminListTable";
import AdminProfileFilter from "@/components/admin/users/AdminProfileFilter";
import AdminReportSummaryBadge from "@/components/admin/users/AdminReportSummaryBadge";
import AdminStatusBadge from "@/components/admin/users/AdminStatusBadge";
import SortIcon from "@/components/admin/users/SortIcon";
import {
  FilterOption,
  TableFilter,
} from "@/components/admin/users/TableFilter";
import { formatJoinedDate } from "@/lib/utils/user/date";
import type { SortDirection } from "@/lib/utils/user/sort";
import {
  ADMIN_STATUS_LABEL,
  type AdminAccountStatus,
  type AdminProfileFilterValue,
} from "@/types/adminUser";
import type {
  AdminCustomerAuthProviderFilter,
  AdminCustomerListItem,
  AdminCustomerOpenFilter,
} from "@/types/adminCustomer";

import { ADMIN_AUTH_PROVIDERS } from "@/types/adminCustomer";

interface Options {
  status: "ALL" | AdminAccountStatus;
  profile: AdminProfileFilterValue;
  authProvider: AdminCustomerAuthProviderFilter;
  fromDate: string;
  toDate: string;
  reportSort: SortDirection;
  openInquirySort: SortDirection;
  joinedSort: SortDirection;
  openFilter: AdminCustomerOpenFilter;
  setOpenFilter: (value: AdminCustomerOpenFilter) => void;
  setStatus: (value: "ALL" | AdminAccountStatus) => void;
  setProfile: (value: AdminProfileFilterValue) => void;
  setAuthProvider: (value: AdminCustomerAuthProviderFilter) => void;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  resetDate: () => void;
  onReportSort: () => void;
  onOpenInquirySort: () => void;
  onJoinedSort: () => void;
}

export function createCustomerColumns(
  o: Options,
): Array<AdminListColumn<AdminCustomerListItem>> {
  return [
    {
      id: "name",
      width: "w-[15%]",
      header: "이름",
      cell: (m) => (
        <span className="font-semibold text-foreground">{m.name}</span>
      ),
    },
    {
      id: "email",
      width: "w-[24%]",
      header: "이메일",
      cell: (m) => (
        <div className="truncate text-muted" title={m.email}>
          {m.email}
        </div>
      ),
    },
    {
      id: "status",
      width: "w-[12%]",
      header: (
        <TableFilter
          label="계정 상태"
          isOpen={o.openFilter === "status"}
          isActive={o.status !== "ALL"}
          onToggle={() =>
            o.setOpenFilter(o.openFilter === "status" ? null : "status")
          }
        >
          <FilterOption
            selected={o.status === "ALL"}
            onClick={() => {
              o.setStatus("ALL");
              o.setOpenFilter(null);
            }}
          >
            전체 상태
          </FilterOption>
          {(Object.keys(ADMIN_STATUS_LABEL) as AdminAccountStatus[]).map((v) => (
            <FilterOption
              key={v}
              selected={o.status === v}
              onClick={() => {
                o.setStatus(v);
                o.setOpenFilter(null);
              }}
            >
              {ADMIN_STATUS_LABEL[v]}
            </FilterOption>
          ))}
        </TableFilter>
      ),
      cell: (m) => <AdminStatusBadge status={m.status} />,
    },
    {
      id: "profile",
      width: "w-[11%]",
      header: (
        <AdminProfileFilter
          value={o.profile}
          isOpen={o.openFilter === "profile"}
          onToggle={() =>
            o.setOpenFilter(o.openFilter === "profile" ? null : "profile")
          }
          onChange={(value) => {
            o.setProfile(value);
            o.setOpenFilter(null);
          }}
          isActive={o.profile !== "ALL"}
        />
      ),
      cell: (m) => (
        <span
          className={
            m.isProfileCompleted ? "text-emerald-700" : "text-amber-700"
          }
        >
          {m.isProfileCompleted ? "완료" : "미완료"}
        </span>
      ),
    },
    {
      id: "report",
      width: "w-[17%]",
      header: (
        <div className="flex items-center gap-1">
          피신고건수
          <button
            type="button"
            aria-label="미처리 피신고건수 정렬"
            onClick={o.onReportSort}
          >
            <SortIcon direction={o.reportSort} />
          </button>
        </div>
      ),
      cell: (m) => (
        <AdminReportSummaryBadge
          pendingCount={m.pendingReceivedReportCount}
          totalCount={m.receivedReportCount}
        />
      ),
    },
    {
      id: "openInquiry",
      width: "w-[12%]",
      header: (
        <div className="flex items-center gap-1">
          미답변 문의
          <button
            type="button"
            aria-label="미답변 문의 정렬"
            onClick={o.onOpenInquirySort}
          >
            <SortIcon direction={o.openInquirySort} />
          </button>
        </div>
      ),
      cell: (m) => <span className="text-muted">{m.openInquiryCount}건</span>,
    },
    {
      id: "provider",
      width: "w-[11%]",
      header: (
        <TableFilter
          label="가입 방식"
          isOpen={o.openFilter === "provider"}
          isActive={o.authProvider !== "ALL"}
          onToggle={() =>
            o.setOpenFilter(o.openFilter === "provider" ? null : "provider")
          }
        >
          <FilterOption
            selected={o.authProvider === "ALL"}
            onClick={() => {
              o.setAuthProvider("ALL");
              o.setOpenFilter(null);
            }}
          >
            전체
          </FilterOption>
          {ADMIN_AUTH_PROVIDERS.map((v) => (
            <FilterOption
              key={v}
              selected={o.authProvider === v}
              onClick={() => {
                o.setAuthProvider(v);
                o.setOpenFilter(null);
              }}
            >
              {v}
            </FilterOption>
          ))}
        </TableFilter>
      ),
      cell: (m) => <span className="text-muted">{m.authProvider}</span>,
    },
    {
      id: "joined",
      width: "w-[10%]",
      header: (
        <AdminJoinedDateFilter
          isOpen={o.openFilter === "date"}
          onToggle={() =>
            o.setOpenFilter(o.openFilter === "date" ? null : "date")
          }
          fromDate={o.fromDate}
          toDate={o.toDate}
          onFromDateChange={o.setFromDate}
          onToDateChange={o.setToDate}
          onReset={o.resetDate}
          sortDirection={o.joinedSort}
          onSort={o.onJoinedSort}
        />
      ),
      cell: (m) => (
        <span className="text-muted">{formatJoinedDate(m.createdAt)}</span>
      ),
    },
  ];
}
