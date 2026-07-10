export default defineNuxtConfig({
  compatibilityDate: "2026-07-08",
  css: ["~/styles.css"],
  app: {
    head: {
      htmlAttrs: {
        lang: "zh-CN"
      },
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" }
      ],
      script: [
        { src: "/legacy-app.js", defer: true }
      ]
    }
  }
});
