import { defineConfig, globalIgnores } from "eslint/config";
import jest from "eslint-plugin-jest";
import prettier from "eslint-plugin-prettier";
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

export default defineConfig([
  globalIgnores([
    "lib",
    "dist",
    "docu",
    "docs",
    "node_modules",
    "tests/resources"
  ]), {
    extends: compat.extends(
      "plugin:@typescript-eslint/recommended",
      "prettier",
      "plugin:jest/recommended"
    ),
    plugins: {
      jest,
      prettier,
      "@typescript-eslint": typescriptEslint
    },
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.jest,
        ...jest.environments.globals.globals
      },
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "module",
      parserOptions: {
        project: ["src/tsconfig.json", "tests/tsconfig.json"],
        allowImportExportEverywhere: true
      }
    },
    rules: {
      "spaced-comment": ["warn", "always", {
        block: {
          balanced: true,
          exceptions: ["-"]
        },
        line: {
          exceptions: ["-"]
        }
      }],
      "node/no-unpublished-require": "off",
      "@typescript-eslint/no-unused-vars": ["error", {
        caughtErrors: "none"
      }],
      "@typescript-eslint/ban-ts-comment": "warn"
    }
  }]);