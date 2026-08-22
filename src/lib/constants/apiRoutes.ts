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
    REVIEWS: {
      ROOT: "/admin/reviews",
      HIDE: (reviewId: number) => `/admin/reviews/${reviewId}/hide`,
      UNHIDE: (reviewId: number) => `/admin/reviews/${reviewId}/unhide`,
    },
    FAQS: {
      ROOT: "/admin/faqs",
      DETAIL: (faqId: number) => `/admin/faqs/${faqId}`,
    },
    INQUIRIES: {
      ROOT: "/admin/inquiries",
      DETAIL: (inquiryId: number) => `/admin/inquiries/${inquiryId}`,
      ANSWER: (inquiryId: number) => `/admin/inquiries/${inquiryId}/answer`,
      CLOSE: (inquiryId: number) => `/admin/inquiries/${inquiryId}/close`,
    },
    NOTICES: {
      ROOT: "/admin/notices",
      DETAIL: (noticeId: number) => `/admin/notices/${noticeId}`,
    },
  },
} as const;
