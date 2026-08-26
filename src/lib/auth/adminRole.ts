import type { AdminRole } from "@/types/auth";

export function isSuperAdmin(adminRole: AdminRole | undefined): boolean {
  return adminRole === "SUPER_ADMIN";
}
