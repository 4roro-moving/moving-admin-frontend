"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Text from "@/components/admin/common/Text";
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
        getApiErrorMessage(
          error,
          "로그아웃에 실패했습니다. 다시 시도해 주세요.",
        ),
      );
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-surface border-border flex items-center justify-between border-b px-6 py-4">
      <div>
        <Text
          as="p"
          variant="xs-medium"
          className="text-muted tracking-[0.2em]"
        >
          MOVING ADMIN
        </Text>
        <Text as="h1" variant="lg-semibold" className="text-foreground">
          관리자 영역
        </Text>
      </div>

      <div className="flex items-center gap-3">
        {logoutError ? (
          <Text
            as="p"
            variant="md-regular"
            className="text-red-600"
            role="alert"
          >
            {logoutError}
          </Text>
        ) : null}
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
