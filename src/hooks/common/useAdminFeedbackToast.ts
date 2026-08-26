"use client";

import { useEffect, useState } from "react";

export const ADMIN_FEEDBACK_TOAST_DURATION_MS = 3200;

export function useAdminFeedbackToast<T>(
  durationMs = ADMIN_FEEDBACK_TOAST_DURATION_MS,
) {
  const [feedback, setFeedback] = useState<T | null>(null);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => {
      setFeedback(null);
    }, durationMs);

    return () => {
      window.clearTimeout(timer);
    };
  }, [durationMs, feedback]);

  return [feedback, setFeedback] as const;
}
