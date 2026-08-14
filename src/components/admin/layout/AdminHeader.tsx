"use client";

import { useRouter } from "next/navigation";

import Text from "@/components/admin/common/Text";
import { logoutAdmin } from "@/lib/api/auth";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

export default function AdminHeader() {
  const router = useRouter();
  const clearSession = useAdminAuthStore((state) => state.clearSession);

  const handleLogout = async () => {
    try {
      await logoutAdmin();
    } finally {
      clearSession();
      router.replace(APP_ROUTES.LOGIN);
    }
  };

  return (
    <header className="bg-surface border-border flex items-center justify-between border-b px-6 py-4">
      <div>
        <Text as="p" variant="xs-medium" className="text-muted tracking-[0.2em]">MOVING ADMIN</Text>
        <Text as="h1" variant="lg-semibold" className="text-foreground">관리자 영역</Text>
      </div>

      <button
        type="button"
        onClick={() => { void handleLogout(); }}
        className="border-border text-muted rounded-lg border px-4 py-2 text-sm font-medium hover:bg-background-hover"
      >
        로그아웃
      </button>
    </header>
  );
}
