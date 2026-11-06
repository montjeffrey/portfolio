"use client";

import { useReducedMotion } from "framer-motion";
import { usePerformanceTier } from "@/hooks/use-performance-tier";

export type ParallaxMode = "full" | "reduced" | "off";

// Stays "off" until the performance tier is detected, so the first client render
// matches the server render and nothing jumps once detection lands.
//
// Scroll-linked motion is transform/opacity only, which the compositor handles even on
// budget phones, so every detected tier gets motion; low-end phones get the shorter
// "reduced" travel. Only the user's reduced-motion preference turns it off.
export function useParallaxEnabled(): ParallaxMode {
  const reducedMotion = useReducedMotion();
  const tier = usePerformanceTier();

  if (reducedMotion) return "off";

  switch (tier) {
    case "high":
    case "flagship":
      return "full";
    case "medium":
    case "low":
      return "reduced";
    case null:
    default:
      return "off";
  }
}
