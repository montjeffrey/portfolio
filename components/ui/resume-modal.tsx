"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Download, FileText, Code2, Newspaper } from "lucide-react";
import { useState } from "react";

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const resumeOptions = [
  {
    id: "technical",
    title: "Technical Resume",
    description: "For Software Development, Cloud Engineering, DevOps roles",
    icon: Code2,
    color: "text-blue-400",
  },
  {
    id: "general",
    title: "General Resume",
    description: "For Business Analysis, Project Management, Operations roles",
    icon: Newspaper,
    color: "text-green-400",
  },
];

export function ResumeModal({ isOpen, onClose }: ResumeModalProps) {
  const handleDownload = (resumeId: string) => {
    const pdfPath = `/resumes/${resumeId}.pdf`;
    const link = document.createElement("a");
    link.href = pdfPath;
    link.download = `${resumeId}-resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-2xl bg-bg-elevated rounded-2xl border border-primary/30 shadow-2xl shadow-primary/20 p-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-secondary/60 hover:text-secondary transition-colors"
                aria-label="Close resume selection modal"
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    onClose();
                  }
                }}
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>

              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-8 h-8 text-primary" />
                  <h2 className="text-3xl font-serif text-secondary font-bold">
                    Choose Your Resume
                  </h2>
                </div>
                <p className="text-secondary/80">
                  Select the resume version that best matches your needs:
                </p>
              </div>

              {/* Resume Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {resumeOptions.map((resume) => {
                  const Icon = resume.icon;
                  return (
                    <motion.button
                      key={resume.id}
                      onClick={() => handleDownload(resume.id)}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-bg-dark rounded-xl p-6 border border-primary/20 hover:border-primary/50 transition-all duration-300 text-left group"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <Icon className={`w-8 h-8 ${resume.color}`} />
                        <h3 className="text-xl font-serif text-secondary font-bold">
                          {resume.title}
                        </h3>
                      </div>
                      <p className="text-secondary/70 text-sm mb-4 leading-relaxed">
                        {resume.description}
                      </p>
                      <div className="flex items-center gap-2 text-primary group-hover:gap-3 transition-all">
                        <Download className="w-5 h-5" aria-hidden="true" />
                        <span className="font-semibold">Download</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pt-6 border-t border-primary/20">
                <p className="text-secondary/60 text-sm text-center">
                  Need a different version?{" "}
                  <a
                    href="/contact"
                    className="text-primary hover:text-primary/80 transition-colors underline"
                  >
                    Contact me
                  </a>{" "}
                  for a custom resume.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

