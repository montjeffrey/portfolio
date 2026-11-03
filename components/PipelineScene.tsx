"use client";

import { useEffect, useRef, useState } from "react";
import { motion, transform, useMotionValue, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { useParallaxEnabled } from "@/lib/parallax/use-parallax-enabled";

// Scene 4: one release travels the pipeline as you scroll. It reaches a failing job and
// stops, goes back for a re-run, then passes scan, sign, and ship. Every stage caption
// comes from a real workflow in my repositories. Native scroll drives the dot (transform
// only); reduced motion and low-power devices get the finished line, standing still.

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

type Stage = { label: string; text: string; source: string; href: string };

const STAGES: Stage[] = [
  {
    label: "Test",
    text: "Every change runs on Windows, macOS, and Linux across four Python versions: 12 jobs.",
    source: "agent-harness CI",
    href: "https://github.com/montjeffrey/agent-harness/blob/main/.github/workflows/ci.yml",
  },
  {
    label: "Fail, retry",
    text: "One red job stops the line. Nothing moves on until the fix passes everywhere.",
    source: "agent-harness CI",
    href: "https://github.com/montjeffrey/agent-harness/blob/main/.github/workflows/ci.yml",
  },
  {
    label: "Scan",
    text: "Dependencies are checked for known vulnerabilities, and the code for leaked secrets.",
    source: "tailnet-sentry CI",
    href: "https://github.com/montjeffrey/tailnet-sentry/blob/main/.github/workflows/ci.yml",
  },
  {
    label: "Sign",
    text: "Each release gets a signed record of where it was built, checkable with gh attestation verify.",
    source: "tailnet-sentry release",
    href: "https://github.com/montjeffrey/tailnet-sentry/blob/main/.github/workflows/release.yml",
  },
  {
    label: "Ship",
    text: "A tagged release builds a binary for every platform and publishes each one with its signed record attached.",
    source: "tailnet-sentry v0.1.0",
    href: "https://github.com/montjeffrey/tailnet-sentry/releases/tag/v0.1.0",
  },
];

// Only what a public workflow has actually run; checked against GitHub run history
const FACTS = ["12-job test matrix", "3 OS × 4 Python", "Vulnerability and secret scans", "Signed build provenance"];

// Scroll progress → dot position along the line (0 = Test, 1 = Ship). The flat stretch at
// 0.25 is the stall on the failed job; the dip back to 0 is the re-run.
const P_IN = [0, 0.12, 0.3, 0.38, 0.5, 0.62, 0.76, 0.9, 1];
const POS_OUT = [0, 0.25, 0.25, 0, 0.25, 0.5, 0.75, 1, 1];
const posAt = transform(P_IN, POS_OUT);

type NodeState = "pending" | "active" | "done" | "failed";
type Phase = { nodes: NodeState[]; status: string; failing: boolean };

const ACTIVE_STATUS = [
  "Running every job again",
  "All 12 jobs green",
  "Scanning dependencies and secrets",
  "Signing where it was built",
  "Publishing the release",
];

function phaseAt(p: number, pos: number): Phase {
  const nodes: NodeState[] = STAGES.map(() => "pending");
  if (p < 0.12) {
    nodes[0] = "active";
    return { nodes, status: "Running 12 test jobs", failing: false };
  }
  if (p < 0.3) {
    nodes[0] = "done";
    nodes[1] = "failed";
    return { nodes, status: "One job failed. The line stops here.", failing: true };
  }
  if (p >= 0.9) {
    return { nodes: nodes.map(() => "done"), status: "Shipped", failing: false };
  }
  // From the re-run on, everything behind the dot is done and the next stop is active
  const at = pos * (STAGES.length - 1);
  const next = Math.min(STAGES.length - 1, Math.ceil(at - 0.05));
  STAGES.forEach((_, i) => {
    nodes[i] = i < next ? "done" : i === next ? "active" : "pending";
  });
  if (p < 0.38) return { nodes, status: "Fix pushed. Back to the start.", failing: false };
  return { nodes, status: ACTIVE_STATUS[next], failing: false };
}

const NODE_STYLE: Record<NodeState, string> = {
  pending: "border-secondary/20 bg-bg-dark text-secondary/40",
  active: "border-primary bg-bg-dark text-primary",
  done: "border-primary bg-primary text-bg-dark",
  failed: "border-red-500 bg-red-500/15 text-red-400",
};

function Node({ state, index }: { state: NodeState; index: number }) {
  return (
    <span
      aria-hidden="true"
      className={`relative z-10 flex h-7 w-7 flex-none items-center justify-center rounded-full border-2 font-mono text-xs transition-colors duration-300 ${NODE_STYLE[state]}`}
    >
      {state === "done" ? "✓" : state === "failed" ? "✕" : index + 1}
    </span>
  );
}

export default function PipelineScene() {
  const mode = useParallaxEnabled();
  const wide = useMediaQuery("(min-width: 768px)");
  const still = mode === "off";

  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.45"] });
  const finished = useMotionValue(1);
  const progress = still ? finished : scrollYProgress;
  const pos = useTransform(progress, posAt);

  const [phase, setPhase] = useState<Phase>(() => phaseAt(1, 1));
  const keyRef = useRef("");
  const sync = (p: number) => {
    // Read the position from p itself; pos may not have updated yet when this fires
    const next = phaseAt(p, posAt(p));
    const key = next.nodes.join() + next.status;
    if (key === keyRef.current) return;
    keyRef.current = key;
    setPhase(next);
  };
  useMotionValueEvent(progress, "change", sync);
  useEffect(() => sync(progress.get()), [progress]); // eslint-disable-line react-hooks/exhaustive-deps

  // The traveler is a full-length layer slid along the line; the dot rides its far end
  const slide = useTransform(pos, (v) => `${(v - 1) * 100}%`);
  const tone = phase.failing ? "bg-red-500" : "bg-primary";

  return (
    <section aria-labelledby="pipeline-heading" className="relative py-24 px-6 bg-bg-dark">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl flex flex-col gap-5">
          <span className="font-mono text-sm tracking-widest text-primary">03 · SECDEVOPS</span>
          <h2 id="pipeline-heading" className="text-4xl md:text-5xl font-serif text-secondary leading-tight">
            Builds that fail when they find something that shouldn&apos;t ship.
          </h2>
          <p className="text-lg text-secondary/70 leading-relaxed">
            Scroll to follow one release through. A red step stops the line until it&apos;s fixed. Each step is taken from a real
            workflow in my repositories.
          </p>
        </div>

        {/* Plain-language readout of where the release is; decorative, the list below carries the content */}
        <div aria-hidden="true" className="sticky top-20 z-20 mt-12 flex md:static md:justify-center">
          <span
            className={`rounded-full border px-4 py-1.5 font-mono text-sm transition-colors duration-300 ${
              phase.failing ? "border-red-500/50 bg-red-950/80 text-red-300" : "border-primary/30 bg-bg-elevated/90 text-secondary/85"
            }`}
          >
            {phase.status}
          </span>
        </div>

        <div className="relative mt-10">
          {/* Line, fill, and traveler. Phones: down the left edge. Wider: across the node row. */}
          <div
            aria-hidden="true"
            className="absolute left-[14px] top-[14px] h-[80%] w-px md:left-[10%] md:right-[10%] md:h-px md:w-auto"
          >
            <div className="absolute inset-0 bg-secondary/15" />
            <motion.div
              className={`absolute inset-0 ${tone} transition-colors duration-300 ${wide ? "origin-left" : "origin-top"}`}
              style={wide ? { scaleX: pos } : { scaleY: pos }}
            />
            <motion.div className="absolute inset-0" style={wide ? { x: slide } : { y: slide }}>
              <span
                className={`absolute h-3.5 w-3.5 rounded-full ${tone} shadow-[0_0_14px_4px_rgba(231,125,34,0.45)] transition-colors duration-300 ${
                  wide ? "right-0 top-1/2 translate-x-1/2 -translate-y-1/2" : "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                }`}
              />
            </motion.div>
          </div>

          <ol ref={listRef} className="relative grid auto-rows-fr md:auto-rows-auto md:grid-cols-5">
            {STAGES.map((s, i) => (
              <li key={s.label} className="grid grid-cols-[1.75rem_1fr] gap-x-4 pb-10 md:flex md:flex-col md:items-center md:gap-4 md:px-3 md:pb-0 md:text-center">
                <Node state={phase.nodes[i]} index={i} />
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-sans text-lg font-semibold text-secondary">{s.label}</h3>
                  <p className="text-[15px] leading-relaxed text-secondary/70">{s.text}</p>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-primary/90 underline-offset-4 hover:underline"
                  >
                    {s.source} →
                  </a>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <ul className="mt-12 flex flex-wrap gap-2 md:justify-center">
          {FACTS.map((f) => (
            <li key={f} className="rounded-full border border-secondary/12 px-3 py-1 font-mono text-xs text-secondary/60">
              {f}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
