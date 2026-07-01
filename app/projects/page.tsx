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
    status: "Live at levelzbarberstudio.com",
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
              From ML-powered analytics to seamless business integrations, explore projects that showcase technical innovation meeting real-world needs.
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

