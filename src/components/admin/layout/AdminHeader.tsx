"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { logoutAdmin } from "@/lib/api/auth";
import { getApiErrorMessage } from "@/lib/api/getApiErrorMessage";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export default function AdminHeader() {
  const router = useRouter();
  const clearSession = useAdminAuthStore((state) => state.clearSession);
  const [logoutError, setLogoutError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLogoutError(null);
    setIsLoggingOut(true);

    try {
      await logoutAdmin();
      clearSession();
      router.replace(APP_ROUTES.LOGIN);
    } catch (error) {
      setLogoutError(
        getApiErrorMessage(error, "로그아웃에 실패했습니다. 다시 시도해 주세요."),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-surface flex h-[74px] items-center border-b border-[#d9d9d9] px-6 py-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-muted text-sm font-normal">MOVING ADMIN</p>
        <h1 className="text-[18px] font-bold text-[#262524]">관리자 영역</h1>
      </div>

      <div className="flex items-center gap-3">
        {logoutError ? (
          <p className="text-sm text-red-600" role="alert">
            {logoutError}
          </p>
        ) : null}

        <div className="flex items-center gap-2 rounded-xl border border-[#e6e6e6] bg-surface py-1.5 pr-2.5 pl-2">
          <div className="flex size-7 items-center justify-center rounded-full bg-[#fdf1ec] text-sm font-normal text-[#bfa49a]">
            A
          </div>
          <div className="flex flex-col text-sm leading-[1.2] text-[#262524]">
            <span className="font-normal">관리자</span>
            <span className="font-normal">SUPER ADMIN</span>
          </div>
          <span className="text-sm font-normal text-muted">⌄</span>
        </div>

        <button
          type="button"
          onClick={() => {
            void handleLogout();
          }}
          disabled={isLoggingOut}
          className="border-border text-muted rounded-lg border px-4 py-2 text-sm font-medium hover:bg-background-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoggingOut ? "로그아웃 중" : "로그아웃"}
        </button>
      </div>
    </header>
  );
}
