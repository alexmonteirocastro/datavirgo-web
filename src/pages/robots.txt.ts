import type { APIRoute } from "astro";
import { isIndexableHost } from "../config/site";

// Same host check as the robots meta tag. pages.dev disallows everything.
// An indexable host allows crawling and points at the sitemap.
export const GET: APIRoute = ({ site }) => {
  const indexable = site ? isIndexableHost(site.hostname) : false;
  const lines = indexable
    ? [
        "User-agent: *",
        "Allow: /",
        "",
        `Sitemap: ${new URL("sitemap-index.xml", site).href}`,
      ]
    : ["User-agent: *", "Disallow: /"];
  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
