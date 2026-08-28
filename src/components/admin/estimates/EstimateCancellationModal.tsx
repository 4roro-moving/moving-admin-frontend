"use client";

import FormField from "@/components/admin/common/FormField";
import Modal, {
  RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME,
} from "@/components/admin/common/Modal/Modal";
import Text from "@/components/admin/common/Text";
import Textarea from "@/components/admin/common/Textarea";
import {
  MAX_INTERNAL_NOTE_LENGTH,
  MAX_REASON_LENGTH,
  useReasonWithNoteForm,
} from "@/hooks/useReasonWithNoteForm";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { formatKoreanDate } from "@/lib/utils/date";
import { cn } from "@/lib/utils/cn";
import type {
  AdminEstimateCancellationPayload,
  AdminEstimateCancellationTarget,
} from "@/types/adminEstimate";

interface EstimateCancellationModalProps {
  error?: unknown;
  isPending?: boolean;
  open: boolean;
  target: AdminEstimateCancellationTarget;
  onClose: () => void;
  onSubmit: (payload: AdminEstimateCancellationPayload) => void;
}

export default function EstimateCancellationModal({
  error,
  isPending = false,
  open,
  target,
  onClose,
  onSubmit,
}: EstimateCancellationModalProps) {
  const {
    reason,
    internalNote,
    isReasonTouched,
    isInternalNoteTouched,
    isReasonValid,
    isInternalNoteValid,
    canSubmit,
    setReason,
    setInternalNote,
    handleReasonBlur,
    handleInternalNoteBlur,
    handleClose,
    handleSubmit,
  } = useReasonWithNoteForm({
    isPending,
    onClose,
    onSubmit,
  });

  return (
    <Modal
      open={open}
      onClose={isPending ? undefined : handleClose}
      presentation="responsive"
      size="lg"
      className={cn(
        RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME,
        "gap-modal-16 xl:gap-modal-24",
      )}
      dismissible={false}
    >
      <div className="flex w-full flex-col gap-modal-8">
        <div className="flex w-full items-center justify-between gap-modal-16">
          <Modal.Title>확정 견적 취소</Modal.Title>
          <Modal.Close onClose={handleClose} disabled={isPending} />
        </div>
        <Modal.Desc className="text-text-subtle">
          취소 시 고객과 기사에게 안내되며, 견적 요청과 견적은 취소됩니다. 이
          작업은 되돌릴 수 없습니다.
        </Modal.Desc>
      </div>

      {error ? (
        <Text
          as="p"
          variant="sm-medium"
          className="text-status-suspended-foreground"
        >
          {getApiErrorMessage(error, "확정 견적 취소에 실패했습니다.")}
        </Text>
      ) : null}

      <div className="flex min-h-0 w-full flex-1 flex-col gap-modal-20 overflow-y-auto">
        <div className="flex flex-col gap-modal-10 rounded-modal-12 border border-border bg-background-muted p-modal-14">
          <Text as="h3" variant="md-semibold" className="text-text-primary">
            취소 대상 견적
          </Text>
          <dl className="grid grid-cols-1 gap-x-modal-20 gap-y-modal-8 sm:grid-cols-2">
            <div className="flex flex-col gap-modal-4">
              <Text as="dt" variant="xs-regular" className="text-text-subtle">
                고객
              </Text>
              <Text as="dd" variant="md-medium" className="text-text-primary">
                {target.customerName}
              </Text>
            </div>
            <div className="flex flex-col gap-modal-4">
              <Text as="dt" variant="xs-regular" className="text-text-subtle">
                기사
              </Text>
              <Text as="dd" variant="md-medium" className="text-text-primary">
                {target.moverNickname} ({target.moverName})
              </Text>
            </div>
            <div className="flex flex-col gap-modal-4">
              <Text as="dt" variant="xs-regular" className="text-text-subtle">
                이사 예정일
              </Text>
              <Text as="dd" variant="md-medium" className="text-text-primary">
                {formatKoreanDate(target.moveDate)}
              </Text>
            </div>
            <div className="flex flex-col gap-modal-4">
              <Text as="dt" variant="xs-regular" className="text-text-subtle">
                확정 견적가
              </Text>
              <Text as="dd" variant="md-medium" className="text-text-primary">
                {target.price.toLocaleString("ko-KR")}원
              </Text>
            </div>
          </dl>
        </div>

        <FormField
          label="취소 사유"
          labelFor="estimate-cancellation-reason"
          variant="compact"
          required
          className="gap-modal-4"
        >
          <div className="flex flex-col gap-modal-10">
            <Text as="p" variant="md-regular" className="text-text-subtle">
              관리자 활동 로그에 기록되는 사유입니다. 고객과 기사에게 공개되지
              않습니다.
            </Text>
            <div className="flex flex-col gap-modal-4">
              <Textarea
                id="estimate-cancellation-reason"
                value={reason}
                maxLength={MAX_REASON_LENGTH}
                disabled={isPending}
                className="h-modal-100"
                error={
                  isReasonTouched && !isReasonValid
                    ? `취소 사유는 1자 이상 ${MAX_REASON_LENGTH}자 이하로 입력해 주세요.`
                    : undefined
                }
                onChange={(event) => setReason(event.target.value)}
                onBlur={handleReasonBlur}
              />
              <Text
                as="span"
                variant="xs-regular"
                className="text-text-muted self-end"
              >
                {reason.length}/{MAX_REASON_LENGTH}
              </Text>
            </div>
          </div>
        </FormField>

        <FormField
          label="관리자 내부 메모"
          labelFor="estimate-cancellation-internal-note"
          variant="compact"
          className="gap-modal-4"
        >
          <div className="flex flex-col gap-modal-10">
            <Text as="p" variant="md-regular" className="text-text-subtle">
              운영팀 내부 참고용 메모입니다. 고객과 기사에게 공개되지 않습니다.
            </Text>
            <div className="flex flex-col gap-modal-4">
              <Textarea
                id="estimate-cancellation-internal-note"
                value={internalNote}
                maxLength={MAX_INTERNAL_NOTE_LENGTH}
                disabled={isPending}
                className="h-modal-100"
                error={
                  isInternalNoteTouched && !isInternalNoteValid
                    ? `관리자 내부 메모는 ${MAX_INTERNAL_NOTE_LENGTH}자 이하로 입력해 주세요.`
                    : undefined
                }
                onChange={(event) => setInternalNote(event.target.value)}
                onBlur={handleInternalNoteBlur}
              />
              <Text
                as="span"
                variant="xs-regular"
                className="text-text-muted self-end"
              >
                {internalNote.length}/{MAX_INTERNAL_NOTE_LENGTH}
              </Text>
            </div>
          </div>
        </FormField>
      </div>

      <Modal.Button
        fullWidth
        size="cta"
        disabled={!canSubmit}
        onClick={handleSubmit}
      >
        {isPending ? "취소 처리 중..." : "확정 견적 취소"}
      </Modal.Button>
    </Modal>
  );
}
