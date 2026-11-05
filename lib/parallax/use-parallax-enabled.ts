"use client";

import { useReducedMotion } from "framer-motion";
import { usePerformanceTier } from "@/hooks/use-performance-tier";

export type ParallaxMode = "full" | "reduced" | "off";

// Stays "off" until the performance tier is detected, so the first client render
// matches the server render and nothing jumps once detection lands.
export function useParallaxEnabled(): ParallaxMode {
  const reducedMotion = useReducedMotion();
  const tier = usePerformanceTier();

  if (reducedMotion) return "off";

  switch (tier) {
    case "high":
    case "flagship":
      return "full";
    case "medium":
      return "reduced";
    case "low":
    case null:
    default:
      return "off";
  }
}
