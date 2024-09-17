import type { Config } from 'tailwindcss';
import form from '@tailwindcss/forms';

const config: Config = {
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
    plugins: [form]
};

export default config;
