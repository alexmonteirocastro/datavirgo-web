# Common PR rules

Check every PR against these.

- Scope: one ticket, one purpose, no unrelated refactors or files.
- Branch name matches `<type>/DAV-NNN-slug`; PR description references the ticket.
- No hard-coded colours, font names or spacing; tokens only.
- No user-facing string literals outside the i18n layer.
- Chart tool is not reachable unless `features.chartTool` is on.
- No new dependency, tracker or third-party script without a stated reason.
- No secrets, `.env*` files or build output committed.
- No invented copy: bio, prices, credentials or testimonials.
- Accessibility: semantic headings, alt text, visible focus, contrast in both themes.
- Both themes (dark/light) and mobile width checked for visual changes.
- Contradicting an ADR requires a new or superseding ADR in the same PR.
- ADR-worthy decisions (new dependency, hosting, data flow) have an ADR.

## Lessons learned

<!-- One imperative bullet per recurring mistake. -->

- In findings docs, state only what the evidence shows. Mark inferences as unverified, and link follow-up tickets created after the doc was written.
- In ADRs, list every client-side or third-party script the decision implies (widgets, beacons) and say where each loads. Don't leave them implicit under a "zero JS" claim.
- Mark deliberate exceptions to token rules (standalone fixtures, test pages) with a comment that says why, so a rule-based review does not flag them.
