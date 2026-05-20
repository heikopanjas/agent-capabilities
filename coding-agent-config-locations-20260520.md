# Coding Agent Configuration Locations

Instruction files, custom prompts, skills & subagents for CLI / agentic coding tools — research snapshot 2026-05-20

Skills follow the [agentskills.io](https://agentskills.io/specification) open standard (v1.0).
`.agents/` is the cross-agent convention path.

> **Automated snapshot.** This file is a dated, machine-refreshed copy of
> `coding-agent-config-locations.md`. It is regenerated daily by the
> `.github/workflows/refresh-config-locations.yml` GitHub Action, which
> re-researches each agent's published docs and writes a new
> `coding-agent-config-locations-YYYYMMDD.md`.

### Confidence markers

| Marker | Meaning |
|--------|---------|
| ★ | **Spec / stable** — defined in a published spec or long-standing official docs |
| ◆ | **Documented current** — in official docs but may shift across releases |
| ○ | **Observed** — community-verified, reverse-engineered, or very recent; may be volatile |

### What changed since 2026-05-14

- **Claude Code** — slash commands and skills have converged: `.claude/commands/<name>.md` and `.claude/skills/<name>/SKILL.md` both surface as `/<name>`. Existing `commands/` files keep working. Skills (only) are also auto-loaded from `--add-dir` directories.
- **Codex CLI** — per-skill toggling is done with `[[skills.config]]` blocks in `config.toml` (`path` + `enabled`); global subagent settings live under `[agents]`, with `agents.max_depth` defaulting to `1`.
- **GitHub Copilot** — the `gh skill` CLI (discover/install/update/publish) requires GitHub CLI ≥ 2.90.0 and is in public preview. Org- and enterprise-level skills are announced but not yet shipped.
- **Cursor** — rules are **not** deprecated (a persistent rumor); the `/migrate-to-skills` command only converts *dynamic* rules and slash commands. Built-in subagents are `explore`, `bash`, `browser`. Plugins now bundle skills/subagents/MCP/hooks/rules and install from the Cursor Marketplace.
- **OpenCode** — external skill discovery is gated by `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` and `OPENCODE_DISABLE_EXTERNAL_SKILLS`; agents need the `skill` permission to see or use skills.
- **Agent Skills spec** — released by Anthropic as an open standard on 2025-12-18; the canonical spec moved from the `anthropics/skills` repo to [agentskills.io/specification](https://agentskills.io/specification). Recommended limits: SKILL.md body < 5,000 tokens, skill directory < 500 lines.

---

## Claude Code — Anthropic

Home: `~/.claude/`

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | `~/.claude/CLAUDE.md` — personal defaults, all projects | `<repo>/CLAUDE.md`, `<repo>/CLAUDE.local.md` — walks cwd up to `/`; also reads `AGENTS.md`. Subdirectory `CLAUDE.md` files append context |
| **Instructions** ○ | | System: `/etc/claude-code/CLAUDE.md` — installation-dependent; observed via strace, not in public docs |
| **Rules** ★ | `~/.claude/rules/*.md` | `.claude/rules/*.md` — path-scoped via YAML frontmatter `paths:` |
| **Settings** ★ | `~/.claude/settings.json` | `.claude/settings.json`, `.claude/settings.local.json` (gitignored, highest priority) |
| **Skills** ★ | `~/.claude/skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` — progressive disclosure per agentskills.io. Also loaded from `--add-dir` directories ⁴ |
| **Subagents** ★ | `~/.claude/agents/*.md` | `.claude/agents/*.md` — Markdown + YAML frontmatter; set `tools:` explicitly or it inherits all |
| **Commands** ★ | `~/.claude/commands/*.md` → `/<name>` | `.claude/commands/*.md` → `/<name>` — commands and skills converged: a skill `deploy` and a command `deploy.md` both create `/deploy` ⁴ |
| **MCP** ★ | | `<repo>/.mcp.json` |

**Sources:**
[`.claude` directory explorer](https://code.claude.com/docs/en/claude-directory) ·
[Memory & instructions](https://code.claude.com/docs/en/memory) ·
[Skills](https://code.claude.com/docs/en/skills) ·
[Sub-agents](https://code.claude.com/docs/en/sub-agents) ·
[Settings](https://code.claude.com/docs/en/settings) ·
`/etc/claude-code/` path: [anthropics/claude-code#2274](https://github.com/anthropics/claude-code/issues/2274)

---

## Codex CLI — OpenAI

Home: `~/.codex/` (`$CODEX_HOME`)

> **Volatility note:** Codex CLI is under active Rust rewrite. Config surface changes frequently across releases. Paths below are from official OpenAI developer docs but should be re-verified after major updates.

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ◆ | `~/.codex/AGENTS.override.md`, `~/.codex/AGENTS.md` — override wins; first non-empty used | `<repo>/AGENTS.override.md`, `<repo>/AGENTS.md` — walks root→cwd; 1 file/dir; 32 KiB default cap (`project_doc_max_bytes`). Fallbacks via `project_doc_fallback_filenames` |
| **Config** ◆ | `~/.codex/config.toml` | `.codex/config.toml` — walks root→cwd; closest wins (trusted projects only). Machine-local keys (auth, provider, profile, otel…) can't be project-overridden |
| **Skills** ◆ | `~/.codex/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` | `.codex/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — walks cwd→root; `/skills` or `$` to invoke. Admin: `/etc/codex/skills/`; System: bundled. Toggle via `[[skills.config]]` (`path`, `enabled`) in config.toml |
| **Subagents** ◆ | `~/.codex/agents/*.toml` | `.codex/agents/*.toml` — one agent per file; `name` field is source of truth. Global settings under `[agents]` (`agents.max_depth` default `1`) |
| **Rules / Hooks** ◆ | `~/.codex/rules/`, `~/.codex/hooks.json` | `.codex/rules/`, `.codex/hooks.json` |
| **MCP** ◆ | `[mcp_servers]` in config.toml | `[mcp_servers]` in `.codex/config.toml` |

**Sources:**
[AGENTS.md discovery](https://developers.openai.com/codex/guides/agents-md) ·
[Skills](https://developers.openai.com/codex/skills) ·
[Subagents](https://developers.openai.com/codex/subagents) ·
[Config basics](https://developers.openai.com/codex/config-basic) ·
[Config reference](https://developers.openai.com/codex/config-reference) ·
[Advanced config](https://developers.openai.com/codex/config-advanced) ·
[CLI reference](https://developers.openai.com/codex/cli/reference)

---

## GitHub Copilot — GitHub / Microsoft

Home: `~/.copilot/` · `~/.github/`

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | `$HOME/.copilot/copilot-instructions.md` (CLI). VS Code: user `*.instructions.md`. `$COPILOT_CUSTOM_INSTRUCTIONS_DIRS` | `.github/copilot-instructions.md` — repository-wide. Also reads `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` at root |
| **Path-specific** ★ | — | `.github/instructions/*.instructions.md` — YAML frontmatter `applyTo:` glob |
| **Prompt files** ★ | — | `.github/prompts/*.prompt.md` — invoke via `#prompt:` or `/` |
| **Custom agents** ◆ | `~/.github/agents/*.agent.md` — user-level agents (VS 2026 ≥ 18.4 / VS Code) | `.github/agents/*.agent.md` — YAML: name, description, tools, model, mcp-servers, handoffs. Org: `.github-private` repo `agents/` dir |
| **Skills** ★ | `~/.copilot/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` | `.github/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — all three discovered ¹; `gh skill` CLI (requires GitHub CLI ≥ 2.90.0, public preview). Org/enterprise skills announced, not yet shipped |
| **MCP** ◆ | — | `.github/copilot/mcp.json` |

**Sources:**
[Custom instructions (CLI)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) ·
[Custom instructions (VS Code)](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) ·
[About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) ·
[Adding skills (cloud)](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills) ·
[Adding skills (CLI)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-skills) ·
[Custom agents (VS Code)](https://code.visualstudio.com/docs/copilot/customization/custom-agents) ·
[Agent skills (VS Code)](https://code.visualstudio.com/docs/copilot/customization/agent-skills) ·
[Custom agents (Visual Studio)](https://learn.microsoft.com/en-us/visualstudio/ide/copilot-specialized-agents)

---

## Cursor — Anysphere

Home: `.cursor/` (project-centric)

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | User Rules (Settings → Rules) — plain text; always applied | `<repo>/AGENTS.md` — root level and subdirectories; plain markdown alternative to `.cursor/rules`. Legacy: `.cursorrules` (deprecated, still read) |
| **Rules** ★ | — | `.cursor/rules/*.md` — YAML frontmatter: `alwaysApply`, `description`, `globs`. 4 types: project, user, team, AGENTS.md. **Not deprecated**; `/migrate-to-skills` converts only dynamic rules + slash commands. Legacy `.mdc` still supported |
| **Commands** ◆ | — | `.cursor/commands/*.md` — invoke via `/` in agent input |
| **Skills** ◆ | `~/.claude/skills/*/SKILL.md` — Claude plugins imported as agent-decided rules ² | `.cursor/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — agentskills.io; loaded on demand; invocable via `/` |
| **Subagents** ◆ | — | Parallel subagents (v2.4+); each gets own context window. Built-in: `explore`, `bash`, `browser`. Custom: markdown + frontmatter (`name`, `description`, `model`, `readonly`, `is_background`) |
| **Plugins** ◆ | — | Bundle skills + subagents + MCP servers + hooks + rules into one install; discovered via the Cursor Marketplace |
| **Hooks** ◆ | — | `.cursor/hooks/` — compatible with Claude Code hooks format |
| **MCP** ◆ | — | `.cursor/*.json` — MCP defs; agents discover/load on demand |
| **Team Rules** ◆ | Import from GitHub repos (auto-synced). Precedence: Team → Project → User | *(same)* |

**Sources:**
[Cursor docs home](https://cursor.com/docs) ·
[Best practices (rules + skills)](https://cursor.com/blog/agent-best-practices) ·
[Changelog 2.4 (subagents, skills)](https://cursor.com/changelog/2-4) ·
[Cursor changelog](https://cursor.com/changelog) ·
[awesome-cursor-rules reference](https://github.com/sanjeed5/awesome-cursor-rules-mdc/blob/main/cursor-rules-reference.md)

---

## Mistral Vibe — Mistral AI

Home: `~/.vibe/` (`$VIBE_HOME`)

> **Note:** Vibe is younger than the other agents listed here. Docs are thinner and the config surface is still stabilizing. Treat specifics as current observed behavior.

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ◆ | — | `<repo>/AGENTS.md` — workspace root only (no recursive walk); some features require it at root |
| **Config** ◆ | `~/.vibe/config.toml` | `.vibe/config.toml` — project-local checked first, then global |
| **System prompts** ◆ | `~/.vibe/prompts/*.md` — set `system_prompt_id` in config.toml | — |
| **Skills** ◆ | `~/.vibe/skills/*/SKILL.md` — agentskills.io; invoke via `/`. Toggle with `enabled_skills` / `disabled_skills` | `.vibe/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** (trusted folders only) |
| **Agents** ◆ | `~/.vibe/agents/*.toml` — `display_name`, `description`, `safety`, `enabled_tools`, `agent_type`, `active_model`, `system_prompt_id` | `.vibe/agents/*.toml` — subagents: `agent_type = "subagent"` |
| **Trust** ◆ | `~/.vibe/trusted_folders.toml` — controls which dirs may run config/skills | — |
| **API keys** ◆ | `~/.vibe/.env` | — |

**Sources:**
[Agents & Skills](https://docs.mistral.ai/mistral-vibe/agents-skills) ·
[Configuration](https://docs.mistral.ai/mistral-vibe/terminal/configuration) ·
[CLI introduction](https://docs.mistral.ai/mistral-vibe/introduction) ·
[GitHub: mistralai/mistral-vibe](https://github.com/mistralai/mistral-vibe) ·
[PyPI: mistral-vibe](https://pypi.org/project/mistral-vibe/)

---

## OpenCode — SST (open source)

Home: `~/.config/opencode/`

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | `~/.config/opencode/AGENTS.md` — personal rules, all sessions. Compat fallback: `~/.claude/CLAUDE.md` ³ | `<repo>/AGENTS.md` — first match wins (AGENTS.md > CLAUDE.md). Extra via `opencode.json` `instructions: […]`; supports remote URLs + globs |
| **Config** ★ | `~/.config/opencode/opencode.json` | `<repo>/opencode.json` |
| **Commands** ★ | `~/.config/opencode/commands/*.md` — invoke via `/` in the TUI | `.opencode/commands/*.md` — filename becomes command name |
| **Skills** ★ | `~/.config/opencode/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` | `.opencode/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — walks cwd→git root. Agents need the `skill` permission; external discovery gated by `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` / `OPENCODE_DISABLE_EXTERNAL_SKILLS` |
| **Agents** ★ | `~/.config/opencode/agents/*.md` — YAML: description, model, temperature, tools, mode | `.opencode/agents/*.md` — primary (Tab) or subagent (@ invoke) |

**Sources:**
[Rules (AGENTS.md)](https://opencode.ai/docs/rules/) ·
[Agent Skills](https://opencode.ai/docs/skills/) ·
[Agents](https://opencode.ai/docs/agents/) ·
[Getting started](https://opencode.ai/docs/)

---

## Notes

¹ VS 2026, VS Code, and Copilot CLI all discover `.github/skills/`, `.claude/skills/`, and `.agents/skills/`.

² Cursor imports Claude skills/plugins as agent-decided rules; toggleable but not always-apply. See [awesome-cursor-rules reference](https://github.com/sanjeed5/awesome-cursor-rules-mdc/blob/main/cursor-rules-reference.md).

³ OpenCode Claude compat (AGENTS.md/CLAUDE.md fallback) disabled via `OPENCODE_DISABLE_CLAUDE_COMPAT=1`. See [OpenCode rules docs](https://opencode.ai/docs/rules/).

⁴ In Claude Code, slash commands and skills have converged — a skill `deploy` and a command file `deploy.md` both produce `/deploy`. `--add-dir` grants file access, not config discovery, **except** that `.claude/skills/` inside an added directory is loaded automatically. Subagents, commands, and output styles are not loaded from added directories.

### Cross-agent standards

- **`.agents/skills/`** — The cross-agent convention from the [agentskills.io client implementation guide](https://agentskills.io/client-implementation/adding-skills-support). Scanned by Codex, Copilot, OpenCode, Gemini CLI, and Cursor. Symlink-friendly for a single canonical skill tree.

- **`AGENTS.md`** — Open standard ([agents.md](https://agents.md)). Fully or partially supported by a growing number of coding agents including Codex, Copilot, Cursor, OpenCode, Vibe, Zed, Warp, Jules, Factory, and Devin. Depth of support varies (native first-class to fallback-if-present).

- **`SKILL.md`** — [Agent Skills spec v1.0](https://agentskills.io/specification). Released by Anthropic as an open standard on 2025-12-18; the canonical spec moved from `anthropics/skills` to [github.com/agentskills/agentskills](https://github.com/agentskills/agentskills). Structure: `skill-name/{SKILL.md, scripts/, references/, assets/}`. Required frontmatter fields: `name` (1–64 chars, lowercase + hyphens, matching folder) and `description`. Recommended: SKILL.md body < 5,000 tokens, directory < 500 lines. Adopted across 20+ tools.

- **Subagent format split:** Claude Code, Copilot, OpenCode, and Cursor define agents as Markdown + YAML frontmatter. Codex and Vibe use TOML.

All paths use Unix notation; `~` = `%USERPROFILE%` on Windows. `$CODEX_HOME`, `$VIBE_HOME` override their respective defaults.

### slopctl agent defaults

slopctl keeps the agent filesystem conventions from this document in `agent-defaults.yml`, stored next to `templates.yml` in the global template cache. Use `slopctl agents --update` to refresh agent prompt, skill, marker, and cross-client-skill defaults independently from templates. `slopctl templates --update` bootstraps this file only when it is missing. Agent markers are workspace-relative directories that `slopctl init --agent` can safely create for detection; slopctl does not create agent config files such as `opencode.json`.

---

*Research snapshot: 2026-05-20 — generated from `coding-agent-config-locations.md` (last manually verified 2026-05-14).*
