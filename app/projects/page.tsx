"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import ProjectCard from "@/components/ProjectCard";
import { EvervaultBackground } from "@/components/ui/evervault-background";

const categories = ["All", "Web Development", "Data/ML", "Security Tools", "Automation"];

const projects = [
  {
    title: "Sports Analytics Parlay Generator",
    techStack: ["Python", "Random Forest", "ESPN API", "React", "JavaScript"],
    category: "Data/ML",
    status: "Live Application",
    description:
      "Real-time sports betting analytics platform leveraging machine learning to improve prediction accuracy. Integrates multiple data sources, implements recency bias algorithms, and delivers insights through an intuitive React interface.",
    features: [
      "Random Forest ML model with continuous accuracy improvements",
      "Real-time API integration with ESPN and SportsData.io",
      "Automated data cleaning and validation pipeline",
      "Responsive frontend with live prediction updates",
    ],
    href: "/projects/sports-analytics",
  },
  {
    title: "Levelz Barber Studio Website",
    techStack: ["HTML/CSS", "JavaScript", "Booksy API", "AWS Hosting"],
    category: "Web Development",
    status: "Live at levelzbarbershop.com",
    description:
      "Modern barbershop website with integrated booking system, improving customer acquisition and streamlining appointment management for a local business.",
    features: [
      "Direct Booksy API integration for real-time availability",
      "Mobile-first responsive design",
      "Custom CMS for staff content updates",
      "SEO optimization improving local search visibility",
    ],
    href: "/projects/levelz-barber-studio",
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
    title: "Law Firm CRM Integration System",
    techStack: ["Lawmatics", "Docketwise", "Python", "REST APIs"],
    category: "Automation",
    status: "Deployed (5000+ clients)",
    description:
      "Comprehensive data management system integrating multiple CRM/CMS platforms, improving lead quality by 60% and streamlining client communications.",
    features: [
      "Multi-system data synchronization",
      "Automated lead scoring and routing",
      "Document digitization workflow",
      "Financial integration with LawPay/QuickBooks",
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
