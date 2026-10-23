/* =========================================================
   LITPAX PITCH — CONFIG
   Edit everything here. No need to touch app.js.
   - Screenshots: put PNG/JPG files in the /screenshots folder
     with the exact file names used below. If a file is missing,
     a clean placeholder is shown automatically.
   - liveUrl: paste the app's link. Leave "" to hide the button.
   ========================================================= */

window.PITCH_CONFIG = {
  /* Colour theme: "brand" (Litpax Ember — logo colours), "volt" (EV green),
     "blue" (Electric Blue) or "indigo" (old). Preview any of them with ?theme=volt in the URL. */
  theme: "brand",

  company: {
    name: "Litpax Technology Pvt. Ltd.",
    shortName: "LITPAX",
    logo: "assets/logo.png",
    logoWhite: "assets/logo-white.png",   // used on dark screens (intro, ambition)
    productArt: { volt: "74V", cap: "36Ah" },   // labels on the animated battery (no photo used)
    tagline: "Lithium Battery Manufacturing",
    location: "Haryana, India",
    about:
      "We manufacture lithium battery packs — and we run every step of the business on our own connected digital system. From your first enquiry to after-sales service, every order, every battery and every action is tracked.",
    contact: {
      phone: "080 6985 9776 (Toll-free)",
      email: "",
      website: "www.litpaxtechnology.com",  // as printed on the battery label — verify
      address: "Haryana, India"
    }
  },

  /* ---------- TAGLINES (from the Litpax Workspace + Service Hub login pages) ---------- */
  taglines: {
    title: "Order to delivery, fully connected.",
    end: "Our quality. Our commitment. Our future."
  },

  /* ---------- CINEMATIC INTRO (plays when the deck opens; any key skips, "I" replays) ---------- */
  intro: {
    enabled: true,
    /* words that land on the beat (keep them short) */
    kinetic: ["Cells.", "Strips.", "BMS.", "Every station scanned.", "Every battery tracked.", "Zero compromise."],
    /* labels for the exploded battery, bottom layer first */
    layers: ["Base tray", "Lithium cells", "Nickel strips", "Smart BMS", "Litpax casing"],
    chargeLabel: "Litpax 74V · Charging",
    lines: ["Every call answered.", "Every battery tracked."],
    closing: "Our quality. Our commitment. Our future."
  },

  /* ---------- VOICE NARRATION (deep, calm male) ----------
     - Each line is spoken when its slide opens.
     - For a real studio voice, put MP3 files in assets/voice/ named after the key,
       e.g. assets/voice/intro-1.mp3, assets/voice/title.mp3, assets/voice/step-lead.mp3.
       If an MP3 exists it plays; otherwise the browser's best male voice reads the line
       (Microsoft Edge has the most natural one — "Prabhat").
     - Keys: M = sound on/off, A = auto-play (next slide after the voice ends). */
  voice: {
    enabled: true,
    autoAdvance: false,
    rate: 0.94,      // 0.9 – 1.0 sounds most natural
    pitch: 1,        // keep at 1 — lowering it makes browser voices sound muddy
    folder: "assets/voice/",
    outro: [
      "From Haryana... powering India's electric journey.",
      "Litpax Technology. Our quality. Our commitment. Our future.",
      "Let's build together."
    ],
    intro: [
      "Engineered... layer by layer.",
      "Built in-house. Tracked at every step.",
      "Every call answered. Every battery tracked.",
      "Our quality. Our commitment. Our future."
    ],
    lines: {
      "phase-Sell": "Chapter one. Sell.",
      "phase-Source": "Chapter two. Source.",
      "phase-Make": "Chapter three. Make.",
      "phase-Deliver": "Chapter four. Deliver.",
      "phase-Support": "Chapter five. Support.",
      "challenges": "Buying batteries shouldn't feel like a gamble. Inconsistent quality. No idea where your order is. Warranty arguments. Service calls that get lost. We built Litpax to fix exactly this.",
      "gains": "Every one of these problems is answered by a system — so you save time, see fewer defects, and get fast, fair replacements.",
      "why": "Why choose Litpax? Built in-house. Every battery traceable. Quality at every station. Your order, live. Your own sales and service CRM. And fair, fast warranty.",
      "crm": "And you are never talking to a stranger. Your Sales CRM owns your orders, from quotation to delivery. Your Service CRM owns every service call, until your vehicle is back on the road.",
      "track": "This is a real order inside our ERP. Every item is followed — from the moment you order, through production and billing, until it leaves our gate.",
      "versus": "Here is the difference, side by side. Where a typical supplier asks you to call and wait, we show you everything, live.",
      "products": "Our range covers two-wheeler packs, e-cycle and prismatic packs — with matched smart chargers.",
      "voices": "And here is what our customers say, in their own words.",
      "start": "Working with us is simple. Talk to us, we recommend the right pack, and from your very first order, you see everything live.",
      "title": "Welcome to Litpax Technology. Let us show you how our system runs — from order to delivery, fully connected.",
      "ambition": "Our goal is simple, and bold. Zero percent defect in manufacturing. One team. One goal. Every pack, right the first time.",
      "miles": "Every milestone has brought us closer to that goal.",
      "glance": "We build lithium battery packs in Haryana — and we run every part of our business on our own connected digital system.",
      "chain": "Five stages. Sixteen connected steps. Sell, source, make, deliver and support — all in one flow.",
      "step-lead": "Every enquiry becomes a tracked opportunity. No follow-up is missed.",
      "step-quote": "Quotations are ready in minutes, with GST applied automatically.",
      "step-dealer": "Every pin code is mapped to an authorised partner.",
      "step-order": "Once you place an order, it moves through our ERP — and every stage is visible.",
      "step-purchase": "Materials are ordered, tracked in transit, and received against every purchase order.",
      "step-inventory": "Stock is live — from raw material, to work in progress, to finished goods.",
      "step-production": "Every battery gets its own barcode — scanned at every station, along with the employee who built it.",
      "step-quality": "Before every shift, standard checks are completed and time-stamped.",
      "step-review": "Every day, every line: plan versus achieved. Gaps are caught the same day.",
      "step-recon": "Material issued is matched with batteries built. Variance is caught before it becomes loss.",
      "step-dispatch": "At dispatch, every battery is scanned against your order. Wrong model? Rejected instantly.",
      "step-logistics": "Shipments are tracked until they reach you.",
      "step-service": "When you call us, a ticket is created — and followed until it is solved.",
      "step-warranty": "Warranty replacements follow a clear, approved flow, with a complete audit trail.",
      "step-clientdash": "And you can see it all, live — your orders, service calls and repairs.",
      "step-feedback": "Your feedback goes straight to our management, and shapes how we improve.",
      "trace": "One barcode. Complete history. Where it was built, who built it, when it shipped — and every service since.",
      "fms": "Above it all runs our flow management system. Every step has an owner, and a deadline.",
      "control": "Our leadership sees the whole business on one screen — daily, and weekly.",
      "promise": "Because we don't just sell products. We sell service. Support. Trust. Uptime.",
      "end": "Let's build together. Litpax Technology — our quality, our commitment, our future."
    }
  },


  /* ---------- VALUE SLIDES (why the client should choose Litpax) ---------- */
  value: {
    challenges: {
      kicker: "The reality today",
      title: "Buying batteries shouldn't feel like a gamble.",
      sub: "These are the problems OEMs and dealers tell us about every week.",
      answer: "We built Litpax to fix exactly this.",
      items: [
        { t: "Inconsistent quality", d: "Two packs of the same model rarely perform the same." },
        { t: "No idea where the order is", d: "Status means calling the supplier again and again." },
        { t: "Warranty becomes an argument", d: "No record of the battery, so every claim is a debate." },
        { t: "Service calls get lost", d: "A complaint is noted on WhatsApp — and forgotten." },
        { t: "Vehicles stand idle", d: "Every day of downtime costs you and your customer." }
      ]
    },
    gains: {
      kicker: "What you get",
      title: "Every problem, answered by a system.",
      rows: [
        ["Calling for order status", "Live partner dashboard", "Your time saved"],
        ["No record of the battery", "Barcode history for every pack", "Instant root cause"],
        ["Quality checked only at the end", "Checks at every station, every shift", "Fewer defects"],
        ["Warranty disputes", "Rule-based exchange with audit trail", "Fast, fair replacement"],
        ["Service calls forgotten", "Ticket tracked until it is solved", "Less downtime"],
        ["Talking to whoever picks up", "Your own Sales CRM & Service CRM", "One person who knows you"]
      ]
    },
    crm: {
      kicker: "Your dedicated team",
      title: "Two people who own your account.",
      you: "You",
      youSub: "One call — always the right person",
      plant: "Plant · Production · Dispatch",
      sales: {
        role: "Sales CRM", title: "Your order partner",
        line: "Your single point of contact from quotation to delivery.",
        does: ["Quotes, orders and pricing", "Production and dispatch updates", "Delivery and documents follow-up", "Regular check-ins on your needs"]
      },
      service: {
        role: "Service CRM", title: "Your support partner",
        line: "Owns every service call until your vehicle is back on the road.",
        does: ["Logs every call as a ticket", "Arranges pickup and repair", "Tracks warranty replacements", "Calls back until it is solved"]
      }
    },
    whyKicker: "Why choose us",
    whyTitle: "Why choose Litpax.",
    track: {
      kicker: "Order tracking",
      title: "How we track your order.",
      sub: "This is a real order inside our ERP. Every item is followed from the moment you order until it leaves our gate.",
      shot: "screenshots/erp-track.png",
      bar: "Litpax ERP · Order tracking",
      note: "Real screen · customer details blurred",
      stages: [
        { t: "Order received", d: "Your order and dispatch plan are recorded, with an assigned CRM.", pos: 0 },
        { t: "Item-wise plan", d: "Each battery gets its own Item ID — produced, billed and dispatched counts per item.", pos: 0.33 },
        { t: "Production", d: "Actual start and completion date for every item, with delays flagged.", pos: 0.6 },
        { t: "Billing", d: "Invoice linked to each item ID.", pos: 0.73 },
        { t: "Dispatch", d: "Quantity, date, transport and LR number for every item.", pos: 0.86 }
      ]
    },
    versus: {
      kicker: "The difference",
      title: "Litpax vs a typical supplier.",
      them: "Typical supplier",
      rows: [
        ["Point of contact", "Whoever picks up the phone", "Dedicated Sales CRM & Service CRM"],
        ["Order status", "Call and wait", "Live dashboard, any time"],
        ["Battery history", "Not recorded", "Every station & employee, scanned"],
        ["Quality checks", "At the end, if at all", "At every station + daily checklist"],
        ["Dispatch accuracy", "Manual counting", "Every unit scanned against your order"],
        ["Service calls", "Lost in chats", "Ticket tracked until solved"],
        ["Warranty claims", "Back-and-forth", "Rule-based flow with audit trail"]
      ]
    },
    products: {
      kicker: "Our product range",
      title: "Packs for the way India moves.",
      heroLabel: "74V · 36Ah Lithium Ion",
      lines: [   // from the ERP / production lines — please verify before presenting
        { name: "2-Wheeler packs", desc: "Lithium ion packs for electric scooters and bikes.", specs: ["48V 32Ah", "60V 32Ah", "74V 40Ah", "74V 36Ah"] },
        { name: "E-Cycle packs", desc: "Lightweight packs built on a dedicated E-Cycle line.", specs: ["Custom configs"] },
        { name: "Prismatic packs", desc: "Prismatic-cell packs from our prismatic line.", specs: ["Custom configs"] },
        { name: "Smart chargers", desc: "Matched chargers for every pack we make.", specs: ["54V 8A", "67V 8A", "84V 8A"] }
      ]
    },
    start: {
      kicker: "Get started",
      title: "Working with us is simple.",
      steps: [
        { t: "Talk to us", d: "Call our toll-free number or send an enquiry." },
        { t: "We recommend", d: "We understand your vehicle and suggest the right pack." },
        { t: "First order", d: "Your Sales CRM is assigned and your live dashboard goes live." },
        { t: "Ongoing support", d: "Tracked delivery, service tickets and fair warranty." }
      ]
    }
  },

  /* ---------- TESTIMONIALS (real entries from the Customer Review form)
     Take each partner's permission before presenting their name. ---------- */
  testimonials: [
    { quote: "I had a great experience with Litpax. The battery quality is impressive, and the team is very supportive. Keep up the good work.", name: "Pankaj", place: "" },
    { quote: "Really happy with my experience with Litpax. Good product, professional support and a brand that focuses on customer satisfaction.", name: "Sahil", place: "" },
    { quote: "Best service.", name: "KPR Electric Vehicles", place: "Amritsar, Punjab" },
    { quote: "Lithium batteries saaf urja, behtar performance aur bharosemand power solutions ka bhavishya hain.", name: "Poonam", place: "Sirsa, Haryana" },
    { quote: "A great experience overall.", name: "Madhusudan", place: "" }
  ],

  /* ---------- AMBITION slide (Milestone 2027) ---------- */
  ambition: {
    kicker: "Milestone 2027",
    team: "One team · One goal",
    headline: "defect",
    headline2: "in manufacturing.",
    sub: "One team. One goal. Every pack, right the first time.",
    quote: "Your only limit is your mind.",
    values: ["Goal", "Vision", "Admire", "Support", "Team Work", "Performance", "Success"],
    closing: ["Our quality.", "Our commitment.", "Our future."]
  },

  /* ---------- MILESTONES timeline (slide appears only when this list has items) ----------
     Example:
     milestones: [
       { year: "2019", title: "Company founded", desc: "First lithium packs" },
       { year: "2022", title: "Second production hall" },
       { year: "2027", title: "0% defect", desc: "Milestone goal", goal: true }
     ], */
  milestones: [],

  /* ---------- THE LITPAX PROMISE slide (from the Service Hub login) ---------- */
  promise: {
    kicker: "The Litpax Promise",
    lead: "We don't just sell",
    strike: "products.",
    sell: "We sell",
    words: ["service.", "support.", "trust.", "uptime."],
    line: "Every call answered. Every battery tracked.",
    sub: "From the first ring to the final dispatch, one ticket keeps every customer in the loop.",
    flow: ["Call", "Service", "Repair", "Dispatch"]
  },

  /* Headline numbers on the "At a glance" slide — edit freely */
  stats: [
    { value: "20+", label: "In-house digital apps" },
    { value: "5", label: "Connected stages, Sell to Support" },
    { value: "Per-battery", label: "Barcode traceability" },
    { value: "Live", label: "Order visibility for partners" }
  ],

  phases: ["Sell", "Source", "Make", "Deliver", "Support"],
  /* one line per chapter divider */
  phaseLines: {
    Sell: "From the first enquiry to a confirmed order.",
    Source: "The right material, from the right vendor, at the right time.",
    Make: "Built, checked and reviewed — every battery, every day.",
    Deliver: "Scanned out against your order, tracked to your door.",
    Support: "With you long after delivery."
  },

  /* Background music: put a royalty-free track at this path to use it;
     if the file is missing, a soft cinematic track is generated in code. */
  music: "assets/music.mp3",
  musicVolume: 0.35,

  /* Closing film (plays after the last slide, or press E) */
  outro: {
    headline: "Let's build together.",
    thanks: "Thank you.",
    mapLine: "From Haryana — powering India's electric journey.",
    map: {
      hub: [76.6, 28.9],          // Rohtak, Haryana (lon, lat)
      /* unlabelled destination points for the light arcs (lon, lat) — edit freely */
      targets: [[74.9, 31.6], [75.8, 30.9], [75.1, 27.6], [72.6, 23.0], [73.8, 18.5], [77.6, 12.9], [78.5, 17.4], [80.9, 26.8], [85.8, 20.3], [88.4, 22.6], [91.7, 26.1]]
    }
  },

  /* Step slides: if a step's screenshot file exists it is shown directly;
     if not, the animated demo plays in its place. No tabs, no clicks.
     A step's "shot" can also be a screen recording (.mp4 / .webm). */

  /* ---------- THE CHAIN ---------- */
  steps: [
    {
      id: "lead", phase: "Sell",
      title: "Lead Capture",
      app: "Sales Lead Tracker",
      tagline: "Every enquiry becomes a tracked opportunity.",
      points: [
        "Multi-role access for the sales team",
        "Follow-up tasks with overdue alerts",
        "Complete lead history in one place"
      ],
      shot: "screenshots/lead.png", login: "screenshots/lead-login.png", liveUrl: ""
    },
    {
      id: "quote", phase: "Sell",
      title: "Quotation",
      app: "Quotation Maker",
      tagline: "Accurate, consistent quotes in minutes.",
      points: [
        "Products and prices from one central master",
        "GST applied automatically by item type",
        "Professional format, every single time"
      ],
      shot: "screenshots/quote.png", login: "", liveUrl: ""
    },
    {
      id: "dealer", phase: "Sell",
      title: "Dealer Network",
      app: "Dealer Onboarding & Authority Checker",
      tagline: "A verified partner for every pin code.",
      points: [
        "Digital onboarding with auto-generated agreement",
        "PIN code to authorised dealer mapping",
        "Customers always reach the right partner"
      ],
      shot: "screenshots/dealer.png", login: "", liveUrl: ""
    },
    {
      id: "order", phase: "Sell",
      title: "Order Booking",
      app: "Litpax ERP",
      tagline: "One system from order to delivery.",
      points: [
        "Customers, orders and items in a single ERP",
        "Order-wise production and dispatch status",
        "Sales performance dashboards"
      ],
      shot: "screenshots/erp.png", login: "screenshots/erp-login.png", liveUrl: ""
    },
    {
      id: "purchase", phase: "Source",
      title: "Purchase",
      app: "Store & Order Management (SOMS)",
      tagline: "Right material, right vendor, right time.",
      points: [
        "Vendor master and purchase orders",
        "Goods receipt (GRN) against every PO",
        "Transport and freight tracking"
      ],
      shot: "screenshots/soms.png", login: "screenshots/soms-login.png", liveUrl: ""
    },
    {
      id: "inventory", phase: "Source",
      title: "Inventory",
      app: "Inventory Management System (IMS)",
      tagline: "Live stock, from raw material to finished goods.",
      points: [
        "Raw material, WIP and finished goods tracked",
        "Dispatch validated against available stock",
        "Role-based access with live dashboards"
      ],
      shot: "screenshots/ims.png", login: "screenshots/ims-login.png", liveUrl: ""
    },
    {
      id: "production", phase: "Make",
      title: "Production & Traceability",
      app: "Production Line Tracker",
      tagline: "Every battery carries its own history.",
      points: [
        "Barcode on every battery, scanned at each station",
        "Employees log in by scanning their ID card",
        "Station-wise location and output in real time"
      ],
      shot: "screenshots/plt.png", login: "screenshots/plt-login.png", liveUrl: ""
    },
    {
      id: "quality", phase: "Make",
      title: "Quality Checks",
      app: "Daily Production Checklist",
      tagline: "Standard checks, every shift, every line.",
      points: [
        "Digital checklist instead of paper registers",
        "Every check is time-stamped and owned",
        "Missed checks are visible instantly"
      ],
      shot: "screenshots/checklist.png", login: "", liveUrl: ""
    },
    {
      id: "review", phase: "Make",
      title: "Daily Production Review",
      app: "Plan vs Achieved Board",
      tagline: "Plan vs achieved — every line, every day.",
      points: [
        "Line-wise daily target vs actual output",
        "Replaces the physical review whiteboard",
        "Gaps caught the same day, not at month-end"
      ],
      shot: "screenshots/review.png", login: "", liveUrl: ""
    },
    {
      id: "recon", phase: "Make",
      title: "Material Reconciliation",
      app: "Material vs Production",
      tagline: "Material issued always matches output.",
      points: [
        "Daily side-by-side: material issued vs units built",
        "BOM-based consumption check",
        "Variance spotted before it becomes loss"
      ],
      shot: "screenshots/recon.png", login: "", liveUrl: ""
    },
    {
      id: "dispatch", phase: "Deliver",
      title: "Dispatch",
      app: "Dispatch Barcode Scanner",
      tagline: "Every battery scanned out against its order.",
      points: [
        "Scan per order ID with model and quantity",
        "No wrong model, no short shipment",
        "Dispatch log shared instantly with accounts"
      ],
      shot: "screenshots/dispatch.png", login: "", liveUrl: ""
    },
    {
      id: "logistics", phase: "Deliver",
      title: "Logistics",
      app: "Courier & Logistics Tracker",
      tagline: "Shipments tracked until they reach you.",
      points: [
        "Zone and weight-slab based freight",
        "Inward and outward shipment records",
        "Courier billing reconciliation"
      ],
      shot: "screenshots/courier.png", login: "", liveUrl: ""
    },
    {
      id: "service", phase: "Support",
      title: "After-Sales Service",
      app: "Service Hub & Field Technician App",
      tagline: "Fast, accountable service response.",
      points: [
        "Service calls and repairs in one unified hub",
        "Item-level repair tracking",
        "Field technicians raise and close tickets on the go"
      ],
      shot: "screenshots/service.png", login: "screenshots/service-login.png", liveUrl: ""
    },
    {
      id: "warranty", phase: "Support",
      title: "Warranty Exchange",
      app: "Battery Exchange Tracker",
      tagline: "Transparent, rule-based replacements.",
      points: [
        "Defined status flow for every replacement",
        "Role-based approvals and routing",
        "Complete audit trail per battery"
      ],
      shot: "screenshots/warranty.png", login: "", liveUrl: ""
    },
    {
      id: "clientdash", phase: "Support",
      title: "Partner Live Dashboard",
      app: "Client Dashboard",
      tagline: "Your orders, live — anytime.",
      points: [
        "Orders pending, in progress and dispatched",
        "Service calls and repair status",
        "Private secure link, no login needed"
      ],
      shot: "screenshots/client-dashboard.png", login: "", liveUrl: ""
    },
    {
      id: "feedback", phase: "Support",
      title: "Customer Feedback",
      app: "Customer Review",
      tagline: "Your voice shapes our process.",
      points: [
        "Ratings for product, production and service",
        "Suggestions reviewed by management",
        "A continuous improvement loop"
      ],
      shot: "screenshots/review-form.png", login: "", liveUrl: ""
    }
  ],

  /* ---------- FMS LAYER ---------- */
  fms: {
    shot: "screenshots/fms.png",
    liveUrl: "",
    flows: [
      "Purchase Order",
      "Order → Production",
      "Production → Production",
      "Production → Dispatch",
      "Dispatch → Delivery"
    ],
    points: [
      "Every step has an owner and a planned time (TAT)",
      "Delays are flagged automatically — nothing gets lost",
      "One unified view of pending and overdue work"
    ]
  },

  /* ---------- MANAGEMENT CONTROL ---------- */
  control: [
    { name: "Owner Dashboard", desc: "Sales, production, service and payments on one screen", shot: "screenshots/owner-dashboard.png" },
    { name: "Weekly Owner Report", desc: "Cross-app weekly snapshot with anomalies highlighted", shot: "screenshots/weekly-report.png" },
    { name: "Task Manager", desc: "Team tasks with weekly performance scoring", shot: "screenshots/tasks.png" },
    { name: "Unified FMS Dashboard", desc: "Pending and overdue steps across every flow", shot: "screenshots/fms-dashboard.png" }
  ],

  /* ---------- APP GALLERY (login pages / home screens) ---------- */
  gallery: [],   // app family slide hidden — add apps here to show it again

  /* ---------- WHY LITPAX ---------- */
  why: [
    { t: "Built in-house, in Haryana", d: "Packs are assembled and tested in our own plant — not traded, not outsourced." },
    { t: "Every battery traceable", d: "Each pack carries a barcode history: stations, employees, dispatch and service." },
    { t: "Quality at every station", d: "Scans, daily checklists and plan-vs-achieved reviews — chasing a 0% defect goal." },
    { t: "Your order, live", d: "A private dashboard shows your orders, service calls and repairs — no follow-up calls." },
    { t: "Your own Sales & Service CRM", d: "Two named people own your account — one for orders, one for service. No call goes unanswered." },
    { t: "Fair, fast warranty", d: "Replacements follow a clear approved flow with a full audit trail — no arguments." }
  ]
};
