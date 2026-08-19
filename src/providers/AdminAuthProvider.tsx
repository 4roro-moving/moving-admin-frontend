"use client";

import { useEffect, type ReactNode } from "react";

import { fetchCurrentAdmin, refreshAdminSession } from "@/lib/api/auth";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export default function AdminAuthProvider({ children }: { children: ReactNode }) {
  const establishSession = useAdminAuthStore((state) => state.establishSession);
  const clearSession = useAdminAuthStore((state) => state.clearSession);
  const setCheckingAuth = useAdminAuthStore((state) => state.setCheckingAuth);
  const isCheckingAuth = useAdminAuthStore((state) => state.isCheckingAuth);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const accessToken = await refreshAdminSession();
        const user = await fetchCurrentAdmin();
        establishSession({ user, accessToken });
      } catch {
        clearSession();
      } finally {
        setCheckingAuth(false);
      }
    };

    void restoreSession();
  }, [clearSession, establishSession, setCheckingAuth]);

  if (isCheckingAuth) {
    return <div className="bg-background min-h-screen" aria-label="세션 확인 중" />;
  }

  return children;
}
