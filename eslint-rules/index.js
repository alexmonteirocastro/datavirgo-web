import tsParser from "@typescript-eslint/parser";
import * as astroParser from "astro-eslint-parser";
import { noRawText } from "./no-raw-text.js";

/** Local plugin: rules written for this repo. */
export const datavirgo = { rules: { "no-raw-text": noRawText } };

/**
 * ESLint config block for .astro templates. `no-undef` is off here: `Astro` and the other
 * Astro globals are real, and `astro check` already reports a genuinely undefined name.
 */
export function astroLiteralConfig(files, ignores = []) {
  return {
    files,
    ignores,
    // The TypeScript parser reads the frontmatter (`interface Props`, typed imports).
    languageOptions: {
      parser: astroParser,
      parserOptions: { parser: tsParser, extraFileExtensions: [".astro"] },
    },
    plugins: { datavirgo },
    rules: { "no-undef": "off", "datavirgo/no-raw-text": "error" },
  };
}
