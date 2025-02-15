import eslint from "@eslint/js";
import biomeConfig from "eslint-config-biome";
import importEslint from "eslint-plugin-import";
import solidEslint from "eslint-plugin-solid";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config([
  {
    files: ["**/*.ts", "**/*.tsx"],
    ignores: ["**/*.vanilla.js"],

    languageOptions: {
      globals: {
        ...globals.browser,
      },

      parser: tseslint.parser,
      ecmaVersion: "latest",
      sourceType: "module",

      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },

        project: "tsconfig.json",
      },
    },

    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },

      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
        },
      },
    },
  },

  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  importEslint.flatConfigs.recommended,
  importEslint.flatConfigs.typescript,
  solidEslint.configs["flat/typescript"],
  biomeConfig,

  {
    rules: {
      camelcase: "error",
      eqeqeq: "error",
      "max-statements": ["error", 30],
      "no-constant-condition": ["error", { checkLoops: false }],
      "no-empty-function": "warn",
      "no-eval": "error",
      "no-implied-eval": "error",
      "no-throw-literal": "error",

      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-namespace": "error",

      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/no-empty-function": "off",
    },
  },
  {
    files: ["**/*.test.ts"],

    rules: {
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
]);
