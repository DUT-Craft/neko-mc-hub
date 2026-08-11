export default defineNuxtRouteMiddleware(async (to) => {
  // Admin pages are client-rendered; the protected API remains the authority.
  if (import.meta.server) return;
  const { restore, isAdmin } = useAdminSession();
  await restore();
  if (!isAdmin.value) {
    return navigateTo({ path: "/admin/login", query: { redirect: to.fullPath } });
  }
});
