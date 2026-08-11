import type { AdminMe as SessionUser } from "~/types/admin";
import { useApiClient } from "~/composables/useApiClient";

export function useMemberSession() {
  const user = useState<SessionUser | null>("member-session", () => null);
  const initialized = useState("member-session-initialized", () => false);
  const restoring = useState("member-session-restoring", () => false);

  const api = useApiClient({
    onUnauthorized: clearSession
  });

  const isAuthenticated = computed(() => user.value?.authenticated === true);

  async function restore() {
    if (initialized.value || restoring.value) return isAuthenticated.value;
    if (!import.meta.client) {
      initialized.value = true;
      return false;
    }

    restoring.value = true;
    try {
      const me = await api.request<SessionUser>("/api/auth/me");
      user.value = me.authenticated ? me : null;
    } catch {
      clearSession();
    } finally {
      restoring.value = false;
      initialized.value = true;
    }
    return isAuthenticated.value;
  }

  async function login(username: string, password: string) {
    user.value = await api.request<SessionUser>("/api/auth/login", {
      method: "POST",
      body: { username, password }
    });
    if (!user.value.authenticated) {
      clearSession();
      throw new Error("账号未通过认证");
    }
    initialized.value = true;
    return user.value;
  }

  async function logout() {
    try {
      await api.request("/api/auth/logout", { method: "POST" });
    } finally {
      clearSession();
    }
  }

  function clearSession() {
    user.value = null;
    initialized.value = false;
  }

  return { user, isAuthenticated, initialized, restoring, restore, login, logout, request: api.request };
}
