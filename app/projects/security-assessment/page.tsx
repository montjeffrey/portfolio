"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Terminal, Shield, FileCode, Lock } from "lucide-react";

export default function SecurityAssessmentCaseStudy() {
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
            Automated Security Assessment Suite
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Security Tools
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Code not public
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed">
            Python-based security testing framework that automates pentesting workflows and generates comprehensive, non-technical reports for stakeholder review.
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
            <Shield className="w-8 h-8 text-primary" />
            Project Overview
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Challenge</h3>
              <p className="text-secondary/80 leading-relaxed">
                Manual security assessments are time-consuming, prone to human error, and generate technical reports that are difficult for non-technical stakeholders to understand.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-secondary mb-2">Solution</h3>
              <p className="text-secondary/80 leading-relaxed">
                Developed an automated Python framework that streamlines pentesting workflows, performs vulnerability scans, and generates comprehensive reports in both technical and non-technical formats.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Illustrative Output */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Terminal className="w-8 h-8 text-primary" />
            Illustrative output
          </h2>

          <div className="bg-bg-dark rounded-lg p-6 border border-primary/20 font-mono text-sm">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="ml-4 text-secondary/60">security-assessor.py</span>
            </div>
            <pre className="text-secondary/80 overflow-x-auto whitespace-pre-wrap">
{`$ python security-assessor.py --target lab.local --format json

[+] Initializing security assessment suite...
[+] Loading vulnerability database... OK
[+] Starting network reconnaissance...
[+] Performing port scan... OK

[!] VULNERABILITY FOUND
    Type: Open SSH Port
    Severity: MEDIUM
    CVSS Score: 5.3
    Description: SSH service detected on port 22
    Recommendation: Implement key-based authentication only

[i] NOTE
    Type: SSL Certificate Expiry
    Severity: LOW
    Description: SSL certificate expires in 30 days
    Recommendation: Schedule certificate renewal

[+] Generating reports...
[+] JSON report saved: security_report.json
[+] Markdown report saved: security_report.md
[+] Executive summary saved: executive_summary.pdf

[+] Assessment complete. Found 1 vulnerability, 1 note.
[+] Total scan time: 2m 34s`}
            </pre>
          </div>
        </motion.section>

        {/* Key Features */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Lock className="w-8 h-8 text-primary" />
            Key Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Automated Vulnerability Scanning",
                description: "Automated scanning and logging of security vulnerabilities across network infrastructure",
                icon: Terminal,
              },
              {
                title: "Multi-Format Reports",
                description: "Generate JSON/Markdown reports for technical teams and executive summaries for stakeholders",
                icon: FileCode,
              },
              {
                title: "CVSS Framework Integration",
                description: "Implements Common Vulnerability Scoring System for standardized risk assessment",
                icon: Shield,
              },
              {
                title: "Version Control Support",
                description: "Version-controlled security artifacts for tracking remediation progress over time",
                icon: Lock,
              },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="bg-bg-elevated rounded-xl p-6 border border-primary/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold text-secondary">{feature.title}</h3>
                  </div>
                  <p className="text-secondary/80 leading-relaxed">{feature.description}</p>
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
            {["Python", "JSON", "Markdown", "Wireshark"].map((tech, i) => (
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

