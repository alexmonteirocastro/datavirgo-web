// With features.testimonialsGuard off, placeholder or unconsented entries are allowed.
// DAV-15 turns the flag on. From then, CI and the production build fail on those entries.
// While the flag is off this script exits 0, including when the seed entries are deliberately bad.
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

const problems = [];
for (const path of markdownFiles(root)) {
  const parsed = frontmatter(readFileSync(path, "utf8"), path);
  if (parsed.error) {
    problems.push(parsed.error);
    continue;
  }
  if (guardOn && (parsed.placeholder || !parsed.consent)) {
    problems.push(`${path} has placeholder: true or consent: false`);
  }
}

if (!guardOn) {
  process.stdout.write("guard off\n");
  if (problems.length > 0) {
    process.stderr.write(
      `Testimonials files could not be read:\n- ${problems.join("\n- ")}\n`,
    );
    process.exit(1);
  }
  process.exit(0);
}

if (problems.length > 0) {
  process.stderr.write(
    `Testimonials guard failed:\n- ${problems.join("\n- ")}\n`,
  );
  process.exit(1);
}
process.stdout.write("Testimonials guard passed\n");
