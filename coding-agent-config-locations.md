# Coding Agent Configuration Locations

Instruction files, custom prompts, skills & subagents for CLI / agentic coding tools — October 2026

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

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ★ | `<repo>/CLAUDE.md` or `<repo>/.claude/CLAUDE.md`, `<repo>/CLAUDE.local.md` — walks cwd up to `/`. Also reads `AGENTS.md` (and `.claude/AGENTS.md`) when no `CLAUDE.md`/`CLAUDE.local.md` exists at or above cwd; controlled by the **Project instructions** setting (`/config`, or `pluginConfigs["cc-plugin-agents-md@builtin"].options.instructionFiles`) with values `claude-md-or-agents-md` (default), `claude-md-and-agents-md`, `claude-md`, `managed-only`. An `@AGENTS.md` import inside `CLAUDE.md` layers Claude-specific content alongside AGENTS.md. Subdirectory `CLAUDE.md` files load lazily | `~/.claude/CLAUDE.md` — personal defaults, all projects |
| **Instructions** ◆ | — | Managed: `/etc/claude-code/CLAUDE.md` (Linux/WSL) · `/Library/Application Support/ClaudeCode/CLAUDE.md` (macOS) · `C:\Program Files\ClaudeCode\CLAUDE.md` (Windows) |
| **Rules** ★ | `.claude/rules/*.md` — path-scoped via YAML frontmatter `paths:`; discovered recursively | `~/.claude/rules/*.md` |
| **Settings** ★ | `.claude/settings.json`, `.claude/settings.local.json` (gitignored). Precedence: Managed > CLI args > Local > Project > User | `~/.claude/settings.json`; Managed: `/etc/claude-code/managed-settings.json` + `managed-settings.d/*.json` (Linux/WSL) · `/Library/Application Support/ClaudeCode/managed-settings.json` + `managed-settings.d/` + MDM plist `com.anthropic.claudecode` (macOS) · `C:\Program Files\ClaudeCode\managed-settings.json` + `managed-settings.d\` + `HKLM\SOFTWARE\Policies\ClaudeCode` + `HKCU\SOFTWARE\Policies\ClaudeCode` (Windows) |
| **Skills** ★ | `.claude/skills/*/SKILL.md` — progressive disclosure per agentskills.io | `~/.claude/skills/*/SKILL.md`; skills synced from claude.ai land at `~/.claude/skills/synced/<name>/SKILL.md`, invoked as `/anthropic-skills:<name>` |
| **Subagents** ★ | `.claude/agents/*.md` — Markdown + YAML frontmatter; subdirectories are discovered, but identity comes only from the `name` field (no directory-qualified naming). Across nested project `.claude/agents/` directories the definition closest to the working directory wins; only plugin subagents get scoped identifiers like `my-plugin:review:security`. Frontmatter fields include `isolation: worktree` (runs in a temporary git worktree), `background`, `omitClaudeMd` (skips injecting CLAUDE.md), `effort`, `color`, `initialPrompt`, `experimental`; `--agents` CLI flag defines session-scoped JSON subagents; nested spawning depth defaults to 3 | `~/.claude/agents/*.md`; managed/enterprise subagents deployed inside the managed-settings directory take highest priority |
| **Agent memory** ◆ | `.claude/agent-memory/<agent-name>/` (`memory: project`, committable), `.claude/agent-memory-local/<agent-name>/` (`memory: local`, gitignored) | `~/.claude/agent-memory/<agent-name>/` — subagent user-scoped (`memory: user`). Main-session auto-memory: `~/.claude/projects/<project>/memory/MEMORY.md` (`autoMemoryDirectory` setting overrides). `CLAUDE_CODE_PROJECT_DIR_NAME` (paired with `CLAUDE_CONFIG_DIR`) lets multiple checkouts of the same repo share one auto-memory directory |
| **Commands** ★ | `.claude/commands/*.md` → `/<name>` (superseded by skills, still works) ⁴. `/import` pulls `AGENTS.md` and other agents' configs (MCP servers, commands, subagents, skills) into Claude Code | `~/.claude/commands/*.md` → `/<name>` (superseded by skills, still works) |
| **Workflows** ◆ | `.claude/workflows/*.js` — each saved file becomes a `/<name>` command; `/workflows` opens the run-management view (list, watch, pause, stop). On the Pro plan, dynamic workflows require manual enablement via `/config` | `~/.claude/workflows/*.js` — JavaScript multi-agent orchestration scripts |
| **Output styles** ◆ | `.claude/output-styles/*.md`. Set with `/output-style [name]` (lists styles with no arg), `/config`, or the `outputStyle` setting key; applies from the next message | `~/.claude/output-styles/*.md` — custom response format styles (frontmatter-based: `name`, `description`, `keep-coding-instructions`) |
| **Worktrees** ◆ | `<repo>/.worktreeinclude` — lists gitignored files to copy into new worktrees; `.gitignore` syntax. `--worktree`/`-w` flag or the `EnterWorktree` tool create worktrees under `.claude/worktrees/<name>/` on branch `worktree-<name>`; `worktree.baseRef` setting (`"fresh"` vs `"head"`) | — |
| **MCP** ★ | `<repo>/.mcp.json` | `~/.claude.json` — global MCP server config (also holds OAuth session, per-project trust state, caches); enterprise `managed-mcp.json` at `/etc/claude-code/managed-mcp.json` (Linux/WSL) · `/Library/Application Support/ClaudeCode/managed-mcp.json` (macOS) · `C:\Program Files\ClaudeCode\managed-mcp.json` (Windows). Policy settings `allowedMcpServers`/`deniedMcpServers`/`allowManagedMcpServersOnly`/`strictPluginOnlyCustomization` restrict MCP sources |

**Sources:**
[Memory & instructions](https://code.claude.com/docs/en/memory) ·
[Skills](https://code.claude.com/docs/en/skills) ·
[Sub-agents](https://code.claude.com/docs/en/sub-agents) ·
[Settings](https://code.claude.com/docs/en/settings) ·
[Managed settings](https://code.claude.com/docs/en/managed-settings) ·
[`.claude` directory explorer](https://code.claude.com/docs/en/claude-directory) ·
[Workflows](https://code.claude.com/docs/en/workflows) ·
[Output styles](https://code.claude.com/docs/en/output-styles) ·
[Worktrees](https://code.claude.com/docs/en/worktrees) ·
[Managed MCP](https://code.claude.com/docs/en/managed-mcp) ·
`/etc/claude-code/` path: [anthropics/claude-code#2274](https://github.com/anthropics/claude-code/issues/2274)

---

## Codex CLI — OpenAI

Home: `~/.codex/` (`$CODEX_HOME`)

> **Implementation:** The current CLI is written in Rust (`codex-rs/`); the paths below apply to it. A separate TypeScript **SDK** (`sdk/typescript`) is unrelated to the CLI.

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | `<repo>/AGENTS.override.md`, `<repo>/AGENTS.md` — walks root→cwd; override file wins; first non-empty used; 1 file/dir; 32 KiB default cap (`project_doc_max_bytes`). Fallbacks via `project_doc_fallback_filenames` | `~/.codex/AGENTS.override.md` (takes precedence), `~/.codex/AGENTS.md` — global user-level instructions |
| **Config** ◆ | `.codex/config.toml` — walks root→cwd; closest wins (trusted projects only). System: `/etc/codex/config.toml`. Enterprise enforced: `/etc/codex/requirements.toml` (Unix) · `%ProgramData%\OpenAI\Codex\requirements.toml` (Windows) — cannot be overridden. `--strict-config` errors on unrecognized fields | `~/.codex/config.toml`; `~/.codex/<profile>.config.toml` — named profile selected via `--profile` flag. Enterprise managed defaults: `/etc/codex/managed_config.toml` (Unix) · `~/.codex/managed_config.toml` (Windows/non-Unix) · macOS MDM `com.openai.codex` domain (`config_toml_base64`, `requirements_toml_base64` keys; highest precedence) |
| **Skills** ◆ | `.agents/skills/*/SKILL.md` — walks CWD → parent → repo root; `/skills` or `$` to invoke. Toggle via `[[skills.config]]` (`path`, `enabled`) in config.toml. Admin: `/etc/codex/skills/`; System: bundled | `~/.agents/skills/*/SKILL.md` — user-level |
| **Subagents** ◆ | `.codex/agents/*.toml`; also `agents.<name>.config_file`/`agents.<name>.description` in `config.toml`. Global settings under `[agents]`: `enabled` (default `true`), `max_concurrent_threads_per_session` (legacy alias `max_threads`), `default_subagent_model`, `default_subagent_reasoning_effort`, `interrupt_message` (default `true`) | `~/.codex/agents/*.toml` — required fields `name`, `description`, `developer_instructions` |
| **Rules** ◆ | `.codex/rules/` — loads only when the project is trusted | `~/.codex/rules/default.rules` — Starlark `prefix_rule()` syntax (`pattern`, `decision` [allow/prompt/forbidden], `justification`, `match`/`not_match`); written by TUI allow-command; validate via `codex execpolicy check` |
| **Hooks** ◆ | `.codex/hooks.json`; or inline `[hooks]` in `.codex/config.toml`. `--dangerously-bypass-hook-trust` runs hooks without persisted trust | `~/.codex/hooks.json` — or inline `[hooks]` table in `config.toml` (merges both if present in same layer, with a startup warning); gated by `features.hooks`. Events: `SessionStart`, `SessionEnd`, `PreToolUse`, `PermissionRequest`, `PostToolUse`, `UserPromptSubmit`, `PreCompact`/`PostCompact`, `SubagentStart`/`SubagentStop`, `Interrupt`, `Stop` |
| **MCP** ◆ | `[mcp_servers]` in `.codex/config.toml` | `[mcp_servers]` in `~/.codex/config.toml` |
| **Plugins** ◆ | `.codex-plugin/plugin.json` — manifest bundling `skills/`, `.mcp.json`, `hooks/hooks.json`, `.app.json`, `assets/` (not a top-level `hooks.json`); repo marketplace at `.agents/plugins/marketplace.json` with plugins under `plugins/` | `~/.agents/plugins/marketplace.json` — personal plugin marketplace catalog; installed plugins cached at `~/.codex/plugins/cache/$MARKETPLACE_NAME/$PLUGIN_NAME/$VERSION/` (`local` version for local plugins) |

**Sources:**
[AGENTS.md discovery](https://learn.chatgpt.com/docs/agent-configuration/agents-md) ·
[Skills](https://learn.chatgpt.com/docs/build-skills) ·
[Subagents](https://learn.chatgpt.com/docs/agent-configuration/subagents) ·
[Config basics](https://learn.chatgpt.com/docs/config-file/config-basic) ·
[Config reference](https://learn.chatgpt.com/docs/config-file/config-reference) ·
[Advanced config](https://learn.chatgpt.com/docs/config-file/config-advanced) ·
[Managed configuration](https://learn.chatgpt.com/docs/enterprise/managed-configuration) ·
[Hooks](https://learn.chatgpt.com/docs/hooks) ·
[Rules](https://learn.chatgpt.com/docs/agent-configuration/rules) ·
[Plugins](https://learn.chatgpt.com/docs/build-plugins) ·
[CLI reference](https://learn.chatgpt.com/docs/developer-commands?surface=cli)

---

## GitHub Copilot — GitHub / Microsoft

Home: `~/.copilot/` · `~/.github/`

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ★ | `.github/copilot-instructions.md` — repository-wide. Also reads `AGENTS.md` (**treated as primary instructions**; CLI + VS Code via `chat.useAgentsMdFile`; nested: `chat.useNestedAgentsMdFiles`), `CLAUDE.md` (and `.claude/CLAUDE.md`, read by the CLI too), `GEMINI.md` at root. VS Code additionally reads `CLAUDE.local.md` (workspace) and `~/.claude/CLAUDE.md` (user home) via `chat.useClaudeMdFile`, and a project-level `.claude/rules/` folder (uses a `paths` key instead of `applyTo`) | `$HOME/.copilot/copilot-instructions.md`, `~/.copilot/instructions/**/*.instructions.md` (CLI and VS Code); `$COPILOT_HOME` replaces `~/.copilot` for both. VS Code additionally: `~/.claude/rules` — configurable via `chat.instructionsFilesLocations` (used only by the Local agent). `$COPILOT_CUSTOM_INSTRUCTIONS_DIRS` |
| **Path-specific** ★ | `.github/instructions/*.instructions.md` — YAML frontmatter `applyTo:` glob; optional `excludeAgent:` key to exclude from `code-review` or `cloud-agent`; searched recursively | — |
| **Prompt files** ◆ | `.github/prompts/*.prompt.md` — invoke via `#prompt:` or `/`; public preview, subject to change; VS Code, Visual Studio, and JetBrains IDEs only — not yet supported in Copilot CLI | — |
| **Custom agents** ◆ | `.github/agents/*.agent.md` — YAML: name, description, tools, model, mcp-servers, target (`vscode`\|`github-copilot`), disable-model-invocation, user-invocable, metadata. (`handoffs`, `agents`, and `argument-hint` are VS Code-only fields, not supported for cloud agents on GitHub.com. `hooks` is a VS Code preview field requiring the `chat.useHooks` setting, on by default.) `model:` can list multiple models, tried in order until one is available (CLI). `.claude/agents/` — VS Code workspace agents (Claude format). Org: `.github` or `.github-private` repo `agents/` dir; Enterprise-wide: `.github-private` repo of a designated org | `~/.copilot/agents/` — user-level agents (CLI/VS Code); `~/.github/agents/` — user-level agents (VS 2026) |
| **Skills** ★ | `.github/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — all three discovered ¹; `gh skill` CLI (GitHub CLI ≥ 2.90.0, public preview) | `~/.copilot/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` (CLI); also `~/.claude/skills/*/SKILL.md` (VS Code only) ¹ |
| **MCP** ◆ | `.vscode/mcp.json` — VS Code project-level MCP, `servers` key (not read by Copilot CLI). Copilot CLI: `.mcp.json` (project root/cwd) and `.github/mcp.json`, `mcpServers` key — the CLI walks cwd → git root loading every match found, closest wins; when both files exist in the same directory, `.mcp.json` takes precedence. Cloud agent's repo-level MCP config is entered as JSON in the repo's Settings → Copilot → MCP servers page on GitHub.com — not a committed file | `~/.copilot/mcp-config.json` — CLI, `mcpServers` key. VS Code: user-profile `mcp.json` via "MCP: Open User Configuration" command, `servers` key |

**Sources:**
[Custom instructions (CLI)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions) ·
[Custom instructions (VS Code)](https://code.visualstudio.com/docs/agent-customization/custom-instructions) ·
[About agent skills](https://docs.github.com/en/copilot/concepts/agents/about-agent-skills) ·
[Adding skills](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/create-skills) ·
[Custom agents (cloud)](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/create-custom-agents) ·
[Custom agents (VS Code)](https://code.visualstudio.com/docs/copilot/customization/custom-agents) ·
[Custom agents config ref](https://docs.github.com/en/copilot/reference/custom-agents-configuration) ·
[Agent skills (VS Code)](https://code.visualstudio.com/docs/copilot/customization/agent-skills) ·
[VS 2026 April update](https://github.blog/changelog/2026-04-30-github-copilot-in-visual-studio-april-update/) ·
[MCP servers (CLI)](https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-mcp-servers) ·
[MCP servers (repository)](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers)

---

## Cursor — Anysphere

Home: `.cursor/` (project-centric)

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ★ | `<repo>/AGENTS.md` — root level and subdirectories; plain-markdown alternative to `.cursor/rules`. Legacy: `.cursorrules` (deprecated but still functional — use `.cursor/rules/`) | User Rules (Customize → Rules) — plain text; always applied. The "Customize" page centrally manages plugins/rules/skills/MCP/subagents/commands/hooks at user/team/workspace scope. `CURSOR_CONFIG_DIR` env var overrides the CLI config dir |
| **Rules** ★ | `.cursor/rules/*.mdc` — YAML frontmatter: `alwaysApply`, `description`, `globs`. 4 modes: Always Apply, Apply Intelligently, Apply to Specific Files, Apply Manually. (`.md` files in this directory are ignored; use `.mdc`.) Subdirectory grouping supported. Rules are not imported standalone from GitHub; package them in a plugin (repo needs a `.cursor-plugin/marketplace.json`) and install via Customize → "From GitHub Repository" (or a team marketplace) | — |
| **Commands** ◆ | `.cursor/commands/*.md` — invoke via `/`; filename becomes command name. `/migrate-to-skills` converts "Apply Intelligently" rules and slash commands into skills | `~/.cursor/commands/*.md` — user-global, all projects |
| **Skills** ◆ | `.cursor/skills/*/SKILL.md`, `.agents/skills/*/SKILL.md` — primary; `.claude/skills/*/SKILL.md`, `.codex/skills/*/SKILL.md` — compat ² — agentskills.io; loaded on demand. SKILL.md: `paths` field scopes activation by glob (`globs` is a legacy alias) | `~/.cursor/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` — primary; `~/.claude/skills/*/SKILL.md`, `~/.codex/skills/*/SKILL.md` — compat ² |
| **Subagents** ◆ | Markdown+YAML files in `.cursor/agents/` (project primary); compat: `.claude/agents/`, `.codex/agents/`; `.cursor/` takes precedence on name conflict. Fields: `name`, `description`, `model` (default `inherit`), `readonly`, `is_background`. Background agents write output to `~/.cursor/subagents/`. `.cursor/worktrees.json` — setup commands; searched in worktree path first, then project root | `~/.cursor/agents/*.md` — user-level; compat: `~/.claude/agents/`, `~/.codex/agents/` |
| **Hooks** ◆ | `.cursor/hooks.json`; hook scripts in `.cursor/hooks/` — camelCase event names: `preToolUse`/`postToolUse`/`postToolUseFailure`/`beforeShellExecution`/`afterShellExecution`/`beforeMCPExecution`/`afterMCPExecution`/`beforeReadFile`/`afterFileEdit`/`beforeSubmitPrompt`/`afterAgentResponse`/`afterAgentThought`/`preCompact`/`stop`/`sessionStart`/`sessionEnd`/`subagentStart`/`subagentStop`, plus Tab inline-completion hooks `beforeTabFileRead`/`afterTabFileEdit` and app-lifecycle hook `workspaceOpen` (same config files); `loop_limit` defaults to 5; `failClosed` boolean (default `false`) blocks action on hook failure; supports `type: "prompt"` (LLM-evaluated condition); not identical to Claude Code's hooks format. Priority: Enterprise → Team → Project → User | `~/.cursor/hooks.json`; hook scripts in `~/.cursor/hooks/`; Enterprise: `/Library/Application Support/Cursor/hooks.json` (macOS) · `/etc/cursor/hooks.json` (Linux) · `C:\ProgramData\Cursor\hooks.json` (Windows) |
| **MCP** ◆ | `.cursor/mcp.json` — `mcpServers` key; supports local, remote, remote+OAuth | `~/.cursor/mcp.json` |
| **Team Rules** ◆ | *(same)* | Managed from Cursor dashboard (Team/Enterprise); pushed to members. Precedence: Team → Project → User |

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

> **Note:** Config paths below apply to the current CLI. `VIBE_CLI` env var selects the CLI implementation (Rust default; the Python TUI is an opt-out fallback). `session_logging.generate_titles` (default on) controls auto-generated session titles. Other config.toml keys: `vision_model`, `[utility_models]`. `~/.vibe/.env` is created with `0600` permissions.

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | `<repo>/AGENTS.md` — walks cwd upward within trusted folders (official docs confirm path traversal within trusted project directories; single-root workspace recommended) | `~/.vibe/AGENTS.md` (or `$VIBE_HOME/AGENTS.md`) — user-level instruction file; official docs confirm this path |
| **Config** ◆ | `.vibe/config.toml` — project-local, checked first | `~/.vibe/config.toml` — fallback |
| **System prompts** ◆ | `.vibe/prompts/*.md` | `~/.vibe/prompts/*.md` — set `system_prompt_id` in config.toml; `compaction_prompt_id` selects custom compaction prompts resolved from `~/.vibe/prompts/` or `.vibe/prompts/` |
| **Skills** ◆ | `.vibe/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** (trusted folders only) | `~/.vibe/skills/*/SKILL.md` — agentskills.io; invoke via `/`. Custom paths via `skill_paths` in config.toml, plus `enabled_skills`/`disabled_skills`. Discovery order: `skill_paths` → project (`.vibe/skills/`, `.agents/skills/`) → user (`~/.vibe/skills/`). `~/.agents/skills/*/SKILL.md` at user scope is unconfirmed in the current docs |
| **Agents** ◆ | `.vibe/agents/*.toml` — subagents: `agent_type = "subagent"`; user-facing selectable agents: `agent_type = "agent"` | `~/.vibe/agents/*.toml` — `display_name`, `safety` (safe/neutral/destructive/yolo; display-only), `enabled_tools` |
| **API keys** ◆ | — | `~/.vibe/.env` — auto-loaded; env vars (e.g. `MISTRAL_API_KEY`) take precedence |
| **Hooks** ◆ | `.vibe/hooks.toml` — checked before `~/.vibe/hooks.toml` (trusted folders only); same hook name in both, project wins | `~/.vibe/hooks.toml` — events `post_agent` (after an assistant turn), `pre_tool`/`post_tool` (tool-call hooks, can deny calls or rewrite tool inputs); hooks load unconditionally when declared |
| **Trust / misc** ◆ | — | `~/.vibe/trusted_folders.toml` — trust management (e.g. `trusted = ["~/projects", ...]`); `--trust` CLI flag grants session-only (non-persistent) trust. `~/.vibe/tools/` — custom tools. `~/.vibe/logs/` — session logs (○ sources disagree: official docs list only `logs/`; community/reverse-engineered sources variously claim a sibling `~/.vibe/sessions/` dir or `~/.vibe/logs/session(s)/`, configurable via `[session_logging] save_dir` — unresolved) |

**Sources:**
[Configuration](https://docs.mistral.ai/vibe/code/cli/configuration) ·
[Agents](https://docs.mistral.ai/vibe/code/cli/agents) ·
[Skills reference](https://docs.mistral.ai/vibe/code/cli/skills) ·
[Hooks](https://docs.mistral.ai/vibe/code/cli/hooks) ·
[GitHub: mistralai/mistral-vibe](https://github.com/mistralai/mistral-vibe) ·
[PyPI: mistral-vibe](https://pypi.org/project/mistral-vibe/) ·
[Vibe 2.0 announcement](https://mistral.ai/news/mistral-vibe-2-0) ·
[Remote agents + Medium 3.5](https://mistral.ai/news/vibe-remote-agents-mistral-medium-3-5)

---

## OpenCode — Anomaly (open source)

Home: `~/.config/opencode/`

> **Repository:** `anomalyco/opencode`.
>
> **V2 beta:** A beta docs tree (`opencode.ai/v2/docs/`) exists alongside stable V1 ([migration guide](https://opencode.ai/v2/docs/migrate-v1/)). V2 reads `AGENTS.md` only (no `CLAUDE.md` discovery), consolidates `tui.json` into `cli.json` (`~/.config/opencode/cli.json`), and discovers skills at `.opencode/skill/` and `.opencode/skills/`; whether the `~/.claude/skills`, `~/.agents/skills`, `.claude/skills`, `.agents/skills` compat paths carry over is unverified. The table below documents stable V1 only.

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | `<repo>/AGENTS.md`, `CLAUDE.md` — walks cwd upward (docs confirm directory traversal but don't state the stopping boundary; commonly assumed git root); at each level AGENTS.md takes precedence over CLAUDE.md if both exist. Extra via `opencode.json` `instructions: […]`; supports remote URLs + globs (5s fetch timeout) | `~/.config/opencode/AGENTS.md` — personal rules, all sessions. Compat fallback: `~/.claude/CLAUDE.md` ³ |
| **Config** ★ | `<repo>/opencode.json`. Remote/org config: `.well-known/opencode` (lowest precedence; fetched on provider auth) | `~/.config/opencode/opencode.json` (or `.jsonc`). TUI settings: `tui.json` (or `.jsonc`; `tui` key in `opencode.json` is legacy). System/managed: `/etc/opencode/` (Linux) · `/Library/Application Support/opencode/` (macOS) · `%ProgramData%\opencode` (Windows). macOS MDM (highest precedence): `/Library/Managed Preferences/<user>/ai.opencode.managed.plist`, `/Library/Managed Preferences/ai.opencode.managed.plist`. Env overrides: `OPENCODE_CONFIG` (custom file path), `OPENCODE_CONFIG_DIR` (supplemental dir mirroring `.opencode`'s `agents/`/`commands/`/`modes/`/`plugins/` subdirs, loaded after global config + `.opencode` so it can override them — does not cover `opencode.json`/`AGENTS.md`/`skills/`), `OPENCODE_CONFIG_CONTENT` (inline JSON), `OPENCODE_TUI_CONFIG`. Config values support `{env:VAR}` and `{file:path}` interpolation. Precedence (low→high): remote → global `opencode.json` → `OPENCODE_CONFIG` → project `opencode.json` → `.opencode/` dirs → `OPENCODE_CONFIG_CONTENT` → managed files → macOS MDM |
| **Commands** ★ | `.opencode/commands/*.md` — filename becomes command name | `~/.config/opencode/commands/*.md` — invoke via `/` in the TUI |
| **Skills** ★ | `.opencode/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`, **`.agents/skills/*/SKILL.md`** — walks cwd→git root. Claude compat discovery gated by `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` / `OPENCODE_DISABLE_CLAUDE_CODE` | `~/.config/opencode/skills/*/SKILL.md`, `~/.claude/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` |
| **Modes** ○ | *(legacy)* `.opencode/modes/*.md` — same | *(legacy)* `~/.config/opencode/modes/*.md` — superseded by the Agents row's `mode` field (`primary`\|`subagent`\|`all`); may still load for backward compatibility |
| **Agents** ★ | `.opencode/agents/*.md` — primary (Tab) or subagent (@ invoke) | `~/.config/opencode/agents/*.md` — YAML: description, model, temperature, top_p, mode (`primary`\|`subagent`\|`all`), permission, color, steps, disable, hidden |

**Sources:**
[Rules (AGENTS.md)](https://opencode.ai/docs/rules/) ·
[Agent Skills](https://opencode.ai/docs/skills/) ·
[Agents](https://opencode.ai/docs/agents/) ·
[Config](https://opencode.ai/docs/config/) ·
[Commands](https://opencode.ai/docs/commands/) ·
[Getting started](https://opencode.ai/docs/)

---

## Pi — earendil-works (open source)

Home: `~/.pi/` (agent config under `~/.pi/agent/`)

> **Philosophy:** Pi is a minimal terminal harness — "primitives, not features." It ships **no built-in subagents or plan mode**; those are added as TypeScript extensions. MCP is built in (servers come from `mcp.json`, global or per-trusted-project). Distributed on npm as `@earendil-works/pi-coding-agent` (repo `earendil-works/pi`).

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | `<repo>/AGENTS.md`, `.pi/AGENTS.md` — loaded from parent dirs + cwd at startup; an `AGENTS.override.md` in a directory loads instead of that directory's AGENTS.md/CLAUDE.md (other directories' context files still concatenate normally) | `~/.pi/agent/AGENTS.md` — also reads `CLAUDE.md`; all discovered files concatenated |
| **System prompt** ◆ | `.pi/SYSTEM.md` (replace), `.pi/APPEND_SYSTEM.md` (append) — per-project | `~/.pi/agent/SYSTEM.md` (replace), `~/.pi/agent/APPEND_SYSTEM.md` (append) |
| **Settings** ◆ | `.pi/settings.json` — project overrides global | `~/.pi/agent/settings.json` — includes `defaultTools` (initial built-in tool selection, global or per-project) and `defaultProjectTrust` (`ask`/`never`/`always`, trust fallback for non-interactive modes `-p`/`--mode json`/`--mode rpc`); `~/.pi/agent/keybindings.json` — keyboard shortcuts; `~/.pi/agent/trust.json` — saved project trust decisions |
| **Skills** ◆ | `.pi/skills/`, **`.agents/skills/*/SKILL.md`** — walks cwd→git root; `/skill:<name>` to invoke. Skill name need not match directory | `~/.pi/agent/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` — bare root `.md` files count as skills in `~/.pi/agent/skills/` and `.pi/skills/` only (not in `.agents/skills/` locations); `settings.json` `skills: []` can add other paths (e.g. `~/.claude/skills`) |
| **Prompt templates** ◆ | `.pi/prompts/*.md` | `~/.pi/agent/prompts/*.md` → `/<name>` |
| **Models** ◆ | — | `~/.pi/agent/models.json` — custom providers (Ollama, vLLM, LM Studio, proxies) |
| **Extensions** ◆ | `.pi/extensions/` — auto-discovered | `~/.pi/agent/extensions/*.ts` — TypeScript modules; how subagents, hooks, plan mode etc. are added |
| **MCP** ◆ | `.pi/mcp.json` — project-level override for user-level MCP servers | `~/.pi/agent/mcp.json` — global, or per-project once trusted |
| **Subagents / plan mode** ○ | *(same)* | Not built in — provided via extensions |
| **Packages** ◆ | *(same)* | npm/git bundles declared via a `pi` key in `package.json` (`extensions`, `skills`, `prompts`, `themes`) |

**Sources:**
[Pi home](https://pi.dev/) ·
[Migration announcement](https://pi.dev/news/2026/5/7/pi-has-a-new-home) ·
[Skills doc](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md) ·
[README](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/README.md) ·
[npm: @earendil-works/pi-coding-agent](https://www.npmjs.com/package/@earendil-works/pi-coding-agent)

---

## Aider — open source

Home: no dedicated directory for user-editable config (`~/.aider.conf.yml`, `.env` sit directly in the home dir), but `~/.aider/` holds non-config state — `oauth-keys.env`, `caches/` (model pricing/context-window cache), `analytics.json` (opt-in anonymous analytics)

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions / conventions** ◆ | Convention files such as `CONVENTIONS.md`, loaded with `/read` or `--read`; persist via `read:` in the repo's `.aider.conf.yml` | Any file passed with `--read`; persist it via `read:` in `~/.aider.conf.yml` |
| **Config** ◆ | `<git-root>/.aider.conf.yml`, `<cwd>/.aider.conf.yml`; `.env` follows the same three-location search order as `.aider.conf.yml` (home → git root → cwd, last-loaded wins), or override with `--env-file`. CLI flags override file settings | `~/.aider.conf.yml`; environment variables `AIDER_*`; optional `.env` |
| **Model config** ◆ | Same keys can point to repo-local files | Paths selected by `model-settings-file` and `model-metadata-file`; commonly `.aider.model.settings.yml` and `.aider.model.metadata.json` |
| **History** ◆ | `.aider.chat.history.md` and `.aider.input.history` by default; filenames are configurable | — |
| **Skills / subagents / MCP** ◆ | *(same)* | No native Agent Skills, subagent-definition, or MCP configuration convention documented |

**Sources:**
[Configuration](https://aider.chat/docs/config.html) ·
[YAML config reference](https://aider.chat/docs/config/aider_conf.html) ·
[Coding conventions](https://aider.chat/docs/usage/conventions.html)

---

## Antigravity CLI — Google

Home: `~/.gemini/antigravity-cli/` (CLI state) · `~/.gemini/config/` (shared with Antigravity 2.0 and the IDE) · command: `agy`

> **Relation to Gemini CLI:** Antigravity CLI replaces Gemini CLI for individual users. `agy plugin import gemini` converts Gemini extensions to plugins, and legacy commands become skills. Workspace skills in `.gemini/skills/` must be moved to `.agents/skills/` by hand.

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | `AGENTS.md` or `GEMINI.md` in any directory, and `.agents/AGENTS.md` or `.agents/GEMINI.md`; read from the file's folder up to the workspace root. No frontmatter | `~/.gemini/GEMINI.md`, `~/.gemini/AGENTS.md`, `~/.gemini/config/GEMINI.md` or `~/.gemini/config/AGENTS.md`. Always active, no frontmatter |
| **Rules** ◆ | `.agents/rules/*.md` (legacy `.agent/rules/`); only direct children are scanned unless registered in `.agents/rules.json`. YAML frontmatter is required: `trigger` (`always_on`, `model_decision`, `glob`, `manual`), plus `description` or `globs` depending on the trigger. Files over 24,000 bytes are truncated | `~/.gemini/config/rules/*.md`; CLI only: `~/.gemini/antigravity-cli/rules/*.md`. Global and `always_on` rules share a 20,000-token budget |
| **Settings** ◆ | Not documented as a file; project settings are edited in the Settings UI | `~/.gemini/antigravity-cli/settings.json` (only non-default values are written), `~/.gemini/antigravity-cli/keybindings.json`. Command-line flags such as `--sandbox` override saved values for the session |
| **Skills** ◆ | `.agents/skills/*/SKILL.md` (legacy `.agent/skills/`); each skill becomes a slash command. Frontmatter: `description` (required), `name` (defaults to the folder name) | `~/.gemini/antigravity-cli/skills/*/SKILL.md` (Antigravity 2.0 and the IDE use `~/.gemini/config/skills/`) |
| **Subagents** ◆ | `.agents/agents/<name>.md` or `.agents/agents/<name>/agent.md`. Markdown with YAML frontmatter: `name`, `description` (both required), `tools`, `mainAgent`, `subagent`, `model` (`inherit`, `flash`, `pro`), `commandExecutionPolicy`, `mcpServers`, `skills`, `plugins`. Nesting is limited to 10 levels. `/agents` opens the agent manager | `~/.gemini/config/agents/<name>.md` or `~/.gemini/config/agents/<name>/agent.md` |
| **Hooks** ◆ | `.agents/hooks.json`. Events `PreToolUse`, `PostToolUse`, `PreInvocation`, `PostInvocation`, `Stop`; handler fields `command`, `type`, `timeout` (default 30s). `/hooks` lists loaded hooks | `~/.gemini/config/hooks.json`, or a `hooks` entry in `~/.gemini/antigravity-cli/settings.json`; merge order between locations is not documented |
| **MCP** ◆ | `.agents/mcp_config.json` | `~/.gemini/config/mcp_config.json`. `mcpServers` key; remote servers use `serverUrl` (the legacy `url` and `httpUrl` keys are not supported); optional `env`, `headers`, `oauth`, `disabled`, `disabledTools` |
| **Plugins** ◆ | `.agents/plugins/<name>/` | `~/.gemini/config/plugins/`; CLI installs go to `~/.gemini/antigravity-cli/plugins/<name>/`. A plugin has a `plugin.json` (`name`, optional `description`) and can bundle `skills/`, `agents/`, `rules/`, `mcp_config.json` and `hooks.json`. Manage with `agy plugin install\|list\|enable\|disable\|uninstall` or `/plugin` |

**Sources:**
[CLI migration from Gemini CLI](https://antigravity.google/docs/cli/gcli-migration/) ·
[Rules](https://antigravity.google/docs/rules/) ·
[Skills](https://antigravity.google/docs/skills/) ·
[Subagents](https://antigravity.google/docs/subagents/) ·
[Custom agents in the CLI](https://antigravity.google/docs/cli/commands/agents/) ·
[Hooks](https://antigravity.google/docs/hooks/) ·
[MCP](https://antigravity.google/docs/mcp/) ·
[Plugins](https://antigravity.google/docs/plugins/) ·
[CLI settings](https://antigravity.google/docs/settings?tab=cli)

---

## Cline — Cline Bot Inc.

Home: `~/.cline/` (CLI/SDK/Kanban; IDE integrations also use platform storage)

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions / rules** ◆ | `.cline/rules/` and primary legacy-compatible `.clinerules/`; also reads `AGENTS.md`, `.cursorrules`, and `.windsurfrules`. Conditional rules use `paths:` YAML frontmatter | `~/.cline/rules/`, `~/.agents/AGENTS.md`; compatibility search path `~/Documents/Cline/Rules/` (Linux may also use `~/Cline/Rules/`) |
| **Settings** ◆ | Project behavior is stored in `.cline/` subdirectories; secrets stay in global provider settings | `~/.cline/data/settings/providers.json`, `global-settings.json`, and `cline_mcp_settings.json`; `CLINE_DATA_DIR` replaces `~/.cline/data/` |
| **Skills** ◆ | `.cline/skills/*/SKILL.md` (recommended), `.clinerules/skills/`, `.claude/skills/`; progressive disclosure; always on, with per-skill toggles | `~/.cline/skills/*/SKILL.md` |
| **Agents** ◆ | `.cline/agents/` | `~/.cline/agents/` |
| **Hooks** ◆ | `.cline/hooks/` and `.clinerules/hooks/` (lower confidence); lifecycle scripts receive/return JSON. The hooks doc page points to "SDK Plugins" (`/sdk/plugins`) | `~/.cline/hooks/` (`CLINE_HOOKS_DIR` adds an extra hooks directory); compatibility `~/Documents/Cline/Hooks/` |
| **Workflows / plugins** ◆ | `.cline/plugins/`; project workflows are supported by Cline's configuration system | `~/.cline/workflows/`, `~/.cline/plugins/`; compatibility under `~/Documents/Cline/` |
| **MCP** ◆ | Managed through Cline settings; no separate committed project MCP filename documented | `~/.cline/data/settings/cline_mcp_settings.json` (honors `CLINE_DATA_DIR`; overridable via `CLINE_MCP_SETTINGS_PATH` env var). The CLI MCP doc's `~/.cline/mcp.json` is not a real path |

**Sources:**
[Configuration and storage](https://docs.cline.bot/getting-started/config) ·
[Rules](https://docs.cline.bot/customization/cline-rules) ·
[Skills](https://docs.cline.bot/customization/skills) ·
[Hooks](https://docs.cline.bot/customization/hooks) ·
[MCP](https://docs.cline.bot/mcp/mcp-overview)

---

## Continue — Continue Dev, Inc.

Home: `~/.continue/`

> **Status:** Discontinued. Continue.dev was acquired by Cursor; the `continuedev/continue` repo is read-only (final release v2.0.0). The table describes the final shipped behavior of local extension/CLI config.

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Config / agents** ◆ | Local blocks under `.continue/`; the CLI can load any YAML config with `--config <path>` | `~/.continue/config.yaml` — models, context, rules, prompts, docs, and MCP servers; `config.json` and `config.ts` are legacy |
| **Rules** ◆ | `.continue/rules/*.md` (recommended; YAML is also accepted); optional `globs` frontmatter | Rules can be embedded or referenced from `config.yaml` |
| **Skills** ○ | `.continue/skills/*/SKILL.md` or `.claude/skills/*/SKILL.md` — YAML frontmatter + Markdown body, retrieved via a `read_skill` tool; not in official docs, sourced to [PR #9353](https://github.com/continuedev/continue/pull/9353) | Not documented for global scope |
| **Prompts** ◆ | Local prompt blocks can be referenced from workspace configuration and invoked as slash commands | Declared or referenced under `prompts:` in `config.yaml` |
| **Models / tools** ◆ | `.continue/mcpServers/`; no dedicated `.continue/models/` directory documented — project-level models are set via `config.yaml` blocks instead; workspace blocks apply to all configs | `~/.continue/config.yaml`; reusable global blocks |
| **MCP** ◆ | `.continue/mcpServers/*.yaml`; MCP tools are available in Agent mode | `mcpServers:` in `~/.continue/config.yaml` |
| **Secrets / permissions** ◆ | `<repo>/.env` or `.continue/.env`; workspace secrets take precedence | `~/.continue/.env`; Continue CLI decisions in `~/.continue/permissions.yaml` |

**Sources:**
[Configuration](https://docs.continue.dev/cli/configuration) ·
[`config.yaml` reference](https://docs.continue.dev/reference) ·
[Models, rules, and tools](https://docs.continue.dev/guides/configuring-models-rules-tools) ·
[Rules](https://docs.continue.dev/customize/rules) ·
[MCP examples](https://docs.continue.dev/customize/deep-dives/mcp-examples)

---

## Devin — Cognition

Home: cloud-managed; configuration is primarily organization- and repository-scoped in the Devin web app

| Feature | Project (repo) | Global (user / organization) |
|---|---|---|
| **Instructions / knowledge** ◆ | A centralized specialized file such as root `AGENTS.md` is recommended; Devin also auto-pulls specialized files including `.rules`, `.mdc`, `.cursorrules`, `.windsurf`, `CLAUDE.md`, and `AGENTS.md` into repo knowledge | Knowledge is **deprecated** in favor of Skills in Plugins (Customize → Plugins). Legacy Knowledge/Enterprise Knowledge is managed at Settings → Resources → Knowledge; items can be pinned to no repo/one repo/all repos, per-user enabled/disabled, referenced via `!`-macros, or retrieved by triggers. New instructions should be written as Skills |
| **Skills** ◆ | `.agents/skills/*/SKILL.md` (recommended); also discovered: `.devin/skills/`, `.github/skills/`, `.claude/skills/`, `.cognition/skills/`, `.windsurf/skills/`; discovered automatically or invoked with `@skills:<name>`; only one skill can be active at a time — a new invocation replaces the prior one | — |
| **Playbooks** ◆ | — | Managed in the Devin web app; reusable organization- or enterprise-scoped prompts attached manually to sessions |
| **Environment** ◆ | Declarative environment blueprints are version-controlled YAML; `.envrc` can provide repo environment variables and should normally be gitignored | Environment snapshots, secrets, and repository access are managed in Devin settings |
| **MCP** ◆ | No committed repo-level MCP file documented | Customize → MCPs tab; plugin-based servers are opened via "Browse marketplace" on the Customize page, with legacy entries under the "legacy MCP marketplace"; custom stdio, SSE, and HTTP servers entered through a web form, gated by the "Manage MCP Servers" permission |

**Sources:**
[Knowledge](https://docs.devin.ai/product-guides/knowledge) ·
[Knowledge onboarding](https://docs.devin.ai/onboard-devin/knowledge-onboarding) ·
[Skills](https://docs.devin.ai/product-guides/skills) ·
[Environment configuration](https://docs.devin.ai/onboard-devin/environment) ·
[MCP Marketplace](https://docs.devin.ai/work-with-devin/mcp)

---

## Gemini CLI — Google

Home: `~/.gemini/`

> **Availability:** Gemini CLI serves only Gemini Code Assist Standard/Enterprise/Google Cloud licensees. Individual users use Antigravity CLI, which has its own section.

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | Hierarchical `GEMINI.md`; filename(s) configurable via `context.fileName`, enabling `AGENTS.md`. Supports `@file` imports | `~/.gemini/GEMINI.md` |
| **Settings** ◆ | `.gemini/settings.json`; project settings override user settings but are overridden by system policy, environment, and CLI arguments | `~/.gemini/settings.json`; system defaults (lowest precedence) at `/etc/gemini-cli/system-defaults.json` (Linux), `/Library/Application Support/GeminiCli/system-defaults.json` (macOS), `C:\ProgramData\gemini-cli\system-defaults.json` (Windows); system policy overrides (highest precedence, admin-managed) at `/etc/gemini-cli/settings.json`, `/Library/Application Support/GeminiCli/settings.json`, `C:\ProgramData\gemini-cli\settings.json` respectively — both relocatable via `GEMINI_CLI_SYSTEM_DEFAULTS_PATH` / `GEMINI_CLI_SYSTEM_SETTINGS_PATH` |
| **Skills** ◆ | `.gemini/skills/*/SKILL.md`, `.agents/skills/*/SKILL.md`; workspace skills require trust; cross-agent alias wins within a scope | `~/.gemini/skills/*/SKILL.md`, `~/.agents/skills/*/SKILL.md` |
| **Subagents** ◆ | `.gemini/agents/*.md` — Markdown + YAML; local or A2A remote agents; subagents cannot recursively call subagents | `~/.gemini/agents/*.md` |
| **Commands** ◆ | `.gemini/commands/*.toml`; project commands override user commands; subdirectories create `:` namespaces | `~/.gemini/commands/*.toml` |
| **Hooks** ◆ | `hooks` in `.gemini/settings.json`; extension hooks are lowest precedence | `hooks` object in `~/.gemini/settings.json` |
| **MCP** ◆ | `mcpServers` in `.gemini/settings.json`; agent definitions may contain isolated inline MCP servers | `mcpServers` in `~/.gemini/settings.json` |
| **Extensions** ◆ | Extensions can bundle context, commands, skills, hooks, themes, and MCP servers; workspace settings override conflicts | `~/.gemini/extensions/<name>/gemini-extension.json` |

**Sources:**
[Configuration](https://geminicli.com/docs/reference/configuration/) ·
[`GEMINI.md`](https://geminicli.com/docs/cli/gemini-md/) ·
[Agent Skills](https://geminicli.com/docs/cli/skills/) ·
[Subagents](https://geminicli.com/docs/core/subagents/) ·
[Custom commands](https://geminicli.com/docs/cli/custom-commands/) ·
[Hooks](https://geminicli.com/docs/hooks/) ·
[MCP](https://geminicli.com/docs/tools/mcp-server/) ·
[Extensions](https://geminicli.com/docs/extensions/reference/)

---

## Goose — Agentic AI Foundation

Home: `~/.config/goose/` (macOS/Linux) · `%APPDATA%\Block\goose\config\` (Windows)

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | Hierarchical `.goosehints` and `AGENTS.md` from cwd to git root and nested directories, controlled by default `CONTEXT_FILE_NAMES` (`["AGENTS.md", ".goosehints"]`); `CONTEXT_FILE_NAMES` adds alternatives | `~/.config/goose/.goosehints` is the only documented global hints file (no home-level `AGENTS.md` path is documented) |
| **Config** ◆ | Environment variables override global config; no separate project config file documented | `~/.config/goose/config.yaml`; `permission.yaml`, `secrets.yaml`, and `permissions/tool_permissions.json` alongside it |
| **Skills** ◆ | `.agents/skills/*/SKILL.md` (recommended standard), `.goose/skills/*/SKILL.md`, `.claude/skills/*/SKILL.md`; docs do not state an explicit precedence rule between project and global paths on name conflict | `~/.agents/skills/*/SKILL.md` (recommended standard); backward-compatible discovery also checks `~/.claude/skills/*/SKILL.md` and other platform-specific config dirs (`~/.config/goose/skills/` is not a documented path) |
| **Recipes / commands** ◆ | `.goose/recipes/*.{yaml,json}` | `~/.config/goose/recipes/*.{yaml,json}`; recipe-backed slash commands configured in `config.yaml` |
| **MCP / extensions** ◆ | Recipes can declare required extensions; no separate repo MCP file documented | `extensions:` in `~/.config/goose/config.yaml`; built-in and stdio MCP extensions |
| **Prompts / permissions** ◆ | Project hints and recipes provide committed behavior | `~/.config/goose/prompts/`, `permission.yaml`, and runtime permission decisions |

**Sources:**
[Docs home (goose-docs.ai)](https://goose-docs.ai/) ·
[Configuration files](https://github.com/aaif-goose/goose/blob/main/documentation/docs/guides/config-files.md) ·
[Project hints](https://github.com/aaif-goose/goose/blob/main/documentation/docs/guides/context-engineering/using-goosehints.md) ·
[Recipes](https://github.com/aaif-goose/goose/blob/main/documentation/docs/guides/recipes/storing-recipes.md) ·
[Goose repository](https://github.com/aaif-goose/goose)

---

## Hermes Agent — Nous Research

Home: `~/.hermes/` (profiles may use an alternate home)

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions / identity** ◆ | Additional context files (`.hermes.md`, `AGENTS.md`, `CLAUDE.md`, `.cursorrules`) are all injected into the system prompt together, subject to `context_file_max_chars` truncation — no documented first-match-wins precedence | `~/.hermes/SOUL.md` — primary identity (system-prompt slot #1) |
| **Config / secrets** ◆ | No separate project configuration file documented; working directory and backend are selected globally or per invocation | `~/.hermes/config.yaml`, `.env`, `auth.json`; precedence: CLI → config.yaml → .env → defaults |
| **Skills** ◆ | Plans created by the built-in `/plan` command (not a skill — docs state "plans are separate from skills") land under `.hermes/plans/`; project-local skills (`.hermes/skills/`, `.agents/skills/`) are discovered but require explicit `hermes skills trust` before loading — not a default (auto-load) path | `~/.hermes/skills/*/SKILL.md` — primary source of truth; external directories configurable |
| **Memory** ◆ | Cross-session search and sessions are stored under `~/.hermes/`; no committed project memory convention documented | `~/.hermes/memories/MEMORY.md` and `USER.md`; optional external memory providers configured in `config.yaml` |
| **MCP** ◆ | No separate project MCP file documented | `mcp_servers:` in `~/.hermes/config.yaml`; catalog installations are managed with `hermes mcp` |
| **Automation** ◆ | Workspace artifacts created by skills may live under `.hermes/` | `~/.hermes/cron/`, sessions, logs, messaging gateway config, and tool settings |

**Sources:**
[Configuration](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/) ·
[Context and identity](https://hermes-agent.nousresearch.com/docs/user-guide/configuration/#personality--soulmd) ·
[Skills](https://hermes-agent.nousresearch.com/docs/user-guide/features/skills/) ·
[Memory](https://hermes-agent.nousresearch.com/docs/user-guide/features/memory/) ·
[MCP](https://hermes-agent.nousresearch.com/docs/user-guide/features/mcp/)

---

## Kiro — Amazon Web Services

Home: `~/.kiro/` (override via `KIRO_HOME`)

> **Powers:** Plugins bundling MCP servers, skills, and knowledge, built on the "Agent Plugins" spec. A power is `plugin.json` + `skills/` + optional `mcp.json` + optional `dev.kiro/`. `/config` surfaces Powers alongside Steering/Skills/Hooks/MCP/Agents.

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions / steering** ◆ | `.kiro/steering/*.md`; `AGENTS.md` is discovered anywhere in the workspace tree, not just root; steering modes include always, automatic, file-match, and manual | `~/.kiro/steering/*.md`; global `AGENTS.md` is supported there |
| **Settings** ◆ | Project configuration is stored under `.kiro/`; no project `cli.json` documented | `~/.kiro/settings/cli.json` |
| **Skills** ◆ | `.kiro/skills/*/SKILL.md`; workspace skill wins on name conflict; Agent Skills standard | `~/.kiro/skills/*/SKILL.md` |
| **Custom agents** ◆ | `.kiro/agents/`; agent configuration can embed MCP servers, hooks, tools, permissions, and steering resources | `~/.kiro/agents/` |
| **Prompts** ◆ | `.kiro/prompts/`; project prompts override global prompts | `~/.kiro/prompts/` |
| **MCP** ◆ | `.kiro/settings/mcp.json`; resolution: Agent > Project > Global | `~/.kiro/settings/mcp.json` |
| **Specs / hooks** ◆ | `.kiro/specs/` and `.kiro/hooks/`; IDE and CLI support lifecycle/tool hooks, with the CLI agent schema also allowing inline hooks | `~/.kiro/hooks/` — global hooks (CLI v3 preview): define once, apply across all workspaces; hooks may also be embedded in custom-agent configuration |
| **Powers** ◆ | Not supported at project scope | `~/.kiro/powers/` — plugins bundling MCP servers, skills, and knowledge (see callout above) |

**Sources:**
[CLI configuration](https://kiro.dev/docs/configuration/) ·
[Agent configuration](https://kiro.dev/docs/custom-agents/configuration-reference/) ·
[Agent Skills](https://kiro.dev/docs/skills/) ·
[Steering](https://kiro.dev/docs/steering/) ·
[Getting started](https://kiro.dev/docs/getting-started/first-project/) ·
[Changelog: global hooks (v2.13)](https://kiro.dev/changelog/cli/2-13/) ·
[Changelog: AGENTS.md workspace-wide (v2.18)](https://kiro.dev/changelog/cli/2-18/) ·
[Powers](https://kiro.dev/docs/powers/)

---

## OpenHands — OpenHands / All Hands AI

Home: `~/.openhands/` for local state; cloud settings are managed in the UI

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions** ◆ | Root `AGENTS.md` (recommended); `GEMINI.md` and `CLAUDE.md` supported as model-specific permanent context | User skills under `~/.agents/skills/` |
| **Settings** ◆ | `.openhands/setup.sh` runs when work begins; `.openhands/hooks.json` customizes lifecycle/tool execution | CLI: `~/.openhands/agent_settings.json` (LLM/agent config), `cli_config.json` (CLI/TUI preferences); `settings.json` is legacy pre-1.0 naming — reconfiguration is required on upgrade. State root controlled by `OH_PERSISTENCE_DIR` |
| **Skills** ◆ | `.agents/skills/*/SKILL.md` (recommended), including legacy `.md` skills; deprecated `.openhands/skills/` and `.openhands/microagents/` | `~/.agents/skills/*/SKILL.md`; deprecated `~/.openhands/skills/` and `microagents/` fallbacks |
| **Agents** ◆ | `.agents/agents/*.md`, fallback `.openhands/agents/*.md`; project definitions take precedence | `~/.agents/agents/*.md`, fallback `~/.openhands/agents/*.md` |
| **MCP** ◆ | No separate committed project MCP filename documented | `~/.openhands/mcp.json` for CLI; cloud/local GUI settings through the UI |
| **History / persistence** ◆ | Repository setup and hooks are committed under `.openhands/` | `~/.openhands/conversations/`; `OH_PERSISTENCE_DIR` changes the state root |

**Sources:**
[CLI installation and settings](https://docs.openhands.dev/openhands/usage/cli/installation) ·
[CLI command reference](https://docs.openhands.dev/openhands/usage/cli/command-reference) ·
[Skills overview](https://docs.openhands.dev/overview/skills) ·
[File-based agents](https://docs.openhands.dev/sdk/guides/agent-file-based) ·
[Repository customization](https://docs.openhands.dev/openhands/usage/customization/repository) ·
[MCP](https://docs.openhands.dev/openhands/usage/cli/mcp-servers) ·
[Configuration](https://docs.openhands.dev/openhands/usage/advanced/configuration-options)

---

## Windsurf / Devin Desktop — Cognition

Home: `~/.codeium/windsurf/` (legacy Codeium/Windsurf paths; still read by the legacy Cascade agent bundled in Devin Desktop, not by Devin Local)

> **Rebrand:** Windsurf is now **Devin Desktop**. Its legacy local agent, Cascade, reads the legacy `~/.codeium/windsurf/` and `.windsurf/` paths; the default local agent, **Devin Local**, reads the `.devin/` and `~/.config/devin/` paths. Devin Desktop also acts as a command center for Devin Cloud sessions (see the Devin section above).

| Feature | Project (repo) | Global (user) |
|---|---|---|
| **Instructions / rules** ◆ | `.devin/rules/*.md` (preferred, discovered recursively), `.windsurf/rules/*.md` fallback, legacy `.windsurfrules`; hierarchical `AGENTS.md` is supported | `~/.codeium/windsurf/memories/global_rules.md`; system rules use OS-level `Devin/rules/` with `Windsurf/rules/` fallback |
| **Memory** ◆ | Memories are local and not committed; durable team context should use rules or `AGENTS.md` | Workspace-scoped generated memories are stored under `~/.codeium/windsurf/memories/` |
| **Skills** ◆ | `.devin/skills/*/SKILL.md` (preferred), `.windsurf/skills/*/SKILL.md` (legacy fallback), `.agents/skills/*/SKILL.md`; optional Claude-compatible discovery | `~/.codeium/windsurf/skills/*/SKILL.md`, `~/.config/devin/skills/*/SKILL.md` (shared with Devin CLI), `~/.agents/skills/*/SKILL.md` |
| **Workflows** ◆ | `.devin/workflows/*.md` (preferred), `.windsurf/workflows/*.md` (fallback, used only if the workspace hasn't migrated); manual `/name` invocation; discovered through subdirectories and parents to git root. Devin Local doesn't support workflows — migrate them to skills | `~/.codeium/windsurf/global_workflows/*.md` |
| **Hooks** ◆ | `.devin/hooks.json` (preferred); `.windsurf/hooks.json` used only if `.devin/hooks.json` is missing or defines no hooks; system → user → workspace merge order (Enterprise cloud-dashboard hooks load before all file levels); pre-hooks can block with exit code 2 | `~/.codeium/windsurf/hooks.json`; JetBrains plugin: `~/.codeium/hooks.json` |
| **MCP** ◆ | `.devin/mcp_config.json` (team-shared, committed) and `.devin/mcp_config.local.json` (personal, gitignored). `docs.devin.ai/cli/extensibility/configuration` is authoritative for MCP-specific paths | `~/.codeium/windsurf/mcp_config.json` (Cascade path, still read); Devin Local user scope: `~/.config/devin/mcp_config.json` (Windows `%APPDATA%\devin\mcp_config.json`), with `mcpServers` entries in `~/.config/devin/config.json` auto-migrated on startup; MCP Marketplace and enterprise allowlists |

**Sources:**
[Memories and rules](https://docs.devin.ai/desktop/cascade/memories) ·
[Skills](https://docs.devin.ai/desktop/cascade/skills) ·
[Workflows](https://docs.devin.ai/desktop/cascade/workflows) ·
[Hooks](https://docs.devin.ai/desktop/cascade/hooks) ·
[MCP](https://docs.devin.ai/desktop/cascade/mcp) ·
[AGENTS.md](https://docs.devin.ai/desktop/cascade/agents-md) ·
[Devin Local](https://docs.devin.ai/desktop/devin-local) ·
[Devin Desktop FAQ](https://docs.devin.ai/desktop/devin-desktop-faq) ·
[CLI extensibility / MCP config (Local 3.6)](https://docs.devin.ai/cli/extensibility/configuration) ·
[CLI changelog (stable)](https://docs.devin.ai/cli/changelog/stable)

---

## Notes

¹ VS 2026 and VS Code discover `.github/skills/`, `.claude/skills/`, and `.agents/skills/` at project scope; Copilot CLI discovers the same three project paths. User-scope: VS Code and VS 2026 discover `~/.copilot/skills/`, `~/.claude/skills/`, and `~/.agents/skills/`; Copilot CLI discovers only `~/.copilot/skills/` and `~/.agents/skills/` (not `~/.claude/skills/`). See [VS 2026 April update](https://github.blog/changelog/2026-04-30-github-copilot-in-visual-studio-april-update/).

² Cursor's official docs now label `.claude/skills/`, `~/.claude/skills/`, `.codex/skills/`, and `~/.codex/skills/` as legacy backward-compatibility paths. Primary locations are `.cursor/skills/` and `.agents/skills/` (project) and `~/.cursor/skills/` and `~/.agents/skills/` (user). See [Cursor agent skills docs](https://cursor.com/docs/context/skills).

³ OpenCode Claude compat can be disabled granularly: `OPENCODE_DISABLE_CLAUDE_CODE_PROMPT=1` (disables `~/.claude/CLAUDE.md` fallback), `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS=1` (disables `.claude/skills/` discovery), `OPENCODE_DISABLE_CLAUDE_CODE=1` (all `.claude/` support). See [OpenCode rules docs](https://opencode.ai/docs/rules/).

⁴ In Claude Code, slash commands and skills have converged — a skill `deploy` and a command file `deploy.md` both produce `/deploy`. Existing `.claude/commands/` files keep working unchanged.

### Cross-agent standards

- **`.agents/skills/`** — The cross-agent convention from the [agentskills.io client implementation guide](https://agentskills.io/client-implementation/adding-skills-support), described there as "a widely-adopted convention for cross-client skill sharing" that makes skills "automatically visible" across compliant clients. The guide instructs all compliant clients to scan both their own native directory and `.agents/skills/`. Scanned by Codex, Copilot, OpenCode, Gemini CLI, Antigravity CLI, Cursor, Vibe, and Pi among others. (A single canonical skill tree shared via symlinks is a natural consequence of this convention, though not stated verbatim by the spec.)

- **`AGENTS.md`** — Open standard ([agents.md](https://agents.md)), stewarded by the **Agentic AI Foundation (AAIF)** under the Linux Foundation. Supported by Codex, Jules, Factory, Aider, goose, OpenCode, Zed, Warp, VS Code, Devin, Junie, Amp, Cursor, RooCode, Gemini CLI, Antigravity, Kilo Code, GitHub Copilot, Windsurf, Augment Code, and others. (Pi and Mistral Vibe also support AGENTS.md.)

- **`SKILL.md`** — [Agent Skills spec](https://agentskills.io/specification). There is no top-level `version:` frontmatter field; skill package versioning goes under the `metadata:` map (e.g., `metadata:\n  version: "1.0"`). Structure: `skill-name/{SKILL.md, scripts/, references/, assets/}`. The `allowed-tools` frontmatter field is experimental. Spec repo: [github.com/agentskills/agentskills](https://github.com/agentskills/agentskills). Client list: [agentskills.io/clients](https://agentskills.io/clients).

- **Subagent format split:** Claude Code, Copilot (`.agent.md`), OpenCode, and Cursor define agents as Markdown + YAML frontmatter. Codex uses Markdown+YAML for Agent Skills; TOML is used only for Codex's own internal subagent profile definitions (`.codex/agents/*.toml`). Vibe uses TOML for its internal subagent config profiles and Markdown+YAML for SKILL.md skills.

All paths use Unix notation; `~` = `%USERPROFILE%` on Windows. `$CODEX_HOME`, `$VIBE_HOME` override their respective defaults. `PI_CODING_AGENT_DIR` overrides `~/.pi/agent/`.

---

*Last verified: 20261009*
