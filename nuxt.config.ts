// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare_pages",
  },
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxt/image",
    "@vueuse/nuxt",
    "nitro-cloudflare-dev",
  ],
  ui: {
    fonts: true,
    colorMode: true,
  },
  css: ["~/assets/css/main.css"],
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
      // appMiddleware: ["auth"],
      ssr: false,
    },
  },
  runtimeConfig: {
    // Private (server-only) keys
    BETTER_AUTH_SECRET: "",
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    WASABI_KEY: process.env.NUXT_WASABI_KEY,
    WASABI_SECRET: process.env.NUXT_WASABI_SECRET,
    WASABI_BUCKET: process.env.NUXT_WASABI_BUCKET,
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY || "",
    public: {
      BASE_URL: process.env.NUXT_BASE_URL,
    },
  },
});
