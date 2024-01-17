// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: ['@/assets/tailwindcss.css'],
    modules: ['@nuxt/ui'],
    runtimeConfig: {
        public: {
            apiURL: 'https://devapi.jerpbd.com/api'
        }
    }
});
