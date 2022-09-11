module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: [
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:tailwindcss/recommended',
		'eslint:recommended',
		'airbnb-typescript/base',
		'plugin:@typescript-eslint/recommended',
		'prettier'
	],
	plugins: ['svelte3', '@typescript-eslint', 'tailwindcss'],
	ignorePatterns: ['*.cjs'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		project: 'tsconfig.json',
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
