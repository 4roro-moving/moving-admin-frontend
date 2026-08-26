"use client";

import Link from "next/link";
import { useState } from "react";

import {
  AdminReviewErrorState,
  AdminReviewLoadingState,
} from "@/components/admin/contents/AdminReviewListStates";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { cn } from "@/lib/utils/cn";
import type {
  AdminDashboardActivityItem,
  AdminDashboardContentSummaryItem,
  AdminDashboardMetric,
  AdminDashboardPeriod,
  AdminDashboardRecentItem,
  AdminDashboardServiceStage,
} from "@/types/adminDashboard";
import {
  ADMIN_DASHBOARD_PERIODS,
  ADMIN_DASHBOARD_PERIOD_LABELS,
  DEFAULT_ADMIN_DASHBOARD_PERIOD,
} from "@/types/adminDashboard";

function DashboardMetricCard({ item }: { item: AdminDashboardMetric }) {
  return (
    <article className="bg-surface border-border flex min-w-0 flex-col gap-3 rounded-2xl border p-5">
      <p className="text-muted text-xs font-normal">{item.label}</p>
      <p
        className={cn(
          "text-[#262524] text-[25px] leading-none font-bold",
          item.tone === "accent" ? "text-accent" : "",
        )}
      >
        {item.value}
      </p>
      <p className="text-[11px] font-normal text-[#ababab]">{item.helper}</p>
    </article>
  );
}

function StatusBadge({ label, tone }: { label: string; tone: "pending" | "resolved" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-full px-[9px] py-[5px] text-[11px] font-normal leading-none",
        tone === "resolved" ? "bg-[#f0faf2] text-[#32a753]" : "bg-[#fff5f0] text-accent",
      )}
    >
      {label}
    </span>
  );
}

function RecentOperationsCard({
  title,
  description,
  actionLabel,
  actionHref,
  items,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  items: AdminDashboardRecentItem[];
}) {
  return (
    <section className="bg-surface border-border flex min-w-0 flex-1 flex-col gap-3 rounded-2xl border p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-[17px] font-semibold text-[#262524]">{title}</h2>
          <p className="mt-1 text-[11px] font-normal text-[#ababab]">{description}</p>
        </div>
        {actionLabel ? (
          actionHref ? (
            <Link href={actionHref} className="shrink-0 text-xs font-semibold text-accent">
              {actionLabel}
            </Link>
          ) : (
            <span className="shrink-0 text-xs font-semibold text-accent">
              {actionLabel}
            </span>
          )
        ) : null}
      </div>

      <div className="space-y-1">
        {items.map((item) => (
          <article key={item.id} className="flex items-start gap-2.5 py-2.5">
            <StatusBadge label={item.status} tone={item.statusTone} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-[#302f2d]">{item.primary}</p>
              <p className="mt-1 text-[11px] font-normal text-[#ababab]">{item.meta}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ServiceStageCard({ stage }: { stage: AdminDashboardServiceStage }) {
  return (
    <article
      className={cn(
        "flex min-w-0 flex-1 flex-col gap-[7px] rounded-xl p-4",
        stage.highlighted ? "bg-accent-muted" : "bg-[#fafafa]",
      )}
    >
      <p
        className={cn(
          "text-xs font-normal text-muted",
          stage.highlighted ? "font-semibold text-accent" : "",
        )}
      >
        {stage.label}
      </p>
      <p
        className={cn(
          "text-[#262524] text-[21px] leading-none font-bold",
          stage.valueSize === "large" ? "text-[28px]" : "",
        )}
      >
        {stage.value}
      </p>
    </article>
  );
}

function ContentSummaryRow({ item }: { item: AdminDashboardContentSummaryItem }) {
  return (
    <div className="flex items-start gap-2 py-2">
      <p className="min-w-0 flex-1 text-[13px] font-semibold text-[#302f2d]">{item.label}</p>
      <p
        className={cn(
          "shrink-0 text-xs font-semibold",
          item.tone === "accent" ? "text-accent" : "text-muted",
        )}
      >
        {item.value}
      </p>
    </div>
  );
}

function RecentActivityRow({ item }: { item: AdminDashboardActivityItem }) {
  return (
    <div className="flex items-start gap-2.5 py-[7px]">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-accent">{item.action}</p>
        <p className="mt-1 text-xs font-normal text-[#302f2d]">{item.memo}</p>
      </div>
      <p className="shrink-0 text-[11px] font-normal text-[#ababab]">{item.timeAgo}</p>
    </div>
  );
}

/**
 * 집계 기간 선택.
 *
 * 서버는 기간 한정 지표(서비스 운영 현황·신규 가입)에만 이 값을 적용합니다.
 * 전체 회원 수나 처리 대기 건수는 "현재 상태"라 기간과 무관합니다.
 */
function PeriodSelector({
  value,
  onChange,
  disabled,
}: {
  value: AdminDashboardPeriod;
  onChange: (next: AdminDashboardPeriod) => void;
  disabled: boolean;
}) {
  return (
    <div
      role="group"
      aria-label="집계 기간"
      className="border-border bg-surface flex items-center gap-1 rounded-full border p-1"
    >
      {ADMIN_DASHBOARD_PERIODS.map((period) => (
        <button
          key={period}
          type="button"
          onClick={() => onChange(period)}
          disabled={disabled}
          aria-pressed={value === period}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs transition disabled:opacity-50",
            value === period
              ? "bg-accent-muted text-accent font-semibold"
              : "text-muted hover:text-foreground",
          )}
        >
          {ADMIN_DASHBOARD_PERIOD_LABELS[period]}
        </button>
      ))}
    </div>
  );
}

export default function AdminDashboardPage() {
  const [period, setPeriod] = useState<AdminDashboardPeriod>(
    DEFAULT_ADMIN_DASHBOARD_PERIOD,
  );
  const dashboardQuery = useAdminDashboard(period);

  if (dashboardQuery.isLoading) {
    return <AdminReviewLoadingState message="대시보드를 불러오는 중입니다." />;
  }

  if (dashboardQuery.isError) {
    return (
      <AdminReviewErrorState
        error={dashboardQuery.error}
        message="대시보드를 불러오지 못했습니다."
        onRetry={() => {
          void dashboardQuery.refetch();
        }}
      />
    );
  }

  const dashboard = dashboardQuery.data;
  if (!dashboard) {
    return null;
  }

  return (
    <section className="mx-auto flex w-full max-w-[1120px] flex-col gap-5">
      <header className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-semibold text-foreground">{dashboard.pageTitle}</h1>
          <p className="text-muted text-sm font-normal">{dashboard.pageDescription}</p>
        </div>

        <PeriodSelector
          value={period}
          onChange={setPeriod}
          disabled={dashboardQuery.isFetching}
        />
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.metrics.map((item) => (
          <DashboardMetricCard key={item.label} item={item} />
        ))}
      </section>

      <section className="grid gap-[18px] xl:grid-cols-2">
        <RecentOperationsCard
          title={dashboard.recentReports.title}
          description={dashboard.recentReports.description}
          actionLabel={dashboard.recentReports.actionLabel}
          actionHref={APP_ROUTES.REPORTS}
          items={dashboard.recentReports.items}
        />
        <RecentOperationsCard
          title={dashboard.recentInquiries.title}
          description={dashboard.recentInquiries.description}
          actionLabel={dashboard.recentInquiries.actionLabel}
          actionHref={APP_ROUTES.INQUIRIES}
          items={dashboard.recentInquiries.items}
        />
      </section>

      <section className="bg-surface border-border flex flex-col gap-3 rounded-2xl border p-5">
        <h2 className="text-[17px] font-semibold text-[#262524]">{dashboard.serviceOverview.title}</h2>
        <p className="text-[11px] font-normal text-[#ababab]">{dashboard.serviceOverview.description}</p>
        <div className="grid gap-3 xl:grid-cols-4">
          {dashboard.serviceOverview.stages.map((stage) => (
            <ServiceStageCard key={stage.label} stage={stage} />
          ))}
        </div>
      </section>

      <section className="grid gap-[18px] xl:grid-cols-2">
        <section className="bg-surface border-border flex flex-col gap-3 rounded-2xl border p-5">
          <h2 className="text-[17px] font-semibold text-[#262524]">{dashboard.contentSummary.title}</h2>
          <p className="text-[11px] font-normal text-[#ababab]">{dashboard.contentSummary.description}</p>
          <div>
            {dashboard.contentSummary.items.map((item) => (
              <ContentSummaryRow key={item.label} item={item} />
            ))}
          </div>
        </section>

        <section className="bg-surface border-border flex flex-col gap-3 rounded-2xl border p-5">
          <h2 className="text-[17px] font-semibold text-[#262524]">{dashboard.recentActivities.title}</h2>
          <p className="text-[11px] font-normal text-[#ababab]">{dashboard.recentActivities.description}</p>
          <div>
            {dashboard.recentActivities.items.map((item) => (
              <RecentActivityRow key={`${item.action}-${item.timeAgo}`} item={item} />
            ))}
          </div>
        </section>
      </section>
    </section>
  );
}
