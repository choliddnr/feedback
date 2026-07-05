// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  nitro: {
    preset: "cloudflare_pages",
    // logLevel: 3, // very important
  },
  // debug: true,
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
    storesDirs: ["./stores/**"],
  },
  routeRules: {
    "/admin/**": {
      // appMiddleware: ["auth"],
      ssr: false,
    },
  },
  runtimeConfig: {
    // Private (server-only) keys
    BETTER_AUTH_SECRET: process.env.NUXT_BETTER_AUTH_SECRET,
    GOOGLE_CLIENT_ID: process.env.NUXT_GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.NUXT_GOOGLE_CLIENT_SECRET,
    geminiApiKey: process.env.NUXT_GEMINI_API_KEY || "",
    public: {
      BASE_URL: process.env.NUXT_BASE_URL,
    },
  },
  experimental: {
    viteEnvironmentApi: true,
  },
  vite: {
    optimizeDeps: {
      include: [
        'better-auth/client/plugins',
        'better-auth/vue',
        'chart.js/auto',
        'date-fns',
        'zod',
      ]
    }
  }
});
