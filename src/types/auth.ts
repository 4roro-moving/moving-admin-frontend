export type AdminRole = "ADMIN" | "SUPER_ADMIN";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
  /** AdminProfile.adminRole에서 추출. User.role(ADMIN)과 구분한다. */
  adminRole: AdminRole;
}

export interface AdminSession {
  user: AdminUser;
  accessToken: string;
}

export interface AdminLoginResponse {
  admin: AdminUser;
  tokens: {
    accessToken: string;
  };
}

export interface AdminRefreshResponse {
  tokens: {
    accessToken: string;
  };
}

export interface AdminMeResponse {
  admin: AdminUser;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}
