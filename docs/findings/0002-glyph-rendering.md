# Finding 0002: astrological glyph rendering

Ticket: [DAV-8](https://linear.app/alex-projects/issue/DAV-8). Date: 2026-10-04. Status: Windows not tested yet.

## Question

The Unicode sign characters (♈–♓) render as coloured emoji on iOS and some Android versions. Does a text-presentation selector (U+FE0E) plus a symbol font fix that well enough for the site, or should the site use its own SVG glyph set?

## Method

One static test page showed the 12 signs and the planets and node as:

1. plain Unicode,
2. Unicode followed by U+FE0E (text presentation),
3. Unicode followed by U+FE0F (emoji presentation),
4. the DataVirgo SVG set ([`src/assets/glyphs/`](../../src/assets/glyphs/)), inlined, `currentColor`.

Rows 1 to 3 were also shown at 16px for the signs, and the SVGs at 24px and 16px (planets and ℞ included). No symbol font was loaded, so rows 1 to 3 use whatever the platform provides.

## Results

| Platform                                           | Plain Unicode signs | With U+FE0E    | SVG set        |
| -------------------------------------------------- | ------------------- | -------------- | -------------- |
| iOS 26.0 Simulator (iPhone 17), Safari 26.0.1      | Purple emoji tiles  | Text glyphs    | Correct        |
| Android 17 (API 37) emulator (Pixel 8), Chrome 149 | Coloured emoji      | Text glyphs    | Correct        |
| macOS 26.6.2, Chrome 154 (headless)                | Purple emoji tiles  | Text glyphs    | Correct        |
| Windows 10/11 (Chrome, Edge, Firefox)              | Not tested yet      | Not tested yet | Not tested yet |

Screenshots: [iOS Safari](0002-glyph-rendering/ios-safari.png), [Android Chrome](0002-glyph-rendering/android.png), [macOS Chrome](0002-glyph-rendering/macos-chrome.png).

Observations:

- The problem is confirmed. Without a selector, all twelve signs render as emoji on all three platforms tested.
- U+FE0E worked for the signs on all three platforms, but the glyph shapes come from each platform's system font, so they differ between platforms.
- On Android, ♀ and ♂ rendered as coloured emoji when followed by U+FE0F. The planets are not immune to emoji presentation.
- The SVG set rendered the same on every platform, took the page's text colour, and stayed legible at 16px.
- The Moon and Capricorn, flagged for review in the glyph-set document, were legible at 16px in all three screenshots. This was judged from simulator screenshots, not real hardware.

## Limits

- Simulators and an emulator, not physical devices. Older Android versions, which are the likeliest to differ, were not covered.
- macOS was tested in headless Chrome only, not Safari.
- No symbol font (for example Noto Sans Symbols 2) was tested, so the ticket's "U+FE0E plus a self-hosted symbol font" option is not measured. It would also add a font file to the build, which the SVG set avoids.
- Windows is untested. Segoe UI Symbol is expected to supply the text glyphs, but whether it covers every planet and the node is unverified. This does not change the recommendation, because the SVG set does not use fonts.

## Licensing

The SVG set was drawn for the DataVirgo mockups, so it carries no third-party licence. If a refined set is commissioned later, its licence needs checking then. A symbol font was not adopted, so none was audited.

## Recommendation

Use the DataVirgo SVG set everywhere, as ADR-0001 already decides. The tests support that decision and do not contradict it, so no new ADR is needed.

- **Wheel:** inline SVG, as planned for [DAV-16](https://linear.app/alex-projects/issue/DAV-16).
- **Inline text:** use the same SVGs through a small `<Glyph>` component, sized in `em` and aligned to the baseline. Do not put Unicode astrology characters in page text, because they render as emoji by default and U+FE0E only fixes that where the platform font cooperates.
- **Accessibility:** give each meaningful glyph an accessible name, and hide it from assistive technology where a text label sits next to it.

## Follow-ups

- Run the test page on Windows (Chrome, Edge, Firefox) and fill in the last row.
- Decide whether to keep the hand-drawn paths or commission a refined set later.
