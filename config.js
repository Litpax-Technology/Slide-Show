/* =========================================================
   LITPAX PITCH — CONFIG
   Edit everything here. No need to touch app.js.
   - Screenshots: put PNG/JPG files in the /screenshots folder
     with the exact file names used below. If a file is missing,
     a clean placeholder is shown automatically.
   - liveUrl: paste the app's link. Leave "" to hide the button.
   ========================================================= */

window.PITCH_CONFIG = {
  company: {
    name: "Litpax Technology Pvt. Ltd.",
    shortName: "LITPAX",
    logo: "assets/logo.png",
    logoWhite: "assets/logo-white.png",   // used on dark screens (intro, ambition)
    product: "assets/battery.png",        // real product photo on the title slide
    tagline: "Lithium Battery Manufacturing",
    location: "Haryana, India",
    about:
      "We manufacture lithium battery packs — and we run every step of the business on our own connected digital system. From your first enquiry to after-sales service, every order, every battery and every action is tracked.",
    contact: {
      phone: "1800-309-8399 (Toll-free)",   // as printed on the battery label — verify
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
    battery: "assets/battery.png",
    chargeLabel: "Litpax 74V · Charging",
    lines: ["Every call answered.", "Every battery tracked."],
    closing: "Our quality. Our commitment. Our future."
  },

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

  /* Demo animation behaviour on step slides
     - autoSwitch: after the "How it works" animation, show the real
       screenshot (only if that screenshot file exists), then repeat.
     - screenshotSeconds: how long the screenshot stays on screen.
     - Tip: a step's "shot" can also be a screen recording (.mp4 / .webm). */
  demo: { autoSwitch: true, screenshotSeconds: 6 },

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
  gallery: [
    { name: "Litpax ERP", shot: "screenshots/erp-login.png" },
    { name: "IMS", shot: "screenshots/ims-login.png" },
    { name: "SOMS", shot: "screenshots/soms-login.png" },
    { name: "Production Tracker", shot: "screenshots/plt-login.png" },
    { name: "Service Hub", shot: "screenshots/service-login.png" },
    { name: "Task Manager", shot: "screenshots/tasks-login.png" },
    { name: "Sales Lead Tracker", shot: "screenshots/lead-login.png" },
    { name: "Battery Exchange", shot: "screenshots/warranty-login.png" },
    { name: "Gate Pass", shot: "screenshots/gatepass-login.png" },
    { name: "R&D Tracker", shot: "screenshots/rnd-login.png" },
    { name: "Internal Portal", shot: "screenshots/portal.png" },
    { name: "Client Dashboard", shot: "screenshots/client-dashboard.png" }
  ],

  /* ---------- WHY LITPAX ---------- */
  why: [
    { t: "Full traceability", d: "Every battery's journey — material, station, employee, dispatch, service — on record." },
    { t: "Real-time visibility", d: "Live status of your order at any moment, not after a phone call." },
    { t: "Faster response", d: "Service calls, repairs and replacements run on defined timelines." },
    { t: "Accountability", d: "Every step has an owner and a deadline. Delays surface automatically." },
    { t: "Consistent quality", d: "Daily checks, plan vs achieved reviews and material reconciliation." },
    { t: "Built in-house", d: "Our own systems, shaped around our process — and improving every week." }
  ]
};
