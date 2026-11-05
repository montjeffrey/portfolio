"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { EvervaultBackground } from "@/components/ui/evervault-background";

const categories = ["All", "Open Source", "Security Tools", "Web Development", "Data/ML", "Automation"];

const projects = [
  {
    title: "agent-harness",
    techStack: ["Python", "MCP", "ONNX", "GitHub Actions"],
    category: "Open Source",
    status: "Open source",
    description:
      "Portable memory and code-graph toolkit for coding agents, stdlib-only. Gives Claude Code, Codex, and Gemini queryable code graphs and bounded project memory, with every memory entry held for human review before it counts.",
    features: [
      "Code graphs served over an MCP server",
      "Project memory with provenance rules and human review gates",
      "Blast-radius analysis joining memory to the code graph",
      "12-job CI matrix (3 OS × 4 Python), pinned actions, OIDC releases",
    ],
    href: "https://github.com/montjeffrey/agent-harness",
    ctaLabel: "View on GitHub",
    external: true,
  },
  {
    title: "tailnet-sentry",
    techStack: ["Go", "Tailscale API", "CLI"],
    category: "Open Source",
    status: "Open source",
    description:
      "Defensive Go CLI over the Tailscale API. Scan your own tailnet, mark known devices healthy, flag the anomaly, and quarantine it.",
    features: [
      "Inventory of every device on your tailnet",
      "Known-good baseline with anomaly flagging",
      "One-step quarantine of an unknown device",
      "Scoped to networks you own",
    ],
    href: "https://github.com/montjeffrey/tailnet-sentry",
    ctaLabel: "View on GitHub",
    external: true,
  },
  {
    title: "landfirst",
    techStack: ["Go", "TUI", "git merge-tree"],
    category: "Open Source",
    status: "Open source",
    description:
      "A live merge planner for repos with lots of parallel work: ranks branches by merge order, predicts conflicts between them, and knows about worktrees.",
    features: [
      "Patch-ID comparison cut false “unlanded work” from 2,073 to 45 on a real repo",
      "Conflict prediction with git merge-tree",
      "Worktree risk detection",
      "Guarded writes: never rewrites history or force-pushes",
    ],
    href: "https://github.com/montjeffrey/landfirst",
    ctaLabel: "View on GitHub",
    external: true,
  },
  {
    title: "compute-pool",
    techStack: ["Go", "Tailscale", "Dashboard"],
    category: "Open Source",
    status: "Open source",
    description:
      "Share CPU between your own devices over Tailscale: run a command on the least-loaded machine, fan out tasks, and watch the pool on a live dashboard.",
    features: [
      "Least-loaded routing across your devices",
      "Fan-out for batch tasks",
      "Live load dashboard",
      "Runs entirely inside your tailnet",
    ],
    href: "https://github.com/montjeffrey/compute-pool",
    ctaLabel: "View on GitHub",
    external: true,
  },
  {
    title: "Sports Analytics Pipeline",
    techStack: ["Python", "Flask", "Celery", "Redis", "PostgreSQL"],
    category: "Data/ML",
    status: "Private research project",
    description:
      "Six-sport ingestion and nightly grading pipeline with a model-versus-market evaluation harness. A pick only publishes when the model shows a measured edge over the market.",
    features: [
      "Ingests and grades MLB, NFL, NBA, NHL, MLS, and EPL",
      "Model scored against de-vigged market odds (Brier, closing-line audit)",
      "Publication gated on measured edge, not on confidence",
      "Grading-integrity repairs with dated database backups",
    ],
    href: "/projects/sports-analytics",
  },
  {
    title: "Elevate HRG — Contractor Website",
    techStack: ["Next.js", "React", "Tailwind CSS", "Motion", "GSAP", "Local SEO"],
    category: "Web Development",
    status: "Live at elevatehrg.com",
    description:
      "Conversion-focused website for a veteran-owned NJ exterior renovation contractor (roofing, windows, siding, gutters, doors, and insulation). Choreographed motion, a matrixed local-SEO page system, and structured data built to win local search and drive booked consultations.",
    features: [
      "Matrixed local-SEO system: county + city pages with unique copy",
      "LocalBusiness / RoofingContractor / Review JSON-LD schema",
      "Choreographed hero, sticky service stack, before/after sliders",
      "Short lead-capture form with validation and email delivery",
    ],
    href: "/projects/elevate-hrg",
  },
  {
    title: "Levelz Barber Studio Website",
    techStack: ["HTML/CSS", "JavaScript", "Booksy widget", "Netlify"],
    category: "Web Development",
    status: "Live at levelzbarberstudio.com",
    description:
      "Modern barbershop website with integrated booking system, improving customer acquisition and streamlining appointment management for a local business.",
    features: [
      "Embedded Booksy widget for live availability and online booking",
      "Mobile-first responsive design",
      "Service, barber and product pages built for the shop",
      "SEO optimization improving local search visibility",
    ],
    href: "/projects/levelz-barber-studio",
  },
  {
    title: "The Gen Z Mama — Childcare Website",
    techStack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Local SEO"],
    category: "Web Development",
    status: "Live at thegenzmama.com",
    description:
      "Brand-forward marketing site for a licensed, insured childcare provider in Wharton, NJ — facility-based and travel-to-home care, a parenting blog, and an inquiry funnel that turns visiting parents into booked care.",
    features: [
      "Facility and travel care paths, each with pricing and details",
      "Categorized parenting blog for SEO and repeat visits",
      "Local SEO with OpenGraph/Twitter metadata for nearby search",
      "Low-friction \"Inquire for Care\" lead funnel as the primary CTA",
    ],
    href: "/projects/the-gen-z-mama",
  },
  {
    title: "Automated Security Assessment Suite",
    techStack: ["Python", "JSON", "Markdown", "Wireshark"],
    category: "Security Tools",
    status: "Production Ready",
    description:
      "Python-based security testing framework that automates pentesting workflows and generates comprehensive, non-technical reports for stakeholder review.",
    features: [
      "Automated vulnerability scanning and logging",
      "JSON/Markdown report generation",
      "CVSS framework implementation",
      "Version-controlled security artifacts",
    ],
    href: "/projects/security-assessment",
  },
  {
    title: "Bug Bounty Research",
    techStack: ["Bugcrowd", "Web AppSec", "OAuth / SSO", "Secrets Exposure", "HTTP/CORS"],
    category: "Security Tools",
    status: "Bugcrowd Researcher",
    description:
      "Web-application security research on Bugcrowd across multiple public programs — secrets exposure, subdomain takeover / OAuth abuse, and auth and access-control flaws. One accepted finding plus additional reported research, all anonymized and within authorized scope.",
    features: [
      "Hardcoded API key in a public JS bundle → unauthorized API access",
      "Subdomain takeover enabling OAuth authorization-code interception",
      "User-ID disclosure via password-reset chained with username enumeration",
      "Reported across multiple public programs; coordinated disclosure, targets anonymized",
    ],
    href: "/projects/bug-bounties",
  },
  {
    title: "Law Firm Lead Tracking & Records",
    techStack: ["Excel", "Lawmatics", "Docketwise", "LawPay", "QuickBooks"],
    category: "Automation",
    status: "In production, 2022–2025",
    description:
      "Excel pipelines that pulled every marketing partner's leads into one tracking view, lifting lead quality 60%, plus a secured, fully logged digitization of sensitive client documents.",
    features: [
      "Partner lead data normalized into one tracking view",
      "Reorganized file system for scanned records",
      "Complete log of every sensitive document digitized",
      "Office network and CRM/CMS administration",
    ],
    href: "/projects/crm-integration",
  },
  {
    title: "Business Process Automation",
    techStack: ["Python", "REST APIs", "Webhooks", "Schedulers"],
    category: "Automation",
    status: "Ongoing client work",
    description:
      "Custom automations that take repetitive operational work — data entry, file handling, notifications, and recurring reports — off people's plates so small teams can run lean without adding headcount.",
    features: [
      "Event-driven triggers and scheduled jobs",
      "Automated data entry, validation, and cleanup",
      "Notification and alerting workflows",
      "Hands-off recurring report generation",
    ],
    href: "/contact",
    ctaLabel: "Start a project",
  },
  {
    title: "Systems & Data Integration",
    techStack: ["Python", "REST APIs", "SQL", "Webhooks"],
    category: "Automation",
    status: "Ongoing client work",
    description:
      "Connecting disconnected tools — CRMs, spreadsheets, billing, and email — into one synchronized flow so data stays consistent across platforms without manual copying or re-keying.",
    features: [
      "Two-way sync between business platforms",
      "API and webhook integrations",
      "De-duplication and a single source of truth",
      "Scheduled, monitored data pipelines",
    ],
    href: "/contact",
    ctaLabel: "Start a project",
  },
  {
    title: "Custom Web Apps & Internal Tools",
    techStack: ["Next.js", "React", "TypeScript", "Node.js"],
    category: "Web Development",
    status: "Ongoing client work",
    description:
      "Lightweight web apps and dashboards that put a clean, usable interface on top of messy data and manual processes — built to match how a business actually operates.",
    features: [
      "Custom dashboards and admin tools",
      "Form-driven internal workflows",
      "Role-based access and authentication",
      "Deployed and maintained in production",
    ],
    href: "/contact",
    ctaLabel: "Start a project",
  },
];

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((project) => project.category === activeFilter);

  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      {/* Hero Header with Evervault */}
      <div className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden mb-16">
        <EvervaultBackground className="absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-bg-elevated/50 backdrop-blur-md border border-primary/20 rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-6">
              Building Solutions That Matter
            </h1>
            <p className="text-lg md:text-xl text-secondary/80 leading-relaxed">
              From business automation and client websites to ML-powered analytics, explore work that pairs technical depth with real-world business impact — named projects and the everyday automations that keep businesses running.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Filter Pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeFilter === category
                ? "bg-primary text-bg-dark hover:bg-primary/90"
                : "bg-bg-elevated text-secondary/80 hover:bg-bg-elevated/80 border border-primary/20 hover:border-primary/40"
                }`}
              aria-label={`Filter projects by ${category}`}
              aria-pressed={activeFilter === category}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.title} {...project} index={index} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-secondary/60 text-lg">
              No projects found in this category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
