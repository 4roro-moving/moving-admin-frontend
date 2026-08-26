"use client";

import { useCallback, useEffect, useState } from "react";

export const ADMIN_FEEDBACK_TOAST_DURATION_MS = 3200;

export function useAdminFeedbackToast<T>(
  durationMs = ADMIN_FEEDBACK_TOAST_DURATION_MS,
) {
  const [feedback, setFeedback] = useState<T | null>(null);
  const [displayId, setDisplayId] = useState(0);

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
  }, [displayId, durationMs, feedback]);

  const showFeedback = useCallback((value: T | null) => {
    setFeedback(value);
    setDisplayId((current) => current + 1);
  }, []);

  return [feedback, showFeedback] as const;
}
