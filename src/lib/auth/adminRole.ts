import { APP_ROUTES } from "@/lib/constants/appRoutes";
import type { AdminRole } from "@/types/auth";

export function isSuperAdmin(adminRole: AdminRole | undefined): boolean {
  return adminRole === "SUPER_ADMIN";
}

export function canAccessAdminAccountManagement(
  adminRole: AdminRole | undefined,
): boolean {
  return isSuperAdmin(adminRole);
}

export function getAdminHomeRoute(adminRole: AdminRole | undefined): string {
  if (isSuperAdmin(adminRole)) {
    return APP_ROUTES.CREATE_ADMIN;
  }

  return APP_ROUTES.DASHBOARD;
}
