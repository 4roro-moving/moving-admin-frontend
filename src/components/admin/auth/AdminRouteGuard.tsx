"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";

import {
  canAccessAdminPath,
  getAdminHomeRoute,
  hasValidAdminSession,
} from "@/lib/auth/adminRole";
import { APP_ROUTES } from "@/lib/constants/appRoutes";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

function AdminAuthLoading() {
  return (
    <div className="bg-background text-muted flex min-h-screen items-center justify-center px-6 py-12">
      <p className="text-sm font-medium">관리자 세션을 확인하는 중입니다...</p>
    </div>
  );
}

export default function AdminRouteGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isCheckingAuth = useAdminAuthStore((state) => state.isCheckingAuth);
  const isAuthenticated = useAdminAuthStore((state) => state.isAuthenticated);
  const userRole = useAdminAuthStore((state) => state.user?.role);
  const adminRole = useAdminAuthStore((state) => state.user?.adminRole);

  const loggedIn = hasValidAdminSession(isAuthenticated, userRole, adminRole);
  const authorized = loggedIn && canAccessAdminPath(adminRole, pathname);

  useEffect(() => {
    if (isCheckingAuth) {
      return;
    }

    if (!loggedIn) {
      router.replace(APP_ROUTES.LOGIN);
      return;
    }

    if (!authorized) {
      router.replace(getAdminHomeRoute(adminRole));
    }
  }, [
    adminRole,
    authorized,
    isAuthenticated,
    isCheckingAuth,
    router,
    userRole,
  ]);

  if (isCheckingAuth) {
    return <AdminAuthLoading />;
  }

  if (!authorized) {
    return <AdminAuthLoading />;
  }

  return children;
}
