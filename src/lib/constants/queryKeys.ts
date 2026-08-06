export const QUERY_KEYS = {
  AUTH: {
    ADMIN_SESSION: ["auth", "admin-session"] as const,
  },
  REPORTS: {
    ALL: ["admin", "reports"] as const,
  },
  REVIEWS: {
    ALL: ["admin", "reviews"] as const,
    LIST: (params: {
      page: number;
      limit: number;
      keyword: string;
      sort: "LATEST" | "OLDEST" | "RATING_HIGH" | "RATING_LOW" | "REPORT_HIGH";
      isHidden?: boolean;
      reportedOnly?: boolean;
    }) => ["admin", "reviews", "list", params] as const,
  },
} as const;
