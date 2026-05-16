// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: ["nuxt-quasar-ui", "@nuxt/eslint"],
  css: ["~/css/main.css"],
  ssr: false,

  // Enables the development server to be discoverable by other devices when running on iOS physical devices
  devServer: {
    host: "0",
  },

  vite: {
    // Better support for Tauri CLI output
    clearScreen: false,
    // Enable environment variables
    // Additional environment variables can be found at
    // https://v2.tauri.app/reference/environment-variables/
    envPrefix: ["VITE_", "TAURI_"],
    server: {
      // Tauri requires a consistent port
      strictPort: true,
    },
  },

  imports: {
    presets: [
      {
        from: "firebase/firestore",
        imports: [
          {
            name: "*",
            as: "firestore",
          },
        ],
      },
    ],
  },

  // Avoids error [unhandledRejection] EMFILE: too many open files, watch
  ignore: ["**/src-tauri/**"],

  quasar: {
    extras: {
      font: "roboto-font",
      fontIcons: ["material-symbols-rounded"],
    },
    lang: "fr",
    plugins: ["Notify"],
  },
});
