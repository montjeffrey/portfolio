"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { useState } from "react";

interface ProjectCardProps {
  title: string;
  techStack: string[];
  category: string;
  status: string;
  description: string;
  features: string[];
  href: string;
  index: number;
  /** Label for the card's call-to-action. Defaults to "View Case Study". */
  ctaLabel?: string;
  /** When true, the links open in a new tab (used for live-site/contact links). */
  external?: boolean;
}

export default function ProjectCard({
  title,
  techStack,
  category,
  status,
  description,
  features,
  href,
  index,
  ctaLabel = "View Case Study",
  external = false,
}: ProjectCardProps) {
  const externalLinkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.02, y: -5 }}
      className="relative group rounded-2xl p-8 border transition-all duration-300 overflow-hidden
        backdrop-blur-xl bg-bg-elevated/60
        border-primary/30 hover:border-primary/60
        hover:bg-bg-elevated/40 hover:backdrop-blur-2xl
        shadow-lg shadow-primary/10 hover:shadow-primary/20"
    >
      {/* Glassmorphism overlay for depth */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30">
                {category}
              </span>
              <span className="px-3 py-1 bg-secondary/10 text-secondary/80 text-xs rounded-full">
                {status}
              </span>
            </div>
            <h3 className="text-2xl font-serif text-secondary font-bold mb-2">
              {title}
            </h3>
          </div>
          <Link
            href={href}
            {...externalLinkProps}
            className="text-primary hover:text-primary/80 transition-colors"
            aria-label={external ? `Visit ${title}` : `View ${title} case study`}
          >
            <ExternalLink className="w-5 h-5" />
          </Link>
        </div>

        {/* Description */}
        <p className="text-secondary/80 leading-relaxed">{description}</p>

        {/* Tech Stack Marquee */}
        <div className="relative overflow-hidden rounded-lg bg-bg-dark/50 p-4 border border-primary/10">
          <div
            className={`flex gap-4 ${
              isHovered ? "animate-scroll" : ""
            }`}
          >
            {[...techStack, ...techStack].map((tech, i) => (
              <span
                key={`${tech}-${i}`}
                className="text-sm text-primary font-mono whitespace-nowrap"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Key Features */}
        <div>
          <h4 className="text-secondary font-semibold mb-3">Key Features:</h4>
          <ul className="space-y-2">
            {features.map((feature, i) => (
              <li
                key={i}
                className="text-secondary/70 text-sm flex items-start gap-2"
              >
                <span className="text-primary mt-1">•</span>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <Link
          href={href}
          {...externalLinkProps}
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold group/link transition-all duration-300"
          aria-label={`${ctaLabel} — ${title}`}
        >
          {ctaLabel}
          <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
        </Link>
      </div>
    </motion.div>
  );
}

