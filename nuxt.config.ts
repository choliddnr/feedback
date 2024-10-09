import { theme } from "#tailwind-config";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/fonts", "@nuxt/image", "@pinia/nuxt"],
  future: {
    compatibilityVersion: 4,
  },
  colorMode: {
    preference: "light",
  },
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ["Playpen Sans"],
          },
          colors: {
            "great-blue": {
              DEFAULT: "#2A669F",
              50: "#E4F7F8",
              100: "#CCEEF2",
              200: "#9CD7E5",
              300: "#6CB9D8",
              400: "#3B94CB",
              500: "#2A669F",
              600: "#234B83",
              700: "#1B3366",
              800: "#14204A",
              900: "#0C102E",
            },
            "fuel-yellow": {
              DEFAULT: "#EEA12E",
              50: "#FCEDD8",
              100: "#FAE5C5",
              200: "#F7D49F",
              300: "#F4C379",
              400: "#F1B254",
              500: "#EEA12E",
              600: "#D38511",
              700: "#9F640D",
              800: "#6B4409",
              900: "#372304",
              950: "#1D1202",
            },
            astra: {
              DEFAULT: "#F9F3BC",
              50: "#FFFFFF",
              100: "#FFFFFF",
              200: "#FFFFFF",
              300: "#FFFFFF",
              400: "#FCFAE1",
              500: "#F9F3BC",
              600: "#F4EA89",
              700: "#F0E155",
              800: "#EBD722",
              900: "#C3B211",
              950: "#A99A0F",
            },
          },
        },
      },
    },
  },
  fonts: {
    provider: "google",
  },
  pinia: {
    storesDirs: ["./app/stores"],
  },
  ssr: false,
});
