"use client";

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { RGBShiftShader } from 'three/examples/jsm/shaders/RGBShiftShader.js';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ResumeModal } from '@/components/ui/resume-modal';
import { MobileScrollIndicator } from '@/components/ui/mobile-scroll-indicator';
import { usePerformanceTier } from '@/hooks/use-performance-tier';
import { MobileBeam } from './hero/MobileBeam';

interface BeamBackgroundProps {
  isMobile: boolean;
  tier: 'flagship' | 'high';
}

const BeamBackground: React.FC<BeamBackgroundProps> = ({ isMobile, tier }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for smooth parameter transitions
  const paramsRef = useRef({
    amp: 0,              // Start with no wave (grow into it)
    speed: 0.4,
    opacity: 0,          // Start invisible (fade in)
    falloff: 0.005,      // Start with "bloom" wide wave
    expansion: -1.1,     // Start collapsed at center
    bloomStrength: 0,    // Track bloom intensity dynamically
  });

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

    // Aggressive pixel ratio optimization for mobile
    const pixelRatio = tier === 'flagship' ?
      Math.min(window.devicePixelRatio, 1.0) : // 1.0 for maximum mobile performance
      Math.min(window.devicePixelRatio, 2.0);
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x0d0d0d, 1);
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d0d);

    const camera = new THREE.OrthographicCamera();

    // Optimized for smooth 60fps on flagship mobile - reduced dot count, lighter bloom
    const TIER_CONFIG = {
      flagship: {
        grid: { cols: 35, rows: 35, dotRadius: 0.048, spacing: 0.85, segments: 3 }, // 35x35 = 1,225 dots (larger dots, wider spacing)
        bloom: { strength: 0.12, radius: 0.15, threshold: 0.6, enabled: true }, // Minimal bloom
        rgbShift: { amount: 0, enabled: false },
        pixelRatio: 1.0
      },
      high: {
        grid: { cols: 100, rows: 100, dotRadius: 0.025, spacing: 0.55, segments: 8 },
        bloom: { strength: 0.5, radius: 0.9, threshold: 0.2, enabled: true },
        rgbShift: { amount: 0.002, enabled: true },
        pixelRatio: 2.0
      }
    };

    const config = TIER_CONFIG[tier];

    // Initialize bloom strength target based on tier
    paramsRef.current.bloomStrength = config.bloom.strength;

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
    const startTime = lastFrameTime;

    // Pre-computed constants
    const TWO_PI = Math.PI * 2;
    const freq = 0.25;
    const smoothing = 2.5;
    const flushStartSeconds = 1.75; // Start anticipation earlier (was 2.5)
    const anticipationDuration = 1.0;
    const burstDuration = 0.8;
    const idleBlendSeconds = 1.5;

    const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1);
    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = clamp01((x - edge0) / (edge1 - edge0));
      return t * t * (3 - 2 * t);
    };

    const loadingTargets = {
      amp: 0.6,
      speed: 0.25,
      opacity: tier === 'flagship' ? 0.6 : 0.75,
      falloff: 0.02,
      expansion: -0.2,
      bloomStrength: config.bloom.strength
    };

    // Phase 1: Anticipation (Gather & Dim) through tighter contraction
    const anticipationTargets = {
      amp: 0.2,           // Calm before storm
      speed: 1.5,         // Speed up significantly
      opacity: 1.0,       // Full visibility
      falloff: 0.03,      // Tighter beam
      expansion: -0.8,    // Pull INWARD strongly (Gather)
      bloomStrength: config.bloom.strength * 0.5 // Dim slightly
    };

    // Phase 2: Bloom Burst (Explosion)
    const burstTargets = {
      amp: 2.5,
      speed: 0.1,         // Slow motion explosion look
      opacity: 1.0,
      falloff: 0.01,      // Wide beam
      expansion: 1.5,     // Expand outward (but not offscreen)
      bloomStrength: config.bloom.strength * 3.0 // FLASH!
    };

    const idleTargets = {
      amp: 0.8,
      speed: 0.4,
      opacity: tier === 'flagship' ? 0.85 : 1.0,
      falloff: 0.04,
      expansion: 0,
      bloomStrength: config.bloom.strength
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

      // --- TRANSITION LOGIC ---
      // 1. Loading -> Anticipation
      const anticipationStart = flushStartSeconds;
      const anticipationEnd = anticipationStart + anticipationDuration;

      // 2. Anticipation -> Burst
      const burstStart = anticipationEnd;
      const burstEnd = burstStart + burstDuration;

      // 3. Burst -> Idle
      const idleStart = burstEnd;
      const idleEnd = idleStart + idleBlendSeconds;

      const antiBlend = smoothstep(anticipationStart, anticipationEnd, elapsedSeconds);
      const burstBlend = smoothstep(burstStart, burstEnd, elapsedSeconds);
      const idleBlend = smoothstep(idleStart, idleEnd, elapsedSeconds);

      // Multi-stage Lerp chain
      // Current Target = Lerp(PreviousTarget, NextTarget, BlendFactor)

      // Stage 1: Loading -> Anticipation
      let targetAmp = THREE.MathUtils.lerp(loadingTargets.amp, anticipationTargets.amp, antiBlend);
      let targetSpeed = THREE.MathUtils.lerp(loadingTargets.speed, anticipationTargets.speed, antiBlend);
      let targetOpacity = THREE.MathUtils.lerp(loadingTargets.opacity, anticipationTargets.opacity, antiBlend);
      let targetFalloff = THREE.MathUtils.lerp(loadingTargets.falloff, anticipationTargets.falloff, antiBlend);
      let targetExpansion = THREE.MathUtils.lerp(loadingTargets.expansion, anticipationTargets.expansion, antiBlend);
      let targetBloomStr = THREE.MathUtils.lerp(loadingTargets.bloomStrength, anticipationTargets.bloomStrength, antiBlend);

      // Stage 2: -> Burst (Overwrites Stage 1 as flow progresses)
      if (elapsedSeconds > anticipationStart) {
        targetAmp = THREE.MathUtils.lerp(targetAmp, burstTargets.amp, burstBlend);
        targetSpeed = THREE.MathUtils.lerp(targetSpeed, burstTargets.speed, burstBlend);
        targetOpacity = THREE.MathUtils.lerp(targetOpacity, burstTargets.opacity, burstBlend);
        targetFalloff = THREE.MathUtils.lerp(targetFalloff, burstTargets.falloff, burstBlend);
        targetExpansion = THREE.MathUtils.lerp(targetExpansion, burstTargets.expansion, burstBlend);
        targetBloomStr = THREE.MathUtils.lerp(targetBloomStr, burstTargets.bloomStrength, burstBlend);
      }

      // Stage 3: -> Idle
      if (elapsedSeconds > burstStart) {
        targetAmp = THREE.MathUtils.lerp(targetAmp, idleTargets.amp, idleBlend);
        targetSpeed = THREE.MathUtils.lerp(targetSpeed, idleTargets.speed, idleBlend);
        targetOpacity = THREE.MathUtils.lerp(targetOpacity, idleTargets.opacity, idleBlend);
        targetFalloff = THREE.MathUtils.lerp(targetFalloff, idleTargets.falloff, idleBlend);
        targetExpansion = THREE.MathUtils.lerp(targetExpansion, idleTargets.expansion, idleBlend);
        targetBloomStr = THREE.MathUtils.lerp(targetBloomStr, idleTargets.bloomStrength, idleBlend);
      }

      // Smoothly interpolate current values towards targets (Lerp)
      // Factor 0.04 gives a nice ease-out feel
      paramsRef.current.amp += (targetAmp - paramsRef.current.amp) * lerpFactor;
      paramsRef.current.speed += (targetSpeed - paramsRef.current.speed) * lerpFactor;
      paramsRef.current.opacity += (targetOpacity - paramsRef.current.opacity) * lerpFactor;
      paramsRef.current.falloff += (targetFalloff - paramsRef.current.falloff) * lerpFactor;
      paramsRef.current.bloomStrength += (targetBloomStr - paramsRef.current.bloomStrength) * lerpFactor;
      paramsRef.current.expansion += (targetExpansion - paramsRef.current.expansion) * lerpFactor;

      const { amp: currentAmp, speed: currentSpeed, opacity: currentOpacity, falloff: currentFalloff, expansion: currentExpansion, bloomStrength: currentBloomStrength } = paramsRef.current;

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

        const px = x0 * k;
        const py = y0 * k;

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

    animate();

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(animationFrameId);
      if (container) {
        while (container.firstChild) {
          container.removeChild(container.firstChild);
        }
      }
      geometry.dispose();
      material.dispose();
      if (composer) composer.dispose();
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
  const [contentVisible, setContentVisible] = useState(false);

  const tier = usePerformanceTier(); // Use our new hook

  // Desktop (high) and flagship mobile get BeamBackground with post-processing
  // Medium/Low tier gets shader-based MobileBeam
  const showHeavyBeam = tier === 'high' || tier === 'flagship';

  // Splash screen effect - show content after beam fully loads and settles
  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setContentVisible(true);
    }, 3750); // 3.75s syncs with the shortened burst settling

    return () => {
      clearTimeout(contentTimer);
    };
  }, []);

  const skills = ['Python', 'AWS', 'Security', 'Operations'];

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
    <div className="relative w-full min-h-[100dvh] h-auto bg-bg-dark overflow-hidden pb-20 sm:pb-10">
      {/* Background Layer */}
      {showHeavyBeam ? (
        <MemoizedBeamBackground
          isMobile={tier === 'flagship'}
          tier={tier as 'flagship' | 'high'}
        />
      ) : (
        <MobileBeam performanceTier={tier as 'medium' | 'low'} />
      )}

      {/* Content Layer - Immersive Splash Screen Effect */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-10rem)] px-8 sm:px-6 text-center">
        <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.0, ease: "easeOut" }}
            className="space-y-8 sm:space-y-6"
          >
            <h1 className="text-[clamp(2rem,5vw,6rem)] font-serif text-secondary leading-tight px-4 sm:px-2">
              Solutions Engineer: Where Operations Meet Innovation
            </h1>
            <p className="text-[clamp(1rem,2vw,1.875rem)] text-secondary/80 font-light leading-relaxed max-w-4xl mx-auto px-4">
              Bridging the gap between business operations and technical implementation through full-stack development, cloud infrastructure, and data-driven solutions.
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-4 text-[clamp(2.5rem,4vw,3.5rem)] font-serif mt-8 sm:mt-12 min-h-[4rem]">
              <span className="text-secondary">Specializing in</span>
              <span className="relative min-w-[280px] sm:min-w-[300px] text-center">
                <span className="relative z-10 text-primary px-4 py-2 rounded-md bg-secondary/95 backdrop-blur-sm inline-block">
                  {displayText}
                  <span className="animate-pulse">|</span>
                </span>
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={contentVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 1.0, delay: 0.3, ease: "easeOut" }}
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
      </div>

      {contentVisible && (
        <div className="block sm:hidden">
          <MobileScrollIndicator />
        </div>
      )}

      <ResumeModal
        isOpen={isResumeModalOpen}
        onClose={() => setIsResumeModalOpen(false)}
      />
    </div>
  );
}
