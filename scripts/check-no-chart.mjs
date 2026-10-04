// Run after `astro build`. With features.chartTool off, the build must contain no chart-tool
// route, nav link or home section. With it on, there is nothing to forbid, so the check is skipped.
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import process from "node:process";
import { fileURLToPath, URL } from "node:url";

// Read the flag as text so the script runs on any Node, without importing TypeScript.
const featuresFile = fileURLToPath(
  new URL("../src/config/features.ts", import.meta.url),
);
const flag = /chartTool:\s*(true|false)/.exec(
  readFileSync(featuresFile, "utf8"),
);
if (!flag) {
  process.stderr.write(
    "Could not read features.chartTool from src/config/features.ts\n",
  );
  process.exit(1);
}
const chartToolOn = flag[1] === "true";

const dist = fileURLToPath(new URL("../dist", import.meta.url));

if (chartToolOn) {
  process.stdout.write("features.chartTool is on: no-chart check skipped\n");
  process.exit(0);
}
if (!existsSync(dist)) {
  process.stderr.write("dist/ not found: run `pnpm build` first\n");
  process.exit(1);
}

const problems = [];
if (existsSync(join(dist, "chart"))) problems.push("dist/chart exists");

const forbidden = ['data-feature="chartTool"', 'href="/chart'];
function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) walk(path);
    else if (entry.name.endsWith(".html")) {
      const html = readFileSync(path, "utf8");
      for (const needle of forbidden) {
        if (html.includes(needle)) problems.push(`${path} contains ${needle}`);
      }
    }
  }
}
walk(dist);

if (problems.length > 0) {
  process.stderr.write(
    `Chart tool is reachable with the flag off:\n- ${problems.join("\n- ")}\n`,
  );
  process.exit(1);
}
process.stdout.write(
  "No chart-tool route, link or section in dist/ (flag off)\n",
);
