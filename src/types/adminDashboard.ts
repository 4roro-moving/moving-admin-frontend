export interface AdminDashboardMetric {
  label: string;
  value: string;
  helper: string;
  tone?: "default" | "accent";
}

export interface AdminDashboardRecentItem {
  id: string;
  status: string;
  statusTone: "pending" | "resolved";
  primary: string;
  meta: string;
}

export interface AdminDashboardServiceStage {
  label: string;
  value: string;
  highlighted?: boolean;
  valueSize?: "default" | "large";
}

export interface AdminDashboardContentSummaryItem {
  label: string;
  value: string;
  tone?: "default" | "accent";
}

export interface AdminDashboardActivityItem {
  action: string;
  memo: string;
  timeAgo: string;
}

export interface AdminDashboardData {
  pageTitle: string;
  pageDescription: string;
  metrics: AdminDashboardMetric[];
  recentReports: {
    title: string;
    description: string;
    actionLabel: string;
    items: AdminDashboardRecentItem[];
  };
  recentInquiries: {
    title: string;
    description: string;
    actionLabel: string;
    items: AdminDashboardRecentItem[];
  };
  serviceOverview: {
    title: string;
    description: string;
    stages: AdminDashboardServiceStage[];
  };
  contentSummary: {
    title: string;
    description: string;
    items: AdminDashboardContentSummaryItem[];
  };
  recentActivities: {
    title: string;
    description: string;
    items: AdminDashboardActivityItem[];
  };
}
