/* =========================================================
   LITPAX PITCH — PRESENTATION ENGINE
   Content lives in config.js
   ========================================================= */
(function () {
  "use strict";

  const C = window.PITCH_CONFIG;
  // colour theme: config.theme, or ?theme=brand in the URL for a quick preview
  document.documentElement.dataset.theme =
    new URLSearchParams(location.search).get("theme") || C.theme || "indigo";
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

  // Screenshot (png/jpg) or screen recording (mp4/webm); placeholder if missing
  function media(src, title, isMain) {
    const isVid = /\.(mp4|webm)$/i.test(src || "");
    // data-shot on the step's right side: "1" = screenshot loaded, "0" = missing
    const mark = (v) => isMain ? `var r=this.closest('.step-right');if(r)r.dataset.shot='${v}';` : "";
    const fail = `onerror="${mark(0)}this.parentNode.classList.add('empty');this.remove()"`;
    const el = !src ? ""
      : isVid ? `<video src="${esc(src)}" muted loop playsinline preload="metadata" onloadeddata="${mark(1)}" ${fail}></video>`
      : `<img src="${esc(src)}" alt="${esc(title)}" onload="${mark(1)}" ${fail}>`;
    return `
        <div class="frame-screen${src ? "" : " empty"}">
          ${el}
          <div class="skel">
            <div class="sk-side"><b></b><b></b><b></b><b></b></div>
            <div class="sk-main">
              <div class="sk-title">${esc(title)}</div>
              <div class="sk-row"><b></b><b></b><b></b></div>
              <div class="sk-chart"><i style="height:40%"></i><i style="height:65%"></i><i style="height:50%"></i><i style="height:80%"></i><i style="height:60%"></i><i style="height:90%"></i><i style="height:72%"></i></div>
              <div class="sk-lines"><b></b><b></b><b></b></div>
            </div>
          </div>
        </div>`;
  }

  function frame(src, title, cls) {
    return `
      <div class="frame ${cls || ""}">
        <div class="frame-bar"><i></i><i></i><i></i><span>${esc(title)}</span></div>
        ${media(src, title)}
      </div>`;
  }

  const arrow = `<svg class="arr" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`;
  const check = `<svg class="chk" viewBox="0 0 24 24"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>`;

  const svg = (d, cls) => `<svg viewBox="0 0 24 24" class="${cls || "ic"}"><path d="${d}"/></svg>`;
  const ICON = {
    check: svg("M5 12.5l4.5 4.5L19 7.5"),
    x: svg("M6 6l12 12M18 6L6 18"),
    truck: svg("M3 7h11v9H3zM14 10h4l3 3v3h-7M5.2 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0M15.2 17.5a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0-3.6 0"),
    phone: svg("M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"),
    scan: svg("M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M7 12h10"),
    user: svg("M8 8a4 4 0 1 0 8 0a4 4 0 1 0-8 0M4 21a8 8 0 0 1 16 0"),
    doc: svg("M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6"),
    box: svg("M3 7.5L12 3l9 4.5v9L12 21l-9-4.5zM3 7.5l9 4.5 9-4.5M12 12v9"),
    bell: svg("M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20a2 2 0 0 0 4 0"),
    alert: svg("M12 8v5M12 16.5v.5M3 12a9 9 0 1 0 18 0a9 9 0 1 0-18 0"),
    play: svg("M8 5l11 7-11 7z"),
    img: svg("M5 4h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM3 16l5-5 4 4 3-3 6 6"),
    star: svg("M12 3l2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.5 6.4 20.4l1.1-6.3L3 9.7l6.2-.9z", "st-ic")
  };
  const DEMO = Object.assign({ autoSwitch: true, screenshotSeconds: 6 }, C.demo || {});
  const TAG = C.taglines || {};
  const AMB = C.ambition || null;
  const PROM = C.promise || null;
  const MILES = (C.milestones || []).filter((m) => m && m.year && m.title);
  const INTRO = C.intro || { enabled: false };

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
        <p class="title-tag rv">${esc(TAG.title || "")}</p>
        <p class="lead rv">From your first enquiry to after-sales service — one connected digital chain, built in-house.</p>
        <div class="title-phases rv">${C.phases.map((p, i) => `<span>${esc(p)}</span>${i < C.phases.length - 1 ? arrow : ""}`).join("")}</div>
      </div>
      <div class="title-right">
        ${frame(C.steps.find((s) => s.id === "order").shot, "Litpax ERP", "tf tf1 rv")}
        ${frame(C.steps.find((s) => s.id === "production").shot, "Production Tracker", "tf tf2 rv")}
        ${frame(C.steps.find((s) => s.id === "clientdash").shot, "Partner Dashboard", "tf tf3 rv")}
        ${C.company.product ? `<div class="title-batt rv"><img src="${esc(C.company.product)}" alt="Litpax battery" onerror="this.parentNode.remove()"><span class="batt-glow"></span></div>` : ""}
      </div>`
  });

  // 1b. Ambition — Milestone 2027 (cinematic dark statement slide)
  if (AMB) {
    slides.push({
      title: AMB.kicker || "Our ambition",
      cls: "s-amb",
      hero: "ambition",
      html: `
        <div class="amb-orbs"><i></i><i></i><i></i></div>
        <div class="slide-top">
          <div class="logo logo-sm logo-white">${C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="${esc(C.company.name)}" onerror="this.remove()">` : ""}<span>${esc(C.company.shortName)}</span></div>
          <span class="slide-kicker">Our ambition</span>
        </div>
        <div class="amb-wrap">
          <div class="amb-left">
            <div class="amb-kicker rv"><span class="pulse"></span>${esc(AMB.kicker)}<i></i>${esc(AMB.team)}</div>
            <div class="amb-big rv"><b data-k="pct">0</b><em>%</em><span>${esc(AMB.headline)}</span></div>
            <div class="amb-head2 rv">${esc(AMB.headline2)}</div>
            <p class="amb-sub rv">${AMB.sub.split(" ").map((w) => `<span class="w">${esc(w)}</span>`).join(" ")}</p>
            <div class="amb-quote rv"><span class="q">“</span><span data-k="quote"></span><i class="caret"></i></div>
          </div>
          <div class="amb-right rv">
            <div class="orbit">
              <div class="orbit-ring r1"></div><div class="orbit-ring r2"></div>
              <div class="orbit-core">${C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="" onerror="this.remove()">` : ""}<b>${esc(AMB.kicker)}</b></div>
              <div class="orbit-track">${(AMB.values || []).map((v, i, a) => `<span class="orbit-chip" style="--a:${(360 / a.length) * i}deg"><i>${esc(v)}</i></span>`).join("")}</div>
            </div>
          </div>
        </div>
        <div class="amb-trio">${(AMB.closing || []).map((t) => `<span>${esc(t)}</span>`).join("")}</div>`
    });
  }

  // 1c. Milestones (only when filled in config.js)
  if (MILES.length) {
    slides.push({
      title: "Our journey",
      cls: "s-miles",
      hero: "miles",
      html: chrome(`
        <div class="center-head compact">
          <div class="eyebrow rv">Our journey</div>
          <h2 class="rv">Milestones that built Litpax.</h2>
        </div>
        <div class="miles">
          <div class="miles-line"><i></i></div>
          ${MILES.map((m, i) => `
            <div class="mile ${i % 2 ? "down" : "up"}${m.goal ? " goal" : ""}">
              <div class="mile-card"><b>${esc(m.year)}</b><strong>${esc(m.title)}</strong>${m.desc ? `<span>${esc(m.desc)}</span>` : ""}</div>
              <div class="mile-dot"></div>
            </div>`).join("")}
        </div>`, { kicker: "Journey" })
    });
  }

  // 2. At a glance
  slides.push({
    title: "At a glance",
    cls: "s-glance",
    hero: "stats",
    html: chrome(`
      <div class="glance-wrap">
        <div class="glance-left">
          <div class="eyebrow rv">About us</div>
          <h2 class="rv">${esc(C.company.name)}</h2>
          <p class="body rv">${esc(C.company.about)}</p>
        </div>
        <div class="stats">
          ${C.stats.map((s) => {
            const m = String(s.value).match(/^(\d+)(.*)$/);
            return `<div class="stat rv"><b${m ? ` data-count="${m[1]}" data-suffix="${esc(m[2])}"` : ""}>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`;
          }).join("")}
        </div>
      </div>`)
  });

  // 3. The chain (overview map) — filled after step slides are indexed
  const chainSlidePos = slides.length;
  slides.push({ title: "The chain", cls: "s-chain", hero: "chain", html: "" });

  // 4. Step slides
  C.steps.forEach((s, i) => {
    stepSlideIndex[s.id] = slides.length;
    slides.push({
      vkey: "step-" + s.id,
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
          <div class="step-right rv"${s.shot ? "" : ' data-shot="0"'}>
            <div class="frame frame-main">
              <div class="frame-bar"><i></i><i></i><i></i><span>${esc(s.app)}</span></div>
              <div class="views">
                <div class="view view-demo on">
                  <div class="scene-host" data-scene="${esc(s.scene || s.id)}"></div>
                  <span class="demo-tag">Illustrative demo</span>
                </div>
                <div class="view view-shot">${media(s.shot, s.app, true)}</div>
              </div>
            </div>
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
    hero: "trace",
    html: chrome(`
      <div class="center-head">
        <div class="eyebrow rv">Traceability</div>
        <h2 class="rv">One barcode. Complete history.</h2>
        <p class="tag rv">Scan any Litpax battery and we can tell you where it was built, who built it, when it shipped and every service it has had.</p>
      </div>
      <div class="barcode rv">${Array.from({ length: 46 }, (_, k) => `<i style="width:${[2, 4, 2, 6, 3, 2, 5][k % 7]}px"></i>`).join("")}<span>LTX-48V-0000123</span></div>
      <div class="life">
        <div class="life-fill"></div>
        ${life.map((l, k) => `<div class="life-step rv"><div class="life-dot">${pad(k + 1)}</div><b>${esc(l.t)}</b><span>${esc(l.a)}</span></div>`).join("")}
      </div>`, { kicker: "Highlight" })
  });

  // 6. FMS layer
  slides.push({
    title: "FMS — the control layer",
    cls: "s-fms",
    hero: "fms",
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
            <div class="ft-row" data-k="r3"><span>Assembly</span><span>Production</span><span>1 day</span><span class="st st-pend">In progress</span></div>
            <div class="ft-row" data-k="r4"><span>Dispatch</span><span>Dispatch</span><span>4 hrs</span><span class="st st-wait">Planned</span></div>
            <div class="ft-row ft-new" data-k="r5"><span>Delivery</span><span>Logistics</span><span>2 days</span><span class="st st-bad">Overdue</span></div>
            <div class="ft-alert" data-k="al">${ICON.bell} Delay alert sent to the step owner</div>
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

  // 8b. The Litpax Promise (service)
  if (PROM) {
    slides.push({
      title: PROM.kicker || "Our promise",
      cls: "s-promise",
      hero: "promise",
      html: chrome(`
        <div class="prom-wrap">
          <div class="prom-left">
            <div class="eyebrow rv">${esc(PROM.kicker)}</div>
            <div class="prom-line rv">${esc(PROM.lead)} <span class="strike">${esc(PROM.strike)}</span></div>
            <div class="prom-line big rv">${esc(PROM.sell)} <span class="rot" data-k="rot">${(PROM.words || []).map((w, i) => `<em${i === 0 ? ' class="on"' : ""}>${esc(w)}</em>`).join("")}</span></div>
            <p class="prom-sub rv"><b>${esc(PROM.line)}</b><br>${esc(PROM.sub)}</p>
          </div>
          <div class="prom-right rv">
            <div class="ptrack">
              <div class="ptrack-line"><i data-k="pfill"></i></div>
              ${(PROM.flow || []).map((f, i) => `<div class="pstop" data-k="ps${i}"><div class="pstop-d">${[ICON.phone, ICON.user, ICON.box, ICON.truck][i] || ICON.check}</div><b>${esc(f)}</b></div>`).join("")}
              <div class="pticket" data-k="tk"><span>LTX-R-0042</span><em data-k="tks">${esc((PROM.flow || [""])[0])}</em></div>
            </div>
            <div class="prom-stats">
              <div><b>1</b><span>ticket per customer issue</span></div>
              <div><b>Every</b><span>step visible to the customer</span></div>
            </div>
          </div>
        </div>`, { kicker: "Our promise" })
    });
  }

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
    hero: "end",
    html: `
      <div class="end-wrap">
        ${logo("logo-lg rv")}
        <h1 class="rv">Let's build<br><em>together.</em></h1>
        ${TAG.end ? `<div class="end-tag rv">${TAG.end.split(".").filter((x) => x.trim()).map((x) => `<span>${esc(x.trim())}.</span>`).join("")}</div>` : ""}
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

  const CLS2KEY = {
    "s-title": "title", "s-amb": "ambition", "s-miles": "miles", "s-glance": "glance", "s-chain": "chain",
    "s-trace": "trace", "s-fms": "fms", "s-control": "control", "s-gallery": "gallery",
    "s-promise": "promise", "s-why": "why", "s-end": "end"
  };

  /* ---------- render ---------- */
  stage.innerHTML = slides
    .map((s, i) => `<section class="slide ${s.cls}" data-i="${i}" data-vkey="${s.vkey || CLS2KEY[s.cls] || ""}"${s.hero ? ` data-hero="${s.hero}"` : ""} aria-label="${esc(s.title)}"><div class="slide-inner">${s.html}</div><div class="slide-num">${pad(i + 1)}</div></section>`)
    .join("");

  const els = Array.from(stage.querySelectorAll(".slide"));
  els.forEach((el) => {
    el.querySelectorAll(".rv").forEach((r, k) => r.style.setProperty("--d", k));
  });

  /* =========================================================
     ANIMATION ENGINE
     Each scene re-renders its HTML and plays a script in a loop.
     Leaving a slide stops everything on it.
     ========================================================= */
  const fmtIN = (n) => Number(n).toLocaleString("en-IN");
  const qa = (root, s) => Array.from(root.querySelectorAll(s));
  const on = (el) => { if (!el) return; el.classList.add("in"); if (el.classList.contains("toast")) SFX.ding(); };
  const K = (r) => (s) => r.querySelector(`[data-k="${s}"]`);

  function makeCtx() {
    const ctx = { alive: true, timers: [], rafs: [] };
    ctx.wait = (ms) => new Promise((res) => {
      ctx.timers.push(setTimeout(() => { if (ctx.alive) res(); }, ms));
    });
    ctx.count = (el, from, to, ms, fmt) => new Promise((res) => {
      fmt = fmt || fmtIN;
      const t0 = performance.now();
      const tick = (now) => {
        if (!ctx.alive) return;
        const p = Math.min(1, (now - t0) / ms), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(from + (to - from) * e));
        if (p < 1) ctx.rafs.push(requestAnimationFrame(tick)); else res();
      };
      ctx.rafs.push(requestAnimationFrame(tick));
    });
    ctx.type = async (el, text, ms) => {
      el.textContent = "";
      for (const ch of text) { await ctx.wait(ms || 45); el.textContent += ch; }
    };
    ctx.stop = () => {
      ctx.alive = false;
      ctx.timers.forEach(clearTimeout);
      ctx.rafs.forEach(cancelAnimationFrame);
    };
    return ctx;
  }

  function stepper(labels) {
    const n = labels.length, edge = 50 / n;
    return `<div class="stp"><div class="stp-line" style="left:${edge}%;right:${edge}%"><i></i></div>${labels
      .map((l) => `<div class="stp-i"><div class="stp-d">${ICON.check}</div><span>${esc(l)}</span></div>`).join("")}</div>`;
  }
  function setStep(r, k) {
    const its = qa(r, ".stp-i");
    its.forEach((it, i) => { it.classList.toggle("done", i < k); it.classList.toggle("cur", i === k); });
    const line = r.querySelector(".stp-line i");
    if (line) line.style.width = (Math.min(k, its.length - 1) / (its.length - 1)) * 100 + "%";
  }
  function pill(el, cls, html) {
    el.className = "pl " + (cls || "");
    el.innerHTML = html;
  }
  function logRow(box, html, cls, max) {
    const d = document.createElement("div");
    d.className = cls || "";
    d.innerHTML = html;
    box.prepend(d);
    while (box.children.length > (max || 3)) box.lastChild.remove();
  }
  const bars = (n, h) => Array.from({ length: n }, (_, k) => `<i style="width:${[2, 4, 2, 5, 3, 2, 4][k % 7]}px"></i>`).join("");

  /* ---------- the 16 demo scenes ---------- */
  const SCENES = {
    lead: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Leads</b><div class="chips"><span class="pl ac">All 24</span><span class="pl">Follow-up today 5</span><span class="pl">Overdue 1</span></div></div>
        <div class="list">
          <div class="lrow new sx" data-k="new"><div class="av">VW</div><div class="lc"><b>Volt Wheels Pvt. Ltd.</b><span>E-rickshaw maker · 40 packs/month</span></div><span class="pl ac" data-k="st">New</span><span class="fu" data-k="fu">No follow-up</span></div>
          ${[["ME", "Metro EV Motors", "E-scooter OEM", "Quoted", "Today 4:00 PM"],
             ["SA", "Sharma Auto Agency", "Dealer · Rohtak", "Negotiation", "Tomorrow"],
             ["GR", "GreenRide Mobility", "Fleet operator", "Contacted", "Yesterday"]]
            .map((x, i) => `<div class="lrow"${i === 2 ? ' data-k="od"' : ""}><div class="av">${x[0]}</div><div class="lc"><b>${x[1]}</b><span>${x[2]}</span></div><span class="pl">${x[3]}</span><span class="fu">${x[4]}</span></div>`).join("")}
        </div>
        <div class="toast" data-k="toast">${ICON.bell} Follow-up reminder sent to Sales</div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(500); on(k("new")); k("new").classList.add("flash");
        await c.wait(1200); pill(k("st"), "ac", "Contacted");
        await c.wait(700); k("fu").textContent = "Tomorrow 11:00 AM"; k("fu").classList.add("set");
        await c.wait(1100); k("od").classList.add("overdue", "shake"); k("od").querySelector(".fu").textContent = "Overdue · 1 day";
        await c.wait(900); on(k("toast"));
        await c.wait(2200);
      }
    },

    quote: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Quotation <span class="mut">#Q-1042</span></b><span class="pl">Metro EV Motors</span></div>
        <div class="cardx qt">
          <div class="qrow qh"><span>Item</span><span>Qty</span><span>Rate</span><span>GST</span><span>Amount</span></div>
          <div class="qrow sx" data-k="i1"><span>48V 30Ah Li-ion Pack</span><span>10</span><span>18,500</span><span><em class="pl ac">18%</em></span><span>1,85,000</span></div>
          <div class="qrow sx" data-k="i2"><span>Smart Charger 48V</span><span>10</span><span>2,200</span><span><em class="pl ac">5%</em></span><span>22,000</span></div>
          <div class="qsum">
            <div class="sx" data-k="s1"><span>Subtotal</span><b>₹ 2,07,000</b></div>
            <div class="sx" data-k="s2"><span>GST @ 18% <em class="auto">auto</em></span><b>₹ 33,300</b></div>
            <div class="sx" data-k="s3"><span>GST @ 5% <em class="auto">auto</em></span><b>₹ 1,100</b></div>
            <div class="qtot sx" data-k="s4"><span>Total</span><b>₹ <i data-k="tot">0</i></b></div>
          </div>
        </div>
        <div class="qact"><span class="pl ok sx" data-k="pdf">${ICON.check} Q-1042.pdf ready to send</span><span class="btnx" data-k="btn">${ICON.doc} Generate PDF</span></div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(500); on(k("i1"));
        await c.wait(650); on(k("i2"));
        await c.wait(650); on(k("s1"));
        await c.wait(450); on(k("s2"));
        await c.wait(450); on(k("s3"));
        await c.wait(450); on(k("s4"));
        await c.count(k("tot"), 0, 241400, 1100);
        await c.wait(500); k("btn").classList.add("press");
        await c.wait(450); on(k("pdf"));
        await c.wait(2200);
      }
    },

    dealer: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Find authorised dealer</b><span class="pl">PIN code based</span></div>
        <div class="pin"><span class="mut">PIN code</span><b data-k="pin"></b><i class="caret"></i><span class="pl ac sx" data-k="chk">Checking…</span></div>
        <div class="cardx dcard sx" data-k="res">
          <div class="dtop"><div class="av">SB</div><div class="lc"><b>Shree Balaji EV Solutions</b><span>Authorised dealer · Rohtak, Haryana</span></div><span class="pl ok">${ICON.check} Verified</span></div>
          <div class="dmeta"><span>Area <b>Rohtak (124001)</b></span><span>Sales <b>Yes</b></span><span>Service <b>Available</b></span></div>
        </div>
        <div class="cardx dflow sx" data-k="flow">
          <b>Dealer onboarding</b>
          <div class="dsteps">${["Form submitted", "Documents verified", "Agreement PDF generated"].map((t, i) => `<span class="pl" data-k="d${i}">${t}</span>`).join("")}</div>
        </div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(500); await c.type(k("pin"), "124001", 120);
        await c.wait(300); on(k("chk"));
        await c.wait(1000); k("chk").classList.remove("in"); on(k("res"));
        await c.wait(1100); on(k("flow"));
        for (let i = 0; i < 3; i++) { await c.wait(600); const p = k("d" + i); pill(p, "ok", ICON.check + p.textContent); }
        await c.wait(2200);
      }
    },

    order: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Orders</b><span class="pl ac"><span class="pulse"></span>Live</span></div>
        <div class="cardx ord">
          <div class="otop"><div class="lc"><b>ORD-2026-0187</b><span>Metro EV Motors · 50 × 48V 30Ah</span></div><span class="pl ac" data-k="st">Booked</span></div>
          ${stepper(["Booked", "Material", "Production", "QC", "Ready", "Dispatched"])}
        </div>
        <div class="trio">
          <div class="cardx omini"><span>Orders this month</span><b>38</b></div>
          <div class="cardx omini"><span>In production</span><b data-k="ip">12</b></div>
          <div class="cardx omini"><span>Dispatched</span><b data-k="dp">21</b></div>
        </div>
      </div>`,
      run: async (r, c) => {
        const k = K(r), lab = ["Booked", "Material issued", "In production", "Quality check", "Ready", "Dispatched"];
        setStep(r, 0);
        for (let i = 1; i <= 5; i++) {
          await c.wait(800); setStep(r, i); pill(k("st"), "ac", lab[i]);
        }
        await c.wait(600); setStep(r, 6); pill(k("st"), "ok", ICON.check + " Dispatched");
        k("ip").textContent = "11"; k("dp").textContent = "22";
        k("ip").parentNode.classList.add("flash"); k("dp").parentNode.classList.add("flash");
        await c.wait(2400);
      }
    },

    purchase: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Purchase order <span class="mut">PO-2026-041</span></b><span class="pl">Lithium cells × 2,000</span></div>
        <div class="cardx pflow">
          ${[["PO raised", "Store", ICON.doc], ["Vendor confirmed", "Vendor", ICON.check], ["In transit", "Transport", ICON.truck], ["GRN done", "Store", ICON.box]]
            .map((n, i) => `<div class="pnode" data-k="p${i}"><div class="pic">${n[2]}</div><b>${n[0]}</b><span>${n[1]}</span></div>`)
            .join('<div class="plink"><i></i></div>')}
        </div>
        <div class="road"><div class="truck" data-k="truck">${ICON.truck}</div></div>
        <div class="cardx grn sx" data-k="grn"><div class="lc"><b>Goods receipt GRN-0912</b><span>2,000 received · 0 short · freight recorded</span></div><span class="pl ok">${ICON.check} Stock updated in IMS</span></div>
      </div>`,
      run: async (r, c) => {
        const k = K(r), links = qa(r, ".plink");
        await c.wait(400);
        for (let i = 0; i < 4; i++) {
          if (i > 0) { links[i - 1].classList.add("on"); await c.wait(500); }
          k("p" + i).classList.add("on");
          if (i === 2) { await c.wait(200); k("truck").classList.add("go"); await c.wait(1700); }
          else await c.wait(650);
        }
        on(k("grn"));
        await c.wait(2400);
      }
    },

    inventory: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Inventory</b><span class="pl ac sx" data-k="out">Material OUT · 10 packs</span></div>
        <div class="inv">
          <div class="cardx ibars">
            <b class="ct">Raw material</b>
            ${[["Cells", 2400, 3000], ["BMS", 48, 300], ["Casing", 180, 300], ["Wiring kit", 210, 300]]
              .map((m, i) => `<div class="ib" data-k="m${i}" data-v="${m[1]}" data-max="${m[2]}"><span>${m[0]}</span><div class="bar"><i style="width:${(m[1] / m[2]) * 100}%"></i></div><b>${fmtIN(m[1])}</b></div>`).join("")}
          </div>
          <div class="iside">
            <div class="cardx ibox" data-k="wipb"><span>Work in progress</span><b data-k="wip">0</b><em>packs</em></div>
            <div class="cardx ibox" data-k="fgb"><span>Finished goods</span><b data-k="fg">120</b><em>packs</em></div>
          </div>
        </div>
        <div class="toast" data-k="toast">${ICON.alert} BMS below reorder level · purchase request raised</div>
      </div>`,
      run: async (r, c) => {
        const k = K(r), use = [160, 10, 10, 10];
        await c.wait(500); on(k("out"));
        await c.wait(700);
        const jobs = use.map((u, i) => {
          const row = k("m" + i), v = +row.dataset.v, max = +row.dataset.max;
          row.querySelector("i").style.width = ((v - u) / max) * 100 + "%";
          return c.count(row.querySelector("b"), v, v - u, 900);
        });
        jobs.push(c.count(k("wip"), 0, 10, 900)); k("wipb").classList.add("flash");
        await Promise.all(jobs);
        await c.wait(900);
        k("fgb").classList.add("flash");
        await Promise.all([c.count(k("wip"), 10, 0, 800), c.count(k("fg"), 120, 130, 800)]);
        await c.wait(500); k("m1").classList.add("low"); on(k("toast"));
        await c.wait(2400);
      }
    },

    production: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Production line · Hall 1</b><span class="pl ac"><span class="pulse"></span>Live</span></div>
        <div class="scanrow">
          <div class="cardx scn" data-k="emp"><div class="pic">${ICON.user}</div><div class="lc"><span>Employee</span><b data-k="empv">Scan ID card…</b></div></div>
          <div class="cardx scn" data-k="bat"><div class="pic">${ICON.scan}</div><div class="lc"><span>Battery</span><b data-k="batv">Scan barcode…</b></div></div>
        </div>
        <div class="line">
          <div class="track"><i data-k="fill"></i></div>
          ${["Cell sorting", "Assembly", "BMS fitting", "Testing"].map((s, i) => `<div class="stn" data-k="s${i}"><div class="stn-d">${pad(i + 1)}</div><span>${s}</span></div>`).join("")}
          <div class="token" data-k="tok"><i></i></div>
        </div>
        <div class="log" data-k="log"></div>
      </div>`,
      run: async (r, c) => {
        const k = K(r), st = ["Cell sorting", "Assembly", "BMS fitting", "Testing"], tm = ["10:02", "10:18", "10:41", "11:05"];
        await c.wait(600); k("emp").classList.add("ok", "flash"); SFX.beep(); k("empv").textContent = "EMP-027 · Assembly team";
        await c.wait(900); k("bat").classList.add("ok", "flash"); SFX.beep(); k("batv").textContent = "LTX-48V-0000123";
        await c.wait(600); on(k("tok"));
        for (let i = 0; i < 4; i++) {
          k("tok").style.left = 12.5 + i * 25 + "%";
          k("fill").style.width = (i / 3) * 100 + "%";
          if (i > 0) { k("s" + (i - 1)).classList.remove("on"); k("s" + (i - 1)).classList.add("done"); }
          k("s" + i).classList.add("on");
          await c.wait(500);
          logRow(k("log"), `<span><b>${tm[i]}</b> · ${st[i]} · EMP-027</span><em class="pl ok">${ICON.check} Done</em>`, "", 3);
          await c.wait(650);
        }
        k("s3").classList.remove("on"); k("s3").classList.add("done");
        await c.wait(2200);
      }
    },

    quality: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Daily checklist · Line 1 · Shift A</b><span class="pl" data-k="prog">0 / 5 done</span></div>
        <div class="cardx chk-list">
          ${["Cell voltage check", "Torque check", "Insulation test", "Welding inspection", "Label & barcode check"]
            .map((t, i) => `<div class="ck" data-k="c${i}"><span class="box">${ICON.check}</span><b>${t}</b><em data-k="t${i}">Pending</em></div>`).join("")}
        </div>
        <div class="pbar"><i data-k="pb"></i></div>
        <div class="toast" data-k="toast">${ICON.check} Shift approved by Supervisor · 09:14</div>
      </div>`,
      run: async (r, c) => {
        const k = K(r), t = ["08:52", "08:57", "09:03", "09:08", "09:12"];
        await c.wait(500);
        for (let i = 0; i < 5; i++) {
          await c.wait(600);
          k("c" + i).classList.add("done"); k("t" + i).textContent = "✓ " + t[i];
          k("prog").textContent = `${i + 1} / 5 done`; k("pb").style.width = ((i + 1) / 5) * 100 + "%";
        }
        await c.wait(400); pill(k("prog"), "ok", ICON.check + " All checks done");
        await c.wait(500); on(k("toast"));
        await c.wait(2200);
      }
    },

    review: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Daily production review</b><span class="pl">Today</span></div>
        <div class="cardx dpr">
          ${[["Line 1", 60, 60], ["Line 2", 40, 32], ["Line 3", 50, 50]]
            .map((l, i) => `<div class="dl" data-k="l${i}"><span class="dn">${l[0]}</span><div class="dbar"><div class="plan" style="width:${(l[1] / 60) * 100}%"></div><i data-w="${(l[2] / 60) * 100}" data-n="${l[2]}"></i></div><b><em data-k="a${i}">0</em> / ${l[1]}</b></div>`).join("")}
          <div class="dleg"><span><i class="lg-p"></i>Plan</span><span><i class="lg-a"></i>Achieved</span></div>
        </div>
        <div class="dsum">
          <div class="cardx omini"><span>Total achieved</span><b><em data-k="tot">0</em> / 150</b></div>
          <div class="cardx omini"><span>Efficiency</span><b><em data-k="eff">0</em>%</b></div>
          <div class="cardx omini gap sx" data-k="gap"><span>Line 2 gap · 8 units</span><b class="small">Reason: material delay</b></div>
        </div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(600);
        const jobs = [0, 1, 2].map((i) => {
          const bar = k("l" + i).querySelector(".dbar i");
          bar.style.width = `calc(${bar.dataset.w}% - 6px)`;
          return c.count(k("a" + i), 0, +bar.dataset.n, 1000);
        });
        await Promise.all(jobs);
        await c.wait(500); k("l1").classList.add("gapd", "shake");
        await c.wait(400);
        await Promise.all([c.count(k("tot"), 0, 142, 900), c.count(k("eff"), 0, 95, 900)]);
        await c.wait(300); on(k("gap"));
        await c.wait(2400);
      }
    },

    recon: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Material vs production · Today</b><span class="pl">10 packs built</span></div>
        <div class="cardx rc">
          <div class="rr rh"><span>Material</span><span>Issued (IMS)</span><span>Required (BOM)</span><span>Status</span></div>
          ${[["Cells", 164, 160], ["BMS", 10, 10], ["Casing", 10, 10], ["Wiring kit", 10, 10]]
            .map((m, i) => `<div class="rr" data-k="r${i}" data-is="${m[1]}" data-rq="${m[2]}"><span>${m[0]}</span><span class="n" data-k="is${i}">–</span><span class="n" data-k="rq${i}">–</span><span><em class="pl" data-k="st${i}">…</em></span></div>`).join("")}
        </div>
        <div class="cardx rnote sx" data-k="note"><span class="pl warn">${ICON.alert} Cells: 4 extra issued</span><span class="arrow">→</span><span class="pl ok" >${ICON.check} 4 returned to store</span></div>
        <div class="toast" data-k="toast">${ICON.check} Reconciled · variance 0</div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(500);
        for (let i = 0; i < 4; i++) {
          const row = k("r" + i), is = +row.dataset.is, rq = +row.dataset.rq;
          await Promise.all([c.count(k("is" + i), 0, is, 500), c.count(k("rq" + i), 0, rq, 500)]);
          if (is === rq) pill(k("st" + i), "ok", ICON.check + " Matched");
          else { pill(k("st" + i), "warn", `+${is - rq} extra`); row.classList.add("shake"); }
          await c.wait(250);
        }
        await c.wait(600); on(k("note"));
        await c.wait(1300);
        await c.count(k("is0"), 164, 160, 600); pill(k("st0"), "ok", ICON.check + " Matched");
        await c.wait(400); on(k("toast"));
        await c.wait(2200);
      }
    },

    dispatch: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Dispatch scan</b><span class="pl" data-k="ord">ORD-2026-0187 · 48V 30Ah × 50</span></div>
        <div class="dsp">
          <div class="cardx scanner" data-k="scn"><div class="bc">${bars(30)}</div><div class="laser"></div><b data-k="code">Ready to scan</b></div>
          <div class="cardx dcount"><span>Scanned</span><b><em data-k="cnt">0</em><small> / 50</small></b><div class="pbar"><i data-k="pb"></i></div></div>
        </div>
        <div class="log" data-k="log"></div>
        <div class="toast" data-k="toast">${ICON.check} Order complete · dispatch log shared with Accounts</div>
      </div>`,
      run: async (r, c) => {
        const k = K(r), scn = k("scn");
        const ok = async (n) => {
          const code = "LTX-48V-00001" + String(n).padStart(2, "0");
          k("code").textContent = code;
          scn.classList.remove("bad"); scn.classList.add("ok"); SFX.beep();
          k("cnt").textContent = n; k("pb").style.width = (n / 50) * 100 + "%";
          logRow(k("log"), `<span>${ICON.check} <b>${code}</b> · 48V 30Ah</span><em>#${n}</em>`, "okr", 3);
          await c.wait(160); scn.classList.remove("ok");
        };
        await c.wait(600);
        for (let n = 1; n <= 3; n++) { await ok(n); await c.wait(550); }
        k("code").textContent = "LTX-60V-0000044"; scn.classList.add("bad"); SFX.buzz();
        logRow(k("log"), `<span>${ICON.x} <b>LTX-60V-0000044</b> · wrong model</span><em>Rejected</em>`, "bad", 3);
        await c.wait(1400); scn.classList.remove("bad");
        await c.count(k("cnt"), 3, 49, 1000, (v) => v);
        k("pb").style.width = "98%";
        await c.wait(300); await ok(50);
        pill(k("ord"), "ok", ICON.check + " ORD-2026-0187 · 50 / 50");
        await c.wait(400); on(k("toast"));
        await c.wait(2400);
      }
    },

    logistics: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Shipment <span class="mut">AWB 7731 0042</span></b><span class="pl">Zone C · 120 kg slab</span></div>
        <div class="cardx route">
          <div class="rline"><i data-k="fill"></i></div>
          ${["Picked up", "Hub · Delhi", "In transit", "Delivered"].map((s, i) => `<div class="rp" data-k="p${i}"><div class="rdot"></div><b>${s}</b><span data-k="t${i}">—</span></div>`).join("")}
          <div class="parcel" data-k="par">${ICON.box}</div>
        </div>
        <div class="trio">
          <div class="cardx omini"><span>From</span><b class="small">Litpax · Haryana</b></div>
          <div class="cardx omini"><span>To</span><b class="small">Partner warehouse</b></div>
          <div class="cardx omini"><span>Freight check</span><b class="small" data-k="fr">Pending</b></div>
        </div>
      </div>`,
      run: async (r, c) => {
        const k = K(r), t = ["Mon 10:30", "Mon 18:10", "Tue 09:00", "Wed 14:20"];
        await c.wait(500);
        for (let i = 0; i < 4; i++) {
          k("par").style.left = 12.5 + i * 25 + "%";
          k("fill").style.width = (i / 3) * 100 + "%";
          await c.wait(500);
          k("p" + i).classList.add("on"); k("t" + i).textContent = t[i];
          await c.wait(600);
        }
        k("fr").innerHTML = `<span class="pl ok">${ICON.check} Bill matches rate</span>`;
        await c.wait(2400);
      }
    },

    service: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Service hub</b><span class="pl ac"><span class="pulse"></span>Live</span></div>
        <div class="cardx call"><div class="pic ring" data-k="ph">${ICON.phone}</div><div class="lc"><b>Incoming service call</b><span>Sharma Auto Agency · battery not charging</span></div><span class="pl ac" data-k="cst">Ringing…</span></div>
        <div class="cardx tkt sx" data-k="tkt">
          <div class="otop"><div class="lc"><b>Ticket SR-2310</b><span>48V 30Ah · LTX-48V-0000123</span></div><span class="pl" data-k="tst">Open</span></div>
          ${stepper(["Received", "Diagnosed", "Technician assigned", "Solved"])}
          <div class="tech sx" data-k="tech"><div class="av">FT</div><div class="lc"><b>Field Technician</b><span>On site · Rohtak</span></div><span class="pl ok sx" data-k="res">${ICON.check} Resolved same day</span></div>
        </div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(1600); k("ph").classList.remove("ring"); pill(k("cst"), "ok", ICON.check + " Answered");
        await c.wait(500); on(k("tkt")); setStep(r, 0);
        await c.wait(900); setStep(r, 1); pill(k("tst"), "ac", "Diagnosed");
        await c.wait(900); setStep(r, 2); pill(k("tst"), "ac", "Technician assigned"); on(k("tech"));
        await c.wait(1200); setStep(r, 4); pill(k("tst"), "ok", ICON.check + " Solved"); on(k("res"));
        await c.wait(2400);
      }
    },

    warranty: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Battery exchange</b><span class="pl">Warranty</span></div>
        <div class="cardx tkt">
          <div class="otop"><div class="lc"><b>Exchange request EX-0458</b><span>LTX-48V-0000123 · Metro EV Motors</span></div><span class="pl" data-k="st">Requested</span></div>
          ${stepper(["Requested", "Warranty verified", "Approved", "Replacement sent", "Old unit received"])}
        </div>
        <div class="cardx audit"><b class="ct">Audit trail</b><div class="log" data-k="log"></div></div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        const ev = [
          ["Requested", "Request raised by partner", "09:40"],
          ["Warranty verified", "Warranty valid · production record found", "10:05"],
          ["Approved", "Approved by Service Head", "10:30"],
          ["Replacement sent", "Replacement LTX-48V-0000876 dispatched", "14:15"],
          ["Old unit received", "Old unit received at plant for analysis", "Next day"]
        ];
        await c.wait(400);
        for (let i = 0; i < 5; i++) {
          setStep(r, i + (i === 4 ? 1 : 0)); pill(k("st"), i === 4 ? "ok" : "ac", (i === 4 ? ICON.check + " " : "") + (i === 4 ? "Closed" : ev[i][0]));
          logRow(k("log"), `<span>${ICON.check} ${ev[i][1]}</span><em>${ev[i][2]}</em>`, "", 4);
          await c.wait(900);
        }
        await c.wait(2200);
      }
    },

    clientdash: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Metro EV Motors · Partner view</b><span class="pl ac"><span class="pulse"></span>Live</span></div>
        <div class="kpis">
          ${[["Orders in progress", 4, "k0"], ["Dispatched this month", 6, "k1"], ["Service calls solved", 18, "k2"], ["Repairs pending", 2, "k3"]]
            .map((x) => `<div class="cardx omini"><span>${x[0]}</span><b data-k="${x[2]}" data-v="${x[1]}">0</b></div>`).join("")}
        </div>
        <div class="cardx olist">
          ${[["ORD-2026-0187", "50 × 48V 30Ah", "In production", "ac"], ["ORD-2026-0179", "30 × 60V 40Ah", "Dispatched", "ok"], ["ORD-2026-0171", "20 × 48V 24Ah", "Dispatched", "ok"]]
            .map((o, i) => `<div class="orow"${i === 0 ? ' data-k="o0"' : ""}><b>${o[0]}</b><span>${o[1]}</span><em class="pl ${o[3]}"${i === 0 ? ' data-k="ost"' : ""}>${o[2]}</em></div>`).join("")}
        </div>
        <div class="upd" data-k="upd">Updated 2 min ago</div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(400);
        await Promise.all(["k0", "k1", "k2", "k3"].map((x) => c.count(k(x), 0, +k(x).dataset.v, 900)));
        await c.wait(1300);
        pill(k("ost"), "ok", ICON.check + " Dispatched"); k("o0").classList.add("flash");
        k("k0").textContent = "3"; k("k1").textContent = "7";
        k("upd").textContent = "Updated just now"; k("upd").classList.add("live");
        await c.wait(2600);
      }
    },

    feedback: {
      html: () => `<div class="sc">
        <div class="sc-h"><b>Customer review</b><span class="pl">Metro EV Motors</span></div>
        <div class="fb">
          <div class="cardx frows">
            ${[["Product", 5], ["Production", 4], ["Service", 5], ["Overall", 5]]
              .map((f, i) => `<div class="fr" data-k="f${i}" data-n="${f[1]}"><span>${f[0]}</span><div class="stars">${ICON.star.repeat(5)}</div></div>`).join("")}
            <div class="cmt"><span class="mut">Suggestion</span><p data-k="cmt"></p></div>
          </div>
          <div class="cardx favg"><span>Average rating</span><b data-k="avg">0.0</b><div class="stars big" data-k="big">${ICON.star.repeat(5)}</div><span class="pl ok sx" data-k="sent">${ICON.check} Shared with management</span></div>
        </div>
      </div>`,
      run: async (r, c) => {
        const k = K(r);
        await c.wait(400);
        for (let i = 0; i < 4; i++) {
          const row = k("f" + i), n = +row.dataset.n, st = qa(row, ".st-ic");
          for (let s = 0; s < n; s++) { await c.wait(110); st[s].classList.add("on"); }
          await c.wait(200);
        }
        await c.type(k("cmt"), "Fast service response and consistent build quality.", 28);
        await c.wait(300);
        await c.count(k("avg"), 0, 48, 900, (v) => (v / 10).toFixed(1));
        const big = qa(k("big"), ".st-ic");
        for (let s = 0; s < 5; s++) { await c.wait(90); big[s].classList.add("on"); }
        await c.wait(300); on(k("sent"));
        await c.wait(2400);
      }
    }
  };

  /* ---------- hero animations (non-step slides) ---------- */
  const HEROES = {
    stats: async (el, c) => {
      await c.wait(400);
      qa(el, "[data-count]").forEach((b) => {
        const suf = b.dataset.suffix || "";
        c.count(b, 0, +b.dataset.count, 1200, (v) => v + suf);
      });
    },
    chain: async (el, c) => {
      const nodes = qa(el, ".chain-node"), cols = qa(el, ".chain-col"), links = qa(el, ".chain-link");
      await c.wait(900);
      while (c.alive) {
        nodes.forEach((n) => n.classList.remove("lit"));
        cols.forEach((n) => n.classList.remove("lit"));
        links.forEach((n) => n.classList.remove("lit"));
        for (const n of nodes) {
          const col = n.closest(".chain-col"), ci = cols.indexOf(col);
          if (!col.classList.contains("lit")) {
            if (ci > 0) { links[ci - 1].classList.add("lit"); await c.wait(250); }
            col.classList.add("lit");
          }
          n.classList.add("lit");
          await c.wait(320);
        }
        el.querySelector(".chain-fms").classList.add("lit");
        await c.wait(2600);
        el.querySelector(".chain-fms").classList.remove("lit");
      }
    },
    trace: async (el, c) => {
      const steps = qa(el, ".life-step"), fill = el.querySelector(".life-fill");
      await c.wait(1400);
      while (c.alive) {
        steps.forEach((s) => s.classList.remove("lit")); fill.style.width = "0";
        await c.wait(500);
        for (let i = 0; i < steps.length; i++) {
          fill.style.width = (i / (steps.length - 1)) * 84 + "%";
          await c.wait(350);
          steps[i].classList.add("lit");
          await c.wait(500);
        }
        await c.wait(2600);
      }
    },
    ambition: async (el, c) => {
      const k = K(el), words = qa(el, ".amb-sub .w"), trio = qa(el, ".amb-trio span");
      words.forEach((w) => w.classList.remove("in")); trio.forEach((t) => t.classList.remove("in"));
      k("quote").textContent = ""; k("pct").textContent = "100";
      await c.wait(900);
      await c.count(k("pct"), 100, 0, 1800, (v) => v);
      k("pct").parentNode.classList.add("hit");
      for (const w of words) { await c.wait(110); w.classList.add("in"); }
      await c.wait(400);
      await c.type(k("quote"), AMB.quote || "", 45);
      for (const t of trio) { await c.wait(450); t.classList.add("in"); }
    },
    miles: async (el, c) => {
      const ms = qa(el, ".mile"), fill = el.querySelector(".miles-line i");
      ms.forEach((m) => m.classList.remove("lit")); fill.style.width = "0";
      await c.wait(700);
      for (let i = 0; i < ms.length; i++) {
        fill.style.width = ((i + 0.5) / ms.length) * 100 + "%";
        await c.wait(400); ms[i].classList.add("lit"); await c.wait(350);
      }
      fill.style.width = "100%";
    },
    promise: async (el, c) => {
      const k = K(el), words = qa(el, ".rot em"), stops = qa(el, ".pstop"), n = stops.length;
      el.querySelector(".strike").classList.remove("cut");
      await c.wait(1100);
      el.querySelector(".strike").classList.add("cut");
      let wi = 0;
      (async () => {
        while (c.alive) {
          await c.wait(1700);
          words[wi].classList.remove("on"); words[wi].classList.add("out");
          const prev = words[wi];
          wi = (wi + 1) % words.length;
          words[wi].classList.remove("out"); words[wi].classList.add("on");
          await c.wait(500); prev.classList.remove("out");
        }
      })();
      while (c.alive) {
        stops.forEach((s) => s.classList.remove("on", "done"));
        k("tk").style.left = 100 / (2 * n) + "%"; k("pfill").style.width = "0";
        await c.wait(600);
        for (let i = 0; i < n; i++) {
          k("tk").style.left = (100 / n) * i + 100 / (2 * n) + "%";
          k("pfill").style.width = (i / (n - 1)) * 100 + "%";
          k("tks").textContent = stops[i].querySelector("b").textContent;
          if (i > 0) { stops[i - 1].classList.remove("on"); stops[i - 1].classList.add("done"); }
          stops[i].classList.add("on");
          await c.wait(1200);
        }
        stops[n - 1].classList.remove("on"); stops[n - 1].classList.add("done");
        k("tks").textContent = "Closed ✓";
        await c.wait(2200);
      }
    },
    end: async (el, c) => {
      const t = qa(el, ".end-tag span");
      t.forEach((x) => x.classList.remove("on"));
      await c.wait(1100);
      for (const x of t) { x.classList.add("on"); await c.wait(500); }
    },
    fms: async (el, c) => {
      const table = el.querySelector(".fms-table"), tpl = table.innerHTML, flows = qa(el, ".fms-flow");
      await c.wait(800);
      while (c.alive) {
        table.innerHTML = tpl;
        const k = K(table), stOf = (r) => k(r).querySelector(".st");
        const set = (r, cls, txt) => { const s = stOf(r); s.className = "st " + cls; s.textContent = txt; k(r).classList.add("flash"); setTimeout(() => k(r) && k(r).classList.remove("flash"), 700); };
        flows.forEach((f) => f.classList.remove("lit"));
        for (const f of flows) { f.classList.add("lit"); await c.wait(220); }
        await c.wait(800); set("r3", "st-done", "Done"); set("r4", "st-pend", "In progress");
        await c.wait(1300); k("r5").classList.add("in"); stOf("r5").classList.add("blink");
        await c.wait(700); k("al").classList.add("in");
        await c.wait(1500); set("r4", "st-done", "Done"); set("r5", "st-warn", "Escalated");
        await c.wait(1300); set("r5", "st-done", "Done"); k("al").classList.remove("in");
        await c.wait(2500);
      }
    }
  };

  /* =========================================================
     SOUND ENGINE — every sound is synthesised in code (Web Audio),
     so there are no music files and no copyright issues.
     ========================================================= */
  const SFX = (function () {
    let ac = null, master = null, noiseBuf = null, pad = null, rotor = null;
    let muted = false;
    const api = {};
    api.init = () => {
      if (ac) { if (ac.state === "suspended") ac.resume(); return; }
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      master = ac.createGain(); master.gain.value = muted ? 0 : 0.9; master.connect(ac.destination);
      noiseBuf = ac.createBuffer(1, ac.sampleRate * 2, ac.sampleRate);
      const d = noiseBuf.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    };
    api.ready = () => !!ac;
    api.setMuted = (m) => { muted = m; if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ac.currentTime, 0.05); };
    api.isMuted = () => muted;
    const now = () => ac.currentTime;
    const gainEnv = (t, a, d, peak, dest) => {
      const g = ac.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + a);
      g.gain.exponentialRampToValueAtTime(0.0001, t + a + d);
      g.connect(dest || master);
      return g;
    };
    const noise = () => { const n = ac.createBufferSource(); n.buffer = noiseBuf; n.loop = true; return n; };

    api.heartbeat = () => {
      if (!ac) return;
      [0, 0.26].forEach((o, i) => {
        const t = now() + o, osc = ac.createOscillator();
        osc.type = "sine"; osc.frequency.setValueAtTime(i ? 58 : 66, t); osc.frequency.exponentialRampToValueAtTime(34, t + 0.22);
        osc.connect(gainEnv(t, 0.012, 0.3, i ? 0.55 : 0.8)); osc.start(t); osc.stop(t + 0.4);
      });
    };
    api.whoosh = (dur, big) => {
      if (!ac) return;
      dur = dur || 1; const t = now(), n = noise(), f = ac.createBiquadFilter();
      f.type = "bandpass"; f.Q.value = big ? 0.8 : 1.4;
      f.frequency.setValueAtTime(big ? 180 : 400, t);
      f.frequency.exponentialRampToValueAtTime(big ? 2600 : 2200, t + dur * 0.6);
      f.frequency.exponentialRampToValueAtTime(big ? 220 : 500, t + dur);
      n.connect(f); f.connect(gainEnv(t, dur * 0.5, dur * 0.5, big ? 0.55 : 0.18));
      n.start(t); n.stop(t + dur + 0.1);
    };
    api.boom = () => {
      if (!ac) return;
      const t = now(), osc = ac.createOscillator();
      osc.type = "sine"; osc.frequency.setValueAtTime(110, t); osc.frequency.exponentialRampToValueAtTime(28, t + 1.6);
      osc.connect(gainEnv(t, 0.01, 2.2, 1.0)); osc.start(t); osc.stop(t + 2.4);
      const n = noise(), f = ac.createBiquadFilter(); f.type = "lowpass"; f.frequency.setValueAtTime(1800, t); f.frequency.exponentialRampToValueAtTime(120, t + 0.8);
      n.connect(f); f.connect(gainEnv(t, 0.005, 0.9, 0.7)); n.start(t); n.stop(t + 1);
    };
    api.rotorStart = () => {
      if (!ac || rotor) return;
      const t = now(), out = ac.createGain(); out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.16, t + 0.8); out.connect(master);
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 700; lp.connect(out);
      const trem = ac.createGain(); trem.gain.value = 0.6; trem.connect(lp);
      const lfo = ac.createOscillator(), lfoG = ac.createGain(); lfo.frequency.value = 38; lfoG.gain.value = 0.4; lfo.connect(lfoG); lfoG.connect(trem.gain);
      const o1 = ac.createOscillator(), o2 = ac.createOscillator();
      o1.type = "sawtooth"; o2.type = "sawtooth"; o1.frequency.value = 96; o2.frequency.value = 99;
      o1.connect(trem); o2.connect(trem); [o1, o2, lfo].forEach((o) => o.start(t));
      rotor = { out, o1, o2, lfo, lp };
    };
    api.rotorRise = (sec) => {
      if (!rotor) return;
      const t = now();
      rotor.o1.frequency.exponentialRampToValueAtTime(190, t + sec); rotor.o2.frequency.exponentialRampToValueAtTime(196, t + sec);
      rotor.lfo.frequency.exponentialRampToValueAtTime(70, t + sec); rotor.lp.frequency.exponentialRampToValueAtTime(1600, t + sec);
      rotor.out.gain.exponentialRampToValueAtTime(0.28, t + sec);
    };
    api.rotorStop = () => {
      if (!rotor) return;
      const r = rotor, t = now(); rotor = null;
      r.out.gain.cancelScheduledValues(t); r.out.gain.setTargetAtTime(0.0001, t, 0.05);
      [r.o1, r.o2, r.lfo].forEach((o) => o.stop(t + 0.4));
    };
    api.charge = () => {
      if (!ac) return;
      const t = now(), o = ac.createOscillator(); o.type = "triangle";
      o.frequency.setValueAtTime(180, t); o.frequency.exponentialRampToValueAtTime(720, t + 1.1);
      o.connect(gainEnv(t, 0.2, 1.1, 0.12)); o.start(t); o.stop(t + 1.4);
    };
    api.shimmer = () => {
      if (!ac) return;
      [1320, 1760, 2217, 2637, 3520].forEach((fq, i) => {
        const t = now() + i * 0.07, o = ac.createOscillator(); o.type = "sine"; o.frequency.value = fq;
        o.connect(gainEnv(t, 0.01, 0.9, 0.06)); o.start(t); o.stop(t + 1);
      });
    };
    api.beep = () => {
      if (!ac) return;
      const t = now(), o = ac.createOscillator(); o.type = "square"; o.frequency.value = 1850;
      o.connect(gainEnv(t, 0.004, 0.07, 0.05)); o.start(t); o.stop(t + 0.1);
    };
    api.buzz = () => {
      if (!ac) return;
      const t = now(), o = ac.createOscillator(); o.type = "sawtooth"; o.frequency.value = 140;
      o.connect(gainEnv(t, 0.005, 0.28, 0.08)); o.start(t); o.stop(t + 0.32);
    };
    api.ding = () => {
      if (!ac) return;
      [1318.5, 1975.5].forEach((fq, i) => {
        const t = now() + i * 0.09, o = ac.createOscillator(); o.type = "sine"; o.frequency.value = fq;
        o.connect(gainEnv(t, 0.005, 0.7, 0.08)); o.start(t); o.stop(t + 0.8);
      });
    };
    api.tick = () => api.whoosh(0.45, false);
    // ambient background pad (A minor 9), very quiet, slowly breathing
    api.padStart = (level) => {
      if (!ac || pad) return;
      const t = now(), out = ac.createGain(); out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(level || 0.05, t + 4); out.connect(master);
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 900; lp.connect(out);
      const lfo = ac.createOscillator(), lg = ac.createGain(); lfo.frequency.value = 0.07; lg.gain.value = 350; lfo.connect(lg); lg.connect(lp.frequency); lfo.start(t);
      const oscs = [110, 164.81, 220, 261.63, 329.63, 493.88].map((fq, i) => {
        const o = ac.createOscillator(); o.type = i % 2 ? "triangle" : "sine"; o.frequency.value = fq; o.detune.value = (i - 3) * 4;
        const g = ac.createGain(); g.gain.value = i < 2 ? 0.5 : 0.25; o.connect(g); g.connect(lp); o.start(t); return o;
      });
      pad = { out, oscs, lfo };
    };
    return api;
  })();

  /* =========================================================
     NARRATION — plays assets/voice/<key>.mp3 when present,
     otherwise the most natural deep male voice the browser has.
     ========================================================= */
  const VO = Object.assign({ enabled: true, autoAdvance: false, rate: 0.9, pitch: 0.72, folder: "assets/voice/", lines: {}, intro: [] }, C.voice || {});
  const Voice = (function () {
    const synth = window.speechSynthesis;
    let voice = null, audio = null, token = 0;
    const prefer = [
      /Prabhat/i, /Microsoft (Guy|Andrew|Brian|Christopher|Davis|Eric|Roger|Steffan|Ryan|Thomas).*Natural/i,
      /Google UK English Male/i, /Daniel/i, /Microsoft (Ravi|David|Mark|George)/i, /en-IN/i, /en-GB/i, /^en/i
    ];
    function pick() {
      if (!synth) return;
      const vs = synth.getVoices();
      if (!vs.length) return;
      for (const re of prefer) {
        const v = vs.find((x) => re.test(x.name) || re.test(x.lang));
        if (v && !/female|Neerja|Heera|Zira|Aria|Jenny|Susan|Hazel|Samantha|Karen|Moira|Tessa|Veena/i.test(v.name)) { voice = v; return; }
      }
      voice = vs.find((x) => /^en/i.test(x.lang)) || vs[0];
    }
    if (synth) { pick(); synth.onvoiceschanged = pick; }
    const api = {};
    api.stop = () => {
      token++;
      if (audio) { audio.onended = audio.onerror = null; audio.pause(); audio = null; }
      if (synth) synth.cancel();
    };
    api.say = (key, text, opts) => {
      opts = opts || {};
      api.stop();
      if (!VO.enabled || SFX.isMuted() || !text) { if (opts.onend) opts.onend(false); return; }
      const my = ++token;
      const done = () => { if (my === token && opts.onend) opts.onend(true); };
      const tts = () => {
        if (my !== token || !synth) return done();
        const u = new SpeechSynthesisUtterance(text);
        if (voice) u.voice = voice;
        u.lang = (voice && voice.lang) || "en-IN";
        u.rate = opts.rate || VO.rate; u.pitch = opts.pitch || VO.pitch; u.volume = 1;
        u.onend = done; u.onerror = done;
        synth.speak(u);
      };
      if (!key) return tts();
      const a = new Audio(VO.folder + key + ".mp3");
      audio = a;
      a.onended = done;
      a.onerror = () => { if (audio === a) audio = null; tts(); };
      a.play().catch(() => { if (audio === a) { audio = null; tts(); } });
    };
    return api;
  })();

  let autoAdvance = !!VO.autoAdvance;
  function narrate(el, c) {
    const key = el.dataset.vkey, text = VO.lines[key];
    if (!text) { Voice.stop(); return; }
    const idx = +el.dataset.i;
    c.wait(700).then(() => Voice.say(key, text, {
      onend: (spoke) => {
        if (!autoAdvance || !spoke) return;
        c.wait(1400).then(() => { if (cur === idx && cur < els.length - 1) go(cur + 1); });
      }
    }));
  }

  /* ---------- sound / auto-advance controls in the HUD ---------- */
  const hud = document.querySelector(".hud");
  const sndBtn = document.createElement("button");
  const autoBtn = document.createElement("button");
  const ICO_ON = '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zM16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11"/></svg>';
  const ICO_OFF = '<svg viewBox="0 0 24 24"><path d="M4 9h4l5-4v14l-5-4H4zM17 9l5 6M22 9l-5 6"/></svg>';
  const ICO_AUTO = '<svg viewBox="0 0 24 24"><path d="M5 4l10 8-10 8zM17 5v14"/></svg>';
  function paintHud() {
    sndBtn.innerHTML = SFX.isMuted() ? ICO_OFF : ICO_ON;
    sndBtn.title = SFX.isMuted() ? "Sound off (M)" : "Sound on (M)";
    autoBtn.innerHTML = ICO_AUTO;
    autoBtn.title = autoAdvance ? "Auto-play with voice: ON (A)" : "Auto-play with voice: OFF (A)";
    autoBtn.classList.toggle("on", autoAdvance);
  }
  function toggleSound() {
    SFX.init();
    SFX.setMuted(!SFX.isMuted());
    if (SFX.isMuted()) Voice.stop();
    else if (els[cur]) narrate(els[cur], activeCtx || makeCtx());
    paintHud();
  }
  function toggleAuto() { autoAdvance = !autoAdvance; paintHud(); }
  sndBtn.onclick = toggleSound; autoBtn.onclick = toggleAuto;
  if (hud) { const full = document.getElementById("btnFull"); hud.insertBefore(autoBtn, full); hud.insertBefore(sndBtn, full); }
  paintHud();

  /* ---------- slide lifecycle ---------- */
  let activeCtx = null;

  function setView(right, v) {
    qa(right, ".view").forEach((x) => x.classList.toggle("on", x.classList.contains("view-" + v)));
    qa(right, ".vtabs button").forEach((b) => b.classList.toggle("on", b.dataset.view === v));
    right.classList.toggle("show-shot", v === "shot");
  }
  // Screenshot added → show it directly. Not added → play the animated demo.
  async function runScene(host, c) {
    const sc = SCENES[host.dataset.scene];
    const right = host.closest(".step-right");
    for (let t = 0; !right.dataset.shot && t < 3000; t += 100) await c.wait(100);
    if (right.dataset.shot === "1") { setView(right, "shot"); return; }
    setView(right, "demo");
    if (!sc) return;
    while (c.alive) {
      host.innerHTML = sc.html();
      await c.wait(60);
      await sc.run(host, c);
      await c.wait(600);
    }
  }

  function startSlide(el) {
    if (activeCtx) activeCtx.stop();
    const c = makeCtx();
    activeCtx = c;
    qa(stage, "video").forEach((v) => {
      if (el.contains(v)) { try { v.currentTime = 0; } catch (e) {} v.play().catch(() => {}); }
      else v.pause();
    });
    const host = el.querySelector(".scene-host");
    if (host) runScene(host, c);
    if (el.dataset.hero && HEROES[el.dataset.hero]) HEROES[el.dataset.hero](el, c);
    SFX.tick();
    narrate(el, c);
  }

  // Pre-fill every scene once (so print / PDF shows the demo UI)
  qa(stage, ".scene-host").forEach((h) => { const sc = SCENES[h.dataset.scene]; if (sc) h.innerHTML = sc.html(); });

  // Tab clicks: user takes manual control of that slide
  stage.addEventListener("click", (e) => {
    const t = e.target.closest("[data-view]");
    if (!t) return;
    const right = t.closest(".step-right");
    right.dataset.manual = "1";
    setView(right, t.dataset.view);
  });

  /* ---------- navigation ---------- */
  let cur = 0;
  const counter = document.getElementById("counter");
  const bar = document.querySelector("#progress span");

  function go(n) {
    n = Math.max(0, Math.min(els.length - 1, n));
    if (n !== cur || !activeCtx) startSlide(els[n]);
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
    if (intro.waiting) { e.preventDefault(); return intro.start(); }
    if (intro.running) { e.preventDefault(); return intro.skip(); }
    if (k === "i" || k === "I") return intro.play();
    if (k === "m" || k === "M") return toggleSound();
    if (k === "a" || k === "A") return toggleAuto();
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
    if (tx == null || intro.running || intro.waiting) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(cur + (dx < 0 ? 1 : -1));
    tx = ty = null;
  });

  window.addEventListener("resize", fit);
  fit();
  /* =========================================================
     CINEMATIC INTRO
     Black screen → eyes open (blink) → battery comes into focus →
     logo light-sweep → taglines → zoom into the title slide.
     Any key / click skips. Press "I" to replay.
     ========================================================= */
  const intro = (function () {
    const box = document.getElementById("intro");
    const api = { running: false, waiting: false, play, skip, begin };
    if (!box || !INTRO.enabled) return api;
    let timers = [];
    // Illustrated human eye (SVG): almond lids with lashes, fibred iris, pupil, highlights
    function eyeSVG() {
      const P0 = [40, 150], P2 = [560, 150];
      const bez = (c, t) => [
        (1 - t) * (1 - t) * P0[0] + 2 * (1 - t) * t * c[0] + t * t * P2[0],
        (1 - t) * (1 - t) * P0[1] + 2 * (1 - t) * t * c[1] + t * t * P2[1]
      ];
      const tan = (c, t) => [2 * (1 - t) * (c[0] - P0[0]) + 2 * t * (P2[0] - c[0]), 2 * (1 - t) * (c[1] - P0[1]) + 2 * t * (P2[1] - c[1])];
      // lashes along a lid curve; dir = -1 points up (open upper lid), +1 points down (closed lid)
      const lashes = (c, dir, n, len) => {
        let d = "";
        for (let i = 0; i < n; i++) {
          const t = 0.12 + (0.76 * i) / (n - 1);
          const [x, y] = bez(c, t), [tx, ty] = tan(c, t), m = Math.hypot(tx, ty);
          let nx = (ty / m) * -dir, ny = (-tx / m) * -dir;
          if (ny * dir < 0) { nx = -nx; ny = -ny; }
          const spread = (t - 0.5) * 1.1;                   // outer lashes fan outward
          const L = len * (0.65 + 0.35 * Math.sin(Math.PI * t));
          const ex = x + (nx + spread) * L, ey = y + ny * L;
          const cx = x + nx * L * 0.55, cy = y + ny * L * 0.55;
          d += `M${x.toFixed(1)},${y.toFixed(1)} Q${(cx + spread * 6).toFixed(1)},${cy.toFixed(1)} ${ex.toFixed(1)},${ey.toFixed(1)} `;
        }
        return d;
      };
      const UP = [300, -14], LOW = [300, 300], SHUT = [300, 214];
      const almond = `M40,150 Q300,-14 560,150 Q300,300 40,150 Z`;
      let fibres = "";
      for (let a = 0; a < 360; a += 5) {
        const r = (a * Math.PI) / 180, r1 = 32 + (a % 3) * 2, r2 = 70 - (a % 4) * 3;
        fibres += `M${(300 + Math.cos(r) * r1).toFixed(1)},${(150 + Math.sin(r) * r1).toFixed(1)} L${(300 + Math.cos(r) * r2).toFixed(1)},${(150 + Math.sin(r) * r2).toFixed(1)} `;
      }
      const logoW = C.company.logoWhite ? `<image class="eye-logo" href="${esc(C.company.logoWhite)}" x="284" y="145" width="32" height="9.3"/>` : "";
      return `
        <svg viewBox="0 -60 600 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <clipPath id="eyeClip"><path d="${almond}"/></clipPath>
            <radialGradient id="scl" cx="50%" cy="55%" r="60%"><stop offset="0" stop-color="#ffffff"/><stop offset=".55" stop-color="#eceaf9"/><stop offset="1" stop-color="#9e99c9"/></radialGradient>
            <radialGradient id="iri" cx="50%" cy="50%" r="50%">
              <stop offset="0" style="stop-color:var(--night-0)"/><stop offset=".38" style="stop-color:var(--accent-deep)"/>
              <stop offset=".5" style="stop-color:var(--iris-warm)"/><stop offset=".58" style="stop-color:var(--accent-hi)"/>
              <stop offset=".82" style="stop-color:var(--accent)"/><stop offset="1" style="stop-color:var(--indigo)"/>
            </radialGradient>
            <linearGradient id="lidShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--indigo);stop-opacity:.55"/><stop offset=".45" style="stop-color:var(--indigo);stop-opacity:0"/></linearGradient>
            <filter id="glow" x="-20%" y="-50%" width="140%" height="200%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>
          <g class="eye-closed" filter="url(#glow)">
            <path d="M40,150 Q300,214 560,150" fill="none" style="stroke:var(--eye-line)" stroke-width="5" stroke-linecap="round"/>
            <path d="${lashes(SHUT, 1, 15, 30)}" fill="none" style="stroke:var(--eye-line)" stroke-width="3.2" stroke-linecap="round"/>
          </g>
          <g class="eye-open">
            <g clip-path="url(#eyeClip)">
              <path d="${almond}" fill="url(#scl)"/>
              <g class="eye-iris">
                <circle cx="300" cy="150" r="76" fill="url(#iri)"/>
                <path d="${fibres}" stroke="#ffffff" stroke-opacity=".16" stroke-width="1.3"/>
                <circle cx="300" cy="150" r="76" fill="none" style="stroke:var(--night-1)" stroke-width="7"/>
                <g class="eye-pupil">
                  <circle cx="300" cy="150" r="27" fill="#030208"/>
                  ${logoW}
                </g>
                <ellipse cx="276" cy="124" rx="13" ry="9" fill="#fff" opacity=".92"/>
                <circle cx="322" cy="174" r="4" fill="#fff" opacity=".6"/>
              </g>
              <path d="${almond}" fill="url(#lidShade)"/>
            </g>
            <g filter="url(#glow)">
              <path d="M40,150 Q300,-14 560,150" fill="none" style="stroke:var(--eye-line)" stroke-width="6" stroke-linecap="round"/>
              <path d="M40,150 Q300,300 560,150" fill="none" style="stroke:var(--eye-line)" stroke-opacity=".55" stroke-width="2.5"/>
              <path d="M70,118 Q300,-58 530,118" fill="none" style="stroke:var(--eye-line)" stroke-opacity=".25" stroke-width="2" class="eye-crease"/>
              <path d="${lashes(UP, -1, 17, 40)}" fill="none" style="stroke:var(--eye-line)" stroke-width="3.4" stroke-linecap="round"/>
            </g>
          </g>
        </svg>`;
    }

    // Aerial "drone" corridor: rows of batteries on both sides, the real Litpax battery at the end
    // Plain, unbranded batteries for the rows (only the hero at the end is a real Litpax pack)
    function genericBattery(v) {
      const P = [
        ["#2b2f36", "#1b1e23", "#3b4048", "#454b55"],   // graphite
        ["#4b5563", "#343b46", "#6b7280", "#8b93a1"],   // steel
        ["#d6dae0", "#aeb4be", "#eceff3", "#c2c8d0"],   // white
        ["#334155", "#1e293b", "#4a5a70", "#5d6c82"]    // blue-grey
      ][v % 4];
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 260">
        <path d="M30 62 L150 42 L186 57 L66 80 Z" fill="${P[2]}"/>
        <path d="M30 62 L66 80 L66 252 L30 232 Z" fill="${P[1]}"/>
        <path d="M66 80 L186 57 L186 230 L66 252 Z" fill="${P[0]}"/>
        <path d="M82 122 L170 106 L170 146 L82 162 Z" fill="${P[3]}" opacity=".55"/>
        <path d="M82 178 L170 162 L170 168 L82 184 Z" fill="${P[3]}" opacity=".35"/>
        <path d="M88 64 Q100 50 124 47" fill="none" stroke="#111" stroke-width="5" stroke-linecap="round"/>
        <ellipse cx="140" cy="52" rx="7" ry="3.4" fill="#c0392b"/><rect x="133" y="44" width="14" height="8" fill="#c0392b"/><ellipse cx="140" cy="44" rx="7" ry="3.4" fill="#e74c3c"/>
        <ellipse cx="164" cy="48" rx="7" ry="3.4" fill="#111"/><rect x="157" y="40" width="14" height="8" fill="#111"/><ellipse cx="164" cy="40" rx="7" ry="3.4" fill="#333"/>
      </svg>`;
      return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }

    function droneScene() {
      const src = esc(INTRO.battery || C.company.product || "");
      if (!src) return "";
      const gen = [0, 1, 2, 3].map(genericBattery);
      let rows = "", n = 0;
      const xs = [-250, 250, -470, 470, -690, 690];
      for (let z = 300; z <= 5700; z += 360) {
        xs.forEach((x, k) => {
          const jitter = ((z / 360 + k) % 3) * 14 - 14;
          rows += `<img class="dr-b${Math.abs(x) > 300 ? " far" : ""}" src="${gen[(n++ * 7 + k) % 4]}" alt="" style="--x:${x + jitter}px;--z:-${z + (k % 2) * 120}px;--r:${(k % 2 ? -1 : 1) * (6 + (z / 360) % 8)}deg">`;
        });
      }
      return `
        <div class="dr-scene">
          <div class="dr-sky"><i></i><i></i><i></i><i></i><i></i></div>
          <div class="dr-world">
            <div class="dr-floor"></div>
            <div class="dr-lane l"></div><div class="dr-lane r"></div>
            <div class="dr-runway"></div>
            ${rows}
            <div class="dr-hero" style="--z:-6600px"><img src="${src}" alt=""><span class="dr-hero-glow"></span></div>
          </div>
          <div class="dr-fog"></div>
          <div class="dr-speed"></div>
          <div class="dr-hud">
            <i class="c tl"></i><i class="c tr"></i><i class="c bl"></i><i class="c br"></i>
            <span class="rec"><b></b>REC</span>
            <span class="alt">ALT <em data-k="alt">120</em> m</span>
            <span class="spd">SPD <em data-k="spd">0</em> km/h</span>
            <span class="cross"></span>
            <span class="tag">LITPAX · AERIAL</span>
          </div>
          <div class="dr-flash"></div>
          <div class="dr-ring"></div>
        </div>`;
    }

    function build() {
      const lines = (INTRO.lines || []).map((l, i) => `<span class="il" style="--i:${i}">${esc(l)}</span>`).join("");
      const closing = (INTRO.closing || "").split(".").filter((x) => x.trim())
        .map((x, i) => `<span style="--i:${i}">${esc(x.trim())}.</span>`).join("");
      box.innerHTML = `
        <div class="in-scene">
          <div class="in-bg"></div>
          <div class="in-rays"></div>
          <div class="in-batt">
            ${INTRO.battery ? `<img src="${esc(INTRO.battery)}" alt="" onerror="this.remove()">` : ""}
            <div class="in-charge"><span>${esc(INTRO.chargeLabel || "Charging")}</span><div class="in-bar"><i></i></div></div>
          </div>
          <div class="in-brand">
            <div class="in-logo">${C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="${esc(C.company.name)}" onerror="this.parentNode.classList.add('txt')">` : ""}<b>${esc(C.company.shortName)}</b></div>
            <div class="in-lines">${lines}</div>
            <div class="in-closing">${closing}</div>
          </div>
        </div>
        ${droneScene()}
        <div class="in-pulse"></div>
        <div class="in-eye">${eyeSVG()}</div>
        <div class="in-skip">Press any key to skip</div>`;
    }

    // "Click to begin" — browsers only allow sound after a click, and it also enters full screen
    function begin() {
      api.waiting = true;
      box.hidden = false;
      box.className = "begin";
      box.innerHTML = `
        <div class="bg-wrap">
          ${C.company.logoWhite ? `<img class="bg-logo" src="${esc(C.company.logoWhite)}" alt="${esc(C.company.name)}">` : `<b class="bg-logo-t">${esc(C.company.shortName)}</b>`}
          <button class="bg-play" aria-label="Begin"><svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z"/></svg></button>
          <span class="bg-t">Begin</span>
          <span class="bg-h">Best experienced in full screen, with sound on</span>
        </div>`;
    }
    function start() {
      api.waiting = false;
      SFX.init();
      try { if (!document.fullscreenElement && document.documentElement.requestFullscreen) document.documentElement.requestFullscreen().catch(() => {}); } catch (e) {}
      play();
    }

    const at = (ms, fn) => timers.push(setTimeout(fn, ms));
    const addC = (cls) => box.classList.add(cls);
    const line = (n) => { const t = (VO.intro || [])[n]; if (t) Voice.say("intro-" + (n + 1), t, { rate: 0.82, pitch: 0.62 }); };

    function hudRun(fromAlt, toAlt, fromSpd, toSpd, ms) {
      const a = box.querySelector('[data-k="alt"]'), sp = box.querySelector('[data-k="spd"]');
      if (!a) return;
      const t0 = performance.now();
      const tick = (t) => {
        if (!api.running) return;
        const p = Math.min(1, (t - t0) / ms);
        a.textContent = Math.round(fromAlt + (toAlt - fromAlt) * p);
        sp.textContent = Math.round(fromSpd + (toSpd - fromSpd) * p);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }

    function play() {
      if (api.running) return;
      api.running = true;
      revealed = false;
      SFX.init();
      if (activeCtx) { activeCtx.stop(); activeCtx = null; }
      Voice.stop();
      els.forEach((el) => el.classList.remove("active"));
      timers.forEach(clearTimeout); timers = [];
      build();
      box.hidden = false;
      box.className = "";
      box.style.setProperty("--cover", Math.max(window.innerWidth / 1280, window.innerHeight / 720));
      void box.offsetWidth;
      const T = [
        [100,   () => { addC("p-pulse"); SFX.heartbeat(); }],
        [500,   () => line(0)],                                   // "Every great product begins… with how you see it."
        [1250,  () => SFX.heartbeat()],
        [2400,  () => { addC("e-closed"); SFX.heartbeat(); }],
        [3700,  () => addC("e-peek")],
        [4150,  () => addC("e-blink")],
        [4450,  () => { addC("e-open"); SFX.whoosh(0.8); }],
        [4700,  () => line(1)],                                   // "At Litpax… we see every battery."
        [5100,  () => addC("e-left")],
        [5650,  () => addC("e-right")],
        [6200,  () => addC("e-center")],
        [6500,  () => { addC("e-dilate"); SFX.shimmer(); }],
        [7400,  () => { addC("p-dive"); SFX.whoosh(1.6, true); }], // dive through the pupil
        [8000,  () => { addC("d-aerial"); SFX.rotorStart(); hudRun(120, 96, 0, 24, 1600); }],
        [9700,  () => { addC("d-descend"); SFX.rotorRise(1.2); hudRun(96, 3, 24, 42, 1100); }],
        [10800, () => { addC("d-fly"); SFX.rotorRise(2); SFX.whoosh(2.2, true); hudRun(3, 2, 42, 86, 2100); }],
        [12900, () => { addC("d-impact"); SFX.rotorStop(); SFX.boom(); }],   // the hit
        [13300, () => line(2)],                                   // "Every step. Every customer."
        [13900, () => { addC("p-charge"); SFX.charge(); SFX.padStart(0.045); }],
        [15000, () => { addC("p-brand"); SFX.shimmer(); }],
        [15700, () => { addC("p-lines"); line(3); }],             // "Every call answered. Every battery tracked."
        [18400, () => { addC("p-close"); line(4); }],             // "Our quality. Our commitment. Our future."
        [22200, () => { addC("p-exit"); reveal(); }],
        [23200, finish]
      ];
      T.forEach(([ms, fn]) => at(ms, fn));
    }
    function skip() {
      if (!api.running) return;
      timers.forEach(clearTimeout); timers = [];
      Voice.stop(); SFX.rotorStop(); SFX.padStart(0.045);
      box.classList.add("p-dive", "d-impact", "p-exit", "fast");
      reveal();
      timers.push(setTimeout(finish, 450));
    }
    let revealed = false;
    function reveal() {
      if (revealed) return;
      revealed = true;
      cur = -1; activeCtx = null;
      go(0);
    }
    function finish() {
      timers.forEach(clearTimeout); timers = [];
      reveal();
      box.hidden = true; box.className = ""; box.innerHTML = "";
      api.running = false;
    }
    box.addEventListener("click", () => { if (api.waiting) start(); else skip(); });
    api.start = start;
    return api;
  })();

  const start = parseInt((location.hash || "").replace("#", ""), 10);
  if (INTRO.enabled && (isNaN(start) || start === 1) && !window.matchMedia("print").matches) {
    fit();
    intro.begin();
  } else {
    go(isNaN(start) ? 0 : start - 1);
  }
})();
