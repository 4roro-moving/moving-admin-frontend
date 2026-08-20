export const API_ROUTES = {
  AUTH: {
    LOGIN: "/admin/auth/login",
    REFRESH: "/admin/auth/refresh",
    LOGOUT: "/admin/auth/logout",
    ME: "/admin/auth/me",
  },
  ADMIN: {
    MOVERS: {
      ROOT: "/admin/movers",
    },
    USERS: {
      ROOT: "/admin/users",
    },
    REPORTS: "/admin/reports",
    REVIEWS: {
      ROOT: "/admin/reviews",
      HIDE: (reviewId: number) => `/admin/reviews/${reviewId}/hide`,
      UNHIDE: (reviewId: number) => `/admin/reviews/${reviewId}/unhide`,
    },
    FAQS: {
      ROOT: "/admin/faqs",
      DETAIL: (faqId: number) => `/admin/faqs/${faqId}`,
    },
    NOTICES: {
      ROOT: "/admin/notices",
      DETAIL: (noticeId: number) => `/admin/notices/${noticeId}`,
    },
  },
} as const;
