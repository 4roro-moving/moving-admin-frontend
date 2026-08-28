import AdminJoinedDateFilter from "@/components/admin/users/AdminJoinedDateFilter";
import { type AdminListColumn } from "@/components/admin/users/AdminListTable";
import Text from "@/components/admin/common/Text";
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
  type AdminListOpenFilter,
  type AdminProfileFilterValue,
} from "@/types/adminUser";
import type { AdminMoverListItem } from "@/types/adminMover";
import { StarIcon } from "@/icons";

interface Options {
  status: "ALL" | AdminAccountStatus;
  profile: AdminProfileFilterValue;
  fromDate: string;
  toDate: string;
  reportSort: SortDirection;
  openInquirySort: SortDirection;
  confirmedSort: SortDirection;
  ratingSort: SortDirection;
  careerSort: SortDirection;
  joinedSort: SortDirection;
  openFilter: AdminListOpenFilter;
  setOpenFilter: (value: AdminListOpenFilter) => void;
  setStatus: (value: "ALL" | AdminAccountStatus) => void;
  setProfile: (value: AdminProfileFilterValue) => void;
  setFromDate: (value: string) => void;
  setToDate: (value: string) => void;
  resetDate: () => void;
  onReportSort: () => void;
  onOpenInquirySort: () => void;
  onConfirmedSort: () => void;
  onRatingSort: () => void;
  onCareerSort: () => void;
  onJoinedSort: () => void;
}

export function createMoverColumns(
  o: Options,
): Array<AdminListColumn<AdminMoverListItem>> {
  return [
    {
      id: "name",
      width: "w-[12%]",
      header: "닉네임(이름)",
      cell: (m) => (
        <>
          <p className="font-semibold text-foreground">{m.nickname ?? "-"}</p>
          <p className="mt-1 text-xs text-muted">{m.name}</p>
        </>
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
      width: "w-[11%]",
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
            전체 (탈퇴 제외)
          </FilterOption>
          {(Object.keys(ADMIN_STATUS_LABEL) as AdminAccountStatus[]).map(
            (v) => (
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
            ),
          )}
        </TableFilter>
      ),
      cell: (m) => <AdminStatusBadge status={m.status} />,
    },
    {
      id: "profile",
      width: "w-[8%]",
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
      width: "w-[11%]",
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
      id: "confirmed",
      width: "w-[8%]",
      header: (
        <div className="flex items-center gap-1">
          확정 건수
          <button
            type="button"
            aria-label="확정 건수 정렬"
            onClick={o.onConfirmedSort}
          >
            <SortIcon direction={o.confirmedSort} />
          </button>
        </div>
      ),
      cell: (m) => <span className="text-muted">{m.confirmedCount}건</span>,
    },
    {
      id: "openInquiry",
      width: "w-[9%]",
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
      id: "rating",
      width: "w-[11%]",
      header: (
        <div className="flex items-center gap-1">
          평균 평점(리뷰 수)
          <button
            type="button"
            aria-label="평균 평점 정렬"
            onClick={o.onRatingSort}
          >
            <SortIcon direction={o.ratingSort} />
          </button>
        </div>
      ),
      cell: (m) => (
        <Text
          as="span"
          variant="md-regular"
          className="inline-flex items-center text-muted"
        >
          <StarIcon className="mr-1 size-[1.15em] text-rating-fill" />
          {m.averageRating.toFixed(1)}{" "}
          <Text as="span" variant="md-regular" className="text-text-subtle">
            ({m.reviewCount})
          </Text>
        </Text>
      ),
    },
    {
      id: "career",
      width: "w-[6%]",
      header: (
        <div className="flex items-center gap-1">
          경력
          <button type="button" aria-label="경력 정렬" onClick={o.onCareerSort}>
            <SortIcon direction={o.careerSort} />
          </button>
        </div>
      ),
      cell: (m) => <span className="text-muted">{m.career ?? 0}년</span>,
    },
    {
      id: "joined",
      width: "w-[9%]",
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
