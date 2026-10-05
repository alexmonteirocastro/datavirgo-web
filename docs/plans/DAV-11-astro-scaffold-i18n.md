# DAV-11: Frontend: scaffold the Astro site in datavirgo-web — i18n routing, t() helper, layout, tokens, nav/footer, chartTool flag

## Ticket

[DAV-11](https://linear.app/alex-projects/issue/DAV-11/frontend-scaffold-the-astro-site-in-datavirgo-web-i18n-routing-t) · Branch: `feat/DAV-11-astro-scaffold-i18n`

## Goal

Turn the repo into a real Astro site (static, TypeScript strict) that follows [ADR-0001](../adr/0001-design-tokens.md) and [ADR-0002](../adr/0002-site-architecture.md): English-only i18n routing that is proven ready for Portuguese, a typed `t()` helper, a base layout with the theme switch, header and footer, stub pages, the `features` config, and CI that runs `astro check` and `astro build` for real. Copy stays placeholder.

## Out of scope

- Repo creation, docs and tooling config (DAV-24).
- Page content and the testimonials collection (DAV-12), and the testimonials guard logic. This ticket only adds the `features.testimonialsGuard` value, `false`. DAV-15 sets it `true`.
- Cloudflare Pages deploy, Turnstile and Web Analytics (DAV-15, DAV-14). No third-party script is added here.
- Blog RSS fetch (DAV-13) and the contact form (DAV-14). `/blog` and `/consultations` are stubs.
- The chart tool itself (DAV-23). Only the flag and the gating exist.

## Acceptance criteria

- [ ] With the flag off, no chart-tool link or route appears in the build.
- [ ] A lint rule or test fails on raw text literals in `.astro` components outside `src/i18n/`.
- [ ] `astro build` with a dummy `pt.json` and one pt page succeeds, which proves localisation needs no refactor.
- [ ] CI is green on the PR, with the build job running for real.
- [ ] Astro project at the repo root, TypeScript strict, fonts self-hosted, `src/styles/tokens.css` used as the only source of colour, type and spacing.
- [ ] `src/i18n/en.json`, a typed `t(key)` helper where a missing key fails the build, and `getRelativeLocaleUrl` for links.
- [ ] Base layout with `<html lang>`, hreflang alternates, skip link; header with wordmark, nav and dark/light switch (default from `prefers-color-scheme`, choice persisted); footer with the Substack link, privacy link and AGPL source link.
- [ ] Stubbed routes `/`, `/about`, `/approach`, `/consultations`, `/testimonials`, `/blog`, `/privacy`, 404. No `/chart` route at launch.
- [ ] `features.chartTool` (off by default) gates the nav item, the home section and the `/chart` route; the nav reads from this config.
- [ ] `features.testimonialsGuard` (off by default) lives in the same config.
- [ ] README quick-start and the CONTRIBUTING "Code quality" section list the real `dev`, `build` and `check` commands.
- [ ] `pnpm lint` and `pnpm format:check` pass on the new files, including the `.astro` files (added)
- [ ] CI also runs the no-chart check and the pt build check (added)

## Design

**Dependencies.** The lockfile has no `astro`, `typescript` or `@astrojs/check` (verified by search; `prettier-plugin-astro` only brings `@astrojs/compiler`). ADR-0002 accepts Astro as the framework, so no new ADR is needed for it. Each package below still needs Alexandre's explicit approval before install (see "ADR needed"). Agents must not install until approved.

**Tooling note.** `pnpm` is not on this shell's PATH. Run it as `corepack pnpm ...` here.

**Config files.** `astro.config.mjs` (static output, `i18n: { defaultLocale: 'en', locales: ['en'], routing: { prefixDefaultLocale: false } }`), `tsconfig.json` extending `astro/tsconfigs/strict`, `.gitignore` and `.prettierignore` checked for `dist/` and `.astro/` (assumption: already present, verify).

**Feature flags.** `src/config/features.ts` exports one typed const:

```ts
export const features = { chartTool: false, testimonialsGuard: false } as const;
```

Nav items are built from a list in `src/config/nav.ts`, where the chart item carries `requires: 'chartTool'` and is filtered out at build time. The home chart section is a component imported behind the same check, so it is not rendered at all when off. The `/chart` route does not exist as a file under `src/pages/`: the stub page lives at `src/features/chart/chart.astro` and an inline integration in `astro.config.mjs` calls `injectRoute` only when `features.chartTool` is true. This needs no dependency. Assumption, unverified: `injectRoute` accepts an entrypoint outside `src/pages/` in the pinned Astro version. Check at task 5; if it does not, name the fallback in the PR rather than leaving a page that builds.

**i18n.** `src/i18n/en.json` holds strings (flat or nested keys, placeholder text only). `src/i18n/index.ts` exports `t(key, locale?)`. The key type is derived from `en.json`, so a wrong key is a type error in `pnpm check`. At runtime a missing key in the active locale throws, so `astro build` fails too (no silent fallback; the pt dummy must be complete). `src/i18n/routes.ts` is the route map from route key to slug per locale (`about` is `about` in `en`). A small `href(routeKey, locale)` wrapper in `src/lib/` calls Astro's `getRelativeLocaleUrl` with the mapped slug, so no component writes a path by hand. Dates and numbers use `Intl` (none are needed yet).

**Fonts.** Latin-subset woff2 files committed in `src/assets/fonts/` (EB Garamond, IBM Plex Sans, IBM Plex Mono; only the weights that `tokens.css` uses). `src/styles/fonts.css` declares `@font-face` with `font-display: swap`, and the fallback stacks already in `tokens.css` apply. No font npm package. All three families are licensed under the SIL OFL 1.1. Alexandre approved an agent downloading them. Use each family's upstream release or Google Fonts' open-source repository, keep each family's OFL licence text beside the files, and name the exact source URLs in the commit or PR notes. Downloads still go through the usual permission prompts.

**Layout and theme switch.** `src/layouts/Base.astro` sets `<html lang>`, imports `tokens.css` and `fonts.css`, emits `<link rel="alternate" hreflang>` per configured locale plus `x-default` (one entry today), a skip link first in `<body>`, and `<main id>`. Components `Header.astro`, `Footer.astro`, `ThemeSwitch.astro` are presentational and take strings from `t()`. Layout uses spacing and colour tokens only.

The switch is the only client JS. Stated reason (ADR-0002, ADR-0001): the first paint must match the saved theme, so a small inline `<script is:inline>` in `<head>` reads `localStorage` and sets `data-theme` on `<html>` before paint. Without a saved choice it sets nothing, and the `prefers-color-scheme` rule in `tokens.css` decides. The button's click handler lives in the same inline script file, toggles the attribute and persists it. No other script, tracker or island. The storage key is not user-facing and needs no i18n.

**Footer.** Substack link (URL in one config value, built from the publication in ADR-0002, `https://baltiskaskronikis.substack.com`), privacy link through the route map, and the AGPL source link. The source repository URL is not decided: keep it as a clearly named placeholder config value (Alexandre will settle it later). Labels come from `en.json`.

**Stub routes.** One `.astro` file per route under `src/pages/`, each with a `t()` heading and a placeholder body string from `en.json`, using the base layout. `404.astro` too. No invented bio, price, credential or testimonial. `/blog` shows only a placeholder, not the RSS feed (DAV-13).

**Literal guard (decided: Option A).** A local ESLint rule, `eslint-rules/no-raw-text.js`, reports text nodes and `alt`, `title`, `aria-label` and `placeholder` string attributes in `.astro` templates. It is wired into `eslint.config.js` for `src/**/*.astro`, excluding `src/i18n/**`, so `pnpm lint` fails on a violation. It needs `astro-eslint-parser` to parse `.astro` files, which Alexandre approved. `eslint-plugin-astro` is not approved: if the rule needs it, stop and ask. The work stays in task 9 so it does not touch other tasks. It ships a failing fixture under `tests/fixtures/literals/` (marked as a deliberate violation by a comment, per the PR-rules lesson) and a passing run on `src/`.

**Portuguese build check (design question).** The dummy `pt.json` and pt page must not ship. Proposal: keep them as fixtures in `tests/fixtures/pt/` (`pt.json`, one page such as `sobre.astro`), outside `src/`, so the real build never sees them. `scripts/check-pt-build.mjs` copies the repo working files (skipping `node_modules`, `dist`, `.git`) into a temp directory, links `node_modules`, drops in the fixtures, sets `locales: ['en','pt']` through an env var read by `astro.config.mjs`, runs `astro build` there, and asserts that the temp `dist/pt/sobre/index.html` exists with `lang="pt"` and an hreflang alternate for each locale. The real tree and real `dist/` stay English-only. Assumption: an env-driven locale list in `astro.config.mjs` is acceptable and tiny. Flagged under Open questions in case Alexandre prefers a different mechanism. The script is wired as `pnpm test:pt-build` and run in CI. Alexandre accepted this mechanism. Running it in CI is scope beyond the ticket text, so it is marked "(added)" in the acceptance criteria.

**No-chart check.** `scripts/check-no-chart.mjs` runs after `astro build` and fails if `dist/` has a `chart` route or any HTML containing the chart-tool nav href or the home-section marker. This is the evidence for the first AC.

## Tasks

1. Add the Astro scaffold: `astro`, `@astrojs/check` and `typescript` (approved), `astro.config.mjs`, `tsconfig.json` (strict), a minimal `src/pages/index.astro`, ignore files checked, and `package.json` scripts `dev`, `build` (`astro build`), `check` (`astro check`) replacing the echo no-ops. Commit: `feat(DAV-11): scaffold the astro project with strict typescript`
2. Add the self-hosted fonts: woff2 files in `src/assets/fonts/` (sourcing confirmed by Alexandre) and `src/styles/fonts.css`. Commit: `feat(DAV-11): self-host the latin font subsets`
3. Add i18n: `src/i18n/en.json`, typed `t()`, route map, `href()` wrapper over `getRelativeLocaleUrl`, and i18n routing config. Commit: `feat(DAV-11): add typed t() helper and locale route map`
4. Add `src/config/features.ts` with `chartTool` and `testimonialsGuard` (both `false`), plus `src/config/nav.ts`. Commit: `feat(DAV-11): add feature flags and nav config`
5. Gate the chart tool: stub chart page outside `src/pages/`, `injectRoute` only when the flag is on, home section behind the flag, and `scripts/check-no-chart.mjs`. Commit: `feat(DAV-11): gate the chart route and nav item behind the flag`
6. Add the base layout, header, footer and skip link, with hreflang and `<html lang>`. Commit: `feat(DAV-11): add base layout with header and footer`
7. Add the theme switch: inline head script, `ThemeSwitch.astro`, persisted choice. Commit: `feat(DAV-11): add the dark and light theme switch`
8. Add the stub routes (`/about`, `/approach`, `/consultations`, `/testimonials`, `/blog`, `/privacy`, 404) with placeholder strings in `en.json`. Commit: `feat(DAV-11): add stub routes for the launch pages`
9. Add the raw-literal guard (Option A, `astro-eslint-parser` approved) with a failing fixture. Commit: `feat(DAV-11): fail lint on raw text literals in astro templates`
10. Add the Portuguese build check: `tests/fixtures/pt/`, `scripts/check-pt-build.mjs`, `pnpm test:pt-build`. Commit: `test(DAV-11): prove a pt locale builds without refactor`
11. Update `.github/workflows/ci.yml` so `check-build` runs real `pnpm check`, `pnpm build`, the no-chart check and the pt build check (remove the "no-op" wording from step names and comments if any). Commit: `ci(DAV-11): run astro check and build for real`
12. Update the README quick-start and CONTRIBUTING "Code quality" (replace the "no-ops until DAV-11" line), and `CLAUDE.md` command notes only if Alexandre asks (rule files are not edited by this plan). Commit: `docs(DAV-11): document the astro commands`

Dependency approvals for tasks 1 and 9 are given (see "ADR needed"). No task is blocked.

## Verification

- `pnpm lint`, `pnpm format:check`: real evidence at every task (they already run). After task 9 `pnpm lint` also covers `.astro` templates.
- `pnpm check`, `pnpm build`: no-op until DAV-11, not evidence before task 1. Real evidence only after task 1 lands, and meaningful for pages and i18n only after tasks 3 and 8.
- After task 5: `pnpm build` then `node scripts/check-no-chart.mjs` passes with the flag off (AC 1). Manual: flip the flag locally, confirm the nav item, home section and `/chart` appear, then flip it back.
- After task 9: a deliberate literal in a scratch `.astro` file fails the guard (AC 2); the fixture proves it in CI.
- After task 10: `pnpm test:pt-build` passes, and the real `dist/` has no `pt` folder (AC 3).
- After task 11: the CI run on the PR is green with `check-build` executing for real (AC 4). Confirm in the Actions log that it did not skip.
- Manual, for Alexandre: both themes (Observatory and Paper), first-load with no flash, saved choice survives a reload, OS preference followed with no saved choice; mobile width; keyboard focus, the skip link and visible focus states; the mockup comparison (https://claude.ai/artifact/KDVDJN56YALPhvxussfnXC). Agents cannot read the mockup canvas, so the comparison and any deviations are a manual check.
- Fonts: confirm in the browser network tab that the three families load from the site's own origin.

## Applicable rules

- `.claude/pr-rules/common.md`
- `.claude/pr-rules/design.md`
- `docs/adr/0001-design-tokens.md`, `docs/adr/0002-site-architecture.md`
- `.cursor/rules/branch-naming.mdc`

Lessons applied: the plan names the one client script (theme switch) and where it loads, and says no other script is added; the guard fixtures and the pt fixture are marked as deliberate exceptions by a comment.

## ADR needed

none for Astro itself: ADR-0002 already accepts it as the framework. Alexandre approved these packages for install:

- `astro`: the framework (accepted in ADR-0002).
- `@astrojs/check`: provides `astro check` (named in the ticket).
- `typescript`: required by `astro check` and strict TypeScript.
- `astro-eslint-parser`: lets the custom literal rule parse `.astro` files (Option A).

Not approved: `eslint-plugin-astro` and anything else. Stop and ask before installing it.

## Open questions

1. `/chart` gating via `injectRoute` with the page outside `src/pages/`: assumption unverified for the pinned Astro version; confirm at task 5.

Settled by Alexandre: literal guard is Option A; an agent may download the fonts; the AGPL source link stays a placeholder for now; the temp-copy pt build check is acceptable; branch type is `feat`.
