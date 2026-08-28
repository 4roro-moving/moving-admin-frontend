"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createAdminAccount } from "@/lib/api/adminAccounts";
import { QUERY_KEYS } from "@/lib/constants/queryKeys";
import type { CreateAdminAccountPayload } from "@/types/adminAccount";

export function useCreateAdminAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAdminAccountPayload) => createAdminAccount(payload),

    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.ADMIN_ACCOUNTS.ALL,
      });
    },
  });
}
