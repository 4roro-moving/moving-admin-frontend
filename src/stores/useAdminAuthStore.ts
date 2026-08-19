import { create } from "zustand";

import type { AdminUser } from "@/types/auth";

interface AdminAuthState {
  user: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  establishSession: (payload: { user: AdminUser; accessToken: string }) => void;
  clearSession: () => void;
  setCheckingAuth: (value: boolean) => void;
}

export const useAdminAuthStore = create<AdminAuthState>((set) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  // 앱 최초 로드 시 세션 복구가 시작되기 전 Guard redirect를 막습니다.
  isCheckingAuth: true,
  establishSession: ({ user, accessToken }) =>
    set({
      user,
      accessToken,
      isAuthenticated: true,
      isCheckingAuth: false,
    }),
  clearSession: () =>
    set({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    }),
  setCheckingAuth: (value) =>
    set({
      isCheckingAuth: value,
    }),
}));
