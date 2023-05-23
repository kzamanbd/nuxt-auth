// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ['@/assets/tailwindcss.css'],
	modules: ['@nuxtjs/tailwindcss', '@sidebase/nuxt-auth'],
	auth: {
        origin: 'http://localhost:3000'
    }
});
