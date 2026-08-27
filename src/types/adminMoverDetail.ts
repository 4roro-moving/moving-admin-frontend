import type { AdminAuthProvider } from "@/types/adminCustomer";
import type { AdminMoveType } from "@/types/adminMover";
import type {
  AdminAccountStatus,
  AdminInquiryHistory,
  AdminReportHistory,
  AdminSuspensionHistory,
  AdminTargetReportHistory,
} from "@/types/adminUser";

export interface AdminMoverDetail {
  account: {
    id: string;
    email: string;
    name: string;
    phone: string | null;
    authProvider: AdminAuthProvider;
    status: AdminAccountStatus;
    isProfileCompleted: boolean;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    nickname: string | null;
    imageUrl: string | null;
    career: number;
    shortIntro: string;
    description: string | null;
    confirmedCount: number;
    serviceAreas: string[];
    serviceTypes: AdminMoveType[];
  };
  reviewStatistics: {
    totalCount: number;
    visibleCount: number;
    hiddenCount: number;
    visibleAverageRating: number;
  };
  estimateActivity: {
    inProgress: {
      totalCount: number;
      items: Array<{
        id: number;
        estimateRequestId: number;
        status: "SENT" | "CONFIRMED";
        price: number;
        customer: {
          id: string;
          name: string;
        };
        moveType: AdminMoveType;
        moveDate: string;
        confirmedAt: string | null;
        cancelable: boolean;
        createdAt: string;
      }>;
    };
    recent: {
      totalCount: number;
      items: Array<{
        id: number;
        estimateRequestId: number;
        status: "COMPLETED" | "CANCELED" | "EXPIRED";
        price: number;
        customer: {
          id: string;
          name: string;
        };
        moveType: AdminMoveType;
        moveDate: string;
        confirmedAt: string | null;
        expiredAt: string | null;
        canceledAt: string | null;
        createdAt: string;
      }>;
    };
  };
  reviewHistory: {
    totalCount: number;
    items: Array<{
      id: number;
      customerId: string;
      rating: number;
      content: string;
      isHidden: boolean;
      createdAt: string;
    }>;
  };
  reportHistory: {
    filed: AdminTargetReportHistory;
    received: AdminReportHistory;
  };
  inquiryHistory: AdminInquiryHistory;
  suspensionHistory: AdminSuspensionHistory;
}
