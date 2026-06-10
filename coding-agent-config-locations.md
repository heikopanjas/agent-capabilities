# Coding Agent Configuration Locations

Instruction files, custom prompts, skills & subagents for CLI / agentic coding tools — June 2026

Skills follow the [agentskills.io](https://agentskills.io/specification) open standard.
`.agents/` is the cross-agent convention path.

### Confidence markers

| Marker | Meaning |
|--------|---------|
| ★ | **Spec / stable** — defined in a published spec or long-standing official docs |
| ◆ | **Documented current** — in official docs but may shift across releases |
| ○ | **Observed** — community-verified, reverse-engineered, or very recent; may be volatile |

---

## Claude Code — Anthropic

Home: `~/.claude/`

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | `~/.claude/CLAUDE.md` — personal defaults, all projects | `<repo>/CLAUDE.md` or `<repo>/.claude/CLAUDE.md`, `<repo>/CLAUDE.local.md` — walks cwd up to `/`. Does **not** natively read `AGENTS.md`; use `@AGENTS.md` import inside `CLAUDE.md` to share with other agents. Subdirectory `CLAUDE.md` files load lazily |
| **Instructions** ◆ | Managed: `/etc/claude-code/CLAUDE.md` (Linux/WSL) · `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) · `C:\Program Files\ClaudeCode\CLAUDE.md` (Windows) | — |
| **Rules** ★ | `~/.claude/rules/*.md` | `.claude/rules/*.md` — path-scoped via YAML frontmatter `paths:`; discovered recursively |
| **Settings** ★ | `~/.claude/settings.json`; Managed: `/etc/claude-code/managed-settings.json` + `managed-settings.d/*.json` (Linux/WSL) · `/Library/Application Support/ClaudeCode/managed-settings.json` + `managed-settings.d/` + MDM plist `com.anthropic.claudecode` (macOS) · `C:\Program Files\ClaudeCode\managed-settings.json` + `managed-settings.d\` + `HKLM\SOFTWARE\Policies\ClaudeCode` + `HKCU\SOFTWARE\Policies\ClaudeCode` (Windows; `C:\ProgramData\ClaudeCode\` deprecated since v2.1.75) | `.claude/settings.json`, `.claude/settings.local.json` (gitignored). Precedence: Managed > CLI args > Local > Project > User |
| **Skills** ★ | `~/.claude/skills/*/SKILL.md` | `.claude/skills/*/SKILL.md` — progressive disclosure per agentskills.io |
| **Subagents** ★ | `~/.claude/agents/*.md` | `.claude/agents/*.md` — Markdown + YAML frontmatter; subdirectory discovery supported |
| **Agent memory** ◆ | `~/.claude/agent-memory/<agent-name>/` — subagent user-scoped (`memory: user`). Main-session auto-memory: `~/.claude/projects/<project>/memory/MEMORY.md` (v2.1.59+; `autoMemoryDirectory` setting overrides) | `.claude/agent-memory/<agent-name>/` (`memory: project`, committable), `.claude/agent-memory-local/<agent-name>/` (`memory: local`, gitignored) |
| **Commands** ★ | `~/.claude/commands/*.md` → `/<name>` (superseded by skills, still works) | `.claude/commands/*.md` → `/<name>` (superseded by skills, still works) ⁴ |
| **Workflows** ◆ | `~/.claude/workflows/*.js` — JavaScript multi-agent orchestration scripts | `.claude/workflows/*.js` — each file becomes a named workflow command via `/workflows` |
| **Output styles** ◆ | `~/.claude/output-styles/*.md` — custom response format styles (frontmatter-based) | `.claude/output-styles/*.md` |
| **MCP** ★ | `~/.claude.json` — global MCP server config; `managed-mcp.json` in system dirs for enterprise | `<repo>/.mcp.json` |

**Sources:**
[Memory & instructions](https://code.claude.com/docs/en/memory) ·
[Skills](https://code.claude.com/docs/en/skills) ·
[Sub-agents](https://code.claude.com/docs/en/sub-agents) ·
[Settings](https://code.claude.com/docs/en/settings) ·
[`.claude` directory explorer](https://code.claude.com/docs/en/claude-directory) ·
`/etc/claude-code/` path: [anthropics/claude-code#2274](https://github.com/anthropics/claude-code/issues/2274)

---

## Codex CLI — OpenAI

Home: `~/.codex/` (`$CODEX_HOME`)

> **Rust rewrite complete:** The TypeScript CLI was retired mid-2025. The current codebase is 96.0% Rust (`codex-rs/`), production-stable since June 2025, with a ~2 releases/day cadence. Core config paths are stable post-transition.

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ◆ | `~/.codex/AGENTS.override.md` (takes precedence), `~/.codex/AGENTS.md` — global user-level instructions | `<repo>/AGENTS.override.md`, `<repo>/AGENTS.md` — walks root→cwd; override file wins; first non-empty used; 1 file/dir; 32 KiB default cap (`project_doc_max_bytes`). Fallbacks via `project_doc_fallback_filenames` |
| **Config** ◆ | `~/.codex/config.toml`; `~/.codex/<profile>.config.toml` — named profile selected via `--profile` flag | `.codex/config.toml` — walks root→cwd; closest wins (trusted projects only). System: `/etc/codex/config.toml`. Enterprise: `requirements.toml` (enforced constraints, cannot be overridden by user/project config) |
| **Skills** ◆ | `~/.agents/skills/*/SKILL.md` — user-level; no `~/.codex/skills/` path in official docs | `.agents/skills/*/SKILL.md` — walks CWD → parent → repo root; `/skills` to invoke. Toggle via `[[skills.config]]` (`path`, `enabled`) in config.toml. Admin: `/etc/codex/skills/`; System: bundled |
| **Subagents** ◆ | `~/.codex/agents/*.toml` | `.codex/agents/*.toml`; also `[agents.*]` in `config.toml`. Global settings under `[agents]` (`max_depth` default `1`) |
| **Rules** ◆ | `~/.codex/rules/default.rules` — Starlark syntax; written by TUI allow-command | `.codex/rules/` |
| **Hooks** ◆ | `~/.codex/hooks.json` — or inline `[hooks]` table in `config.toml` (Rust-era addition; warns if both present) | `.codex/hooks.json`; or inline `[hooks]` in `.codex/config.toml` |
| **MCP** ◆ | `[mcp_servers]` in `~/.codex/config.toml` | `[mcp_servers]` in `.codex/config.toml` |
| **Plugins** ○ | — | `.codex-plugin/plugin.json` — bundles skills, MCP configs, and hooks |

**Sources:**
[AGENTS.md discovery](https://developers.openai.com/codex/guides/agents-md) ·
[Skills](https://developers.openai.com/codex/skills) ·
[Subagents](https://developers.openai.com/codex/subagents) ·
[Config basics](https://developers.openai.com/codex/config-basic) ·
[Config reference](https://developers.openai.com/codex/config-reference) ·
[Advanced config](https://developers.openai.com/codex/config-advanced) ·
[Hooks](https://developers.openai.com/codex/hooks) ·
[Rules](https://developers.openai.com/codex/rules) ·
[CLI reference](https://developers.openai.com/codex/cli/reference)

---

## GitHub Copilot — GitHub / Microsoft

Home: `~/.copilot/` · `~/.github/`

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | `$HOME/.copilot/copilot-instructions.md` (CLI). VS Code: `~/.copilot/instructions/*.instructions.md`. `$COPILOT_CUSTOM_INSTRUCTIONS_DIRS` | `.github/copilot-instructions.md` — repository-wide. Also reads `AGENTS.md` (CLI + VS Code via `chat.useAgentsMdFile`; experimental nested: `chat.useNestedAgentsMdFiles`), `CLAUDE.md`, `GEMINI.md` at root. VS Code additionally reads `.claude/CLAUDE.md` and `CLAUDE.local.md` (workspace) and `~/.claude/CLAUDE.md` (user home) via `chat.useClaudeMdFile` |
| **Path-specific** ★ | — | `.github/instructions/*.instructions.md` — YAML frontmatter `applyTo:` glob; searched recursively |
| **Prompt files** ★ | — | `.github/prompts/*.prompt.md` — invoke via `#prompt:` or `/` |
| **Custom agents** ◆ | `~/.copilot/agents/` — user-level agents (CLI/VS Code); `~/.github/agents/` — user-level agents (VS 2026, added April 2026 update) | `.github/agents/*.agent.md` — YAML: name, description, tools, model, mcp-servers, target (`vscode`\|`github-copilot`), disable-model-invocation, user-invocable. (`handoffs`, `agents`, `argument-hint`, and `hooks` are VS Code-only fields; not supported for cloud agents on GitHub.com.) `infer` field is **retired**; use `disable-model-invocation` + `user-invocable` instead. `.claude/agents/` — VS Code workspace agents (Claude format). Org: `.github-private` repo `agents/` dir |
| **Skills** ★ | `~/.copilot/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` ¹ | `.github/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — all three discovered ¹; `gh skill` CLI (GitHub CLI ≥ 2.90.0, public preview) |
| **MCP** ◆ | — | `.vscode/mcp.json` — VS Code project-level MCP (`.github/copilot/mcp.json` not confirmed in current docs) |

**Sources:**
[Custom instructions (CLI)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) ·
[Custom instructions (VS Code)](https://code.visualstudio.com/docs/copilot/customization/custom-instructions) ·
[About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) ·
[Adding skills](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-skills) ·
[Custom agents (cloud)](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents) ·
[Custom agents (VS Code)](https://code.visualstudio.com/docs/copilot/customization/custom-agents) ·
[Custom agents config ref](https://docs.github.com/en/copilot/reference/custom-agents-configuration) ·
[Agent skills (VS Code)](https://code.visualstudio.com/docs/copilot/customization/agent-skills) ·
[VS 2026 April update](https://github.blog/changelog/2026-04-30-github-copilot-in-visual-studio-april-update/)

---

## Cursor — Anysphere

Home: `.cursor/` (project-centric)

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | User Rules (Settings → Rules) — plain text; always applied | `<repo>/AGENTS.md` — root level and subdirectories; plain-markdown alternative to `.cursor/rules`. Legacy: `.cursorrules` (deprecated ~v0.43; fully absent from current docs, non-functional in Agent mode since March 2026 — migrate to `.cursor/rules/`) |
| **Rules** ★ | — | `.cursor/rules/*.mdc` — YAML frontmatter: `alwaysApply`, `description`, `globs`. 4 modes: Always Apply, Apply Intelligently, Apply to Specific Files, Apply Manually. (`.md` files in this directory are ignored; use `.mdc`.) Subdirectory grouping supported. Remote rules imported from GitHub live at `.cursor/rules/imported/<repoName>/path/to/rule.mdc` |
| **Commands** ◆ | `~/.cursor/commands/*.md` — user-global, all projects (superseded by skills 2.4+, still works) | `.cursor/commands/*.md` — invoke via `/`; filename becomes command name (Cursor 1.6+; superseded by skills 2.4+; use built-in `/migrate-to-skills` to convert) |
| **Skills** ◆ | `~/.cursor/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` — primary; `~/.claude/skills/*/SKILL.md`, `~/.codex/skills/*/SKILL.md` — legacy compat ² | `.cursor/skills/*/SKILL.md`, `.agents/skills/*/SKILL.md` — primary; `.claude/skills/*/SKILL.md`, `.codex/skills/*/SKILL.md` — legacy compat ² — agentskills.io; loaded on demand. SKILL.md: `paths` field (current) scopes activation by glob; `globs` is now the legacy alias |
| **Subagents** ◆ | `~/.cursor/agents/*.md` — user-level; compat: `~/.claude/agents/`, `~/.codex/agents/` | Markdown+YAML files in `.cursor/agents/` (project primary); compat: `.claude/agents/`, `.codex/agents/`; `.cursor/` takes precedence on name conflict. Fields: `name`, `description`, `model` (default `inherit`), `readonly`, `is_background`. Background agents write output to `~/.cursor/subagents/`. Parallel (v2.4+); nested tree (v2.5+). `.cursor/worktrees.json` — setup commands; searched in worktree path first, then project root |
| **Hooks** ◆ | `~/.cursor/hooks.json`; hook scripts in `~/.cursor/hooks/`; Enterprise: `/Library/Application Support/Cursor/hooks.json` (macOS) · `/etc/cursor/hooks.json` (Linux) · `C:\ProgramData\Cursor\hooks.json` (Windows) | `.cursor/hooks.json`; hook scripts in `.cursor/hooks/` — camelCase event names (`preToolUse`/`postToolUse`); `loop_limit` defaults to 5; supports `type: "prompt"` (LLM-evaluated condition); NOT identical to Claude Code hooks format (PascalCase, unlimited). Priority: Enterprise → Team → Project → User |
| **MCP** ◆ | `~/.cursor/mcp.json` | `.cursor/mcp.json` — `mcpServers` key; supports local, remote, remote+OAuth |
| **Team Rules** ◆ | Managed from Cursor dashboard (Team/Enterprise); pushed to members. Precedence: Team → Project → User | *(same)* |

**Sources:**
[Cursor docs home](https://cursor.com/docs) ·
[Rules](https://cursor.com/docs/rules) ·
[Agent skills](https://cursor.com/docs/context/skills) ·
[Hooks](https://cursor.com/docs/hooks) ·
[MCP](https://cursor.com/docs/mcp) ·
[Worktrees](https://cursor.com/docs/configuration/worktrees) ·
[Subagents](https://cursor.com/docs/subagents) ·
[Best practices (rules + skills)](https://cursor.com/blog/agent-best-practices) ·
[Changelog 2.4 (subagents, skills)](https://cursor.com/changelog/2-4)

---

## Mistral Vibe — Mistral AI

Home: `~/.vibe/` (`$VIBE_HOME`)

> **Note:** Current version: 2.14.1 (June 8, 2026). Config surface has been stable since Vibe 2.0.

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ◆ | `~/.vibe/AGENTS.md` (or `$VIBE_HOME/AGENTS.md`) — user-level instruction file; official docs confirm this path | `<repo>/AGENTS.md` — walks cwd upward within trusted folders (official docs confirm path traversal within trusted project directories; single-root workspace recommended) |
| **Config** ◆ | `~/.vibe/config.toml` — fallback | `.vibe/config.toml` — project-local, checked first |
| **System prompts** ◆ | `~/.vibe/prompts/*.md` — set `system_prompt_id` or `compaction_prompt_id` in config.toml | `.vibe/prompts/*.md` |
| **Skills** ◆ | `~/.vibe/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` — agentskills.io; invoke via `/`. Custom paths via `skill_paths` in config.toml | `.vibe/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** (trusted folders only) |
| **Agents** ◆ | `~/.vibe/agents/*.toml` — `display_name`, `safety`, `enabled_tools` | `.vibe/agents/*.toml` — subagents: `agent_type = "subagent"`; user-facing selectable agents: `agent_type = "agent"` |
| **API keys** ◆ | `~/.vibe/.env` — auto-loaded; env vars take precedence | — |
| **Trust / misc** ◆ | `~/.vibe/trusted_folders.toml` — trust management. `~/.vibe/tools/` — custom tools. `~/.vibe/logs/` — session logs | — |

**Sources:**
[Configuration](https://docs.mistral.ai/mistral-vibe/terminal/configuration) ·
[Agents & Skills](https://docs.mistral.ai/mistral-vibe/agents-skills) ·
[GitHub: mistralai/mistral-vibe](https://github.com/mistralai/mistral-vibe) ·
[PyPI: mistral-vibe](https://pypi.org/project/mistral-vibe/) ·
[Vibe 2.0 announcement](https://mistral.ai/news/mistral-vibe-2-0) ·
[Remote agents + Medium 3.5](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5)

---

## OpenCode — SST (open source)

Home: `~/.config/opencode/`

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ★ | `~/.config/opencode/AGENTS.md` — personal rules, all sessions. Compat fallback: `~/.claude/CLAUDE.md` ³ | `<repo>/AGENTS.md`, `CLAUDE.md` — walks cwd up to git root; first non-empty wins. Extra via `opencode.json` `instructions: […]`; supports remote URLs + globs |
| **Config** ★ | `~/.config/opencode/opencode.json` (or `.jsonc`). TUI settings: `tui.json` (or `.jsonc`; legacy `tui` key in `opencode.json` deprecated). System/managed: `/etc/opencode/` (Linux) · `/Library/Application Support/opencode/` (macOS) · `%ProgramData%\opencode` (Windows). Env overrides: `OPENCODE_CONFIG` (custom file path), `OPENCODE_CONFIG_DIR` (replaces `~/.config/opencode/`), `OPENCODE_CONFIG_CONTENT` (inline JSON), `OPENCODE_TUI_CONFIG`. Config values support `{env:VAR}` and `{file:path}` interpolation | `<repo>/opencode.json`. Remote/org config: `.well-known/opencode` (lowest precedence; fetched on provider auth) |
| **Commands** ★ | `~/.config/opencode/commands/*.md` — invoke via `/` in the TUI | `.opencode/commands/*.md` — filename becomes command name |
| **Skills** ★ | `~/.config/opencode/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` | `.opencode/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — walks cwd→git root. Claude compat discovery gated by `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` / `OPENCODE_DISABLE_CLAUDE_CODE` |
| **Agents** ★ | `~/.config/opencode/agents/*.md` — YAML: description, model, temperature, top_p, mode (`primary`\|`subagent`\|`all`), permission | `.opencode/agents/*.md` — primary (Tab) or subagent (@ invoke) |

**Sources:**
[Rules (AGENTS.md)](https://opencode.ai/docs/rules/) ·
[Agent Skills](https://opencode.ai/docs/skills/) ·
[Agents](https://opencode.ai/docs/agents/) ·
[Getting started](https://opencode.ai/docs/)

---

## Pi — earendil-works (open source)

Home: `~/.pi/` (agent config under `~/.pi/agent/`)

> **Philosophy:** Pi is a minimal terminal harness — "primitives, not features." It deliberately ships **no built-in MCP, subagents, or plan mode**; those are added as TypeScript extensions. Distributed on npm as `@earendil-works/pi-coding-agent` (migrated from `@mariozechner/pi-coding-agent` at v0.74.0 — old package deprecated at v0.73.1, new repo at `earendil-works/pi`).

| Feature | Global (user) | Project (repo) |
|---|---|---|
| **Instructions** ◆ | `~/.pi/agent/AGENTS.md` — also reads `CLAUDE.md`; all discovered files concatenated | `<repo>/AGENTS.md` — loaded from parent dirs + cwd at startup |
| **System prompt** ◆ | `~/.pi/agent/SYSTEM.md` (replace), `~/.pi/agent/APPEND_SYSTEM.md` (append) | `.pi/SYSTEM.md` (replace), `.pi/APPEND_SYSTEM.md` (append) — per-project |
| **Settings** ◆ | `~/.pi/agent/settings.json` | `.pi/settings.json` — project overrides global |
| **Skills** ◆ | `~/.pi/agent/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` — bare root `.md` files count as skills in `~/.pi/agent/skills/` only (not in `~/.agents/skills/`); `settings.json` `skills: []` can add other paths (e.g. `~/.claude/skills`) | `.pi/skills/`, **`.agents/skills/*/SKILL.md`** — walks cwd→git root; `/skill:<name>` to invoke. Skill name need not match directory |
| **Prompt templates** ◆ | `~/.pi/agent/prompts/*.md` → `/<name>` | `.pi/prompts/*.md` |
| **Models** ◆ | `~/.pi/agent/models.json` — custom providers (Ollama, vLLM, LM Studio, proxies) | — |
| **Extensions** ◆ | `~/.pi/agent/extensions/*.ts` — TypeScript modules; how MCP, subagents, hooks, plan mode etc. are added | `.pi/extensions/` — auto-discovered |
| **MCP / Subagents** ○ | Not built in — provided via extensions. `~/.pi/agent/mcp.json` is a **community extension convention** only; not a core Pi path | *(same)* |
| **Packages** ◆ | npm/git bundles declared via a `pi` key in `package.json` (`extensions`, `skills`, `prompts`, `themes`) | *(same)* |

**Sources:**
[Pi home](https://pi.dev/) ·
[Migration announcement](https://pi.dev/news/2026/5/7/pi-has-a-new-home) ·
[Skills doc](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md) ·
[README](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md) ·
[npm: @earendil-works/pi-coding-agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)

---

## Notes

¹ VS 2026, VS Code, and Copilot CLI all discover `.github/skills/`, `.claude/skills/`, and `.agents/skills/` at project scope. User-scope skill directories are `~/.copilot/skills/`, `~/.claude/skills/`, and `~/.agents/skills/`. See [VS 2026 April update](https://github.blog/changelog/2026-04-30-github-copilot-in-visual-studio-april-update/).

² Cursor's official docs now label `.claude/skills/`, `~/.claude/skills/`, `.codex/skills/`, and `~/.codex/skills/` as legacy backward-compatibility paths. Primary locations are `.cursor/skills/` and `.agents/skills/` (project) and `~/.cursor/skills/` and `~/.agents/skills/` (user). See [Cursor agent skills docs](https://cursor.com/docs/context/skills).

³ OpenCode Claude compat can be disabled granularly: `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1` (disables `~/.claude/CLAUDE.md` fallback), `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1` (disables `.claude/skills/` discovery), `OPENCODE_DISABLE_CLAUDE_CODE=1` (all `.claude/` support). The previously documented `OPENCODE_DISABLE_CLAUDE_COMPAT=1` and `OPENCODE_DISABLE_EXTERNAL_SKILLS=1` are **not valid variables**. See [OpenCode rules docs](https://opencode.ai/docs/rules/).

⁴ In Claude Code, slash commands and skills have converged — a skill `deploy` and a command file `deploy.md` both produce `/deploy`. Existing `.claude/commands/` files keep working unchanged.

### Cross-agent standards

- **`.agents/skills/`** — The cross-agent convention from the [agentskills.io client implementation guide](https://agentskills.io/client-implementation/adding-skills-support). The spec instructs all compliant clients to scan both their own native directory and `.agents/skills/`. Scanned by Codex, Copilot, OpenCode, Gemini CLI, Cursor, Vibe, and Pi among others. Symlink-friendly for a single canonical skill tree.

- **`AGENTS.md`** — Open standard ([agents.md](https://agents.md)), originally created by OpenAI (August 2025) and now stewarded by the **Agentic AI Foundation (AAIF)** under the Linux Foundation (founded December 2025). Tools listed on agents.md as of June 2026 (25+ on main page; additional tools via 'View all supported agents' link): Codex (OpenAI), Jules (Google), Factory, Aider, goose, OpenCode, Zed, Warp, VS Code, Devin (Cognition), UiPath, Junie (JetBrains), Amp, Cursor, RooCode, Gemini CLI, Kilo Code, Phoenix, Semgrep, GitHub Copilot, Ona, Windsurf (Cognition), Augment Code, and others. Over 60,000 open-source projects use AGENTS.md. (Note: Pi and Mistral Vibe support AGENTS.md but are not listed on agents.md.)

- **`SKILL.md`** — [Agent Skills spec](https://agentskills.io/specification). No explicit version number in the spec itself — there is no top-level `version:` frontmatter field; skill package versioning goes under the `metadata:` map (e.g., `metadata:\n  version: "1.0"`). Originally developed by Anthropic (released 2025-12-18); now maintained by the independent `agentskills` org at [github.com/agentskills/agentskills](https://github.com/agentskills/agentskills) (Apache 2.0 code / CC-BY-4.0 docs). Structure: `skill-name/{SKILL.md, scripts/, references/, assets/}`. `allowed-tools` frontmatter field is Experimental. Adopted by **~41 tools** on the live showcase (list has evolved significantly from prior verification).

- **Subagent format split:** Claude Code, Copilot (`.agent.md`, added Feb 2026), OpenCode, and Cursor define agents as Markdown + YAML frontmatter. Codex uses Markdown+YAML for Agent Skills; TOML is used only for Codex's own internal subagent profile definitions (`.codex/agents/*.toml`). Vibe uses TOML for its internal subagent config profiles and Markdown+YAML for SKILL.md skills.

All paths use Unix notation; `~` = `%USERPROFILE%` on Windows. `$CODEX_HOME`, `$VIBE_HOME` override their respective defaults. `PI_CODING_AGENT_DIR` overrides `~/.pi/agent/`.

---

*Last verified: 20260610*
