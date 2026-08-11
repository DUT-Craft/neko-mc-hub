export default defineNuxtPlugin(() => {
  window.localStorage.removeItem("neko_admin_token");
  window.localStorage.removeItem("neko_member_token");
});
