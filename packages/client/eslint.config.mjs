import { fixupConfigRules, fixupConfigRules, fixupConfigRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tailwindcss from "eslint-plugin-tailwindcss";
import globals from "globals";
import parser from "svelte-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: [
        "**/*.cjs",
        "**/.DS_Store",
        "**/node_modules",
        "build",
        ".svelte-kit",
        "package",
        "**/.env",
        "**/.env.*",
        "!**/.env.example",
        "**/pnpm-lock.yaml",
        "**/package-lock.json",
        "**/yarn.lock",
    ],
}, ...fixupConfigRules(compat.extends(
    "plugin:import/recommended",
    "eslint:recommended",
    "plugin:svelte/recommended",
)), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        tailwindcss,
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        ecmaVersion: 2020,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
            extraFileExtensions: [".svelte"],
        },
    },

    settings: {
        svelte: {
            kit: {
                files: {
                    routes: "src/routes",
                },
            },
        },
    },
}, ...fixupConfigRules(compat.extends(
    "plugin:import/typescript",
    "airbnb-typescript/base",
    "plugin:tailwindcss/recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
)).map(config => ({
    ...config,
    files: ["**/*.svelte"],
})), {
    files: ["**/*.svelte"],

    languageOptions: {
        parser: parser,
        ecmaVersion: 5,
        sourceType: "script",

        parserOptions: {
            parser: "@typescript-eslint/parser",
        },
    },

    rules: {
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-throw-literal": "off",
        "import/no-extraneous-dependencies": "off",
        "import/extensions": "off",
        "import/no-unresolved": "off",
        "no-undef": "off",
    },
}, ...fixupConfigRules(compat.extends(
    "plugin:import/typescript",
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "prettier",
)).map(config => ({
    ...config,
    files: ["**/*.ts"],
})), {
    files: ["**/*.ts"],

    languageOptions: {
        parser: tsParser,
    },

    rules: {
        "@typescript-eslint/indent": "off",
        "@typescript-eslint/no-throw-literal": "off",
    },
}];