"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Mail, FolderOpen } from "lucide-react";

export default function BottomCTA() {
  return (
    <section className="py-20 px-6 bg-bg-elevated">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-secondary mb-6">
            Hiring for Security or Infrastructure?
          </h2>

          <p className="text-xl text-secondary/80 leading-relaxed max-w-2xl mx-auto">
            I&apos;m open to security, infrastructure, and automation roles, hybrid or remote from New Jersey. Let&apos;s talk about what you&apos;re building.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
            >
              <Mail className="w-5 h-5" />
              Get In Touch
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
            >
              <FolderOpen className="w-5 h-5" />
              View Full Portfolio
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

