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
    fonts: false,
    colorMode: true,
  },
  colorMode: {
    preference: "dark",
  },
  // fonts: {
  //   provider: "google",
  // },
  pinia: {
    storesDirs: ["./app/stores"],
  },
  routeRules: {
    "/admin/**": {
      appMiddleware: ["auth"],
    },
  },
});
