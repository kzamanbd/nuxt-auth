// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['@/assets/tailwindcss.css'],
    devtools: { enabled: true },
    modules: ['@nuxt/ui'],

    runtimeConfig: {
        public: {
            apiURL: 'https://devapi.jerpbd.com/api'
        }
    },

    compatibilityDate: '2024-09-18'
});
