import { fixupConfigRules, fixupConfigRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
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

export default [
    ...fixupConfigRules(compat.extends("plugin:import/recommended", "prettier")),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
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
            },
        },

        rules: {
            "import/no-extraneous-dependencies": "off",
        },
    },
    ...fixupConfigRules(compat.extends(
        "plugin:import/typescript",
        "airbnb-typescript/base",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
    )).map(config => ({
        ...config,
        files: ["**/*.ts"],
    })),
    {
        files: ["**/*.ts"],

        languageOptions: {
            parser: tsParser,
        },

        rules: {
            "import/no-extraneous-dependencies": "off",
            "@typescript-eslint/indent": "off",
        },
    },
];