# DAV-26: Docs: mark the flat logo redraw as approved (ADR-0001, brand README)

## Ticket

[DAV-26](https://linear.app/alex-projects/issue/DAV-26/docs-mark-the-flat-logo-redraw-as-approved-adr-0001-brand-readme) · Branch: `docs/DAV-26-mark-logo-redraw-approved`

## Goal

The flat logo redraw was approved as-is when DAV-7 was signed off (2026-10-04). Two docs still call the marks drafts. Remove that wording so the docs match the decision.

## Out of scope

- Any change to `mark-compact.svg`, `mark-compact-16.svg` or `mark-full.svg`.
- Any token change, including `src/styles/tokens.css`.
- The status of `mark-full.svg`, which stays "Direction only, not final artwork".
- Rewriting the rest of the "Brand marks" section of ADR-0001, including the hex-fallback explanation.
- Adding the approval date or a DAV-7 reference to either file (not asked for by the ticket).

## Acceptance criteria

- [ ] `docs/adr/0001-design-tokens.md`, "Brand marks" section: the sentence "The marks are **drafts** until the logo redraw is signed off" is removed.
- [ ] `src/assets/brand/README.md`: the status of `mark-compact.svg` and `mark-compact-16.svg` changes from "Draft, pending the logo-redraw sign-off" to approved.
- [ ] No token or SVG changes (from the ticket's "Docs only" line).

## Design

Two text edits, nothing else.

1. ADR-0001, "Brand marks" section (currently line 98). The last sentence reads: "The marks are **drafts** until the logo redraw is signed off; swapping the files does not change any token." Drop the draft clause and keep the second half as its own sentence: "Swapping the files does not change any token." Keeping it is the settled decision and the research report agrees. It stays true and tells the reader the marks can be replaced without touching tokens. Everything before that sentence is left as it is.
2. `src/assets/brand/README.md`, status table (lines 7 and 8). Set the Status cell of `mark-compact.svg` and `mark-compact-16.svg` to "Approved". The `mark-full.svg` row is left as it is.

Prettier pads markdown table columns to the widest cell. The new "Approved" cells are shorter than the `mark-full.svg` status ("Direction only, not final artwork"), so the Status column will narrow and the padding in every row will change. Run `pnpm format` on that file and keep the result. This is formatting only, not a content change.

An accepted ADR is edited in place here. CONTRIBUTING says a reversed decision needs a superseding ADR, but nothing is reversed: only a status note about the files is removed. This is unverified against Alexandre's intent, so it is listed under Open questions.

## Tasks

1. Remove the "drafts until the logo redraw is signed off" clause from the "Brand marks" section of `docs/adr/0001-design-tokens.md`, keeping "Swapping the files does not change any token." Commit: `docs(DAV-26): drop draft wording from adr-0001 brand marks`
2. Change the status of `mark-compact.svg` and `mark-compact-16.svg` to "Approved" in `src/assets/brand/README.md`, then run `pnpm format` so the table stays Prettier-clean. Commit: `docs(DAV-26): mark compact brand marks as approved in readme`

## Verification

- Commands: `pnpm format:check` (CI always runs it).
- CI runs the markdown link check. Both edits remove or replace text and add no links, so no new link can break.
- Search for leftovers with `rg -i "draft|sign-off" docs src/assets/brand`. It should find nothing relevant. Unrelated hits such as `ajv-draft-04` in `pnpm-lock.yaml` are not in scope.
- `git diff --stat` shows exactly two files, `docs/adr/0001-design-tokens.md` and `src/assets/brand/README.md`, and no `.svg` or `tokens.css`.
- `pnpm lint`, `pnpm check` and `pnpm build`: CI skips them for docs-only diffs. They are no-ops until DAV-11, not evidence.
- Manual: not visual work, so no theme, mobile or mockup comparison is needed. Alexandre reads the two diffs to confirm the wording.

## Applicable rules

- `.claude/pr-rules/common.md`: scope is one ticket and one purpose, with the branch name and PR reference to the ticket. The "Lessons learned" bullets target findings docs and ADR script lists, so they add no constraint here.
- `CONTRIBUTING.md`: Branching (docs ticket, `docs/` type), Commit messages, Pull requests (`Closes DAV-26`).
- `.cursor/rules/branch-naming.mdc`: branch and commit format.
- `CLAUDE.md`: docs only, no commits or branches by the assistant, no token or SVG edits.

## ADR needed

None. This amends the status wording of the existing ADR-0001 and introduces no new decision.

## Open questions

- Is "Approved" the wording Alexandre wants in the brand README status cells? Non-blocking. The ticket says "approved" without exact text.
- Is editing the accepted ADR-0001 in place fine for this wording-only change? Non-blocking. Nothing is reversed, so a superseding ADR does not seem needed (unverified).
- `mark-full.svg` is also described as "flat redraw" in ADR-0001 but its README status stays "Direction only, not final artwork". The ticket lists only the two compact marks, so it stays untouched. Confirm this is intended. Non-blocking.
