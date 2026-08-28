"use client";

import { useMemo, useState } from "react";

import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { cn } from "@/lib/utils/cn";
import {
  formatAdminInquiryDateTime,
  getAdminInquiryCategoryLabel,
  getAdminInquiryStatusLabel,
  getAdminInquiryStatusTone,
} from "@/lib/utils/adminInquiry";
import type { AdminInquiryDetail } from "@/types/adminInquiry";

import AdminInquiryCloseModal from "./AdminInquiryCloseModal";

interface AdminInquiryDetailCardProps {
  inquiry: AdminInquiryDetail | null;
  isLoading: boolean;
  error: unknown;
  isAnswerPending: boolean;
  isClosePending: boolean;
  onSubmitAnswer: (content: string) => Promise<void>;
  onSubmitClose: () => Promise<void>;
  onCloseDetail?: () => void;
  variant?: "panel" | "sheet";
}

export default function AdminInquiryDetailCard({
  inquiry,
  isLoading,
  error,
  isAnswerPending,
  isClosePending,
  onSubmitAnswer,
  onSubmitClose,
  onCloseDetail,
  variant = "panel",
}: AdminInquiryDetailCardProps) {
  const [answerContent, setAnswerContent] = useState("");
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const isSheet = variant === "sheet";

  const trimmedAnswerContent = answerContent.trim();
  const isClosed = inquiry?.status === "CLOSED";
  const isActionPending = isAnswerPending || isClosePending;
  const isAnswerDisabled =
    inquiry === null || isClosed || trimmedAnswerContent.length === 0 || isActionPending;
  const answerCountLabel = `${String(answerContent.length)} / 2000`;

  const wrapperClassName = useMemo(
    () =>
      isSheet
        ? "relative flex max-h-[calc(100vh-24px)] w-full flex-col overflow-hidden rounded-t-[24px] border border-border bg-surface shadow-lg"
        : "border-border bg-surface flex h-full min-h-[520px] flex-col rounded-2xl border p-6",
    [isSheet],
  );

  const orderedMessages = useMemo(() => inquiry?.messages ?? [], [inquiry]);

  const handleSubmitAnswer = async () => {
    if (isAnswerDisabled) {
      return;
    }

    await onSubmitAnswer(trimmedAnswerContent);
    setAnswerContent("");
  };

  const handleConfirmClose = async () => {
    await onSubmitClose();
    setIsCloseModalOpen(false);
  };

  const content = (
    <>
      {isSheet ? (
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 pt-5 pb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">문의 상세</h2>
            {inquiry ? (
              <p className="mt-1 text-sm text-muted">문의 #{inquiry.id}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onCloseDetail}
            className="rounded-full p-2 text-muted transition hover:bg-background hover:text-foreground"
            aria-label="문의 상세 닫기"
          >
            <span aria-hidden className="text-xl leading-none">
              ×
            </span>
          </button>
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-1 flex-col",
          isSheet ? "min-h-0 overflow-hidden px-5 pb-5" : "",
        )}
      >
        {isLoading ? (
          <p className="text-sm text-muted">문의 상세를 불러오는 중입니다.</p>
        ) : error ? (
          <p className="text-sm text-red-600">
            {getApiErrorMessage(error, "문의 상세를 불러오지 못했습니다.")}
          </p>
        ) : !inquiry ? (
          <p className="text-sm text-muted">
            {isSheet ? "선택된 문의가 없습니다." : "문의 목록에서 항목을 선택해 주세요."}
          </p>
        ) : (
          <div className={cn("flex min-h-0 flex-1 flex-col", isSheet ? "overflow-hidden" : "")}>
            {!isSheet ? (
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">문의 상세</h2>
                  <p className="mt-1 text-sm text-muted">문의 #{inquiry.id}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1 text-xs",
                    getAdminInquiryStatusTone(inquiry.status),
                  )}
                >
                  {getAdminInquiryStatusLabel(inquiry.status)}
                </span>
              </div>
            ) : (
              <div className="mt-4 flex items-center justify-between gap-3">
                <span
                  className={cn(
                    "inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1 text-xs",
                    getAdminInquiryStatusTone(inquiry.status),
                  )}
                >
                  {getAdminInquiryStatusLabel(inquiry.status)}
                </span>
              </div>
            )}

            <div className={cn("mt-4 flex min-h-0 flex-1 flex-col", isSheet ? "overflow-y-auto pr-1" : "gap-4")}>
              <section className="rounded-2xl border border-border bg-background px-5 py-4">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <p className="text-xs font-medium tracking-[0.02em] text-muted">문의 제목</p>
                      <h3 className="mt-1 break-words text-base font-semibold text-foreground">
                        {inquiry.title}
                      </h3>
                    </div>
                    <span
                      className={cn(
                        "inline-flex min-w-[88px] items-center justify-center rounded-full px-3 py-1 text-xs",
                        getAdminInquiryStatusTone(inquiry.status),
                      )}
                    >
                      {getAdminInquiryStatusLabel(inquiry.status)}
                    </span>
                  </div>

                  <dl className="grid gap-x-6 gap-y-3 text-sm text-muted sm:grid-cols-2 xl:grid-cols-3">
                    <div>
                      <dt className="text-xs font-medium tracking-[0.02em]">문의자</dt>
                      <dd className="mt-1 text-foreground">{inquiry.author.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium tracking-[0.02em]">문의 유형</dt>
                      <dd className="mt-1 text-foreground">
                        {getAdminInquiryCategoryLabel(inquiry.category)}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium tracking-[0.02em]">문의 일시</dt>
                      <dd className="mt-1 text-foreground">
                        {formatAdminInquiryDateTime(inquiry.createdAt)}
                      </dd>
                    </div>
                    {inquiry.handler ? (
                      <div>
                        <dt className="text-xs font-medium tracking-[0.02em]">처리자</dt>
                        <dd className="mt-1 text-foreground">{inquiry.handler.name}</dd>
                      </div>
                    ) : null}
                    {inquiry.closedAt ? (
                      <div>
                        <dt className="text-xs font-medium tracking-[0.02em]">종료 일시</dt>
                        <dd className="mt-1 text-foreground">
                          {formatAdminInquiryDateTime(inquiry.closedAt)}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                </div>
              </section>

              <div className={cn("rounded-2xl border border-border bg-surface", isSheet ? "mt-4" : "")}>
                <div className="border-b border-border px-5 py-4">
                  <h3 className="text-sm font-semibold text-foreground">문의 처리 이력</h3>
                  <p className="mt-1 text-sm text-muted">
                    문의와 답변이 시간순으로 정리되어 있습니다.
                  </p>
                </div>

                <div className="divide-y divide-border">
                  {orderedMessages.length > 0 ? (
                    orderedMessages.map((message, index) => {
                      const previousUserMessages = orderedMessages
                        .slice(0, index)
                        .filter((item) => !item.isAdmin).length;
                      const entryLabel = message.isAdmin
                        ? "관리자 답변"
                        : previousUserMessages === 0
                          ? "사용자 문의"
                          : "사용자 추가 문의";

                      return (
                        <article
                          key={message.id}
                          className={cn(
                            "px-5 py-4",
                            message.isAdmin ? "bg-accent-muted/35" : "bg-surface",
                          )}
                        >
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                            <span
                              className={cn(
                                "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                                message.isAdmin
                                  ? "bg-accent/10 text-accent"
                                  : "bg-background text-foreground",
                              )}
                            >
                              {entryLabel}
                            </span>
                            <span className="text-xs text-muted">
                              {formatAdminInquiryDateTime(message.createdAt)}
                            </span>
                            <span className="text-xs text-muted">{message.sender.name}</span>
                          </div>
                          <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-foreground">
                            {message.content}
                          </p>
                        </article>
                      );
                    })
                  ) : (
                    <div className="px-5 py-6 text-sm text-muted">등록된 문의 이력이 없습니다.</div>
                  )}
                </div>
              </div>

              {isClosed ? (
                <section className="mt-4 rounded-2xl border border-border bg-background px-5 py-4">
                  <h3 className="text-sm font-semibold text-foreground">문의 처리 상태</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    종료된 문의입니다. 기존 처리 이력은 그대로 확인할 수 있으며, 추가 답변이나
                    종료 처리는 더 이상 진행할 수 없습니다.
                  </p>
                </section>
              ) : (
                <section className="mt-4 rounded-2xl border border-border bg-background px-5 py-4">
                  <div className="flex flex-col gap-4">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">답변 작성</h3>
                      <p className="mt-1 text-sm text-muted">
                        등록한 답변은 문의 처리 이력에 추가되며, 문의자에게 알림으로 전달됩니다.
                      </p>
                    </div>

                    <div className="rounded-xl border border-border bg-surface px-3 py-3">
                      <textarea
                        id="admin-inquiry-answer"
                        value={answerContent}
                        onChange={(event) => setAnswerContent(event.target.value)}
                        placeholder="문의자에게 전달할 답변을 입력해 주세요."
                        maxLength={2000}
                        disabled={isActionPending}
                        className="min-h-[120px] w-full resize-none bg-transparent text-sm leading-6 text-foreground outline-none placeholder:text-muted disabled:text-muted"
                      />
                      <div className="mt-2 flex items-center justify-end text-xs text-muted">
                        {answerCountLabel}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        onClick={() => setIsCloseModalOpen(true)}
                        disabled={isActionPending}
                        className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isClosePending ? "종료 중..." : "문의 종료"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          void handleSubmitAnswer();
                        }}
                        disabled={isAnswerDisabled}
                        className="rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {isAnswerPending ? "답변 등록 중..." : "답변 등록"}
                      </button>
                    </div>
                  </div>
                </section>
              )}
            </div>

          </div>
        )}
      </div>

      {inquiry && isCloseModalOpen ? (
        <AdminInquiryCloseModal
          inquiry={inquiry}
          isPending={isClosePending}
          onClose={() => {
            if (!isClosePending) {
              setIsCloseModalOpen(false);
            }
          }}
          onConfirm={() => {
            void handleConfirmClose();
          }}
        />
      ) : null}
    </>
  );

  if (isSheet) {
    return <div className={wrapperClassName}>{content}</div>;
  }

  return <aside className={wrapperClassName}>{content}</aside>;
}
