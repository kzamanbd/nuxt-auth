// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ['@/assets/tailwindcss.css'],
	modules: ['@nuxtjs/tailwindcss'],
	runtimeConfig: {
		public: {
			apiURL: 'http://203.188.245.58:8889/api',
			clientURL: 'http://localhost:3000'
		}
	}
});
