# DAV-15 — Pages project, SEO, and Web Analytics

- Ticket: [DAV-15](https://linear.app/alex-projects/issue/DAV-15)
- Branch: `chore/DAV-15-pages-seo-analytics`
- Pitch: [Bet 003](https://app.notion.com/p/3e9c8438565c81b29b6de86b32d56814)
- Builds on: DAV-11, [ADR-0002](../adr/0002-site-architecture.md)

## Goal

Ship the half of DAV-15 that does not need a domain: canonical URLs, meta and Open Graph text, a sitemap, a noindex `pages.dev` host, and a Web Analytics hook. The custom domain, the testimonials flag, and the API CORS change stay for later. The ticket stays open.

## Out of scope

- Registering or attaching a domain. That is [DAV-20](https://linear.app/alex-projects/issue/DAV-20).
- Setting `features.testimonialsGuard` to `true`. Placeholder testimonials are still in the repo. ADR-0002 keeps the flag off until the custom domain is about to go live.
- `CORS_ALLOWED_ORIGINS` in `datavirgo-app`. The chart tool is off, and the production origin does not exist yet.
- Turnstile. That is DAV-14.
- Creating the Cloudflare Pages project in this change. Connect it only after this branch is on `main`. Current `main` has no `noindex`, so connecting it now would publish an indexable placeholder site.
- An Open Graph image. There is no approved asset.

## Acceptance criteria

- [ ] `site` comes from `SITE`, and defaults to `https://datavirgo.pages.dev`.
- [ ] Each page has a canonical URL, a description, and Open Graph title, description, URL, type, and site name. The text comes from `t()`.
- [ ] A host ending in `.pages.dev` emits `noindex, nofollow` and a `robots.txt` that disallows everything. Any other host is indexable, and its `robots.txt` allows crawling and points at the sitemap. One host check drives both.
- [ ] `@astrojs/sitemap` writes a sitemap. The pt-build still passes `--site https://example.test`, which stays indexable.
- [ ] The Web Analytics beacon is in the base layout and renders only when `PUBLIC_CF_BEACON_TOKEN` is set. The token is not committed.
- [ ] The privacy page says the public site loads the cookieless beacon, sets no cookies, and has no banner. It does not mention Turnstile. The sentence is not gated on the token.
- [ ] `pnpm build` runs `scripts/check-testimonials.mjs` before `astro build`. With the flag off, the script exits 0. With the flag on, it fails only when `GITHUB_BASE_REF` is `main` or when `CF_PAGES` is `1` and `CF_PAGES_BRANCH` is `main`.
- [ ] The named testimonials step stays in CI. It runs the same script.
- [ ] `features.testimonialsGuard` is still `false`.

## Design

**Site URL.** `astro.config.mjs` sets `site` to `process.env.SITE ?? "https://datavirgo.pages.dev"`. `scripts/check-pt-build.mjs` already builds with `astro build --site https://example.test`, and the CLI flag wins. `example.test` does not end in `.pages.dev`, so that build is the indexable branch. The fixture only asserts `lang` and `hreflang`.

**Indexing.** `isIndexableHost` in `src/config/site.ts` is the only host check. `Base.astro` and `src/pages/robots.txt.ts` both use it.

**Copy.** New `pages.*.description` keys in `src/i18n/en.json`, mirrored in `tests/fixtures/pt/pt.json`. Descriptions repeat lines the pages already use. The chart route, which is not in this build, reuses `chart.stub`.

**Beacon.** Cloudflare's manual snippet, `is:inline`, at the end of `body`. Cloudflare's Web Analytics FAQ (checked 2026-11-04) says the product does not log query strings. Confirm that again when the analytics site is created. The privacy sentence describes the public site, including on preview deploys that do not load the beacon.

**Guard.** Pages does not run the CI workflow, so the production backstop has to be inside `pnpm build`, and it has to run before `astro build` so a failure leaves no `dist/`. A push to `main` in GitHub Actions is not a third trigger: that deploy is the Pages production build. This change does not exercise the fail paths, because the flag stays off. The script is the spec.

**CI overlap.** `.github/workflows/ci.yml` keeps the named step after `pnpm build`. Same script, two callers. The named step is what CI shows. The build script is what Pages runs.

**Pages project, later.** After merge: project `datavirgo` on account `Alex.monteiro@outlook.pt's Account`, repo root, production branch `main`, build `pnpm build`, output `dist`, Node 24, GitHub `alexmonteirocastro/datavirgo-web`, preview deployments on. Then a Web Analytics site for `datavirgo.pages.dev`, `PUBLIC_CF_BEACON_TOKEN` on the production environment only, and the README live-site line.

## Verification

`pnpm check`, `pnpm lint`, `pnpm test:literals`, `pnpm test:pt-build`, `pnpm build`. Built HTML has canonical, description, Open Graph, `hreflang`, and `noindex`. `dist/robots.txt` disallows. The sitemap exists. No beacon without the token. Privacy states the beacon and still says nothing is stored.

## ADR needed

None. This follows ADR-0002. `@astrojs/sitemap` is the package the ticket names.
