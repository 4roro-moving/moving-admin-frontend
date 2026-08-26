"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import Text from "@/components/admin/common/Text";
import { canAccessAdminAccountManagement } from "@/lib/auth/adminRole";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

function SuperAdminAuthLoading({ message }: { message: string }) {
  return (
    <div className="border-border bg-surface rounded-2xl border px-5 py-6">
      <Text as="p" variant="md-medium" className="text-muted">
        {message}
      </Text>
    </div>
  );
}

export default function SuperAdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isCheckingAuth = useAdminAuthStore((state) => state.isCheckingAuth);
  const adminRole = useAdminAuthStore((state) => state.user?.adminRole);
  const allowed = canAccessAdminAccountManagement(adminRole);

  useEffect(() => {
    if (isCheckingAuth || allowed) {
      return;
    }

    router.replace(APP_ROUTES.DASHBOARD);
  }, [allowed, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return <SuperAdminAuthLoading message="관리자 권한을 확인하는 중입니다..." />;
  }

  if (!allowed) {
    return <SuperAdminAuthLoading message="접근 권한이 없어 이동합니다..." />;
  }

  return children;
}
