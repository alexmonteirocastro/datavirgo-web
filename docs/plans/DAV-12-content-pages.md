# DAV-12 — Content pages (Home, About, Approach, Consultations, Testimonials, Privacy)

- Ticket: [DAV-12](https://linear.app/alex-projects/issue/DAV-12)
- Branch: `feat/DAV-12-content-pages`
- Pitch: Bet 003 — Website foundation
- Builds on: DAV-11 (scaffold), ADR-0001 (tokens), ADR-0002 (site architecture)

## Context

DAV-11 scaffolded the site: i18n layer (`t()` + route map), `Base` layout, header/footer,
design tokens, feature flags, and the chart-tool gating. Every launch route
(`src/pages/*.astro`) is currently a one-line wrapper around `StubPage.astro` that shows a
title and one generic placeholder sentence.

DAV-12 turns the six consultation-launch pages into real page components whose prose comes
from a new Markdown content collection (`src/content/pages/en/`), per ADR-0002. Because no
real bio, approach text or testimonials exist yet (CLAUDE.md: _do not invent bio, prices or
testimonials_), most copy ships as **visibly-marked placeholder** that cannot pass as real,
and the testimonials collection + its build-time guard are wired but left inert
(`features.testimonialsGuard` stays `false`; DAV-15 flips it). The outcome is a complete,
navigable site shell with the real page structure and i18n/content discipline in place, so
later tickets (DAV-13 blog, DAV-14 contact form, DAV-15 launch) only swap content in, not
restructure.

## Decisions (resolving the open questions)

1. **Home "latest 3 posts" (depends on DAV-13, not built):** render a visibly-marked
   placeholder "latest writing" block (3 static placeholder cards) so the Home composition
   matches the mockup now. DAV-13 replaces the block's data source with the Substack RSS
   `src/lib/` fetch; the surrounding layout stays. Avoids reworking Home twice.
2. **Consultations contact form (DAV-14):** a single clearly-marked placeholder block
   ("[PLACEHOLDER] — enquiry form arrives in DAV-14"), not a fake form. No form markup, no
   Turnstile, zero client JS.
3. **Testimonials guard location:** a **post-build Node script**
   `scripts/check-testimonials.mjs`, mirroring `scripts/check-no-chart.mjs`. A render-time
   `throw` is rejected: it would fail _every_ `astro build` (including previews), but
   ADR-0002 requires the guard to fail only CI-on-PR and the Cloudflare **production** build
   (`CF_PAGES_BRANCH === "main"`), never dev/preview. The script reads
   `features.testimonialsGuard` by regex from `features.ts` (same trick as the chart check);
   while `false` it prints "guard off" and exits 0 — proven inert by shipping deliberately
   bad seed entries. DAV-15 flips the flag; no script change needed then.
4. **Testimonials seed content:** two entries that are _obviously_ placeholders —
   `quote`/`name`/`context` literally containing `[PLACEHOLDER]`, `consent: false`,
   `placeholder: true`. They exist only to exercise the collection, rendering and guard;
   they do not resemble real testimonials.
5. **Privacy copy = real, not placeholder.** It states settled implementation fact from
   ADR-0002 (Cloudflare Worker + Turnstile + Email Routing, no persistence; birth details
   sent by email, never stored; cookieless Web Analytics beacon; no cookie banner). This is
   not invented bio/testimonial content, so Privacy ships with `placeholder: false` and no
   marker. The chart-tool privacy section is explicitly deferred to Bet 004.
6. **Pages collection schema:** frontmatter carries `title` (string) and
   `placeholder: boolean`; the body is Markdown prose. Driving the marker from a data field
   (rather than only a literal prefix in the body) lets the page component apply the
   always-on `[PLACEHOLDER]` label _and_ the dev-only outline consistently, and lets a page
   be promoted to real copy later by flipping one field.
7. **`StubPage.astro` stays.** `blog.astro` remains a stub until DAV-13 and `404.astro`
   keeps its own body, so `StubPage` is still used by the blog route — not dead code.
8. **About and Approach are one page, both routes kept** (confirmed against the mockup,
   which has a single "Experience and approach" frame). The combined content lives on
   `/about` with an `## Approach` section (`id="approach"`). `/approach` is kept as a route
   but **redirects to `/about#approach`** via `redirects` in `astro.config.mjs` (static-safe;
   Cloudflare Pages honours it). This matches the mockup without duplicating content (no SEO
   duplicate-content), and keeps both nav items. `src/pages/approach.astro` is deleted (the
   redirect replaces it); there is **no** `approach.md` content file — its prose is a section
   in `about.md`.

## Collections — `src/content.config.ts` (new)

> Path note: Astro's current config location is `src/content.config.ts` (at `src/` root),
> not `src/content/config.ts`. The collections and schemas are unchanged.

Astro 7 content collections: `defineCollection` from `astro:content`, `glob` from
`astro/loaders`, `z` from `astro/zod` (all built in — no new dependency).

```
pages        — loader: glob({ pattern: "**/*.md", base: "./src/content/pages" })
               schema: { title: z.string(), placeholder: z.boolean().default(true) }
testimonials — loader: glob({ pattern: "**/*.md", base: "./src/content/testimonials" })
               schema: { quote: z.string(), name: z.string(), context: z.string(),
                         consent: z.boolean().default(false),
                         placeholder: z.boolean().default(true) }
```

Per-locale folders: `src/content/pages/en/{home,about,consultations,privacy}.md`
and `src/content/testimonials/en/*.md`. (No `approach.md` — Approach is a section of
`about.md`; see decision 8.) Portuguese later = a new `pt/` folder, no code
change (matches ADR-0002's "one folder per locale"). The collection entry id encodes the
locale (`en/home`), so pages look up `en/<name>`.

## New / changed files

**Content (new Markdown):**

- `src/content/pages/en/home.md` — `placeholder: true`; one-line intro + "what a
  consultation is", all `[PLACEHOLDER]`-marked.
- `src/content/pages/en/about.md` — `placeholder: true`; combined "Experience and approach"
  content, including an `## Approach` section anchored as `#approach` (decision 8).
- `src/content/pages/en/consultations.md` — `placeholder: true`; session/prep prose.
- `src/content/pages/en/privacy.md` — `placeholder: false`; real copy from ADR-0002.
- `src/content/testimonials/en/placeholder-1.md`, `placeholder-2.md` — bad-on-purpose seeds
  (`consent: false`, `placeholder: true`).

**Route change for Approach:** delete `src/pages/approach.astro` and add
`redirects: { "/approach": "/about#approach" }` to `astro.config.mjs` (decision 8). The
`approach` route key stays in `routes.ts` and the nav item stays.

**Page components (replace the stub wrappers):** `src/pages/{index,about,
consultations,testimonials,privacy}.astro`. Each:

- imports `Base`, `getEntry`/`getCollection` from `astro:content`, `render()` for the body,
  `t` + `defaultLocale`, and the new `PageBody`/`PlaceholderMark` helper;
- passes `title` (a `MessageKey`) and `route` to `Base` (document-title chrome stays in
  `en.json`, body prose comes from the collection — no raw literals in the template);
- renders the Markdown `<Content />` wrapped so a `placeholder: true` entry gets the textual
  `[PLACEHOLDER]` prefix (all builds) and the dev-only outline (`import.meta.env.DEV`).
- `index.astro` additionally renders the marked "latest writing" placeholder block and the
  contact CTA (link to `consultations` via `href()`), and keeps the existing
  `{features.chartTool && <ChartSection />}` line untouched (stays off).
- `consultations.astro` additionally renders the marked contact-form placeholder block.
- `testimonials.astro` renders `getCollection("testimonials")` entries, each marked when
  `placeholder` or `!consent`.

**Shared placeholder marker:** `src/components/PlaceholderMark.astro` (presentational,
zero JS) — wraps content, prepends the `t("placeholder.mark", locale)` label, and applies
class `is-placeholder`. Its CSS lives in a `<style>` block using tokens only
(dashed `--color-border-field` outline + muted label); the outline is gated behind
`import.meta.env.DEV` so production shows the textual marker without the dev outline.

**Guard script:** `scripts/check-testimonials.mjs` (new), wired into `package.json`
(`"test:testimonials"`) and the CI `check-build` job after `pnpm build`. Inert while the
flag is off.

**i18n — new keys in `src/i18n/en.json`** (chrome only; prose lives in the collection):

- `placeholder.mark` — the `[PLACEHOLDER]` label text.
- `home.lead`, `home.latestWriting`, `home.cta` — section headings / CTA label.
- `consultations.formPlaceholder` — the DAV-14 slot label.
- `testimonials.intro` (optional section heading), `testimonials.placeholderNote`.
  (`MessageKey` regenerates from the shape automatically; `pnpm check` catches typos.)

**Possibly removed:** nothing. `StubPage.astro` stays (blog route). If after wiring every
in-scope route the `pages.*.title`/`pages.placeholder` keys in `en.json` are now unused,
leave `pages.placeholder` (still used by `blog.astro`'s stub) and keep the per-page
`pages.<name>.title` keys as the `Base` document titles.

## Constraints honoured

- No raw text literals in `.astro` templates (ESLint `no-raw-text` + `t()`); prose is in
  Markdown, chrome is in `en.json`. `pnpm test:literals` must still pass.
- Tokens only — the placeholder outline uses `--color-border-field`/`--color-text-muted`,
  no hard-coded colour, font or spacing (ADR-0001).
- Zero client JS: every page is static; the placeholder marker and CTA are plain markup.
- No new dependencies (`zod`/`astro:content` are built in).
- Chart tool stays invisible: `index.astro`'s flag line is unchanged and
  `scripts/check-no-chart.mjs` must still pass.

## Verification

1. `pnpm check` — types pass, including the regenerated `MessageKey` union and the
   content-collection schemas.
2. `pnpm lint` and `pnpm test:literals` — no raw literals slipped into templates.
3. `pnpm build` then `node scripts/check-no-chart.mjs` — build succeeds, no chart
   route/link/section in `dist/` (flag off).
4. `node scripts/check-testimonials.mjs` — prints "guard off", exits 0, **despite** the two
   bad seed entries (proves the guard is inert while `features.testimonialsGuard` is false).
   Temporarily flipping the flag to `true` locally should make it exit 1 on those entries;
   revert the flag before finishing.
5. `pnpm test:pt-build` — the pseudo-`pt` build still succeeds (collection + i18n remain
   locale-extensible).
6. `pnpm dev` — visit `/`, `/about`, `/consultations`, `/testimonials`, `/privacy`:
   placeholder pages show the `[PLACEHOLDER]` label **and** the dashed dev outline; Privacy
   shows real copy with no marker; Home shows the marked latest-writing block and the contact
   CTA; nav/footer/theme switch still work; no chart-tool mention anywhere. Visiting
   `/approach` redirects to `/about#approach` and the nav "Approach" item still works.
7. `pnpm build` output inspection — the `[PLACEHOLDER]` textual label is present in the
   built HTML (prod), but the dev-only outline class styling is not applied.

## Out of scope (other tickets)

Real Substack RSS feed for Home/blog (DAV-13); the contact form Worker/Turnstile (DAV-14);
flipping `features.testimonialsGuard` and the production-domain launch checklist (DAV-15);
the chart-tool privacy section and reveal (DAV-23 / Bet 004).
