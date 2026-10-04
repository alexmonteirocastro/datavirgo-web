# Architecture

Stub. [DAV-10](https://linear.app/alex-projects/issue/DAV-10) replaces this with the site-architecture ADR (0002).

## Shape

- **Site:** Astro at this repo's root, deployed on Cloudflare Pages.
- **Blog:** Substack stays canonical. The site reads the publication RSS at build time and links out. Posts are not copied.
- **Contact:** a Cloudflare Worker. No persistence.
- **Chart API:** FastAPI on Render, in `datavirgo-app`. The site calls it only when `features.chartTool` is on.

Engine and API decisions stay in the app repo. See the [ADR index](adr/README.md).
