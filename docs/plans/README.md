# Plans

A plan is the agreed approach for one Linear ticket, written by `/plan DAV-NNN`
before any code is edited. It lists the goal, acceptance criteria, ordered tasks
(one commit each), verification and any ADR needed. Files are named
`DAV-NNN-<slug>.md`, where the slug is the branch slug, and are committed on the
ticket's branch as its first commit. `/review-pr` checks the branch against the
plan. A plan never overrides `CLAUDE.md` or an ADR.
