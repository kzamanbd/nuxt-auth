/** @type {import('tailwindcss').Config} */
import forms from '@tailwindcss/forms';
export default {
	content: [
		'./components/**/*.{js,vue,ts}',
		'./layouts/**/*.vue',
		'./pages/**/*.vue',
		'./plugins/**/*.{js,ts}',
		'./nuxt.config.{js,ts}'
	],
	theme: {
		extend: {}
	},
	plugins: [forms]
};
