---
description: Review the current branch before it is opened as a PR. Checks it against the plan when one exists.
---

<!-- Cursor keeps a full inline copy in .cursor/commands/review-pr.md. Keep the output format identical. -->

Review the current branch with the `implementation-validator` subagent. The
subagent does the review; you gather its input and relay its output.

## 1. Gather input

Read the ticket key from the branch name (`<type>/DAV-NNN-slug`). Fetch the
ticket from Linear with the Linear MCP if available (subagents cannot reach the
MCP, so pass the text on). If it is unavailable, say so and continue.

Look for a plan: `docs/plans/<ticket key>-*.md`. If one exists, pass its path.
If none exists, pass no plan path.

## 2. Delegate

Run `implementation-validator` with the ticket text (if any) and the plan path
(if any).

## 3. Output

Print the subagent's output unchanged, in its format: Summary, Blocking, Should
fix, Nice to have, Verified. With a plan, it also includes the "Plan
conformance" table and the final `Verdict: READY | NOT READY` line. Without a
plan, behave as before: no table, no verdict line. The output must paste into
the PR template's "AI review summary".

Read-only. Do not edit files, commit, push or comment on PRs. If the subagent
suggests a "Lessons learned" bullet, pass it on; do not edit the rules file.
