// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  nitro: {
    prerender: {
      routes: ['/'],
    }
  },
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  colorMode: {
    preference: 'light'
  },
  icon: {}
})