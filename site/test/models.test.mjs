import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "../lib/parse.mjs";
import { parseModels, validateModels } from "../lib/parse-models.mjs";
import { diffModelDocs } from "../lib/history.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CONFIG = parse(readFileSync(join(ROOT, "coding-agent-config-locations.md"), "utf8"));
const DOC = readFileSync(join(ROOT, "models.md"), "utf8");

const section = (heading, rows, extra = "") =>
  `## ${heading}\n\nDefault: \`a\`\nSelect: \`--model <id>\`\n${extra}\n| Model | ID | Aliases |\n|---|---|---|\n${rows}\n\n**Sources:**\n[Docs](https://example.com)\n\n---\n`;
const doc = (...sections) => `# Models\n\n${sections.join("\n")}\n*Last verified: 20260101*\n`;

test("current models.md parses and passes validation", () => {
  const models = validateModels(parseModels(DOC), CONFIG.agents);
  assert.ok(models.agents.length >= 10, `expected ≥ 10 agents, got ${models.agents.length}`);
  for (const a of models.agents) {
    assert.ok(a.rows.length > 0, `${a.name} has rows`);
    assert.ok(a.meta.some((m) => m.label === "Select"), `${a.name} has a Select line`);
  }
  const fileDate = DOC.match(/\*Last verified: (\d{4})(\d{2})(\d{2})\*/);
  assert.equal(models.lastVerified, `${fileDate[1]}-${fileDate[2]}-${fileDate[3]}`);
});

test("rows, meta lines and sources are parsed", () => {
  const m = parseModels(doc(section("Claude Code — Anthropic", "| **Claude Opus 9** ◆ | `claude-opus-9` | `opus`, `opus[1m]` |", "Providers: Anthropic API\n")));
  const a = m.agents[0];
  assert.equal(a.slug, "claude-code");
  assert.deepEqual(a.meta.map((x) => x.label), ["Default", "Select", "Providers"]);
  assert.equal(a.rows[0].name, "Claude Opus 9");
  assert.equal(a.rows[0].marker, "◆");
  assert.equal(a.rows[0].idText, "claude-opus-9");
  assert.equal(a.rows[0].aliasesText, "opus, opus[1m]");
  assert.equal(a.sources[0].url, "https://example.com");
});

test("validation rejects an agent missing from the config document", () => {
  const m = parseModels(doc(section("Nonexistent Agent — Nobody", "| **Some Model** ◆ | `some-model` | — |")));
  assert.throws(() => validateModels(m, CONFIG.agents), /no agent with this name/);
});

test("validation rejects a row without a marker", () => {
  const m = parseModels(doc(section("Claude Code — Anthropic", "| **Claude Opus 9** | `claude-opus-9` | — |")));
  assert.throws(() => validateModels(m, CONFIG.agents), /missing confidence marker/);
});

test("validation rejects a row with the wrong cell count", () => {
  const m = parseModels(doc(section("Claude Code — Anthropic", "| **Claude Opus 9** ◆ | `claude-opus-9` |")));
  assert.throws(() => validateModels(m, CONFIG.agents), /expected 3 table cells/);
});

test("diffModelDocs reports added models, changed aliases and changed meta lines", () => {
  const before = parseModels(doc(section("Claude Code — Anthropic", "| **Claude Opus 9** ◆ | `claude-opus-9` | `opus` |")));
  const after = parseModels(
    doc(
      section("Claude Code — Anthropic", "| **Claude Opus 9** ◆ | `claude-opus-9` | `opus`, `opus[1m]` |\n| **Claude Sonnet 9** ○ | `claude-sonnet-9` | `sonnet` |").replace(
        "Default: `a`",
        "Default: `b`",
      ),
    ),
  );
  const [group] = diffModelDocs(before, after);
  assert.equal(group.slug, "claude-code");
  const byKind = Object.groupBy(group.items, (i) => i.kind);
  assert.equal(byKind.added[0].what, "Claude Sonnet 9");
  assert.equal(byKind.added[0].marker, "○");
  const changed = byKind.changed.map((i) => `${i.what}/${i.column || ""}`).sort();
  assert.deepEqual(changed, ["Claude Opus 9/Aliases", "Default/"]);
});
