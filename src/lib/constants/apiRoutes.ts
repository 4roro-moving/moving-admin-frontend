export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REFRESH: "/auth/refresh",
    LOGOUT: "/auth/logout",
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
