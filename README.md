# agent-capabilities

A reference for where CLI and agentic coding tools keep their configuration: instruction files, custom prompts, skills and subagents. A weekly job re-checks it against each vendor's docs.

The site is at [heikopanjas.github.io/agent-capabilities](https://heikopanjas.github.io/agent-capabilities/). It has a filterable matrix, a page for each agent, a compare view for up to four agents, and a weekly changelog with an [Atom feed](https://heikopanjas.github.io/agent-capabilities/feed.xml).

## Contents

[`coding-agent-config-locations.md`](coding-agent-config-locations.md) is the reference document. It covers Aider, Claude Code, Cline, Codex CLI, Continue, Cursor, Devin, Gemini CLI, GitHub Copilot, Goose, Hermes Agent, Kiro, Mistral Vibe, OpenCode, OpenHands, Pi, and Windsurf / Devin Desktop. It also covers the standards several agents share (`AGENTS.md`, `SKILL.md`, `.agents/skills/`).

Each agent has a table with one row per feature. The Project (repo) column comes first and the Global (user) column second. Every row has a confidence marker:

| Marker | Meaning |
|--------|---------|
| ★ | Spec or stable. Defined in a published spec or long-standing docs. |
| ◆ | Documented. In the official docs, but may change between releases. |
| ○ | Observed. Verified by the community or very recent, and may change. |

The document records current state only: paths, file formats, precedence rules, env vars and config flags. Release notes and version history stay out of it. The git history is the changelog.

## How the refresh works

[`.github/workflows/refresh-config-locations.yml`](.github/workflows/refresh-config-locations.yml) runs every Thursday at 06:00 UTC, and you can also start it by hand. It uses [`claude-code-action`](https://github.com/anthropics/claude-code-action) with web search to check each agent's published docs, edits `coding-agent-config-locations.md` in place, and commits any changes to `main`. Each weekly commit shows what changed.

A run fails if Claude errors out, or if it finishes without updating the "Last verified" date. The full Claude transcript is kept for 14 days as the `claude-transcripts-*` artifact on each run.

## Site

The site is generated from the Markdown document and is never committed. [`site/build.mjs`](site/build.mjs) does three things:

1. Parses `coding-agent-config-locations.md` with [`site/lib/parse.mjs`](site/lib/parse.mjs).
2. Diffs every committed version of the document with [`site/lib/history.mjs`](site/lib/history.mjs) to build the changelog.
3. Writes static HTML into `_site/`.

The build fails if the document's structure breaks, for example a missing confidence marker, a malformed table row or no "Last verified" line. The previously deployed site stays up when that happens.

[`.github/workflows/pages.yml`](.github/workflows/pages.yml) deploys on every push to `main` and after each successful weekly refresh.

To preview locally you need Node 22 or later:

```sh
npm ci
npm test
npm run build
npm run serve   # http://localhost:8000
```

## License

[MIT](LICENSE) © 2026 Heiko Panjas
