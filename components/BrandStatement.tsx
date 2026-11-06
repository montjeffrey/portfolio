"use client";

import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { EvervaultBackground } from "@/components/ui/evervault-background";

export default function BrandStatement() {
  return (
    <section className="relative py-20 px-6 overflow-hidden md:min-h-[600px]">
      {/* Evervault background effect - covers entire section */}
      <EvervaultBackground className="rounded-none spotlight-fade" radius={450} />

      {/* Content wrapper with glassmorphism */}
      <div className="spotlight-text relative z-10 max-w-4xl mx-auto text-center">
        <div
          className="space-y-8 backdrop-blur-xl bg-bg-elevated/50 rounded-3xl p-6 sm:p-8 md:p-12 border border-primary/20 shadow-lg shadow-primary/10"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Target className="w-7 h-7 sm:w-8 sm:h-8 shrink-0 text-primary" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-secondary">
              Security Is How I Build
            </h2>
          </div>

          <p className="text-xl md:text-2xl text-secondary/80 leading-relaxed">
            Workers run unprivileged. Credentials live in mounted secret files, not environment variables. Failure gets tested on purpose: kill the worker mid-batch, then prove nothing was lost or duplicated.
          </p>

          <p className="text-lg text-secondary/70 leading-relaxed">
            The same rule runs through my tools: agents propose and humans approve, and nothing rewrites history or force-pushes. Fast is only useful if you can trust what shipped.
          </p>
        </div>
      </div>
    </section>
  );
}

