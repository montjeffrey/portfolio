// Shared intro choreography for both hero beams (the bloom-composer BeamBackground and
// the shader-only MobileBeam): loading → anticipation (gather) → burst → idle.
// Each frame the caller asks for the target state at the elapsed time and eases its
// current state toward it, so every tier plays the same sequence.

export interface BeamState {
  amp: number;       // wave amplitude
  speed: number;     // wave phase speed
  opacity: number;   // dot opacity
  falloff: number;   // how much the wave lags with distance from center
  expansion: number; // radial push (negative gathers inward)
  glow: number;      // bloom multiplier: 1 = resting glow, 3 = burst flash
}

const ANTICIPATION_START = 1.75;
const ANTICIPATION_DURATION = 1.0;
const BURST_DURATION = 0.8;
const IDLE_BLEND = 1.5;

// Reduced motion starts the clock past the intro so the field settles straight into idle.
export const REDUCED_MOTION_SKIP_SECONDS = 10;

export const INITIAL_BEAM_STATE: BeamState = {
  amp: 0,
  speed: 0.4,
  opacity: 0,
  falloff: 0.005,
  expansion: -1.1,
  glow: 0,
};

const clamp01 = (v: number) => Math.min(Math.max(v, 0), 1);
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function mix(a: BeamState, b: BeamState, t: number): BeamState {
  return {
    amp: lerp(a.amp, b.amp, t),
    speed: lerp(a.speed, b.speed, t),
    opacity: lerp(a.opacity, b.opacity, t),
    falloff: lerp(a.falloff, b.falloff, t),
    expansion: lerp(a.expansion, b.expansion, t),
    glow: lerp(a.glow, b.glow, t),
  };
}

export function introTarget(
  elapsedSeconds: number,
  opts: { loadingOpacity: number; idleOpacity: number; reduceMotion: boolean },
): BeamState {
  const loading: BeamState = { amp: 0.6, speed: 0.25, opacity: opts.loadingOpacity, falloff: 0.02, expansion: -0.2, glow: 1 };
  const anticipation: BeamState = { amp: 0.2, speed: 1.5, opacity: 1, falloff: 0.03, expansion: -0.8, glow: 0.5 };
  const burst: BeamState = { amp: 2.5, speed: 0.1, opacity: 1, falloff: 0.01, expansion: 1.5, glow: 3 };
  const idle: BeamState = {
    amp: opts.reduceMotion ? 0.25 : 0.8,
    speed: opts.reduceMotion ? 0.15 : 0.4,
    opacity: opts.idleOpacity,
    falloff: 0.04,
    expansion: 0,
    glow: 1,
  };

  const anticipationEnd = ANTICIPATION_START + ANTICIPATION_DURATION;
  const burstEnd = anticipationEnd + BURST_DURATION;

  let target = mix(loading, anticipation, smoothstep(ANTICIPATION_START, anticipationEnd, elapsedSeconds));
  if (elapsedSeconds > ANTICIPATION_START) {
    target = mix(target, burst, smoothstep(anticipationEnd, burstEnd, elapsedSeconds));
  }
  if (elapsedSeconds > anticipationEnd) {
    target = mix(target, idle, smoothstep(burstEnd, burstEnd + IDLE_BLEND, elapsedSeconds));
  }
  return target;
}

// Eases `current` toward `target` in place by the given factor (0..1).
export function easeToward(current: BeamState, target: BeamState, factor: number): void {
  current.amp += (target.amp - current.amp) * factor;
  current.speed += (target.speed - current.speed) * factor;
  current.opacity += (target.opacity - current.opacity) * factor;
  current.falloff += (target.falloff - current.falloff) * factor;
  current.expansion += (target.expansion - current.expansion) * factor;
  current.glow += (target.glow - current.glow) * factor;
}
