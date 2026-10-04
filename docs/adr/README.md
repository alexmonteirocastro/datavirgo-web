# ADRs

Website decisions live here. The engine and the chart API keep their own ADRs in `datavirgo-app`. Each repo numbers from 0001.

Write a new ADR from [0000-template.md](0000-template.md). To reverse a decision, add a new ADR that supersedes the old one.

## This repo

| ADR                               | Subject           | Status                                                            |
| --------------------------------- | ----------------- | ----------------------------------------------------------------- |
| [0001](0001-design-tokens.md)     | Design tokens     | Accepted, [DAV-9](https://linear.app/alex-projects/issue/DAV-9)   |
| [0002](0002-site-architecture.md) | Site architecture | Proposed, [DAV-10](https://linear.app/alex-projects/issue/DAV-10) |

## App repo (the site depends on these)

These files are not in `datavirgo-app` yet. The tickets are the source until they land.

| ADR  | Subject                                          | Ticket                                                |
| ---- | ------------------------------------------------ | ----------------------------------------------------- |
| 0001 | Chart engine and licensing                       | [DAV-1](https://linear.app/alex-projects/issue/DAV-1) |
| 0002 | Hosting: API on Render, site on Cloudflare Pages | [DAV-2](https://linear.app/alex-projects/issue/DAV-2) |
