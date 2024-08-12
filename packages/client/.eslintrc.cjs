module.exports = {
  root: true,
  extends: ['plugin:import/recommended', 'eslint:recommended', 'plugin:svelte/recommended'],
  plugins: ['@typescript-eslint', 'tailwindcss'],
  ignorePatterns: ['*.cjs', '*.js'],
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['.svelte'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  settings: {
    svelte: {
      kit: {
        files: {
          routes: 'src/routes',
        },
      },
    },
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
      extends: [
        'plugin:import/typescript',
        'airbnb-typescript/base',
        'plugin:tailwindcss/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
      ],
      rules: {
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-throw-literal': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'no-undef': 'off',
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
        '@typescript-eslint/no-throw-literal': 'off',
        'import/no-extraneous-dependencies': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
      },
    },
  ],
};
