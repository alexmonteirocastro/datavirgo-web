---
description: Plan one DAV ticket. Research, write docs/plans/DAV-NNN-<slug>.md, stop for approval.
argument-hint: DAV-NNN
---

Plan ticket $ARGUMENTS. Do not edit code. Do not create branches. Never commit.

## 1. Fetch the ticket

Fetch the ticket from Linear (team DataVirgo, key `DAV`) with the Linear MCP.
Keep the key, title, description and acceptance criteria. If the MCP is
unavailable or the ticket is not found, ask me to paste the ticket and stop
until I do. Subagents cannot reach the MCP, so you pass the ticket text to them.

If `$ARGUMENTS` is not of the form `DAV-NNN`, ask for the ticket key and stop.

## 2. Research

Run the `codebase-researcher` subagent with the ticket text. Show me its
"Unknowns / questions" section. If any unknown is marked BLOCKING, stop here and
wait for my answers. Do not run the spec-writer.

## 3. Write the plan

Otherwise run the `spec-writer` subagent with the ticket text and the full
research report. If a plan for this ticket already exists in `docs/plans/`, tell
the subagent to update that file rather than create a second one.

Then run `pnpm format` so the plan passes CI's Prettier check.

## 4. Stop for approval

Show me:

- the plan path and a short summary (goal, tasks, verification, ADR needed)
- the suggested branch name
- open questions, and whether the plan is `Status: BLOCKED`

Then stop and wait for my approval or edits. I create the branch and commit.
