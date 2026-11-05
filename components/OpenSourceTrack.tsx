"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useParallaxEnabled } from "@/lib/parallax/use-parallax-enabled";
import { EvervaultBackground } from "@/components/ui/evervault-background";

// Scene 3: the tools I publish, on a track that native scroll moves sideways (sticky +
// translateX, no scroll hijacking). Each title decodes out of glyph noise as its card
// reaches the middle, and each card plays a three-step story of what the tool does.
// Phones get a vertical stack.

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz0123456789#%&*+=<>/[]{}";
const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

// Readers and crawlers get the real title; the noise is decorative
function DecodeText({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();
  const [shown, setShown] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (reduceMotion || !el) return;

    let frame = 0;
    setShown(text.replace(/\S/g, glyph));

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min((now - start) / 900, 1);
          const settled = Math.floor(t * text.length);
          setShown(text.split("").map((c, i) => (i < settled || c === " " ? c : glyph())).join(""));
          if (t < 1) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      // Decode near the middle of the screen, whichever way the card arrives
      { rootMargin: "0px -25% 0px -25%", threshold: 0.4 }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [text, reduceMotion]);

  return (
    <>
      <span className="sr-only">{text}</span>
      <span ref={ref} aria-hidden="true">
        {shown}
      </span>
    </>
  );
}

// --- Demos -------------------------------------------------------------------------
// Each demo is one short story told in three steps. It plays on its own while the card
// is on screen; tapping a step holds it there. Leaving the card resets it, so every
// visit starts at step 1.

const STEP_MS = 3800;

type Step = { label: string; caption: string; command: string };

function StepDemo({ steps, children }: { steps: Step[]; children: (step: number) => ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.5 });
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [held, setHeld] = useState(false);
  const playing = inView && !held && !reduceMotion;

  useEffect(() => {
    if (inView) return;
    setStep(0);
    setHeld(false);
  }, [inView]);

  // The only timer: advance one step, then let the new step schedule the next
  useEffect(() => {
    if (!playing) return;
    const id = window.setTimeout(() => setStep((s) => (s + 1) % steps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [playing, step, steps.length]);

  const current = steps[step];

  return (
    <div ref={ref} className="flex h-full flex-col gap-4">
      <div className="min-h-[150px]">{children(step)}</div>

      {/* Announce only steps the visitor chose, never the autoplay */}
      <div className="min-h-[6.5rem] space-y-1.5" aria-live={held ? "polite" : "off"}>
        <p className="font-sans text-[15px] leading-relaxed text-secondary/90">{current.caption}</p>
        <p className="font-mono text-[11.5px] text-secondary/40">{current.command}</p>
      </div>

      <div className="mt-auto flex flex-wrap items-center gap-2" role="group" aria-label="Demo steps">
        {steps.map((s, i) => (
          <button
            key={s.label}
            type="button"
            aria-label={`Step ${i + 1}: ${s.label}`}
            aria-pressed={i === step}
            onClick={() => {
              setStep(i);
              setHeld(true);
            }}
            className={`relative overflow-hidden rounded-full border px-3 py-1 font-sans text-xs transition-colors ${
              i === step ? "border-primary bg-primary/15 text-secondary" : "border-secondary/20 text-secondary/60 hover:border-secondary/50"
            }`}
          >
            <span className="mr-1.5 text-primary">{i + 1}</span>
            {s.label}
            {playing && i === step && (
              <span
                key={step}
                aria-hidden="true"
                className="step-fill absolute inset-x-0 bottom-0 h-0.5 bg-primary"
                style={{ animationDuration: `${STEP_MS}ms` }}
              />
            )}
          </button>
        ))}
        {held && !reduceMotion && (
          <button
            type="button"
            onClick={() => setHeld(false)}
            className="rounded-full px-2 py-1 font-sans text-xs text-secondary/50 hover:text-primary transition-colors"
          >
            ▶ play
          </button>
        )}
      </div>
    </div>
  );
}

const HARNESS_STEPS: Step[] = [
  {
    label: "Ask",
    caption: "An AI coding agent starts a task and asks what it needs to know.",
    command: '$ memory_context "outbox retry"',
  },
  {
    label: "Trim",
    caption: "Instead of the whole codebase, it gets a small packet with only what this task needs.",
    command: "→ one ranked context packet, within budget",
  },
  {
    label: "Approve",
    caption: "The agent can suggest something to remember, but it only counts once a person approves it.",
    command: "$ memory review accept",
  },
];

function HarnessVisual({ step }: { step: number }) {
  const [accepted, setAccepted] = useState(false);

  // On the last step the suggestion waits a beat, then a person approves it
  useEffect(() => {
    setAccepted(false);
    if (step !== 2) return;
    const id = window.setTimeout(() => setAccepted(true), 1300);
    return () => window.clearTimeout(id);
  }, [step]);

  return (
    <div className="space-y-4 font-mono text-[12.5px]">
      <div className="space-y-1.5">
        <div className="h-3 rounded-full bg-secondary/10 overflow-hidden">
          <div
            className="h-full w-full origin-left rounded-full bg-primary/80 transition-transform duration-700 ease-out motion-reduce:transition-none"
            style={{ transform: `scaleX(${step === 0 ? 1 : 0.16})` }}
          />
        </div>
        <p className="text-secondary/60">{step === 0 ? "the whole repository" : "only what this task needs"}</p>
      </div>
      <div className={`rounded-lg border border-secondary/10 p-3 space-y-1.5 transition-opacity duration-500 ${step === 2 ? "opacity-100" : "opacity-25"}`}>
        <p className="text-secondary/80">memory: &quot;Retries go through the outbox, never inline.&quot;</p>
        <p>
          status:{" "}
          <span className={accepted ? "text-[#4CC38A]" : "text-primary"}>{accepted ? "approved by a person" : "suggested, waiting for review"}</span>
        </p>
      </div>
    </div>
  );
}

const LANDFIRST_STEPS: Step[] = [
  {
    label: "Branches",
    caption: "Four branches are waiting to merge. Which one should go first?",
    command: "$ landfirst",
  },
  {
    label: "Rank",
    caption: "landfirst puts them in merge order and warns which two will conflict.",
    command: "conflicts predicted with git merge-tree",
  },
  {
    label: "Verify",
    caption: "It also recognizes work that already landed through a rebase or cherry-pick, so the list stays short and true.",
    command: "compared by patch ID, not commit hash",
  },
];

const BRANCHES = [
  { name: "chore/deps", rank: 4 },
  { name: "feat/graph-cache", rank: 2 },
  { name: "fix/readme-typo", rank: 1 },
  { name: "feat/memory-packets", rank: 3, conflict: "feat/graph-cache" },
];

function LandfirstVisual({ step }: { step: number }) {
  const reduceMotion = useReducedMotion();
  const sorted = step > 0;
  const rows = sorted ? [...BRANCHES].sort((a, b) => a.rank - b.rank) : BRANCHES;

  return (
    <div className="space-y-4 font-mono text-[12.5px]">
      <ol className="space-y-1.5">
        {rows.map((b) => (
          <motion.li
            key={b.name}
            layout={!reduceMotion}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-wrap items-center gap-x-2"
          >
            <span className="w-5 text-primary">{sorted ? b.rank : "·"}</span>
            <span className="text-secondary/85">{b.name}</span>
            {b.conflict && sorted && <span className="text-[11px] text-primary/90">conflicts with {b.conflict}</span>}
          </motion.li>
        ))}
      </ol>
      <div className={`rounded-lg border border-secondary/10 p-3 space-y-1 transition-opacity duration-500 ${step === 2 ? "opacity-100" : "opacity-25"}`}>
        <p className="text-secondary/50">
          by commit hash: <span className={step === 2 ? "line-through" : undefined}>2,073 across 17 branches</span>
        </p>
        <p>
          by patch ID: <span className="text-[#4CC38A]">45 across 8 branches</span>
        </p>
        <p className="text-secondary/40">flagged as unlanded, measured on a real repository</p>
      </div>
    </div>
  );
}

const POOL_STEPS: Step[] = [
  {
    label: "Machines",
    caption: "Three machines share their CPU. Each is already busy with its own work.",
    command: "$ pool nodes",
  },
  {
    label: "Send",
    caption: "A test run comes in. compute-pool sends it to the machine with the most room.",
    command: "$ pool run -- go test ./...",
  },
  {
    label: "Done",
    caption: "The tests finish on build-box and its load drops back. Bigger batches spread across every free machine.",
    command: "$ pool map  → fans a batch out across the pool",
  },
];

const POOL_NODES = [
  { name: "desktop", load: 62 },
  { name: "laptop", load: 38 },
  { name: "build-box", load: 21 },
];
const POOL_TARGET = 2; // the least-loaded node

function PoolVisual({ step }: { step: number }) {
  return (
    <div className="space-y-4 font-mono text-[12.5px]">
      <ul className="space-y-2.5">
        {POOL_NODES.map((n, i) => {
          const target = i === POOL_TARGET && step > 0;
          const load = i === POOL_TARGET && step === 1 ? n.load + 40 : n.load;
          return (
            <li key={n.name} className="grid grid-cols-[76px_1fr_40px] items-center gap-2">
              <span className={target ? "text-primary" : "text-secondary/80"}>{n.name}</span>
              <span className="h-2.5 rounded-full bg-secondary/10 overflow-hidden">
                <span
                  className={`block h-full w-full origin-left rounded-full transition-transform duration-700 ease-out motion-reduce:transition-none ${
                    target ? "bg-primary" : "bg-[#4CC38A]/80"
                  }`}
                  style={{ transform: `scaleX(${load / 100})` }}
                />
              </span>
              <span className="text-right text-secondary/60">{load}%</span>
            </li>
          );
        })}
      </ul>
      <p className={step === 0 ? "text-secondary/50" : step === 1 ? "text-primary" : "text-[#4CC38A]"}>
        {step === 0 ? "3 machines in the pool" : step === 1 ? "go test ./... running on build-box" : "✓ finished on build-box"}
      </p>
    </div>
  );
}

// --- Cards and track -----------------------------------------------------------------

function Card({ tag, title, blurb, href, children }: { tag: string; title: string; blurb: string; href: string; children: ReactNode }) {
  return (
    <article className="flex-none w-full lg:w-[440px] rounded-2xl border border-secondary/15 bg-bg-dark p-6 flex flex-col gap-4">
      <span className="font-mono text-xs tracking-wide text-primary">{tag}</span>
      <h3 className="text-3xl font-serif text-secondary">
        <DecodeText text={title} />
      </h3>
      <p className="text-[15px] leading-relaxed text-secondary/70">{blurb}</p>
      <div className="flex-1 rounded-xl border border-dashed border-secondary/15 bg-black/40 p-4 text-secondary/80">{children}</div>
      <a href={href} target="_blank" rel="noopener noreferrer" className="font-mono text-sm text-primary underline-offset-4 hover:underline">
        {title} on GitHub →
      </a>
    </article>
  );
}

const CARDS = [
  {
    tag: "Python · stdlib-only · MCP",
    title: "agent-harness",
    blurb: "Gives coding agents the part of a codebase they need: queryable code graphs, budgeted context packets, and project memory that waits for human review.",
    href: "https://github.com/montjeffrey/agent-harness",
    demo: <StepDemo steps={HARNESS_STEPS}>{(step) => <HarnessVisual step={step} />}</StepDemo>,
  },
  {
    tag: "Go · TUI",
    title: "landfirst",
    blurb: "Which branch do I merge first? Ranks branches by merge order, predicts conflicts between them, and never rewrites history or force-pushes.",
    href: "https://github.com/montjeffrey/landfirst",
    demo: <StepDemo steps={LANDFIRST_STEPS}>{(step) => <LandfirstVisual step={step} />}</StepDemo>,
  },
  {
    tag: "Go · Tailscale",
    title: "compute-pool",
    blurb: "Shares CPU between your own machines over Tailscale. A command runs on the least-loaded device, and batches fan out across the whole pool.",
    href: "https://github.com/montjeffrey/compute-pool",
    demo: <StepDemo steps={POOL_STEPS}>{(step) => <PoolVisual step={step} />}</StepDemo>,
  },
];

function Intro() {
  return (
    <div className="flex-none w-full lg:w-[380px] flex flex-col justify-center gap-5 rounded-2xl border border-secondary/10 bg-bg-dark/85 p-6 lg:border-transparent lg:bg-transparent lg:p-0">
      <span className="font-mono text-sm tracking-widest text-primary">02 · BUILT IN THE OPEN</span>
      <h2 id="track-heading" className="text-4xl md:text-5xl font-serif text-secondary leading-tight">
        Tools I build, publish, and use every day.
      </h2>
      <p className="text-lg text-secondary/70 leading-relaxed">
        Each one started as a problem in my own work. Every card plays a short demo; tap a step to hold it there.
      </p>
      <Link href="/projects" className="font-mono text-sm text-primary underline-offset-4 hover:underline">
        All projects →
      </Link>
    </div>
  );
}

export default function OpenSourceTrack() {
  const mode = useParallaxEnabled();
  const wide = useMediaQuery("(min-width: 1024px)");
  const pinned = wide && mode !== "off";

  const outerRef = useRef<HTMLElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const distanceMv = useMotionValue(0);

  // How far the track has to travel so its last card ends at the right edge
  useEffect(() => {
    if (!pinned) return;
    const measure = () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;
      const d = Math.max(0, track.scrollWidth - viewport.clientWidth);
      setDistance(d);
      distanceMv.set(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [pinned, distanceMv]);

  const { scrollYProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const x = useTransform([scrollYProgress, distanceMv], ([p, d]: number[]) => -p * d);

  const items = (
    <>
      <Intro />
      {CARDS.map((c) => (
        <Card key={c.title} tag={c.tag} title={c.title} blurb={c.blurb} href={c.href}>
          {c.demo}
        </Card>
      ))}
    </>
  );

  if (!pinned) {
    return (
      <section ref={outerRef} aria-labelledby="track-heading" className="relative py-24 px-6 bg-bg-elevated">
        {/* One screen-sized spotlight that rides along, not a canvas the height of the stack */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="sticky top-0 h-screen">
            <EvervaultBackground className="rounded-none spotlight-fade" radius={450} />
          </div>
        </div>
        <div className="spotlight-text relative z-10 max-w-xl mx-auto flex flex-col gap-8">{items}</div>
      </section>
    );
  }

  return (
    // Page height grows by exactly the sideways travel, so scroll speed feels native
    <section ref={outerRef} aria-labelledby="track-heading" className="relative bg-bg-elevated" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div ref={viewportRef} className="sticky top-16 h-[calc(100vh-4rem)] overflow-hidden flex items-center">
        <EvervaultBackground className="rounded-none spotlight-fade" radius={450} />
        <motion.div ref={trackRef} style={{ x }} className="spotlight-text relative z-10 flex w-max items-stretch gap-8 px-[8vw] will-change-transform">
          {items}
        </motion.div>
      </div>
    </section>
  );
}
