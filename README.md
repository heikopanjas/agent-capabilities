# agent-capabilities

A reference for **where CLI / agentic coding tools keep their configuration** —
instruction files, custom prompts, skills, and subagents — kept current by a
daily automated re-research job.

## Contents

**[`coding-agent-config-locations.md`](coding-agent-config-locations.md)** is
the reference document. It covers Claude Code, Codex CLI, GitHub Copilot,
Cursor, Mistral Vibe, OpenCode, and Pi, plus the cross-agent standards
(`AGENTS.md`, `SKILL.md`, `.agents/skills/`). Each path carries a confidence
marker:

| Marker | Meaning |
|--------|---------|
| ★ | **Spec / stable** — defined in a published spec or long-standing docs |
| ◆ | **Documented current** — in official docs but may shift across releases |
| ○ | **Observed** — community-verified or very recent; may be volatile |

## How the refresh works

[`.github/workflows/refresh-config-locations.yml`](.github/workflows/refresh-config-locations.yml)
runs daily at 06:00 UTC (and on manual dispatch). It uses
[`claude-code-action`](https://github.com/anthropics/claude-code-action) with
web search to re-research each agent's published docs, updates
`coding-agent-config-locations.md` in place, and commits any changes to `main`.
The git history of that file is the changelog — each daily commit shows exactly
what changed.

## License

[MIT](LICENSE) © 2026 Heiko Panjas
