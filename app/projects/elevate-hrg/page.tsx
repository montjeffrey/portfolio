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
  Gauge,
  MapPin,
  Code2,
} from "lucide-react";

export default function ElevateHRGCaseStudy() {
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
            Elevate HRG — Contractor Website
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Web Development
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Live at elevatehrg.com
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed mb-8">
            A conversion-focused marketing site for a veteran-owned exterior
            renovation contractor in Wallington, NJ — roofing, windows, siding,
            gutters, entry doors, and attic insulation. Built to win local
            search and turn visitors into booked consultations.
          </p>

          <a
            href="https://elevatehrg.com"
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
                Home-services contractors mostly compete on templated, look-alike
                sites that rank poorly and bury the phone number. Elevate HRG
                needed a site that reflected a 25+ year, certified operation and
                competed for local search across a wide northern/central New
                Jersey service area — without looking like every other roofer.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                A custom Next.js build with a matrixed local-SEO page system
                (county and city pages with genuinely unique copy), full
                structured data, choreographed motion, and a short, friction-free
                lead-capture flow. Click-to-call stays visible in the header and
                a sticky mobile bar so the next step is always one tap away.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Approach</h3>
              <p className="text-secondary/80 leading-relaxed">
                Trust signals are real and front-and-center — GAF and ProVia
                certifications, BBB accreditation, license number, and
                first-party reviews — wired into JSON-LD so they are eligible for
                rich results. Performance and accessibility are enforced in CI
                rather than left to chance.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Key Features */}
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
                title: "Matrixed Local SEO",
                description:
                  "Top-level service-areas hub with county and city pages, each carrying mostly unique copy targeted to that location — built to rank across a multi-county service area.",
                icon: MapPin,
                metric: "County + city page system",
              },
              {
                title: "Structured Data",
                description:
                  "LocalBusiness, RoofingContractor, and Review JSON-LD so search engines understand the business, services, and first-party reviews.",
                icon: Code2,
                metric: "Rich-result ready schema",
              },
              {
                title: "Choreographed UX",
                description:
                  "Parallax, pinned-scrub hero, a sticky service card stack, and before/after sliders — deliberate motion that sets the brand apart from template builds.",
                icon: Layers,
                metric: "Motion + GSAP + Lenis",
              },
              {
                title: "Lead Capture",
                description:
                  "A short default form (name, phone, service, ZIP) with a multi-step quote flow, server-side validation, and transactional email delivery.",
                icon: ArrowRight,
                metric: "Validated, low-friction intake",
              },
              {
                title: "Trust Signals",
                description:
                  "GAF certified, ProVia authorized, BBB accredited, licensed, veteran-owned, and a 5.0 review rating — surfaced where they drive conversions.",
                icon: ShieldCheck,
                metric: "Real, verifiable credentials",
              },
              {
                title: "Performance Budget",
                description:
                  "Core Web Vitals and accessibility tracked with Lighthouse CI so speed and a11y stay in spec as the site grows.",
                icon: Gauge,
                metric: "Lighthouse CI in pipeline",
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
              "Motion",
              "GSAP",
              "Lenis",
              "JSON-LD Schema",
              "Lighthouse CI",
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
            href="https://elevatehrg.com"
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
