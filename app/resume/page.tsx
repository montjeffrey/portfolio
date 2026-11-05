"use client";

import { motion } from "framer-motion";
import { FileText, Download, Eye } from "lucide-react";
import { resumePath, resumeVariants, type ResumeVariant } from "@/lib/resumes";

const coreCompetencies = [
  "Security by default: least privilege, secrets out of the environment, failure tested on purpose",
  "Systems & automation: CRM platforms, integrations, ETL and job queues in production",
  "Infrastructure: Linux, Docker, Tailscale, CI/CD with pinned actions and signed releases",
  "Data integrity: validation, reconciliation and audit-ready records across business systems",
  "Communication: bilingual English/Spanish, clear writing for technical and non-technical readers",
];

import { EvervaultBackground } from "@/components/ui/evervault-background";

export default function ResumeHubPage() {
  const handleDownload = (resume: ResumeVariant, action: "view" | "download") => {
    const pdfPath = resumePath(resume.id);

    if (action === "download") {
      const link = document.createElement("a");
      link.href = pdfPath;
      link.download = resume.downloadName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(pdfPath, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      {/* Hero Header with Evervault */}
      <div className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden mb-16">
        <EvervaultBackground className="absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-bg-elevated/50 backdrop-blur-md border border-primary/20 rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-6">
              Resume Hub
            </h1>
            <p className="text-lg md:text-xl text-secondary/80 leading-relaxed">
              Tailored Resumes for Different Opportunities
            </p>
            <p className="text-base md:text-lg text-secondary/60 mt-4">
              I maintain specialized versions of my resume to best match different role requirements. Select the version that aligns with your needs:
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* Resume Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {resumeVariants.map((resume, index) => {
            const Icon = resume.icon;
            return (
              <motion.div
                key={resume.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="bg-bg-elevated rounded-2xl p-8 border border-primary/20 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-6">
                  <Icon className={`w-10 h-10 ${resume.color}`} />
                  <h2 className="text-2xl font-serif text-secondary font-bold">
                    {resume.title}
                  </h2>
                </div>

                <p className="text-secondary/80 mb-6 leading-relaxed">
                  {resume.description}
                </p>

                <div className="mb-6">
                  <h3 className="text-secondary font-semibold mb-3">Highlights:</h3>
                  <ul className="space-y-2">
                    {resume.highlights.map((highlight, i) => (
                      <li key={i} className="text-secondary/70 text-sm flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleDownload(resume, "view")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-transparent border border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View PDF
                  </button>
                  <button
                    onClick={() => handleDownload(resume, "download")}
                    className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Core Competencies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-bg-elevated rounded-2xl p-8 md:p-12 border border-primary/20 mb-12"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Across Every Version
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {coreCompetencies.map((competency, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-primary mt-1">•</span>
                <span className="text-secondary/80 leading-relaxed">{competency}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-8 border-t border-primary/20">
            <p className="text-secondary/80 leading-relaxed mb-4">
              <strong className="text-secondary">Need a custom version?</strong>{" "}
              <a
                href="/contact"
                className="text-primary hover:text-primary/80 transition-colors underline"
              >
                Contact me
              </a>{" "}
              for a tailored resume highlighting specific experiences relevant to your opportunity.
            </p>
          </div>
        </motion.section>

        {/* Quick Access */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-secondary/60 text-lg mb-6">
            All resumes are available in PDF format and can be downloaded or viewed directly in your browser.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            Request Custom Resume
          </a>
        </motion.div>
      </div>
    </div>
  );
}

