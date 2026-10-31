"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Database, TrendingUp, Network, FileText, DollarSign } from "lucide-react";

export default function CRMIntegrationCaseStudy() {
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
            Law Firm Lead Tracking &amp; Records
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Automation
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              In production, 2022–2025
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            Spreadsheet pipelines that pulled every marketing partner&apos;s leads into one tracking view, a secured and fully logged digitization of sensitive client documents, and the office network underneath it all, for an immigration law firm with 1,000+ clients.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Project Overview
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Challenge</h3>
              <p className="text-secondary/80 leading-relaxed">
                Leads arrived from several marketing partners, each in its own format, with no single view of which source produced clients worth keeping. Thousands of sensitive paper documents also had to become digital without losing track of a single one.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Built Excel pipelines that normalized each partner&apos;s lead data into one tracking sheet, organized the firm&apos;s file system for scanned records, and kept a complete log of every sensitive document as it was scanned and secured. I also maintained the office network and the Lawmatics and Docketwise records the team worked from.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Impact</h3>
              <p className="text-secondary/80 leading-relaxed">
                Lead tracking by source fed a 60% improvement in lead quality, and every digitized document is accounted for in the log. 5,000+ client records were kept consistent, with payments reconciled through LawPay and QuickBooks.
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
            <TrendingUp className="w-8 h-8 text-primary" />
            What I Built
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Partner Lead Pipelines",
                description: "Excel pipelines that pulled lead data from each marketing partner, normalized it to one format, and fed a single tracking view of which sources produced qualified clients.",
                icon: TrendingUp,
                metric: "60% lead quality improvement",
              },
              {
                title: "Secured Document Digitization",
                description: "A reorganized file system for scanned records and a complete log of every sensitive document as it was scanned and secured, so nothing went missing in the move from paper.",
                icon: FileText,
                metric: "Every document logged",
              },
              {
                title: "Office Network & Systems",
                description: "Maintained the office network and connectivity, and administered Lawmatics (CRM) and Docketwise (CMS) records for the legal team.",
                icon: Network,
                metric: "5,000+ records maintained",
              },
              {
                title: "Payments & Reconciliation",
                description: "Handled client payments and financial records in LawPay and QuickBooks, keeping the books aligned with case records.",
                icon: DollarSign,
                metric: "LawPay + QuickBooks",
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
                    <h3 className="text-xl font-semibold text-secondary">{feature.title}</h3>
                  </div>
                  <p className="text-secondary/80 leading-relaxed mb-3">{feature.description}</p>
                  <div className="text-sm text-primary font-semibold">{feature.metric}</div>
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
            {["Excel", "Lawmatics", "Docketwise", "LawPay", "QuickBooks", "Office Networking"].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30 font-mono text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
