import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import process from "node:process";
import { features } from "./src/config/features.ts";

// Test hook for scripts/check-pt-build.mjs: DATAVIRGO_LOCALES="en,pt" builds with a second locale.
// It is never set for a real build, so the shipped site stays English-only.
const locales = process.env.DATAVIRGO_LOCALES?.split(",") ?? ["en"];

// The /chart route has no file under src/pages/. It is injected only while the flag is on,
// so with the flag off the route does not exist in the build.
const chartToolRoute = {
  name: "chart-tool-route",
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      if (features.chartTool) {
        injectRoute({
          pattern: "/chart",
          entrypoint: "./src/features/chart/chart.astro",
        });
      }
    },
  },
};

// SITE is the public origin. The default is the Pages hostname, which stays noindex.
// Attaching the custom domain later is a SITE change. `astro build --site` still wins,
// which is how the Portuguese fixture builds against https://example.test.
const site = process.env.SITE ?? "https://datavirgo.pages.dev";

export default defineConfig({
  site,
  output: "static",
  integrations: [chartToolRoute, sitemap()],
  // Approach is a section of About. The nav links straight to the anchor;
  // this redirect keeps the old path. It only applies once src/pages/approach.astro is gone.
  redirects: {
    "/approach": "/about#approach",
  },
  i18n: {
    defaultLocale: "en",
    locales,
    routing: { prefixDefaultLocale: false },
  },
});
