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

export default defineConfig({
  output: "static",
  integrations: [chartToolRoute],
  i18n: {
    defaultLocale: "en",
    locales,
    routing: { prefixDefaultLocale: false },
  },
});
