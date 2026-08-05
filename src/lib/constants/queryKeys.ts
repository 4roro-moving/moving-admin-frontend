export const QUERY_KEYS = {
  AUTH: {
    ADMIN_SESSION: ["auth", "admin-session"] as const,
  },
  REPORTS: {
    ALL: ["admin", "reports"] as const,
  },
  REVIEWS: {
    ALL: ["admin", "reviews"] as const,
    LIST: (
      page: number,
      limit: number,
      keyword: string,
      sort: "LATEST" | "OLDEST" | "RATING_HIGH" | "RATING_LOW" | "REPORT_HIGH",
    ) => ["admin", "reviews", { page, limit, keyword, sort }] as const,
  },
} as const;
