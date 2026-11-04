// features.testimonialsGuard stays off until the custom domain is about to go live.
// While it is off, placeholder or unconsented entries are allowed.
// Once it is on, those entries fail in two places only (ADR-0002):
//   - a pull request into main (GITHUB_BASE_REF=main)
//   - the Cloudflare Pages production build (CF_PAGES=1 and CF_PAGES_BRANCH=main)
// A push to main in GitHub Actions is not a third trigger. That deploy is the Pages build.
// Local builds and preview deployments still succeed.
// pnpm build runs this script before astro build. CI also runs it as its own step.
// Pages does not run the CI workflow, so the build-script call is the production backstop.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

const featuresFile = fileURLToPath(
  new URL("../src/config/features.ts", import.meta.url),
);
const flag = /testimonialsGuard:\s*(true|false)/.exec(
  readFileSync(featuresFile, "utf8"),
);
if (!flag) {
  process.stderr.write(
    "Could not read features.testimonialsGuard from src/config/features.ts\n",
  );
  process.exit(1);
}
const guardOn = flag[1] === "true";

const root = fileURLToPath(
  new URL("../src/content/testimonials", import.meta.url),
);

function markdownFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) files.push(...markdownFiles(path));
    else if (entry.name.endsWith(".md")) files.push(path);
  }
  return files;
}

// Schema defaults: placeholder true, consent false. A missing field is the failing value.
function frontmatter(text, path) {
  const match = /^---\n([\s\S]*?)\n---/.exec(text);
  if (!match) {
    return { error: `${path} has no frontmatter` };
  }
  const data = {};
  for (const line of match[1].split("\n")) {
    const field = /^(\w+):\s*(.*)$/.exec(line);
    if (!field) continue;
    const raw = field[2].trim();
    if (raw === "true") data[field[1]] = true;
    else if (raw === "false") data[field[1]] = false;
  }
  return {
    placeholder: data.placeholder !== false,
    consent: data.consent === true,
  };
}

const readErrors = [];
const blocked = [];
for (const path of markdownFiles(root)) {
  const parsed = frontmatter(readFileSync(path, "utf8"), path);
  if (parsed.error) {
    readErrors.push(parsed.error);
    continue;
  }
  if (parsed.placeholder || !parsed.consent) {
    blocked.push(`${path} has placeholder: true or consent: false`);
  }
}

if (readErrors.length > 0) {
  process.stderr.write(
    `Testimonials files could not be read:\n- ${readErrors.join("\n- ")}\n`,
  );
  process.exit(1);
}

const pullRequestIntoMain = process.env.GITHUB_BASE_REF === "main";
const pagesProduction =
  process.env.CF_PAGES === "1" && process.env.CF_PAGES_BRANCH === "main";
const enforces = guardOn && (pullRequestIntoMain || pagesProduction);

if (!enforces) {
  process.stdout.write(guardOn ? "guard on, not enforced\n" : "guard off\n");
  process.exit(0);
}

if (blocked.length > 0) {
  process.stderr.write(
    `Testimonials guard failed:\n- ${blocked.join("\n- ")}\n`,
  );
  process.exit(1);
}
process.stdout.write("Testimonials guard passed\n");
