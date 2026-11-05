// Single source for every resume variant on montjeffrey.dev/resume.
// Edit facts here, then run `npm run resumes` to rebuild public/resumes/*.pdf.
//
// Accuracy rules (match the site audit of 2026-11-05):
// - No metric that can't be shown from a repo, a log, or a document.
// - AWS is training only. Private repos are described, never linked.
// - compute-pool code signing is not claimed until SignPath accepts the project.

export const contact = {
  name: "Jeffrey Montoya",
  line: [
    "Dover, NJ",
    "(201) 841-9697",
    "montjeffrey@gmail.com",
    "linkedin.com/in/montjeffrey",
    "github.com/montjeffrey",
    "montjeffrey.dev",
  ],
};

// ---------- Experience ----------

const divine = {
  role: "Data Administrator (Systems & Automation)",
  org: "Divine Energy Solutions Inc.",
  place: "Dover, NJ",
  dates: "Dec 2025 – Present",
  blurb:
    "HVAC, insulation and weatherization contractor working NJ utility and clean-energy programs. Responsible for the company's IT, data and internal software, working directly with managers and leadership.",
  // [lead-in, text]: the lead-in renders bold so a multi-hat role scans quickly
  bullets: {
    it: ["IT & network", "Implemented and now run the company's network and IT infrastructure end to end: staff accounts and devices, technical implementation of new systems, and incident response."],
    crm: ["Internal platform", "Designed and deployed the production CRM (Next.js, TypeScript, Supabase/PostgreSQL): proposals and price books, scheduling, a technician field app, job closeout with photo evidence, and invoicing and receivables, behind role-based access and append-only audit logs."],
    crmShort: ["Internal platform", "Designed and deployed the company's production CRM, replacing fragmented program, customer and job tracking with one system for scheduling, proposals, job closeout, invoicing and payments."],
    outbox: ["Reliability", "Built exactly-once background processing (transactional outbox, idempotency keys, Redis/BullMQ), proven by a chaos test that SIGKILLs the worker mid-batch and finds zero duplicate or lost records; stuck or failed jobs alert immediately."],
    qbo: ["Secure integrations", "QuickBooks Online over OAuth 2.0 for invoice and payment sync, running as an unprivileged Docker worker with credentials mounted as secret files rather than environment variables."],
    migration: ["Migration", "Leading the move off Orcatec with cutover and back-out runbooks, a decommission checklist, and an integrity manifest for every job photo and file."],
    kpi: ["KPIs & incentives", "Work directly with managers to build the data pipelines behind their KPIs: Python and Playwright jobs reconcile Orcatec work against ADP hours with fuzzy matching, feeding the productivity and monthly incentive reports I deliver to leadership."],
    programs: ["Utility programs", "Prepare NJ Clean Energy and utility program submissions, validate intake against program rules, and sync program data between systems (Comfort Partners measure codes into Orcatec jobs, SnuggPro review stages into the CRM)."],
    sir: ["Energy modeling", "Built an Excel savings-to-investment ratio (SIR) calculator for PSE&G program jobs that follows New Jersey TRM (Technical Reference Manual) standards."],
    web: ["Brand & web", "Lead the company's branding, website redevelopment and local SEO."],
  },
};

const freelance = {
  role: "Freelance Developer & Consultant",
  org: "Self-employed",
  place: "Remote",
  dates: "Mar 2025 – Present",
  bullets: {
    sites:
      "Shipped and maintain production sites for three local businesses: elevatehrg.com (Next.js, county and city service pages, validated lead capture), thegenzmama.com (Next.js, TypeScript) and levelzbarberstudio.com (hand-coded static site with Booksy booking).",
    hardening:
      "Configured security headers and validated lead-form input on elevatehrg.com, and gate every Levelz pull request on Lighthouse CI Core Web Vitals budgets (LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1).",
    hosting:
      "Handle hosting, DNS, deployments, structured data and local SEO end to end.",
  },
};

const scheer = {
  role: "Legal Assistant / Administrative Marketing Assistant",
  org: "The Scheer Immigration Law Group",
  place: "Morristown, NJ",
  dates: "Nov 2022 – Feb 2025",
  bullets: {
    crm: "Administered Lawmatics (CRM) and Docketwise (CMS) across 1,000+ clients and 5,000+ records, keeping data consistent and audit-ready.",
    leads:
      "Built Excel pipelines that normalized lead data from each marketing partner into one tracking view, showing which sources produced qualified clients.",
    digitize:
      "Ran the digitization of sensitive client documents: reorganized the file system and kept a complete log of every document as it was scanned and secured.",
    network: "Maintained the office network, workstations and shared drives.",
    paymentsNetwork:
      "Processed payments in LawPay and QuickBooks, and maintained the office network, workstations and shared drives.",
    intake:
      "First point of contact for phone, email and in-person inquiries; ran structured client intakes in English and Spanish.",
    payments: "Processed payments and reconciled records in LawPay and QuickBooks.",
  },
};

const earlier = [
  {
    role: "Operations Manager",
    org: "CVS Health",
    place: "Rockaway, NJ",
    dates: "2020 – 2022",
    note: "Pharmacy systems support, Salesforce customer-experience cases, inventory audits and payroll reconciliation under HIPAA.",
  },
  {
    role: "Mentor / IT Support",
    org: "Dover College Promise, County College of Morris",
    place: "Dover, NJ",
    dates: "2019 – 2022",
    note: "Sole IT resource for the program's network, wireless and endpoints; mentored students in technical and professional skills.",
  },
  {
    role: "Team Lead",
    org: "Suttle & King",
    place: "NJ",
    dates: "2019",
    note: "B2B Verizon Business and SaaS sales, pipeline tracked in Salesforce.",
  },
];

// ---------- Projects ----------

const projects = {
  ecc: {
    name: "ECC upstream contributions",
    meta: "github.com/affaan-m/ECC · ~298k-star Claude Code toolkit",
    text: "14 merged pull requests: evaluation graders that check content and count only valid trials, prompt-time skill suggestions from an indexed registry, CI validation of plugin runtime closure, and Windows hook and test fixes.",
  },
  harness: {
    name: "agent-harness",
    meta: "Python, stdlib only, MCP · github.com/montjeffrey/agent-harness",
    text: "Portable memory and code-graph toolkit for coding agents (Claude Code, Codex, Gemini): an MCP server, bounded project memory with provenance rules, human review gates before any entry counts, and blast-radius analysis. 12-job CI matrix (3 OS × 4 Python versions), actions pinned to commit SHAs.",
  },
  sentry: {
    name: "tailnet-sentry",
    meta: "Go · github.com/montjeffrey/tailnet-sentry",
    text: "Defensive CLI over the Tailscale API: inventories your own tailnet, baselines known devices, flags anomalies and quarantines them, with a locked, append-only audit log. Releases ship six static binaries with SHA256SUMS and signed provenance attestations; CI scans dependencies for vulnerabilities and code for secrets.",
  },
  landfirst: {
    name: "landfirst",
    meta: "Go TUI · github.com/montjeffrey/landfirst",
    text: "Merge planner for repos with heavy parallel work. Comparing git patch IDs instead of commit hashes cut false \"unlanded work\" reports from 2,073 to 45 on a real repo; predicts conflicts with git merge-tree and never rewrites history or force-pushes.",
  },
  pool: {
    name: "compute-pool",
    meta: "Go, Tailscale · github.com/montjeffrey/compute-pool",
    text: "Shares CPU across your own devices over Tailscale, routing work to the least-loaded node with a live dashboard. Callers are identified with tailscale whois; the repo documents a threat model, runs CodeQL and OpenSSF Scorecard, and ships scripts to audit, check and then enforce Windows App Control for self-signed builds.",
  },
  sports: {
    name: "Sports analytics pipeline",
    meta: "Python, Flask, Celery, Redis, PostgreSQL · private",
    text: "Six-sport ingestion and nightly grading with a model-versus-market evaluation harness (Brier score against de-vigged odds, closing-line audit) that blocks publication when the model shows no measured edge.",
  },
  assessment: {
    name: "Web security assessment suite",
    meta: "Python · code not public",
    text: "Modular tester for IDOR, OAuth and open-redirect flaws, CSRF and session weaknesses, rate-limit bypass and XSS/CSP issues, with throttled requests and JSON and Markdown reports for technical and non-technical readers.",
  },
  rig: {
    name: "Security assessment lab",
    meta: "private",
    text: "Versioned assessment environment organized into five testing lanes, with an engagement template, runbooks for each tool, and pre-push checks that keep engagement data out of version control.",
  },
};

// ---------- Credentials ----------

const certs = {
  full: [
    "CompTIA Security+ (2026)",
    "Bugcrowd: accepted vulnerability finding",
    "Cisco CCNA: in progress · CompTIA CySA+: planned",
    "CompTIA A+ / Network+ / Security+ training, LasComp Institute of IT (2025)",
    "AWS Cloud Practitioner training, Skillsoft (9 courses, 2025)",
    "freeCodeCamp: Responsive Web Design; JavaScript Algorithms & Data Structures",
  ],
};

const education = [
  "New Jersey Institute of Technology: Electrical Engineering coursework (69 credits)",
  "County College of Morris: Business Administration coursework (finance)",
];

// ---------- Variants ----------

const d = divine.bullets;

export const variants = [
  {
    id: "technical",
    file: "technical.pdf",
    label: "Security & Infrastructure",
    headline: "Security-Minded Systems Engineer",
    summary:
      "I run IT, the network and the internal software for an NJ energy-efficiency contractor, and secure them as I build: least privilege, secrets kept out of the environment, and failure tested on purpose. CompTIA Security+, an accepted Bugcrowd finding, CCNA in progress. Bilingual English/Spanish. Open to hybrid or remote roles.",
    skills: [
      ["Security", "Least-privilege access, secrets management, OAuth 2.0, Postgres row-level security, OWASP web testing (IDOR, CSRF, XSS, open redirect), Kali Linux, Nmap, Wireshark, Metasploit"],
      ["Supply chain & CI", "GitHub Actions, actions pinned to commit SHAs, signed build provenance, vulnerability and secret scanning, CodeQL, OpenSSF Scorecard"],
      ["Infrastructure", "Linux, Windows Server, Docker (unprivileged workers), Tailscale, Azure, AWS (training: VPC, EC2, IAM, S3), DNS and hosting, TCP/IP, DHCP, VPN"],
      ["Languages", "Go, Python, TypeScript, SQL, JavaScript"],
      ["Data & backend", "PostgreSQL/Supabase, Redis/BullMQ, Celery, Next.js, Node.js, Playwright, REST APIs, webhooks, ETL"],
    ],
    experience: [
      { ...divine, bullets: [d.it, d.qbo, d.outbox, d.crm, d.kpi, d.programs, d.web] },
      { ...freelance, bullets: [freelance.bullets.sites, freelance.bullets.hardening, freelance.bullets.hosting] },
      { ...scheer, bullets: [scheer.bullets.digitize, scheer.bullets.crm, scheer.bullets.network] },
    ],
    earlier,
    projectsTitle: "Security & Open-Source Work",
    projects: [projects.sentry, projects.assessment, projects.rig, projects.pool, projects.harness, projects.landfirst, projects.ecc],
    certs: certs.full,
    education,
  },
  {
    id: "solutions-engineer",
    file: "solutions-engineer.pdf",
    label: "Systems & Automation",
    headline: "Systems & Automation Engineer",
    summary:
      "I turn messy business processes into reliable software: production CRM platforms, API integrations, ETL and job queues, plus the developer tooling around them. Comfortable between the people who run the business and the code that runs it. TypeScript, Python and Go; 14 merged pull requests to a widely used open-source Claude Code toolkit. Bilingual English/Spanish.",
    skills: [
      ["Languages", "TypeScript, Python, Go, SQL, JavaScript"],
      ["Data & backend", "PostgreSQL/Supabase, Redis/BullMQ, Celery, Next.js, Node.js, Flask, Playwright, REST APIs, OAuth 2.0, webhooks, ETL"],
      ["Platform & DevOps", "Docker, GitHub Actions CI/CD, Linux, Tailscale, Azure, AWS (training), Netlify, DNS"],
      ["AI tooling", "MCP servers, Claude Code / Codex / Gemini agents, evaluation harnesses, human-approval gates"],
      ["Business systems", "QuickBooks Online, Orcatec, ADP, Salesforce, Lawmatics, Docketwise, Microsoft 365, Google Workspace"],
    ],
    experience: [
      { ...divine, bullets: [d.crm, d.outbox, d.qbo, d.migration, d.kpi, d.programs, d.sir, d.it] },
      { ...freelance, bullets: [freelance.bullets.sites, freelance.bullets.hosting] },
      { ...scheer, bullets: [scheer.bullets.leads, scheer.bullets.crm, scheer.bullets.digitize] },
    ],
    earlier,
    projectsTitle: "Open Source & Projects",
    projects: [projects.ecc, projects.harness, projects.landfirst, projects.pool, projects.sports, projects.sentry],
    certs: certs.full,
    education,
  },
  {
    id: "general",
    file: "general.pdf",
    label: "IT & Operations",
    compact: true,
    headline: "IT, Data & Business Systems",
    summary:
      "IT and operations professional who runs the network, data and business systems for an NJ energy contractor: IT administration, KPI reporting for managers, utility program submissions and CRM administration. CompTIA Security+. Bilingual English/Spanish.",
    skills: [
      ["Business systems", "Lawmatics, Docketwise, Salesforce, QuickBooks Online, LawPay, ADP, Orcatec, Microsoft 365, Google Workspace"],
      ["Data & reporting", "Excel (lookups, pivots, validation), SQL, Python and Playwright automation, KPI dashboards, ETL between systems"],
      ["IT support", "Windows and Linux, networking (TCP/IP, DNS, DHCP, Wi-Fi), endpoints, shared drives and access control, website hosting and DNS"],
    ],
    experience: [
      { ...divine, bullets: [d.it, d.kpi, d.programs, d.sir, d.crmShort, d.web] },
      { ...scheer, bullets: [scheer.bullets.crm, scheer.bullets.intake, scheer.bullets.digitize, scheer.bullets.paymentsNetwork] },
      { ...freelance, bullets: [freelance.bullets.sites] },
    ],
    earlier: earlier.slice(0, 2),
    projectsTitle: null,
    projects: [],
    certs: [
      "CompTIA Security+ (2026) · Cisco CCNA in progress · freeCodeCamp (2 certifications)",
      "Training: CompTIA A+ / Network+ / Security+, LasComp Institute of IT (2025); AWS Cloud Practitioner, Skillsoft (2025)",
    ],
    education: ["Coursework: New Jersey Institute of Technology, Electrical Engineering (69 credits); County College of Morris, Business Administration"],
  },
];
