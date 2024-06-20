// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
    }
  },
  devtools: { enabled: true },
  typescript: {
    typeCheck: true
  },
  plugins: ["~/plugins/oh-vue-icons.ts"],
  modules: ['@nuxt/ui', '@nuxtjs/tailwindcss'],
  tailwindcss: {
    exposeConfig: true,
    viewer: true,
  },
  colorMode: {
    preference: 'light'
  }
})