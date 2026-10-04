# DataVirgo Web

Marketing site for DataVirgo: consultations, a scholarly blog, and later a public chart tool. English at launch, with room for Portuguese.

The chart engine and API live in [datavirgo-app](https://github.com/alexmonteirocastro/datavirgo-app). This repo is the site only.

Live site: not deployed yet (DAV-15).

Package manager: pnpm.

## Quick start

```bash
nvm use
corepack enable
pnpm install
pnpm lint
pnpm format:check
```

`pnpm dev` and `pnpm build` print a notice until the Astro app lands in DAV-11.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Product vision](docs/PRODUCT_VISION.md)
- [ADRs](docs/adr/README.md)
- [Contributing](CONTRIBUTING.md)
