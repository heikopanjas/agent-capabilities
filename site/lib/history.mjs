// Builds a structured changelog from the git history of the reference
// document: every commit is parsed with the same parser and diffed against the
// previous version at the level of (agent, feature row, column).

import { execFileSync } from "node:child_process";
import { diffWords } from "diff";
import { parse, stripHtml } from "./parse.mjs";

const SEP = "\x1f";

function git(args, cwd) {
  return execFileSync("git", args, { cwd, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
}

export function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Word diff of two plain strings as HTML, with long unchanged runs elided. */
export function wordDiffHtml(before, after, { context = 10 } = {}) {
  const parts = diffWords(before ?? "", after ?? "");
  return parts
    .map((p, i) => {
      if (p.added) return `<ins>${escapeHtml(p.value)}</ins>`;
      if (p.removed) return `<del>${escapeHtml(p.value)}</del>`;
      const words = p.value.split(/(\s+)/);
      const wordCount = words.filter((w) => w.trim()).length;
      if (wordCount <= context * 2) return escapeHtml(p.value);
      const keep = (n, fromEnd) => {
        const out = [];
        let seen = 0;
        const seq = fromEnd ? [...words].reverse() : words;
        for (const w of seq) {
          if (w.trim()) seen++;
          if (seen > n) break;
          out.push(w);
        }
        return (fromEnd ? out.reverse() : out).join("");
      };
      const head = i === 0 ? "" : keep(context, false);
      const tail = i === parts.length - 1 ? "" : keep(context, true);
      return `${escapeHtml(head)}<span class="elide">…</span>${escapeHtml(tail)}`;
    })
    .join("");
}

function keyRows(rows) {
  const seen = new Map();
  const out = new Map();
  for (const r of rows) {
    const n = (seen.get(r.feature) || 0) + 1;
    seen.set(r.feature, n);
    out.set(n > 1 ? `${r.feature} #${n}` : r.feature, r);
  }
  return out;
}

function diffAgent(prev, next) {
  const items = [];
  if (prev.homeText !== next.homeText) {
    items.push({ kind: "changed", what: "Home", diffHtml: wordDiffHtml(prev.homeText, next.homeText) });
  }

  const pc = new Map(prev.callouts.map((c) => [c.label, c]));
  const nc = new Map(next.callouts.map((c) => [c.label, c]));
  for (const [label, c] of nc) {
    if (!pc.has(label)) items.push({ kind: "added", what: `Note: ${label}`, text: c.text });
    else if (pc.get(label).text !== c.text)
      items.push({ kind: "changed", what: `Note: ${label}`, diffHtml: wordDiffHtml(pc.get(label).text, c.text) });
  }
  for (const [label] of pc) if (!nc.has(label)) items.push({ kind: "removed", what: `Note: ${label}` });

  const pr = keyRows(prev.rows);
  const nr = keyRows(next.rows);
  for (const [key, r] of nr) {
    const o = pr.get(key);
    if (!o) {
      items.push({
        kind: "added",
        what: key,
        marker: r.marker,
        text: [r.globalText, r.projectText].filter((t) => t && t !== "—").join(" · "),
      });
      continue;
    }
    if (o.marker !== r.marker) {
      items.push({ kind: "confidence", what: key, before: o.marker, after: r.marker });
    }
    if (o.globalText !== r.globalText) {
      items.push({ kind: "changed", what: key, column: "Global", diffHtml: wordDiffHtml(o.globalText, r.globalText) });
    }
    if (o.projectText !== r.projectText) {
      items.push({ kind: "changed", what: key, column: "Project", diffHtml: wordDiffHtml(o.projectText, r.projectText) });
    }
  }
  for (const [key] of pr) if (!nr.has(key)) items.push({ kind: "removed", what: key });

  const pu = new Set(prev.sources.map((s) => s.url));
  const nu = new Set(next.sources.map((s) => s.url));
  const srcAdded = next.sources.filter((s) => !pu.has(s.url));
  const srcRemoved = prev.sources.filter((s) => !nu.has(s.url));
  if (srcAdded.length || srcRemoved.length) {
    items.push({ kind: "sources", added: srcAdded, removed: srcRemoved });
  }
  return items;
}

function diffShared(prev, next) {
  const items = [];
  const ps = new Map(prev.standards.map((s) => [s.title, stripHtml(s.html)]));
  const ns = new Map(next.standards.map((s) => [s.title, stripHtml(s.html)]));
  for (const [t, text] of ns) {
    const label = stripHtml(t) || "Standard";
    if (!ps.has(t)) items.push({ kind: "added", what: label, text });
    else if (ps.get(t) !== text) items.push({ kind: "changed", what: label, diffHtml: wordDiffHtml(ps.get(t), text) });
  }
  for (const [t] of ps) if (!ns.has(t)) items.push({ kind: "removed", what: stripHtml(t) || "Standard" });

  const pf = new Map(prev.footnotes.map((f) => [f.n, stripHtml(f.html)]));
  const nf = new Map(next.footnotes.map((f) => [f.n, stripHtml(f.html)]));
  for (const [n, text] of nf) {
    if (!pf.has(n)) items.push({ kind: "added", what: `Footnote ${n}`, text });
    else if (pf.get(n) !== text) items.push({ kind: "changed", what: `Footnote ${n}`, diffHtml: wordDiffHtml(pf.get(n), text) });
  }
  for (const [n] of pf) if (!nf.has(n)) items.push({ kind: "removed", what: `Footnote ${n}` });
  return items;
}

export function diffModels(prev, next) {
  const groups = [];
  const pa = new Map(prev.agents.map((a) => [a.slug, a]));
  for (const a of next.agents) {
    const o = pa.get(a.slug);
    if (!o) {
      groups.push({ slug: a.slug, name: a.name, added: true, items: [{ kind: "agent-added", rows: a.rows.length }] });
      continue;
    }
    const items = diffAgent(o, a);
    if (items.length) groups.push({ slug: a.slug, name: a.name, items });
  }
  const na = new Set(next.agents.map((a) => a.slug));
  for (const a of prev.agents) {
    if (!na.has(a.slug)) groups.push({ slug: a.slug, name: a.name, removed: true, items: [{ kind: "agent-removed" }] });
  }
  const shared = diffShared(prev, next);
  if (shared.length) groups.push({ slug: null, name: "Cross-agent standards & notes", items: shared });
  return groups;
}

/**
 * Returns changelog entries, newest first. Never throws: a missing or shallow
 * git history yields whatever could be read, with warnings on stderr.
 */
export function buildHistory({ file, cwd }) {
  let log;
  try {
    log = git(["log", "--reverse", `--format=%H${SEP}%cI${SEP}%s`, "--", file], cwd);
  } catch (e) {
    console.warn(`history: git log failed (${e.message.split("\n")[0]}); changelog will be empty`);
    return [];
  }
  const commits = log
    .split("\n")
    .filter(Boolean)
    .map((l) => {
      const [sha, date, subject] = l.split(SEP);
      return { sha, date, subject };
    });
  if (commits.length < 2) console.warn(`history: only ${commits.length} commit(s) found — is the checkout shallow?`);

  const entries = [];
  let prev = null;
  for (const c of commits) {
    let model;
    try {
      model = parse(git(["show", `${c.sha}:${file}`], cwd));
    } catch (e) {
      console.warn(`history: skipping ${c.sha.slice(0, 7)} (${e.message.split("\n")[0]})`);
      continue;
    }
    if (model.agents.length === 0) {
      console.warn(`history: skipping ${c.sha.slice(0, 7)} (no agent sections parsed)`);
      continue;
    }
    const base = {
      sha: c.sha,
      short: c.sha.slice(0, 7),
      date: c.date,
      day: c.date.slice(0, 10),
      subject: c.subject,
      verified: model.lastVerified,
    };
    if (!prev) {
      entries.push({ ...base, initial: true, agentCount: model.agents.length, groups: [], changeCount: 0 });
    } else {
      const groups = diffModels(prev, model);
      const changeCount = groups.reduce((n, g) => n + g.items.length, 0);
      entries.push({ ...base, groups, changeCount, reverifiedOnly: changeCount === 0 });
    }
    prev = model;
  }
  return entries.reverse();
}
