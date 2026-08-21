"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import Text from "@/components/admin/common/Text";
import CustomerSuspensionHistory from "@/components/admin/customers/CustomerSuspensionHistory";
import MoverAccountInfo from "@/components/admin/movers/MoverAccountInfo";
import MoverEstimateActivity from "@/components/admin/movers/MoverEstimateActivity";
import MoverFiledReportHistory from "@/components/admin/movers/MoverFiledReportHistory";
import MoverProfileInfo from "@/components/admin/movers/MoverProfileInfo";
import MoverReceivedReportHistory from "@/components/admin/movers/MoverReceivedReportHistory";
import MoverReviewHistory from "@/components/admin/movers/MoverReviewHistory";
import AdminStatusBadge from "@/components/admin/users/AdminStatusBadge";
import { useAdminMoverDetail } from "@/hooks/useAdminMoverDetail";
import { ChevronLeftIcon } from "@/icons";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface AdminMoverDetailPageProps {
  moverId: string;
}

export default function AdminMoverDetailPage({
  moverId,
}: AdminMoverDetailPageProps) {
  const router = useRouter();
  const { data: mover, error, isError, isFetching, isLoading, refetch } =
    useAdminMoverDetail(moverId);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [moverId]);

  if (isLoading) {
    return (
      <section className="flex w-full flex-col items-center justify-center py-24">
        <p className="text-sm text-muted">기사 상세 정보를 불러오는 중입니다.</p>
      </section>
    );
  }

  if (isError || !mover) {
    return (
      <section className="flex w-full flex-col items-center justify-center py-24">
        <p className="text-sm text-rose-600">
          {getApiErrorMessage(error, "기사 상세 정보를 불러오지 못했습니다.")}
        </p>
        <button
          type="button"
          disabled={isFetching}
          onClick={() => void refetch()}
          className="mt-4 rounded-lg border border-border px-4 py-2 text-sm font-semibold text-text-secondary hover:bg-background-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isFetching ? "다시 시도 중..." : "다시 시도"}
        </button>
      </section>
    );
  }

  const { account, profile, estimateActivity, reviewHistory, reportHistory, suspensionHistory } =
    mover;

  return (
    <section className="flex w-full flex-col gap-6">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label="기사 목록으로"
            title="기사 목록으로"
            onClick={() => router.back()}
            className="flex size-9 items-center justify-center rounded-lg text-text-secondary hover:bg-background-hover hover:text-foreground"
          >
            <ChevronLeftIcon aria-hidden="true" className="size-5" />
          </button>
          <div className="flex flex-wrap items-center gap-2">
            <Text as="h1" variant="2xl-semibold" className="text-foreground">
              {profile.nickname}
            </Text>
            <AdminStatusBadge status={account.status} />
          </div>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,1.15fr)]">
        <MoverAccountInfo account={account} />
        <MoverProfileInfo account={account} profile={profile} />
      </div>
      <MoverEstimateActivity activity={estimateActivity} />
      <MoverReviewHistory history={reviewHistory} />
      <div className="grid gap-6 xl:grid-cols-2">
        <MoverFiledReportHistory
          history={reportHistory.filed}
          onDetail={(reportId) => router.push(`/reports?reportId=${reportId}`)}
        />
        <MoverReceivedReportHistory
          history={reportHistory.received}
          onDetail={(reportId) => router.push(`/reports?reportId=${reportId}`)}
        />
      </div>
      <CustomerSuspensionHistory history={suspensionHistory} />
    </section>
  );
}
