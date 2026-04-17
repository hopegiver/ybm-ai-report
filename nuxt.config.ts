// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui'
  ],

  devtools: {
    enabled: true
  },

  ssr: false,

  css: ['~/assets/css/main.css'],

  nitro: {
    preset: process.env.NODE_ENV === 'production' ? 'cloudflare-pages' : undefined
  },

  colorMode: {
    preference: 'light'
  },

  compatibilityDate: '2025-01-15'
})
