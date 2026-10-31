"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SpotlightBackground } from "@/components/ui/spotlight-background";

const featuredProjects = [
  {
    title: "agent-harness",
    tags: ["Python", "MCP", "Approval Gates"],
    description: "Portable memory and code-graph toolkit for coding agents: an MCP server, bounded project memory with provenance rules and human review gates, and blast-radius analysis. Works with Claude Code, Codex, and Gemini. CI runs a 12-job matrix (3 OS \u00d7 4 Python) with pinned actions and OIDC releases.",
    href: "https://github.com/montjeffrey/agent-harness",
  },
  {
    title: "tailnet-sentry",
    tags: ["Go", "Tailscale API", "Defensive"],
    description: "Scan your own tailnet, mark known devices healthy, flag the anomaly, quarantine it. A defensive Go CLI over the Tailscale API.",
    href: "https://github.com/montjeffrey/tailnet-sentry",
  },
  {
    title: "landfirst",
    tags: ["Go", "TUI", "Git Internals"],
    description: "Which branch do I merge first? Compares git patch IDs instead of commit hashes, cutting false \u201cunlanded work\u201d reports from 2,073 to 45 on a real repo. Predicts conflicts with git merge-tree and never rewrites history.",
    href: "https://github.com/montjeffrey/landfirst",
  },
  {
    title: "compute-pool",
    tags: ["Go", "Tailscale", "Scheduling"],
    description: "Share CPU between your own devices over Tailscale: run commands on the least-loaded machine, fan out tasks, and watch it on a live dashboard.",
    href: "https://github.com/montjeffrey/compute-pool",
  },
];

import { DotBackground } from "@/components/ui/dot-background";

export default function FeaturedProjects() {
  return (
    <section className="relative py-20 px-6 bg-bg-elevated overflow-hidden">
      <DotBackground />
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: -80 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 1.0,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="text-4xl md:text-5xl font-serif text-secondary text-center mb-16"
        >
          Open-Source Builds
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {featuredProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                duration: 0.8,
                delay: index * 0.1,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="relative group rounded-2xl p-8 border transition-all duration-300 overflow-hidden
                backdrop-blur-xl bg-bg-elevated/60
                border-primary/30 hover:border-primary/60
                hover:bg-bg-elevated/40 hover:backdrop-blur-2xl
                shadow-lg shadow-primary/10 hover:shadow-primary/20"
            >
              {/* Glassmorphism overlay for depth */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  {project.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-xs px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <h3 className="text-2xl font-serif text-secondary font-bold mb-4">
                  {project.title}
                </h3>

                <p className="text-secondary/80 mb-6 leading-relaxed">
                  {project.description}
                </p>

                <a
                  href={project.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold group-hover:gap-4 transition-all duration-300"
                >
                  View on GitHub
                  <ArrowRight className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Projects Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.8,
            delay: 0.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-primary/10 backdrop-blur-sm group/button"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section >
  );
}

