"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { moderateAdminReport } from "@/lib/api/adminReports";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { AdminReportModerationPayload } from "@/types/adminReport";

interface ModerateVariables {
  reportId: number;
  payload: AdminReportModerationPayload;
}

export function useAdminReportModeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reportId, payload }: ModerateVariables) => moderateAdminReport(reportId, payload),
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.REPORTS.DETAIL(variables.reportId),
      });

      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS.ALL });
    },
  });
}
