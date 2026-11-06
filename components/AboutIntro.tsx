"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import { SpotlightBackground } from "@/components/ui/spotlight-background";
import { useIsMobile } from "@/hooks/use-mobile";

export default function AboutIntro() {
  // Columns stack below md, so the reveal is vertical there (a horizontal slide would start
  // off-screen at 320px). Reduced motion gets a plain fade. Keyed on isMobile so the
  // elements remount with the right initial offset once the breakpoint is known.
  const isMobile = useIsMobile();
  const reduceMotion = useReducedMotion();
  // The reduced variants still name x and y: the server renders the desktop translateX
  // before the preference is known, and explicit zeros make framer clear it on mount.
  const enter = (x: number) =>
    reduceMotion ? { opacity: 0, x: 0, y: 0 } : isMobile ? { opacity: 0, x: 0, y: 28 } : { opacity: 0, x, y: 0 };
  const shown = { opacity: 1, x: 0, y: 0 };
  // Tall stacked blocks rarely reach 30% visible at once on a phone
  const viewport = { once: true, amount: isMobile ? 0.15 : 0.3 };
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Photo fades as the section exits the viewport. Opacity, not blur: a scroll-linked
  // filter forces repaints that make mobile Safari reload the tab.
  const fade = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [1, 1, 0.55, 0.15]);

  return (
    <section ref={sectionRef} className="relative py-20 px-6 bg-bg-dark overflow-hidden z-10 w-full">
      {/* Background Effects */}
      <SpotlightBackground />
      {/* Top gradient for transition from Hero */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark to-transparent z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Text Content - Left Side */}
          <motion.div
            key={`text-${isMobile}`}
            initial={enter(-80)}
            whileInView={shown}
            viewport={viewport}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.1, 0.25, 1],
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="space-y-6"
          >
            <h2 className="text-4xl md:text-5xl font-serif text-secondary">
              What I Build
            </h2>
            <p className="text-lg md:text-xl text-secondary/80 leading-relaxed">
              I build the internal systems businesses actually run on: data pipelines, integrations between platforms that were never meant to talk, and job queues that don&apos;t lose records when something crashes. I came up through Electrical Engineering and years of operations work, so I build the way an operator needs it to work, then secure it before it ships.
            </p>
          </motion.div>

          {/* Image Container - Right Side */}
          <motion.div
            key={`image-${isMobile}`}
            initial={enter(80)}
            whileInView={shown}
            viewport={viewport}
            transition={{
              duration: 0.8,
              delay: 0.15,
              ease: [0.25, 0.1, 0.25, 1],
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            className="relative"
          >
            <div className="relative w-full aspect-[4/3] rounded-lg overflow-visible group p-4">
              {/* Double shadow effect - heavy blur only on desktop */}
              {/* Outer shadow layer */}
              <div className="absolute -inset-2 rounded-lg transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100 hidden md:block"
                style={{
                  boxShadow: '0 20px 80px rgba(231,125,34,0.4), 0 40px 120px rgba(231,125,34,0.25), 0 60px 160px rgba(231,125,34,0.15)',
                }}
              />

              {/* Mobile optimized shadow - lighter and less expensive */}
              <div className="absolute inset-0 rounded-lg transition-all duration-500 pointer-events-none opacity-100 md:hidden"
                style={{
                  boxShadow: '0 10px 30px rgba(231,125,34,0.2)',
                }}
              />

              {/* Inner shadow layer - tighter, brighter glow */}
              <div className="absolute -inset-1 rounded-lg transition-all duration-500 pointer-events-none opacity-0 group-hover:opacity-100 hidden md:block"
                style={{
                  boxShadow: '0 10px 40px rgba(231,125,34,0.6), inset 0 0 30px rgba(231,125,34,0.2)',
                }}
              />

              {/* Image container with overflow hidden for clean edges */}
              <motion.div
                className="relative w-full h-full rounded-lg overflow-hidden"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                style={{ opacity: fade }}
              >
                {/* Glassmorphism backdrop overlay - no blur, just gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-lg z-10 pointer-events-none" />

                {/* Interactable overlay for mobile touch feedback */}
                <div className="absolute inset-0 z-20 bg-primary/20 opacity-0 active:opacity-100 md:hidden transition-opacity duration-200 pointer-events-none" />

                {/* Border with glow effect on hover */}
                <div className="absolute inset-0 rounded-lg border-2 border-primary/20 md:group-hover:border-primary/60 transition-all duration-300 z-20 pointer-events-none" />

                {/* Actual Image - positioned to show top half */}
                <Image
                  src="/Photos/Portfolio-picture.jpg"
                  alt="Jeffrey Montoya"
                  fill
                  className="object-cover object-top transition-transform duration-500 md:group-hover:scale-105"
                  priority
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder="blur"
                  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

