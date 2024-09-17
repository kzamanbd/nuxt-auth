// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['@/assets/tailwindcss.css'],
    compatibilityDate: '2024-04-03',
    devtools: { enabled: true },
    modules: ['@nuxt/ui'],
    runtimeConfig: {
        public: {
            apiURL: 'https://devapi.jerpbd.com/api'
        }
    }
});
