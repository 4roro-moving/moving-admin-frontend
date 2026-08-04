export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
  },
  ADMIN: {
    REPORTS: "/admin/reports",
    REVIEWS: "/admin/reviews",
  },
} as const;

// TODO: 백엔드 /api/admin/* 실제 경로와 세부 endpoint 명세를 연결 단계에서 재확인합니다.
