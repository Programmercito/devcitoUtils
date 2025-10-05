/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			keyframes: {
				'gradient-animation': {
					'0%, 100%': { 'background-position': '0% 50%' },
					'50%': { 'background-position': '100% 50%' },
				},
			},
			animation: {
				'gradient': 'gradient-animation 10s ease infinite',
			},
			backgroundSize: {
				'400%': '400% 400%',
			}
		},
	},
	plugins: [],
}
