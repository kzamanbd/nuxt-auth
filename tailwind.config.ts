import type { Config } from 'tailwindcss';
import form from '@tailwindcss/forms';

export default <Partial<Config>>{
    theme: {
        extend: {}
    },
    plugins: [form]
};
