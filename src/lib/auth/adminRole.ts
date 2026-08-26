import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { AdminRole } from "@/types/auth";

export function isSuperAdmin(adminRole: AdminRole | undefined): boolean {
  return adminRole === "SUPER_ADMIN";
}

export function getAdminHomeRoute(adminRole: AdminRole | undefined): string {
  return isSuperAdmin(adminRole)
    ? APP_ROUTES.CREATE_ADMIN
    : APP_ROUTES.DASHBOARD;
}

export function isSuperAdminOnlyPath(pathname: string): boolean {
  return (
    pathname === APP_ROUTES.CREATE_ADMIN ||
    pathname.startsWith(`${APP_ROUTES.CREATE_ADMIN}/`)
  );
}
