// HTML templates. Pages are fully rendered at build time so the site works
// without JavaScript; site/assets/app.js only adds filtering and motion.

import { CATEGORIES, CONFIDENCE, stripHtml } from "./parse.mjs";
import { escapeHtml as esc } from "./history.mjs";

export const REPO_URL = "https://github.com/heikopanjas/agent-capabilities";
const DOC_URL = `${REPO_URL}/blob/main/coding-agent-config-locations.md`;

const ACCENTS = ["teal", "violet", "amber", "green", "blue", "rose"];
const CONF_ORDER = { stable: 3, documented: 2, observed: 1 };
const MARKER_BY_KEY = Object.fromEntries(Object.entries(CONFIDENCE).map(([m, c]) => [c.key, m]));
const CAT_LABEL = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.label]));
const NAV = [
  ["matrix", "Matrix", "#matrix"],
  ["agents", "Agents", "#agents"],
  ["compare", "Compare", "compare/"],
  ["changes", "Changes", "changelog/"],
  ["standards", "Standards", "standards/"],
];

export function accentFor(index) {
  return ACCENTS[index % ACCENTS.length];
}

function monthEdition(isoDay) {
  const d = new Date(`${isoDay}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
}

function prettyDay(isoDay) {
  const d = new Date(`${isoDay}T00:00:00Z`);
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

function badge(marker) {
  if (!marker) return "";
  const c = CONFIDENCE[marker];
  return `<span class="conf conf-${c.key}" title="${esc(c.label)}">${marker}<span class="conf-label">${esc(c.label)}</span></span>`;
}

function leds(agent) {
  const present = new Set(agent.rows.map((r) => r.confidence).filter(Boolean));
  return `<span class="leds" aria-hidden="true">${["stable", "documented", "observed"]
    .map((k) => `<i class="led led-${k}${present.has(k) ? " on" : ""}"></i>`)
    .join("")}</span>`;
}

function kicker(num, text, extra = "") {
  return `<div class="kicker ${extra}"><span class="num">${esc(num)}</span>${esc(text)}</div>`;
}

function cell(html) {
  const empty = !stripHtml(html) || stripHtml(html) === "—";
  return empty ? `<span class="nil">—</span>` : html;
}

function footnotesBlock(model, numbers) {
  const notes = numbers ? model.footnotes.filter((f) => numbers.has(f.n)) : model.footnotes;
  if (!notes.length) return "";
  return `<ol class="footnotes">${notes
    .map((f) => `<li id="fn-${f.n}"><span class="fn-mark">${f.mark}</span><div>${f.html}</div></li>`)
    .join("")}</ol>`;
}

const FAVICON =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="8" fill="#0a0c0f"/><circle cx="16" cy="16" r="7" fill="#ffb454"/></svg>`,
  );

function layout({ model, root, active, title, description, body, bodyClass = "" }) {
  const nav = NAV.map(([key, label, href]) => {
    const url = href.startsWith("#") ? `${root}${href}` : `${root}${href}`;
    return `<a href="${url}"${key === active ? ' class="active" aria-current="page"' : ""}>${label}</a>`;
  }).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="theme-color" content="#0a0c0f">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<link rel="icon" href="${FAVICON}">
<link rel="alternate" type="application/atom+xml" title="Agent config changes" href="${root}feed.xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter+Tight:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="${root}assets/style.css">
<script>document.documentElement.classList.add("js")</script>
<script src="${root}assets/app.js" defer></script>
</head>
<body class="${bodyClass}" data-verified="${esc(model.lastVerified)}">
<a class="skip" href="#main">Skip to content</a>
<header class="topbar" id="topbar">
  <a class="brand" href="${root}"><span class="lamp" id="lamp" title="Last verified ${esc(model.lastVerified)}"></span><span class="brand-text">AGENT <b>✦</b> CAPABILITIES</span></a>
  <nav class="chapters" aria-label="Sections">${nav}</nav>
  <div class="top-actions">
    <a class="chip" href="${root}feed.xml"><span class="chip-dot dot-amber"></span>Feed</a>
    <a class="chip" href="${REPO_URL}"><span class="chip-dot"></span>GitHub</a>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="footer">
  <div><b>Agent Capabilities</b><br><span class="mono-fine">verified ${esc(model.lastVerified)}</span></div>
  <div>
    <p>Generated from <a href="${DOC_URL}"><code>coding-agent-config-locations.md</code></a>, which a scheduled job re-researches against each vendor's official docs every Thursday. The git history of that file is the changelog.</p>
    <p class="fine"><a href="${root}feed.xml">Atom feed</a> · <a href="${root}data.json">data.json</a> · <a href="${REPO_URL}">Source on GitHub</a> · MIT © 2026 Heiko Panjas</p>
  </div>
</footer>
</body>
</html>
`;
}

/* ---------------------------------------------------------------- waveform */

function waveformSvg() {
  // Deterministic "scope trace": two cycles so the CSS drift loops seamlessly.
  const w = 1600;
  const pts = [];
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const amps = Array.from({ length: 40 }, () => 0.25 + rand() * 0.75);
  for (let x = 0; x <= w * 2; x += 8) {
    const i = Math.floor((x % w) / (w / amps.length));
    const a = amps[i] * 38;
    const y = 60 + Math.sin(x / 23) * a * Math.sin((x % w) / (w / Math.PI));
    pts.push(`${x},${y.toFixed(1)}`);
  }
  const d = `M${pts.join(" L")}`;
  return `<svg class="scope" viewBox="0 0 ${w} 120" preserveAspectRatio="none" aria-hidden="true"><g class="scope-drift"><path d="${d}" class="trace"/><path d="${d}" class="trace trace-glow"/></g><line x1="0" y1="60" x2="${w}" y2="60" class="scope-axis"/></svg>`;
}

/* ------------------------------------------------------------------- index */

function coverage(model) {
  const cats = CATEGORIES.filter((c) => model.agents.some((a) => a.rows.some((r) => r.categories.includes(c.key))));
  const head = `<div class="cov-row cov-head"><span></span>${cats
    .map((c) => `<span class="cov-cat">${esc(c.label)}</span>`)
    .join("")}</div>`;
  const rows = model.agents
    .map((a, i) => {
      const cells = cats
        .map((c) => {
          const hits = a.rows.filter((r) => r.categories.includes(c.key));
          if (!hits.length)
            return `<span class="cov-cell cov-none" title="${esc(a.name)} · ${esc(c.label)}: not documented"></span>`;
          const best = hits.reduce((b, r) => ((CONF_ORDER[r.confidence] || 0) > (CONF_ORDER[b] || 0) ? r.confidence : b), null);
          const label = `${a.name} · ${c.label}: ${hits.length} row${hits.length > 1 ? "s" : ""}, best ${MARKER_BY_KEY[best] || "?"}`;
          return `<a class="cov-cell cov-${best}" href="#matrix" data-agent="${a.slug}" data-cat="${c.key}" title="${esc(label)}" aria-label="${esc(label)}"><i></i></a>`;
        })
        .join("");
      return `<div class="cov-row" style="--c:var(--${accentFor(i)})"><a class="cov-agent" href="agents/${a.slug}/">${esc(a.name)}</a>${cells}</div>`;
    })
    .join("");
  return `<div class="coverage" style="--cols:${cats.length}" role="group" aria-label="Coverage by agent and category">${head}${rows}</div>`;
}

function matrixTable(model, root) {
  const body = model.agents
    .map((a, ai) =>
      a.rows
        .map((r, ri) => {
          const text = `${a.name} ${a.vendor} ${r.feature} ${r.globalText} ${r.projectText}`.toLowerCase();
          return `<tr data-agent="${a.slug}" data-cats="${r.categories.join(" ")}" data-conf="${r.confidence || ""}" data-text="${esc(text)}"${ri === 0 ? ' class="lead"' : ""} style="--c:var(--${accentFor(ai)})">
<th scope="row" class="m-agent"><a href="${root}agents/${a.slug}/">${esc(a.name)}</a></th>
<td class="m-feature"><span class="feat">${esc(r.feature)}</span>${badge(r.marker)}${r.featureNote ? `<div class="feat-note">${r.featureNote}</div>` : ""}</td>
<td class="m-path" data-label="Global">${cell(r.globalHtml)}</td>
<td class="m-path" data-label="Project">${cell(r.projectHtml)}</td>
</tr>`;
        })
        .join("\n"),
    )
    .join("\n");
  return `<div class="table-wrap"><table class="matrix" id="matrix-table">
<thead><tr><th scope="col">Agent</th><th scope="col">Feature</th><th scope="col">Global <span class="th-sub">user</span></th><th scope="col">Project <span class="th-sub">repo</span></th></tr></thead>
<tbody>
${body}
</tbody></table>
<p class="empty" id="matrix-empty" hidden>No rows match. <button type="button" class="linklike" data-reset>Reset filters</button></p></div>`;
}

function toolbar(model) {
  const usedCats = CATEGORIES.filter((c) => model.agents.some((a) => a.rows.some((r) => r.categories.includes(c.key))));
  const pills = [`<button type="button" class="scen active" data-cat="all" aria-pressed="true">All</button>`]
    .concat(usedCats.map((c) => `<button type="button" class="scen" data-cat="${c.key}" aria-pressed="false">${esc(c.label)}</button>`))
    .join("");
  const confChips = Object.entries(CONFIDENCE)
    .map(
      ([m, c]) =>
        `<button type="button" class="chip conf-chip conf-${c.key}" data-conf="${c.key}" aria-pressed="true" title="${esc(c.label)}"><span class="chip-dot"></span>${m} ${esc(c.label.split(" ")[0])}</button>`,
    )
    .join("");
  return `<div class="toolbar" id="toolbar" hidden>
  <div class="scenarios" role="group" aria-label="Category">${pills}</div>
  <div class="tool-row">
    <label class="search"><span class="sr-only">Search paths</span><input type="search" id="matrix-q" placeholder="Search paths, files, flags…" autocomplete="off" spellcheck="false"></label>
    <div class="conf-chips" role="group" aria-label="Confidence">${confChips}</div>
    <span class="agent-filter" id="agent-filter" hidden></span>
    <span class="count mono-fine" id="matrix-count" aria-live="polite"></span>
  </div>
</div>`;
}

function agentCard(a, i, root) {
  const warn = a.callouts.find((c) => c.tone === "warn");
  return `<a class="rack-card reveal" href="${root}agents/${a.slug}/" style="--c:var(--${accentFor(i)})">
  <span class="rack-num">${String(i + 1).padStart(2, "0")}</span>
  <span class="unit-role">${esc(a.vendor)}</span>
  <h3>${esc(a.name)}</h3>
  <span class="unit-hw">${a.homeText ? esc(a.homeText.length > 70 ? a.homeText.slice(0, 68) + "…" : a.homeText) : "&nbsp;"}</span>
  <span class="rack-foot">${leds(a)}<span class="mono-fine">${a.rows.length} features</span>${warn ? `<span class="flag">${esc(warn.label)}</span>` : ""}</span>
</a>`;
}

function standardTag(title) {
  const t = title.toLowerCase();
  if (t.includes("agents.md")) return "Instructions";
  if (t.includes("skill.md")) return "Skill format";
  if (t.includes(".agents/")) return "Discovery";
  if (t.includes("subagent")) return "Subagents";
  return "Standard";
}

function changeSummary(e) {
  const names = e.groups.map((g) => g.name);
  return `${e.changeCount} change${e.changeCount === 1 ? "" : "s"} across ${names.length} section${names.length === 1 ? "" : "s"}`;
}

export function renderIndex(model, history) {
  const root = "";
  const rowCount = model.agents.reduce((n, a) => n + a.rows.length, 0);
  const stable = model.agents.reduce((n, a) => n + a.rows.filter((r) => r.confidence === "stable").length, 0);
  const totalChanges = history.reduce((n, e) => n + (e.changeCount || 0), 0);
  const latest = history.filter((e) => e.changeCount > 0).slice(0, 3);
  const edition = monthEdition(model.lastVerified);

  const tldr = model.standards
    .slice(0, 4)
    .map((s, i) => {
      const text = stripHtml(s.html);
      const short = text.length > 230 ? text.slice(0, 228).replace(/\s+\S*$/, "").replace(/[\s.,;:—-]+$/, "") + "…" : text;
      const tag = standardTag(s.title);
      return `<article class="tl reveal" style="--c:var(--${["teal", "violet", "amber", "green"][i]})"><span class="tl-tag">${tag}</span><h3>${s.titleHtml || "Note"}</h3><p>${esc(short)}</p></article>`;
    })
    .join("");

  const latestHtml = latest
    .map(
      (e) => `<li class="reveal"><time datetime="${e.date}">${esc(prettyDay(e.day))}</time><div><b>${changeSummary(e)}</b><span class="tag-list">${e.groups
        .map((g) => `<span class="mini-tag">${esc(g.name)}</span>`)
        .join("")}</span><a class="more" href="changelog/#${e.day}-${e.short}">Read the diff →</a></div></li>`,
    )
    .join("");

  const body = `
<section class="hero">
  <div class="hero-glow" aria-hidden="true"></div>
  <div class="hero-grid" aria-hidden="true"></div>
  ${waveformSvg()}
  <div class="hero-inner">
    <p class="eyebrow">Reference · weekly re-verified · ${esc(edition)} edition</p>
    <h1>Where agents <em>keep</em> their config.</h1>
    <p class="lede">${esc(model.subtitle.replace(/\s+—\s+\w+ \d{4}$/, ""))}. ${model.agents.length} coding agents, every instruction file, skill folder and subagent path, each tagged with how sure we are.</p>
    <div class="hero-cta">
      <a class="btn btn-hot" href="#matrix"><span class="btn-lamp"></span>Explore the matrix</a>
      <a class="btn btn-ghost" href="changelog/">What changed this week ↗</a>
    </div>
  </div>
  <div class="meters">
    <div class="meter"><b>${model.agents.length}</b><span>agents tracked</span></div>
    <div class="meter"><b>${rowCount}</b><span>features mapped</span></div>
    <div class="meter"><b>${stable}</b><span>★ spec-stable</span></div>
    <div class="meter"><b>${totalChanges}</b><span>changes logged</span></div>
    <div class="meter"><b id="days-since">${esc(model.lastVerified.slice(5))}</b><span id="days-label">last verified</span></div>
  </div>
  <div class="hero-foot"><span>● ON AIR</span><span>VERIFIED ${esc(model.lastVerified.replace(/-/g, "."))}</span><span>SCROLL ↓</span></div>
</section>

<section class="section" id="short">
  <div class="section-head">${kicker("00", "The short version")}
    <h2>Four <em>standards</em> hold it together.</h2>
    <p class="section-intro">Every agent invents its own folders, but a few shared conventions keep spreading. Learn these four and most of the matrix reads itself.</p>
  </div>
  <div class="tldr-grid">${tldr}</div>
  <p class="section-more"><a href="standards/">All standards and notes →</a></p>
</section>

<section class="section" id="matrix">
  <div class="section-head">${kicker("01", "Matrix")}
    <h2>Every path, <em>one</em> grid.</h2>
    <p class="section-intro">Each light is an agent documenting a category. Brightness follows confidence: <span class="conf conf-stable">★</span> spec or long-standing docs, <span class="conf conf-documented">◆</span> documented but may shift, <span class="conf conf-observed">○</span> observed in the wild. Tap a light to filter the table.</p>
  </div>
  <div class="stage">
    ${coverage(model)}
  </div>
  ${toolbar(model)}
  ${matrixTable(model, root)}
  ${footnotesBlock(model)}
</section>

<section class="section" id="agents">
  <div class="section-head">${kicker("02", "The rack")}
    <h2>${model.agents.length} agents, <em>one</em> rack.</h2>
    <p class="section-intro">Open any unit for its full table, vendor notes, and the official sources each path was checked against.</p>
  </div>
  <div class="rack">${model.agents.map((a, i) => agentCard(a, i, root)).join("")}</div>
</section>

<section class="section" id="changes">
  <div class="section-head">${kicker("03", "Latest changes")}
    <h2>What <em>moved</em> recently.</h2>
    <p class="section-intro">Vendors rename folders, deprecate flags and ship new discovery paths all the time. Every refresh is diffed against the previous version.</p>
  </div>
  <ol class="day-list">${latestHtml}</ol>
  <p class="section-more"><a href="changelog/">Full changelog →</a> · <a href="feed.xml">Subscribe via Atom</a></p>
</section>

<section class="outro">
  <div class="outro-inner">
    ${kicker("04", "Stay tuned", "center")}
    <h2>Paths drift. <em>Subscribe</em> to the signal.</h2>
    <p>The reference re-verifies itself every Thursday against each vendor's official documentation. The feed carries only weeks where something changed.</p>
    <div class="hero-cta"><a class="btn btn-hot" href="feed.xml"><span class="btn-lamp"></span>Atom feed</a><a class="btn btn-ghost" href="${REPO_URL}">Source on GitHub ↗</a></div>
  </div>
</section>`;

  return layout({
    model,
    root,
    active: "",
    title: "Agent Capabilities: where coding agents keep their config",
    description: `Instruction files, skills, subagents, MCP and settings paths for ${model.agents.length} coding agents, re-verified weekly.`,
    body,
    bodyClass: "home",
  });
}

/* ------------------------------------------------------------------ agents */

export function renderAgent(model, index) {
  const root = "../../";
  const a = model.agents[index];
  const prev = model.agents[(index - 1 + model.agents.length) % model.agents.length];
  const next = model.agents[(index + 1) % model.agents.length];
  const accent = accentFor(index);
  const fns = new Set(a.rows.flatMap((r) => r.footnotes));
  const others = model.agents.filter((o) => o.slug !== a.slug).slice(0, 2).map((o) => o.slug);

  const callouts = a.callouts
    .map((c) => `<aside class="why why-${c.tone}"><b>${esc(c.label)}</b> ${c.html}</aside>`)
    .join("");

  const rows = a.rows
    .map(
      (r) => `<article class="feature reveal" data-cats="${r.categories.join(" ")}">
  <header><h3>${esc(r.feature)}</h3>${badge(r.marker)}<span class="cats">${r.categories.map((k) => `<span class="mini-tag">${esc(CAT_LABEL[k])}</span>`).join("")}</span></header>
  ${r.featureNote ? `<p class="feat-note">${r.featureNote}</p>` : ""}
  <div class="pair">
    <div><span class="pair-label">${esc(a.columns.global)}</span><div class="pair-body">${cell(r.globalHtml)}</div></div>
    <div><span class="pair-label">${esc(a.columns.project)}</span><div class="pair-body">${cell(r.projectHtml)}</div></div>
  </div>
</article>`,
    )
    .join("");

  const sources = a.sources.map((s) => `<a class="chip src" href="${esc(s.url)}"><span class="chip-dot"></span>${esc(s.label)}</a>`).join("");

  const body = `
<section class="section agent-hero" style="--c:var(--${accent})">
  <div class="section-head">
    ${kicker(`${String(index + 1).padStart(2, "0")}/${model.agents.length}`, "Agent")}
    <div class="unit-badge">${esc(a.vendor)}</div>
    <h1>${esc(a.name)}</h1>
    ${a.homeHtml ? `<p class="unit-hw home"><span class="pair-label">Home</span> ${a.homeHtml}</p>` : ""}
    <p class="agent-meta">${leds(a)}<span class="mono-fine">${a.rows.length} features · ${a.sources.length} sources · verified ${esc(model.lastVerified)}</span></p>
    <div class="hero-cta"><a class="btn btn-ghost" href="${root}compare/?a=${[a.slug, ...others].join(",")}">Compare with others</a><a class="btn btn-ghost" href="${root}#matrix">Back to the matrix</a></div>
  </div>
  ${callouts}
  <div class="features">${rows}</div>
  ${a.notesHtml.length ? `<div class="agent-notes">${a.notesHtml.map((h) => `<p>${h}</p>`).join("")}</div>` : ""}
  ${footnotesBlock(model, fns)}
  <div class="sources">
    ${kicker("SRC", "Checked against", "small")}
    ${a.sourcesNoteHtml ? `<p class="fine">${a.sourcesNoteHtml}</p>` : ""}
    <div class="chip-row">${sources}</div>
  </div>
  <nav class="pager" aria-label="Agents">
    <a href="${root}agents/${prev.slug}/"><span class="pair-label">← Previous</span>${esc(prev.name)}</a>
    <a href="${root}agents/${next.slug}/" class="next"><span class="pair-label">Next →</span>${esc(next.name)}</a>
  </nav>
</section>`;

  return layout({
    model,
    root,
    active: "agents",
    title: `${a.name}: config locations · Agent Capabilities`,
    description: `Where ${a.name} (${a.vendor}) keeps instructions, skills, subagents, MCP and settings, re-verified weekly.`,
    body,
  });
}

/* ----------------------------------------------------------------- compare */

export function renderCompare(model) {
  const root = "../";
  const cats = CATEGORIES.filter((c) => model.agents.some((a) => a.rows.some((r) => r.categories.includes(c.key))));
  const defaults = new Set(model.agents.slice(0, 3).map((a) => a.slug));
  const fns = new Set(model.agents.flatMap((a) => a.rows.flatMap((r) => r.footnotes)));

  const picker = model.agents
    .map(
      (a, i) =>
        `<button type="button" class="scen pick" data-agent="${a.slug}" aria-pressed="${defaults.has(a.slug)}" style="--c:var(--${accentFor(i)})">${esc(a.name)}</button>`,
    )
    .join("");

  const headCells = model.agents
    .map(
      (a, i) =>
        `<div class="cmp-cell cmp-agent" data-agent="${a.slug}"${defaults.has(a.slug) ? "" : " hidden"} style="--c:var(--${accentFor(i)})"><span class="unit-role">${esc(a.vendor)}</span><a href="${root}agents/${a.slug}/">${esc(a.name)}</a>${leds(a)}</div>`,
    )
    .join("");

  const rows = cats
    .map((c) => {
      const cells = model.agents
        .map((a) => {
          const hits = a.rows.filter((r) => r.categories.includes(c.key));
          const inner = hits.length
            ? hits
                .map(
                  (r) => `<div class="cmp-item"><div class="cmp-feat">${esc(r.feature)} ${badge(r.marker)}</div>
<dl><dt>Global</dt><dd>${cell(r.globalHtml)}</dd><dt>Project</dt><dd>${cell(r.projectHtml)}</dd></dl></div>`,
                )
                .join("")
            : `<span class="nil">Not documented</span>`;
          return `<div class="cmp-cell" data-agent="${a.slug}"${defaults.has(a.slug) ? "" : " hidden"}><span class="cmp-cat-inline">${esc(c.label)} · ${esc(a.name)}</span>${inner}</div>`;
        })
        .join("");
      return `<div class="cmp-row"><div class="cmp-cat">${esc(c.label)}</div>${cells}</div>`;
    })
    .join("");

  const body = `
<section class="section">
  <div class="section-head">${kicker("05", "Compare")}
    <h1 class="page-title">Side by <em>side</em>.</h1>
    <p class="section-intro">Pick up to four agents. Rows line up by category, so you can see where each one looks for the same kind of file.</p>
  </div>
  <div class="scenarios picker" role="group" aria-label="Agents to compare">${picker}</div>
  <p class="mono-fine pick-hint" id="pick-hint">Up to 4 agents. The link updates as you pick.</p>
  <div class="cmp-wrap stage">
    <div class="cmp" id="cmp" style="--n:${defaults.size}">
      <div class="cmp-row cmp-head"><div class="cmp-cat"></div>${headCells}</div>
      ${rows}
    </div>
  </div>
  ${footnotesBlock(model, fns)}
</section>`;

  return layout({
    model,
    root,
    active: "compare",
    title: "Compare agents · Agent Capabilities",
    description: "Compare where coding agents keep instructions, skills, subagents and MCP config, side by side.",
    body,
    bodyClass: "compare-page",
  });
}

/* --------------------------------------------------------------- changelog */

function changeItem(item) {
  const what = `${esc(item.what || "")}${item.column ? ` <span class="col">· ${esc(item.column)}</span>` : ""}`;
  switch (item.kind) {
    case "changed":
      return `<li><span class="kind kind-changed">Changed</span><span class="what">${what}</span><div class="diff">${item.diffHtml}</div></li>`;
    case "added":
      return `<li><span class="kind kind-added">Added</span><span class="what">${what}${item.marker ? " " + badge(item.marker) : ""}</span>${item.text ? `<div class="diff"><ins>${esc(item.text)}</ins></div>` : ""}</li>`;
    case "removed":
      return `<li><span class="kind kind-removed">Removed</span><span class="what">${what}</span></li>`;
    case "confidence":
      return `<li><span class="kind kind-conf">Confidence</span><span class="what">${what}</span><div class="diff">${badge(item.before)} → ${badge(item.after)}</div></li>`;
    case "sources":
      return `<li><span class="kind kind-src">Sources</span><span class="what">${item.added.length ? `+${item.added.length}` : ""}${item.added.length && item.removed.length ? " / " : ""}${item.removed.length ? `−${item.removed.length}` : ""}</span><div class="diff">${item.added
        .map((s) => `<ins><a href="${esc(s.url)}">${esc(s.label)}</a></ins>`)
        .join(" ")} ${item.removed.map((s) => `<del>${esc(s.label)}</del>`).join(" ")}</div></li>`;
    case "agent-added":
      return `<li><span class="kind kind-added">New agent</span><span class="what">${item.rows} features documented</span></li>`;
    case "agent-removed":
      return `<li><span class="kind kind-removed">Agent removed</span></li>`;
    default:
      return "";
  }
}

export function renderChangelog(model, history) {
  const root = "../";
  const slugs = new Set(model.agents.map((a) => a.slug));
  const entries = history
    .map((e, i) => {
      const id = `${e.day}-${e.short}`;
      const commit = `<a class="sha" href="${REPO_URL}/commit/${e.sha}">${e.short}</a>`;
      if (e.initial) {
        return `<li id="${id}" class="entry"><time datetime="${e.date}">${esc(prettyDay(e.day))}</time><div><b>First version</b> <span class="mono-fine">${e.agentCount} agents documented · ${commit}</span></div></li>`;
      }
      if (e.reverifiedOnly) {
        return `<li id="${id}" class="entry quiet"><time datetime="${e.date}">${esc(prettyDay(e.day))}</time><div><span class="mono-fine">Re-verified, no changes · ${commit}</span></div></li>`;
      }
      const groups = e.groups
        .map((g) => {
          const name = g.slug && slugs.has(g.slug) ? `<a href="${root}agents/${g.slug}/">${esc(g.name)}</a>` : esc(g.name);
          return `<div class="group"><h3>${name}</h3><ul>${g.items.map(changeItem).join("")}</ul></div>`;
        })
        .join("");
      return `<li id="${id}" class="entry"><time datetime="${e.date}">${esc(prettyDay(e.day))}</time><div>
<details${i < 6 ? " open" : ""}><summary><b>${changeSummary(e)}</b> <span class="mono-fine">${commit}</span></summary>${groups}</details></div></li>`;
    })
    .join("");

  const body = `
<section class="section">
  <div class="section-head">${kicker("06", "Changelog")}
    <h1 class="page-title">What <em>changed</em>, week by week.</h1>
    <p class="section-intro">Each entry is a commit to the reference document, diffed cell by cell against the version before it. <ins class="legend-ins">Green</ins> was added, <del class="legend-del">rose</del> was removed; long unchanged stretches are folded into “…”.</p>
    <p class="fine"><a href="${root}feed.xml">Subscribe via Atom</a></p>
  </div>
  <ol class="day-list changelog">${entries || '<li class="entry quiet"><div>No history available in this build.</div></li>'}</ol>
</section>`;

  return layout({
    model,
    root,
    active: "changes",
    title: "Changelog · Agent Capabilities",
    description: "Week-by-week changes to where coding agents keep their configuration.",
    body,
  });
}

/* --------------------------------------------------------------- standards */

export function renderStandards(model) {
  const root = "../";
  const legend = Object.entries(CONFIDENCE)
    .map(([m, c]) => `<li><span class="conf conf-${c.key}">${m}</span><b>${esc(c.label)}</b></li>`)
    .join("");
  const cards = model.standards
    .map(
      (s, i) =>
        `<article class="tl std reveal" style="--c:var(--${["teal", "violet", "amber", "green", "blue"][i % 5]})"><h3>${s.titleHtml || "Note"}</h3><p>${s.html}</p></article>`,
    )
    .join("");
  const body = `
<section class="section">
  <div class="section-head">${kicker("07", "Standards & notes")}
    <h1 class="page-title">The <em>shared</em> conventions.</h1>
    <p class="section-intro">${model.introHtml.join(" ")}</p>
  </div>
  <div class="std-grid">${cards}</div>
  <div class="section-head sub">${kicker("FN", "Footnotes", "small")}</div>
  ${footnotesBlock(model)}
  <div class="section-head sub">${kicker("KEY", "Confidence markers", "small")}</div>
  <ul class="legend">${legend}</ul>
  ${model.closingHtml.map((h) => `<p class="fine closing">${h}</p>`).join("")}
</section>`;
  return layout({
    model,
    root,
    active: "standards",
    title: "Standards & notes · Agent Capabilities",
    description: "AGENTS.md, SKILL.md, .agents/skills and the other cross-agent conventions.",
    body,
  });
}

/* -------------------------------------------------------------------- feed */

export function renderFeed(model, history, siteUrl) {
  const items = history.filter((e) => e.changeCount > 0).slice(0, 20);
  const updated = items[0]?.date || `${model.lastVerified}T00:00:00Z`;
  const entries = items
    .map((e) => {
      const link = `${siteUrl}changelog/#${e.day}-${e.short}`;
      const content = e.groups
        .map(
          (g) =>
            `<h3>${esc(g.name)}</h3><ul>${g.items
              .map((it) => {
                const label = it.kind === "sources" ? "Sources updated" : `${it.kind}: ${it.what || ""}${it.column ? ` (${it.column})` : ""}`;
                const diff = it.diffHtml ? `<br>${it.diffHtml}` : it.text ? `<br><ins>${esc(it.text)}</ins>` : "";
                return `<li>${esc(label)}${diff}</li>`;
              })
              .join("")}</ul>`,
        )
        .join("");
      return `  <entry>
    <id>tag:heikopanjas.github.io,2026:agent-capabilities/${e.sha}</id>
    <title>${esc(`${prettyDay(e.day)}: ${changeSummary(e)}`)}</title>
    <updated>${e.date}</updated>
    <link rel="alternate" type="text/html" href="${esc(link)}"/>
    <summary>${esc(e.groups.map((g) => g.name).join(", "))}</summary>
    <content type="html">${esc(content)}</content>
  </entry>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${esc(siteUrl)}</id>
  <title>Agent Capabilities: config location changes</title>
  <subtitle>Weekly changes to where coding agents keep their configuration</subtitle>
  <updated>${updated}</updated>
  <link rel="self" type="application/atom+xml" href="${esc(siteUrl)}feed.xml"/>
  <link rel="alternate" type="text/html" href="${esc(siteUrl)}"/>
  <author><name>Heiko Panjas</name></author>
${entries}
</feed>
`;
}
