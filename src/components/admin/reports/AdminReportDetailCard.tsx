"use client";

import { useState } from "react";

import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import {
  formatAdminReportDateTime,
  getAdminReportDetailMeta,
  getAdminReportDetailTargetContent,
  getAdminReportDetailTargetTitle,
  getAdminReportReasonLabel,
  getAdminReportStatusLabel,
  getAdminReportStatusTone,
  getAdminReportTargetLabel,
} from "@/lib/utils/adminReport";
import type { AdminReportDetail } from "@/types/adminReport";

import AdminReportActionModal from "./AdminReportActionModal";

interface AdminReportDetailCardProps {
  report: AdminReportDetail | null;
  isLoading: boolean;
  error: unknown;
  isPending: boolean;
  onModerate: (params: {
    reportId: number;
    status: "RESOLVED" | "REJECTED";
    handlerNote: string;
  }) => Promise<void>;
}

export default function AdminReportDetailCard({
  report,
  isLoading,
  error,
  isPending,
  onModerate,
}: AdminReportDetailCardProps) {
  const [handlerNote, setHandlerNote] = useState(report?.handlerNote ?? "");
  const [pendingStatus, setPendingStatus] = useState<"RESOLVED" | "REJECTED" | null>(null);

  if (isLoading) {
    return (
      <aside className="border-border bg-surface rounded-2xl border p-6">
        <p className="text-muted text-sm">신고 상세를 불러오는 중입니다.</p>
      </aside>
    );
  }

  if (error) {
    return (
      <aside className="border-border bg-surface rounded-2xl border p-6">
        <p className="text-sm text-red-600">
          {getApiErrorMessage(error, "신고 상세를 불러오지 못했습니다.")}
        </p>
      </aside>
    );
  }

  if (!report) {
    return (
      <aside className="border-border bg-surface rounded-2xl border p-6">
        <p className="text-muted text-sm">선택된 신고가 없습니다.</p>
      </aside>
    );
  }

  const isActionable = report.status === "PENDING";
  const targetMeta = getAdminReportDetailMeta(report.target);
  const targetContent = getAdminReportDetailTargetContent(report.target);

  return (
    <>
      <aside className="border-border bg-surface flex h-full flex-col gap-4 rounded-2xl border p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">신고 상세</h2>
            <p className="text-muted mt-1 text-sm">신고 #{report.id}</p>
          </div>
          <span
            className={cn(
              "inline-flex min-w-[72px] items-center justify-center rounded-full px-3 py-1 text-xs",
              getAdminReportStatusTone(report.status),
            )}
          >
            {getAdminReportStatusLabel(report.status)}
          </span>
        </div>

        <section className="bg-background rounded-xl p-4 text-sm text-muted">
          <dl className="space-y-4">
            <div>
              <dt>신고 대상</dt>
              <dd className="mt-1 text-foreground">{getAdminReportDetailTargetTitle(report)}</dd>
              <dd className="mt-1 text-xs text-muted">
                대상 유형 {getAdminReportTargetLabel(report.targetType)} · 대상 ID {report.targetId}
              </dd>
            </div>
            <div>
              <dt>신고자</dt>
              <dd className="mt-1 text-foreground">
                {report.reporter.name} · {report.reporter.email}
              </dd>
            </div>
            <div>
              <dt>신고 사유</dt>
              <dd className="mt-1 text-foreground">{getAdminReportReasonLabel(report.reason)}</dd>
            </div>
            <div>
              <dt>신고 내용</dt>
              <dd className="mt-1 text-foreground">{report.detail ?? "상세 신고 내용 없음"}</dd>
            </div>
            <div>
              <dt>접수일</dt>
              <dd className="mt-1 text-foreground">{formatAdminReportDateTime(report.createdAt)}</dd>
            </div>
            {report.handler && report.handledAt ? (
              <div>
                <dt>처리 정보</dt>
                <dd className="mt-1 text-foreground">
                  {report.handler.name} · {formatAdminReportDateTime(report.handledAt)}
                </dd>
              </div>
            ) : null}
          </dl>
        </section>

        <section className="rounded-xl border border-[#f9c8bc] bg-[#fff7f3] p-4 text-sm text-muted">
          <p>신고된 원본 콘텐츠</p>
          <p className="mt-2 text-foreground">{getAdminReportDetailTargetTitle(report)}</p>
          {targetMeta ? <p className="mt-2 text-xs text-muted">{targetMeta}</p> : null}
          <p className="mt-2 whitespace-pre-line leading-6 text-foreground/80">{targetContent}</p>
        </section>

        <div className="flex flex-col gap-2">
          <label htmlFor="admin-report-note" className="text-sm text-muted">
            처리 메모
          </label>
          <textarea
            id="admin-report-note"
            value={handlerNote}
            onChange={(event) => setHandlerNote(event.target.value)}
            placeholder="처리 사유 또는 관리자 메모를 입력해 주세요."
            className="border-border min-h-[108px] w-full rounded-xl border px-3 py-3 text-sm text-foreground outline-none focus:border-accent disabled:bg-background disabled:text-muted"
            disabled={!isActionable || isPending}
          />
        </div>

        <div className="mt-auto grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            className="rounded-xl border border-red-500 px-4 py-3 text-sm text-red-500 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!isActionable || isPending}
            onClick={() => setPendingStatus("REJECTED")}
          >
            반려
          </button>
          <button
            type="button"
            className="bg-accent rounded-xl px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!isActionable || isPending}
            onClick={() => setPendingStatus("RESOLVED")}
          >
            처리 완료
          </button>
        </div>
      </aside>

      {pendingStatus ? (
        <AdminReportActionModal
          action={pendingStatus}
          isPending={isPending}
          onClose={() => {
            if (!isPending) {
              setPendingStatus(null);
            }
          }}
          onConfirm={() => {
            void onModerate({
              reportId: report.id,
              status: pendingStatus,
              handlerNote,
            }).finally(() => {
              setPendingStatus(null);
            });
          }}
        />
      ) : null}
    </>
  );
}
