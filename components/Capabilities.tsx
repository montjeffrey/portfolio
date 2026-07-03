"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Workflow,
  Network,
  LayoutDashboard,
  Search,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const capabilities = [
  {
    title: "Business Process Automation",
    icon: Workflow,
    description:
      "Take repetitive, manual work — data entry, file handling, notifications, recurring reports — off your team's plate with automations that just run.",
  },
  {
    title: "Systems & Data Integration",
    icon: Network,
    description:
      "Connect disconnected tools — CRM, spreadsheets, billing, email — so your data stays in sync across platforms instead of being re-keyed by hand.",
  },
  {
    title: "Web Design & Development",
    icon: LayoutDashboard,
    description:
      "Fast, modern, responsive websites and web apps designed around how people actually use them — and built to convert.",
  },
  {
    title: "Local SEO & Performance",
    icon: Search,
    description:
      "Location-targeted pages, structured data, and Core Web Vitals that help local businesses get found and stay fast.",
  },
  {
    title: "Data, ML & Analytics",
    icon: BarChart3,
    description:
      "Turn raw, messy data into clean dashboards and predictive insight you can actually make decisions with.",
  },
  {
    title: "Cloud, Security & Deployment",
    icon: ShieldCheck,
    description:
      "Secure, production-grade hosting, hardening, and deployment so what gets built stays reliable and safe.",
  },
];

export default function Capabilities() {
  return (
    <section className="relative py-20 px-6 bg-bg-dark overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-4">
            What I Do
          </h2>
          <p className="text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            Not every project needs a name. Most of my work is a type of
            problem solved — here are the ways I help businesses run leaner and
            ship faster.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, index) => {
            const Icon = cap.icon;
            return (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                whileHover={{ y: -5 }}
                className="relative group rounded-2xl p-8 border transition-all duration-300 overflow-hidden
                  backdrop-blur-xl bg-bg-elevated/60
                  border-primary/30 hover:border-primary/60
                  hover:bg-bg-elevated/40
                  shadow-lg shadow-primary/10 hover:shadow-primary/20"
              >
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/15 border border-primary/30">
                      <Icon className="w-6 h-6 text-primary" />
                    </span>
                    <h3 className="text-xl font-serif text-secondary font-bold">
                      {cap.title}
                    </h3>
                  </div>
                  <p className="text-secondary/80 leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex justify-center mt-12"
        >
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:bg-primary/10 backdrop-blur-sm group/button"
          >
            <span>Start a project</span>
            <ArrowRight className="w-5 h-5 group-hover/button:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
