# Contributing to DataVirgo Web

This is a solo project with an engineering process on purpose: small, traceable
changes that are easy to review and easy to hand to an AI assistant.

## Principles

- One Linear ticket (`DAV-NNN`) = one branch = one PR.
- Explore and plan before editing; keep PRs small.
- Decisions that outlive a ticket go in an ADR (`docs/adr/`).
- AI assistants write code in a branch. A human commits, pushes and merges.

## Branching

Format: `<type>/DAV-NNN-slug`

Types: `feat`, `fix`, `docs`, `test`, `ci`, `chore`, `refactor`, `spike`.

Examples: `feat/DAV-11-theme-switch`, `docs/DAV-9-design-tokens-adr`,
`chore/DAV-20-domain-setup`, `spike/DAV-3-golden-chart-fixtures`.

Branch from `main`. Delete the branch after merge.

The type follows the ticket's nature. An ADR ticket is always `docs/`, even if
the diff also touches a comment.

## Commit messages

`<type>(DAV-NNN): <imperative summary>`

    feat(DAV-11): add the dark/light switch

Same types as branches. A review fix on a feat branch may be `fix(DAV-NNN): …`.
Keep commits focused. Merge into `main` with a merge commit (history keeps the
branch), then delete the branch. Do not squash or rebase.

## Pull requests

- Title: the same form as the main commit, e.g. `feat(DAV-11): add the dark/light switch`.
- Body: what changed and why, how it was tested, and a link to the pitch or ADR if relevant. End with `Closes DAV-NNN`.
- One PR per ticket. If scope grows during review, file a new ticket instead of stretching the PR.
- Merge with a merge commit into `main`, then delete the branch.
- CI must pass before merging.

## Workflow

1. Pick a ticket from Linear (team DataVirgo, key `DAV`) and move it to In Progress.
2. Create the branch.
3. Explore first: ask the assistant to map the relevant code and ADRs, then agree a short plan. If the plan rests on a wrong assumption, start a fresh session with a corrected brief.
4. Implement in small steps. Run `pnpm check` and `pnpm lint` before finishing.
5. Run `/review-pr` on the branch and fix Blocking and Should fix items.
6. Open the PR using the template. Link the ticket.
7. Read the diff yourself. The AI review is a first pass, not an approval.
8. Merge with a merge commit, delete the branch, then move the ticket to Done.

## ADRs

Write an ADR when a change introduces a dependency, changes hosting or data flow,
or contradicts an earlier decision. Files: `docs/adr/NNNN-title.md`, numbered per
repo. Use Context, Decision, Consequences, Status. The template also has
Alternatives. To reverse a decision, add a new ADR that supersedes the old one;
do not edit history.

## Rules for AI assistants

- `CLAUDE.md` (also read as `AGENTS.md`) holds the project rules. Keep it lean.
- Every recurring mistake becomes one bullet under "Lessons learned" in `CLAUDE.md`
  or the relevant `.claude/pr-rules/*.md` file. A human decides what gets added.
- Assistants must not commit, push, open or merge PRs, or read secrets.
  `.claude/settings.json` enforces this for Claude Code. Cursor reads `CLAUDE.md`
  natively, and branch naming lives in `.cursor/rules/branch-naming.mdc`.

## Code quality

Prettier (with `prettier-plugin-astro`), ESLint, and Husky are installed. The
pre-commit hook runs both on staged files.

- `pnpm lint` — ESLint
- `pnpm format` — write Prettier formatting
- `pnpm format:check` — fail if formatting is off (CI always runs this)
- `pnpm check` and `pnpm build` — no-ops until the Astro app lands in DAV-11

## Quality bar

- Both themes (dark and light) and mobile width checked for visual changes.
- Accessibility basics: semantic structure, alt text, focus states, contrast.
- No hard-coded colours, fonts or spacing; use tokens.
- No user-facing literals outside the i18n layer.
- No new dependency or third-party script without a reason in the PR.
