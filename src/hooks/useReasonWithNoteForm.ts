import { useState } from "react";

export const MAX_REASON_LENGTH = 500;
export const MAX_INTERNAL_NOTE_LENGTH = 1_000;

export interface ReasonWithNoteFormInput {
  reason: string;
  internalNote?: string;
}

interface UseReasonWithNoteFormOptions {
  isPending: boolean;
  onClose: () => void;
  onSubmit: (input: ReasonWithNoteFormInput) => void;
}

export function useReasonWithNoteForm({
  isPending,
  onClose,
  onSubmit,
}: UseReasonWithNoteFormOptions) {
  const [reason, setReason] = useState("");
  const [internalNote, setInternalNote] = useState("");
  const [isReasonTouched, setIsReasonTouched] = useState(false);
  const [isInternalNoteTouched, setIsInternalNoteTouched] = useState(false);

  const trimmedReason = reason.trim();
  const trimmedInternalNote = internalNote.trim();
  const isReasonValid =
    trimmedReason.length >= 1 && trimmedReason.length <= MAX_REASON_LENGTH;
  const isInternalNoteValid =
    trimmedInternalNote.length <= MAX_INTERNAL_NOTE_LENGTH;

  const handleClose = () => {
    if (isPending) return;

    setReason("");
    setInternalNote("");
    setIsReasonTouched(false);
    setIsInternalNoteTouched(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!isReasonValid || !isInternalNoteValid || isPending) {
      setIsReasonTouched(true);
      setIsInternalNoteTouched(true);
      return;
    }

    onSubmit({
      reason: trimmedReason,
      ...(trimmedInternalNote ? { internalNote: trimmedInternalNote } : {}),
    });
  };

  return {
    reason,
    internalNote,
    isReasonTouched,
    isInternalNoteTouched,
    isReasonValid,
    isInternalNoteValid,
    canSubmit: isReasonValid && isInternalNoteValid && !isPending,
    setReason,
    setInternalNote,
    handleReasonBlur: () => setIsReasonTouched(true),
    handleInternalNoteBlur: () => setIsInternalNoteTouched(true),
    handleClose,
    handleSubmit,
  };
}
