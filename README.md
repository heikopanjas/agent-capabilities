# agent-capabilities

A reference for **where CLI / agentic coding tools keep their configuration** —
instruction files, custom prompts, skills, and subagents — kept current by a
weekly automated re-research job.

**Browse it at [heikopanjas.github.io/agent-capabilities](https://heikopanjas.github.io/agent-capabilities/)**:
a filterable matrix, per-agent pages, a side-by-side compare view, and a
week-by-week changelog with an [Atom feed](https://heikopanjas.github.io/agent-capabilities/feed.xml).

## Contents

**[`coding-agent-config-locations.md`](coding-agent-config-locations.md)** is
the reference document. It covers Aider, Claude Code, Cline, Codex CLI,
Continue, Cursor, Devin, Gemini CLI, GitHub Copilot, Goose, Hermes Agent,
Kiro, Mistral Vibe, OpenCode, OpenHands, Pi, and Windsurf / Devin Desktop,
plus the cross-agent standards
(`AGENTS.md`, `SKILL.md`, `.agents/skills/`). Each path carries a confidence
marker:

| Marker | Meaning |
|--------|---------|
| ★ | **Spec / stable** — defined in a published spec or long-standing docs |
| ◆ | **Documented current** — in official docs but may shift across releases |
| ○ | **Observed** — community-verified or very recent; may be volatile |

## How the refresh works

[`.github/workflows/refresh-config-locations.yml`](.github/workflows/refresh-config-locations.yml)
runs weekly, every Thursday at 06:00 UTC (and on manual dispatch). It uses
[`claude-code-action`](https://github.com/anthropics/claude-code-action) with
web search to re-research each agent's published docs, updates
`coding-agent-config-locations.md` in place, and commits any changes to `main`.
The git history of that file is the changelog — each weekly commit shows exactly
what changed.

## Site

The site is generated from the Markdown document and never committed.
[`site/build.mjs`](site/build.mjs) parses `coding-agent-config-locations.md`
([`site/lib/parse.mjs`](site/lib/parse.mjs)), diffs every committed version of
it to build the changelog ([`site/lib/history.mjs`](site/lib/history.mjs)), and
renders static HTML into `_site/`. If the document's structure breaks (missing
confidence markers, malformed table rows, no "Last verified" line), the build
fails and the previously deployed site stays live.

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) deploys on pushes
to `main` and after every successful weekly refresh.

Preview locally (Node 22+):

```sh
npm ci
npm test
npm run build
npm run serve   # http://localhost:8000
```

## License

[MIT](LICENSE) © 2026 Heiko Panjas
