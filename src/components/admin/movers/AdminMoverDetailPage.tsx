"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import AccountRestrictionModal from "@/components/admin/users/AccountRestrictionModal";
import EstimateCancellationModal from "@/components/admin/estimates/EstimateCancellationModal";
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
import { useAdminMoverEstimateCancellationMutation } from "@/hooks/useAdminMoverEstimateCancellationMutation";
import { useAdminMoverStatusMutation } from "@/hooks/useAdminMoverStatusMutation";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import type {
  AdminEstimateCancellationPayload,
  AdminEstimateCancellationTarget,
} from "@/types/adminEstimate";
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
  const estimateCancellationMutation = useAdminMoverEstimateCancellationMutation();
  const [restrictionAction, setRestrictionAction] = useState<
    AdminAccountStatusUpdatePayload["action"] | null
  >(null);
  const [selectedEstimate, setSelectedEstimate] =
    useState<AdminEstimateCancellationTarget | null>(null);

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
      setRestrictionAction(null);
    } catch {
      // 오류는 모달 내부에서 안내한다.
    }
  };

  const handleEstimateCancellationSubmit = async (
    payload: AdminEstimateCancellationPayload,
  ) => {
    if (selectedEstimate === null) return;

    try {
      await estimateCancellationMutation.mutateAsync({
        moverId,
        customerId: selectedEstimate.customerId,
        estimateId: selectedEstimate.estimateId,
        payload,
      });
      setSelectedEstimate(null);
    } catch {
      // 오류는 모달 내부에서 안내한다.
    }
  };

  const hasCancelableConfirmedEstimate = estimateActivity.inProgress.items.some(
    (item) => item.status === "CONFIRMED" && item.cancelable,
  );
  const shouldShowSuspendedEstimateNotice =
    account.status === "SUSPENDED" && hasCancelableConfirmedEstimate;

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
            onClick={() =>
              setRestrictionAction(
                account.status === "SUSPENDED" ? "RELEASE" : "SUSPEND",
              )
            }
          />
        }
      />
      {shouldShowSuspendedEstimateNotice ? (
        <div
          role="note"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-status-progress-foreground bg-status-progress-background px-4 py-3"
        >
          <p className="text-sm text-text-secondary">
            이 기사는 정지 상태입니다. 계정 정지만으로 확정 거래는 취소되지 않으므로, 필요한 경우 진행 중 견적 활동에서 별도로 취소해 주세요.
          </p>
          <a
            href="#in-progress-estimates"
            className="shrink-0 text-sm font-semibold text-status-progress-foreground underline underline-offset-2"
          >
            진행 중 견적 활동으로 이동
          </a>
        </div>
      ) : null}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(20rem,1.15fr)]">
        <AdminAccountInfo account={account} />
        <MoverProfileInfo account={account} profile={profile} />
      </div>
      <MoverEstimateActivity
        activity={estimateActivity}
        moverId={moverId}
        moverName={account.name}
        moverNickname={profile.nickname || account.name}
        onCancelConfirmedEstimate={setSelectedEstimate}
      />
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
      {restrictionAction !== null ? (
        <AccountRestrictionModal
          account={account}
          targetLabel="기사"
          error={
            moverStatusMutation.isError ? moverStatusMutation.error : undefined
          }
          initialAction={restrictionAction}
          isPending={moverStatusMutation.isPending}
          open
          onClose={() => {
            setRestrictionAction(null);
            moverStatusMutation.reset();
          }}
          onSubmit={handleRestrictionSubmit}
        />
      ) : null}
      {selectedEstimate !== null ? (
        <EstimateCancellationModal
          error={
            estimateCancellationMutation.isError
              ? estimateCancellationMutation.error
              : undefined
          }
          isPending={estimateCancellationMutation.isPending}
          open
          target={selectedEstimate}
          onClose={() => {
            setSelectedEstimate(null);
            estimateCancellationMutation.reset();
          }}
          onSubmit={handleEstimateCancellationSubmit}
        />
      ) : null}
    </section>
  );
}
