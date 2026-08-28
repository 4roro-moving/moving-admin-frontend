import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { AdminRole } from "@/types/auth";

export const SUPER_ADMIN_ONLY_ROUTES = [APP_ROUTES.CREATE_ADMIN] as const;

export function isAdminRole(
  adminRole: string | undefined,
): adminRole is AdminRole {
  return adminRole === "ADMIN" || adminRole === "SUPER_ADMIN";
}

export function hasValidAdminSession(
  isAuthenticated: boolean,
  role: string | undefined,
  adminRole: string | undefined,
): adminRole is AdminRole {
  return isAuthenticated && role === "ADMIN" && isAdminRole(adminRole);
}

export function isSuperAdmin(adminRole: AdminRole | undefined): boolean {
  return adminRole === "SUPER_ADMIN";
}

export function getAdminHomeRoute(adminRole: AdminRole): string {
  return isSuperAdmin(adminRole)
    ? APP_ROUTES.CREATE_ADMIN
    : APP_ROUTES.DASHBOARD;
}

export function isSuperAdminOnlyPath(pathname: string): boolean {
  return SUPER_ADMIN_ONLY_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}

export function canAccessAdminPath(
  adminRole: AdminRole | undefined,
  pathname: string,
): boolean {
  if (!adminRole) {
    return false;
  }

  const isSuperAdminRoute = isSuperAdminOnlyPath(pathname);

  if (isSuperAdmin(adminRole)) {
    return isSuperAdminRoute;
  }

  return !isSuperAdminRoute;
}
