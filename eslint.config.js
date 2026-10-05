import js from "@eslint/js";
import { astroLiteralConfig } from "./eslint-rules/index.js";

export default [
  {
    ignores: ["node_modules/**", "dist/**", ".astro/**", "tests/fixtures/**"],
  },
  js.configs.recommended,
  // Raw text in a template fails lint. The i18n folder is where strings live.
  astroLiteralConfig(["src/**/*.astro"], ["src/i18n/**"]),
];
