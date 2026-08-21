"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import UserSuspensionHistory from "@/components/admin/users/UserSuspensionHistory";
import MoverEstimateActivity from "@/components/admin/movers/MoverEstimateActivity";
import MoverFiledReportHistory from "@/components/admin/movers/MoverFiledReportHistory";
import MoverProfileInfo from "@/components/admin/movers/MoverProfileInfo";
import MoverReceivedReportHistory from "@/components/admin/movers/MoverReceivedReportHistory";
import MoverReviewHistory from "@/components/admin/movers/MoverReviewHistory";
import AdminAccountInfo from "@/components/admin/users/AdminAccountInfo";
import UserDetailHeader from "@/components/admin/users/UserDetailHeader";
import { useAdminMoverDetail } from "@/hooks/useAdminMoverDetail";
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
      <UserDetailHeader
        name={profile.nickname || account.name}
        status={account.status}
        backLabel="기사 목록으로"
        onBack={() => router.back()}
        action={
          account.status === "WITHDRAWN" ? null : (
            <div className="flex flex-col items-end gap-1">
              <button
                type="button"
                disabled
                title="기사 상태 변경 API 연동 전"
                className="cursor-not-allowed rounded-lg border border-border px-3 py-2 text-sm font-semibold text-text-subtle opacity-60"
              >
                {account.status === "SUSPENDED" ? "정지 해제" : "계정 정지"}
              </button>
              <span className="text-xs text-text-subtle">준비 중</span>
            </div>
          )
        }
      />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,1.15fr)]">
        <AdminAccountInfo account={account} />
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
      <UserSuspensionHistory history={suspensionHistory} />
    </section>
  );
}
