// Progressive enhancement: every page is complete without this script.
(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- top bar ---- */
  const topbar = $("#topbar");
  const onScroll = () => topbar && topbar.classList.toggle("scrolled", scrollY > 24);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---- freshness lamp + "days since verified" meter ---- */
  const verified = document.body.dataset.verified;
  if (verified) {
    const days = Math.max(0, Math.floor((Date.now() - Date.parse(`${verified}T00:00:00Z`)) / 864e5));
    const lamp = $("#lamp");
    if (lamp) {
      lamp.classList.add(days <= 8 ? "fresh" : "stale");
      lamp.title = `Last verified ${verified} (${days} day${days === 1 ? "" : "s"} ago)`;
    }
    const meter = $("#days-since");
    if (meter) {
      meter.textContent = String(days);
      $("#days-label").textContent = `day${days === 1 ? "" : "s"} since verified`;
    }
  }

  /* ---- scroll reveals ---- */
  const reveals = $$(".reveal");
  if (reduceMotion || !("IntersectionObserver" in window)) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
      { rootMargin: "0px 0px -8% 0px" },
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* ---- matrix filtering ---- */
  const table = $("#matrix-table");
  if (table) {
    const toolbar = $("#toolbar");
    toolbar.hidden = false;
    const rows = $$("tbody tr", table);
    const q = $("#matrix-q");
    const count = $("#matrix-count");
    const empty = $("#matrix-empty");
    const agentFilter = $("#agent-filter");
    const names = Object.fromEntries(rows.map((r) => [r.dataset.agent, $(".m-agent a", r).textContent]));
    const state = { cat: "all", conf: new Set(["stable", "documented", "observed"]), q: "", agent: "" };

    const params = new URLSearchParams(location.search);
    if (params.get("cat")) state.cat = params.get("cat");
    if (params.get("agent") && names[params.get("agent")]) state.agent = params.get("agent");
    if (params.get("q")) state.q = q.value = params.get("q");

    const sync = () => {
      const p = new URLSearchParams(location.search);
      for (const [k, v] of [["cat", state.cat === "all" ? "" : state.cat], ["agent", state.agent], ["q", state.q]]) {
        v ? p.set(k, v) : p.delete(k);
      }
      const s = p.toString();
      history.replaceState(null, "", `${location.pathname}${s ? `?${s}` : ""}${location.hash}`);
    };

    const apply = () => {
      const terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
      let shown = 0;
      let lastAgent = null;
      for (const r of rows) {
        const ok =
          (state.cat === "all" || r.dataset.cats.split(" ").includes(state.cat)) &&
          (!r.dataset.conf || state.conf.has(r.dataset.conf)) &&
          (!state.agent || r.dataset.agent === state.agent) &&
          terms.every((t) => r.dataset.text.includes(t));
        r.hidden = !ok;
        if (ok) {
          shown++;
          r.classList.toggle("lead", r.dataset.agent !== lastAgent);
          lastAgent = r.dataset.agent;
        }
      }
      count.textContent = `${shown} / ${rows.length} rows`;
      empty.hidden = shown > 0;
      $$(".scen[data-cat]", toolbar).forEach((b) => {
        const on = b.dataset.cat === state.cat;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", String(on));
      });
      agentFilter.hidden = !state.agent;
      agentFilter.innerHTML = state.agent
        ? `<button type="button" class="chip" data-clear-agent>${names[state.agent]} ✕</button>`
        : "";
      sync();
    };

    toolbar.addEventListener("click", (e) => {
      const cat = e.target.closest(".scen[data-cat]");
      const conf = e.target.closest("[data-conf]");
      if (cat) state.cat = cat.dataset.cat;
      else if (conf) {
        const k = conf.dataset.conf;
        state.conf.has(k) ? state.conf.delete(k) : state.conf.add(k);
        conf.setAttribute("aria-pressed", String(state.conf.has(k)));
      } else if (e.target.closest("[data-clear-agent]")) state.agent = "";
      else return;
      apply();
    });
    let t;
    q.addEventListener("input", () => {
      clearTimeout(t);
      t = setTimeout(() => ((state.q = q.value.trim()), apply()), 120);
    });
    $("[data-reset]")?.addEventListener("click", () => {
      Object.assign(state, { cat: "all", q: "", agent: "" });
      state.conf = new Set(["stable", "documented", "observed"]);
      q.value = "";
      $$("[data-conf]", toolbar).forEach((b) => b.setAttribute("aria-pressed", "true"));
      apply();
    });
    $$(".cov-cell[data-agent]").forEach((c) =>
      c.addEventListener("click", (e) => {
        e.preventDefault();
        Object.assign(state, { agent: c.dataset.agent, cat: c.dataset.cat });
        apply();
        toolbar.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }),
    );
    apply();
  }

  /* ---- compare picker ---- */
  const cmp = $("#cmp");
  if (cmp) {
    const MAX = 4;
    const buttons = $$(".pick");
    const valid = new Set(buttons.map((b) => b.dataset.agent));
    let picked = (new URLSearchParams(location.search).get("a") || "").split(",").filter((s) => valid.has(s)).slice(0, MAX);
    if (!picked.length) picked = buttons.filter((b) => b.getAttribute("aria-pressed") === "true").map((b) => b.dataset.agent);
    const hint = $("#pick-hint");

    const render = () => {
      const on = new Set(picked);
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(on.has(b.dataset.agent))));
      $$(".cmp-cell[data-agent]", cmp).forEach((c) => (c.hidden = !on.has(c.dataset.agent)));
      // keep column order = pick order
      $$(".cmp-row", cmp).forEach((row) =>
        picked.forEach((slug) => {
          const c = $(`.cmp-cell[data-agent="${slug}"]`, row);
          if (c) row.appendChild(c);
        }),
      );
      cmp.style.setProperty("--n", Math.max(1, picked.length));
      hint.textContent = picked.length >= MAX ? `Showing ${MAX}, the maximum. Deselect one to swap.` : "Up to 4 agents. The link updates as you pick.";
      const p = new URLSearchParams(location.search);
      p.set("a", picked.join(","));
      history.replaceState(null, "", `${location.pathname}?${p}`);
    };

    buttons.forEach((b) =>
      b.addEventListener("click", () => {
        const s = b.dataset.agent;
        if (picked.includes(s)) picked = picked.filter((x) => x !== s);
        else if (picked.length < MAX) picked.push(s);
        else picked = [...picked.slice(1), s];
        render();
      }),
    );
    render();
  }
})();
