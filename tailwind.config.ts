import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	darkMode: 'selector',

	theme: {
		extend: {
			container: {
				center: true,
				screens: {
					lg: '900px',
					xl: '900px',
					'2xl': '900px'
				},
				padding: {
					DEFAULT: '24px',
					md: '32px'
				}
			},
			fontFamily: {
				sans: ['Satoshi-Variable', ...defaultTheme.fontFamily.sans]
			}
		}
	},

	plugins: [typography]
} satisfies Config;
