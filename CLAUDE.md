# DataVirgo Web

Marketing website for DataVirgo: Alexandre's astrology consultations, scholarly
blog (Substack RSS) and, later, a public chart tool. English-only at launch,
built so Portuguese and other languages can be added.

## Stack

- Astro at the repo root, TypeScript strict
- Hosted on Cloudflare Pages
- Chart API lives in a separate repo (`datavirgo-app`, FastAPI on Render at `api.<domain>`). Do not duplicate engine logic here.
- Blog content comes from Substack RSS. Substack stays canonical.

## Commands

- `pnpm dev` — no-op until the Astro dev server lands in DAV-11
- `pnpm build` — no-op until the Astro production build lands in DAV-11
- `pnpm check` — no-op until `astro check` lands in DAV-11
- `pnpm lint` — ESLint
- `pnpm format:check` — Prettier

## Priorities and scope

- Launch site mentions consultations only. The chart tool is hidden behind the `features.chartTool` flag (DAV-23). Never expose it unflagged.
- Consultations are enquiry-by-contact-form only. No booking or payment flow.
- Copy is placeholder until real copy exists. Do not invent bio, prices or testimonials.

## Design rules

- Follow `docs/adr/0001-design-tokens.md`. Never hard-code colours, fonts or spacing; use tokens.
- Type: EB Garamond (headings/serif), IBM Plex Sans (UI), IBM Plex Mono (data).
- Themes: dark = Observatory (bg #080D16, accent #5AA2EA); light = Paper (bg #F5F3EE, accent #1F5FAE). Header switch, default from `prefers-color-scheme`, persisted.
- Glyphs are the DataVirgo SVG set (24x24, stroke). Do not use font glyphs or add an icon library.
- Chart wheel: retrograde = red glyph + ℞ (#FF6B6B dark / #B42318 light); hard aspects dashed orange, soft solid blue; structure lines at 55% opacity; clusters of 3+ alternate onto an inner ring with leader lines.
- Mockups: https://claude.ai/artifact/KDVDJN56YALPhvxussfnXC (match them; flag deviations).

## i18n

- All user-facing strings go through the i18n layer. No literals in components.
- Routes and content must work with a locale prefix added later.

## Architecture

- Site shape: `docs/ARCHITECTURE.md`.
- Decisions: `docs/adr/`. Read them before contradicting a decision. If a change needs a new decision, propose an ADR instead of just coding it.
- Components are small and presentational; data fetching lives in `src/lib/`.
- Prefer zero client JS. Add an island only with a stated reason.
- No new dependencies without explicit approval.

## Workflow

- Work is tracked in Linear, team DataVirgo, key `DAV`. Every change maps to one ticket.
- Branch: `<type>/DAV-NNN-slug` (see CONTRIBUTING.md). One ticket, one PR.
- Explore and plan before editing. If the plan rests on a wrong assumption, restart the session with a corrected brief rather than patching.
- Plans live in docs/plans/; run /plan before editing.
- Never commit, push or open PRs. Alexandre does that.

## Don't

- Don't read or print `.env*`, keys or secrets.
- Don't add trackers or third-party scripts without approval.
- Don't commit generated or build output.
- Don't claim certifications, testimonials or credentials that were not supplied.

## Lessons learned

<!-- Add one bullet each time the AI repeats a mistake. Keep it short and imperative. -->
