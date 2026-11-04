"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useParallaxEnabled } from "@/lib/parallax/use-parallax-enabled";

// Scene 4: one release runs the pipeline. Scrolling picks the step; each step then plays
// its own short animation (jobs light up and one fails, the scan sweeps, the seal stamps,
// the binaries fly out) and the dot springs to its node. Wide screens pin the scene while
// you scroll; phones keep a sticky panel above the list. Reduced motion and low-power
// devices get the finished release, standing still. Every caption and name comes from a
// real workflow or release in my repositories.

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

// The run is told in eight beats. Scroll progress picks the beat; each beat animates on its own clock.
type Beat = "run" | "fail" | "reset" | "rerun" | "scan" | "sign" | "ship" | "shipped";
const BEATS: Beat[] = ["run", "fail", "reset", "rerun", "scan", "sign", "ship", "shipped"];
const BEAT_STARTS = [0.1, 0.22, 0.3, 0.44, 0.58, 0.72, 0.88]; // progress where beats 1..7 begin
const beatAt = (p: number) => BEAT_STARTS.filter((s) => p >= s).length;

// Where the dot rests on the line for each beat (0 = Test, 1 = Ship), and which stage the beat belongs to
const DOT_AT = [0, 0.25, 0, 0.25, 0.5, 0.75, 1, 1];
const STAGE_OF = [0, 1, 1, 1, 2, 3, 4, 4];

type NodeState = "pending" | "active" | "done" | "failed";
const P = "pending";
const NODES: NodeState[][] = [
  ["active", P, P, P, P],
  ["done", "failed", P, P, P],
  ["active", P, P, P, P],
  ["done", "active", P, P, P],
  ["done", "done", "active", P, P],
  ["done", "done", "done", "active", P],
  ["done", "done", "done", "done", "active"],
  ["done", "done", "done", "done", "done"],
];

const NODE_STYLE: Record<NodeState, string> = {
  pending: "border-secondary/20 bg-bg-dark text-secondary/40",
  active: "border-primary bg-bg-dark text-primary",
  done: "border-primary bg-primary text-bg-dark",
  failed: "border-red-500 bg-red-950 text-red-400",
};

function Node({ state, index }: { state: NodeState; index: number }) {
  return (
    <span aria-hidden="true" className="relative z-10 flex h-7 w-7 flex-none items-center justify-center">
      {state === "active" && <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />}
      <motion.span
        key={state}
        initial={{ scale: state === "pending" ? 1 : 0.6 }}
        animate={state === "failed" ? { scale: 1, x: [0, -4, 4, -3, 3, 0] } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 420, damping: 16 }}
        className={`relative flex h-7 w-7 items-center justify-center rounded-full border-2 font-mono text-xs transition-colors duration-300 ${NODE_STYLE[state]}`}
      >
        {state === "done" ? "✓" : state === "failed" ? "✕" : index + 1}
      </motion.span>
    </span>
  );
}

// ---------- Panel: the 12-job matrix (beats run, fail, reset, rerun) ----------

type Tile = "queued" | "running" | "passed" | "failed";
const OSES = ["ubuntu", "windows", "macos"];
const PYS = ["3.11", "3.12", "3.13", "3.14"];
const FAIL_AT = 10; // macos · 3.13. Which job fails is illustrative; the matrix is real.

const TILE_STYLE: Record<Tile, string> = {
  queued: "border-secondary/15 bg-secondary/5",
  running: "border-primary/70 bg-primary/15 animate-pulse",
  passed: "border-[#4CC38A]/70 bg-[#4CC38A]/20",
  failed: "border-red-500 bg-red-500/30",
};

function JobsPanel({ beat }: { beat: Beat }) {
  const [tiles, setTiles] = useState<Tile[]>(() => Array(12).fill("queued"));
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    const set = (i: number, s: Tile) => setTiles((t) => t.map((v, j) => (j === i ? s : v)));
    setSettled(false);

    if (beat === "fail") {
      setTiles((t) => t.map((_, i) => (i === FAIL_AT ? "failed" : "passed")));
    } else if (beat === "reset") {
      setTiles(Array(12).fill("queued"));
    } else {
      // Jobs start in a quick ripple and finish at slightly different times, like a real matrix
      setTiles(Array(12).fill("queued"));
      const hangs = beat === "run";
      for (let i = 0; i < 12; i++) {
        const start = 80 + i * 60;
        at(start, () => set(i, "running"));
        if (!(hangs && i === FAIL_AT)) at(start + 420 + ((i * 137) % 320), () => set(i, "passed"));
      }
      at(80 + 11 * 60 + 800, () => setSettled(true));
    }
    return () => timers.forEach(clearTimeout);
  }, [beat]);

  const passed = tiles.filter((t) => t === "passed").length;
  const status =
    beat === "run"
      ? "Running 12 test jobs"
      : beat === "fail"
        ? "One job failed. The line stops here."
        : beat === "reset"
          ? "Fix pushed. Back to the start."
          : settled
            ? "All 12 jobs green"
            : "Running every job again";

  return (
    <div className="flex h-full flex-col gap-3">
      <PanelHeader status={status} tone={beat === "fail" ? "red" : settled ? "green" : "orange"} right={`${passed}/12 passed`} />
      <div className="grid flex-1 grid-cols-[4.5rem_repeat(4,minmax(0,1fr))] items-center gap-x-2 gap-y-2">
        <span />
        {PYS.map((py) => (
          <span key={py} className="text-center font-mono text-[11px] text-secondary/45">
            py{py}
          </span>
        ))}
        {OSES.map((os, r) => (
          <div key={os} className="contents">
            <span className="font-mono text-xs text-secondary/60">{os}</span>
            {PYS.map((py, c) => {
              const i = r * 4 + c;
              const s = tiles[i];
              return (
                <motion.span
                  key={py}
                  animate={
                    s === "failed"
                      ? { x: [0, -5, 5, -4, 4, 0], scale: 1 }
                      : s === "passed"
                        ? { scale: [0.85, 1.08, 1], x: 0 }
                        : { scale: 1, x: 0 }
                  }
                  transition={{ duration: s === "failed" ? 0.45 : 0.3 }}
                  className={`flex h-8 items-center justify-center rounded-md border font-mono text-xs transition-colors duration-200 ${TILE_STYLE[s]} ${
                    beat === "fail" && s !== "failed" ? "opacity-40" : ""
                  }`}
                >
                  {s === "passed" ? <span className="text-[#4CC38A]">✓</span> : s === "failed" ? <span className="text-red-300">✕</span> : null}
                </motion.span>
              );
            })}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {beat === "reset" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="self-start rounded-md border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-xs text-primary"
          >
            ↻ fix pushed · all 12 jobs run again
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------- Panel: scans ----------

const SCANS = [
  { tool: "govulncheck", what: "Go dependencies, known vulnerabilities" },
  { tool: "gitleaks", what: "Every commit in history, leaked secrets" },
];

function ScanPanel() {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const a = window.setTimeout(() => setDone(1), 1200);
    const b = window.setTimeout(() => setDone(2), 1600);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">
      <PanelHeader
        status={done === 2 ? "Nothing found. On to signing." : "Scanning dependencies and secrets"}
        tone={done === 2 ? "green" : "orange"}
      />
      <div className="flex flex-1 flex-col justify-center gap-5">
        {SCANS.map((s, i) => (
          <div key={s.tool} className="flex flex-col gap-2">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-mono text-sm text-secondary">
                {s.tool} <span className="text-secondary/45">· {s.what}</span>
              </span>
              <AnimatePresence>
                {done > i && (
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex-none font-mono text-xs text-[#4CC38A]"
                  >
                    ✓ none found
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary/10">
              <motion.div
                className="absolute inset-y-0 left-0 w-full rounded-full bg-gradient-to-r from-primary/20 via-primary to-primary/20"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.1, delay: i * 0.4, ease: "easeInOut" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Panel: signing ----------

const GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789";
const SIGNED_BY = "built and signed in GitHub Actions";

function SignPanel() {
  const [text, setText] = useState(() => SIGNED_BY.replace(/\S/g, "·"));
  const [sealed, setSealed] = useState(false);

  useEffect(() => {
    // Glyph noise resolves left to right into the signer line, then the seal stamps down
    const start = performance.now();
    const id = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - start) / 900);
      const fixed = Math.floor(k * SIGNED_BY.length);
      setText(
        SIGNED_BY.split("")
          .map((ch, i) => (i < fixed || ch === " " ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0]))
          .join(""),
      );
      if (k >= 1) {
        window.clearInterval(id);
        setSealed(true);
      }
    }, 45);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex h-full flex-col gap-4">
      <PanelHeader status={sealed ? "Signed. Anyone can check where it came from." : "Signing where it was built"} tone={sealed ? "green" : "orange"} />
      <div className="flex flex-1 items-center gap-5">
        <div className="relative flex h-20 w-20 flex-none items-center justify-center">
          <span className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30" />
          <AnimatePresence>
            {sealed && (
              <motion.span
                initial={{ scale: 2.2, rotate: -25, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 14 }}
                className="absolute inset-1.5 flex items-center justify-center rounded-full border-2 border-primary bg-primary/15 text-3xl text-primary shadow-[0_0_24px_4px_rgba(231,125,34,0.35)]"
              >
                ✓
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        <div className="flex min-w-0 flex-col gap-1.5">
          <span className="font-sans text-base font-semibold text-secondary">Build provenance attestation</span>
          <span className="font-mono text-sm text-primary">{text}</span>
          <span className="truncate font-mono text-xs text-secondary/50">
            $ gh attestation verify sentry-linux-amd64 -R montjeffrey/tailnet-sentry
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------- Panel: the release ----------

const ASSETS = [
  "sentry-linux-amd64",
  "sentry-linux-arm64",
  "sentry-darwin-amd64",
  "sentry-darwin-arm64",
  "sentry-windows-amd64.exe",
  "sentry-windows-arm64.exe",
];

function ShipPanel({ shipped, still }: { shipped: boolean; still: boolean }) {
  const [landed, setLanded] = useState(still);
  useEffect(() => {
    if (still) return;
    const t = window.setTimeout(() => setLanded(true), 90 * ASSETS.length + 500);
    return () => clearTimeout(t);
  }, [still]);

  const status = shipped ? "Shipped" : landed ? "6 binaries published, each with its signed record" : "Publishing the release";

  return (
    <div className="flex h-full flex-col gap-3">
      <PanelHeader status={status} tone={landed || shipped ? "green" : "orange"} />
      <div className="flex items-center gap-3">
        <span className="font-serif text-xl text-secondary">tailnet-sentry v0.1.0</span>
        <motion.span
          initial={still ? false : { opacity: 0, scale: 0.6 }}
          animate={{ opacity: landed ? 1 : 0, scale: landed ? 1 : 0.6 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
          className="rounded-full border border-[#4CC38A]/60 px-2 py-0.5 font-mono text-[11px] text-[#4CC38A]"
        >
          Released
        </motion.span>
      </div>
      <ul className="grid flex-1 grid-cols-2 content-start gap-2 sm:grid-cols-3">
        {[...ASSETS, "SHA256SUMS"].map((a, i) => (
          <motion.li
            key={a}
            initial={still ? false : { opacity: 0, y: 18, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 20, delay: still ? 0 : 0.1 + i * 0.09 }}
            className="flex items-center justify-between gap-2 truncate rounded-md border border-secondary/15 bg-bg-dark px-2.5 py-1.5 font-mono text-[11px] text-secondary/80"
          >
            <span className="truncate" title={a}>{a}</span>
            {i < ASSETS.length && <span className="flex-none text-primary">✓</span>}
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function PanelHeader({ status, tone, right }: { status: string; tone: "orange" | "red" | "green"; right?: string }) {
  const dot = tone === "red" ? "bg-red-500" : tone === "green" ? "bg-[#4CC38A]" : "bg-primary animate-pulse";
  const text = tone === "red" ? "text-red-300" : "text-secondary/85";
  return (
    <div className="flex items-center justify-between gap-3 border-b border-secondary/10 pb-2.5">
      <span className={`flex items-center gap-2 font-mono text-sm ${text}`}>
        <span className={`h-2 w-2 flex-none rounded-full ${dot}`} />
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={status} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}>
            {status}
          </motion.span>
        </AnimatePresence>
      </span>
      {right && <span className="flex-none font-mono text-xs text-secondary/50">{right}</span>}
    </div>
  );
}

function StagePanel({ beat, still }: { beat: Beat; still: boolean }) {
  // Jobs beats share one panel so the tiles carry over from run to fail to re-run
  const group = beat === "run" || beat === "fail" || beat === "reset" || beat === "rerun" ? "jobs" : beat === "shipped" ? "ship" : beat;
  const red = beat === "fail";
  return (
    <div
      aria-hidden="true"
      className={`relative h-[232px] overflow-hidden rounded-xl border bg-bg-elevated/95 p-4 transition-colors duration-300 md:p-5 ${
        red ? "border-red-500/50" : "border-secondary/15"
      }`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={group}
          className="h-full"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.22 }}
        >
          {group === "jobs" ? (
            <JobsPanel beat={beat} />
          ) : group === "scan" ? (
            <ScanPanel />
          ) : group === "sign" ? (
            <SignPanel />
          ) : (
            <ShipPanel shipped={beat === "shipped"} still={still} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function PipelineScene() {
  const mode = useParallaxEnabled();
  const wide = useMediaQuery("(min-width: 768px)");
  // Pinning needs room for the whole scene on one screen
  const roomy = useMediaQuery("(min-width: 768px) and (min-height: 700px)");
  const still = mode === "off";
  const pinned = roomy && !still;

  // Wide screens: the scene holds still while ~2.6 screens of scrolling move through the
  // beats. Phones: the list drives it as it scrolls past, under a sticky panel.
  const outerRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress: pinProgress } = useScroll({ target: outerRef, offset: ["start start", "end end"] });
  const { scrollYProgress: listProgress } = useScroll({ target: listRef, offset: ["start 0.75", "end 0.45"] });
  const finished = useMotionValue(1);
  const progress = still ? finished : pinned ? pinProgress : listProgress;

  const [beatIndex, setBeatIndex] = useState(BEATS.length - 1);
  const sync = (p: number) => setBeatIndex(beatAt(p));
  useMotionValueEvent(progress, "change", sync);
  useEffect(() => sync(progress.get()), [progress]); // eslint-disable-line react-hooks/exhaustive-deps
  const beat = BEATS[beatIndex];
  const stage = STAGE_OF[beatIndex];
  const nodes = NODES[beatIndex];

  // The dot springs to its node instead of tracking the scroll, with a little overshoot
  const dotTarget = useMotionValue(DOT_AT[beatIndex]);
  const dot = useSpring(dotTarget, { stiffness: 150, damping: 15 });
  useEffect(() => {
    dotTarget.set(DOT_AT[beatIndex]);
    if (still) dot.jump(DOT_AT[beatIndex]);
  }, [beatIndex, still, dotTarget, dot]);
  const clamped = useTransform(dot, (v) => Math.min(1, Math.max(0, v)));
  const slide = useTransform(clamped, (v) => `${(v - 1) * 100}%`);
  const tone = beat === "fail" ? "bg-red-500" : "bg-primary";

  return (
    <section
      ref={outerRef}
      aria-labelledby="pipeline-heading"
      className="relative bg-bg-dark"
      style={pinned ? { height: "360vh" } : undefined}
    >
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center px-6 pt-16" : "px-6 py-24"}>
        <div className="mx-auto w-full max-w-6xl">
          <div className="flex max-w-3xl flex-col gap-4">
            <span className="font-mono text-sm tracking-widest text-primary">03 · SECDEVOPS</span>
            <h2 id="pipeline-heading" className="font-serif text-4xl leading-tight text-secondary md:text-5xl">
              Builds that fail when they find something that shouldn&apos;t ship.
            </h2>
            <p className="text-lg leading-relaxed text-secondary/70">
              Scroll to follow one release through. A red step stops the line until it&apos;s fixed. Each step is taken from a
              real workflow in my repositories.
            </p>
          </div>

          {/* Phones and short screens: the panel sits above the list and stays in view while the list scrolls */}
          {!pinned && (
            <div className={`z-20 mt-8 md:mx-auto md:max-w-2xl ${still ? "" : "sticky top-20 md:static"}`}>
              <StagePanel beat={beat} still={still} />
            </div>
          )}

          <div className="relative mt-8">
            {/* Line, fill, and traveler. Phones: down the left edge. Wider: across the node row. */}
            <div
              aria-hidden="true"
              className={`absolute left-[14px] top-[14px] w-px md:left-[10%] md:right-[10%] md:h-px md:w-auto ${
                pinned ? "" : "h-[80%]"
              }`}
            >
              <div className="absolute inset-0 bg-secondary/15" />
              <motion.div
                className={`absolute inset-0 ${tone} transition-colors duration-300 ${wide ? "origin-left" : "origin-top"}`}
                style={wide ? { scaleX: clamped } : { scaleY: clamped }}
              />
              <motion.div className="absolute inset-0" style={wide ? { x: slide } : { y: slide }}>
                <span
                  className={`absolute h-3.5 w-3.5 rounded-full ${tone} shadow-[0_0_14px_4px_rgba(231,125,34,0.45)] transition-colors duration-300 ${
                    wide ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2" : "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                  }`}
                />
              </motion.div>
            </div>

            <ol ref={listRef} className={`relative grid md:grid-cols-5 ${pinned ? "" : "auto-rows-fr md:auto-rows-auto"}`}>
              {STAGES.map((s, i) => (
                <li
                  key={s.label}
                  className={
                    pinned
                      ? "flex flex-col items-center gap-2 px-3 text-center"
                      : "grid grid-cols-[1.75rem_1fr] gap-x-4 pb-10 md:flex md:flex-col md:items-center md:gap-4 md:px-3 md:pb-0 md:text-center"
                  }
                >
                  <Node state={nodes[i]} index={i} />
                  <div className="flex flex-col gap-1.5">
                    <h3
                      className={`font-sans font-semibold transition-colors duration-300 ${pinned ? "text-base" : "text-lg"} ${
                        pinned && i !== stage ? "text-secondary/50" : "text-secondary"
                      }`}
                    >
                      {s.label}
                    </h3>
                    {pinned ? (
                      <p className="sr-only">{s.text}</p>
                    ) : (
                      <>
                        <p className="text-[15px] leading-relaxed text-secondary/70">{s.text}</p>
                        <a
                          href={s.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs text-primary/90 underline-offset-4 hover:underline"
                        >
                          {s.source} →
                        </a>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {pinned ? (
            <div className="mt-6 grid grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] gap-8">
              <StagePanel beat={beat} still={still} />
              <div className="flex flex-col justify-between gap-4 py-1">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={stage}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -12 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2"
                  >
                    <span className="font-mono text-xs tracking-widest text-primary">
                      STEP {stage + 1} OF {STAGES.length}
                    </span>
                    <span aria-hidden="true" className="font-serif text-2xl text-secondary">
                      {STAGES[stage].label}
                    </span>
                    <span aria-hidden="true" className="text-[15px] leading-relaxed text-secondary/70">
                      {STAGES[stage].text}
                    </span>
                    <a
                      href={STAGES[stage].href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-mono text-xs text-primary/90 underline-offset-4 hover:underline"
                    >
                      {STAGES[stage].source} →
                    </a>
                  </motion.div>
                </AnimatePresence>
                <ul className="flex flex-wrap gap-2">
                  {FACTS.map((f) => (
                    <li key={f} className="rounded-full border border-secondary/15 px-3 py-1 font-mono text-xs text-secondary/60">
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <>
              <ul className="mt-12 flex flex-wrap gap-2 md:justify-center">
                {FACTS.map((f) => (
                  <li key={f} className="rounded-full border border-secondary/15 px-3 py-1 font-mono text-xs text-secondary/60">
                    {f}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
