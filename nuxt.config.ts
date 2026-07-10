const baseURL = process.env.NUXT_APP_BASE_URL || "/";

export default defineNuxtConfig({
  compatibilityDate: "2026-07-08",
  ssr: true,
  css: [
    "@fontsource/zcool-kuaile/chinese-simplified.css",
    "@fontsource/zcool-kuaile/latin.css",
    "@fontsource/baloo-2/latin-500.css",
    "@fontsource/baloo-2/latin-600.css",
    "@fontsource/baloo-2/latin-700.css",
    "~/styles.css"
  ],
  app: {
    baseURL,
    head: {
      htmlAttrs: { lang: "zh-CN" },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { name: "description", content: "猫娘社 Minecraft 服务器、活动、公告与入服信息演示站。" }
      ],
      link: [
        { rel: "icon", type: "image/png", href: `${baseURL}assets/mc-icons/neko-avatar.png` }
      ]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      failOnError: true,
      routes: ["/", "/home", "/servers", "/activities", "/announcements", "/applications", "/wiki", "/history"]
    }
  },
  typescript: {
    typeCheck: true
  }
});
