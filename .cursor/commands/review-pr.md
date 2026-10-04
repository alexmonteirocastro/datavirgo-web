<!-- Claude's copy (.claude/commands/review-pr.md) delegates to the implementation-validator agent. Keep the output format identical. -->

# Review PR

Review the current branch before it is opened as a PR. Be direct. Cite
`file:line`. Report real issues only; do not manufacture concerns.

## 1. Scope the diff

    git fetch origin main
    git log --no-merges origin/main..HEAD --oneline
    git diff origin/main...HEAD --stat
    git diff origin/main...HEAD

Use three dots so the diff is against the merge base. Read the ticket key from
the branch name (`<type>/DAV-NNN-slug`) and fetch the Linear ticket if the
Linear MCP is available. Every change should trace to the ticket's stated
scope and acceptance criteria. Flag anything that does not.

If `docs/plans/<ticket>-*.md` exists, also check the branch against its
acceptance criteria and tasks. Mark each criterion PASS, FAIL or UNVERIFIED with
`file:line` evidence, and flag scope creep against its "Out of scope".

## 2. Load rules

Always read `CLAUDE.md` and `.claude/pr-rules/common.md`.
If the diff touches `src/styles/**`, tokens or themes, also read
`.claude/pr-rules/design.md` and `docs/adr/0001-design-tokens.md`.
If it touches `docs/adr/**` or architecture, read the relevant ADRs.
Apply every bullet under "Lessons learned" in each file as a check.

## 3. Output (exactly this format)

    ## Summary
    <one paragraph: what the branch does, and whether it matches the ticket>

    ## Blocking
    - [file:line] issue, why it blocks

    ## Should fix
    - [file:line] issue

    ## Nice to have
    - issue

    ## Verified
    - what was checked and looks good

If nothing blocks, say so.

## 4. Rules

- Read-only. Do not edit files, commit, push or comment on PRs.
- If you find a recurring issue worth remembering, suggest one bullet for the
  relevant "Lessons learned" section. Do not edit the rules file yourself.
