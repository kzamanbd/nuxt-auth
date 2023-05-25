// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ['@/assets/tailwindcss.css'],
	modules: ['@nuxtjs/tailwindcss'],
    runtimeConfig: {
		public: {
			backendUrl: 'http://localhost:8000/api',
			frontendUrl: 'http://localhost:3000'
		}
	},
});
