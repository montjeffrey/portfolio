"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { SpotlightBackground } from "@/components/ui/spotlight-background";

const featuredProjects = [
  {
    title: "Sports Analytics Parlay Generator",
    tags: ["Live Data", "ML-Powered", "API Connected"],
    description: "A full-stack application using Random Forest algorithms to analyze real-time sports data and generate intelligent betting recommendations with proven accuracy improvements.",
    href: "/projects/sports-analytics",
    type: "primary",
  },
  {
    title: "Levelz Barber Studio",
    tags: ["Mobile-First", "Booksy Integration", "Live Booking"],
    description: "A modern, responsive website with seamless appointment booking integration, improving customer engagement and streamlining business operations.",
    href: "/projects/levelz-barber-studio",
    type: "secondary",
  },
  {
    title: "The Gen Z Mama",
    tags: ["Next.js", "Local SEO", "Booking Funnel"],
    description: "A warm, mobile-first site for a licensed Wharton, NJ childcare provider \u2014 facility and travel care with pricing, a parenting blog for SEO, and a low-friction inquiry funnel, built on Next.js.",
    href: "/projects/the-gen-z-mama",
    type: "secondary",
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
          Featured Projects
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

                <Link
                  href={project.href}
                  className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-semibold group-hover:gap-4 transition-all duration-300"
                >
                  View Case Study
                  <ArrowRight className="w-5 h-5" />
                </Link>
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

