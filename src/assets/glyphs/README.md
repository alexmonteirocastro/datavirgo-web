# DataVirgo glyph set

Planets, the lunar node, the twelve signs, the five major aspects and the retrograde mark (℞). Exported from the mockup canvas (`Glyph` component), and recorded in [ADR-0001](../../../docs/adr/0001-design-tokens.md).

- 24 × 24 grid, stroke only (`fill="none"`, `stroke="currentColor"`), stroke width 1.6, round caps and joins.
- No font dependency, so no emoji presentation on iOS or Android.
- Inline the SVG so it takes `currentColor`. Give it an accessible name where it carries meaning (for example `role="img"` and `aria-label="Mercury, retrograde"`), and keep `aria-hidden="true"` where a text label sits next to it.
- File names are meant to match the stable body, sign and aspect IDs from the app repo's ADR-0001 ([DAV-1](https://linear.app/alex-projects/issue/DAV-1)), so chart labels can look a glyph up by ID. If that ADR settles on different IDs, rename the files here.
