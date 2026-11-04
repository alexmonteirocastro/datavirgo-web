# DAV-12 — Content pages (Home, About, Approach, Consultations, Testimonials, Privacy)

- Ticket: [DAV-12](https://linear.app/alex-projects/issue/DAV-12)
- Branch: `feat/DAV-12-content-pages` (local, ahead of `main`; the content foundation is already committed here and is not on `origin/main`)
- Pitch: Bet 003 — Website foundation
- Builds on: DAV-11 (scaffold), ADR-0001 (tokens), ADR-0002 (site architecture)
- Visual target: the approved desktop and mobile mockups. Dark and light are the same layouts.

## Goal

Turn the six launch routes into the mockup layouts. Placeholder copy stays visibly marked. The birth-chart calculator, its wheel, and every “Calculate your chart” teaser stay out while `features.chartTool` is `false`.

No new ADR. Folding Approach into `/about#approach` is recorded here, not in ADR-0002.

## Already committed on this branch

Do not recreate these. They are absent from `main`.

- `src/content.config.ts` — `pages` (`title`, `placeholder`) and `testimonials` (`quote`, `name`, `context`, `consent`, `placeholder`)
- `src/components/PlaceholderMark.astro` — `[PLACEHOLDER]` in every build, dashed outline only in dev
- `src/content/pages/en/{home,about,consultations,privacy}.md` and two testimonial seeds (`consent: false`)
- `placeholder.mark` in `src/i18n/en.json`

The routes are still stubs, except Home, which is a title plus `{features.chartTool && <ChartSection />}`. Leave that flag line in place.

## Decisions

1. **Chart tool is omitted, not hidden.** No home birth-chart column, no example wheel, no birth-details widget, no calculate control, no footer credit, no “free birth chart calculator” line. `scripts/check-no-chart.mjs` stays as it is: it looks for `dist/chart`, `data-feature="chartTool"`, and `href="/chart`. It does not search for the word “chart”.
2. **Nav, with the flag off:** About, Approach, Writing, Consultations, Enquire. Birth chart stays in `nav.ts` after Approach, with `requires: "chartTool"`. Testimonials is not in the header or the footer. The page stays, reached by “More from clients”. Enquire is not a route, so it is not a `navItems` entry. It is rendered in `Header.astro` (inline nav and mobile menu) and points at `/consultations#enquire`.
3. **Approach** is a section of About (`id="approach"`). The nav item links to `/about#approach`. `src/pages/approach.astro` is deleted. `astro.config.mjs` redirects `/approach` to `/about#approach`. The route key stays. The other sidebar targets are `id="experience"`, `id="training"`, and `id="expect"`.
4. **Home eyebrow** is `ASTROLOGY · CONSULTATIONS`.
5. **Home blurbs** live in `home.md`, three parts separated by a line `@@` (intro, consultations, writing), so the columns can hold real `href()` links. Latest-writing cards are three marked placeholders. DAV-13 replaces them with the feed.
6. **Consultations** prose, steps, and reading rows live in `consultations.md`. Names, durations, and prices stay bracketed placeholders. The enquire panel states that a message is sent by email and not stored, then a marked slot for the DAV-14 form. No inputs, no Turnstile, no client JS.
7. **Privacy** describes this build: nothing is stored, no cookies, no third-party scripts. It does not say Turnstile or Web Analytics are running. DAV-14 and DAV-15 add those sentences when the features exist. `placeholder: false`.
8. **Testimonials guard** is a post-build script, inert while `features.testimonialsGuard` is `false`. DAV-15 flips the flag. Do not flip it here.
9. **Portuguese fixture.** Every new `en.json` key, including the already-missing `placeholder.mark`, is copied into `tests/fixtures/pt/pt.json`. No `pt/` content folder. `routes.json` is unchanged.
10. **Blog** stays a stub (DAV-13). Its nav label and document title are “Writing”.

## Verification

- `pnpm check`, `pnpm lint`, `pnpm test:literals`, `pnpm test:pt-build`
- `pnpm build`, then `node scripts/check-no-chart.mjs` and `node scripts/check-testimonials.mjs` (guard off, exit 0). Copy that says “your chart” still passes.
- Browser, both themes, desktop and a narrow viewport: `/`, `/about`, `/about#approach`, `/approach`, `/consultations`, `/testimonials`, `/privacy`. Header is About, Approach, Writing, Consultations, Enquire. No Testimonials item, no Birth chart, no calculate control. Placeholder label on unreal copy; dashed outline only in dev. Privacy has neither the mark nor a mention of Turnstile or analytics.
