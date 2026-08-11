const baseURL = process.env.NUXT_APP_BASE_URL || "/";
const configuredApiBase = process.env.NUXT_PUBLIC_API_BASE;
const apiBase = configuredApiBase ?? "";
const apiBaseInternal = process.env.NUXT_API_BASE_INTERNAL || "http://127.0.0.1:8080";
const demoFallback = process.env.NUXT_PUBLIC_ENABLE_DEMO_FALLBACK === "true";
const demoRoutes = ["/", "/home", "/servers", "/activities", "/announcements", "/applications", "/wiki", "/history"];

export default defineNuxtConfig({
  compatibilityDate: "2026-07-08",
  devtools: { enabled: false },
  ssr: true,
  runtimeConfig: {
    apiBaseInternal,
    public: {
      apiBase,
      demoFallback
    }
  },
  css: [
    "@fontsource/zcool-kuaile/chinese-simplified.css",
    "@fontsource/zcool-kuaile/latin.css",
    "@fontsource/baloo-2/latin-500.css",
    "@fontsource/baloo-2/latin-600.css",
    "@fontsource/baloo-2/latin-700.css",
    "~/styles.css"
  ],
  routeRules: {
    "/admin": { ssr: false, prerender: false },
    "/admin/**": { ssr: false, prerender: false }
  },
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: "zh-CN" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "猫娘社 Minecraft 服务器、活动、公告与入服信息。" }
      ],
      link: [
        { rel: "icon", type: "image/png", href: `${baseURL}assets/mc-icons/neko-avatar.png` }
      ]
    }
  },
  nitro: {
    prerender: {
      // Only the standalone demo is static. Production pages load current API data at request time.
      crawlLinks: demoFallback,
      failOnError: demoFallback,
      routes: demoFallback ? demoRoutes : []
    }
  },
  vite: {
    optimizeDeps: {
      include: [
        "@lucide/vue",
        "@tiptap/core",
        "@tiptap/extension-image",
        "@tiptap/extension-link",
        "@tiptap/extension-placeholder",
        "@tiptap/extension-text-align",
        "@tiptap/extension-underline",
        "@tiptap/starter-kit",
        "@tiptap/vue-3",
        "cropperjs"
      ]
    },
    ssr: {
      noExternal: ["naive-ui", "vueuc", "date-fns"]
    }
  },
  typescript: {
    typeCheck: true
  }
});
