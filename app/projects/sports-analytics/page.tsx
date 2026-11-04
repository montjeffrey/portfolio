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
            Sports Analytics Parlay Generator
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Data/ML
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Personal project · in progress
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            A full-stack application using Random Forest algorithms to analyze real-time sports data and generate intelligent betting recommendations with proven accuracy improvements.
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
                Sports betting relies heavily on intuition and basic statistics, leading to poor prediction rates and financial losses for casual bettors.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Developed a full-stack application that applies machine learning to real-time sports data, providing data-driven betting recommendations with measurably improved accuracy.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Impact</h3>
              <p className="text-secondary/80 leading-relaxed">
                Reduced prediction error rate by 35% compared to baseline statistical models while providing plain-language explanations for general audiences.
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
              <h3 className="text-xl font-semibold text-secondary mb-3">Why Random Forest?</h3>
              <p className="text-secondary/80 leading-relaxed">
                After testing multiple ML approaches, Random Forest provided the best balance of accuracy and interpretability. The ensemble method reduced overfitting while handling the complex, non-linear relationships in sports data.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-3">API Integration Strategy</h3>
              <p className="text-secondary/80 leading-relaxed mb-4">
                Implemented a robust data pipeline that merges multiple sources (ESPN for stats, SportsData.io for injuries) with smart caching to minimize API costs while maintaining real-time relevance.
              </p>
            </div>

            {/* Code Highlight */}
            <div className="bg-bg-dark rounded-lg p-6 border border-primary/10">
              <h4 className="text-lg font-semibold text-secondary mb-4">Code Highlight</h4>
              <pre className="text-sm text-secondary/80 font-mono overflow-x-auto">
{`def generate_prediction(team_data, injury_report, recent_games):
    """
    Core prediction logic using ensemble learning
    with recency bias and injury impact factors
    """
    features = engineer_features(team_data, injury_report)
    weighted_recent = apply_recency_bias(recent_games)
    prediction = model.predict_proba(features, weighted_recent)
    return format_user_friendly(prediction)`}
              </pre>
            </div>
          </div>
        </motion.section>

        {/* Results & Metrics */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Zap className="w-8 h-8 text-primary" />
            Results & Metrics
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Prediction Accuracy Improvement", value: "35%", desc: "over baseline" },
              { label: "Real-time Processing", value: "100+", desc: "games daily" },
              { label: "User Satisfaction", value: "87%", desc: "based on explanations" },
              { label: "Architecture", value: "Scalable", desc: "supporting concurrent users" },
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

