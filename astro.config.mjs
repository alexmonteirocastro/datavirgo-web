import { defineConfig } from "astro/config";
import { features } from "./src/config/features.ts";

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
    locales: ["en"],
    routing: { prefixDefaultLocale: false },
  },
});
