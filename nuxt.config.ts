// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	css: ['@/assets/tailwindcss.css'],
	modules: ['@nuxtjs/tailwindcss'],
	runtimeConfig: {
		public: {
			apiURL: 'https://api.jerpbd.com:8081/api',
			clientURL: 'http://localhost:3000'
		}
	}
});
