"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useMotionValue, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { DEPTH, MOBILE_DISTANCE_SCALE, type DepthName } from "@/lib/parallax/constants";
import { useParallaxEnabled, type ParallaxMode } from "@/lib/parallax/use-parallax-enabled";

// Scroll-linked motion here is compositor-only (transform and opacity). Never drive
// filter, blur or layout properties from scroll: mobile Safari reloads the tab.

interface SceneContextValue {
  progress: MotionValue<number>;
  mode: ParallaxMode;
}

const SceneContext = createContext<SceneContextValue | null>(null);

export function ScrollScene({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const mode = useParallaxEnabled();

  return (
    <div ref={ref} className={cn("relative", className)}>
      <SceneContext.Provider value={{ progress: scrollYProgress, mode }}>
        {children}
      </SceneContext.Provider>
    </div>
  );
}

// Scroll progress and parallax mode of the enclosing ScrollScene, for scenes that
// drive their own transforms. Null outside a ScrollScene.
export function useSceneProgress(): SceneContextValue | null {
  return useContext(SceneContext);
}

export function ParallaxLayer({
  depth,
  scaleRange,
  opacityRange,
  className,
  children,
}: {
  depth: DepthName;
  scaleRange?: [number, number];
  opacityRange?: [number, number];
  className?: string;
  children?: ReactNode;
}) {
  const ctx = useContext(SceneContext);
  const fallbackProgress = useMotionValue(0);
  const progress = ctx?.progress ?? fallbackProgress;
  const mode = ctx?.mode ?? "off";

  const travel = DEPTH[depth] * 300 * (mode === "reduced" ? MOBILE_DISTANCE_SCALE : 1);
  const y = useTransform(progress, [0, 1], [-travel, travel]);
  const scale = useTransform(progress, [0, 1], scaleRange ?? [1, 1]);
  const opacity = useTransform(progress, [0, 1], opacityRange ?? [1, 1]);

  if (!ctx || mode === "off") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ y, scale, opacity, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}

export function ProgressReveal({
  start,
  end,
  yFrom = 24,
  className,
  children,
}: {
  start: number;
  end: number;
  yFrom?: number;
  className?: string;
  children?: ReactNode;
}) {
  const ctx = useContext(SceneContext);
  const fallbackProgress = useMotionValue(0);
  const progress = ctx?.progress ?? fallbackProgress;
  const mode = ctx?.mode ?? "off";

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [yFrom, 0]);

  if (!ctx || mode === "off") {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div style={{ opacity, y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}
