"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Search,
  Layers,
  ShieldCheck,
  BookOpen,
  MapPin,
  Baby,
  CalendarCheck,
  Heart,
} from "lucide-react";

export default function TheGenZMamaCaseStudy() {
  return (
    <div className="min-h-screen bg-bg-dark pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <h1 className="text-5xl md:text-6xl font-serif text-secondary mb-6">
            The Gen Z Mama — Childcare Website
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Web Development
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Live at thegenzmama.com
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed mb-8">
            A warm, conversion-minded site for a licensed, insured childcare
            provider serving Wharton, Dover, and the surrounding northern New
            Jersey area. Built to communicate trust at a glance and turn
            visiting parents into booked inquiries.
          </p>

          <a
            href="https://thegenzmama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            Visit Live Site
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6 flex items-center gap-3">
            <Layers className="w-8 h-8 text-primary" />
            Project Overview
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Challenge</h3>
              <p className="text-secondary/80 leading-relaxed">
                Parents choosing childcare decide on trust first. Most in-home
                and small-facility providers rely on a social page or a generic
                listing that can&apos;t convey credentials, pricing, or
                personality — and rarely surfaces in local search. The Gen Z
                Mama needed a real brand presence that felt personal and safe
                while clearly explaining care options and rates.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                A custom Next.js site organized around two clear care paths —
                facility-based and travel-to-home — each with its own pricing
                and details. A parenting blog fuels SEO and repeat visits, and a
                short &quot;Inquire for Care&quot; flow is the primary conversion
                path. Credentials are surfaced immediately: state license, CPR,
                First Aid / AED, insured, background-checked, and an ECE degree.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Approach</h3>
              <p className="text-secondary/80 leading-relaxed">
                Trust signals lead. Certifications and parent testimonials sit
                high on the page, care options and pricing are one tap away, and
                every page carries OpenGraph / Twitter metadata and optimized
                imagery so the site loads fast and shares cleanly. Content is
                structured for local search across the Wharton and Dover service
                area.
              </p>
            </div>
          </div>
        </motion.section>

        {/* What It Does */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            What It Does
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Two Care Paths",
                description:
                  "Distinct facility-based and travel-to-home offerings, each with its own pricing and details page so parents self-select quickly.",
                icon: Baby,
                metric: "Facility + travel care",
              },
              {
                title: "Trust Front-and-Center",
                description:
                  "State-licensed, insured, background-checked, CPR and First Aid / AED certified, with an ECE degree — surfaced where they drive the decision.",
                icon: ShieldCheck,
                metric: "Verifiable credentials",
              },
              {
                title: "Parenting Blog",
                description:
                  "A categorized \"Mommy Blog\" (activities, product reviews, parenting tips) that feeds SEO and gives parents a reason to return.",
                icon: BookOpen,
                metric: "Content-driven SEO",
              },
              {
                title: "Inquiry Funnel",
                description:
                  "A short \"Inquire for Care\" flow is the primary call-to-action across the site, turning interest into booked conversations.",
                icon: CalendarCheck,
                metric: "Low-friction lead capture",
              },
              {
                title: "Local Reach",
                description:
                  "Copy and metadata targeted to Wharton, Dover, and surrounding NJ towns to win nearby-search intent from local parents.",
                icon: MapPin,
                metric: "Wharton / Dover, NJ",
              },
              {
                title: "Fast & Shareable",
                description:
                  "Next.js image optimization plus OpenGraph / Twitter cards for quick loads and clean link previews when the site is shared.",
                icon: Heart,
                metric: "next/image + OG tags",
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                  className="bg-bg-elevated rounded-xl p-6 border border-primary/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold text-secondary">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-secondary/80 leading-relaxed mb-3">
                    {feature.description}
                  </p>
                  <div className="text-sm text-primary font-semibold">
                    {feature.metric}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Technical Stack */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6">Technical Stack</h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Tailwind CSS",
              "next/image",
              "OpenGraph Metadata",
              "Local SEO",
            ].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30 font-mono text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href="https://thegenzmama.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            Visit Live Site
            <ExternalLink className="w-5 h-5" />
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            Start a project
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
