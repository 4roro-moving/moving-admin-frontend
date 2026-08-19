"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

function AdminAuthLoading() {
  return (
    <div className="bg-background text-muted flex min-h-screen items-center justify-center px-6 py-12">
      <p className="text-sm font-medium">관리자 세션을 확인하는 중입니다...</p>
    </div>
  );
}

function isAuthorizedAdmin(
  isAuthenticated: boolean,
  role: string | undefined,
): boolean {
  return isAuthenticated && role === "ADMIN";
}

export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const isCheckingAuth = useAdminAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const userRole = useAdminAuthStore((state) => state.user?.role);

  const authorized = isAuthorizedAdmin(isAuthenticated, userRole);

  useEffect(() => {
    if (isCheckingAuth || authorized) {
      return;
    }

    router.replace(APP_ROUTES.LOGIN);
  }, [authorized, isCheckingAuth, router]);

  if (isCheckingAuth) {
    return <AdminAuthLoading />;
  }

  if (!authorized) {
    return <AdminAuthLoading />;
  }

  return children;
}
