import js from "@eslint/js";

export default [
  {
    ignores: ["node_modules/**", "dist/**", ".astro/**"],
  },
  js.configs.recommended,
];
