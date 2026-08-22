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
      DETAIL: (moverId: string) => `/admin/movers/${moverId}`,
      STATUS: (moverId: string) => `/admin/movers/${moverId}/status`,
    },
    USERS: {
      ROOT: "/admin/users",
      DETAIL: (userId: string) => `/admin/users/${userId}`,
      STATUS: (userId: string) => `/admin/users/${userId}/status`,
    },
    ESTIMATES: {
      CANCEL: (estimateId: number) => `/admin/estimates/${estimateId}/cancel`,
    },
    REPORTS: "/admin/reports",
    // 2026.08.22 신영미 콘텐츠 관리 경로 추가
    REVIEWS: {
      ROOT: "/admin/reviews",
      HIDE: (reviewId: number) => `/admin/reviews/${reviewId}/hide`,
      UNHIDE: (reviewId: number) => `/admin/reviews/${reviewId}/unhide`,
    },
    RESIDENCE_REVIEWS: {
      ROOT: "/admin/residence-reviews",
      HIDE: (residenceReviewId: number) =>
        `/admin/residence-reviews/${residenceReviewId}/hide`,
      UNHIDE: (residenceReviewId: number) =>
        `/admin/residence-reviews/${residenceReviewId}/unhide`,
    },
  },
} as const;
