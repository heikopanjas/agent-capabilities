// Parses models.md into a structured model. Same conventions as the config
// document (## Agent — Vendor, > callouts, **Sources:**, Last verified), with
// "Label: value" meta lines (Default, Select, Providers, ID format) and a
// 3-column Model | ID | Aliases table per agent.

import { CONFIDENCE, inline, parseCallout, parseLinks, slugify, splitRow, stripHtml } from "./parse.mjs";

const META_RE = /^([A-Z][A-Za-z ]{1,24}):\s+(.+)$/;

function parseModelCell(cell) {
  const m = cell.match(/^\*\*(.+?)\*\*\s*([★◆○])?\s*$/);
  if (!m) return { name: stripHtml(inline(cell)), marker: null };
  return { name: m[1].trim(), marker: m[2] || null };
}

/** Parse the document. Never throws; use validateModels() for the strict gate. */
export function parseModels(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const doc = { title: "", introHtml: [], lastVerified: null, agents: [], closingHtml: [] };
  let section = "preamble"; // preamble | agent | notes
  let agent = null;
  let inSources = false;
  let pendingCallout = null;

  const flushCallout = () => {
    if (pendingCallout && agent) agent.callouts.push(parseCallout(pendingCallout.join(" ")));
    pendingCallout = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    const verified = line.match(/^\*Last verified:\s*(\d{4})-?(\d{2})-?(\d{2})\*$/);
    if (verified) {
      doc.lastVerified = `${verified[1]}-${verified[2]}-${verified[3]}`;
      continue;
    }
    if (line.startsWith("# ")) {
      doc.title = line.slice(2).trim();
      continue;
    }
    if (line.startsWith("## ")) {
      flushCallout();
      inSources = false;
      const heading = line.slice(3).trim();
      if (/^notes$/i.test(heading)) {
        section = "notes";
        agent = null;
        continue;
      }
      const [name, ...vendorParts] = heading.split(" — ");
      agent = {
        slug: slugify(name),
        name: name.trim(),
        vendor: vendorParts.join(" — ").trim(),
        meta: [],
        callouts: [],
        rows: [],
        notesHtml: [],
        sources: [],
      };
      doc.agents.push(agent);
      section = "agent";
      continue;
    }
    if (/^---+$/.test(line.trim())) {
      flushCallout();
      inSources = false;
      continue;
    }

    if (section === "preamble") {
      if (line.trim()) doc.introHtml.push(inline(line.trim()));
      continue;
    }
    if (section === "notes") {
      if (line.trim()) doc.closingHtml.push(inline(line.trim()));
      continue;
    }

    // section === "agent"
    if (line.startsWith(">")) {
      (pendingCallout ||= []).push(line.replace(/^>\s?/, ""));
      continue;
    }
    flushCallout();
    if (!line.trim()) continue;

    if (line.startsWith("|")) {
      const cells = splitRow(line);
      if (/^:?-{3,}/.test(cells[0]) || /^model$/i.test(cells[0])) continue;
      const { name, marker } = parseModelCell(cells[0] || "");
      const idHtml = inline(cells[1] ?? "");
      const aliasesHtml = inline(cells[2] ?? "");
      agent.rows.push({
        name,
        slug: slugify(name),
        marker,
        confidence: marker ? CONFIDENCE[marker].key : null,
        idHtml,
        aliasesHtml,
        idText: stripHtml(idHtml),
        aliasesText: stripHtml(aliasesHtml),
        cellCount: cells.length,
      });
      continue;
    }
    if (line.startsWith("**Sources:**")) {
      inSources = true;
      agent.sources.push(...parseLinks(line));
      continue;
    }
    if (inSources) {
      agent.sources.push(...parseLinks(line));
      continue;
    }
    const meta = line.match(META_RE);
    if (meta) {
      const html = inline(meta[2].trim());
      agent.meta.push({ label: meta[1].trim(), html, text: stripHtml(html) });
      continue;
    }
    agent.notesHtml.push(inline(line.trim()));
  }
  flushCallout();
  return doc;
}

/**
 * Strict structural gate. `agents` are the config document's agents: every
 * models.md section must name one of them, since slugs join the two files.
 */
export function validateModels(doc, agents) {
  const problems = [];
  const known = new Set(agents.map((a) => a.slug));
  if (!doc.lastVerified) problems.push('missing "*Last verified: YYYYMMDD*" line');
  if (doc.agents.length === 0) problems.push("no agent sections found");
  const slugs = new Set();
  for (const a of doc.agents) {
    if (!known.has(a.slug)) problems.push(`${a.name}: no agent with this name in coding-agent-config-locations.md`);
    if (slugs.has(a.slug)) problems.push(`duplicate agent section "${a.name}"`);
    slugs.add(a.slug);
    if (!a.vendor) problems.push(`${a.name}: heading has no " — Vendor" part`);
    if (a.rows.length === 0) problems.push(`${a.name}: no model table rows`);
    if (a.sources.length === 0) problems.push(`${a.name}: no sources`);
    const names = new Set();
    for (const r of a.rows) {
      if (r.cellCount !== 3) problems.push(`${a.name} / ${r.name}: expected 3 table cells, found ${r.cellCount}`);
      if (!r.marker) problems.push(`${a.name} / ${r.name}: missing confidence marker (★ ◆ ○)`);
      if (!r.idText || r.idText === "—") problems.push(`${a.name} / ${r.name}: empty ID cell`);
      if (names.has(r.slug)) problems.push(`${a.name}: model "${r.name}" listed twice`);
      names.add(r.slug);
    }
  }
  if (problems.length) {
    const err = new Error(`models.md failed validation:\n  - ${problems.join("\n  - ")}`);
    err.problems = problems;
    throw err;
  }
  return doc;
}
