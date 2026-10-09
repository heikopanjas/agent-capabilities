import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { categorize, parse, validate } from "../lib/parse.mjs";
import { diffModels, wordDiffHtml } from "../lib/history.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const DOC = readFileSync(join(ROOT, "coding-agent-config-locations.md"), "utf8");

test("current document parses and passes validation", () => {
  const model = validate(parse(DOC));
  assert.ok(model.agents.length >= 17, `expected ≥ 17 agents, got ${model.agents.length}`);
  for (const a of model.agents) {
    assert.ok(a.rows.length > 0, `${a.name} has rows`);
    assert.ok(a.sources.length > 0, `${a.name} has sources`);
  }
  const fileDate = DOC.match(/\*Last verified: (\d{4})(\d{2})(\d{2})\*/);
  assert.equal(model.lastVerified, `${fileDate[1]}-${fileDate[2]}-${fileDate[3]}`);
});

test("Claude Code has a spec-stable Skills row", () => {
  const cc = parse(DOC).agents.find((a) => a.slug === "claude-code");
  const skills = cc.rows.find((r) => r.feature === "Skills");
  assert.equal(skills.marker, "★");
  assert.match(skills.globalText, /~\/\.claude\/skills/);
});

test("escaped pipes stay inside their cell", () => {
  const md = `## Tool — Vendor\n\n| Feature | Global (user) | Project (repo) |\n|---|---|---|\n| **Agents** ◆ | a \`x\\|y\` b | c |\n\n**Sources:**\n[Docs](https://example.com)\n\n*Last verified: 20260101*\n`;
  const row = parse(md).agents[0].rows[0];
  assert.equal(row.cellCount, 3);
  assert.match(row.globalText, /x\|y/);
});

test("validation rejects a broken table row", () => {
  const broken = DOC.replace(/^\| \*\*Skills\*\* ★ \|(.*)$/m, "| **Skills** ★ | only-one-cell");
  assert.notEqual(broken, DOC);
  assert.throws(() => validate(parse(broken)), /expected 3 table cells/);
});

test("categorize maps compound labels", () => {
  assert.deepEqual(categorize("Skills / subagents / MCP"), ["skills", "agents", "mcp"]);
  assert.deepEqual(categorize("Agent memory"), ["memory"]);
  assert.deepEqual(categorize("Model config"), ["settings"]);
  assert.deepEqual(categorize("Modes"), ["commands"]);
});

test("diffModels reports cell, confidence and source changes", () => {
  const base = (global, marker, url) =>
    parse(
      `## Tool — Vendor\n\n| Feature | Global (user) | Project (repo) |\n|---|---|---|\n| **Skills** ${marker} | ${global} | — |\n\n**Sources:**\n[Docs](${url})\n\n*Last verified: 20260101*\n`,
    );
  const groups = diffModels(base("`~/.tool/skills/`", "◆", "https://a.example"), base("`~/.tool/skills/` and `~/.agents/skills/`", "★", "https://b.example"));
  const kinds = groups[0].items.map((i) => i.kind).sort();
  assert.deepEqual(kinds, ["changed", "confidence", "sources"]);
  assert.match(groups[0].items.find((i) => i.kind === "changed").diffHtml, /<ins>.*agents\/skills/);
});

test("wordDiffHtml escapes HTML and marks edits", () => {
  const html = wordDiffHtml("<repo>/a.md", "<repo>/b.md");
  assert.ok(!html.includes("<repo>"));
  assert.match(html, /<del>/);
  assert.match(html, /<ins>/);
});
