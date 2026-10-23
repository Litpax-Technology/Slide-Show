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

  // Animated Litpax battery (drawn in code — no product photo needed)
  let battSeq = 0;
  function batterySVG(cls) {
    const id = "bt" + (++battSeq), P = C.company.productArt || {};
    const volt = esc(P.volt || "74V"), cap = esc(P.cap || "36Ah");
    const logo = C.company.logoWhite ? `<image href="${esc(C.company.logoWhite)}" x="16" y="16" width="118" height="34"/>`
                                     : `<text x="16" y="44" class="bt-logo-t">${esc(C.company.shortName)}</text>`;
    return `
      <svg class="batt-art ${cls || ""}" viewBox="0 0 300 430" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Litpax lithium battery">
        <defs>
          <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#30343c"/><stop offset=".55" stop-color="#1b1e23"/><stop offset="1" stop-color="#121417"/></linearGradient>
          <linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#454a53"/><stop offset="1" stop-color="#2f333a"/></linearGradient>
          <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" style="stop-color:var(--night-1)"/><stop offset="1" stop-color="#0a0b0e"/></linearGradient>
          <linearGradient id="${id}w" x1="0" y1="1" x2="1" y2="0"><stop offset="0" style="stop-color:var(--accent-deep)" stop-opacity=".0"/><stop offset=".45" style="stop-color:var(--accent)"/><stop offset=".75" style="stop-color:var(--iris-warm)"/><stop offset="1" style="stop-color:var(--accent-light)" stop-opacity=".2"/></linearGradient>
          <clipPath id="${id}c"><path d="M80 132 L268 106 L268 378 L80 404 Z"/></clipPath>
        </defs>
        <ellipse cx="160" cy="410" rx="130" ry="14" fill="#000" opacity=".28"/>
        <path d="M40 112 L80 132 L80 404 L40 384 Z" fill="#15171b"/>
        <path d="M80 132 L268 106 L268 378 L80 404 Z" fill="url(#${id}f)"/>
        <path d="M40 112 L228 86 L268 106 L80 132 Z" fill="url(#${id}t)"/>
        <path d="M40 112 L80 132 L268 106" fill="none" stroke="#5a606a" stroke-width="1.5"/>
        <path d="M92 100 Q120 86 160 82" fill="none" stroke="#0d0e10" stroke-width="7" stroke-linecap="round"/>
        <g><rect x="186" y="78" width="16" height="13" fill="#b8322a"/><ellipse cx="194" cy="91" rx="8" ry="3.5" fill="#8e251f"/><ellipse cx="194" cy="78" rx="8" ry="3.5" fill="#e04a3f"/></g>
        <g><rect x="218" y="83" width="16" height="13" fill="#141414"/><ellipse cx="226" cy="96" rx="8" ry="3.5" fill="#0a0a0a"/><ellipse cx="226" cy="83" rx="8" ry="3.5" fill="#3a3a3a"/></g>
        <g transform="translate(94,158) skewY(-7.6)">
          <rect x="0" y="0" width="160" height="196" rx="8" fill="url(#${id}l)" stroke="rgba(255,255,255,.08)"/>
          <path d="M0 196 L0 150 Q60 120 160 40 L160 92 Q90 150 40 196 Z" fill="url(#${id}w)" opacity=".9"/>
          ${logo}
          <text x="16" y="74" class="bt-t1">LITHIUM ION</text>
          <text x="16" y="92" class="bt-t2">POWER PACK · ${cap}</text>
          <circle cx="128" cy="128" r="22" style="fill:var(--accent)"/><circle cx="128" cy="128" r="22" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
          <text x="128" y="133" class="bt-v" text-anchor="middle">${volt}</text>
          ${[0, 1, 2, 3, 4].map((i) => `<rect class="bt-seg" x="${16 + i * 15}" y="168" width="11" height="12" rx="2" style="animation-delay:${(i * 0.32).toFixed(2)}s"/>`).join("")}
          <circle class="bt-led" cx="146" cy="174" r="4"/>
        </g>
        <g clip-path="url(#${id}c)"><path class="bt-shine" d="M40 404 L100 404 L190 100 L130 100 Z" fill="#fff" opacity=".10"/></g>
      </svg>`;
  }
  const DEMO = Object.assign({ autoSwitch: true, screenshotSeconds: 6 }, C.demo || {});
  const TAG = C.taglines || {};
  const AMB = C.ambition || null;
  const PROM = C.promise || null;
  const MILES = (C.milestones || []).filter((m) => m && m.year && m.title);
  const INTRO = C.intro || { enabled: false };
  const VAL = C.value || {};

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
        <div class="title-batt rv">${batterySVG()}<span class="batt-glow"></span></div>
      </div>`
  });

  // 1a. VALUE — the client's challenges, what they gain, why choose Litpax
  if (VAL.challenges) {
    const ch = VAL.challenges;
    slides.push({
      title: "The challenge", cls: "s-chal", hero: "chal",
      html: chrome(`
        <div class="chal-wrap">
          <div class="chal-left">
            <div class="eyebrow rv">${esc(ch.kicker)}</div>
            <h2 class="rv">${esc(ch.title)}</h2>
            <p class="tag rv">${esc(ch.sub)}</p>
            <div class="chal-answer" data-k="ans">${ICON.check} ${esc(ch.answer)}</div>
          </div>
          <div class="chal-list">${ch.items.map((t, i) => `<div class="chal" data-k="c${i}"><span class="chal-x">${ICON.x}</span><div><b>${esc(t.t)}</b><span>${esc(t.d)}</span></div></div>`).join("")}</div>
        </div>`, { kicker: "The challenge" })
    });
  }
  if (VAL.gains) {
    const g = VAL.gains;
    slides.push({
      title: "What you get", cls: "s-gain", hero: "gain",
      html: chrome(`
        <div class="center-head compact">
          <div class="eyebrow rv">${esc(g.kicker)}</div>
          <h2 class="rv">${esc(g.title)}</h2>
        </div>
        <div class="gain">
          <div class="gain-row gain-h rv"><span>Today</span><span></span><span>With Litpax</span><span>Your gain</span></div>
          ${g.rows.map((r, i) => `
            <div class="gain-row" data-k="g${i}">
              <span class="g-old">${esc(r[0])}</span>
              <span class="g-arr">${arrow}</span>
              <span class="g-new">${esc(r[1])}</span>
              <span class="g-win">${ICON.check}${esc(r[2])}</span>
            </div>`).join("")}
        </div>`, { kicker: "Value for you" })
    });
  }
  slides.push({
    title: "Why choose Litpax", cls: "s-why", hero: "why",
    html: chrome(`
      <div class="center-head compact">
        <div class="eyebrow rv">${esc((VAL.whyKicker) || "Why choose us")}</div>
        <h2 class="rv">${esc((VAL.whyTitle) || "Why choose Litpax.")}</h2>
      </div>
      <div class="why-grid">
        ${C.why.map((w, k) => `<div class="why rv"><div class="why-n">${pad(k + 1)}</div><b>${esc(w.t)}</b><span>${esc(w.d)}</span></div>`).join("")}
      </div>`, { kicker: "Why Litpax" })
  });

  // 1a-ii. Your dedicated team — Sales CRM + Service CRM (the two people who deal with the client)
  if (VAL.crm) {
    const cr = VAL.crm;
    const person = (kind) => `
      <svg class="crm-av" viewBox="0 0 120 120" aria-hidden="true">
        <circle cx="60" cy="60" r="58" style="fill:var(--accent-soft)"/>
        <path d="M22 112 Q24 78 60 76 Q96 78 98 112 Z" style="fill:var(--indigo)"/>
        ${kind === "sales"
          ? `<path d="M54 78 L60 98 L66 78 Z" style="fill:var(--accent)"/><path d="M50 77 L60 86 L70 77" fill="none" stroke="#fff" stroke-width="3"/>`
          : `<path d="M44 77 L60 90 L76 77" fill="none" stroke="#fff" stroke-width="3"/>`}
        <circle cx="60" cy="50" r="22" fill="#f1c9a5"/>
        <path d="M38 48 Q40 26 60 26 Q80 26 82 48 Q74 36 60 37 Q46 36 38 48 Z" fill="#2b2118"/>
        ${kind === "service"
          ? `<path d="M34 52 Q34 22 60 22 Q86 22 86 52" fill="none" style="stroke:var(--accent)" stroke-width="5" stroke-linecap="round"/><rect x="29" y="46" width="10" height="16" rx="4" style="fill:var(--accent)"/><rect x="81" y="46" width="10" height="16" rx="4" style="fill:var(--accent)"/><path d="M86 60 Q86 72 70 72" fill="none" style="stroke:var(--accent)" stroke-width="3"/><circle cx="68" cy="72" r="3.5" style="fill:var(--accent)"/>`
          : `<rect x="78" y="80" width="22" height="30" rx="3" fill="#fff" style="stroke:var(--accent)" stroke-width="2"/><path d="M83 89 h12 M83 95 h12 M83 101 h8" style="stroke:var(--accent)" stroke-width="2"/>`}
      </svg>`;
    const card = (r, kind, side) => `
      <div class="crm-card ${side}" data-k="${kind}">
        <div class="crm-top">${person(kind)}<div><span class="crm-role">${esc(r.role)}</span><b>${esc(r.title)}</b></div></div>
        <p>${esc(r.line)}</p>
        <ul>${r.does.map((d) => `<li>${ICON.check}<span>${esc(d)}</span></li>`).join("")}</ul>
      </div>`;
    slides.push({
      title: "Your dedicated team", cls: "s-crm", hero: "crm",
      html: chrome(`
        <div class="center-head compact">
          <div class="eyebrow rv">${esc(cr.kicker)}</div>
          <h2 class="rv">${esc(cr.title)}</h2>
        </div>
        <div class="crm">
          ${card(cr.sales, "sales", "l")}
          <div class="crm-mid">
            <svg class="crm-links" viewBox="0 0 220 300" preserveAspectRatio="none"><path class="ln l" d="M0 150 C 60 150, 60 150, 110 150"/><path class="ln r" d="M220 150 C 160 150, 160 150, 110 150"/></svg>
            <div class="crm-you"><span>${ICON.user}</span><b>${esc(cr.you || "You")}</b><em>${esc(cr.youSub || "One call, the right person")}</em></div>
            <div class="crm-plant">${C.company.logo ? `<img src="${esc(C.company.logo)}" alt="Litpax">` : esc(C.company.shortName)}<span>${esc(cr.plant || "Plant · Production · Dispatch")}</span></div>
          </div>
          ${card(cr.service, "service", "r")}
        </div>`, { kicker: "Your team" })
    });
  }

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

  // 4. Step slides (with a cinematic chapter divider before each phase)
  const PH = C.phaseLines || {};
  let lastPhase = null;
  C.steps.forEach((s, i) => {
    if (s.phase !== lastPhase) {
      lastPhase = s.phase;
      const pi = C.phases.indexOf(s.phase), inPh = C.steps.filter((x) => x.phase === s.phase);
      slides.push({
        title: `${pad(pi + 1)} · ${s.phase}`, cls: "s-div", hero: "div", vkey: "phase-" + s.phase,
        html: `
          <div class="div-bg"><b>${pad(pi + 1)}</b></div>
          <div class="slide-top">
            <div class="logo logo-sm logo-white">${C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="${esc(C.company.name)}" onerror="this.remove()">` : ""}<span>${esc(C.company.shortName)}</span></div>
            <span class="slide-kicker">Chapter ${pi + 1} of ${C.phases.length}</span>
          </div>
          <div class="div-wrap">
            <div class="div-num rv">${pad(pi + 1)}</div>
            <h2 class="div-name rv">${esc(s.phase)}</h2>
            <p class="div-line rv">${esc(PH[s.phase] || "")}</p>
            <div class="div-steps">${inPh.map((x) => `<span class="rv">${esc(x.title)}</span>`).join(`<i class="rv">${arrow}</i>`)}</div>
          </div>
          <div class="div-progress">${C.phases.map((p, j) => `<span class="${j < pi ? "done" : j === pi ? "on" : ""}">${esc(p)}</span>`).join("")}</div>`
      });
    }
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

  // 4b. How we track your order (real ERP screen, customer details blurred)
  if (VAL.track) {
    const tk = VAL.track;
    slides.push({
      title: "How we track your order", cls: "s-track", hero: "track",
      html: chrome(`
        <div class="trk-wrap">
          <div class="trk-left">
            <div class="eyebrow rv">${esc(tk.kicker)}</div>
            <h2 class="rv">${esc(tk.title)}</h2>
            <p class="tag rv">${esc(tk.sub)}</p>
            <div class="trk-steps">${tk.stages.map((st, i) => `
              <div class="trk-s rv" data-k="t${i}" data-pos="${st.pos}">
                <div class="trk-d">${pad(i + 1)}</div>
                <div><b>${esc(st.t)}</b><span>${esc(st.d)}</span></div>
              </div>`).join("")}
            </div>
          </div>
          <div class="trk-right rv">
            <div class="frame trk-frame">
              <div class="frame-bar"><i></i><i></i><i></i><span>${esc(tk.bar || "Litpax ERP · Order tracking")}</span></div>
              <div class="trk-view"><img data-k="img" src="${esc(tk.shot)}" alt="Order tracking screen"><div class="trk-hl" data-k="hl"></div></div>
              <div class="trk-badge" data-k="badge">${esc(tk.stages[0].t)}</div>
            </div>
            <span class="trk-note">${esc(tk.note || "")}</span>
          </div>
        </div>`, { kicker: "Order tracking" })
    });
  }

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

  // 7b. Litpax vs a typical supplier
  if (VAL.versus) {
    const v = VAL.versus;
    slides.push({
      title: "Litpax vs a typical supplier", cls: "s-vs", hero: "vs",
      html: chrome(`
        <div class="center-head compact">
          <div class="eyebrow rv">${esc(v.kicker)}</div>
          <h2 class="rv">${esc(v.title)}</h2>
        </div>
        <div class="vs">
          <div class="vs-row vs-h rv"><span></span><span>${esc(v.them)}</span><span class="vs-us-h">${C.company.logo ? `<img src="${esc(C.company.logo)}" alt="Litpax">` : "Litpax"}</span></div>
          ${v.rows.map((r, i) => `
            <div class="vs-row" data-k="v${i}">
              <b>${esc(r[0])}</b>
              <span class="vs-them">${ICON.x}${esc(r[1])}</span>
              <span class="vs-us">${ICON.check}${esc(r[2])}</span>
            </div>`).join("")}
        </div>`, { kicker: "The difference" })
    });
  }

  // 7c. Product range (real models)
  if (VAL.products) {
    const pr = VAL.products;
    slides.push({
      title: "Our product range", cls: "s-prod", hero: "prod",
      html: chrome(`
        <div class="prod-wrap">
          <div class="prod-left rv">
            <div class="prod-stage"><span class="prod-glow"></span>${batterySVG()}</div>
            <div class="prod-tag">${esc(pr.heroLabel || "")}</div>
          </div>
          <div class="prod-right">
            <div class="eyebrow rv">${esc(pr.kicker)}</div>
            <h2 class="rv">${esc(pr.title)}</h2>
            <div class="prod-grid">${pr.lines.map((l, i) => `
              <div class="prod-card" data-k="p${i}">
                <b>${esc(l.name)}</b><span>${esc(l.desc)}</span>
                <div class="prod-specs">${(l.specs || []).map((x) => `<em>${esc(x)}</em>`).join("")}</div>
              </div>`).join("")}
            </div>
          </div>
        </div>`, { kicker: "Products" })
    });
  }

  // 7d. What our partners say (real reviews from the Customer Review form)
  const VOICES = (C.testimonials || []).filter((t) => t && t.quote);
  if (VOICES.length) {
    slides.push({
      title: "What our partners say", cls: "s-voices",
      html: chrome(`
        <div class="center-head compact">
          <div class="eyebrow rv">From our Customer Review form</div>
          <h2 class="rv">What our partners say.</h2>
        </div>
        <div class="voices">${VOICES.map((t) => `
          <div class="voice-c rv">
            ${t.stars ? `<div class="voice-stars">${ICON.star.repeat(t.stars)}</div>` : ""}
            <p>${esc(t.quote)}</p>
            <div class="voice-who"><div class="av">${esc((t.name || "").split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase())}</div>
              <div><b>${esc(t.name)}</b><span>${esc(t.place || "")}</span></div></div>
          </div>`).join("")}
        </div>`, { kicker: "Partners" })
    });
  }

  // 8. Gallery (only when apps are listed in config)
  if ((C.gallery || []).length) slides.push({
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

  // 9b. How to start working with us
  if (VAL.start) {
    const st = VAL.start, ctc = C.company.contact || {};
    slides.push({
      title: "How to start", cls: "s-start", hero: "start",
      html: chrome(`
        <div class="center-head compact">
          <div class="eyebrow rv">${esc(st.kicker)}</div>
          <h2 class="rv">${esc(st.title)}</h2>
        </div>
        <div class="start">
          <div class="start-line"><i data-k="sfill"></i></div>
          ${st.steps.map((x, i) => `
            <div class="start-s" data-k="s${i}">
              <div class="start-d">${pad(i + 1)}</div>
              <b>${esc(x.t)}</b><span>${esc(x.d)}</span>
            </div>`).join("")}
        </div>
        <div class="start-cta rv">
          ${ctc.phone ? `<div>${ICON.phone}<span>Call</span><b>${esc(ctc.phone)}</b></div>` : ""}
          ${ctc.website ? `<div>${ICON.doc}<span>Visit</span><b>${esc(ctc.website)}</b></div>` : ""}
          ${ctc.email ? `<div>${ICON.bell}<span>Write</span><b>${esc(ctc.email)}</b></div>` : ""}
        </div>`, { kicker: "Get started" })
    });
  }

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
    "s-promise": "promise", "s-why": "why", "s-end": "end",
    "s-chal": "challenges", "s-gain": "gains", "s-track": "track", "s-vs": "versus", "s-prod": "products", "s-start": "start", "s-voices": "voices", "s-crm": "crm", "s-div": ""
  };

  /* ---------- render ---------- */
  stage.innerHTML = slides
    .map((s, i) => `<section class="slide ${s.cls}" data-i="${i}" data-vkey="${s.vkey || CLS2KEY[s.cls] || ""}"${s.hero ? ` data-hero="${s.hero}"` : ""} aria-label="${esc(s.title)}"><div class="slide-inner">${s.html}</div><div class="slide-num">${pad(i + 1)}</div></section>`)
    .join("");

  const els = Array.from(stage.querySelectorAll(".slide"));
  els.forEach((el) => {
    el.querySelectorAll(".rv").forEach((r, k) => r.style.setProperty("--d", k));
  });

  // Headlines reveal word by word (mask slide-up)
  els.forEach((el) => {
    el.querySelectorAll(".slide-inner h1, .slide-inner h2").forEach((h) => {
      if (h.closest(".sc")) return;
      let w = 0;
      const walk = document.createTreeWalker(h, NodeFilter.SHOW_TEXT);
      const nodes = []; while (walk.nextNode()) nodes.push(walk.currentNode);
      nodes.forEach((tn) => {
        const frag = document.createDocumentFragment();
        tn.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const o = document.createElement("span"); o.className = "wd";
          const i = document.createElement("span"); i.textContent = part; i.style.setProperty("--w", w++);
          o.appendChild(i); frag.appendChild(o);
        });
        tn.parentNode.replaceChild(frag, tn);
      });
      h.classList.add("words");
    });
  });

  // Chapter markers on the progress bar
  const progress = document.getElementById("progress");
  els.forEach((el, i) => {
    if (!el.classList.contains("s-div")) return;
    const m = document.createElement("i");
    m.className = "chap"; m.style.left = (i / els.length) * 100 + "%";
    m.title = el.getAttribute("aria-label");
    m.onclick = () => go(i);
    progress.appendChild(m);
  });

  // Accent sweep line on every slide change
  const sweep = document.createElement("div");
  sweep.id = "sweep"; document.body.appendChild(sweep);

  // Glass HUD hides itself while presenting; mouse movement brings it back
  let hudTimer = null;
  const wakeHud = () => {
    document.body.classList.add("hud-awake");
    clearTimeout(hudTimer); hudTimer = setTimeout(() => document.body.classList.remove("hud-awake"), 2600);
  };
  document.addEventListener("mousemove", wakeHud); wakeHud();

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
    chal: async (el, c) => {
      const items = qa(el, ".chal"), ans = el.querySelector(".chal-answer");
      items.forEach((x) => x.classList.remove("in")); ans.classList.remove("in");
      await c.wait(700);
      for (const x of items) { x.classList.add("in"); await c.wait(520); }
      await c.wait(500); ans.classList.add("in"); SFX.ding();
    },
    gain: async (el, c) => {
      const rows = qa(el, ".gain-row[data-k]");
      rows.forEach((r) => r.classList.remove("in", "done"));
      await c.wait(700);
      for (const r of rows) {
        r.classList.add("in"); await c.wait(450);
        r.classList.add("done"); await c.wait(550);
      }
    },
    track: async (el, c) => {
      const k = K(el), img = k("img"), view = img.parentNode, steps = qa(el, ".trk-s");
      await c.wait(900);
      while (c.alive) {
        for (let i = 0; i < steps.length; i++) {
          steps.forEach((x, j) => { x.classList.toggle("on", j === i); x.classList.toggle("done", j < i); });
          const H = img.offsetHeight, V = view.offsetHeight;
          const y = Math.max(0, Math.min(H - V, +steps[i].dataset.pos * H - 8));
          img.style.transform = `translateY(${-y}px)`;
          k("badge").textContent = steps[i].querySelector("b").textContent;
          k("badge").classList.remove("pop"); void k("badge").offsetWidth; k("badge").classList.add("pop");
          await c.wait(2300);
        }
        steps.forEach((x) => x.classList.add("done"));
        await c.wait(1600);
      }
    },
    vs: async (el, c) => {
      const rows = qa(el, ".vs-row[data-k]");
      rows.forEach((r) => r.classList.remove("in"));
      await c.wait(800);
      for (const r of rows) { r.classList.add("in"); await c.wait(480); }
    },
    prod: async (el, c) => {
      const cards = qa(el, ".prod-card");
      cards.forEach((x) => x.classList.remove("in"));
      await c.wait(700);
      for (const x of cards) { x.classList.add("in"); await c.wait(380); }
    },
    start: async (el, c) => {
      const st = qa(el, ".start-s"), fill = el.querySelector('[data-k="sfill"]');
      st.forEach((x) => x.classList.remove("on")); fill.style.width = "0";
      await c.wait(800);
      for (let i = 0; i < st.length; i++) {
        fill.style.width = (i / (st.length - 1)) * 100 + "%";
        await c.wait(350); st[i].classList.add("on"); await c.wait(500);
      }
    },
    div: async (el, c) => {
      el.classList.remove("go"); void el.offsetWidth;
      await c.wait(150); el.classList.add("go");
      SFX.whoosh(1.4, true);
    },
    crm: async (el, c) => {
      const k = K(el), you = el.querySelector(".crm-you"), plant = el.querySelector(".crm-plant");
      [k("sales"), k("service")].forEach((x) => x.classList.remove("in", "lit"));
      you.classList.remove("in"); plant.classList.remove("in"); el.querySelector(".crm-links").classList.remove("in");
      qa(el, ".crm-card li").forEach((x) => x.classList.remove("in"));
      await c.wait(600); you.classList.add("in");
      await c.wait(500); el.querySelector(".crm-links").classList.add("in");
      for (const kind of ["sales", "service"]) {
        await c.wait(450); const cd = k(kind); cd.classList.add("in");
        for (const li of qa(cd, "li")) { await c.wait(260); li.classList.add("in"); }
      }
      await c.wait(400); plant.classList.add("in");
      while (c.alive) {                       // the client's call alternates between the two CRMs
        for (const kind of ["sales", "service"]) {
          k(kind).classList.add("lit"); el.querySelector(".crm-links").dataset.side = kind;
          await c.wait(1800); k(kind).classList.remove("lit");
        }
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
    api.setMuted = (m) => { muted = m; if (master) master.gain.setTargetAtTime(m ? 0 : 0.9, ac.currentTime, 0.05); if (fileMusic) fileMusic.muted = m; };
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
    api.kick = (hard) => {
      if (!ac) return;
      const t = now(), o = ac.createOscillator();
      o.type = "sine"; o.frequency.setValueAtTime(hard ? 170 : 140, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.22);
      o.connect(gainEnv(t, 0.004, hard ? 0.5 : 0.32, hard ? 1 : 0.8)); o.start(t); o.stop(t + 0.6);
      const n = noise(), f = ac.createBiquadFilter(); f.type = "highpass"; f.frequency.value = 2500;
      n.connect(f); f.connect(gainEnv(t, 0.002, 0.05, 0.18)); n.start(t); n.stop(t + 0.08);
    };
    // Background music: slow cinematic progression (Am9 – Fmaj7 – Cadd9 – G6), soft pads,
    // a gentle piano-like arpeggio and a sub bass, all through a generated reverb.
    let music = null, musicLevel = 0.06;
    const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
    const impulse = (sec) => {
      const len = ac.sampleRate * sec, b = ac.createBuffer(2, len, ac.sampleRate);
      for (let ch = 0; ch < 2; ch++) { const d = b.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2.6); }
      return b;
    };
    api.musicStart = (level) => {
      if (!ac || music) return;
      musicLevel = level || musicLevel;
      const out = ac.createGain(); out.gain.setValueAtTime(0.0001, now()); out.gain.exponentialRampToValueAtTime(musicLevel, now() + 5); out.connect(master);
      const conv = ac.createConvolver(); conv.buffer = impulse(3.4);
      const wet = ac.createGain(); wet.gain.value = 0.6; const dry = ac.createGain(); dry.gain.value = 0.65;
      const bus = ac.createGain(); bus.connect(dry); bus.connect(conv); conv.connect(wet); dry.connect(out); wet.connect(out);
      const chords = [
        { bass: 45, notes: [57, 60, 64, 71] }, { bass: 41, notes: [53, 57, 60, 64] },
        { bass: 48, notes: [55, 60, 62, 64] }, { bass: 43, notes: [55, 59, 62, 64] }
      ];
      const beat = 60 / 80, chordLen = beat * 4;
      let t0 = now() + 0.1, step = 0;
      const pad = (fq, t, dur) => {
        [0, 7].forEach((det, j) => {
          const o = ac.createOscillator(), f = ac.createBiquadFilter(), g = ac.createGain();
          o.type = j ? "sawtooth" : "triangle"; o.frequency.value = fq; o.detune.value = j ? det : -4;
          f.type = "lowpass"; f.frequency.value = j ? 900 : 1500;
          g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(j ? 0.018 : 0.05, t + 0.9);
          g.gain.setValueAtTime(j ? 0.018 : 0.05, t + dur - 0.2); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 1.4);
          o.connect(f); f.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 1.6);
        });
      };
      const pluck = (fq, t, v) => {
        const o = ac.createOscillator(), o2 = ac.createOscillator(), g = ac.createGain();
        o.type = "sine"; o2.type = "triangle"; o.frequency.value = fq; o2.frequency.value = fq * 2;
        const g2 = ac.createGain(); g2.gain.value = 0.18; o2.connect(g2); g2.connect(g);
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        o.connect(g); g.connect(bus); o.start(t); o2.start(t); o.stop(t + 1.2); o2.stop(t + 1.2);
      };
      const sub = (fq, t, dur) => {
        const o = ac.createOscillator(), g = ac.createGain(); o.type = "sine"; o.frequency.value = fq;
        g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.14, t + 0.08); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.1);
      };
      const arp = [0, 1, 2, 3, 2, 1, 3, 2];
      const tick = () => {
        if (!music) return;
        while (t0 < now() + 0.8) {
          const ch = chords[Math.floor(step / 8) % chords.length], i = step % 8, t = t0;
          if (i === 0) { ch.notes.forEach((n) => pad(mtof(n), t, chordLen)); sub(mtof(ch.bass), t, chordLen * 0.9); }
          if (step >= 16) pluck(mtof(ch.notes[arp[i]] + 12), t, i % 4 === 0 ? 0.05 : 0.032);   // arpeggio joins after 2 bars
          step++; t0 += beat / 2;
        }
      };
      music = { out, timer: setInterval(tick, 200) };
      tick();
    };
    api.musicLevel = (lvl, sec) => { musicLevel = lvl; if (music) music.out.gain.setTargetAtTime(lvl, now(), (sec || 1) / 3); };
    api.riser = (sec) => {
      if (!ac) return;
      sec = sec || 1.6; const t = now(), n = noise(), f = ac.createBiquadFilter(), o = ac.createOscillator();
      f.type = "bandpass"; f.Q.value = 3; f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(5000, t + sec);
      n.connect(f); f.connect(gainEnv(t, sec * 0.95, 0.08, 0.35)); n.start(t); n.stop(t + sec + 0.1);
      o.type = "sawtooth"; o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(880, t + sec);
      const lp = ac.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 1400; o.connect(lp); lp.connect(gainEnv(t, sec * 0.95, 0.08, 0.06)); o.start(t); o.stop(t + sec + 0.1);
    };
    api.drop = () => {
      if (!ac) return;
      const t = now(), o = ac.createOscillator(); o.type = "sine";
      o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(32, t + 2.2);
      o.connect(gainEnv(t, 0.02, 2.6, 1.0)); o.start(t); o.stop(t + 2.8);
      api.shimmer();
    };

    let padLevel = 0.045;
    api.duck = (on) => {
      if (!ac) return;
      if (pad) pad.out.gain.setTargetAtTime(on ? padLevel * 0.25 : padLevel, ac.currentTime, 0.25);
      if (music) music.out.gain.setTargetAtTime(on ? musicLevel * 0.3 : musicLevel, ac.currentTime, 0.3);
      if (fileMusic) fileMusic.volume = on ? fileVol * 0.3 : fileVol;
    };
    // Optional real music file (config.music) — used instead of the generated track when it exists
    let fileMusic = null, fileVol = 0.35;
    api.useFile = (src, vol) => {
      if (!src || fileMusic) return Promise.resolve(false);
      fileVol = vol || fileVol;
      return new Promise((res) => {
        const a = new Audio(src); a.loop = true; a.volume = fileVol;
        a.onerror = () => res(false);
        a.play().then(() => { fileMusic = a; res(true); }).catch(() => res(false));
      });
    };
    api.music = (level) => {
      if (fileMusic) return;
      api.useFile(C.music, C.musicVolume).then((ok) => { if (!ok) api.musicStart(level); });
    };
    // ambient background pad (A minor 9), very quiet, slowly breathing
    api.padStart = (level) => {
      if (!ac || pad) return;
      padLevel = level || 0.045;
      const t = now(), out = ac.createGain(); out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(padLevel, t + 4); out.connect(master);
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
  const VO = Object.assign({ enabled: true, autoAdvance: false, rate: 0.92, pitch: 1, folder: "assets/voice/", lines: {}, intro: [] }, C.voice || {});
  const Voice = (function () {
    const synth = window.speechSynthesis;
    let voice = null, audio = null, token = 0;
    const prefer = [
      /Prabhat.*(Natural|Online)/i, /Microsoft (Andrew|Brian|Guy|Christopher|Davis|Eric|Roger|Steffan|Ryan|Thomas).*(Natural|Online)/i,
      /(Natural|Online).*en-(IN|GB|US)/i, /Prabhat/i, /Google UK English Male/i, /Daniel/i, /Microsoft (Ravi|David|Mark|George)/i, /en-IN/i, /en-GB/i, /^en/i
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
      SFX.duck(false);
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
        // short phrases spoken one after another sound far more natural than one long utterance
        const parts = text.replace(/\.\.\./g, "…").split(/(?<=[.?!…])\s+|\s+(?=—)/).map((x) => x.trim()).filter(Boolean);
        parts.forEach((part, i) => {
          const u = new SpeechSynthesisUtterance(part);
          if (voice) u.voice = voice;
          u.lang = (voice && voice.lang) || "en-IN";
          u.rate = opts.rate || VO.rate; u.pitch = opts.pitch || VO.pitch; u.volume = 1;
          if (i === 0) u.onstart = () => SFX.duck(true);
          if (i === parts.length - 1) { u.onend = () => { SFX.duck(false); done(); }; u.onerror = () => { SFX.duck(false); done(); }; }
          synth.speak(u);
        });
      };
      if (!key) return tts();
      const a = new Audio(VO.folder + key + ".mp3");
      audio = a;
      a.onplay = () => SFX.duck(true);
      a.onended = () => { SFX.duck(false); done(); };
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
        c.wait(1400).then(() => { if (cur === idx) next(); });
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
    if (!SFX.isMuted()) SFX.music(0.06);
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

  function next() {
    if (cur >= els.length - 1) { if (typeof intro !== "undefined" && intro.outro) intro.outro(); return; }
    go(cur + 1);
  }
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
    sweep.classList.remove("go"); void sweep.offsetWidth; sweep.classList.add("go");
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
  document.getElementById("btnNext").onclick = () => next();
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
    if (intro.outroOn) { e.preventDefault(); return intro.outroKey(); }
    if (intro.waiting) { e.preventDefault(); return intro.start(); }
    if (intro.running) { e.preventDefault(); return intro.skip(); }
    if (k === "i" || k === "I") return intro.play();
    if ((k === "e" || k === "E") && intro.outro) return intro.outro();
    if (k === "m" || k === "M") return toggleSound();
    if (k === "a" || k === "A") return toggleAuto();
    if (!ov.hidden && k === "Escape") return closeOv();
    if (["ArrowRight", "PageDown", " ", "Enter"].includes(k)) { e.preventDefault(); next(); }
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
    if (tx == null || intro.running || intro.waiting || intro.outroOn) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? next() : go(cur - 1));
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

    // Battery assembly: cells fly into a grid → nickel strips → BMS → casing closes → real Litpax pack powers on
    function assembleScene() {
      const cols = 8, rows = 6, pitch = 52, W0 = cols * pitch, H0 = rows * pitch;
      const gx = 640 - W0 / 2, gy = 350 - H0 / 2;
      let cells = "", strips = "";
      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const n = r * cols + q, ang = (n * 137.5) % 360, dist = 520 + (n % 5) * 90;
          const sx = Math.cos((ang * Math.PI) / 180) * dist, sy = Math.sin((ang * Math.PI) / 180) * dist * 0.75;
          cells += `<i class="as-cell" style="left:${gx + q * pitch + 3}px;top:${gy + r * pitch + 3}px;--sx:${sx.toFixed(0)}px;--sy:${sy.toFixed(0)}px;--rot:${(n * 47) % 360}deg;--d:${((n * 0.37) % 1 * 0.75).toFixed(2)}s;--g:${(n * 0.035).toFixed(2)}s"></i>`;
        }
        strips += `<b class="as-strip" style="left:${gx - 6}px;top:${gy + r * pitch + 21}px;width:${W0 + 12}px;--d:${(r * 0.12).toFixed(2)}s"></b>`;
      }
      const pad = 34, bx = gx - pad, by = gy - pad, bw = W0 + pad * 2, bh = H0 + pad * 2, per = 2 * (bw + bh);
      return `
        <div class="as-scene">
          <div class="as-bg"></div>
          <div class="as-rig">
          <div class="as-grid">${cells}${strips}</div>
          <div class="as-bms" style="left:${640 - 150}px;top:${gy + H0 + 18}px"><span>BMS</span><i></i><i></i><i></i><em></em></div>
          <svg class="as-case" viewBox="0 0 1280 720" preserveAspectRatio="none">
            <rect class="as-lid" x="${bx}" y="${by}" width="${bw}" height="${bh + 70}" rx="22"/>
            <rect class="as-edge" x="${bx}" y="${by}" width="${bw}" height="${bh + 70}" rx="22" style="stroke-dasharray:${per + 140};stroke-dashoffset:${per + 140}"/>
          </svg>
          ${C.company.logoWhite ? `<img class="as-logo" src="${esc(C.company.logoWhite)}" alt="" style="top:${by + (bh + 70) / 2 - 28}px">` : ""}
          </div>
          <div class="as-label"><span data-k="asl">Assembling</span></div>
        </div>`;
    }

    const fxLayers = () => `
        <div class="fx-grain"></div><div class="fx-vig"></div>
        <div class="lb t"></div><div class="lb b"></div>`;
    const sparks = (n) => Array.from({ length: n }, (_, i) =>
      `<i style="left:${(i * 37) % 100}%;--dl:${((i * 0.29) % 3).toFixed(2)}s;--du:${(3 + (i % 5) * 0.6).toFixed(1)}s;--sz:${2 + (i % 3)}px"></i>`).join("");

    // Lithium atom → "Li" periodic tile → "Litpax" wordmark → real logo
    function lxMark() {
      const orbit = (rot, dur, beg) => `
        <g transform="rotate(${rot})">
          <ellipse class="lx-orb" rx="170" ry="60"/>
          <circle class="lx-e" r="8"><animateMotion dur="${dur}s" begin="${beg}s" repeatCount="indefinite" path="M-170,0 a170,60 0 1,0 340,0 a170,60 0 1,0 -340,0"/></circle>
        </g>`;
      return `
        <div class="lx">
          <div class="lx-flash"></div>
          <svg class="lx-atom" viewBox="-210 -210 420 420" aria-hidden="true">
            <defs><radialGradient id="lxNuc"><stop offset="0" stop-color="#fff"/><stop offset=".35" style="stop-color:var(--accent-light)"/><stop offset="1" style="stop-color:var(--accent)"/></radialGradient></defs>
            <circle class="lx-halo" r="70"/>
            ${orbit(0, 2.2, 0)}${orbit(60, 2.7, -.6)}${orbit(120, 3.1, -1.3)}
            <circle class="lx-nuc" r="26" fill="url(#lxNuc)"/>
          </svg>
          <div class="lx-frame"><span class="n">3</span><span class="w">6.94</span><span class="nm">Lithium</span></div>
          <div class="lx-text"><b>Li</b><span class="rest"><span>tpa<em>x</em></span></span></div>
          ${C.company.logoWhite ? `<img class="lx-img" src="${esc(C.company.logoWhite)}" alt="${esc(C.company.name)}">` : ""}
        </div>`;
    }
    // measure "tpax" for the slide-out, and size the real logo to exactly match the typed "Litpax"
    const sizeMark = () => {
      const r = box.querySelector(".lx .rest"), li = box.querySelector(".lx-text b"), img = box.querySelector(".lx-img");
      if (!r) return;
      r.style.setProperty("--rw", r.scrollWidth + 1 + "px");
      const fit = () => {
        if (!img || !img.naturalWidth) return;
        const w = li.offsetWidth + r.scrollWidth;
        img.style.height = (w / (img.naturalWidth / img.naturalHeight)) + "px";
      };
      if (img && !img.complete) img.onload = fit; else fit();
    };

    // Kinetic typography — bold words land on the beat
    function kineticScene() {
      const W = INTRO.kinetic || ["Cells.", "Strips.", "BMS.", "Every station scanned.", "Every battery tracked.", "Zero compromise."];
      return `
        <div class="kt">
          <div class="kt-bg"><i></i><i></i><i></i><i></i></div>
          <div class="kt-grid"></div>
          ${W.map((w, i) => `<div class="kt-w m${i % 5}${i === W.length - 1 ? " last" : ""}" data-k="w${i}">${
            i % 5 === 2 ? [...w].map((ch, j) => `<span style="--l:${j}">${ch === " " ? "&nbsp;" : esc(ch)}</span>`).join("") : `<span>${esc(w)}</span>`
          }</div>`).join("")}
          <div class="kt-streak"></div>
          <div class="kt-flash"></div>
        </div>`;
    }
    // Exploded 3D battery — layers separate with labels, then snap together
    function explodedScene() {
      const L = INTRO.layers || ["Base tray", "Lithium cells", "Nickel strips", "Smart BMS", "Litpax casing"];
      const logo = C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="">` : `<b>${esc(C.company.shortName)}</b>`;
      return `
        <div class="eb">
          <div class="eb-floor"></div>
          <div class="eb-rig">
            <div class="eb-l l0"></div>
            <div class="eb-l l1"></div>
            <div class="eb-l l2"></div>
            <div class="eb-l l3"><i></i><i></i><i></i><i></i><em></em></div>
            <div class="eb-l l4">${logo}</div>
          </div>
          <div class="eb-labels">${L.map((t, i) => `<div class="eb-lab b${i}" style="--i:${4 - i}"><i></i><span>${pad(i + 1)}</span><b>${esc(t)}</b></div>`).join("")}</div>
          <div class="eb-flash"></div>
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
          <div class="in-sparks">${sparks(28)}</div>
          <div class="in-flare"></div>
          <div class="in-batt">
            ${batterySVG()}
            <div class="in-charge"><span>${esc(INTRO.chargeLabel || "Charging")}</span><div class="in-bar"><i></i></div></div>
          </div>
          <div class="in-brand">
            <div class="in-logo">${C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="${esc(C.company.name)}" onerror="this.parentNode.classList.add('txt')">` : ""}<b>${esc(C.company.shortName)}</b></div>
            <div class="in-lines">${lines}</div>
            <div class="in-closing">${closing}</div>
          </div>
        </div>
        ${kineticScene()}
        ${explodedScene()}
        <div class="in-card"><span>${esc(C.company.name.replace(/ Pvt\. Ltd\.?/i, ""))}</span><em>presents</em></div>
        ${fxLayers()}
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
    const setAs = (t) => { const el = box.querySelector('[data-k="asl"]'); if (el) el.textContent = t; };
    const line = (n) => { const t = (VO.intro || [])[n]; if (t) Voice.say("intro-" + (n + 1), t, { rate: 0.86, pitch: 0.95 }); };

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
      const D = 2600;   // the opening title card plays first
      const KW = (INTRO.kinetic || ["", "", "", "", "", ""]).length, BEAT = 1050;
      const kt = () => box.querySelector(".kt");
      const word = (i) => {
        const prev = box.querySelector('.kt-w.on'); if (prev) { prev.classList.remove("on"); prev.classList.add("out"); }
        const w = box.querySelector(`[data-k="w${i}"]`); if (w) w.classList.add("on");
        const k = kt(); k.classList.remove("hit"); void k.offsetWidth; k.classList.add("hit");
        if (i === KW - 1) { SFX.kick(true); SFX.drop(); } else SFX.kick();
      };
      const T = [
        [150,   () => { addC("p-card"); SFX.music(0.03); }],
        [2300,  () => addC("p-card-out")],
        [D + 100, () => { addC("k-on"); SFX.musicLevel(0.06, 1); }],
        ...Array.from({ length: KW }, (_, i) => [D + 300 + i * BEAT, () => word(i)]),
        [D + 300 + KW * BEAT + 700,  () => { addC("k-out"); SFX.whoosh(1.2, true); }],
        [D + 300 + KW * BEAT + 1000, () => { addC("b-show"); SFX.shimmer(); }],      // assembled pack, slowly orbiting
        [D + 300 + KW * BEAT + 2300, () => { addC("b-explode"); SFX.whoosh(1.4); line(0); }],   // "Engineered… layer by layer."
        [D + 300 + KW * BEAT + 5600, () => SFX.riser(1.2)],
        [D + 300 + KW * BEAT + 6800, () => { addC("b-snap"); SFX.kick(true); }],     // snap together
        [D + 300 + KW * BEAT + 7200, () => { addC("d-impact"); SFX.drop(); SFX.charge(); SFX.musicLevel(0.07, 1.5); }],
        [D + 300 + KW * BEAT + 7700, () => { addC("p-charge"); line(1); }],          // "Built in-house. Tracked at every step."
        [D + 300 + KW * BEAT + 8900, () => { addC("p-brand"); SFX.shimmer(); }],
        [D + 300 + KW * BEAT + 9600, () => { addC("p-lines"); line(2); }],           // "Every call answered. Every battery tracked."
        [D + 300 + KW * BEAT + 12200, () => { addC("p-close"); line(3); }],          // "Our quality. Our commitment. Our future."
        [D + 300 + KW * BEAT + 15800, () => { addC("p-exit"); reveal(); SFX.musicLevel(0.055, 3); }],
        [D + 300 + KW * BEAT + 16800, finish]
      ];
      T.forEach(([ms, fn]) => at(ms, fn));
    }
    function skip() {
      if (!api.running) return;
      timers.forEach(clearTimeout); timers = [];
      Voice.stop(); SFX.music(0.055);
      box.classList.add("p-card-out", "k-out", "b-snap", "d-impact", "p-exit", "fast");
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

    /* ---------- CINEMATIC OUTRO: full charge → logo from particles → taglines → the eye closes ---------- */
    let oTimers = [];
    api.outroOn = false; api.outroEnd = false;

    /* India energy map (canvas): dots form the map, light arcs fly out from the hub, then everything gathers into one point */
    const INDIA = [[74.0,34.5],[74.8,37.0],[77.8,35.6],[78.9,34.3],[79.4,32.6],[78.8,31.1],[80.3,30.2],[81.1,28.9],[84.0,27.4],[86.0,26.6],[88.1,26.5],[88.2,27.9],[88.9,27.3],[89.8,26.8],[92.0,26.9],[94.5,28.0],[95.6,29.2],[97.4,28.2],[96.2,27.1],[95.2,26.5],[94.6,25.2],[94.1,23.8],[93.3,22.0],[92.6,22.1],[92.3,23.6],[91.7,22.9],[91.3,24.0],[92.0,25.1],[90.0,25.2],[89.8,25.9],[89.0,25.3],[88.4,24.4],[88.7,23.2],[88.9,21.6],[87.0,21.5],[86.5,20.2],[85.0,19.3],[84.0,18.2],[82.3,16.6],[81.2,15.9],[80.3,15.2],[80.2,13.5],[79.8,11.5],[79.8,10.3],[78.2,8.9],[77.5,8.1],[76.6,8.9],[76.0,10.3],[75.4,11.8],[74.7,13.0],[74.1,14.8],[73.4,16.5],[72.8,19.0],[72.6,21.0],[72.2,21.9],[70.9,20.8],[69.0,22.3],[68.4,23.6],[70.0,24.2],[71.0,24.4],[70.4,25.7],[69.6,27.0],[70.3,27.9],[72.5,29.0],[73.4,29.9],[74.0,30.9],[74.6,31.9],[74.9,32.5],[74.0,33.0]];
    function inPoly(x, y, poly) {
      let c = false;
      for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const [xi, yi] = poly[i], [xj, yj] = poly[j];
        if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
      }
      return c;
    }
    function runMap(cv) {
      const M = (C.outro && C.outro.map) || {};
      const hub = M.hub || [76.6, 28.9];
      const targets = M.targets || [];
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const W = cv.clientWidth, H = cv.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      const g = cv.getContext("2d"); g.scale(dpr, dpr);
      const k = 0.92, lon0 = 68, lon1 = 97.6, lat0 = 6.5, lat1 = 37.3;
      const mh = H * 0.74, mw = mh * ((lon1 - lon0) * k) / (lat1 - lat0);
      const ox = W * 0.5 - mw / 2, oy = H * 0.47 - mh / 2;
      const P = (lon, lat) => [ox + ((lon - lon0) / (lon1 - lon0)) * mw, oy + ((lat1 - lat) / (lat1 - lat0)) * mh];
      const css = getComputedStyle(document.documentElement);
      const rgb = css.getPropertyValue("--accent-rgb").trim() || "238,90,36";
      const rgbL = css.getPropertyValue("--accent-light-rgb").trim() || "255,164,119";
      const dots = [], step = 0.52;
      for (let la = lat0; la <= lat1; la += step) for (let lo = lon0; lo <= lon1; lo += step / k) {
        if (!inPoly(lo, la, INDIA)) continue;
        const [x, y] = P(lo, la), a = Math.random() * Math.PI * 2, r = Math.max(W, H) * (0.5 + Math.random() * 0.6);
        dots.push({ x, y, sx: W / 2 + Math.cos(a) * r, sy: H / 2 + Math.sin(a) * r, d: Math.random() * 0.6, tw: Math.random() * Math.PI * 2 });
      }
      const H0 = P(hub[0], hub[1]);
      const arcs = targets.map((t, i) => {
        const B = P(t[0], t[1]), mx = (H0[0] + B[0]) / 2, my = (H0[1] + B[1]) / 2, dist = Math.hypot(B[0] - H0[0], B[1] - H0[1]);
        return { B, c: [mx, my - dist * 0.38], d: i * 0.12 };
      });
      const qp = (a, t) => {
        const u = 1 - t;
        return [u * u * H0[0] + 2 * u * t * a.c[0] + t * t * a.B[0], u * u * H0[1] + 2 * u * t * a.c[1] + t * t * a.B[1]];
      };
      const ease = (t) => (t < 0 ? 0 : t > 1 ? 1 : t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
      const T0 = performance.now(), CX = W / 2, CY = H * 0.42;
      const TA = 2.4, TB = 2.6, TBdur = 3.6, TC = 6.6, TCdur = 1.3;
      const frame = (now) => {
        if (!api.outroOn || !cv.isConnected) return;
        const t = (now - T0) / 1000;
        g.clearRect(0, 0, W, H);
        const gather = ease((t - TC) / TCdur);
        // map dots
        for (const p of dots) {
          const e = ease((t - p.d) / TA);
          let x = p.sx + (p.x - p.sx) * e, y = p.sy + (p.y - p.sy) * e;
          if (gather > 0) { x += (CX - x) * gather; y += (CY - y) * gather; }
          const tw = 0.55 + 0.45 * Math.sin(t * 2 + p.tw);
          g.globalAlpha = Math.min(1, e * 1.4) * (0.35 + 0.35 * tw) * (1 - gather * 0.6);
          g.fillStyle = `rgb(${rgbL})`;
          g.beginPath(); g.arc(x, y, 1.6, 0, 6.283); g.fill();
        }
        // arcs + travelling pulses
        if (t > TB && gather < 1) {
          g.globalCompositeOperation = "lighter";
          arcs.forEach((a) => {
            const pr = ease((t - TB - a.d) / 1.1);
            if (pr <= 0) return;
            g.globalAlpha = 0.75 * (1 - gather);
            g.strokeStyle = `rgba(${rgb},.9)`; g.lineWidth = 1.6; g.shadowBlur = 12; g.shadowColor = `rgb(${rgb})`;
            g.beginPath();
            for (let s2 = 0; s2 <= pr; s2 += 0.02) { const [x, y] = qp(a, s2); s2 === 0 ? g.moveTo(x, y) : g.lineTo(x, y); }
            g.stroke();
            if (pr >= 1) {
              const ph = ((t - TB - a.d) * 0.55) % 1, [px, py] = qp(a, ph);
              g.fillStyle = "#fff"; g.beginPath(); g.arc(px, py, 2.6, 0, 6.283); g.fill();
              const pulse = 4 + 3 * Math.sin(t * 4 + a.d * 10);
              g.fillStyle = `rgba(${rgbL},.9)`; g.beginPath(); g.arc(a.B[0], a.B[1], pulse, 0, 6.283); g.fill();
            }
          });
          g.shadowBlur = 0;
          g.globalCompositeOperation = "source-over";
        }
        // hub
        if (t > TB - 0.4) {
          const hp = Math.min(1, (t - TB + 0.4) / 0.6), hx = H0[0] + (CX - H0[0]) * gather, hy = H0[1] + (CY - H0[1]) * gather;
          const rr = 7 + 3 * Math.sin(t * 3) + gather * 30;
          const grd = g.createRadialGradient(hx, hy, 0, hx, hy, rr * 4);
          grd.addColorStop(0, "rgba(255,255,255,1)"); grd.addColorStop(0.25, `rgba(${rgb},.9)`); grd.addColorStop(1, `rgba(${rgb},0)`);
          g.globalAlpha = hp; g.fillStyle = grd; g.beginPath(); g.arc(hx, hy, rr * 4, 0, 6.283); g.fill();
        }
        g.globalAlpha = 1;
        if (t < TC + TCdur + 0.6) requestAnimationFrame(frame);
        else g.clearRect(0, 0, W, H);
      };
      requestAnimationFrame(frame);
      return { hubXY: H0 };
    }
    function outro() {
      if (api.running || api.outroOn) return;
      api.outroOn = true; api.outroEnd = false;
      if (activeCtx) { activeCtx.stop(); activeCtx = null; }
      Voice.stop();
      oTimers.forEach(clearTimeout); oTimers = [];
      const ct = C.company.contact || {}, O = C.outro || {};
      const tag = (INTRO.closing || "").split(".").filter((x) => x.trim()).map((x) => x.trim() + ".");
      const words = (t, base) => t.split(" ").map((w, i) => `<span class="ow"><span style="--w:${base + i}">${esc(w)}</span></span>`).join(" ");
      let dots = "";
      for (let i = 0; i < 70; i++) {
        const a = (i * 137.5) % 360, r = 300 + (i % 9) * 55;
        dots += `<i style="--sx:${(Math.cos(a * Math.PI / 180) * r).toFixed(0)}px;--sy:${(Math.sin(a * Math.PI / 180) * r * 0.62).toFixed(0)}px;--dl:${((i % 14) * 0.035).toFixed(2)}s"></i>`;
      }
      const R = 150, CIRC = (2 * Math.PI * R).toFixed(1);
      const chips = [[ct.phone, ICON.phone], [ct.website, ICON.doc], [ct.email, ICON.bell]].filter((x) => x[0])
        .map((x) => `<span>${x[1]}${esc(x[0])}</span>`).join("");
      box.innerHTML = `
        <div class="oc-bg"></div>
        <div class="oc-glow"></div>
        <div class="in-sparks">${sparks(30)}</div>
        <canvas class="oc-map"></canvas>
        <div class="oc-cap"><span class="dot"></span>${esc((C.outro && C.outro.mapLine) || "")}</div>
        <div class="oc-line"></div>
        <div class="oc-logo">${C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="${esc(C.company.name)}">` : `<b>${esc(C.company.shortName)}</b>`}<i class="oc-shine"></i></div>
        <div class="oc-tags">${tag.map((t, i) => `<div class="oc-tag" data-k="t${i}">${words(t, 0)}</div>`).join("")}</div>
        <div class="oc-build"><div class="oc-h">${words(O.headline || "Let's build together.", 0)}</div><div class="oc-chips">${chips}</div></div>
        <div class="oc-final">
          ${C.company.logoWhite ? `<img src="${esc(C.company.logoWhite)}" alt="">` : ""}
          <b>${esc(O.thanks || "Thank you.")}</b>
          <span>${esc(C.company.name)}</span>
          <em>Press any key to return</em>
        </div>
        ${fxLayers()}`;
      box.hidden = false; box.className = "outro";
      document.body.classList.add("outro-zoom");                 // the deck melts into the film
      void box.offsetWidth;
      const oc = (cls) => box.classList.add(cls);
      const off = (cls) => box.classList.remove(cls);
      const oat = (ms, fn) => oTimers.push(setTimeout(fn, ms));
      const say = (n) => { const t = (VO.outro || [])[n]; if (t) Voice.say("outro-" + (n + 1), t, { rate: 0.88 }); };
      [
        [30,    () => { oc("o-on"); SFX.whoosh(1.6, true); SFX.musicLevel(0.05, 1.5); runMap(box.querySelector(".oc-map")); }],
        [900,   () => SFX.shimmer()],
        [2600,  () => { oc("o-cap"); SFX.charge(); say(0); }],     // "From Haryana — powering India's electric journey."
        [5300,  () => SFX.riser(1.4)],
        [6600,  () => { oc("o-gather"); SFX.whoosh(1.2, true); }], // the whole map gathers into one point
        [7900,  () => { oc("o-line"); SFX.drop(); }],              // a line of light…
        [8400,  () => { oc("o-logo"); say(1); }],                  // …opens into the logo
        [9700,  () => { oc("o-up"); oc("o-t0"); }],
        [10500, () => oc("o-t1")],
        [11300, () => oc("o-t2")],
        [13400, () => { oc("o-build"); say(2); }],
        [17200, () => { oc("o-final"); SFX.shimmer(); SFX.musicLevel(0.02, 3); }],
        [18400, () => { api.outroEnd = true; }]
      ].forEach(([ms, fn]) => oat(ms, fn));
    }
    function outroKey() {
      if (!api.outroOn) return;
      if (!api.outroEnd) {                         // first key: jump to the final frame
        oTimers.forEach(clearTimeout); oTimers = [];
        Voice.stop();
        box.classList.add("o-on", "o-final", "fast"); api.outroEnd = true;
        SFX.musicLevel(0.02, 1);
        return;
      }
      // second key: the film fades back into the title slide
      box.classList.add("o-leave");
      document.body.classList.remove("outro-zoom");
      cur = -1; activeCtx = null; go(0);
      SFX.musicLevel(0.055, 2);
      setTimeout(() => { box.hidden = true; box.className = ""; box.innerHTML = ""; api.outroOn = false; api.outroEnd = false; }, 900);
    }
    api.outro = outro; api.outroKey = outroKey;
    box.addEventListener("click", () => { if (api.waiting) start(); else if (api.outroOn) outroKey(); else skip(); });
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
