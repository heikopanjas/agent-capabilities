# Coding Agent Models

Which models each coding agent lets you pick, and the exact ID to select each one — October 2026

A model's name is written the same way in every agent's table. Agents that accept any model from any configured provider list only the models they ship as built-in, default or recommended; the `Providers:` and `ID format:` lines say what else works.

Confidence markers: ★ spec / stable · ◆ documented current · ○ observed (community, changelog, source code or CLI output; may be volatile).

---

## Claude Code — Anthropic

Default: `default` resolves to Claude Opus 5.5 on Pro, Max, Team, Enterprise, the Anthropic API, Claude Platform on AWS, Amazon Bedrock and Google Cloud's Agent Platform; Claude Sonnet 4.5 on Microsoft Foundry
Select: `--model <alias|id>`, `/model`, `model` in `~/.claude/settings.json`, `ANTHROPIC_MODEL`, `ANTHROPIC_DEFAULT_MODEL`, `model:` in subagent frontmatter; `opusplan` uses `opus` in plan mode and `sonnet` otherwise
Providers: Anthropic API, Claude Platform on AWS, Amazon Bedrock, Google Cloud's Agent Platform, Microsoft Foundry, LLM gateways via `ANTHROPIC_BASE_URL`
ID format: Anthropic model ID (`claude-opus-5-5`); Bedrock takes an inference profile ID or ARN, Foundry a deployment name, Agent Platform a version name. A `[1m]` suffix requests the 1M context window. Aliases resolve per provider (on Bedrock and Agent Platform `sonnet` is Claude Sonnet 4.5 and `haiku` is Claude Haiku 4.5)

| Model | ID | Aliases |
|---|---|---|
| **Claude Fable 5.1** ◆ | `claude-fable-5-1` | `fable`, `best`, `fable[1m]` |
| **Claude Fable 5** ◆ | `claude-fable-5` | `claude-fable-5[1m]` |
| **Claude Opus 5.5** ◆ | `claude-opus-5-5` | `opus`, `opus[1m]` |
| **Claude Opus 5** ◆ | `claude-opus-5` | — |
| **Claude Opus 4.8** ◆ | `claude-opus-4-8` | `claude-opus-4-8[1m]` |
| **Claude Opus 4.7** ◆ | `claude-opus-4-7` | — |
| **Claude Opus 4.6** ◆ | `claude-opus-4-6` | `claude-opus-4-6[1m]` |
| **Claude Opus 4.5** ◆ | `claude-opus-4-5-20251101` | `claude-opus-4-5` |
| **Claude Sonnet 5.5** ◆ | `claude-sonnet-5-5` | `sonnet`, `sonnet[1m]` |
| **Claude Sonnet 5** ◆ | `claude-sonnet-5` | — |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4-6` | `claude-sonnet-4-6[1m]` |
| **Claude Sonnet 4.5** ◆ | `claude-sonnet-4-5` | `claude-sonnet-4-5-20250929` |
| **Claude Haiku 5.5** ◆ | `claude-haiku-5-5` | `haiku` |
| **Claude Haiku 4.5** ◆ | `claude-haiku-4-5` | `claude-haiku-4-5-20251001` |

**Sources:**
[Model configuration](https://code.claude.com/docs/en/model-config) ·
[Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) ·
[Model deprecations](https://platform.claude.com/docs/en/about-claude/model-deprecations)

---

## Codex CLI — OpenAI

Default: none named; when `model` is unset Codex uses a recommended model for the account (the docs recommend `gpt-6.1-sol`)
Select: `--model <id>` / `-m <id>`, `codex exec -m <id>`, `/model`, `model` in `~/.codex/config.toml`; effort via `model_reasoning_effort` (`low`, `medium`, `high`, `xhigh`, `max`, `ultra`, depending on model) or `/model` → More reasoning
Providers: `openai` (default), `ollama`, `lmstudio`, `amazon-bedrock`; custom providers under `[model_providers.<id>]` must serve the Responses API. GPT-5.5 works only with API-key sign-in
ID format: bare model ID; the provider is set separately with `model_provider`

| Model | ID | Aliases |
|---|---|---|
| **GPT-6 Astra** ◆ | `gpt-6-astra` | — |
| **GPT-6.1 Sol** ◆ | `gpt-6.1-sol` | — |
| **GPT-6 Sol** ◆ | `gpt-6-sol` | — |
| **GPT-6 Luna** ◆ | `gpt-6-luna` | — |
| **GPT-5.6 Sol** ○ | `gpt-5.6-sol` | — |
| **GPT-5.6 Terra** ○ | `gpt-5.6-terra` | — |
| **GPT-5.6 Luna** ○ | `gpt-5.6-luna` | — |
| **GPT-5.5** ◆ | `gpt-5.5` | — |

**Sources:**
[Models](https://learn.chatgpt.com/docs/models) ·
[Config reference](https://learn.chatgpt.com/docs/config-file/config-reference) ·
[Pricing](https://learn.chatgpt.com/docs/pricing) ·
[GPT-6 Astra announcement](https://openai.com/index/gpt-6-astra-next-generation-work/) ·
[Community report naming `gpt-5.6-sol`](https://community.openai.com/t/the-gpt-5-6-sol-model-is-not-supported-when-using-codex-with-a-chatgpt-account/1387833)

---

## GitHub Copilot — GitHub / Microsoft

Default: `claude-sonnet-5.5` in Copilot CLI; `auto` picks a model automatically (GPT-5.3-Codex is the fallback when nothing else is available)
Select: `--model <id>`, `COPILOT_MODEL`, `/model`, `model` in `~/.copilot/settings.json`, `model:` in `.agent.md` frontmatter, the model picker in IDEs and on GitHub.com; effort via `--effort` / `--reasoning-effort` or `effortLevel`
Providers: GitHub-hosted models from OpenAI, Anthropic, Google, Microsoft, Moonshot AI and xAI; BYOK providers via `COPILOT_PROVIDERS_CONFIG` (`~/.copilot/providers.json`). GPT-5.4 nano is only in the Codex extension for VS Code on Copilot Pro+; Claude Sonnet 4.6 only on annual Pro and Pro+ plans; Kimi K3 and the Claude Fable models start disabled for Business and Enterprise
ID format: lowercase ID with dotted versions (`claude-opus-5.5`); IDE pickers show the display name. Run `/model` in the CLI for the full list of IDs

| Model | ID | Aliases |
|---|---|---|
| **GPT-6 Astra** ◆ | `gpt-6-astra` | — |
| **GPT-6.1 Sol** ◆ | `gpt-6.1-sol` | — |
| **GPT-6 Sol** ○ | `GPT-6 Sol` | — |
| **GPT-6 Luna** ◆ | `gpt-6-luna` | — |
| **GPT-5.6 Sol** ○ | `GPT-5.6 Sol` | — |
| **GPT-5.6 Terra** ○ | `GPT-5.6 Terra` | — |
| **GPT-5.6 Luna** ◆ | `gpt-5.6-luna` | — |
| **GPT-5.4 nano** ○ | `GPT-5.4 nano` | — |
| **GPT-5.3-Codex** ◆ | `gpt-5.3-codex` | — |
| **Claude Fable 5.1** ○ | `Claude Fable 5.1` | — |
| **Claude Fable 5** ○ | `Claude Fable 5` | — |
| **Claude Opus 5.5** ◆ | `claude-opus-5.5` | — |
| **Claude Opus 5** ○ | `Claude Opus 5` | — |
| **Claude Opus 4.8** ○ | `Claude Opus 4.8` | `Claude Opus 4.8 (fast mode) (preview)` |
| **Claude Sonnet 5.5** ◆ | `claude-sonnet-5.5` | — |
| **Claude Sonnet 5** ○ | `Claude Sonnet 5` | — |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4.6` | — |
| **Claude Haiku 5.5** ◆ | `claude-haiku-5.5` | — |
| **Claude Haiku 4.5** ◆ | `claude-haiku-4.5` | — |
| **Gemini 4 Argon** ○ | `Gemini 4 Argon` | — |
| **Gemini 3.8 Flash** ◆ | `gemini-3.8-flash` | — |
| **MAI-Code-1.1-Flash** ◆ | `MAI-Code-1.1-Flash` | — |
| **Kimi K3** ○ | `Kimi K3` | — |
| **Grok 4.7** ○ | `Grok 4.7` | — |
| **Grok 4.6** ○ | `Grok 4.6` | — |
| **Grok 4.5** ○ | `Grok 4.5` | — |

**Sources:**
[Supported AI models](https://docs.github.com/en/copilot/reference/ai-models/supported-models) ·
[CLI command reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-command-reference) ·
[CLI programmatic reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-programmatic-reference) ·
[CLI configuration directory](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-config-dir-reference) ·
[Custom agents config ref](https://docs.github.com/en/copilot/reference/custom-agents-configuration)

---

## Cursor — Anysphere

Default: none named; `auto` selects Auto (Cost, Balance or Intelligence routing), and team admins can impose Auto as the default
Select: model picker in the editor, `agent --model <id>`, `/model [filter]` in the CLI, `model` in `~/.cursor/cli-config.json`, `model:` in subagent frontmatter (default `inherit`); `agent models` or `--list-models` lists IDs for the account
Providers: Cursor-served models from Cursor, Anthropic, OpenAI, Google, Meta, Moonshot and Z.ai; third-party models need a Premium plan or above
ID format: Cursor's own ID per model (`claude-opus-5-5`, `gpt-5.6-sol`, `grok-4.7`); effort and speed variants are suffixes (`-high`, `-fast`). Many older models are hidden by default and must be enabled in Settings → Models. Menu labels for older Anthropic models put the version first (`Claude 4.6 Opus`)

| Model | ID | Aliases |
|---|---|---|
| **Composer 2.5** ◆ | `composer-2.5` | `Composer 2.5 (Fast)` |
| **Grok 4.7** ◆ | `grok-4.7` | `Grok 4.7 (Fast)`, `Grok 4.7 500k`, `Grok 4.7 500k (Fast)` |
| **Grok 4.6** ◆ | `grok-4.6` | `Grok 4.6 (Fast)` |
| **Grok 4.5** ◆ | `grok-4.5` | `Grok 4.5 (Fast)` |
| **Claude Fable 5.1** ◆ | `claude-fable-5-1` | — |
| **Claude Fable 5** ◆ | `claude-fable-5` | — |
| **Claude Opus 5.5** ◆ | `claude-opus-5-5` | `claude-opus-5-5-fast` |
| **Claude Opus 5** ◆ | `claude-opus-5` | `claude-opus-5-fast` |
| **Claude Opus 4.8** ◆ | `claude-opus-4-8` | `claude-opus-4-8-fast` |
| **Claude Opus 4.7** ◆ | `claude-opus-4-7` | `Claude Opus 4.7 (fast mode)` |
| **Claude Opus 4.6** ◆ | `claude-4-6-opus` | — |
| **Claude Opus 4.5** ◆ | `claude-4-5-opus` | — |
| **Claude Sonnet 5.5** ◆ | `claude-sonnet-5-5` | — |
| **Claude Sonnet 5** ◆ | `claude-sonnet-5` | — |
| **Claude Sonnet 4.6** ◆ | `claude-4-6-sonnet` | — |
| **Claude Sonnet 4.5** ◆ | `claude-4-5-sonnet` | — |
| **Claude Sonnet 4** ◆ | `claude-4-sonnet` | `Claude 4 Sonnet 1M` |
| **Claude Haiku 5.5** ◆ | `claude-haiku-5-5` | — |
| **Claude Haiku 4.5** ◆ | `claude-4-5-haiku` | — |
| **GPT-5.6 Sol** ◆ | `gpt-5.6-sol` | — |
| **GPT-5.6 Terra** ◆ | `gpt-5.6-terra` | — |
| **GPT-5.6 Luna** ◆ | `gpt-5.6-luna` | — |
| **GPT-5.5** ◆ | `gpt-5.5` | — |
| **GPT-5.4** ◆ | `gpt-5.4` | — |
| **GPT-5.4 mini** ◆ | `gpt-5.4-mini` | — |
| **GPT-5.4 nano** ◆ | `gpt-5.4-nano` | — |
| **GPT-5.3-Codex** ◆ | `gpt-5.3-codex` | `gpt-5.3-codex-high` |
| **GPT-5.2** ◆ | `gpt-5.2` | `gpt-5.2-high` |
| **GPT-5.2-Codex** ◆ | `gpt-5.2-codex` | — |
| **GPT-5.1-Codex** ◆ | `gpt-5.1-codex` | — |
| **GPT-5.1-Codex-Max** ◆ | `gpt-5.1-codex-max` | — |
| **GPT-5.1-Codex-Mini** ◆ | `gpt-5.1-codex-mini` | — |
| **GPT-5** ◆ | `gpt-5` | `gpt-5-high`, `gpt-5-fast`, `gpt-5-high-fast`, `gpt-5-low-fast` |
| **GPT-5-Codex** ◆ | `gpt-5-codex` | — |
| **GPT-5 mini** ◆ | `gpt-5-mini` | — |
| **Gemini 4 Argon** ◆ | `gemini-4-argon` | — |
| **Gemini 3.8 Flash** ◆ | `gemini-3.8-flash` | — |
| **Gemini 3.7 Flash** ◆ | `gemini-3.7-flash` | — |
| **Gemini 3.6 Flash** ◆ | `gemini-3.6-flash` | — |
| **Gemini 3.5 Flash** ◆ | `gemini-3.5-flash` | — |
| **Gemini 3.1 Pro** ◆ | `gemini-3.1-pro` | — |
| **Gemini 3 Pro** ◆ | `gemini-3-pro` | — |
| **Gemini 3 Pro Image** ◆ | `gemini-3-pro-image-preview` | — |
| **Gemini 3 Flash** ◆ | `gemini-3-flash` | — |
| **Gemini 2.5 Flash** ◆ | `gemini-2.5-flash` | — |
| **Muse Wonder 1.0** ◆ | `muse-wonder-1.0` | — |
| **Muse Spark 1.3** ◆ | `muse-spark-1.3` | — |
| **Kimi K3** ◆ | `kimi-k3` | — |
| **Kimi K2.7 Code** ◆ | `kimi-k2.7-code` | — |
| **GLM-5.3** ◆ | `glm-5.3` | — |
| **GLM-5.3-Flash** ◆ | `glm-5.3-flash` | — |
| **GLM-5.2** ◆ | `glm-5.2` | — |

**Sources:**
[Models & Pricing](https://cursor.com/docs/models-and-pricing) ·
[Models](https://cursor.com/docs/models) ·
[Claude Opus 5.5 model page](https://cursor.com/docs/models/claude-opus-5-5) ·
[CLI parameters](https://cursor.com/docs/cli/reference/parameters) ·
[CLI configuration](https://cursor.com/docs/cli/reference/configuration) ·
[CLI slash commands](https://cursor.com/docs/cli/reference/slash-commands) ·
[Cursor Router](https://cursor.com/docs/cursor-router)

---

## Mistral Vibe — Mistral AI

Default: `mistral-medium-3.5` (the only built-in model; admin config or experiments can route a different default)
Select: `/model`, `active_model` in `.vibe/config.toml` or `~/.vibe/config.toml`, `VIBE_ACTIVE_MODEL`, `active_model` in an agent profile (`--agent`)
Providers: Mistral API (`mistral`), llama.cpp server (`llamacpp`, local); others via `[[providers]]` blocks
ID format: `active_model` takes the `alias` of a `[[models]]` entry; `name` holds the provider's model ID

| Model | ID | Aliases |
|---|---|---|
| **Mistral Medium 3.5** ◆ | `mistral-medium-3.5` | — |

**Sources:**
[Configuration](https://docs.mistral.ai/vibe/code/cli/configuration) ·
[Configuration reference](https://docs.mistral.ai/vibe/code/cli/configuration-reference) ·
[GitHub: mistralai/mistral-vibe](https://github.com/mistralai/mistral-vibe)

---

## OpenCode — Anomaly (open source)

Default: none fixed; uses the last-used model, else the first available model by an internal priority list
Select: `--model <provider/model>` (`-m`), `/models` in the TUI, `model` in `opencode.json`, `model:` in agent frontmatter; `--variant <name>` or the `variant_cycle` keybind picks a reasoning variant
Providers: 75+ via the AI SDK and Models.dev, including OpenCode Zen (Console), OpenCode Go, Anthropic, OpenAI, GitHub Copilot, Amazon Bedrock, Google Vertex AI, Azure, OpenRouter, Ollama Cloud and local OpenAI-compatible servers
ID format: `<provider_id>/<model_id>`; the rows below are the curated OpenCode Zen list (`opencode/…`) and OpenCode Go list (`opencode-go/…`)

| Model | ID | Aliases |
|---|---|---|
| **GPT-6 Astra** ◆ | `opencode/gpt-6-astra` | — |
| **GPT-6 Sol** ◆ | `opencode/gpt-6-sol` | — |
| **GPT-6.1 Sol** ◆ | `opencode/gpt-6.1-sol` | — |
| **GPT-6 Luna** ◆ | `opencode/gpt-6-luna` | `opencode-go/gpt-6-luna` |
| **GPT-5.6 Sol** ◆ | `opencode/gpt-5.6-sol` | — |
| **GPT-5.6 Terra** ◆ | `opencode/gpt-5.6-terra` | — |
| **GPT-5.6 Luna** ◆ | `opencode/gpt-5.6-luna` | `opencode-go/gpt-5.6-luna` |
| **GPT-5.5** ◆ | `opencode/gpt-5.5` | — |
| **GPT-5.5 Pro** ◆ | `opencode/gpt-5.5-pro` | — |
| **GPT-5.4** ◆ | `opencode/gpt-5.4` | — |
| **GPT-5.4 Pro** ◆ | `opencode/gpt-5.4-pro` | — |
| **GPT-5.4 mini** ◆ | `opencode/gpt-5.4-mini` | — |
| **GPT-5.4 nano** ◆ | `opencode/gpt-5.4-nano` | — |
| **GPT-5.3-Codex** ◆ | `opencode/gpt-5.3-codex` | — |
| **GPT-5.3-Codex-Spark** ◆ | `opencode/gpt-5.3-codex-spark` | — |
| **GPT-5.2** ◆ | `opencode/gpt-5.2` | — |
| **GPT-5.1** ◆ | `opencode/gpt-5.1` | — |
| **GPT-5** ◆ | `opencode/gpt-5` | — |
| **GPT-5 nano** ◆ | `opencode/gpt-5-nano` | — |
| **Claude Fable 5.1** ◆ | `opencode/claude-fable-5-1` | — |
| **Claude Fable 5** ◆ | `opencode/claude-fable-5` | — |
| **Claude Opus 5.5** ◆ | `opencode/claude-opus-5-5` | — |
| **Claude Opus 5** ◆ | `opencode/claude-opus-5` | — |
| **Claude Opus 4.8** ◆ | `opencode/claude-opus-4-8` | — |
| **Claude Opus 4.7** ◆ | `opencode/claude-opus-4-7` | — |
| **Claude Opus 4.6** ◆ | `opencode/claude-opus-4-6` | — |
| **Claude Opus 4.5** ◆ | `opencode/claude-opus-4-5` | — |
| **Claude Sonnet 5.5** ◆ | `opencode/claude-sonnet-5-5` | — |
| **Claude Sonnet 5** ◆ | `opencode/claude-sonnet-5` | — |
| **Claude Sonnet 4.6** ◆ | `opencode/claude-sonnet-4-6` | — |
| **Claude Sonnet 4.5** ◆ | `opencode/claude-sonnet-4-5` | — |
| **Claude Haiku 5.5** ◆ | `opencode/claude-haiku-5-5` | `opencode-go/claude-haiku-5-5` |
| **Claude Haiku 4.5** ◆ | `opencode/claude-haiku-4-5` | — |
| **Gemini 4 Argon** ◆ | `opencode/gemini-4-argon` | `opencode-go/gemini-4-argon` |
| **Gemini 3.8 Flash** ◆ | `opencode/gemini-3.8-flash` | — |
| **Gemini 3.7 Flash** ◆ | `opencode/gemini-3.7-flash` | — |
| **Gemini 3.6 Flash** ◆ | `opencode/gemini-3.6-flash` | — |
| **Gemini 3.5 Flash** ◆ | `opencode/gemini-3.5-flash` | — |
| **Gemini 3.5 Flash-Lite** ◆ | `opencode/gemini-3.5-flash-lite` | — |
| **Gemini 3.1 Pro** ◆ | `opencode/gemini-3.1-pro` | — |
| **Gemini 3 Flash** ◆ | `opencode/gemini-3-flash` | — |
| **Grok 4.7** ◆ | `opencode/grok-4.7` | `opencode-go/grok-4.7` |
| **Grok 4.6** ◆ | `opencode/grok-4.6` | — |
| **Grok 4.5** ◆ | `opencode/grok-4.5` | — |
| **Grok Build 0.1** ◆ | `opencode/grok-build-0.1` | — |
| **Muse Wonder 1.0** ◆ | `opencode/muse-wonder-1.0` | — |
| **Muse Spark 1.3** ◆ | `opencode/muse-spark-1.3` | `opencode-go/muse-spark-1.3-contributor` |
| **Muse Spark 1.2** ◆ | `opencode/muse-spark-1.2` | `opencode-go/muse-spark-1.2-contributor` |
| **Qwen3.8-Max** ◆ | `opencode/qwen3.8-max` | `opencode-go/qwen3.8-max` |
| **Qwen3.8-Flash** ◆ | `opencode/qwen3.8-flash` | `opencode-go/qwen3.8-flash` |
| **Qwen3.7-Plus** ◆ | `opencode-go/qwen3.7-plus` | — |
| **Qwen3.6-Plus** ◆ | `opencode/qwen3.6-plus` | — |
| **Qwen3.5-Plus** ◆ | `opencode/qwen3.5-plus` | — |
| **DeepSeek-V4.1-Flash** ◆ | `opencode/deepseek-v4.1-flash` | `opencode-go/deepseek-v4.1-flash`, `opencode/deepseek-v4.1-flash-free` |
| **DeepSeek-V4-Pro** ◆ | `opencode/deepseek-v4-pro` | `opencode-go/deepseek-v4-pro` |
| **MiniMax-M3** ◆ | `opencode/minimax-m3` | `opencode-go/minimax-m3` |
| **MiniMax-M3.1-Flash** ◆ | `opencode-go/minimax-m3.1-flash` | — |
| **MiniMax-M2.7** ◆ | `opencode/minimax-m2.7` | — |
| **GLM-5.3-Flash** ◆ | `opencode/glm-5.3-flash` | `opencode-go/glm-5.3-flash`, `opencode/glm-5.3-flash-free` |
| **GLM-5.3** ◆ | `opencode/glm-5.3` | `opencode-go/glm-5.3` |
| **GLM-5.2** ◆ | `opencode/glm-5.2` | `opencode-go/glm-5.2` |
| **GLM-5.1** ◆ | `opencode/glm-5.1` | — |
| **Kimi K3.1 Pro** ◆ | `opencode-go/kimi-k3.1-pro` | — |
| **Kimi K3** ◆ | `opencode/kimi-k3` | `opencode-go/kimi-k3` |
| **Kimi K2.7 Code** ◆ | `opencode/kimi-k2.7-code` | `opencode-go/kimi-k2.7-code` |
| **Kimi K2.6** ◆ | `opencode/kimi-k2.6` | — |
| **Mistral Large 4** ◆ | `opencode/mistral-large-4` | — |
| **Jev 1.13** ◆ | `opencode/jev-1.13` | `opencode/jev-1.13-free` |
| **LongCat-2.0** ◆ | `opencode-go/longcat-2.0` | — |
| **MiMo-V2.6-Pro** ◆ | `opencode-go/mimo-v2.6-pro` | — |
| **MiMo-V2.6-Flash** ◆ | `opencode-go/mimo-v2.6-flash` | `opencode/mimo-v2.6-flash-free` |
| **MiMo-V2.5-Pro** ◆ | `opencode-go/mimo-v2.5-pro` | — |
| **MiMo-V2.5** ◆ | `opencode-go/mimo-v2.5` | — |
| **Hy4 preview** ◆ | `opencode-go/hy4-preview` | — |
| **Hy3** ◆ | `opencode-go/hy3` | — |
| **Step 5 Preview** ◆ | `opencode-go/step-5-preview` | — |
| **Big Pickle** ◆ | `opencode/big-pickle` | — |
| **Beam 1.0** ◆ | `opencode/beam-free` | `opencode-go/beam-free` |
| **Flint 40B** ◆ | `opencode/flint-40b-free` | — |
| **Nemotron 3 Ultra** ◆ | `opencode/nemotron-3-ultra-free` | — |
| **Nemotron 3.5 Lightning** ◆ | `opencode/nemotron-3.5-lightning-free` | — |
| **Nemotron 3.5 Super VL** ◆ | `opencode/nemotron-3.5-super-vl-free` | — |

**Sources:**
[Models](https://opencode.ai/docs/models/) ·
[Providers](https://opencode.ai/docs/providers/) ·
[CLI](https://opencode.ai/docs/cli/) ·
[Config](https://opencode.ai/docs/config/) ·
[OpenCode Zen / Console models](https://opencode.ai/v2/docs/console/models/) ·
[OpenCode Go](https://opencode.ai/v2/docs/console/go/)

---

## Pi — earendil-works (open source)

Default: `defaultProvider` + `defaultModel` in settings if set; otherwise the per-provider default of the first authenticated provider (e.g. `claude-opus-4-8` for `anthropic`), else the first available model
Select: `--model <pattern>` (with optional `--provider`), `--models <patterns>` for the cycling scope, `/model` (`Ctrl+S` saves as default), `Ctrl+P` to cycle, `/scoped-models`, `defaultProvider` / `defaultModel` / `enabledModels` in `~/.pi/agent/settings.json`; `--thinking <level>` or `/thinking` sets the thinking level
Providers: Anthropic, OpenAI (API key or ChatGPT sign-in as `openai-codex`), Azure OpenAI, Amazon Bedrock, Google Gemini, Google Vertex AI, GitHub Copilot, OpenRouter, Vercel AI Gateway, Cloudflare AI Gateway and Workers AI, OpenCode Zen and Go, Radius, xAI, Mistral, Groq, Cerebras, DeepSeek, NVIDIA NIM, Hugging Face, Fireworks, Together AI, Baseten, Meta, MiniMax, Moonshot AI, Kimi For Coding, Z.AI, Qwen Token Plan, Xiaomi MiMo, Ant Ling; custom endpoints (Ollama, LM Studio, vLLM, llama.cpp) via `models.json`
ID format: `<provider>/<model-id>` with an optional `:<thinking>` suffix (e.g. `sonnet:high`); `--model` also fuzzy-matches IDs and names. Rows below are Pi's built-in per-provider defaults

| Model | ID | Aliases |
|---|---|---|
| **Claude Opus 4.8** ○ | `anthropic/claude-opus-4-8` | — |
| **Claude Opus 4.6** ○ | `amazon-bedrock/us.anthropic.claude-opus-4-6-v1` | — |
| **GPT-6.1 Sol** ○ | `openai-codex/gpt-6.1-sol` | `github-copilot/gpt-6.1-sol` |
| **GPT-5.5** ○ | `openai/gpt-5.5` | — |
| **GPT-5.4** ◆ | `azure/gpt-5.4` | — |
| **Gemini 3.1 Pro** ○ | `google/gemini-3.1-pro-preview` | `google-vertex/gemini-3.1-pro-preview` |
| **Grok 4.7** ○ | `xai/grok-4.7` | — |
| **gpt-oss-120b** ○ | `groq/openai/gpt-oss-120b` | `cerebras/gpt-oss-120b` |
| **DeepSeek-V4-Pro** ◆ | `deepseek/deepseek-v4-pro` | `azure/deepseek-v4-pro` |
| **Devstral Medium** ○ | `mistral/devstral-medium-latest` | — |
| **GLM-5.3** ○ | `zai/glm-5.3` | `zai-coding-cn/glm-5.3` |
| **GLM-5.2** ○ | `baseten/zai-org/GLM-5.2` | — |
| **GLM-5.1** ○ | `vercel-ai-gateway/zai/glm-5.1` | — |
| **MiniMax-M2.7** ○ | `minimax/MiniMax-M2.7` | `minimax-cn/MiniMax-M2.7` |
| **Kimi K3** ○ | `opencode-go/kimi-k3` | `fireworks/accounts/fireworks/models/kimi-k3`, `together/moonshotai/Kimi-K3` |
| **Kimi K2.6** ○ | `moonshotai/kimi-k2.6` | `moonshotai-cn/kimi-k2.6`, `opencode/kimi-k2.6`, `openrouter/moonshotai/kimi-k2.6`, `huggingface/moonshotai/Kimi-K2.6`, `cloudflare-workers-ai/@cf/moonshotai/kimi-k2.6`, `cloudflare-ai-gateway/workers-ai/@cf/moonshotai/kimi-k2.6` |
| **Kimi For Coding** ○ | `kimi-coding/kimi-for-coding` | — |
| **Nemotron 3.5 Super VL** ○ | `nvidia/nvidia/nemotron-3.5-super-vl-120b-a12b` | — |
| **Ring-2.6-1T** ○ | `ant-ling/Ring-2.6-1T` | — |
| **Muse Spark 1.3** ○ | `meta/muse-spark-1.3` | — |
| **Qwen3.8-Max** ○ | `qwen-token-plan-individual/qwen3.8-max` | — |
| **Qwen3.7-Max** ○ | `qwen-token-plan/qwen3.7-max` | `qwen-token-plan-cn/qwen3.7-max` |
| **MiMo-V2.6-Pro** ○ | `xiaomi/mimo-v2.6-pro` | `xiaomi-token-plan-cn/mimo-v2.6-pro`, `xiaomi-token-plan-ams/mimo-v2.6-pro`, `xiaomi-token-plan-sgp/mimo-v2.6-pro` |

**Sources:**
[Choose a Model](https://pi.dev/docs/latest/models) ·
[Providers](https://pi.dev/docs/latest/providers) ·
[CLI](https://pi.dev/docs/latest/cli) ·
[Settings](https://pi.dev/docs/latest/settings) ·
[Model catalog](https://pi.dev/models) ·
[Per-provider defaults (model-resolver.ts)](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/src/core/model-resolver.ts)

---

## Aider — open source

Default: none fixed; picks by the API key found (`sonnet` with `ANTHROPIC_API_KEY`, `gpt-4o` with `OPENAI_API_KEY`), otherwise offers OpenRouter sign-in
Select: `--model <id>`, `/model <id>` in chat, `model:` in `.aider.conf.yml`, `AIDER_MODEL`; `--weak-model` and `--editor-model` for secondary roles; `--alias <alias>:<model>` adds aliases; `--reasoning-effort` and `--thinking-tokens` set reasoning
Providers: OpenAI, Anthropic, Gemini, Groq, LM Studio, xAI, Azure, Cohere, DeepSeek, Ollama, OpenAI-compatible APIs, OpenRouter, GitHub Copilot, Vertex AI, Amazon Bedrock, plus other LiteLLM providers
ID format: LiteLLM `<provider>/<model>` (e.g. `gemini/gemini-2.5-pro`, `openrouter/<vendor>/<model>`); OpenAI and Anthropic models also work without the prefix. Rows below are Aider's built-in aliases that point at current models

| Model | ID | Aliases |
|---|---|---|
| **Claude Opus 4.7** ◆ | `claude-opus-4-7` | `opus` |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4-6` | `sonnet` |
| **Claude Haiku 4.5** ◆ | `claude-haiku-4-5` | `haiku` |
| **GPT-4o** ◆ | `gpt-4o` | `4o` |
| **Gemini 2.5 Pro** ◆ | `gemini/gemini-2.5-pro` | `gemini-2.5-pro` |
| **Gemini Flash Latest** ◆ | `gemini/gemini-flash-latest` | `flash` |
| **Gemini 2.5 Flash-Lite** ◆ | `gemini/gemini-2.5-flash-lite` | `flash-lite` |

**Sources:**
[Model aliases](https://aider.chat/docs/config/model-aliases.html) ·
[Options reference](https://aider.chat/docs/config/options.html) ·
[Connecting to LLMs](https://aider.chat/docs/llms.html) ·
[Default model selection (onboarding.py)](https://github.com/Aider-AI/aider/blob/main/aider/onboarding.py)

---

## Amp — ampcode.com

Default: `medium` mode (Claude Opus 5.5); `low` runs GLM-5.3-Flash, `high` GPT-6 Astra, `ultra` Claude Fable 5.1, Puck GPT-5.6 Sol. The ChatGPT Only preset pins GPT-5.6 Terra, GPT-6.1 Sol and GPT-6 Astra to `low`, `medium` and `high`
Select: the Dial picks a mode (`low`, `medium`, `high`, `ultra`) before the first message (Ctrl+S in the CLI); Settings → Mode Dial → Tune Modes pins a main-agent model per mode; the mode picker's Raw Models tab runs one model directly; plugins set `model` in `amp.createAgent(...)`; Claude Code mode takes any Claude Code model ID via `--mode external-agent:claude-code --features model:<id>`
Providers: Amp-served by default; Model Routing adds API keys (Anthropic, Google AI Studio, Meta AI, OpenAI, xAI), ChatGPT, 𝕏 Premium+/SuperGrok and GitHub Copilot subscriptions, Amazon Bedrock, Google Cloud Agent Platform, Microsoft Foundry, and gateways (OpenRouter, Vercel AI Gateway, Cloudflare AI Gateway, Ollama Cloud, OpenCode Go, custom URL)
ID format: `<provider>/<model>` (`openai/gpt-5.6-sol`, `anthropic/claude-opus-4-6`); Tune Modes shows display names

| Model | ID | Aliases |
|---|---|---|
| **GLM-5.3-Flash** ◆ | `GLM-5.3-Flash` | — |
| **Claude Opus 5.5** ◆ | `Opus 5.5` | — |
| **GPT-6 Astra** ◆ | `GPT-6 Astra` | — |
| **Claude Fable 5.1** ◆ | `Fable 5.1` | — |
| **GPT-5.6 Sol** ◆ | `openai/gpt-5.6-sol` | — |
| **GPT-6.1 Sol** ◆ | `openai/gpt-6.1-sol` | — |
| **GPT-5.6 Terra** ◆ | `GPT-5.6 Terra` | — |

**Sources:**
[Modes & Models](https://ampcode.com/modes) ·
[The Dial](https://ampcode.com/docs/the-dial) ·
[Models and subagents](https://ampcode.com/docs/models-and-subagents) ·
[Model Routing](https://ampcode.com/docs/customize/model-routing) ·
[Plugins](https://ampcode.com/docs/customize/plugins) ·
[Plugin API](https://ampcode.com/docs/plugin-api)

---

## Antigravity CLI — Google

Default: not documented; plan-dependent (Free and Google AI Plus accounts get Gemini 3.8 Flash as the only Gemini model)
Select: `--model <slug>`, `--effort <level>`, `/model`, `/effort`, `model` in `~/.gemini/antigravity-cli/settings.json` (saved by label)
Providers: Google account (Antigravity plans), Gemini API key (`modelProvider: "gemini"`, extra models via `customModelsConfig`), Gemini Enterprise (ADC)
ID format: `<model>-<effort>` slugs from `agy models`; display labels such as `Gemini 3.8 Flash (Medium)` also work. Gemini Enterprise documents base IDs plus `--effort`

| Model | ID | Aliases |
|---|---|---|
| **Gemini 4 Argon** ◆ | `gemini-4-argon-high` | `gemini-4-argon-medium`, `gemini-4-argon-low`, `gemini-4-argon` |
| **Gemini 3.8 Flash** ◆ | `gemini-3.8-flash-medium` | `gemini-3.8-flash-high`, `gemini-3.8-flash-low`, `gemini-3.8-flash` |
| **Gemini 3.7 Flash** ◆ | `gemini-3.7-flash-medium` | `gemini-3.7-flash-high`, `gemini-3.7-flash-low`, `gemini-3.7-flash` |
| **Gemini 3.6 Flash** ◆ | `gemini-3.6-flash-medium` | `gemini-3.6-flash-high`, `gemini-3.6-flash-low`, `gemini-3.6-flash` |
| **Gemini 3.1 Pro** ◆ | `gemini-3.1-pro-high` | `gemini-3.1-pro-low`, `gemini-3.1-pro-preview` |
| **Claude Opus 5.5** ◆ | `claude-opus-5-5-medium` | `claude-opus-5-5-low`, `claude-opus-5-5-high`, `claude-opus-5-5-max` |
| **Claude Sonnet 5.5** ◆ | `claude-sonnet-5-5-medium` | `claude-sonnet-5-5-low`, `claude-sonnet-5-5-high`, `claude-sonnet-5-5-max` |
| **Claude Opus 4.6** ○ | `claude-opus-4-6-thinking` | — |
| **Claude Sonnet 4.6** ○ | `claude-sonnet-4-6` | — |
| **gpt-oss-120b** ○ | `gpt-oss-120b-medium` | — |

**Sources:**
[Choose a model](https://antigravity.google/docs/models/) ·
[CLI reference](https://antigravity.google/docs/cli/reference/) ·
[Headless mode](https://antigravity.google/docs/cli/headless/) ·
[CLI settings](https://antigravity.google/docs/settings?tab=cli) ·
[Enterprise: supported models](https://antigravity.google/docs/enterprise/) ·
[GitHub issue: `agy models` output](https://github.com/google-antigravity/antigravity-cli/issues/1242)

---

## Augment Code — Augment

Default: your last selection, else the organization default (`auggie models list --full-info` shows the account default)
Select: `--model <name>`, `/model`, `model` frontmatter in subagents and custom commands
Providers: Augment-hosted only (Anthropic, OpenAI, Google, xAI, DeepSeek, Zhipu AI, Moonshot AI models)
ID format: short or long names from `auggie models list` (short names look like `sonnet4.5`); the IDs below are the model-list names, since the docs don't publish the short names

| Model | ID | Aliases |
|---|---|---|
| **Claude Fable 5.1** ○ | `Claude Fable 5.1` | — |
| **Claude Fable 5** ○ | `Claude Fable 5` | — |
| **Claude Opus 5.5** ○ | `Claude Opus 5.5` | — |
| **Claude Opus 5** ○ | `Claude Opus 5` | — |
| **Claude Opus 4.8** ○ | `Claude Opus 4.8` | — |
| **Claude Opus 4.7** ○ | `Claude Opus 4.7` | — |
| **Claude Opus 4.6** ○ | `Claude Opus 4.6` | — |
| **Claude Sonnet 5.5** ○ | `Claude Sonnet 5.5` | — |
| **Claude Sonnet 5** ○ | `Claude Sonnet 5` | — |
| **Claude Sonnet 4.6** ○ | `Claude Sonnet 4.6` | — |
| **Claude Haiku 5.5** ○ | `Claude Haiku 5.5` | — |
| **DeepSeek-V4.1-Flash** ○ | `DeepSeek V4.1 Flash` | `DeepSeek V4.1 Flash 1017` |
| **Gemini 4 Argon** ○ | `Gemini 4 Argon` | — |
| **Gemini 3.8 Flash** ○ | `Gemini 3.8 Flash` | — |
| **Gemini 3.7 Flash** ○ | `Gemini 3.7 Flash` | — |
| **Gemini 3.1 Pro** ○ | `Gemini 3.1 Pro` | — |
| **GLM-5.3-Flash** ○ | `GLM 5.3 Flash` | — |
| **GPT-6 Astra** ○ | `GPT-6 Astra` | — |
| **GPT-6.1 Sol** ○ | `GPT-6.1 Sol` | — |
| **GPT-6 Sol** ○ | `GPT-6 Sol` | — |
| **GPT-6 Luna** ○ | `GPT-6 Luna` | — |
| **GPT-5.6 Sol** ○ | `GPT-5.6 Sol` | — |
| **GPT-5.6 Terra** ○ | `GPT-5.6 Terra` | — |
| **GPT-5.6 Luna** ○ | `GPT-5.6 Luna` | — |
| **GPT-5.5** ◆ | `GPT-5.5` | — |
| **Grok 4.7** ○ | `Grok 4.7` | — |
| **Grok 4.6** ○ | `Grok 4.6` | — |
| **Grok 4.5** ○ | `Grok 4.5` | — |
| **Kimi K3** ○ | `Kimi K3` | — |
| **Prism (Claude + Gemini)** ○ | `Prism (Claude + Gemini)` | — |
| **Prism (GPT)** ○ | `Prism (GPT)` | — |

**Sources:**
[Available models](https://docs.augmentcode.com/models/available-models) ·
[CLI flags and options](https://docs.augmentcode.com/cli/reference) ·
[Subagents](https://docs.augmentcode.com/cli/subagents.md)

---

## Cline — Cline Bot Inc.

Default: provider `cline` with `anthropic/claude-sonnet-5.5` (the first recommended model)
Select: API Provider and Model dropdowns in the IDE settings, `/settings` and `/model` in the CLI, `cline -P <provider> -m <model-id>`, `cline auth -p <provider> -m <model-id>`, `--thinking <level>` for reasoning effort
Providers: Cline (usage-billing, provider ID `cline`), ClinePass (`cline-pass`), Anthropic, Claude Code, OpenAI (API key or Codex sign-in), Google Gemini, Google Vertex AI, AWS Bedrock, OpenRouter, DeepSeek, MiniMax, Alibaba Qwen, Z AI, Poolside, OpenAI-compatible endpoints, Ollama, LM Studio, and 30+ others
ID format: `<vendor>/<model>` on the Cline provider, `cline-pass/<model>` on ClinePass, `cline-free/<model>` for free promotions; BYOK providers take the provider's own model ID

| Model | ID | Aliases |
|---|---|---|
| **Claude Sonnet 5.5** ○ | `anthropic/claude-sonnet-5-5` | — |
| **Claude Opus 5.5** ○ | `anthropic/claude-opus-5-5` | — |
| **Gemini 4 Argon** ○ | `google/gemini-4-argon` | — |
| **GPT-6 Astra** ○ | `openai/gpt-6-astra` | — |
| **GPT-6.1 Sol** ○ | `openai/gpt-6.1-sol` | — |
| **Claude Sonnet 4.6** ◆ | `anthropic/claude-sonnet-4-6` | — |
| **Gemini 2.5 Pro** ◆ | `google/gemini-2.5-pro` | — |
| **GPT-4o** ◆ | `openai/gpt-4o` | — |
| **MiniMax-M2.5** ◆ | `minimax/minimax-m2.5` | — |
| **Kimi K3** ◆ | `cline-pass/kimi-k3` | `moonshotai/kimi-k3` |
| **GLM-5.3** ◆ | `cline-pass/glm-5.3` | — |
| **GLM-5.3-Flash** ◆ | `cline-pass/glm-5.3-flash` | — |
| **DeepSeek-V4-Pro** ◆ | `cline-pass/deepseek-v4-pro` | — |
| **DeepSeek-V4.1-Flash** ◆ | `cline-pass/deepseek-v4.1-flash` | — |
| **MiMo-V2.5** ◆ | `cline-pass/mimo-v2.5` | — |
| **MiMo-V2.5-Pro** ◆ | `cline-pass/mimo-v2.5-pro` | — |
| **MiniMax-M3** ◆ | `cline-pass/minimax-m3` | — |
| **Muse Spark 1.3** ◆ | `cline-pass/muse-spark-1.3-contributor` | `cline-free/muse-spark-1.3-contributor` |
| **Qwen3.8-Max** ◆ | `cline-pass/qwen3.8-max` | — |
| **Qwen3.7-Max** ◆ | `cline-pass/qwen3.7-max` | — |
| **Qwen3.7-Plus** ◆ | `cline-pass/qwen3.7-plus` | — |
| **MiMo-V2.6-Flash** ○ | `cline-pass/mimo-v2.6-flash` | `cline-free/mimo-v2.6-flash` |
| **MiMo-V2.6-Pro** ○ | `cline-pass/mimo-v2.6-pro` | — |
| **Nemotron 3.5 Super VL** ○ | `cline-free/nemotron-3.5-super-vl` | — |
| **Solar Mini 4** ○ | `cline-free/solar-mini4` | — |

**Sources:**
[Cline (usage-billing)](https://docs.cline.bot/getting-started/cline-provider) ·
[ClinePass](https://docs.cline.bot/getting-started/clinepass) ·
[Free models](https://docs.cline.bot/getting-started/free-models) ·
[Cline API models](https://docs.cline.bot/api/models) ·
[CLI reference](https://docs.cline.bot/cli/cli-reference) ·
[Recommended models catalog (source)](https://github.com/cline/cline/blob/main/sdk/packages/llms/src/catalog/cline-recommended.generated.ts)

---

## Continue — Continue Dev, Inc.

Default: the first chat model in `config.yaml`; `cn` onboarding with an Anthropic API key writes `claude-sonnet-4-6` (plus `claude-opus-4-6`)
Select: model dropdown in the IDE chat panel, `/model` in `cn`, `models:` entries in `~/.continue/config.yaml` (with `roles:` for chat, edit, apply, autocomplete, embed, rerank), `cn --config <path>`
Providers: Anthropic, OpenAI, Gemini, Ollama, Amazon Bedrock, Azure, xAI, Mistral, OpenRouter, LM Studio, Voyage, Cohere and others
ID format: a `models:` entry pairs `provider:` with `model:`; the ID column shows the `model:` value with its `provider:` in parentheses. Hub `uses:` slugs do not resolve, because the Hub is offline

| Model | ID | Aliases |
|---|---|---|
| **Claude Opus 4.6** ◆ | `claude-opus-4-6` (`anthropic`) | — |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4-6` (`anthropic`) | — |
| **GPT-5.1** ◆ | `gpt-5.1` (`openai`) | — |
| **GPT-5** ◆ | `gpt-5` (`openai`) | — |
| **GPT-4o** ◆ | `gpt-4o` (`openai`) | — |
| **Gemini 3.1 Pro** ◆ | `gemini-3.1-pro-preview` (`gemini`) | — |
| **Codestral** ◆ | `codestral-latest` (`mistral`) | — |
| **Gemma 4** ◆ | `gemma4` (`ollama`) | — |
| **Llama 3.1 8B** ◆ | `llama3.1:8b` (`ollama`) | — |
| **DeepSeek-Coder-V2 16B** ◆ | `deepseek-coder-v2:16b` (`ollama`) | — |
| **Qwen2.5-Coder 1.5B** ◆ | `qwen2.5-coder:1.5b` (`ollama`) | — |
| **Voyage Code 3** ◆ | `voyage-code-3` (`voyage`) | — |

**Sources:**
[Models](https://docs.continue.dev/customize/models) ·
[Chat role](https://docs.continue.dev/customize/model-roles/chat) ·
[Autocomplete role](https://docs.continue.dev/customize/model-roles/autocomplete) ·
[`config.yaml` reference](https://docs.continue.dev/reference) ·
[CLI quickstart](https://docs.continue.dev/cli/quickstart) ·
[CLI TUI mode](https://docs.continue.dev/cli/tui-mode)

---

## Devin — Cognition

Default: `normal`, unless a user pins another mode as their default in the agent picker, or an organization admin sets an organization default
Select: agent selector in the session message box (Lite, Normal, Ultra, Fusion, SWE-2), `devin_mode` in the v3 sessions API, Slack keywords (`!lite`, `!ultra`, `!fusion`, `!swe2`), `/model` before the first message in `devin --cloud`
Providers: Cognition-managed; Lite, Normal, Ultra and Fusion are agent modes that pick the underlying models themselves

| Model | ID | Aliases |
|---|---|---|
| **SWE-2** ◆ | `swe-2-medium` | `swe-2-high`, `swe-2-max`, `!swe2`, `!swe` |

**Sources:**
[Your first session](https://docs.devin.ai/get-started/first-run) ·
[Create session API](https://docs.devin.ai/api-reference/v3/sessions/post-organizations-sessions) ·
[Slack mode keywords](https://docs.devin.ai/integrations/slack) ·
[Devin Cloud in the CLI](https://docs.devin.ai/cli/cloud) ·
[Release notes 2026](https://docs.devin.ai/release-notes/2026)

---

## Factory — Factory AI

Default: not named; the `model` setting defaults to the product default
Select: `/model` in the CLI, the model selector in the Factory App, `droid exec -m <id>` / `--model <id>`, `--spec-model <id>`, `model` in `~/.factory/settings.json`, `model:` in custom droid frontmatter (default `inherit`); effort via `-r` / `--reasoning-effort` or `reasoningEffort`; Factory Router (shown as Auto Model in some places) is selectable in the model selector
Providers: Factory-managed inference for Anthropic, OpenAI, Google, xAI and Droid Core open models; BYOK custom models with provider `anthropic`, `openai`, `generic-chat-completion-api` or `bedrock-converse`
ID format: bare model ID; BYOK models are `custom:<display-name-with-dashes>-<index>` in `droid exec`, and `custom:<model>` in droid frontmatter

| Model | ID | Aliases |
|---|---|---|
| **Claude Fable 5.1** ◆ | `claude-fable-5.1` | — |
| **Claude Fable 5** ◆ | `claude-fable-5` | — |
| **Claude Opus 5.5** ◆ | `claude-opus-5-5` | `claude-opus-5-5-fast` |
| **Claude Opus 5** ◆ | `claude-opus-5` | `claude-opus-5-fast` |
| **Claude Opus 4.8** ◆ | `claude-opus-4-8` | `claude-opus-4-8-fast` |
| **Claude Opus 4.7** ◆ | `claude-opus-4-7` | — |
| **Claude Opus 4.6** ◆ | `claude-opus-4-6` | — |
| **Claude Opus 4.5** ◆ | `claude-opus-4-5-20251101` | — |
| **Claude Sonnet 5.5** ◆ | `claude-sonnet-5-5` | — |
| **Claude Sonnet 5** ◆ | `claude-sonnet-5` | — |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4-6` | — |
| **Claude Sonnet 4.5** ◆ | `claude-sonnet-4-5-20250929` | — |
| **Claude Haiku 5.5** ◆ | `claude-haiku-5-5` | — |
| **Claude Haiku 4.5** ◆ | `claude-haiku-4-5-20251001` | — |
| **GPT-6.1 Sol** ◆ | `gpt-6.1-sol` | `gpt-6.1-sol-ultrafast` |
| **GPT-6 Astra** ◆ | `gpt-6-astra` | — |
| **GPT-6 Sol** ◆ | `gpt-6-sol` | `gpt-6-sol-fast` |
| **GPT-6 Luna** ◆ | `gpt-6-luna` | `gpt-6-luna-fast` |
| **GPT-5.6 Sol** ◆ | `gpt-5.6-sol` | `gpt-5.6-sol-fast` |
| **GPT-5.6 Terra** ◆ | `gpt-5.6-terra` | — |
| **GPT-5.6 Luna** ◆ | `gpt-5.6-luna` | — |
| **GPT-5.5** ◆ | `gpt-5.5` | `gpt-5.5-fast` |
| **GPT-5.5 Pro** ◆ | `gpt-5.5-pro` | — |
| **GPT-5.4** ◆ | `gpt-5.4` | `gpt-5.4-fast` |
| **GPT-5.4 mini** ◆ | `gpt-5.4-mini` | `gpt-5.4-mini-fast` |
| **GPT-5.3-Codex** ◆ | `gpt-5.3-codex` | `gpt-5.3-codex-fast` |
| **GPT-5.2** ◆ | `gpt-5.2` | — |
| **Gemini 3.1 Pro** ◆ | `gemini-3.1-pro-preview` | — |
| **Gemini 3.8 Flash** ◆ | `gemini-3.8-flash` | — |
| **Gemini 3.7 Flash** ◆ | `gemini-3.7-flash` | — |
| **Gemini 3.6 Flash** ◆ | `gemini-3.6-flash` | — |
| **Gemini 3.5 Flash** ◆ | `gemini-3.5-flash` | — |
| **Gemini 3 Flash** ◆ | `gemini-3-flash-preview` | — |
| **Grok 4.7** ◆ | `grok-4.7` | — |
| **Grok 4.6** ◆ | `grok-4.6` | — |
| **Grok 4.5** ◆ | `grok-4.5` | — |
| **Inkling** ◆ | `inkling` | — |
| **Mistral Large 4** ◆ | `mistral-large-4` | — |
| **Mistral Medium 3.5** ◆ | `mistral-medium-3.5` | — |
| **GLM-5.3** ◆ | `glm-5.3` | — |
| **GLM-5.3-Flash** ◆ | `glm-5.3-flash` | — |
| **GLM-5.2** ◆ | `glm-5.2` | `glm-5.2-fast` |
| **Kimi K3** ◆ | `kimi-k3` | — |
| **Qwen3.8-Max** ◆ | `qwen3.8-max` | — |
| **Nemotron 3 Ultra** ◆ | `nemotron-3-ultra` | — |
| **Nemotron 3.5 Super** ◆ | `nemotron-3.5-super` | — |
| **DeepSeek-V4.1-Flash** ◆ | `deepseek-v4.1-flash` | `deepseek-v4.1-flash-1017` |
| **MiniMax-M3.1-Flash** ◆ | `minimax-m3.1-flash` | — |
| **MiniMax-M3** ◆ | `minimax-m3` | — |
| **Muse Spark 1.2** ◆ | `muse-spark-1.2` | — |
| **Beam 1.0** ◆ | `beam-1.0` | — |

**Sources:**
[Available Models](https://docs.factory.com/models) ·
[Settings](https://docs.factory.com/droid-cli/settings) ·
[Droid Exec](https://docs.factory.com/droid-exec/overview) ·
[Custom Models (BYOK)](https://docs.factory.com/model-independence/byok) ·
[Factory Router](https://docs.factory.com/model-independence/factory-router) ·
[Custom droids](https://docs.factory.com/harness/subagents)

---

## Gemini CLI — Google

Default: `auto` (routes each request between a Pro and a Flash model)
Select: `--model <id>` / `-m`, `/model`, `model.name` in `~/.gemini/settings.json` or `.gemini/settings.json`, `GEMINI_MODEL`
Providers: Google sign-in (Gemini Code Assist), Gemini API key, Vertex AI
ID format: Gemini API model IDs, or the aliases `auto`, `pro`, `flash`, `flash-lite`

| Model | ID | Aliases |
|---|---|---|
| **Gemini 3.1 Pro** ◆ | `gemini-3.1-pro-preview` | `pro`, `gemini-3.1-pro-preview-customtools` |
| **Gemini 3.8 Flash** ◆ | `gemini-3.8-flash` | — |
| **Gemini 3.5 Flash** ◆ | `gemini-3.5-flash` | — |
| **Gemini 3 Flash** ◆ | `gemini-3-flash-preview` | `flash` |
| **Gemini 3.5 Flash-Lite** ◆ | `gemini-3.5-flash-lite` | — |
| **Gemini 3.1 Flash-Lite** ◆ | `gemini-3.1-flash-lite` | `flash-lite` |
| **Gemini 2.5 Pro** ◆ | `gemini-2.5-pro` | — |
| **Gemini 2.5 Flash** ◆ | `gemini-2.5-flash` | — |
| **Gemini 2.5 Flash-Lite** ◆ | `gemini-2.5-flash-lite` | — |
| **Gemma 4 31B** ◆ | `gemma-4-31b-it` | — |
| **Gemma 4 26B A4B** ◆ | `gemma-4-26b-a4b-it` | — |

**Sources:**
[Model selection](https://geminicli.com/docs/cli/model/) ·
[Model routing](https://geminicli.com/docs/cli/model-routing/) ·
[CLI reference](https://geminicli.com/docs/cli/cli-reference/) ·
[Configuration reference](https://geminicli.com/docs/reference/configuration/)

---

## Goose — Agentic AI Foundation

Default: none; provider and model must be configured (`goose configure` and Desktop onboarding prefill a per-provider default, e.g. `claude-sonnet-4-5` for `anthropic`)
Select: `goose configure`, the Models tab in goose Desktop, `GOOSE_PROVIDER` + `GOOSE_MODEL` (environment or `~/.config/goose/config.yaml`), `--provider` / `--model` on `goose run` and `goose review`, `/model [name]` and `/model --provider <name> [model]` in a session; `GOOSE_SUBAGENT_PROVIDER` / `GOOSE_SUBAGENT_MODEL` and recipe `settings.goose_model` for subagents
Providers: Anthropic, OpenAI, Gemini, GCP Vertex AI, Amazon Bedrock, Azure OpenAI, Azure AI Foundry, ChatGPT Codex (subscription), GitHub Copilot, Databricks, Snowflake, OpenRouter, LiteLLM, Tetrate, xAI, Mistral, Groq, Cerebras, Meta, Z.AI Coding Plan, Ollama, Ollama Cloud, LM Studio, Docker Model Runner, Ramalama, and more; CLI and ACP providers (`cursor-agent`, `claude-acp`, `codex-acp`)
ID format: provider ID (`GOOSE_PROVIDER`, e.g. `anthropic`, `openai`, `google`, `aws_bedrock`, `gcp_vertex_ai`, `openrouter`, `ollama`) and the provider's own model name (`GOOSE_MODEL`), set separately; the ID column shows the model name with its provider ID in parentheses. Rows below are documented examples and the built-in per-provider defaults

| Model | ID | Aliases |
|---|---|---|
| **Claude Sonnet 4.5** ◆ | `claude-sonnet-4-5` (`anthropic`, `snowflake`) | `claude-sonnet-4-5-20250929`, `us.anthropic.claude-sonnet-4-5-20250929-v1:0` (`aws_bedrock`) |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4-6` (`anthropic`) | — |
| **Claude Sonnet 5.5** ○ | `anthropic/claude-sonnet-5.5` (`openrouter`) | — |
| **GPT-6.1 Sol** ○ | `gpt-6.1-sol` (`openai`) | — |
| **GPT-5.5** ○ | `gpt-5.5` (`chatgpt_codex`) | — |
| **Gemini 2.5 Pro** ○ | `gemini-2.5-pro` (`google`) | — |
| **Gemini 2.5 Flash** ○ | `gemini-2.5-flash` (`gcp_vertex_ai`) | — |
| **Grok 4.5** ○ | `grok-4.5` (`xai`) | — |
| **GLM-5.3** ◆ | `glm-5.3` (`zai_coding_plan`) | — |
| **GLM-5.3-Flash** ◆ | `glm-5.3-flash` (`zai_coding_plan`) | — |
| **Muse Spark 1.3** ○ | `muse-spark-1.3` (`muse_code`) | — |
| **Phi-4** ○ | `Phi-4` (`azure_foundry`) | — |
| **Qwen3** ○ | `qwen3` (`ollama`) | — |

**Sources:**
[Configure LLM provider](https://github.com/aaif-goose/goose/blob/main/documentation/docs/getting-started/providers.md) ·
[CLI commands](https://github.com/aaif-goose/goose/blob/main/documentation/docs/guides/goose-cli-commands.md) ·
[Environment variables](https://github.com/aaif-goose/goose/blob/main/documentation/docs/guides/environment-variables.md) ·
[Provider defaults (goose-providers)](https://github.com/aaif-goose/goose/tree/main/crates/goose-providers/src) ·
[Docs home (goose-docs.ai)](https://goose-docs.ai/)

---

## Hermes Agent — Nous Research

Default: none until `hermes setup` or `hermes model` writes `model.provider` and `model.default`; `hermes setup --portal` sets the provider to `nous`
Select: `hermes model`, `hermes chat --provider <id> --model <id>` (`-m`), `/model <id>` or `/model <provider>:<model>`, `model.default` in `~/.hermes/config.yaml`, `HERMES_INFERENCE_MODEL`, aliases under `model_aliases:`
Providers: Nous Portal (recommended), OpenAI Codex (ChatGPT sign-in), GitHub Copilot, Anthropic, OpenRouter, Google Gemini, Google Vertex AI, OpenAI API, Azure AI Foundry, AWS Bedrock, xAI, DeepSeek, Kimi / Moonshot, z.ai / GLM, MiniMax, Qwen Cloud, Hugging Face, NVIDIA, Ollama Cloud, LM Studio, Kilo Code, OpenCode Zen and Go, Upstage, Meituan, Poolside, StepFun, Reflection, Ornith, custom OpenAI-compatible endpoints, and more
ID format: `<vendor>/<model>` on Nous Portal and OpenRouter; the provider's own ID on direct providers

| Model | ID | Aliases |
|---|---|---|
| **GPT-6.1 Sol** ◆ | `gpt-6.1-sol` | `gpt-6.1-sol-900k` |
| **GPT-6 Astra** ○ | `openai/gpt-6-astra` | `openai/gpt-6-astra-fast`, `openai/gpt-6-astra-flex` |
| **GPT-6 Astra Pro** ○ | `openai/gpt-6-astra-pro` | `openai/gpt-6-astra-pro-fast`, `openai/gpt-6-astra-pro-flex` |
| **Grok 4.7** ○ | `x-ai/grok-4.7` | — |
| **DeepSeek-V4.1-Flash** ○ | `deepseek/deepseek-v4.1-flash:US` | — |
| **GLM-5.3** ○ | `z-ai/glm-5.3:US` | — |
| **GLM-5.3-Flash** ○ | `z-ai/glm-5.3-flash:US` | — |
| **Kimi K3.1 Pro** ○ | `moonshotai/kimi-k3.1-pro` | — |
| **MiniMax-M3.1-Flash** ○ | `minimax/minimax-m3.1-flash` | — |
| **Solar Mini 4** ○ | `upstage/solar-mini4:free` | — |
| **LongCat-2.5 Preview** ○ | `meituan/longcat-2.5-preview:free` | — |
| **Laguna S 2.1** ○ | `poolside/laguna-s-2.1:free` | — |
| **Laguna XS 2.1** ○ | `poolside/laguna-xs-2.1:free` | — |
| **Step 3.7 Flash** ○ | `stepfun/step-3.7-flash:free` | — |
| **Beam 1.0** ○ | `reflection/beam-1.0-501b-a23b:free` | — |
| **Ornith 1.5** ○ | `ornith/ornith-1.5-122b:free` | — |

**Sources:**
[Configuring models](https://hermes-agent.nousresearch.com/docs/user-guide/configuring-models) ·
[Providers](https://hermes-agent.nousresearch.com/docs/integrations/providers) ·
[Nous Portal](https://hermes-agent.nousresearch.com/docs/integrations/nous-portal) ·
[CLI commands](https://hermes-agent.nousresearch.com/docs/reference/cli-commands) ·
[Slash commands](https://hermes-agent.nousresearch.com/docs/reference/slash-commands) ·
[Nous Portal recommended models feed](https://portal.nousresearch.com/api/nous/recommended-models)

---

## Junie — JetBrains

Default: the dynamically set "Default" model (when `--model` and `JUNIE_MODEL` are unset)
Select: `--model <alias>`, `JUNIE_MODEL`, `/model`, `model` in `~/.junie/config.json` or `.junie/config.json`, `model` in subagent frontmatter; effort via `--effort`, `JUNIE_EFFORT`, `/effort`
Providers: Junie (JetBrains AI subscription); BYOK `openai`, `anthropic`, `google`, `xai`, `openrouter`, `copilot`, `litellm`; custom model profiles; proxy
ID format: JetBrains aliases; each alias points to a model version JetBrains picks and may move to a newer model

| Model | ID | Aliases |
|---|---|---|
| **Claude Sonnet 5.5** ◆ | `sonnet` | — |
| **Claude Opus 5.5** ◆ | `opus` | — |
| **Claude Fable 5.1** ◆ | `fable` | — |
| **GPT-6.1 Sol** ◆ | `gpt-sol` | `gpt` |
| **GPT-6 Astra** ◆ | `gpt-astra` | — |
| **GPT-6 Luna** ◆ | `gpt-luna` | — |
| **GPT-5.6 Terra** ◆ | `gpt-terra` | — |
| **GPT-5.3-Codex** ◆ | `gpt-codex` | — |
| **Gemini 3.1 Pro** ◆ | `gemini-pro` | — |
| **Gemini 3.8 Flash** ◆ | `gemini-flash` | — |
| **Grok 4.7** ◆ | `grok` | — |

**Sources:**
[CLI model selection](https://junie.jetbrains.com/docs/junie-cli-model-selection.html) ·
[CLI parameters](https://junie.jetbrains.com/docs/parameters.html) ·
[CLI configuration](https://junie.jetbrains.com/docs/junie-cli-configuration.html)

---

## Kilo Code — Kilo

Default: `kilo/kilo-auto/free` (Auto Free, when no model is set in config, session or organization)
Select: model selector or `/models` (VS Code, JetBrains), `Ctrl+X m` or `/models` (TUI), `kilo run --model <provider>/<model>` (`-m`), `model` in `kilo.jsonc`, `agent.<name>.model`, `/variant` for reasoning effort
Providers: Kilo Gateway (built in, provider ID `kilo`), Anthropic, OpenAI (API key or ChatGPT subscription), Google Gemini, Google Vertex AI, AWS Bedrock, Mistral, DeepSeek, xAI, Alibaba Cloud, Cloudflare, Groq, Cerebras, Fireworks AI, GMI Cloud, Nebius, Poolside, OpenRouter, Requesty, Vercel AI Gateway, Ollama, LM Studio, OpenAI-compatible endpoints, and more
ID format: `<provider>/<model>`; Kilo Gateway models are `kilo/<vendor>/<model>`, with routers at `kilo/kilo-auto/frontier`, `kilo/kilo-auto/efficient`, `kilo/kilo-auto/free` and `kilo/kilo-auto/small`

| Model | ID | Aliases |
|---|---|---|
| **Claude Opus 4.7** ◆ | `kilo/anthropic/claude-opus-4.7` | — |
| **Claude Sonnet 4.6** ◆ | `kilo/anthropic/claude-sonnet-4.6` | — |
| **Claude Haiku 4.5** ◆ | `kilo/anthropic/claude-haiku-4.5` | — |
| **GPT-5.4** ◆ | `kilo/openai/gpt-5.4` | — |
| **GPT-5.4 mini** ◆ | `kilo/openai/gpt-5.4-mini` | — |
| **Gemini 3.1 Pro** ◆ | `kilo/google/gemini-3.1-pro-preview` | — |
| **Gemini 2.5 Flash** ◆ | `kilo/google/gemini-2.5-flash` | — |
| **DeepSeek-V3.2** ◆ | `kilo/deepseek/deepseek-v3.2` | — |
| **Kimi K2.5** ◆ | `kilo/moonshotai/kimi-k2.5` | — |
| **MiniMax-M2.7** ◆ | `kilo/minimax/minimax-m2.7` | — |
| **GLM-5.3-Flash** ◆ | `kilo/z-ai/glm-5.3-flash` | — |
| **Claude Opus 5.5** ○ | `kilo/anthropic/claude-opus-5.5` | — |
| **Claude Sonnet 5.5** ○ | `kilo/anthropic/claude-sonnet-5.5` | — |
| **Claude Haiku 5.5** ○ | `kilo/anthropic/claude-haiku-5.5` | — |
| **GPT-6.1 Sol** ○ | `kilo/openai/gpt-6.1-sol` | — |
| **DeepSeek-V4.1-Flash** ○ | `kilo/deepseek/deepseek-v4.1-flash` | — |
| **Grok 4.7** ○ | `kilo/x-ai/grok-4.7` | — |
| **Gemini 4 Argon** ○ | `kilo/google/gemini-4-argon` | — |
| **Kimi K3** ○ | `kilo/moonshotai/kimi-k3` | — |
| **Nemotron 3.5 Super VL** ○ | `kilo/nvidia/nemotron-3.5-super-vl:free` | — |
| **Beam 1.0** ○ | `kilo/reflection/beam-free` | — |

**Sources:**
[Model selection](https://kilo.ai/docs/code-with-ai/agents/model-selection) ·
[Auto Model](https://kilo.ai/docs/code-with-ai/agents/auto-model) ·
[Gateway models and providers](https://kilo.ai/docs/gateway/models-and-providers) ·
[AI providers](https://kilo.ai/docs/ai-providers) ·
[Gateway model catalog](https://ai-gateway.kilo.ai/api/v1/models)

---

## Kiro — Amazon Web Services

Default: `auto` (Auto router; Kiro uses the service-provided default when `chat.defaultModel` is unset or unavailable)
Select: `--model <id>`, `/model`, `/model set-current-as-default`, `chat.defaultModel` in `~/.kiro/settings/cli.json` or `.kiro/settings/cli.json`, `model` in custom agent config; effort via `--effort`, `/effort`
Providers: Kiro-hosted only (Amazon Bedrock); availability depends on plan, region and admin governance
ID format: lowercase, hyphenated, dotted version (`claude-opus-4.8`); `kiro-cli chat --list-models` prints IDs. `/model` also matches model names case-insensitively

| Model | ID | Aliases |
|---|---|---|
| **GPT-5.6 Sol** ◆ | `GPT-5.6 Sol` | — |
| **GPT-5.6 Terra** ○ | `gpt-5.6-terra` | — |
| **GPT-5.6 Luna** ○ | `gpt-5.6-luna` | — |
| **Claude Fable 5.1** ◆ | `Claude Fable 5.1` | — |
| **Claude Opus 5.5** ○ | `claude-opus-5.5` | — |
| **Claude Sonnet 5.5** ◆ | `Claude Sonnet 5.5` | — |
| **Claude Haiku 5.5** ◆ | `Claude Haiku 5.5` | — |
| **Claude Opus 5** ○ | `claude-opus-5` | — |
| **Claude Opus 4.8** ◆ | `claude-opus-4.8` | — |
| **Claude Opus 4.7** ○ | `claude-opus-4.7` | — |
| **Claude Opus 4.6** ◆ | `Claude Opus 4.6` | — |
| **Claude Opus 4.5** ○ | `claude-opus-4.5` | — |
| **Claude Sonnet 5** ○ | `claude-sonnet-5` | — |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4.6` | — |
| **Claude Sonnet 4.5** ○ | `claude-sonnet-4.5` | — |
| **Claude Haiku 4.5** ○ | `claude-haiku-4.5` | — |
| **Kimi K3** ◆ | `Kimi K3` | — |
| **DeepSeek-V3.2** ○ | `deepseek-3.2` | — |
| **MiniMax-M2.5** ○ | `minimax-m2.5` | — |
| **MiniMax-M2.1** ◆ | `MiniMax M2.1` | — |
| **GLM-5** ◆ | `GLM-5` | — |
| **Qwen3-Coder-Next** ◆ | `Qwen3 Coder Next` | — |

**Sources:**
[Models](https://kiro.dev/docs/models/) ·
[Available models](https://kiro.dev/docs/models/available-models/) ·
[Slash commands](https://kiro.dev/docs/reference/slash-commands/) ·
[Settings](https://kiro.dev/docs/reference/settings/) ·
[Headless mode](https://kiro.dev/docs/cli/headless/) ·
[Agent configuration](https://kiro.dev/docs/custom-agents/configuration-reference/) ·
[Arm install guide: `/model` output](https://learn.arm.com/install-guides/kiro-cli/)

---

## OpenHands — OpenHands / All Hands AI

Default: `openai/gpt-5.6-sol` (pre-selected in Agent Canvas setup; DeepSeek-V4-Flash is the free OpenHands-routed model)
Select: Settings → LLM (`LLM Provider` and `LLM Model` dropdowns, or `Custom Model` under Advanced), saved LLM profiles and `/model <profile-name>` mid-conversation, `model` in `~/.openhands/agent_settings.json` (CLI), `LLM_MODEL` with `--override-with-envs`
Providers: OpenHands (hosted proxy, `openhands/` prefix), Anthropic, OpenAI, Google Gemini and Vertex AI, AWS Bedrock, Azure, Mistral, DeepSeek, Moonshot, MiniMax, GLM, NVIDIA, Qwen, OpenRouter, DigitalOcean, Groq, LiteLLM proxy, local servers (Ollama, LM Studio, vLLM, SGLang); any LiteLLM-supported model works
ID format: LiteLLM `<provider>/<model>`, e.g. `openhands/<model>`, `anthropic/<model>`, `openrouter/<vendor>/<model>`

| Model | ID | Aliases |
|---|---|---|
| **GPT-5.6 Sol** ◆ | `openai/gpt-5.6-sol` | `openrouter/openai/gpt-5.6-sol` |
| **GPT-5.5** ◆ | `openai/gpt-5.5` | — |
| **GLM-5.1** ◆ | `openrouter/z-ai/glm-5.1` | — |
| **GLM-5** ◆ | `openrouter/z-ai/glm-5` | — |
| **Kimi K2.6** ◆ | `openrouter/moonshotai/kimi-k2.6` | — |
| **Kimi K2.5** ◆ | `openrouter/moonshotai/kimi-k2.5` | — |
| **MiniMax-M3** ◆ | `openhands/minimax-m3` | `openrouter/minimax/minimax-m3` |
| **Claude Opus 5.5** ○ | `openhands/claude-opus-5-5` | `anthropic/claude-opus-5-5` |
| **Claude Opus 5** ○ | `openhands/claude-opus-5` | `anthropic/claude-opus-5`, `openrouter/anthropic/claude-opus-5` |
| **Claude Sonnet 5.5** ○ | `openhands/claude-sonnet-5-5` | `anthropic/claude-sonnet-5-5`, `openrouter/anthropic/claude-sonnet-5.5` |
| **Claude Sonnet 5** ○ | `openhands/claude-sonnet-5` | `anthropic/claude-sonnet-5`, `openrouter/anthropic/claude-sonnet-5` |
| **Claude Fable 5.1** ○ | `openhands/claude-fable-5-1` | `anthropic/claude-fable-5-1` |
| **Claude Fable 5** ○ | `openhands/claude-fable-5` | `anthropic/claude-fable-5` |
| **Claude Haiku 5.5** ○ | `anthropic/claude-haiku-5.5` | `openrouter/anthropic/claude-haiku-5.5` |
| **GPT-6.1 Sol** ○ | `openhands/gpt-6.1-sol` | `openai/gpt-6.1-sol`, `openrouter/openai/gpt-6.1-sol` |
| **GPT-6 Sol** ○ | `openhands/gpt-6-sol` | `openai/gpt-6-sol` |
| **GPT-6 Luna** ○ | `openhands/gpt-6-luna` | `openai/gpt-6-luna` |
| **GPT-6 Astra** ○ | `openhands/gpt-6-astra` | `openai/gpt-6-astra`, `openrouter/openai/gpt-6-astra` |
| **GPT-5.6** ○ | `openhands/gpt-5.6` | `openai/gpt-5.6` |
| **GPT-5.3-Codex** ○ | `openhands/gpt-5.3-codex` | `openai/gpt-5.3-codex`, `openrouter/openai/gpt-5.3-codex` |
| **GPT-5.2-Codex** ○ | `openhands/gpt-5.2-codex` | `openai/gpt-5.2-codex`, `openrouter/openai/gpt-5.2-codex` |
| **MiniMax-M3.1-Flash** ○ | `openhands/minimax-m3.1-flash` | — |
| **MiniMax-M2.7** ○ | `openhands/minimax-m2.7` | — |
| **Gemini 4 Argon** ○ | `gemini/gemini-4-argon` | `openrouter/google/gemini-4-argon` |
| **Gemini 3.1 Pro** ○ | `openhands/gemini-3.1-pro` | `openhands/gemini-3.1-pro-preview`, `openrouter/google/gemini-3.1-pro-preview` |
| **Gemini 3.8 Flash** ○ | `openhands/gemini-3.8-flash` | `openrouter/google/gemini-3.8-flash` |
| **Gemini 3.7 Flash** ○ | `openhands/gemini-3.7-flash` | `openrouter/google/gemini-3.7-flash` |
| **Gemini 3.5 Flash-Lite** ○ | `openhands/gemini-3.5-flash-lite` | `openrouter/google/gemini-3.5-flash-lite` |
| **Gemini 3.1 Flash-Lite** ○ | `gemini/gemini-3.1-flash-lite` | — |
| **DeepSeek-V4-Pro** ○ | `openhands/deepseek-v4-pro` | `openrouter/deepseek/deepseek-v4-pro` |
| **DeepSeek-V4-Flash** ○ | `openhands/deepseek-v4-flash` | `openhands/deepseek-v4-flash-vision-exp`, `openrouter/deepseek/deepseek-v4-flash` |
| **DeepSeek-V4.1-Flash** ○ | `openhands/deepseek-v4.1-flash` | — |
| **DeepSeek-V3.2** ○ | `openhands/deepseek-v3.2-reasoner` | — |
| **Kimi K3** ○ | `openhands/kimi-k3` | `openrouter/moonshotai/kimi-k3` |
| **Kimi K2.7 Code** ○ | `openhands/kimi-k2.7-code` | `openrouter/moonshotai/kimi-k2.7-code` |
| **Kimi For Coding** ○ | `moonshot/kimi-for-coding` | — |
| **Devstral 2** ○ | `openhands/devstral-2512` | `openhands/devstral-medium-2512`, `openrouter/mistralai/devstral-2512` |
| **GLM-5.3** ○ | `openhands/glm-5.3` | `openrouter/z-ai/glm-5.3` |
| **GLM-5.3-Flash** ○ | `openhands/glm-5.3-flash` | `openrouter/z-ai/glm-5.3-flash` |
| **GLM-5.2** ○ | `openhands/glm-5.2` | `openrouter/z-ai/glm-5.2` |
| **Nemotron 3.5 Lightning** ○ | `openhands/nemotron-3.5-lightning-30b-a3b` | — |
| **Nemotron 3 Nano** ○ | `openhands/nemotron-3-nano` | — |
| **Nemotron 3 Nano Omni** ○ | `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning` | — |
| **Nemotron 3 Super** ○ | `openhands/nemotron-3-super-120b-a12b` | — |
| **Nemotron 3 Ultra** ○ | `openhands/nemotron-3-ultra-550b-a55b` | — |
| **Qwen3.8-Max** ○ | `openhands/qwen3.8-max` | — |
| **Qwen3.7-Max** ○ | `openhands/qwen3.7-max` | — |
| **Qwen3.7-Plus** ○ | `openhands/qwen3.7-plus` | — |
| **Qwen3.6-Plus** ○ | `openhands/qwen3.6-plus` | — |
| **Qwen3.8-Flash** ○ | `openhands/qwen3.8-flash` | — |
| **Qwen3.7-Flash** ○ | `openhands/qwen3.7-flash` | — |
| **Qwen3-Coder-480B-A35B** ○ | `openhands/qwen3-coder-480b` | — |
| **Qwen3-Coder-Next** ○ | `openhands/qwen3-coder-next` | — |
| **Qwen3-Coder-Plus** ○ | `openhands/qwen3-coder-plus` | — |
| **Qwen3-Coder-Flash** ○ | `openhands/qwen3-coder-flash` | — |
| **Trinity Large Thinking** ○ | `openhands/trinity-large-thinking` | — |

**Sources:**
[LLM overview and recommendations](https://docs.openhands.dev/openhands/usage/llms/llms) ·
[OpenHands LLM provider](https://docs.openhands.dev/openhands/usage/llms/openhands-llms) ·
[LLM settings and profiles](https://docs.openhands.dev/openhands/usage/settings/llm-settings) ·
[Agent Canvas first-time setup](https://docs.openhands.dev/openhands/usage/agent-canvas/first-time-setup) ·
[CLI command reference](https://docs.openhands.dev/openhands/usage/cli/command-reference) ·
[Verified model lists (SDK source)](https://github.com/OpenHands/software-agent-sdk/blob/main/openhands-sdk/openhands/sdk/llm/utils/verified_models.py)

---

## Devin Desktop — Cognition

Default: `swe-1-6-fast` (an enterprise team default overrides it; the free tier only gets SWE-1.6)
Select: model picker under the agent input box; the Devin CLI harness it shares takes `devin --model <id>`, `/model <id>` and `agent.model` in `~/.config/devin/config.json`. `adaptive` picks a model per request, `fusion` opens the lead + sidekick picker, and short names `opus`, `sonnet`, `swe`, `codex`, `gpt` and `gemini` resolve to the newest model in that family
Providers: Cognition-hosted; models from Anthropic, OpenAI, Google, xAI, DeepSeek, Z.ai, Moonshot, NVIDIA, Thinking Machines and Cognition (enterprise admins can restrict them with an allowlist)
ID format: model UID as listed on the Models page, with effort and speed suffixes (`-low` … `-max`, `-fast` or `-priority`)

| Model | ID | Aliases |
|---|---|---|
| **Claude Fable 5.1** ◆ | `claude-fable-5-1-medium` | `claude-fable-5-1-high`, `claude-fable-5-1-low`, `claude-fable-5-1-max`, `claude-fable-5-1-xhigh` |
| **Claude Fable 5** ◆ | `claude-5-fable-medium` | `claude-5-fable-high`, `claude-5-fable-low`, `claude-5-fable-max`, `claude-5-fable-xhigh` |
| **Claude Opus 5.5** ◆ | `claude-opus-5-5-medium` | `claude-opus-5-5-high-fast`, `claude-opus-5-5-high`, `claude-opus-5-5-low-fast`, `claude-opus-5-5-low`, `claude-opus-5-5-max-fast`, `claude-opus-5-5-max`, `claude-opus-5-5-medium-fast`, `claude-opus-5-5-xhigh-fast`, `claude-opus-5-5-xhigh` |
| **Claude Opus 5** ◆ | `claude-opus-5-medium` | `claude-opus-5-high-fast`, `claude-opus-5-high`, `claude-opus-5-low-fast`, `claude-opus-5-low`, `claude-opus-5-max-fast`, `claude-opus-5-max`, `claude-opus-5-medium-fast`, `claude-opus-5-xhigh-fast`, `claude-opus-5-xhigh` |
| **Claude Opus 4.8** ◆ | `claude-opus-4-8-medium` | `claude-opus-4-8-high-fast`, `claude-opus-4-8-high`, `claude-opus-4-8-low-fast`, `claude-opus-4-8-low`, `claude-opus-4-8-max-fast`, `claude-opus-4-8-max`, `claude-opus-4-8-medium-fast`, `claude-opus-4-8-xhigh-fast`, `claude-opus-4-8-xhigh` |
| **Claude Opus 4.7** ◆ | `claude-opus-4-7-medium` | `claude-opus-4-7-high`, `claude-opus-4-7-low`, `claude-opus-4-7-max`, `claude-opus-4-7-xhigh` |
| **Claude Opus 4.6** ◆ | `claude-opus-4-6` | `claude-opus-4-6-1m`, `claude-opus-4-6-thinking-1m`, `claude-opus-4-6-thinking` |
| **Claude Opus 4.5** ◆ | `MODEL_CLAUDE_4_5_OPUS` | `MODEL_CLAUDE_4_5_OPUS_THINKING` |
| **Claude Sonnet 5.5** ◆ | `claude-sonnet-5-5-medium` | `claude-sonnet-5-5-high`, `claude-sonnet-5-5-low`, `claude-sonnet-5-5-max`, `claude-sonnet-5-5-xhigh` |
| **Claude Sonnet 5** ◆ | `claude-sonnet-5-medium` | `claude-sonnet-5-high`, `claude-sonnet-5-low`, `claude-sonnet-5-max`, `claude-sonnet-5-xhigh` |
| **Claude Sonnet 4.6** ◆ | `claude-sonnet-4-6` | `claude-sonnet-4-6-1m`, `claude-sonnet-4-6-thinking-1m`, `claude-sonnet-4-6-thinking` |
| **Claude Haiku 4.5** ◆ | `MODEL_PRIVATE_11` | — |
| **GPT-6.1 Sol** ◆ | `gpt-6-1-sol-medium` | `gpt-6-1-sol-high-priority`, `gpt-6-1-sol-high`, `gpt-6-1-sol-low-priority`, `gpt-6-1-sol-low`, `gpt-6-1-sol-max-priority`, `gpt-6-1-sol-max`, `gpt-6-1-sol-medium-priority`, `gpt-6-1-sol-xhigh-priority`, `gpt-6-1-sol-xhigh` |
| **GPT-6 Astra** ◆ | `gpt-6-astra-medium` | `gpt-6-astra-high-priority`, `gpt-6-astra-high`, `gpt-6-astra-low-priority`, `gpt-6-astra-low`, `gpt-6-astra-max-priority`, `gpt-6-astra-max`, `gpt-6-astra-medium-priority`, `gpt-6-astra-xhigh-priority`, `gpt-6-astra-xhigh` |
| **GPT-6 Sol** ◆ | `gpt-6-sol-medium` | `gpt-6-sol-high-priority`, `gpt-6-sol-high`, `gpt-6-sol-low-priority`, `gpt-6-sol-low`, `gpt-6-sol-max-priority`, `gpt-6-sol-max`, `gpt-6-sol-medium-priority`, `gpt-6-sol-none-priority`, `gpt-6-sol-none`, `gpt-6-sol-xhigh-priority`, `gpt-6-sol-xhigh` |
| **GPT-6 Luna** ◆ | `gpt-6-luna-medium` | `gpt-6-luna-high-priority`, `gpt-6-luna-high`, `gpt-6-luna-low-priority`, `gpt-6-luna-low`, `gpt-6-luna-max-priority`, `gpt-6-luna-max`, `gpt-6-luna-medium-priority`, `gpt-6-luna-none-priority`, `gpt-6-luna-none`, `gpt-6-luna-xhigh-priority`, `gpt-6-luna-xhigh` |
| **GPT-5.6 Sol** ◆ | `gpt-5-6-sol-medium` | `gpt-5-6-sol-high-priority`, `gpt-5-6-sol-high`, `gpt-5-6-sol-low-priority`, `gpt-5-6-sol-low`, `gpt-5-6-sol-max-priority`, `gpt-5-6-sol-max`, `gpt-5-6-sol-medium-priority`, `gpt-5-6-sol-none-priority`, `gpt-5-6-sol-none`, `gpt-5-6-sol-xhigh-priority`, `gpt-5-6-sol-xhigh` |
| **GPT-5.6 Terra** ◆ | `gpt-5-6-terra-medium` | `gpt-5-6-terra-high-priority`, `gpt-5-6-terra-high`, `gpt-5-6-terra-low-priority`, `gpt-5-6-terra-low`, `gpt-5-6-terra-max-priority`, `gpt-5-6-terra-max`, `gpt-5-6-terra-medium-priority`, `gpt-5-6-terra-none-priority`, `gpt-5-6-terra-none`, `gpt-5-6-terra-xhigh-priority`, `gpt-5-6-terra-xhigh` |
| **GPT-5.6 Luna** ◆ | `gpt-5-6-luna-medium` | `gpt-5-6-luna-high-priority`, `gpt-5-6-luna-high`, `gpt-5-6-luna-low-priority`, `gpt-5-6-luna-low`, `gpt-5-6-luna-max-priority`, `gpt-5-6-luna-max`, `gpt-5-6-luna-medium-priority`, `gpt-5-6-luna-none-priority`, `gpt-5-6-luna-none`, `gpt-5-6-luna-xhigh-priority`, `gpt-5-6-luna-xhigh` |
| **GPT-5.5** ◆ | `gpt-5-5-medium` | `gpt-5-5-high-priority`, `gpt-5-5-high`, `gpt-5-5-low-priority`, `gpt-5-5-low`, `gpt-5-5-medium-priority`, `gpt-5-5-none-priority`, `gpt-5-5-none`, `gpt-5-5-xhigh-priority`, `gpt-5-5-xhigh` |
| **GPT-5.4** ◆ | `gpt-5-4-medium` | `gpt-5-4-high-priority`, `gpt-5-4-high`, `gpt-5-4-low-priority`, `gpt-5-4-low`, `gpt-5-4-medium-priority`, `gpt-5-4-none-priority`, `gpt-5-4-none`, `gpt-5-4-xhigh-priority`, `gpt-5-4-xhigh` |
| **GPT-5.4 mini** ◆ | `gpt-5-4-mini-medium` | `gpt-5-4-mini-high`, `gpt-5-4-mini-low`, `gpt-5-4-mini-xhigh` |
| **GPT-5.3-Codex** ◆ | `gpt-5-3-codex-medium` | `gpt-5-3-codex-high-priority`, `gpt-5-3-codex-high`, `gpt-5-3-codex-low-priority`, `gpt-5-3-codex-low`, `gpt-5-3-codex-medium-priority`, `gpt-5-3-codex-xhigh-priority`, `gpt-5-3-codex-xhigh` |
| **GPT-5.3-Codex-Spark** ◆ | `gpt-5-3-codex-spark-medium` | — |
| **GPT-5.2** ◆ | `MODEL_GPT_5_2_MEDIUM` | `MODEL_GPT_5_2_HIGH_PRIORITY`, `MODEL_GPT_5_2_HIGH`, `MODEL_GPT_5_2_LOW_PRIORITY`, `MODEL_GPT_5_2_LOW`, `MODEL_GPT_5_2_MEDIUM_PRIORITY`, `MODEL_GPT_5_2_NONE_PRIORITY`, `MODEL_GPT_5_2_NONE`, `MODEL_GPT_5_2_XHIGH_PRIORITY`, `MODEL_GPT_5_2_XHIGH` |
| **GPT-5.1** ◆ | `MODEL_PRIVATE_14` | `MODEL_PRIVATE_12`, `MODEL_PRIVATE_13`, `MODEL_PRIVATE_15`, `MODEL_PRIVATE_20`, `MODEL_PRIVATE_21`, `MODEL_PRIVATE_22`, `MODEL_PRIVATE_23` |
| **GPT-5** ◆ | `MODEL_PRIVATE_7` | `MODEL_PRIVATE_6`, `MODEL_PRIVATE_8` |
| **GPT-4.1** ◆ | `MODEL_CHAT_GPT_4_1_2025_04_14` | — |
| **GPT-4o** ◆ | `MODEL_CHAT_GPT_4O_2024_08_06` | — |
| **o3** ◆ | `MODEL_CHAT_O3` | `MODEL_CHAT_O3_HIGH` |
| **gpt-oss-120b** ◆ | `MODEL_GPT_OSS_120B` | — |
| **Gemini 4 Argon** ◆ | `gemini-4-argon-medium` | `gemini-4-argon-high`, `gemini-4-argon-low` |
| **Gemini 3.8 Flash** ◆ | `gemini-3-8-flash-medium` | `gemini-3-8-flash-high`, `gemini-3-8-flash-low` |
| **Gemini 3.7 Flash** ◆ | `gemini-3-7-flash-medium` | `gemini-3-7-flash-high`, `gemini-3-7-flash-low` |
| **Gemini 3.6 Flash** ◆ | `gemini-3-6-flash-medium` | `gemini-3-6-flash-high`, `gemini-3-6-flash-low`, `gemini-3-6-flash-minimal` |
| **Gemini 3.5 Flash** ◆ | `gemini-3-5-flash-medium` | `gemini-3-5-flash-high`, `gemini-3-5-flash-low`, `gemini-3-5-flash-minimal` |
| **Gemini 3.1 Pro** ◆ | `gemini-3-1-pro-high` | `gemini-3-1-pro-low` |
| **Gemini 3 Flash** ◆ | `MODEL_GOOGLE_GEMINI_3_0_FLASH_MEDIUM` | `MODEL_GOOGLE_GEMINI_3_0_FLASH_HIGH`, `MODEL_GOOGLE_GEMINI_3_0_FLASH_LOW`, `MODEL_GOOGLE_GEMINI_3_0_FLASH_MINIMAL` |
| **Gemini 2.5 Pro** ◆ | `MODEL_GOOGLE_GEMINI_2_5_PRO` | — |
| **Grok 4.7** ◆ | `grok-4-7-medium` | `grok-4-7-high`, `grok-4-7-low`, `grok-4-7-xhigh` |
| **Grok 4.6** ◆ | `grok-4-6-medium` | `grok-4-6-high`, `grok-4-6-low`, `grok-4-6-xhigh` |
| **Grok 4.5** ◆ | `grok-4-5-medium` | `grok-4-5-high`, `grok-4-5-low` |
| **Grok Code Fast 1** ◆ | `MODEL_PRIVATE_4` | — |
| **Grok 3** ◆ | `MODEL_XAI_GROK_3` | — |
| **Grok 3 Mini** ◆ | `MODEL_XAI_GROK_3_MINI_REASONING` | — |
| **SWE-2** ◆ | `swe-2-medium` | `swe-2-high`, `swe-2-max` |
| **SWE-1.7** ◆ | `swe-1-7-medium` | `swe-1-7` |
| **SWE-1.7 Lightning** ◆ | `swe-1-7-lightning-medium` | `swe-1-7-lightning` |
| **SWE-1.6** ◆ | `swe-1-6` | — |
| **SWE-1.6 Fast** ◆ | `swe-1-6-fast` | — |
| **DeepSeek-V4-Pro** ◆ | `deepseek-v4-pro-high` | `deepseek-v4-pro-low`, `deepseek-v4-pro-max` |
| **DeepSeek-V4.1-Flash** ◆ | `deepseek-v4-1-flash-high` | `deepseek-v4-1-flash-max` |
| **DeepSeek-V4-Flash** ◆ | `deepseek-v4-flash-high` | `deepseek-v4-flash-low`, `deepseek-v4-flash-max` |
| **GLM-5.3** ◆ | `glm-5-3-high` | `glm-5-3-low`, `glm-5-3-max` |
| **GLM-5.3-Flash** ◆ | `glm-5-3-flash-high` | `glm-5-3-flash-low`, `glm-5-3-flash-max` |
| **GLM-5.2** ◆ | `glm-5-2` | `glm-5-2-1m`, `glm-5-2-max-1m`, `glm-5-2-max`, `glm-5-2-none-1m`, `glm-5-2-none` |
| **Kimi K3** ◆ | `kimi-k3-high` | `kimi-k3-low`, `kimi-k3-max` |
| **Kimi K2.7** ◆ | `kimi-k2-7` | — |
| **Kimi K2.6** ◆ | `kimi-k2-6` | — |
| **Nemotron 3 Ultra** ◆ | `nemotron-3-ultra-medium` | `nemotron-3-ultra-high`, `nemotron-3-ultra-none` |
| **Inkling** ◆ | `inkling-medium` | `inkling-high`, `inkling-low`, `inkling-max`, `inkling-none`, `inkling-xhigh` |

**Sources:**
[AI models](https://docs.devin.ai/desktop/models) ·
[CLI models](https://docs.devin.ai/cli/models) ·
[Adaptive](https://docs.devin.ai/desktop/adaptive) ·
[Fusion](https://docs.devin.ai/desktop/fusion) ·
[CLI config file](https://docs.devin.ai/cli/reference/configuration/config-file) ·
[CLI changelog (stable)](https://docs.devin.ai/cli/changelog/stable)

---

*Last verified: 20261026*
