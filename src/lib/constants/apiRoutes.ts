export const API_ROUTES = {
  AUTH: {
    LOGIN: "/admin/auth/login",
    REFRESH: "/admin/auth/refresh",
    LOGOUT: "/admin/auth/logout",
    ME: "/admin/auth/me",
  },
  ADMIN: {
    REPORTS: "/admin/reports",
    REVIEWS: {
      ROOT: "/admin/reviews",
      HIDE: (reviewId: number) => `/admin/reviews/${reviewId}/hide`,
      UNHIDE: (reviewId: number) => `/admin/reviews/${reviewId}/unhide`,
    },
  },
} as const;
