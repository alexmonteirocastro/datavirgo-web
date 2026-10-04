---
description: Plan, implement, validate one DAV ticket with approval gates. Never commits.
argument-hint: DAV-NNN
---

Ship ticket $ARGUMENTS from plan to PR text. You run in the main session because
subagents cannot start other subagents and the approval steps need me.

Never commit, push, open PRs, or read secrets. I do that.

## 1. Plan

Follow `.claude/commands/plan.md` for $ARGUMENTS, including its stops. Do not
continue until I explicitly approve the plan. If the plan is `Status: BLOCKED`,
stop.

Check the current branch matches the plan's branch name. If it does not, tell me
and stop: I create the branch.

## 2. Implement

Do the plan's tasks one at a time, in order. For each task:

1. Make only that task's changes. Anything outside the plan or the ticket's
   scope: stop and ask.
2. Run `pnpm lint` and `pnpm format`.
3. Show me what changed, the task's suggested commit message, and any
   failures. Then pause and wait for me. I commit.

If a task needs a new dependency, an ADR, or contradicts the plan, stop and
tell me instead of proceeding. `pnpm check` and `pnpm build` are no-ops until
DAV-11: never present them as evidence.

## 3. Validate

When all tasks are done, run the `implementation-validator` subagent with the
ticket text and the plan path (same input as `/review-pr`).

If the verdict is NOT READY, fix the Blocking, FAIL and missing-task items,
run `pnpm lint` and `pnpm format`, then re-validate. At most twice. If it is
still NOT READY after the second re-validation, stop and report what remains.

## 4. Stop with a summary

Show me:

- the validator's final output
- items only I can check (both themes, mobile width, mockup comparison)
- suggested PR title: `<type>(DAV-NNN): <imperative summary>`
- suggested PR body in the `.github/pull_request_template.md` format: Ticket,
  What and why, How to check, Screenshots (note: mine to add), Checklist, Notes,
  and the AI review summary. End the body with `Closes DAV-NNN`.

Then stop.
