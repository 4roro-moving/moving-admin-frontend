import { getCurrentAdmin, refreshAdminSession } from "@/lib/api/auth";
import { useAdminAuthStore } from "@/stores/useAdminAuthStore";

let recoverSessionPromise: Promise<void> | null = null;

export async function recoverAdminSession(): Promise<void> {
  if (recoverSessionPromise) {
    return recoverSessionPromise;
  }

  recoverSessionPromise = (async () => {
    const store = useAdminAuthStore.getState();

    if (store.isAuthenticated && store.accessToken) {
      store.setCheckingAuth(false);
      return;
    }

    store.setCheckingAuth(true);

    try {
      const accessToken = await refreshAdminSession();
      const user = await getCurrentAdmin(accessToken);

      if (useAdminAuthStore.getState().isAuthenticated) {
        return;
      }

      useAdminAuthStore.getState().establishSession({ user, accessToken });
    } catch {
      if (useAdminAuthStore.getState().isAuthenticated) {
        return;
      }

      useAdminAuthStore.getState().clearSession();
    } finally {
      const { isCheckingAuth, isAuthenticated } = useAdminAuthStore.getState();

      if (isCheckingAuth && !isAuthenticated) {
        useAdminAuthStore.getState().setCheckingAuth(false);
      }
    }
  })().finally(() => {
    recoverSessionPromise = null;
  });

  return recoverSessionPromise;
}
