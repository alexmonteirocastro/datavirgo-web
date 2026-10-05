// Proves localisation needs no refactor (DAV-11, ADR-0002): adds Portuguese the way ADR-0002
// says to (pt.json, route-map entries, one page) in a temporary copy of the repo, builds it,
// and checks the output. The real tree and the real dist/ stay English-only.
import { spawnSync } from "node:child_process";
import {
  cpSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));
const fixtures = join(root, "tests/fixtures/pt");
const site = "https://example.test";
const failures = [];

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));

function keysOf(object, prefix = "") {
  return Object.entries(object).flatMap(([key, value]) =>
    typeof value === "object"
      ? keysOf(value, `${prefix}${key}.`)
      : [`${prefix}${key}`],
  );
}

// 1. pt.json must have every key en.json has, or a new English string leaves the fixture stale.
const enKeys = keysOf(readJson(join(root, "src/i18n/en.json")));
const ptKeys = new Set(keysOf(readJson(join(fixtures, "pt.json"))));
const missing = enKeys.filter((key) => !ptKeys.has(key));
if (missing.length > 0) {
  process.stderr.write(
    `tests/fixtures/pt/pt.json is missing keys from en.json:\n- ${missing.join("\n- ")}\n`,
  );
  process.exit(1);
}

const tmp = mkdtempSync(join(tmpdir(), "datavirgo-pt-"));
try {
  // 2. A temporary copy with only what a build needs.
  for (const file of ["astro.config.mjs", "tsconfig.json", "package.json"]) {
    cpSync(join(root, file), join(tmp, file));
  }
  cpSync(join(root, "src"), join(tmp, "src"), { recursive: true });
  symlinkSync(join(root, "node_modules"), join(tmp, "node_modules"), "dir");

  // 3. Add Portuguese: catalogue, route-map entries, one page.
  cpSync(join(fixtures, "pt.json"), join(tmp, "src/i18n/pt.json"));

  const slugs = readJson(join(fixtures, "routes.json"));
  const routesPath = join(tmp, "src/i18n/routes.ts");
  const matched = [];
  const patched = readFileSync(routesPath, "utf8").replace(
    /^( {2}(\w+): \{ en: "[^"]*")( \},)$/gm,
    (line, head, key, tail) => {
      matched.push(key);
      return key in slugs
        ? `${head}, pt: ${JSON.stringify(slugs[key])}${tail}`
        : line;
    },
  );
  const unmapped = matched.filter((key) => !(key in slugs));
  if (matched.length === 0 || unmapped.length > 0) {
    throw new Error(
      matched.length === 0
        ? "could not find route entries in src/i18n/routes.ts: update this script to its new shape"
        : `tests/fixtures/pt/routes.json has no slug for: ${unmapped.join(", ")}`,
    );
  }
  writeFileSync(routesPath, patched);

  mkdirSync(join(tmp, "src/pages/pt"), { recursive: true });
  const page = readFileSync(join(fixtures, "sobre.astro"), "utf8");
  if (!page.includes("../../../src/"))
    throw new Error("fixture sobre.astro import path changed");
  writeFileSync(
    join(tmp, "src/pages/pt/sobre.astro"),
    page.replace("../../../src/", "../../"),
  );

  // 4. Build with both locales. `--site` makes the hreflang alternates absolute.
  const build = spawnSync(
    join(root, "node_modules/.bin/astro"),
    ["build", "--site", site],
    {
      cwd: tmp,
      env: { ...process.env, DATAVIRGO_LOCALES: "en,pt" },
      encoding: "utf8",
    },
  );
  if (build.status !== 0) {
    throw new Error(
      `astro build failed:\n${(build.stdout + build.stderr).slice(-2000)}`,
    );
  }

  // 5. Check the output.
  const ptPage = join(tmp, "dist/pt/sobre/index.html");
  const enPage = join(tmp, "dist/about/index.html");
  if (!existsSync(ptPage) || !existsSync(enPage)) {
    failures.push(
      "dist/pt/sobre/index.html or dist/about/index.html was not built",
    );
  } else {
    const ptHtml = readFileSync(ptPage, "utf8");
    const enHtml = readFileSync(enPage, "utf8");
    const alternates = [
      `hreflang="en" href="${site}/about/"`,
      `hreflang="pt" href="${site}/pt/sobre/"`,
      `hreflang="x-default" href="${site}/about/"`,
    ];
    if (!ptHtml.includes('<html lang="pt"'))
      failures.push('pt page is not <html lang="pt">');
    if (!ptHtml.includes("<h1>Sobre</h1>"))
      failures.push("pt page does not show the pt.json heading");
    for (const html of [ptHtml, enHtml]) {
      for (const alternate of alternates) {
        if (!html.includes(alternate))
          failures.push(`missing alternate: ${alternate}`);
      }
    }
    if (!enHtml.includes('<html lang="en"'))
      failures.push('en page is not <html lang="en">');
  }
} catch (error) {
  failures.push(error.message);
} finally {
  rmSync(tmp, { recursive: true, force: true });
}

// 6. The real tree stays English-only.
if (
  existsSync(join(root, "src/pages/pt")) ||
  existsSync(join(root, "dist/pt"))
) {
  failures.push("the real tree contains a pt page or dist/pt");
}

if (failures.length > 0) {
  process.stderr.write(`pt build check failed:\n- ${failures.join("\n- ")}\n`);
  process.exit(1);
}
process.stdout.write(
  "pt build check: en + pt built, lang and hreflang correct, real tree untouched\n",
);
