"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useScroll, type MotionValue } from "framer-motion";
import { Mail, Download, Github, Linkedin } from "lucide-react";
import { ResumeModal } from "@/components/ui/resume-modal";
import { useParallaxEnabled, type ParallaxMode } from "@/lib/parallax/use-parallax-enabled";

// Scene 6: the dots scattered by the scenes above drift back into the hero's grid as the
// contact section arrives, so the page ends where it began. On devices with a cursor the
// settled grid leans toward the pointer, like the hero. Reduced motion and low-power
// devices get the settled grid with one lit cluster, drawn once.

const SPACING = 22;
const DOT = 1.2;
const GRAVITY_R = 170;
const GRAVITY_PULL = 0.28;

// Small seeded random, so the scatter is the same on every visit and resize
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Dot = { hx: number; hy: number; sx: number; sy: number };

function ReconvergeField({ progress, mode }: { progress: MotionValue<number>; mode: ParallaxMode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const still = mode === "off";
    const gravity = !still && window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let dots: Dot[] = [];
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = false;
    const pointer = { x: 0, y: 0, active: 0, target: 0 };

    const layout = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Same offset-row grid as the hero: every other column sits half a step lower
      const rand = rng(6);
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;
      const cx = w / 2;
      const cy = h / 2;
      dots = [];
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const hx = c * SPACING;
          const hy = r * SPACING + (c % 2) * SPACING * 0.5;
          // Scattered start: pushed outward from the centre, with some spin
          const a = Math.atan2(hy - cy, hx - cx) + (rand() - 0.5) * 1.6;
          const d = 60 + rand() * 260;
          dots.push({ hx, hy, sx: Math.cos(a) * d, sy: Math.sin(a) * d });
        }
      }
    };

    const draw = () => {
      const p = still ? 1 : progress.get();
      const t = 1 - Math.pow(1 - Math.min(1, Math.max(0, p)), 3); // ease out
      const loose = 1 - t;
      const cx = w / 2;
      const cy = h / 2;
      const glowR = Math.max(w, h) * 0.6;

      pointer.active += (pointer.target - pointer.active) * 0.12;
      const pull = GRAVITY_PULL * pointer.active * t;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#E77D22";
      for (const d of dots) {
        let x = d.hx + d.sx * loose;
        let y = d.hy + d.sy * loose;
        let lit = 0;

        if (pull > 0.001) {
          const dx = pointer.x - x;
          const dy = pointer.y - y;
          const d2 = dx * dx + dy * dy;
          if (d2 < GRAVITY_R * GRAVITY_R) {
            const fall = 1 - d2 / (GRAVITY_R * GRAVITY_R);
            x += dx * pull * fall;
            y += dy * pull * fall;
            lit = fall * pointer.active;
          }
        }

        // One lit cluster behind the card, fading toward the edges
        const gx = x - cx;
        const gy = y - cy;
        const glow = Math.max(0, 1 - Math.sqrt(gx * gx + gy * gy) / glowR);

        ctx.globalAlpha = Math.min(0.95, (0.22 + glow * 0.5 + lit * 0.5) * (0.35 + 0.65 * t));
        ctx.beginPath();
        ctx.arc(x, y, DOT + lit * 0.9, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      draw();
      raf = visible ? requestAnimationFrame(loop) : 0;
    };
    const start = () => {
      if (!raf && visible && !still) raf = requestAnimationFrame(loop);
    };

    layout();
    draw();

    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(canvas);

    // Only animate while the section is on screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
    });
    io.observe(canvas);

    const section = canvas.parentElement;
    const move = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.target = 1;
    };
    const leave = () => {
      pointer.target = 0;
    };
    if (gravity && section) {
      section.addEventListener("pointermove", move, { passive: true });
      section.addEventListener("pointerleave", leave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      if (section) {
        section.removeEventListener("pointermove", move);
        section.removeEventListener("pointerleave", leave);
      }
    };
  }, [mode, progress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full [mask-image:radial-gradient(ellipse_75%_70%_at_50%_50%,#000_45%,transparent_100%)]"
    />
  );
}

export default function BottomCTA() {
  const mode = useParallaxEnabled();
  const [resumeOpen, setResumeOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  // 0 when the section's top enters the screen, 1 when its middle reaches the middle
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-heading"
      className="relative overflow-hidden bg-bg-dark px-6 py-28 md:py-36"
    >
      <ReconvergeField progress={scrollYProgress} mode={mode} />

      <div className="relative mx-auto flex max-w-2xl flex-col items-center gap-6 rounded-2xl border border-secondary/15 bg-bg-dark/90 px-6 py-10 text-center md:px-12 md:py-12">
        <span className="font-mono text-sm tracking-widest text-primary">05 · GET IN TOUCH</span>
        <h2 id="contact-heading" className="text-4xl font-serif leading-tight text-secondary md:text-5xl">
          Hiring for security or infrastructure?
        </h2>
        <p className="text-lg leading-relaxed text-secondary/75">
          I&apos;m open to security, infrastructure, and automation roles, hybrid or remote from New Jersey. Let&apos;s talk
          about what you&apos;re building.
        </p>

        <div className="mt-2 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 font-semibold text-bg-dark transition-colors hover:bg-primary/90"
          >
            <Mail className="h-5 w-5" aria-hidden="true" />
            Get in touch
          </Link>
          <button
            type="button"
            onClick={() => setResumeOpen(true)}
            aria-haspopup="dialog"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-secondary/25 px-7 py-3.5 font-semibold text-secondary transition-colors hover:border-primary"
          >
            <Download className="h-5 w-5" aria-hidden="true" />
            Download resume
          </button>
        </div>

        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-sm">
          <li>
            <a
              href="https://github.com/montjeffrey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-secondary/70 underline-offset-4 hover:text-primary hover:underline"
            >
              <Github className="h-4 w-4" aria-hidden="true" />
              GitHub
            </a>
          </li>
          <li>
            <a
              href="https://linkedin.com/in/montjeffrey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-secondary/70 underline-offset-4 hover:text-primary hover:underline"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" />
              LinkedIn
            </a>
          </li>
          <li>
            <a
              href="mailto:montjeffrey@gmail.com"
              className="inline-flex items-center gap-1.5 text-secondary/70 underline-offset-4 hover:text-primary hover:underline"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              montjeffrey@gmail.com
            </a>
          </li>
        </ul>

        {/* Points to the live capture-the-flag on the GitHub profile; the flag itself never appears here */}
        <a
          href="https://github.com/montjeffrey#capture-the-flag"
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-2 flex flex-col items-center gap-1.5 rounded-lg border border-dashed border-primary/35 px-4 py-3 transition-colors hover:border-primary"
        >
          <span className="font-mono text-sm text-primary" aria-hidden="true">
            FLAG{"{"}????_????_????_????{"}"}
          </span>
          <span className="text-sm text-secondary/70 group-hover:text-secondary">
            There&apos;s a capture-the-flag on my GitHub profile. Four questions about my projects, and a hall of fame
            for anyone who solves it. ↗
          </span>
        </a>
      </div>

      <ResumeModal isOpen={resumeOpen} onClose={() => setResumeOpen(false)} />
    </section>
  );
}
