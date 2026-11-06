import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import {
    INITIAL_BEAM_STATE,
    REDUCED_MOTION_SKIP_SECONDS,
    easeToward,
    introTarget,
} from './intro-timeline';

interface MobileBeamProps {
    performanceTier: 'medium' | 'low';
}

// Hero beam for mid-range and budget phones. No post-processing: the wave runs in the
// vertex shader and the bloom is faked per point (a bright core plus a soft additive
// halo that swells during the burst), so it plays the same intro as the desktop beam
// for the cost of a single draw call.
export const MobileBeam = React.memo<MobileBeamProps>(({ performanceTier }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const container = containerRef.current;
        const isLow = performanceTier === 'low';

        const renderer = new THREE.WebGLRenderer({
            antialias: false,
            alpha: false,
            powerPreference: 'high-performance',
            precision: 'mediump',
        });

        // Budget phones render at 1x; mid-range get a little extra sharpness.
        const pixelRatio = Math.min(window.devicePixelRatio, isLow ? 1.0 : 1.5);
        renderer.setPixelRatio(pixelRatio);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0x0d0d0d, 1);
        container.appendChild(renderer.domElement);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera();
        camera.position.z = 1;

        // --- Grid: covers the screen's longer side in both directions, so rotating the
        // phone (or resizing an iPad split view) never exposes bare edges ---
        const worldHeight = 10;
        const aspect = container.clientWidth / Math.max(container.clientHeight, 1);
        const longSide = worldHeight * Math.max(aspect, 1);
        const coverage = 3;
        const spacing = isLow ? 0.65 : 0.5;
        const cols = Math.ceil((coverage * longSide) / spacing);
        const rows = cols;
        const dotCount = cols * rows;

        // Point size in device pixels: one grid cell, so neighbouring halos just touch.
        const pointSize = (spacing / worldHeight) * container.clientHeight * pixelRatio;

        const vertexShader = `
      uniform float uPhase;
      uniform float uAmp;
      uniform float uFalloff;
      uniform float uExpansion;
      uniform float uGlow;
      uniform float uPointSize;
      attribute vec3 aBasePos;
      varying float vIntensity;
      varying float vShrink;

      void main() {
        float dist = length(aBasePos.xy);
        float wave = sin(6.2831853 * (uPhase - dist * uFalloff) * 0.25);
        float k = 1.0 + wave * uAmp + uExpansion;
        vIntensity = 0.5 + wave * 0.5;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(aBasePos.xy * k, 0.0, 1.0);
        // The halo swells with the glow so the burst flashes like a bloom pass would.
        // The halo shrinks as the field gathers (|k| < 1) so the dots packed into the center
        // don't multiply overdraw: density rises by 1/k^2 while each point's area falls by k^2.
        // The fragment shader scales the core back up so the dot itself keeps its size.
        vShrink = clamp(abs(k), 0.2, 1.0);
        gl_PointSize = uPointSize * (0.85 + 0.25 * uGlow) * vShrink;
      }
    `;

        const fragmentShader = `
      precision mediump float;
      uniform vec3 uColor;
      uniform float uOpacity;
      uniform float uGlow;
      varying float vIntensity;
      varying float vShrink;

      void main() {
        vec2 c = 2.0 * gl_PointCoord - 1.0;
        float d = dot(c, c);
        if (d > 1.0) discard;
        // Crisp dot (about a tenth of a full-size point's width, constant on screen however
        // the point shrinks) with a soft halo out to the edge.
        float r = 0.09 / vShrink;
        float core = 1.0 - smoothstep(r * r * 0.5, r * r * 1.5, d);
        float halo = (1.0 - d) * (1.0 - d);
        float a = core + halo * 0.22 * uGlow * (0.6 + vIntensity * 0.4);
        // Gathered points pile up additively; dim each one with the gather so the
        // center glows hot without blowing out to white.
        gl_FragColor = vec4(uColor, a * uOpacity * vShrink);
      }
    `;

        const basePos = new Float32Array(dotCount * 3);
        const xOffset = (cols - 1) * spacing * 0.5;
        const yOffset = (rows - 1) * spacing * 0.5;
        let i = 0;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                let x = c * spacing - xOffset;
                let y = r * spacing - yOffset;
                if (c % 2 === 1) y += spacing * 0.5; // hex offset
                x += (Math.random() - 0.5) * 0.25;
                y += (Math.random() - 0.5) * 0.25;
                basePos[i] = x;
                basePos[i + 1] = y;
                basePos[i + 2] = 0;
                i += 3;
            }
        }

        const geometry = new THREE.BufferGeometry();
        // `position` is required by three for bounds; the shader reads aBasePos.
        geometry.setAttribute('position', new THREE.BufferAttribute(basePos, 3));
        geometry.setAttribute('aBasePos', new THREE.BufferAttribute(basePos, 3));

        const uniforms = {
            uPhase: { value: 0 },
            uAmp: { value: INITIAL_BEAM_STATE.amp },
            uFalloff: { value: INITIAL_BEAM_STATE.falloff },
            uExpansion: { value: INITIAL_BEAM_STATE.expansion },
            uGlow: { value: INITIAL_BEAM_STATE.glow },
            uOpacity: { value: INITIAL_BEAM_STATE.opacity },
            uPointSize: { value: pointSize },
            uColor: { value: new THREE.Color(0xe77d22) },
        };

        const material = new THREE.ShaderMaterial({
            uniforms,
            vertexShader,
            fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const points = new THREE.Points(geometry, material);
        points.frustumCulled = false; // the shader moves points outside the base bounds
        scene.add(points);

        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            const worldWidth = worldHeight * (w / Math.max(h, 1));
            camera.left = -worldWidth / 2;
            camera.right = worldWidth / 2;
            camera.top = worldHeight / 2;
            camera.bottom = -worldHeight / 2;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            uniforms.uPointSize.value = (spacing / worldHeight) * h * pixelRatio;
        };

        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
        handleResize();

        // --- Animation: same intro timeline as the desktop beam ---
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const state = { ...INITIAL_BEAM_STATE };
        const opacityOpts = { loadingOpacity: 0.6, idleOpacity: 0.85, reduceMotion };
        const startTime = performance.now() - (reduceMotion ? REDUCED_MOTION_SKIP_SECONDS * 1000 : 0);
        // Budget phones are held to 30fps; everything else follows the display.
        const minFrameMs = isLow ? 1000 / 30 : 0;
        let lastFrame = performance.now();
        let phase = 0;
        let frameId = 0;

        const animate = () => {
            frameId = requestAnimationFrame(animate);
            const now = performance.now();
            const delta = now - lastFrame;
            if (delta < minFrameMs) return;
            lastFrame = minFrameMs ? now - (delta % minFrameMs) : now;

            const dt = Math.min(delta / 1000, 0.1);
            const target = introTarget((now - startTime) / 1000, opacityOpts);
            easeToward(state, target, 1 - Math.exp(-2.5 * dt));
            // The wave has period 4 in phase; wrapping keeps it precise on fp16 mediump GPUs.
            phase = (phase + dt * state.speed) % 4;

            uniforms.uPhase.value = phase;
            uniforms.uAmp.value = state.amp;
            uniforms.uFalloff.value = state.falloff;
            uniforms.uExpansion.value = state.expansion;
            uniforms.uGlow.value = state.glow;
            uniforms.uOpacity.value = state.opacity;
            renderer.render(scene, camera);
        };

        // Stop rendering while the tab is hidden so a backgrounded tab holds no GPU work.
        const handleVisibility = () => {
            cancelAnimationFrame(frameId);
            if (!document.hidden) {
                lastFrame = performance.now();
                animate();
            }
        };
        document.addEventListener('visibilitychange', handleVisibility);

        // If the OS reclaims the context under memory pressure, pause instead of wedging.
        const canvas = renderer.domElement;
        const handleContextLost = (event: Event) => {
            event.preventDefault();
            cancelAnimationFrame(frameId);
        };
        const handleContextRestored = () => {
            cancelAnimationFrame(frameId);
            lastFrame = performance.now();
            animate();
        };
        canvas.addEventListener('webglcontextlost', handleContextLost, false);
        canvas.addEventListener('webglcontextrestored', handleContextRestored, false);

        animate();

        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(frameId);
            document.removeEventListener('visibilitychange', handleVisibility);
            canvas.removeEventListener('webglcontextlost', handleContextLost);
            canvas.removeEventListener('webglcontextrestored', handleContextRestored);
            if (canvas.parentNode === container) container.removeChild(canvas);
            geometry.dispose();
            material.dispose();
            // Release the GPU context itself, not just the JS wrapper, so remounts never
            // accumulate contexts (the cause of earlier iOS tab reloads).
            renderer.dispose();
            renderer.forceContextLoss();
        };
    }, [performanceTier]);

    return <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />;
});

MobileBeam.displayName = 'MobileBeam';
