"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ResumeModal } from '@/components/ui/resume-modal';
import { MobileScrollIndicator } from '@/components/ui/mobile-scroll-indicator';
import { usePerformanceTier } from '@/hooks/use-performance-tier';
import { MobileBeam } from './hero/MobileBeam';
import { INITIAL_BEAM_STATE, REDUCED_MOTION_SKIP_SECONDS, easeToward, introTarget, type BeamState } from './hero/intro-timeline';
import { useParallaxEnabled } from '@/lib/parallax/use-parallax-enabled';
import { HERO_RECEDE } from '@/lib/parallax/constants';

interface BeamBackgroundProps {
  isMobile: boolean;
  tier: 'flagship' | 'high';
}

const BeamBackground: React.FC<BeamBackgroundProps> = ({ isMobile, tier }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Current beam state, eased toward the intro timeline's target each frame. Starts
  // collapsed and invisible with the bloom at its resting strength.
  const paramsRef = useRef<BeamState>({ ...INITIAL_BEAM_STATE, glow: 1 });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: false,
      powerPreference: 'high-performance',
      precision: tier === 'flagship' ? 'mediump' : 'highp', // mediump saves GPU cycles on mobile
    });

    // Pixel ratio: 1.5 on phones/tablets keeps the dots crisp on 3x screens while the
    // composer and bloom render targets stay a fraction of a full-resolution buffer.
    const pixelRatio = tier === 'flagship' ?
      Math.min(window.devicePixelRatio, 1.5) :
      Math.min(window.devicePixelRatio, 2.0);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0d0d0d, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    const camera = new THREE.OrthographicCamera();

    // Phones and tablets: a tighter grid than before so the dots read as dense as on desktop.
    // The field extends ~3x the screen's longer side in both directions, like desktop, because
    // the wave contracts it toward the center and the phone may rotate after mount; the
    // total is capped to bound the per-frame loop.
    const flagshipGrid = (() => {
      const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
      const longSide = 10 * Math.max(aspect, 1);
      const coverage = 3;
      const maxDots = 3600;
      const spacing = Math.max(0.45, (coverage * longSide) / Math.sqrt(maxDots));
      const cols = Math.ceil((coverage * longSide) / spacing);
      return { cols, rows: cols, spacing, dotRadius: spacing * 0.05, segments: 8 };
    })();

    const TIER_CONFIG = {
      flagship: {
        grid: flagshipGrid,
        // Threshold sits below a single dot's brightness so the bloom actually catches the
        // field; at the old 0.6 only overlapping dots crossed it and the burst never glowed.
        bloom: { strength: 0.35, radius: 0.6, threshold: 0.2, enabled: true },
        rgbShift: { amount: 0, enabled: false },
        pixelRatio: 1.5
      },
      high: {
        grid: { cols: 100, rows: 100, dotRadius: 0.025, spacing: 0.55, segments: 8 },
        bloom: { strength: 0.5, radius: 0.9, threshold: 0.2, enabled: true },
        rgbShift: { amount: 0.002, enabled: true },
        pixelRatio: 2.0
      }
    };

    const config = TIER_CONFIG[tier];

    // Setup Post-Processing with tiered settings
    let composer: EffectComposer | null = null;
    let rgbShift: ShaderPass | null = null;
    let bloom: UnrealBloomPass | null = null;

    const renderPass = new RenderPass(scene, camera);

    // Only enable bloom if configured
    if (config.bloom.enabled) {
      bloom = new UnrealBloomPass(
        new THREE.Vector2(container.clientWidth, container.clientHeight),
        config.bloom.strength,
        config.bloom.radius,
        config.bloom.threshold
      );
    }

    // Only enable RGB shift if configured (disabled for flagship mobile)
    if (config.rgbShift.enabled) {
      rgbShift = new ShaderPass(RGBShiftShader);
      rgbShift.uniforms['amount'].value = config.rgbShift.amount;
      rgbShift.uniforms['angle'].value = Math.PI / 4;
    }

    composer = new EffectComposer(renderer);
    composer.addPass(renderPass);
    if (bloom) composer.addPass(bloom);
    if (rgbShift) composer.addPass(rgbShift);

    // Grid configuration based on tier
    const GRID = {
      cols: config.grid.cols,
      rows: config.grid.rows,
      jitter: 0.25,
      hexOffset: 0.5,
      dotRadius: config.grid.dotRadius,
      spacing: config.grid.spacing
    };

    const total = GRID.cols * GRID.rows;
    const geometry = new THREE.CircleGeometry(GRID.dotRadius, config.grid.segments);

    // Use additive blending for glowing beam aesthetic
    const material = new THREE.MeshBasicMaterial({
      color: 0xe77d22,
      blending: THREE.AdditiveBlending,
      opacity: tier === 'flagship' ? 0.85 : 1.0, // Slightly lower for better mobile perf
      transparent: tier === 'flagship',
      depthWrite: false // Optimization: skip depth buffer writes for transparent objects
    });

    const dots = new THREE.InstancedMesh(geometry, material, total);
    dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(dots);

    const basePos = new Float32Array(total * 2);
    const distArr = new Float32Array(total);

    // Direct buffer access for maximum performance (bypasses setMatrixAt overhead)
    const matrixArray = dots.instanceMatrix.array as Float32Array;

    let xOffset = (GRID.cols - 1) * GRID.spacing * 0.5;
    let yOffset = (GRID.rows - 1) * GRID.spacing * 0.5;

    // Synchronous initialization for instant startup - fixes "laggy" initial load
    for (let idx = 0; idx < total; idx++) {
      const r = Math.floor(idx / GRID.cols);
      const c = idx % GRID.cols;

      let x = c * GRID.spacing - xOffset;
      let y = r * GRID.spacing - yOffset;
      y += (c % 2) * GRID.hexOffset * GRID.spacing;
      x += (Math.random() - 0.5) * GRID.jitter;
      y += (Math.random() - 0.5) * GRID.jitter;
      basePos[idx * 2 + 0] = x;
      basePos[idx * 2 + 1] = y;
      const len = Math.hypot(x, y);
      distArr[idx] = len;

      // Note: We don't set initial matrix here because the animate loop
      // will immediately update all matrices on the first frame using
      // direct buffer access, which is much faster.
    }



    const clock = new THREE.Clock();
    let animationFrameId: number;
    let lastFrameTime = performance.now();
    const targetFrameTime = tier === 'flagship' ? 1000 / 60 : 1000 / 120; // 60fps for mobile, 120fps for desktop

    // Reduced motion skips the intro burst and settles straight into a calm idle
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const startTime = reduceMotion ? lastFrameTime - REDUCED_MOTION_SKIP_SECONDS * 1000 : lastFrameTime;

    // Cursor gravity: dots near the pointer lean toward it. Desktop only, since touch has no hover.
    const gravityEnabled = !isMobile && !reduceMotion && window.matchMedia('(hover: hover)').matches;
    const GRAVITY_RADIUS_SQ = 2.4 * 2.4;
    const GRAVITY_STRENGTH = 0.32;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0, active: 0, targetActive: 0 };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const inside = event.clientY >= rect.top && event.clientY <= rect.bottom;
      pointer.targetX = camera.left + ((event.clientX - rect.left) / rect.width) * (camera.right - camera.left);
      pointer.targetY = camera.top - ((event.clientY - rect.top) / rect.height) * (camera.top - camera.bottom);
      pointer.targetActive = inside ? 1 : 0;
    };
    const handlePointerLeave = () => {
      pointer.targetActive = 0;
    };
    if (gravityEnabled) {
      window.addEventListener('pointermove', handlePointerMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', handlePointerLeave);
    }

    const TWO_PI = Math.PI * 2;
    const freq = 0.25;
    const smoothing = 2.5;
    const timelineOpts = {
      loadingOpacity: tier === 'flagship' ? 0.6 : 0.75,
      idleOpacity: tier === 'flagship' ? 0.85 : 1.0,
      reduceMotion,
    };

    function animate() {
      animationFrameId = requestAnimationFrame(animate);

      // Throttle frame rate for mobile to reduce CPU load
      const now = performance.now();
      const delta = now - lastFrameTime;

      if (delta < targetFrameTime) {
        return; // Skip this frame
      }

      lastFrameTime = now - (delta % targetFrameTime);

      const dtSeconds = Math.min(delta / 1000, 0.1);
      const lerpFactor = 1 - Math.exp(-smoothing * dtSeconds);
      const elapsedSeconds = (now - startTime) / 1000;
      const t = clock.getElapsedTime();

      // Loading -> anticipation -> burst -> idle, eased so phase changes never snap
      easeToward(paramsRef.current, introTarget(elapsedSeconds, timelineOpts), lerpFactor);

      const { amp: currentAmp, speed: currentSpeed, opacity: currentOpacity, falloff: currentFalloff, expansion: currentExpansion, glow: currentGlow } = paramsRef.current;
      const currentBloomStrength = config.bloom.strength * currentGlow;

      // Update Bloom Strength dynamically
      if (bloom) {
        bloom.strength = currentBloomStrength;
      }

      // Update material opacity
      material.opacity = currentOpacity;

      const phase = (Math.sin(TWO_PI * t * freq) + 1) * 0.5;

      if (rgbShift) {
        rgbShift.uniforms['amount'].value = 0.0015 + phase * 0.003;
      }

      if (gravityEnabled) {
        // Snap to the pointer when gravity is off so the well doesn't sweep in from the old spot
        if (pointer.active < 0.01) {
          pointer.x = pointer.targetX;
          pointer.y = pointer.targetY;
        }
        const follow = 1 - Math.exp(-8 * dtSeconds);
        pointer.x += (pointer.targetX - pointer.x) * follow;
        pointer.y += (pointer.targetY - pointer.y) * follow;
        pointer.active += (pointer.targetActive - pointer.active) * (1 - Math.exp(-4 * dtSeconds));
      }
      const pull = GRAVITY_STRENGTH * pointer.active;

      // Update instance matrices using direct buffer writes (faster than setMatrixAt)
      for (let i = 0; i < total; i++) {
        const x0 = basePos[i * 2 + 0];
        const y0 = basePos[i * 2 + 1];
        const dist = distArr[i];

        // Use interpolated speed, amp, and falloff
        const tt = t * currentSpeed - dist * currentFalloff;

        // Base sine wave modulation
        let k = 1 + Math.sin(TWO_PI * tt * freq) * currentAmp;

        // Apply pure outward expansion
        k += currentExpansion;

        let px = x0 * k;
        let py = y0 * k;

        if (pull > 0.001) {
          const dx = pointer.x - px;
          const dy = pointer.y - py;
          const d2 = dx * dx + dy * dy;
          if (d2 < GRAVITY_RADIUS_SQ) {
            const fall = 1 - d2 / GRAVITY_RADIUS_SQ;
            const f = fall * fall * pull;
            px += dx * f;
            py += dy * f;
          }
        }

        // Direct buffer write - only update translation (m12, m13) since scale/rotation are identity
        const offset = i * 16;
        matrixArray[offset] = 1;       // m0
        matrixArray[offset + 5] = 1;   // m5
        matrixArray[offset + 10] = 1;  // m10
        matrixArray[offset + 12] = px; // m12 (x translation)
        matrixArray[offset + 13] = py; // m13 (y translation)
        matrixArray[offset + 15] = 1;  // m15
      }
      dots.instanceMatrix.needsUpdate = true;

      if (composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    }

    const resizeCamera = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const aspect = w / h;
      const worldHeight = 10;
      const worldWidth = worldHeight * aspect;

      camera.left = -worldWidth / 2;
      camera.right = worldWidth / 2;
      camera.top = worldHeight / 2;
      camera.bottom = -worldHeight / 2;
      camera.near = -100;
      camera.far = 100;
      camera.position.set(0, 0, 10);
      camera.updateProjectionMatrix();

      renderer.setSize(w, h);

      if (composer) {
        composer.setSize(w, h);
      }
      if (rgbShift && rgbShift.uniforms['resolution']) {
        rgbShift.uniforms['resolution'].value.set(w, h);
      }
      if (bloom) {
        bloom.setSize(w, h);
      }
    };

    const observer = new ResizeObserver(() => {
      resizeCamera();
    });
    observer.observe(container);

    resizeCamera();

    // Shader Pre-compilation & Warmup to prevent initial stutter
    // 1. Force shader compilation
    renderer.compile(scene, camera);

    // 2. Initial warmup render (invisible) to upload buffers to GPU
    // Ensure it's invisible to avoid flash
    const initialOpacity = material.opacity;
    material.opacity = 0;

    // Force a render cycle
    if (composer) {
      composer.render();
    } else {
      renderer.render(scene, camera);
    }

    // Restore opacity logic triggers in the loop, but reset just in case
    material.opacity = initialOpacity;

    const canvas = renderer.domElement;

    // Pause the render loop while the tab is backgrounded so we stop holding GPU memory
    // when nothing is visible — sustained off-screen usage is a common trigger for the
    // mobile browser deciding to discard/reload the tab.
    const handleVisibility = () => {
      window.cancelAnimationFrame(animationFrameId);
      if (!document.hidden) {
        lastFrameTime = performance.now();
        animate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    // If the OS reclaims the WebGL context (memory pressure), recover instead of wedging.
    const handleContextLost = (event: Event) => {
      event.preventDefault();
      window.cancelAnimationFrame(animationFrameId);
    };
    const handleContextRestored = () => {
      window.cancelAnimationFrame(animationFrameId);
      lastFrameTime = performance.now();
      animate();
    };
    canvas.addEventListener('webglcontextlost', handleContextLost as EventListener, false);
    canvas.addEventListener('webglcontextrestored', handleContextRestored as EventListener, false);

    animate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      document.documentElement.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('visibilitychange', handleVisibility);
      canvas.removeEventListener('webglcontextlost', handleContextLost as EventListener);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored as EventListener);
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      geometry.dispose();
      material.dispose();
      if (bloom) bloom.dispose();
      if (composer) composer.dispose();
      // Critical: actually release the GPU context. Without renderer.dispose() +
      // forceContextLoss() the browser keeps the context and its bloom render targets
      // alive long after unmount, accumulating across re-inits until iOS reloads the tab.
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, [isMobile, tier]);

  return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
};

const MemoizedBeamBackground = React.memo(BeamBackground);

export default function Hero() {
  const [textIndex, setTextIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);

  const tier = usePerformanceTier(); // Use our new hook
  const parallaxMode = useParallaxEnabled();

  // Desktop (high) and flagship mobile get BeamBackground with post-processing
  // Medium/Low tier gets shader-based MobileBeam
  const showHeavyBeam = tier === 'high' || tier === 'flagship';

  // Hero content lifts and fades as the page scrolls past it (transform + opacity only)
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const recedeY = useTransform(scrollYProgress, [0, 1], HERO_RECEDE.contentY);
  const recedeOpacity = useTransform(scrollYProgress, [0, 0.8], HERO_RECEDE.opacity);
  const recedeStyle = parallaxMode === 'off' ? undefined : { y: recedeY, opacity: recedeOpacity };

  const skills = ['Security', 'Automation', 'Infrastructure', 'Agent Tooling'];

  useEffect(() => {
    const fullText = skills[textIndex];

    const handleTyping = () => {
      if (isDeleting) {
        setDisplayText((prev: string) => prev.substring(0, prev.length - 1));
      } else {
        setDisplayText((prev: string) => fullText.substring(0, prev.length + 1));
      }
    };

    const typingSpeed = isDeleting ? 75 : 150;
    const typeInterval = setInterval(handleTyping, typingSpeed);

    if (!isDeleting && displayText === fullText) {
      setTimeout(() => setIsDeleting(true), 2000);
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setTextIndex((prev: number) => (prev + 1) % skills.length);
    }

    return () => clearInterval(typeInterval);
  }, [displayText, isDeleting, textIndex, skills, tier]); // Add tier to deps

  return (
    <div ref={heroRef} className="relative w-full min-h-[100dvh] h-auto bg-bg-dark overflow-hidden pb-20 sm:pb-10">
      {/* Background Layer - wait for the resolved tier before mounting any renderer so
          phones never spin up (and then leak) the desktop-class WebGL scene. The dark
          container background covers this sub-second detection window. */}
      {tier === null ? null : showHeavyBeam ? (
        <MemoizedBeamBackground
          isMobile={tier === 'flagship'}
          tier={tier as 'flagship' | 'high'}
        />
      ) : (
        <MobileBeam performanceTier={tier as 'medium' | 'low'} />
      )}

      {/* Content Layer - the headline is in the first paint; the beam intro plays behind it */}
      <motion.div
        style={recedeStyle}
        className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-10rem)] px-8 sm:px-6 text-center"
      >
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <div className="space-y-8 sm:space-y-6">
            <h1 className="text-[clamp(2rem,5vw,6rem)] font-serif text-secondary leading-tight px-4 sm:px-2">
              I build systems that move fast without moving recklessly.
            </h1>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="space-y-8 sm:space-y-6"
            >
              <p className="text-[clamp(1rem,2vw,1.875rem)] text-secondary/80 font-light leading-relaxed max-w-4xl mx-auto px-4">
                Security-minded systems engineer. Data pipelines, integrations, and developer tooling, secured as they&apos;re built. CompTIA Security+.
              </p>
              <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 text-[clamp(2rem,10.5vw,2.5rem)] sm:text-[clamp(2.5rem,4vw,3.5rem)] font-serif mt-8 sm:mt-12 min-h-[4rem]">
                <span className="text-secondary">Specializing in</span>
                <span className="relative min-w-[240px] sm:min-w-[300px] max-w-full text-center">
                  <span className="relative z-10 text-primary px-4 py-2 rounded-md bg-secondary/95 backdrop-blur-sm inline-block">
                    {displayText}
                    <span className="animate-pulse">|</span>
                  </span>
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-6 sm:gap-4 justify-center mt-16 sm:mt-12 w-full max-w-md sm:max-w-none mx-auto"
          >
            <Link
              href="/projects"
              className="px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25 w-full sm:w-auto"
            >
              View My Projects
            </Link>
            <button
              onClick={() => setIsResumeModalOpen(true)}
              className="px-8 py-4 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm w-full sm:w-auto"
              aria-label="Download resume - opens resume selection modal"
            >
              Download Resume
            </button>
          </motion.div>
        </div>
      </motion.div>

      <div className="block sm:hidden">
        <MobileScrollIndicator />
      </div>

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
