import { fetchInstance } from "@/lib/api/fetchInstance";
import { API_ROUTES } from "@/lib/constants/apiRoutes";
import type { AdminEstimateCancellationPayload } from "@/types/adminEstimate";

export async function cancelAdminEstimate(
  estimateId: number,
  payload: AdminEstimateCancellationPayload,
): Promise<void> {
  await fetchInstance.patch<unknown>(
    API_ROUTES.ADMIN.ESTIMATES.CANCEL(estimateId),
    payload,
  );
}
