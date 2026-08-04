export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN";
}

export interface AdminSession {
  user: AdminUser;
  accessToken: string;
}

export interface AdminLoginInput {
  email: string;
  password: string;
}
