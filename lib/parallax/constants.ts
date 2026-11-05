export const DEPTH = {
  far: -0.12,
  mid: -0.28,
  near: -0.45,
  lift: 0.10,
} as const;
export type DepthName = keyof typeof DEPTH;
export const MOBILE_DISTANCE_SCALE = 0.4;
export const HERO_RECEDE = {
  scale: [1, 1.18] as [number, number],
  opacity: [1, 0] as [number, number],
  contentY: [0, -120] as [number, number],
};
