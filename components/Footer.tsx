"use client";

import Link from "next/link";
import { Linkedin, Mail, Github } from "lucide-react";
import { EvervaultBackground } from "@/components/ui/evervault-background";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      {/* Evervault effect section - the space above footer */}
      <section
        className="relative overflow-hidden h-20 bg-bg-dark w-full"
        style={{
          margin: 0,
          padding: 0,
          marginTop: 0,
          paddingTop: 0,
          marginBottom: 0,
          paddingBottom: 0,
          display: 'block'
        }}
      >
        <EvervaultBackground className="rounded-none" radius={450} />
      </section>

      <footer className="bg-bg-elevated border-t border-primary/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Brand Section */}
            <div>
              <h3 className="text-xl font-serif text-primary font-bold mb-4">
                Jeffrey Montoya
              </h3>
              <p className="text-secondary/80 text-sm">
                Solutions Engineer
              </p>
              <p className="text-secondary/60 text-sm mt-2">
                Building bridges between operations and innovation, one line of code at a time.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-secondary font-semibold mb-4">Quick Links</h4>
              <nav className="flex flex-col space-y-2">
                <Link href="/" className="text-secondary/80 hover:text-primary transition-colors text-sm">
                  Home
                </Link>
                <Link href="/projects" className="text-secondary/80 hover:text-primary transition-colors text-sm">
                  Projects
                </Link>
                <Link href="/about" className="text-secondary/80 hover:text-primary transition-colors text-sm">
                  About
                </Link>
                <Link href="/resume" className="text-secondary/80 hover:text-primary transition-colors text-sm">
                  Resume
                </Link>
                <Link href="/contact" className="text-secondary/80 hover:text-primary transition-colors text-sm">
                  Contact
                </Link>
              </nav>
            </div>

            {/* Connect Section */}
            <div>
              <h4 className="text-secondary font-semibold mb-4">Connect</h4>
              <div className="flex space-x-4">
                <a
                  href="https://linkedin.com/in/montjeffrey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary/80 hover:text-primary transition-colors"
                  aria-label="LinkedIn"
                >
                  <Linkedin size={24} />
                </a>
                <a
                  href="mailto:montjeffrey@gmail.com"
                  className="text-secondary/80 hover:text-primary transition-colors"
                  aria-label="Email"
                >
                  <Mail size={24} />
                </a>
                <a
                  href="https://github.com/montjeffrey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary/80 hover:text-primary transition-colors"
                  aria-label="GitHub"
                >
                  <Github size={24} />
                </a>
              </div>
              <p className="text-secondary/60 text-sm mt-4">
                Currently: Open to full-time opportunities in Cloud, Security, and Full-Stack Development
              </p>
            </div>
          </div>

          <div className="border-t border-primary/20 mt-8 pt-8 text-center">
            <p className="text-secondary/60 text-sm">
              © {currentYear} Jeffrey Montoya. Built with React, hosted on AWS.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

