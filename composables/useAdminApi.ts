import type { AdminMe } from "~/types/admin";
import { useApiClient } from "~/composables/useApiClient";

interface AdminRouteContext {
  path: string;
  fullPath: string;
}

export function useAdminApi(routeContext?: AdminRouteContext) {
  const sessionUser = useState<AdminMe | null>("admin-session", () => null);
  const sessionInitialized = useState("admin-session-initialized", () => false);
  const route = routeContext || useRoute();

  const client = useApiClient({
    onUnauthorized: clearSession
  });

  function clearSession() {
    sessionUser.value = null;
    sessionInitialized.value = false;
    if (import.meta.client && route.path.startsWith("/admin") && route.path !== "/admin/login") {
      void navigateTo({ path: "/admin/login", query: { redirect: route.fullPath } });
    }
  }

  return {
    request: client.request,
    upload: client.upload,
    clearSession
  };
}
