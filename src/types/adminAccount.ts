import type { AdminRole } from "@/types/auth";

export interface CreateAdminAccountPayload {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export interface CreatedAdminAccount {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  role: "ADMIN";
  adminRole: AdminRole;
  isActive: boolean;
  createdAt: string;
}
