"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutAdmin } from "@/lib/api/auth";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export default function AdminHeader() {
  const router = useRouter();
  const clearSession = useAdminAuthStore((state) => state.clearSession);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutAdmin();
    } catch {
      // 서버 logout은 멱등 — 로컬 세션은 항상 정리합니다.
    } finally {
      clearSession();
      router.replace(APP_ROUTES.LOGIN);
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-surface border-border flex items-center justify-between border-b px-6 py-4">
      <div>
        <p className="text-muted text-xs font-medium tracking-[0.2em]">MOVING ADMIN</p>
        <h1 className="text-lg font-semibold">관리자 영역</h1>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="border-border text-muted rounded-lg border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-80"
      >
        {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
      </button>
    </header>
  );
}
