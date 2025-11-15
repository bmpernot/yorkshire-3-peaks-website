import cypressPlugin from "eslint-plugin-cypress/flat";
import jest from "eslint-plugin-jest";
import noOnlyTests from "eslint-plugin-no-only-tests";
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import react from "eslint-plugin-react";
import babelParser from "@babel/eslint-parser";
import next from "@next/eslint-plugin-next";
import globals from "globals";

const cypressPluginRecommendedRules = cypressPlugin.configs.recommended;
const eslintJSRecommendedRules = js.configs.recommended.rules;
const prettierRecommendedRules = prettier.rules;
const jestRecommendedRules = jest.configs["flat/recommended"];
const nextRecommendedRules = next.rules;
const reactRecommendedRules = react.configs.flat.recommended.rules;

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/build/**",
      "**/backend/.aws-sam/**",
      "**/backend/.data/**",
      ".vscode/**",
    ],
  },
  {
    name: "Base eslint and prettier rule set",
    files: ["**/*"],
    plugins: { "no-only-tests": noOnlyTests, react },
    rules: {
      ...eslintJSRecommendedRules,
      ...prettierRecommendedRules,
      "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
      "react/jsx-uses-react": "error",
      "react/jsx-uses-vars": "error",
      curly: "error",
      "prefer-const": "error",
      "no-only-tests/no-only-tests": "error",
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-react"],
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    name: "Jest eslint extension",
    files: ["**/__tests__/**/*.?(m){j,t}s?(x)"],
    ...jestRecommendedRules,
  },
  {
    ...cypressPluginRecommendedRules,
    name: "Cypress eslint extension",
    files: ["**/cypress/**/*.{j,t}s?(x)"],
  },
  {
    name: "React eslint extension",
    files: ["./ui/**/*.?(m){j,t}s?(x)"],
    plugins: { react },
    rules: {
      ...nextRecommendedRules,
      ...reactRecommendedRules,
    },
  },
];
