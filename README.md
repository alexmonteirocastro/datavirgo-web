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
pnpm dev            # Astro dev server
pnpm check          # astro check
pnpm build          # production build into dist/
pnpm lint
pnpm format:check
```

`pnpm test:literals` and `pnpm test:pt-build` run the repo's own guardrail tests. [CONTRIBUTING](CONTRIBUTING.md) lists every command.

## Docs

- [Architecture](docs/ARCHITECTURE.md)
- [Product vision](docs/PRODUCT_VISION.md)
- [ADRs](docs/adr/README.md)
- [Contributing](CONTRIBUTING.md)
