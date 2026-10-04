// Proves the no-raw-text rule works: the violation fixture must fail, the clean one must pass.
import { ESLint } from "eslint";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";
import { astroLiteralConfig } from "../eslint-rules/index.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const eslint = new ESLint({
  cwd: root,
  overrideConfigFile: true,
  overrideConfig: [astroLiteralConfig(["tests/fixtures/literals/*.astro"])],
});

const expected = { "violation.astro": 6, "clean.astro": 0 };
const results = await eslint.lintFiles(["tests/fixtures/literals/*.astro"]);
const failures = [];

for (const [name, count] of Object.entries(expected)) {
  const result = results.find((r) => r.filePath.endsWith(`/${name}`));
  if (!result) {
    failures.push(`${name}: not linted`);
    continue;
  }
  const fatal = result.messages.filter((m) => m.fatal);
  if (fatal.length > 0)
    failures.push(`${name}: parse error: ${fatal[0].message}`);
  else if (result.messages.length !== count) {
    failures.push(
      `${name}: expected ${count} reports, got ${result.messages.length}`,
    );
  }
}

if (failures.length > 0) {
  process.stderr.write(
    `no-raw-text rule test failed:\n- ${failures.join("\n- ")}\n`,
  );
  process.exit(1);
}
process.stdout.write(
  "no-raw-text rule: violation fixture fails, clean fixture passes\n",
);
