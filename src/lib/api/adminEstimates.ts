import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { ApiResponse } from "@/types/api";
import type {
  AdminEstimateCancellationPayload,
  AdminEstimateCancellationResult,
} from "@/types/adminEstimate";

export async function cancelAdminEstimate(
  estimateId: number,
  payload: AdminEstimateCancellationPayload,
): Promise<AdminEstimateCancellationResult> {
  const result = await fetchInstance.patch<
    ApiResponse<AdminEstimateCancellationResult>
  >(
    API_ROUTES.ADMIN.ESTIMATES.CANCEL(estimateId),
    payload,
  );

  return result.data;
}
