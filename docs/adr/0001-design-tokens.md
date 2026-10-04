# ADR-0001: Design tokens

- Status: accepted
- Date: 2026-10-04
- Ticket: [DAV-9](https://linear.app/alex-projects/issue/DAV-9)
- Implements: [`src/styles/tokens.css`](../../src/styles/tokens.css)

## Context

The visual identity was decided in the mockup canvas ([DAV-7](https://linear.app/alex-projects/issue/DAV-7)): name and wordmark, two themes, a type pairing, a glyph set and the chart-wheel style. The site scaffold ([DAV-11](https://linear.app/alex-projects/issue/DAV-11)) and the chart wheel ([DAV-16](https://linear.app/alex-projects/issue/DAV-16)) need those decisions as code, so components never hard-code a colour, font or size. The same values will feed the Canva templates on the roadmap, so they also need to be readable as a plain table.

Mockups: [DataVirgo — Visual identity & mockups](https://claude.ai/artifact/KDVDJN56YALPhvxussfnXC). The values below were taken from its files, not re-picked.

## Decision

All design values live as CSS custom properties in `src/styles/tokens.css`. Components read tokens only. A new value means a new token first.

### Colour: named by role, two themes

Roles, not hues: `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-rule`, `--color-border-field`, `--color-text`, `--color-text-muted`, `--color-link`, `--color-accent`, `--color-on-accent`, `--color-focus`, and the chart roles `--color-aspect-hard`, `--color-aspect-soft`, `--color-retrograde`. Every role is defined in both themes, under the same name.

- **Observatory (dark)** is the default in the stylesheet: near-black blue, silver text, the logo's signal blue as the only accent.
- **Paper (light)**: warm paper and navy ink.
- The theme is set by `data-theme="dark|light"` on `<html>`. Without the attribute, `prefers-color-scheme` decides. The header switch sets and persists the attribute ([DAV-11](https://linear.app/alex-projects/issue/DAV-11)). `color-scheme` is set per theme, so native controls and scrollbars follow.

| Role                     | Observatory (dark) | Paper (light) | Used for                                  |
| ------------------------ | ------------------ | ------------- | ----------------------------------------- |
| `--color-bg`             | `#080D16`          | `#F5F3EE`     | Page background                           |
| `--color-surface`        | `#0E1523`          | `#FFFFFF`     | Bands, cards, form panels                 |
| `--color-surface-raised` | `#141D30`          | `#ECE8DF`     | Image placeholders, nested panels         |
| `--color-rule`           | `#233049`          | `#D5D0C4`     | Dividers and card borders (decorative)    |
| `--color-border-field`   | `#56657F`          | `#8A8577`     | Input and ghost-button borders            |
| `--color-text`           | `#E4E9F0`          | `#141B2B`     | Body and headings                         |
| `--color-text-muted`     | `#95A0B3`          | `#505A6B`     | Secondary text, captions, eyebrows        |
| `--color-link`           | `#5AA2EA`          | `#1F5FAE`     | Links; "Data" in the wordmark             |
| `--color-accent`         | `#5AA2EA`          | `#1F5FAE`     | Primary button fill, active theme switch  |
| `--color-on-accent`      | `#06101F`          | `#FFFFFF`     | Text on the accent                        |
| `--color-focus`          | `#5AA2EA`          | `#1F5FAE`     | Focus ring                                |
| `--color-aspect-hard`    | `#E0955F`          | `#B4541C`     | Hard aspects (square, opposition): dashed |
| `--color-aspect-soft`    | `#5AA2EA`          | `#1F5FAE`     | Soft aspects (trine, sextile): solid      |
| `--color-retrograde`     | `#FF6B6B`          | `#B42318`     | Retrograde planet glyph and the ℞ mark    |

Element tints for the wheel's background band (`--color-element-*`) are defined in every theme block, with the same values for now: fire `rgb(232 120 72 / 0.16)`, earth `rgb(132 168 92 / 0.16)`, air `rgb(226 196 86 / 0.14)`, water `rgb(84 146 230 / 0.18)`.

### Contrast (WCAG 2.x)

Measured against each background the role can sit on.

| Foreground            | Dark: bg / surface / raised | Light: bg / surface / raised | Needs |
| --------------------- | --------------------------- | ---------------------------- | ----- |
| `text`                | 15.95 / 14.96 / 13.79       | 15.50 / 17.19 / 14.06        | 4.5   |
| `text-muted`          | 7.37 / 6.92 / 6.38          | 6.28 / 6.96 / 5.69           | 4.5   |
| `link`                | 7.22 / 6.77 / 6.24          | 5.73 / 6.35 / 5.19           | 4.5   |
| `on-accent` on accent | 7.07                        | 6.35                         | 4.5   |
| `aspect-hard`         | 8.00 / 7.51 / 6.92          | 4.48 / 4.97 / 4.06           | 3     |
| `aspect-soft`         | 7.22 / 6.77 / 6.24          | 5.73 / 6.35 / 5.19           | 3     |
| `retrograde`          | 7.01 / 6.58 / 6.06          | 5.93 / 6.57 / 5.38           | 3     |
| `border-field`        | 3.30 / 3.10 / **2.86**      | 3.32 / 3.68 / 3.01           | 3     |
| `rule`                | 1.47 / 1.38 / 1.27          | 1.39 / 1.54 / 1.26           | n/a   |

Accepted risks:

- **`--color-border-field` on `--color-surface-raised` (dark) is 2.86:1**, under the 3:1 for UI component boundaries. Inputs and ghost buttons sit on `bg` or `surface` only. Do not place a form control on a raised surface; if a design needs it, add a token rather than reuse this one.
- **`--color-rule` is below 3:1** in both themes. It is decorative (dividers, card edges) and never the only cue that something is interactive or grouped.
- **`--color-aspect-hard` (light) is 4.06–4.97:1.** It is used for lines, which need 3:1. Do not use it for text.
- Hard and soft aspects differ by hue (orange vs blue) **and** by line style (dashed vs solid), so they stay distinguishable without colour vision. Retrograde is shown by colour **and** the ℞ mark.

### Type

- Families: **EB Garamond** for headings and the wordmark, **IBM Plex Sans** for UI and body, **IBM Plex Mono** for data. Each has a system fallback stack. Self-hosted in [DAV-11](https://linear.app/alex-projects/issue/DAV-11); no Google Fonts request at runtime.
- Weights: 400, 500, 600. Headings use 500.
- Scale, from the mockups (rem, at a 16px root): 12, 13, 15, 17 (body), 20 (lead), 26, 32, then three fluid steps: 32–40 (section titles), 36–56 (page titles) and 46–76 (home hero). The fluid steps are at their minimum at the 390px mobile mockups and at their maximum at the 1440px desktop mockups; they plateau slightly earlier (for example, section titles reach 32px from about 533px and 40px from about 1200px).
- Line height: 1.05 for display, 1.2 for headings, 1.6 for body.
- Eyebrows: mono, 12px, uppercase, `0.14em` tracking.
- **Data uses tabular numerals** (`font-variant-numeric: var(--font-numeric-data)`) so degrees and dates line up.
- Reading measure: `--measure: 66ch` for long-form text (about 680–720px, matching the Writing and About mockups).

### Spacing, layout, radii

- A 4px-based spacing scale, `--space-1` (4px) to `--space-12` (112px), covering every gap in the mockups.
- `--gutter` runs from 20px on phones to 96px at 1440px. `--section-gap` runs from 64px to 112px.
- Controls are 48px tall; nothing interactive is under 44px.
- Radii: `--radius-sm: 2px` for buttons, inputs and cards (the look is square and printed, not soft). `--radius-pill` only for the theme switch.

### Chart wheel

- Structure lines (cusps, ticks, sign-ring lines) at `--chart-structure-opacity: 0.55`.
- Hard aspects dashed (`--chart-aspect-hard-dash: 5 3`), soft aspects solid.
- Retrograde planets: glyph in `--color-retrograde`, plus the ℞ mark.
- Clusters of three or more bodies alternate onto an inner ring with leader lines to their exact degree. This is a layout rule for [DAV-16](https://linear.app/alex-projects/issue/DAV-16), not a token.

### Glyphs (answers [DAV-8](https://linear.app/alex-projects/issue/DAV-8))

The site uses the **DataVirgo vector glyph set**, not a symbol font: 29 SVGs in [`src/assets/glyphs/`](../../src/assets/glyphs/) (11 bodies including the node, 12 signs, 5 aspects, ℞). 24 × 24 grid, stroke only, `currentColor`, stroke width `--chart-glyph-stroke` (1.6). Inlined, so they take the theme colour.

### Brand marks

The compact mark (Virgo glyph in a ring), its 16px variant and the flat redraw of the full logo are in [`src/assets/brand/`](../../src/assets/brand/). They use the colour tokens when inlined. Each token reference carries a hex fallback, the Observatory (dark) value, for when a file is loaded as an image (for example the favicon). This is the one place hex values appear outside `tokens.css`; the fallback does not follow the theme. The wordmark is live text ("Data" in `--color-link`, "Virgo" in `--color-text`, `--font-serif` at 500), not an image. The marks are **drafts** until the logo redraw is signed off; swapping the files does not change any token.

## Consequences

- Components and the wheel read roles, so a third theme, or a palette tweak, is a change to `tokens.css` only.
- Both theme blocks must be kept in step: the light values appear twice (OS preference and explicit choice). The PR rules already require both themes for any new colour token.
- Unicode astrology symbols are not used anywhere, which removes the iOS and Android emoji-presentation problem but means every new symbol is drawn as an SVG first.
- Self-hosting three families adds font files to the build; subsetting is a DAV-11 concern.
- The hex table above is the hand-off to Canva templates.

## Alternatives

- **Hue-named colours** (`--blue-500`): rejected. They break as soon as the light theme maps "blue" to a different value, and they don't say where a colour may be used.
- **The other mockup palettes** (Nocturne, Lapis, Dusk): Observatory is closest to the existing logo; Dusk was the lighter-dark option, and Paper covers the light need better.
- **Editorial pairing** (Newsreader, Instrument Sans, JetBrains Mono): Scholarly read as more bookish, which fits the practice.
- **Symbol fonts** (Noto Sans Symbols and similar): rendering varies by platform and iOS and Android can swap in emoji. See [DAV-8](https://linear.app/alex-projects/issue/DAV-8).
- **Tokens in a JSON source with a build step** (Style Dictionary): not worth a dependency for one site and two themes. Revisit if the Canva templates or the app need the same tokens programmatically.
