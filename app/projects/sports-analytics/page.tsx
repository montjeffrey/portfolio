"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Code2, Database, Zap } from "lucide-react";
import { ArchitectureDiagram } from "@/components/ui/architecture-diagram";

export default function SportsAnalyticsCaseStudy() {
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
            Sports Analytics Pipeline
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Data/ML
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Private research project
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            A six-sport ingestion and grading pipeline that scores its own model against the betting market, and refuses to publish a pick until the model has earned it.
          </p>
        </motion.div>

        {/* Project Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6">Project Overview</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Challenge</h3>
              <p className="text-secondary/80 leading-relaxed">
                A model that looks confident is easy to build. Knowing whether it actually beats the market, the hardest baseline there is, takes graded history, honest scoring, and a willingness to hear &quot;no.&quot;
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                A Flask, Celery, Redis, and PostgreSQL stack that ingests MLB, NFL, NBA, NHL, MLS, and EPL, grades every prop nightly from box scores, and compares model probabilities with de-vigged market prices before anything is published.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Approach</h3>
              <p className="text-secondary/80 leading-relaxed">
                Publication is gated on measured edge, not confidence. When the model can&apos;t show an edge in a market, that market falls back to market-priced, conservative picks, or to nothing at all.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Technical Architecture */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Database className="w-8 h-8 text-primary" />
            Technical Architecture
          </h2>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
            <ArchitectureDiagram />
          </div>
        </motion.section>

        {/* Key Technical Decisions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16 space-y-8"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Code2 className="w-8 h-8 text-primary" />
            Key Technical Decisions
          </h2>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20 space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Score against the market, not against zero</h3>
              <p className="text-secondary/80 leading-relaxed">
                Hit rate on its own flatters a model. Every prediction is scored with the Brier score next to the market&apos;s own de-vigged probability, and each published leg freezes its closing quote so closing-line value can be audited later.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Grading integrity before modeling</h3>
              <p className="text-secondary/80 leading-relaxed mb-4">
                Bad grades poison every metric downstream. Props on players who never appeared are voided, games stored with another game&apos;s box score are re-graded, and duplicate player identities are merged, each repair behind a dated database backup.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">Spend paid data deliberately</h3>
              <p className="text-secondary/80 leading-relaxed mb-4">
                Odds APIs bill per call. Free sources handle stats and scheduling, and only one explicit command chain is allowed to spend paid odds credits.
              </p>
            </div>

            {/* Code Highlight */}
            <div className="bg-bg-dark rounded-lg p-6 border border-primary/10">
              <h4 className="text-lg font-semibold text-secondary mb-4">Code Highlight</h4>
              <pre className="text-sm text-secondary/80 font-mono overflow-x-auto">
{`def publishable(market, evidence):
    """
    A market publishes model-priced legs only when graded,
    out-of-sample evidence says the model beats the market.
    """
    if evidence.model_brier >= evidence.market_brier:
        return Mode.MARKET_BLEND   # priced at the market, conservative tiers only
    return Mode.MODEL_EDGE`}
              </pre>
            </div>
          </div>
        </motion.section>

        {/* What it runs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            What It Runs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Sports Ingested", value: "6", desc: "MLB, NFL, NBA, NHL, MLS, EPL" },
              { label: "Grading", value: "Nightly", desc: "every prop graded from box scores" },
              { label: "Baseline", value: "Market", desc: "de-vigged odds, Brier-scored" },
              { label: "Publication", value: "Gated", desc: "on measured edge, not confidence" },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                className="bg-bg-elevated rounded-xl p-6 border border-primary/20 text-center"
              >
                <div className="text-4xl font-bold text-primary mb-2">{metric.value}</div>
                <div className="text-secondary font-semibold mb-1">{metric.label}</div>
                <div className="text-secondary/60 text-sm">{metric.desc}</div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
