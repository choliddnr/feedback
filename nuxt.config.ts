// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: {
    enabled: true,

    timeline: {
      enabled: true,
    },
  },
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxt/image",
    "@nuxt/test-utils/module",
    "@nuxt/eslint",
    "@vueuse/nuxt",
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
    BETTER_AUTH_URL: process.env.NUXT_BETTER_AUTH_URL,
    GOOGLE_CLIENT_ID: process.env.NUXT_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.NUXT_GOOGLE_CLIENT_SECRET,
    WASABI_KEY: process.env.NUXT_WASABI_KEY,
    WASABI_SECRET: process.env.NUXT_WASABI_SECRET,
    WASABI_BUCKET: process.env.NUXT_WASABI_BUCKET,
    N8N_API: process.env.NUXT_N8N_API,
    geminiApiKey: import.meta.env.NUXT_GEMINI_API_KEY || "",
    public: {
      BASE_URL: process.env.NUXT_BASE_URL,
    },
  },
  // ssr: true,
  nitro: {
    preset: "cloudflare-pages",
    logLevel: "debug",
  },
  image: {
    format: ["webp"],
  },
});