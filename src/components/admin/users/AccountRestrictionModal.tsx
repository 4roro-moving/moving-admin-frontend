"use client";

import FormField from "@/components/admin/common/FormField";
import Textarea from "@/components/admin/common/Textarea";
import Modal, {
  RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME,
} from "@/components/admin/common/Modal/Modal";
import Text from "@/components/admin/common/Text";
import {
  useAccountRestrictionForm,
  type RestrictionFormInput,
} from "@/hooks/useAccountRestrictionForm";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";

interface AccountRestrictionModalProps {
  error?: unknown;
  initialAction: RestrictionFormInput["action"];
  open: boolean;
  isPending?: boolean;
  onClose: () => void;
  onSubmit: (input: RestrictionFormInput) => void;
}

const MAX_REASON_LENGTH = 500;
const MAX_INTERNAL_NOTE_LENGTH = 1_000;

export default function AccountRestrictionModal({
  error,
  initialAction,
  open,
  isPending = false,
  onClose,
  onSubmit,
}: AccountRestrictionModalProps) {
  const isSuspending = initialAction === "SUSPEND";

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
  } = useAccountRestrictionForm({
    initialAction,
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
      className={RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME}
      dismissible={false}
    >
      <div className="flex w-full flex-col gap-modal-8">
        <div className="flex w-full items-center justify-between gap-modal-16">
          <Modal.Title>{isSuspending ? "계정 정지" : "정지 해제"}</Modal.Title>
          <Modal.Close onClose={handleClose} disabled={isPending} />
        </div>
        <Modal.Desc className="text-text-subtle">
          {isSuspending
            ? "해당 사용자의 서비스 이용을 제한합니다."
            : "제한된 서비스 이용을 다시 허용합니다."}
        </Modal.Desc>
      </div>

      {error ? (
        <Text
          as="p"
          variant="sm-medium"
          className="text-status-suspended-foreground"
        >
          {getApiErrorMessage(
            error,
            isSuspending
              ? "계정 정지에 실패했습니다."
              : "정지 해제에 실패했습니다.",
          )}
        </Text>
      ) : null}

      <div className="flex min-h-0 w-full flex-1 flex-col gap-modal-20 overflow-y-auto">
        <FormField
          label="사유"
          labelFor="restriction-reason"
          variant="compact"
          required
          className="gap-modal-4"
        >
          <div className="flex flex-col gap-modal-10">
            <Text as="p" variant="md-regular" className="text-text-subtle">
              운영팀 내부 참고용 메모입니다. 고객과 기사에게 공개되지 않습니다.
            </Text>
            <div className="flex flex-col gap-modal-4">
              <Textarea
                id="restriction-reason"
                value={reason}
                maxLength={MAX_REASON_LENGTH}
                disabled={isPending}
                error={
                  isReasonTouched && !isReasonValid
                    ? `사유는 1자 이상 ${MAX_REASON_LENGTH}자 이하로 입력해 주세요.`
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
          labelFor="restriction-internal-note"
          variant="compact"
          className="gap-modal-4"
        >
          <div className="flex flex-col gap-modal-10">
            <Text as="p" variant="md-regular" className="text-text-subtle">
              운영팀 내부 참고용 메모입니다. 고객과 기사에게 공개되지 않습니다.
            </Text>
            <div className="flex flex-col gap-modal-4">
              <Textarea
                id="restriction-internal-note"
                value={internalNote}
                maxLength={MAX_INTERNAL_NOTE_LENGTH}
                disabled={isPending}
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
        {isPending ? "처리 중..." : isSuspending ? "정지 처리" : "정지 해제"}
      </Modal.Button>
    </Modal>
  );
}
