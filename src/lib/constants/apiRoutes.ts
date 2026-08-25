export const API_ROUTES = {
  AUTH: {
    LOGIN: "/admin/auth/login",
    REFRESH: "/admin/auth/refresh",
    LOGOUT: "/admin/auth/logout",
    ME: "/admin/auth/me",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
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
    GIVEAWAYS: {
      ROOT: "/admin/giveaways",
      HIDE: (giveawayId: number) => `/admin/giveaways/${giveawayId}/hide`,
      UNHIDE: (giveawayId: number) => `/admin/giveaways/${giveawayId}/unhide`,
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
    TERMS: {
      ROOT: "/admin/terms",
      DETAIL: (termsId: number) => `/admin/terms/${termsId}`,
      // 초안을 게시본으로 승격. 같은 유형의 기존 게시본은 서버가 보관 처리한다.
      PUBLISH: (termsId: number) => `/admin/terms/${termsId}/publish`,
    },
  },
} as const;
