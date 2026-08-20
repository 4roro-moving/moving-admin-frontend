import { useState } from "react";

export interface RestrictionFormInput {
  action: "SUSPEND" | "RELEASE";
  reason: string;
  internalNote?: string;
}

interface UseAccountRestrictionFormOptions {
  initialAction: RestrictionFormInput["action"];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (input: RestrictionFormInput) => void;
}

export function useAccountRestrictionForm({
  initialAction,
  isPending,
  onClose,
  onSubmit,
}: UseAccountRestrictionFormOptions) {
  const [reason, setReason] = useState("");
  const [isReasonTouched, setIsReasonTouched] = useState(false);
  const [internalNote, setInternalNote] = useState("");
  const [isInternalNoteTouched, setIsInternalNoteTouched] = useState(false);

  const trimmedReason = reason.trim();
  const trimmedInternalNote = internalNote.trim();
  const isReasonValid =
    trimmedReason.length >= 1 && trimmedReason.length <= 500;
  const isInternalNoteValid = trimmedInternalNote.length <= 1_000;

  const handleClose = () => {
    if (isPending) return;
    setReason("");
    setIsReasonTouched(false);
    setInternalNote("");
    setIsInternalNoteTouched(false);
    onClose();
  };

  const handleSubmit = () => {
    if (!isReasonValid || !isInternalNoteValid || isPending) {
      setIsReasonTouched(true);
      return;
    }

    onSubmit({
      action: initialAction,
      reason: trimmedReason,
      ...(trimmedInternalNote && { internalNote: trimmedInternalNote }),
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
