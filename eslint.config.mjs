import js from "@eslint/js";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import importPlugin from "eslint-plugin-import";
import prettierConfig from "eslint-config-prettier";

export default [
    js.configs.recommended,
    {
        files: ["**/*.ts"],
        ignores: ["dist", "node_modules"],
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: "./tsconfig.json",
                ecmaVersion: 2022,
                sourceType: "module",
            },
          env: {
            node: true,
            es2021: true,
          },
        },
        plugins: {
            "@typescript-eslint": tseslint,
            "simple-import-sort": simpleImportSort,
            import: importPlugin,
        },
        rules: {
            // --- TypeScript rules ---
            ...tseslint.configs.recommended.rules,
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/no-explicit-any": "off",

            // --- Import sorting & hygiene ---
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",
            "import/first": "error",
            "import/newline-after-import": "error",
            "import/no-duplicates": "error",

            // --- Disable conflicting Prettier rules ---
            ...prettierConfig.rules,
        },
    },
];
