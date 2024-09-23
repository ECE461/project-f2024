// eslint.config.mjs
// eslint.config.mjs
import eslintPlugin from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

export default {
  files: ["src/**/*.{js,ts,tsx}"],
  ignores: ["node_modules/", "dist/", "build/"],
  languageOptions: {
  parser: parser,

},
  plugins: {
    "@typescript-eslint": eslintPlugin
  },
  rules: {
    "semi": "error",
    "quotes": ["error", "single"],
    "@typescript-eslint/no-unused-vars": "warn"
  },
};

