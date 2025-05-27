// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    "@nuxt/ui-pro",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxt/test-utils/module",
  ],
  css: ["~/assets/css/main.css"],
  ui: {
    fonts: true,
    colorMode: true,
  },
  colorMode: {
    preference: "dark",
  },
  fonts: {
    provider: "google",
  },
  pinia: {
    storesDirs: ["./app/stores"],
  },
  routeRules: {
    "/admin/**": {
      appMiddleware: ["auth"],
    },
  },
  runtimeConfig: {
    DB: process.env.NUXT_DB,
    DB_PATH: process.env.NUXT_DB_PATH,
    BETTER_AUTH_SECRET: process.env.NUXT_BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.NUXT_BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.NUXT_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.NUXT_GOOGLE_CLIENT_ID,
    BUNNY_ACCESS_KEY: process.env.NUXT_BUNNY_ACCESS_KEY,
    public: {
      BASE_URL: process.env.NUXT_BASE_URL,
    },
  },
  // ssr: true,
  nitro: {
    preset: "cloudflare-pages",
  },
});
