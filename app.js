/* =========================================================
   LITPAX PITCH — PRESENTATION ENGINE
   Content lives in config.js
   ========================================================= */
(function () {
  "use strict";

  const C = window.PITCH_CONFIG;
  const stage = document.getElementById("stage");
  const W = 1280, H = 720;

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  const pad = (n) => String(n).padStart(2, "0");

  /* ---------- small building blocks ---------- */
  function logo(cls) {
    const img = C.company.logo
      ? `<img src="${esc(C.company.logo)}" alt="${esc(C.company.name)}" onerror="this.remove()">`
      : "";
    return `<div class="logo ${cls || ""}">${img}<span>${esc(C.company.shortName)}</span></div>`;
  }

  function frame(src, title, cls) {
    return `
      <div class="frame ${cls || ""}">
        <div class="frame-bar"><i></i><i></i><i></i><span>${esc(title)}</span></div>
        <div class="frame-screen${src ? "" : " empty"}">
          ${src ? `<img src="${esc(src)}" alt="${esc(title)}" onerror="this.parentNode.classList.add('empty');this.remove()">` : ""}
          <div class="skel">
            <div class="sk-side"><b></b><b></b><b></b><b></b></div>
            <div class="sk-main">
              <div class="sk-title">${esc(title)}</div>
              <div class="sk-row"><b></b><b></b><b></b></div>
              <div class="sk-chart"><i style="height:40%"></i><i style="height:65%"></i><i style="height:50%"></i><i style="height:80%"></i><i style="height:60%"></i><i style="height:90%"></i><i style="height:72%"></i></div>
              <div class="sk-lines"><b></b><b></b><b></b></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  const arrow = `<svg class="arr" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
  const check = `<svg class="chk" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

  function chrome(inner, opts) {
    opts = opts || {};
    return `
      <div class="slide-top">
        ${logo("logo-sm")}
        <span class="slide-kicker">${esc(opts.kicker || "How our system runs")}</span>
      </div>
      ${inner}`;
  }

  /* ---------- slide templates ---------- */
  const slides = [];
  const stepSlideIndex = {};

  // 1. Title
  slides.push({
    title: "Title",
    cls: "s-title",
    html: `
      <div class="title-left">
        ${logo("logo-lg rv")}
        <div class="eyebrow rv">${esc(C.company.tagline)} · ${esc(C.company.location)}</div>
        <h1 class="rv">How our<br><em>system</em> runs.</h1>
        <p class="lead rv">From your first enquiry to after-sales service — one connected digital chain, built in-house.</p>
        <div class="title-phases rv">${C.phases.map((p, i) => `<span>${esc(p)}</span>${i < C.phases.length - 1 ? arrow : ""}`).join("")}</div>
      </div>
      <div class="title-right">
        ${frame(C.steps.find((s) => s.id === "order").shot, "Litpax ERP", "tf tf1 rv")}
        ${frame(C.steps.find((s) => s.id === "production").shot, "Production Tracker", "tf tf2 rv")}
        ${frame(C.steps.find((s) => s.id === "clientdash").shot, "Partner Dashboard", "tf tf3 rv")}
      </div>`
  });

  // 2. At a glance
  slides.push({
    title: "At a glance",
    cls: "s-glance",
    html: chrome(`
      <div class="glance-wrap">
        <div class="glance-left">
          <div class="eyebrow rv">About us</div>
          <h2 class="rv">${esc(C.company.name)}</h2>
          <p class="body rv">${esc(C.company.about)}</p>
        </div>
        <div class="stats">
          ${C.stats.map((s) => `<div class="stat rv"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}
        </div>
      </div>`)
  });

  // 3. The chain (overview map) — filled after step slides are indexed
  const chainSlidePos = slides.length;
  slides.push({ title: "The chain", cls: "s-chain", html: "" });

  // 4. Step slides
  C.steps.forEach((s, i) => {
    stepSlideIndex[s.id] = slides.length;
    slides.push({
      title: `${pad(i + 1)} · ${s.title}`,
      cls: "s-step",
      html: chrome(`
        <div class="step-wrap">
          <div class="step-left">
            <div class="eyebrow rv"><span class="phase-pill">${esc(s.phase)}</span>Step ${pad(i + 1)} of ${pad(C.steps.length)}</div>
            <h2 class="rv">${esc(s.title)}</h2>
            <div class="app-name rv">${esc(s.app)}</div>
            <p class="tag rv">${esc(s.tagline)}</p>
            <ul class="points">${s.points.map((p) => `<li class="rv">${check}<span>${esc(p)}</span></li>`).join("")}</ul>
            ${s.liveUrl ? `<a class="btn rv" href="${esc(s.liveUrl)}" target="_blank" rel="noopener">Open live app ${arrow}</a>` : ""}
          </div>
          <div class="step-right rv">
            ${frame(s.shot, s.app, "frame-main")}
            ${s.login ? frame(s.login, "Login", "frame-mini") : ""}
          </div>
        </div>
        ${miniChain(i)}`, { kicker: s.phase })
    });
  });

  // 5. Traceability highlight
  const life = [
    { t: "Material issued", a: "IMS" },
    { t: "Built at station", a: "Production Tracker" },
    { t: "Quality checked", a: "Daily Checklist" },
    { t: "Scanned out", a: "Dispatch Scanner" },
    { t: "Live at partner", a: "Partner Dashboard" },
    { t: "Service & warranty", a: "Service Hub · Exchange" }
  ];
  slides.push({
    title: "One barcode, complete history",
    cls: "s-trace",
    html: chrome(`
      <div class="center-head">
        <div class="eyebrow rv">Traceability</div>
        <h2 class="rv">One barcode. Complete history.</h2>
        <p class="tag rv">Scan any Litpax battery and we can tell you where it was built, who built it, when it shipped and every service it has had.</p>
      </div>
      <div class="barcode rv">${Array.from({ length: 46 }, (_, k) => `<i style="width:${[2, 4, 2, 6, 3, 2, 5][k % 7]}px"></i>`).join("")}<span>LTX-48V-0000123</span></div>
      <div class="life">
        ${life.map((l, k) => `<div class="life-step rv"><div class="life-dot">${pad(k + 1)}</div><b>${esc(l.t)}</b><span>${esc(l.a)}</span></div>`).join("")}
      </div>`, { kicker: "Highlight" })
  });

  // 6. FMS layer
  slides.push({
    title: "FMS — the control layer",
    cls: "s-fms",
    html: chrome(`
      <div class="fms-wrap">
        <div class="fms-left">
          <div class="eyebrow rv">Flow Management System</div>
          <h2 class="rv">Nothing moves<br>without an owner.</h2>
          <p class="tag rv">Our FMS sits on top of the whole chain and tracks every step against its planned time.</p>
          <ul class="points">${C.fms.points.map((p) => `<li class="rv">${check}<span>${esc(p)}</span></li>`).join("")}</ul>
          ${C.fms.liveUrl ? `<a class="btn rv" href="${esc(C.fms.liveUrl)}" target="_blank" rel="noopener">Open FMS ${arrow}</a>` : ""}
        </div>
        <div class="fms-right">
          <div class="fms-layer rv">
            <div class="fms-band"><span class="pulse"></span>FMS · Every step · Owner · Planned time · Status</div>
            <div class="fms-flows">
              ${C.fms.flows.map((f, k) => `<div class="fms-flow"><b>${pad(k + 1)}</b><span>${esc(f)}</span></div>`).join("")}
            </div>
          </div>
          <div class="fms-table rv">
            <div class="ft-row ft-head"><span>Step</span><span>Owner</span><span>Planned</span><span>Status</span></div>
            <div class="ft-row"><span>Order received</span><span>Sales</span><span>2 hrs</span><span class="st st-done">Done</span></div>
            <div class="ft-row"><span>Material issued</span><span>Store</span><span>4 hrs</span><span class="st st-done">Done</span></div>
            <div class="ft-row"><span>Assembly</span><span>Production</span><span>1 day</span><span class="st st-pend">In progress</span></div>
            <div class="ft-row"><span>Dispatch</span><span>Dispatch</span><span>4 hrs</span><span class="st st-wait">Planned</span></div>
            <div class="ft-note">Illustrative view</div>
          </div>
        </div>
      </div>`, { kicker: "Control layer" })
  });

  // 7. Management control
  slides.push({
    title: "Management control tower",
    cls: "s-control",
    html: chrome(`
      <div class="control-wrap">
        <div class="control-left">
          <div class="eyebrow rv">Management</div>
          <h2 class="rv">Decisions on data,<br>not on guesswork.</h2>
          <p class="tag rv">Leadership sees the whole business on one screen — daily and weekly.</p>
        </div>
        <div class="control-grid">
          ${C.control.map((c) => `<div class="ctl rv">${frame(c.shot, c.name, "frame-thumb")}<b>${esc(c.name)}</b><span>${esc(c.desc)}</span></div>`).join("")}
        </div>
      </div>`, { kicker: "Control tower" })
  });

  // 8. Gallery
  slides.push({
    title: "Our apps",
    cls: "s-gallery",
    html: chrome(`
      <div class="center-head compact">
        <div class="eyebrow rv">Built in-house</div>
        <h2 class="rv">One family of apps.</h2>
      </div>
      <div class="gallery">
        ${C.gallery.map((g) => `<div class="g-item rv">${frame(g.shot, g.name, "frame-g")}<span>${esc(g.name)}</span></div>`).join("")}
      </div>`, { kicker: "App family" })
  });

  // 9. Why Litpax
  slides.push({
    title: "Why partner with Litpax",
    cls: "s-why",
    html: chrome(`
      <div class="center-head compact">
        <div class="eyebrow rv">What this means for you</div>
        <h2 class="rv">Why partner with Litpax.</h2>
      </div>
      <div class="why-grid">
        ${C.why.map((w, k) => `<div class="why rv"><div class="why-n">${pad(k + 1)}</div><b>${esc(w.t)}</b><span>${esc(w.d)}</span></div>`).join("")}
      </div>`, { kicker: "Value" })
  });

  // 10. Contact
  const ct = C.company.contact;
  const ctRows = [
    ["Phone", ct.phone], ["Email", ct.email], ["Website", ct.website], ["Address", ct.address]
  ].filter((r) => r[1]);
  slides.push({
    title: "Thank you",
    cls: "s-end",
    html: `
      <div class="end-wrap">
        ${logo("logo-lg rv")}
        <h1 class="rv">Let's build<br><em>together.</em></h1>
        <p class="lead rv">${esc(C.company.name)}</p>
        <div class="contact">${ctRows.map((r) => `<div class="rv"><span>${esc(r[0])}</span><b>${esc(r[1])}</b></div>`).join("")}</div>
      </div>`
  });

  // Fill the chain map now that indexes are known
  slides[chainSlidePos].html = chrome(`
    <div class="center-head compact">
      <div class="eyebrow rv">The complete chain</div>
      <h2 class="rv">Enquiry to service. One connected flow.</h2>
    </div>
    <div class="chain">
      ${C.phases.map((ph, pi) => `
        <div class="chain-col rv">
          <div class="chain-phase"><b>${pad(pi + 1)}</b>${esc(ph)}</div>
          ${C.steps.filter((s) => s.phase === ph).map((s) => `
            <button class="chain-node" data-go="${stepSlideIndex[s.id]}">
              <b>${esc(s.title)}</b><span>${esc(s.app)}</span>
            </button>`).join("")}
        </div>
        ${pi < C.phases.length - 1 ? `<div class="chain-link rv">${arrow}</div>` : ""}`).join("")}
    </div>
    <div class="chain-fms rv"><span class="pulse"></span>FMS tracks every step · owner · planned time · status</div>`, { kicker: "Overview" });

  function miniChain(active) {
    return `
      <div class="mini">
        ${C.phases.map((ph) => {
          const items = C.steps.map((s, i) => ({ s, i })).filter((x) => x.s.phase === ph);
          const on = items.some((x) => x.i === active);
          return `<div class="mini-ph${on ? " on" : ""}"><em>${esc(ph)}</em><div>${items
            .map((x) => `<i class="${x.i < active ? "done" : x.i === active ? "cur" : ""}" title="${esc(x.s.title)}"></i>`)
            .join("")}</div></div>`;
        }).join("")}
      </div>`;
  }

  /* ---------- render ---------- */
  stage.innerHTML = slides
    .map((s, i) => `<section class="slide ${s.cls}" data-i="${i}" aria-label="${esc(s.title)}"><div class="slide-inner">${s.html}</div><div class="slide-num">${pad(i + 1)}</div></section>`)
    .join("");

  const els = Array.from(stage.querySelectorAll(".slide"));
  els.forEach((el) => {
    el.querySelectorAll(".rv").forEach((r, k) => r.style.setProperty("--d", k));
  });

  /* ---------- navigation ---------- */
  let cur = 0;
  const counter = document.getElementById("counter");
  const bar = document.querySelector("#progress span");

  function go(n) {
    n = Math.max(0, Math.min(els.length - 1, n));
    els.forEach((el, i) => {
      el.classList.toggle("active", i === n);
      el.classList.toggle("past", i < n);
    });
    cur = n;
    counter.textContent = `${n + 1} / ${els.length}`;
    bar.style.width = `${((n + 1) / els.length) * 100}%`;
    try { history.replaceState(null, "", `#${n + 1}`); } catch (e) {}
  }

  function fit() {
    const vw = window.innerWidth, vh = window.innerHeight;
    const s = Math.min(vw / W, vh / H);
    stage.style.transform = `translate(-50%, -50%) scale(${s})`;
  }

  stage.addEventListener("click", (e) => {
    const b = e.target.closest("[data-go]");
    if (b) go(+b.dataset.go);
  });

  document.getElementById("btnPrev").onclick = () => go(cur - 1);
  document.getElementById("btnNext").onclick = () => go(cur + 1);
  document.getElementById("btnFull").onclick = toggleFull;

  function toggleFull() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || function () {}).call(document.documentElement);
    } else {
      document.exitFullscreen && document.exitFullscreen();
    }
  }

  // Overview
  const ov = document.getElementById("overview");
  const ovGrid = document.getElementById("ovGrid");
  ovGrid.innerHTML = slides
    .map((s, i) => `<button data-ov="${i}"><b>${pad(i + 1)}</b><span>${esc(s.title)}</span></button>`)
    .join("");
  ovGrid.addEventListener("click", (e) => {
    const b = e.target.closest("[data-ov]");
    if (b) { go(+b.dataset.ov); closeOv(); }
  });
  function openOv() { ov.hidden = false; }
  function closeOv() { ov.hidden = true; }
  document.getElementById("btnOverview").onclick = openOv;
  document.getElementById("btnCloseOv").onclick = closeOv;
  ov.addEventListener("click", (e) => { if (e.target === ov) closeOv(); });

  document.addEventListener("keydown", (e) => {
    if (e.target.closest && e.target.closest("input,textarea")) return;
    const k = e.key;
    if (!ov.hidden && k === "Escape") return closeOv();
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); go(cur + 1); }
    else if (["ArrowLeft", "PageUp", "Backspace"].includes(k)) { e.preventDefault(); go(cur - 1); }
    else if (k === "Home") go(0);
    else if (k === "End") go(els.length - 1);
    else if (k === "f" || k === "F") toggleFull();
    else if (k === "o" || k === "O") (ov.hidden ? openOv : closeOv)();
  });

  // Swipe
  let tx = null, ty = null;
  document.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  document.addEventListener("touchend", (e) => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1));
    tx = ty = null;
  });

  window.addEventListener("resize", fit);
  fit();
  const start = parseInt((location.hash || "").replace("#", ""), 10);
  go(isNaN(start) ? 0 : start - 1);
})();
