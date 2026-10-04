# Architecture

The decisions behind this shape are in [ADR-0002](adr/0002-site-architecture.md).

## Shape

- **Site:** Astro (static) at this repo's root, deployed on Cloudflare Pages. Zero client JS by default. The exceptions are an inline theme switch, the Turnstile widget on the contact page, and the cookieless analytics beacon.
- **i18n:** Astro i18n routing, English first and unprefixed. Strings in `src/i18n/<locale>.json` via `t()`, page content in `src/content/pages/<locale>/`, localised slugs through a route map.
- **Blog:** Substack stays canonical. The site reads the publication RSS at build time, rebuilds daily through a deploy hook stored as a Worker secret, and links out. Posts are not copied.
- **Contact:** a Cloudflare Worker with Turnstile and Email Routing. No persistence.
- **Testimonials:** a content collection. `features.testimonialsGuard` stays off until the placeholders are replaced. Then CI on pull requests into `main`, and the Pages production build, fail on placeholder or unconsented entries.
- **Chart API:** FastAPI on Render, in `datavirgo-app`. The site calls it only when `features.chartTool` is on.

Engine and API decisions stay in the app repo. See the [ADR index](adr/README.md).
