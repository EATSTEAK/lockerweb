const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			colors: {
				primary: {
					900: '#00678f',
					800: '#1287af',
					700: '#1398c2',
					600: '#23abd4',
					500: '#2db9e2',
					400: '#47c4e3',
					300: '#64cfe5',
					200: '#8cddeb',
					100: '#b8eaf2',
					50: '#e3f7fa'
				}
			},
			scale: {
				'101': '1.01'
			},
			aspectRatio: {
				'4/3': '4 / 3'
			},
			borderRadius: {
				'2.5xl': '1.25rem'
			}
		}
	},

	plugins: [require('@tailwindcss/forms')]
};

module.exports = config;
