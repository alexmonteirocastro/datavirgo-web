# ADR-0002: Site architecture

- Status: proposed (one open question: the Substack feed URL)
- Date: 2026-10-04
- Ticket: [DAV-10](https://linear.app/alex-projects/issue/DAV-10)
- Unblocks: [DAV-11](https://linear.app/alex-projects/issue/DAV-11) (scaffold), [DAV-14](https://linear.app/alex-projects/issue/DAV-14) (contact form)
- Pitch: [Bet 003 — Website foundation](https://app.notion.com/p/3e9c8438565c81b29b6de86b32d56814)

## Context

The launch site is consultation-only: Home, About, Approach, Consultations (with an enquiry form), Testimonials, Blog and Privacy. The chart tool arrives later and stays hidden until then. English ships first, and Portuguese must be addable without a rebuild of the site's structure. Content is written by one person and changes rarely; the blog already lives on Substack. This ADR fixes the decisions that [DAV-11](https://linear.app/alex-projects/issue/DAV-11) to [DAV-15](https://linear.app/alex-projects/issue/DAV-15) build on, so they are not re-argued per ticket.

Colours, type and spacing are in [ADR-0001](0001-design-tokens.md). The chart engine and API are in `datavirgo-app` (see the [ADR index](README.md)).

## Decision

### Shape and hosting

- **Astro, static output, at the root of this repo** (`datavirgo-web`), separate from `datavirgo-app`. Deployed on Cloudflare Pages. No engine logic is duplicated here.
- **Zero client JS by default.** An island needs a stated reason. Known ones: the theme switch (inline script, to avoid a flash of the wrong theme) and, later, the chart tool.
- Data fetching lives in `src/lib/`; components stay presentational.
- The chart tool is gated by one config value, `features.chartTool` ([DAV-23](https://linear.app/alex-projects/issue/DAV-23)), **off at launch**. It gates the nav item, the home section and the `/chart` route. With the flag off, nothing on the site mentions a chart tool.

### i18n

- Astro i18n routing: `defaultLocale: 'en'`, `locales: ['en']` for now, `prefixDefaultLocale: false`. English is at `/about`; Portuguese can later be at `/pt/sobre`.
- **No literal UI strings in components.** All strings live in `src/i18n/<locale>.json` and go through one `t()` helper. Adding a language means adding `pt.json`.
- **Page content** is Markdown in a content collection, one folder per locale: `src/content/pages/<locale>/`.
- **Slugs are localised through a route map**, never assumed to be English. Links are built from route keys, not hand-written paths, so a locale prefix can be added later.
- Dates and numbers use `Intl`, never hand formatting. `<html lang>` and `hreflang` are wired from day one, even with one locale.
- **Chart labels** (signs, bodies, aspects) are not needed at launch. When the chart tool arrives they go in the same dictionaries, keyed by the stable IDs from `datavirgo-app` ADR-0001 ([DAV-1](https://linear.app/alex-projects/issue/DAV-1)). Labels are never keyed by display text.

### Blog: Substack stays canonical

- At build time, fetch the publication RSS feed and render an index: title, date, excerpt, cover image, each linking out to Substack. Posts are not copied or re-hosted. Cover images are hotlinked from Substack's CDN, not downloaded.
- The feed carries only recent posts (about 20) and truncates paywalled posts. That is enough for an index.
- **Daily rebuild** so new posts appear without a push: a Cloudflare Cron Trigger calls the Pages deploy hook. (Alternative in the next section.)
- A "Subscribe on Substack" link replaces any newsletter of our own.
- **Circuit breaker:** if the feed cannot be confirmed or parsed, the blog ships as a static "Read my writing on Substack" card. A failed feed fetch at build time must not fail the build or empty the page; it falls back to that card.

### Contact form

- A **Cloudflare Worker** receives the POST, verifies the Turnstile token server-side, and sends the message to Alexandre's inbox through Cloudflare Email Routing. **No database, no persistence.** This reuses the pattern of Töökratt ADR-0016.
- Fields: name, email, message, optional birth details, and a consent checkbox.
- **Birth details are optional and never logged.** The Worker logs no request bodies, and the Privacy page says plainly that details are sent by email and not stored.
- Consultations are enquiry-by-form only. There is no booking or payment flow.
- The Worker's wiring is [DAV-14](https://linear.app/alex-projects/issue/DAV-14); the domain and Email Routing setup is [DAV-20](https://linear.app/alex-projects/issue/DAV-20).

### Testimonials

- A content collection with the fields: quote, name or initials, context (for example "natal consultation, 2025"), `consent: boolean` and `placeholder: boolean`.
- **The production build fails if any entry has `placeholder: true` or `consent: false`.** Invented or unapproved testimonials cannot go live by accident. Development and preview builds show placeholders, visibly marked.

### Analytics

- Cloudflare Web Analytics (cookieless), so no cookie banner is needed. No other tracker or third-party script without a new decision.

### Open question: the Substack feed URL

`substack.com/@datavirgo` is a **profile**, not a publication. The feed is `<publication>.substack.com/feed` or `<custom-domain>/feed`. **Still open.** It needs Alexandre to confirm the publication address; a quick lookup of the profile page did not give a reliable answer, so nothing is recorded here as fact. The URL goes in one config value, so it can be changed without touching code. [DAV-21](https://linear.app/alex-projects/issue/DAV-21) renames the Substack subdomain and adds a `blog.` custom domain, which will change the feed URL once. Update this section, and set the status to accepted, once it is confirmed.

## Consequences

- Hosting is cheap and fast, and there is no server to run for the site. The only runtime pieces are the contact Worker and the rebuild trigger.
- Adding Portuguese is a new `pt.json`, a new content folder and route-map entries, not a restructure. The cost is paying the `t()` and route-map discipline from the first component.
- New blog posts can lag by up to a day (the next rebuild), and the index shows only recent posts. Acceptable for an index that links out.
- Substack is a dependency for the blog. If it changes its feed, the fallback card keeps the page alive.
- The testimonials guard turns an editorial risk into a build failure, which means a launch can be blocked until real, consented quotes exist.
- No persistence means a lost email is lost. The Worker should return an error the visitor can see so they can retry or write directly.

## Alternatives

- **Same repo as the engine and API** (`web/` next to `api/`): rejected. The site and the API have different deploy targets and cadences, and the engine's licence and review rules should not gate copy edits. `datavirgo-web` is its own repo, which is why this ADR is numbered 0002 here (the pitch calls it ADR-0004 in a shared numbering that no longer applies).
- **A CMS** (Sanity, Decap and similar): rejected. One editor, rare changes, and Markdown in the repo is reviewable and free.
- **Copying Substack posts into the site**: rejected. It splits the canonical source and invites duplicate-content problems.
- **Own newsletter or comments**: rejected for launch. Substack already does this.
- **Rebuild trigger via a scheduled GitHub Action** instead of a Cron Trigger: viable and needs no extra Cloudflare piece. Rejected as the default because GitHub disables scheduled workflows on repos with no activity for 60 days, which a quiet solo repo can hit. Revisit if the Worker count becomes a burden.
- **Contact form storing messages** (D1, KV): rejected. It makes the site a processor of birth data and adds a retention policy to write.
- **Mailto link or a third-party form service**: rejected. A mailto has no spam protection and a third-party service is an unvetted processor of personal data.
- **Google Analytics or similar**: rejected. It needs a cookie banner and sends visitor data to a third party.
