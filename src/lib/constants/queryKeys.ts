export const QUERY_KEYS = {
  AUTH: {
    ADMIN_SESSION: ["auth", "admin-session"] as const,
  },
  REPORTS: {
    ALL: ["admin", "reports"] as const,
  },
  REVIEWS: {
    ALL: ["admin", "reviews"] as const,
  },
} as const;
