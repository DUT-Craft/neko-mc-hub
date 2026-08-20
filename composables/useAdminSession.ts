import type { AdminMe } from "~/types/admin";

interface AdminRouteContext {
  path: string;
  fullPath: string;
}

export function useAdminSession(routeContext?: AdminRouteContext) {
  const api = useAdminApi(routeContext);
  const user = useState<AdminMe | null>("admin-session", () => null);
  const initialized = useState("admin-session-initialized", () => false);
  const restoring = useState("admin-session-restoring", () => false);

  const isAdmin = computed(() => user.value?.authenticated === true && user.value.role === "ADMIN");

  async function restore() {
    if (initialized.value || restoring.value) return isAdmin.value;
    if (!import.meta.client) {
      initialized.value = true;
      return false;
    }

    restoring.value = true;
    try {
      const me = await api.request<AdminMe>("/api/auth/me");
      user.value = me.authenticated ? me : null;
      if (!isAdmin.value) api.clearSession();
    } catch {
      user.value = null;
      api.clearSession();
    } finally {
      restoring.value = false;
      initialized.value = true;
    }
    return isAdmin.value;
  }

  async function login(username: string, password: string) {
    const me = await api.request<AdminMe>("/api/auth/login", {
      method: "POST",
      body: { username, password }
    });
    if (!me.authenticated || me.role !== "ADMIN") {
      api.clearSession();
      user.value = null;
      throw new Error("该账号没有管理员权限");
    }
    user.value = me;
    initialized.value = true;
    return me;
  }

  async function logout() {
    try {
      await api.request("/api/auth/logout", { method: "POST" });
    } finally {
      api.clearSession();
      user.value = null;
      initialized.value = true;
    }
  }

  return { user, isAdmin, initialized, restoring, restore, login, logout };
}
