module.exports = {
  root: true,
  extends: ['plugin:import/recommended', 'eslint:recommended'],
  plugins: ['svelte3', '@typescript-eslint', 'tailwindcss'],
  ignorePatterns: ['*.cjs'],
  overrides: [
    {
      files: ['*.svelte'],
      processor: 'svelte3/svelte3',
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:import/typescript',
        'airbnb-typescript/base',
        'plugin:tailwindcss/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/indent': 'off',
      },
    },
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'plugin:import/typescript',
        'airbnb-typescript/base',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/indent': 'off',
      },
    },
  ],
  settings: {
    'svelte3/typescript': () => require('typescript'),
  },
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020,
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
};
