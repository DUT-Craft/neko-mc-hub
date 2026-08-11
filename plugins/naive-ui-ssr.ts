import { setup } from "@css-render/vue3-ssr";

export default defineNuxtPlugin((nuxtApp) => {
  if (import.meta.server) {
    const { collect } = setup(nuxtApp.vueApp);

    nuxtApp.hook("app:rendered", ({ ssrContext }) => {
      const collected = collect();
      if (!collected || !ssrContext?.head) return;

      const styles = [...collected.matchAll(/<style cssr-id="([^"]+)">([\s\S]*?)<\/style>/g)].map(([, id, children]) => ({
        key: `naive-ui-${id}`,
        innerHTML: children,
        "cssr-id": id
      }));

      if (styles.length) ssrContext.head.push({ style: styles });
    });
  }
});
