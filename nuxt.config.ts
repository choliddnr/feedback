// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  future: {
    compatibilityVersion: 4,
  },
  modules: ["@nuxt/ui-pro", "@pinia/nuxt", "@nuxt/image"],
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
    DB_PATH: process.env.NUXT_DB_PATH, // private
    BETTER_AUTH_SECRET: process.env.NUXT_BETTER_AUTH_SECRET, // private
    BETTER_AUTH_URL: process.env.NUXT_BETTER_AUTH_SECRET, // private
    GOOGLE_CLIENT_ID: process.env.NUXT_GOOGLE_CLIENT_ID, // public
    GOOGLE_CLIENT_SECRET: process.env.NUXT_GOOGLE_CLIENT_ID, // public
  },
  ssr: true,
  nitro: {
    preset: "cloudflare-pages",
  },
});
