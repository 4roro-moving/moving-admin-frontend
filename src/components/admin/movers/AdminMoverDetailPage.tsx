"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AccountRestrictionModal from "@/components/admin/users/AccountRestrictionModal";
import UserSuspensionHistory from "@/components/admin/users/UserSuspensionHistory";
import MoverEstimateActivity from "@/components/admin/movers/MoverEstimateActivity";
import MoverFiledReportHistory from "@/components/admin/movers/MoverFiledReportHistory";
import MoverProfileInfo from "@/components/admin/movers/MoverProfileInfo";
import MoverReceivedReportHistory from "@/components/admin/movers/MoverReceivedReportHistory";
import MoverReviewHistory from "@/components/admin/movers/MoverReviewHistory";
import AdminAccountInfo from "@/components/admin/users/AdminAccountInfo";
import UserDetailHeader from "@/components/admin/users/UserDetailHeader";
import UserStatusAction from "@/components/admin/users/UserStatusAction";
import { useAdminMoverDetail } from "@/hooks/useAdminMoverDetail";
import { useAdminMoverStatusMutation } from "@/hooks/useAdminMoverStatusMutation";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type { AdminAccountStatusUpdatePayload } from "@/types/adminUser";

interface AdminMoverDetailPageProps {
  moverId: string;
}

export default function AdminMoverDetailPage({
  moverId,
}: AdminMoverDetailPageProps) {
  const router = useRouter();
  const { data: mover, error, isError, isFetching, isLoading, refetch } =
    useAdminMoverDetail(moverId);
  const moverStatusMutation = useAdminMoverStatusMutation();
  const [isRestrictionModalOpen, setIsRestrictionModalOpen] = useState(false);

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

  const handleRestrictionSubmit = async (
    payload: AdminAccountStatusUpdatePayload,
  ) => {
    try {
      await moverStatusMutation.mutateAsync({ moverId, payload });
      setIsRestrictionModalOpen(false);
    } catch {
      // 오류는 모달 내부에서 안내한다.
    }
  };

  return (
    <section className="flex w-full flex-col gap-6">
      <UserDetailHeader
        name={profile.nickname || account.name}
        status={account.status}
        backLabel="기사 목록으로"
        onBack={() => router.back()}
        action={
          <UserStatusAction
            status={account.status}
            onClick={() => setIsRestrictionModalOpen(true)}
          />
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
      {isRestrictionModalOpen ? (
        <AccountRestrictionModal
          account={account}
          targetLabel="기사"
          error={
            moverStatusMutation.isError ? moverStatusMutation.error : undefined
          }
          initialAction={account.status === "SUSPENDED" ? "RELEASE" : "SUSPEND"}
          isPending={moverStatusMutation.isPending}
          open={isRestrictionModalOpen}
          onClose={() => {
            setIsRestrictionModalOpen(false);
            moverStatusMutation.reset();
          }}
          onSubmit={handleRestrictionSubmit}
        />
      ) : null}
    </section>
  );
}
