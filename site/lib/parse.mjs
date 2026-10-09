// Parses coding-agent-config-locations.md into a structured model.
// The Markdown file is the single source of truth; this parser follows its
// conventions (## Agent — Vendor, Home:, > callouts, 3-column feature table,
// **Sources:** link list, ## Notes, ### Cross-agent standards, Last verified).

import { marked } from "marked";

export const CONFIDENCE = {
  "★": { key: "stable", label: "Spec / stable" },
  "◆": { key: "documented", label: "Documented current" },
  "○": { key: "observed", label: "Observed" },
};

export const CATEGORIES = [
  { key: "instructions", label: "Instructions" },
  { key: "rules", label: "Rules" },
  { key: "settings", label: "Settings" },
  { key: "skills", label: "Skills" },
  { key: "agents", label: "Subagents" },
  { key: "commands", label: "Commands" },
  { key: "mcp", label: "MCP" },
  { key: "hooks", label: "Hooks" },
  { key: "memory", label: "Memory" },
  { key: "plugins", label: "Plugins" },
  { key: "other", label: "Other" },
];

// Checked in order against each "/"-separated part of a feature label.
const CATEGORY_RULES = [
  [/memory|history|persistence/, "memory"],
  [/system prompt|instruction|steering|identity|knowledge|convention|path-specific|specs?\b/, "instructions"],
  [/rules?\b/, "rules"],
  [/skill/, "skills"],
  [/agent|playbook/, "agents"],
  [/command|prompt|recipe|workflow|\bmodes?\b/, "commands"],
  [/mcp/, "mcp"],
  [/hook|automation/, "hooks"],
  [/plugin|extension|package/, "plugins"],
  [/setting|config|environment|trust|secret|permission|api key|model/, "settings"],
];

const FOOTNOTE_CHARS = "¹²³⁴⁵⁶⁷⁸⁹";
const FOOTNOTE_RE = new RegExp(`[${FOOTNOTE_CHARS}]`, "g");

export function slugify(s) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function categorize(label) {
  const cats = new Set();
  for (const part of label.toLowerCase().split("/")) {
    const hit = CATEGORY_RULES.find(([re]) => re.test(part.trim()));
    cats.add(hit ? hit[1] : "other");
  }
  return [...cats];
}

export function footnoteNumber(ch) {
  return FOOTNOTE_CHARS.indexOf(ch) + 1;
}

// Inline Markdown → HTML, with footnote superscripts turned into links.
export function inline(md, { footnoteHref = (n) => `#fn-${n}` } = {}) {
  const html = marked.parseInline(md, { gfm: true });
  return html.replace(FOOTNOTE_RE, (ch) => {
    const n = footnoteNumber(ch);
    return `<a class="fnref" href="${footnoteHref(n)}">${ch}</a>`;
  });
}

export function stripHtml(html) {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function splitRow(line) {
  const body = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return body.split(/(?<!\\)\|/).map((c) => c.trim().replace(/\\\|/g, "|"));
}

function footnotesIn(md) {
  return [...new Set((md.match(FOOTNOTE_RE) || []).map(footnoteNumber))];
}

function parseFeatureCell(cell) {
  const m = cell.match(/^\*\*(.+?)\*\*\s*([★◆○])?\s*(.*)$/);
  if (!m) return { feature: stripHtml(inline(cell)), marker: null, extra: "" };
  return { feature: m[1].trim(), marker: m[2] || null, extra: m[3].trim() };
}

function parseCallout(text) {
  const m = text.match(/^\*\*(.+?):\*\*\s*(.*)$/s);
  const label = m ? m[1].trim() : "Note";
  const body = m ? m[2] : text;
  const tone = /sunset|discontinu|acquir|deprecat|retir|shut/i.test(label) ? "warn" : "note";
  return { label, tone, html: inline(body), text: stripHtml(inline(body)) };
}

function parseLinks(md) {
  const links = [];
  for (const m of md.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
    links.push({ label: m[1], url: m[2] });
  }
  return links;
}

/**
 * Parse the document. Never throws on odd structure; use validate() for the
 * strict gate so that historical versions can still be parsed leniently.
 */
export function parse(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const model = {
    title: "",
    subtitle: "",
    introHtml: [],
    lastVerified: null,
    agents: [],
    footnotes: [],
    standards: [],
    closingHtml: [],
  };

  let section = "preamble"; // preamble | legend | agent | notes | standards
  let agent = null;
  let inSources = false;
  let projectFirst = false;
  let pendingCallout = null;
  let currentStandard = null;

  const flushCallout = () => {
    if (pendingCallout && agent) agent.callouts.push(parseCallout(pendingCallout.join(" ")));
    pendingCallout = null;
  };
  const flushStandard = () => {
    if (currentStandard) model.standards.push(currentStandard);
    currentStandard = null;
  };

  for (const raw of lines) {
    const line = raw.trimEnd();

    const verified = line.match(/^\*Last verified:\s*(\d{4})-?(\d{2})-?(\d{2})\*$/);
    if (verified) {
      model.lastVerified = `${verified[1]}-${verified[2]}-${verified[3]}`;
      continue;
    }

    if (line.startsWith("# ")) {
      model.title = line.slice(2).trim();
      continue;
    }

    if (line.startsWith("## ")) {
      flushCallout();
      flushStandard();
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
        homeHtml: "",
        homeText: "",
        callouts: [],
        columns: { global: "Global (user)", project: "Project (repo)" },
        rows: [],
        notesHtml: [],
        sourcesNoteHtml: "",
        sources: [],
      };
      model.agents.push(agent);
      section = "agent";
      continue;
    }

    if (line.startsWith("### ")) {
      flushCallout();
      const heading = line.slice(4).trim();
      if (/confidence markers/i.test(heading)) section = "legend";
      else if (/cross-agent standards/i.test(heading)) section = "standards";
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      flushCallout();
      inSources = false;
      continue;
    }

    if (section === "preamble") {
      if (!line.trim()) continue;
      if (!model.subtitle) model.subtitle = line.trim();
      else model.introHtml.push(inline(line.trim()));
      continue;
    }

    if (section === "legend") continue;

    if (section === "agent") {
      if (line.startsWith(">")) {
        const text = line.replace(/^>\s?/, "");
        if (!pendingCallout) pendingCallout = [];
        pendingCallout.push(text);
        continue;
      }
      flushCallout();

      if (!line.trim()) {
        continue;
      }
      if (line.startsWith("Home:")) {
        const md = line.slice(5).trim();
        agent.homeHtml = inline(md);
        agent.homeText = stripHtml(agent.homeHtml);
        continue;
      }
      if (line.startsWith("|")) {
        const cells = splitRow(line);
        if (/^:?-{3,}/.test(cells[0])) continue;
        if (/^feature$/i.test(cells[0])) {
          // Column order follows the header, so older revisions (Global first)
          // and the current layout (Project first) both parse correctly.
          projectFirst = /^project/i.test(cells[1] || "");
          const [globalHead, projectHead] = projectFirst ? [cells[2], cells[1]] : [cells[1], cells[2]];
          if (globalHead) agent.columns.global = globalHead;
          if (projectHead) agent.columns.project = projectHead;
          continue;
        }
        const { feature, marker, extra } = parseFeatureCell(cells[0] || "");
        const globalMd = (projectFirst ? cells[2] : cells[1]) ?? "";
        const projectMd = (projectFirst ? cells[1] : cells[2]) ?? "";
        const globalHtml = inline(globalMd);
        const projectHtml = inline(projectMd);
        agent.rows.push({
          feature,
          featureNote: extra ? inline(extra) : "",
          marker,
          confidence: marker ? CONFIDENCE[marker].key : null,
          categories: categorize(feature),
          globalHtml,
          projectHtml,
          globalText: stripHtml(globalHtml),
          projectText: stripHtml(projectHtml),
          footnotes: footnotesIn(globalMd + projectMd + extra),
          cellCount: cells.length,
        });
        continue;
      }
      if (line.startsWith("**Sources:**")) {
        inSources = true;
        const note = line.slice("**Sources:**".length).trim();
        if (note) agent.sourcesNoteHtml = inline(note);
        continue;
      }
      if (inSources) {
        agent.sources.push(...parseLinks(line));
        continue;
      }
      agent.notesHtml.push(inline(line.trim()));
      continue;
    }

    if (section === "notes") {
      if (!line.trim()) continue;
      const first = line.trim()[0];
      if (FOOTNOTE_CHARS.includes(first)) {
        const n = footnoteNumber(first);
        model.footnotes.push({ n, mark: first, html: inline(line.trim().slice(1).trim()) });
      } else {
        model.closingHtml.push(inline(line.trim()));
      }
      continue;
    }

    if (section === "standards") {
      if (!line.trim()) continue;
      const item = line.match(/^-\s+\*\*(.+?)\*\*\s*[—–-]\s*(.*)$/) || line.match(/^-\s+\*\*(.+?):?\*\*:?\s*(.*)$/);
      if (item) {
        flushStandard();
        currentStandard = { title: item[1].replace(/:$/, ""), titleHtml: inline(item[1].replace(/:$/, "")), html: inline(item[2]) };
      } else if (line.startsWith("- ")) {
        flushStandard();
        currentStandard = { title: "", titleHtml: "", html: inline(line.slice(2)) };
      } else if (currentStandard && raw.startsWith("  ")) {
        currentStandard.html += " " + inline(line.trim());
      } else {
        flushStandard();
        model.closingHtml.push(inline(line.trim()));
      }
      continue;
    }
  }
  flushCallout();
  flushStandard();
  return model;
}

/** Strict structural gate for the current document. Throws with every problem found. */
export function validate(model) {
  const problems = [];
  if (!model.lastVerified) problems.push('missing "*Last verified: YYYYMMDD*" line');
  if (model.agents.length < 10) problems.push(`only ${model.agents.length} agent sections found (expected ≥ 10)`);
  const slugs = new Set();
  for (const a of model.agents) {
    if (slugs.has(a.slug)) problems.push(`duplicate agent slug "${a.slug}"`);
    slugs.add(a.slug);
    if (!a.vendor) problems.push(`${a.name}: heading has no " — Vendor" part`);
    if (a.rows.length === 0) problems.push(`${a.name}: no feature table rows`);
    if (a.sources.length === 0) problems.push(`${a.name}: no sources`);
    for (const r of a.rows) {
      if (r.cellCount !== 3) problems.push(`${a.name} / ${r.feature}: expected 3 table cells, found ${r.cellCount}`);
      if (!r.marker) problems.push(`${a.name} / ${r.feature}: missing confidence marker (★ ◆ ○)`);
    }
  }
  if (problems.length) {
    const err = new Error(`coding-agent-config-locations.md failed validation:\n  - ${problems.join("\n  - ")}`);
    err.problems = problems;
    throw err;
  }
  return model;
}
