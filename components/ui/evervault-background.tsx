"use client";

import { useMotionValue, useSpring, useMotionTemplate, motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import React from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface EvervaultBackgroundProps {
  className?: string;
  radius?: number;
}

const characters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export const generateRandomString = (length: number) => {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

export function EvervaultBackground({
  className,
  radius = 300,
}: EvervaultBackgroundProps) {
  const isMobile = useIsMobile();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Optimized spring config for fluid cursor follow
  const springConfig = { damping: 30, stiffness: 150 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Radius spring for smooth sizing
  const radiusValue = useMotionValue(radius);
  const smoothRadius = useSpring(radiusValue, springConfig);

  useEffect(() => {
    // Reset radius when prop changes
    radiusValue.set(radius);
  }, [radius, radiusValue]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Cache bounds to avoid layout thrashing (Desktop usage)
  const boundsRef = useRef<DOMRect | null>(null);

  // Bounds Caching with scroll listener for accurate cursor tracking on Desktop
  useEffect(() => {
    if (!containerRef.current || isMobile) return; // Skip on mobile, we use direct calculation

    const updateBounds = () => {
      if (containerRef.current) {
        boundsRef.current = containerRef.current.getBoundingClientRect();
      }
    };

    updateBounds();

    const resizeObserver = new ResizeObserver(() => updateBounds());
    resizeObserver.observe(containerRef.current);

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          updateBounds();
        }
      },
      { threshold: [0, 0.1, 0.5, 0.9, 1] }
    );
    intersectionObserver.observe(containerRef.current);

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateBounds();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isMobile]);

  // Optimized Mouse Handling
  const [isHovered, setIsHovered] = useState(false);

  // Mobile Scroll Driver - Visible Center Follower
  useEffect(() => {
    if (!isMobile || !containerRef.current) return;

    // Always keep spotlight active on mobile
    setIsHovered(true);

    const updateMobilePosition = () => {
      if (!containerRef.current) return;

      // Direct read for frame-perfect sync on mobile
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;

      // Calculate intersection with viewport
      const visibleTop = Math.max(0, rect.top);
      const visibleBottom = Math.min(viewportHeight, rect.bottom);
      const visibleLeft = Math.max(0, rect.left);
      const visibleRight = Math.min(viewportWidth, rect.right);

      // Check if visible
      if (visibleTop >= visibleBottom || visibleLeft >= visibleRight) {
        return; // Skip update if not visible
      }

      // Calculate center of the VISIBLE portion
      const centerY = (visibleTop + visibleBottom) / 2;
      const centerX = (visibleLeft + visibleRight) / 2;

      // Calculate position relative to container
      const relativeX = centerX - rect.left;
      const relativeY = centerY - rect.top;

      mouseX.set(relativeX);
      mouseY.set(relativeY);

      // Dynamic radius based on viewport width
      const newRadius = Math.min(viewportWidth * 0.8, 350);
      try {
        radiusValue.set(newRadius);
      } catch (e) {
        // Fallback
      }
    };

    // Initialize
    updateMobilePosition();

    // Hook into scrol loop
    const handleScroll = () => {
      requestAnimationFrame(updateMobilePosition);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Also update on resize to handle orientation changes
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile, mouseX, mouseY, radiusValue]);

  // Desktop Mouse & Touch Handling
  useEffect(() => {
    if (isMobile) return; // Disable on mobile

    const handleMouseMove = (event: MouseEvent) => {
      if (!boundsRef.current) return;
      const { left, top, width, height } = boundsRef.current;
      const clientX = event.clientX - left;
      const clientY = event.clientY - top;

      const buffer = 50;
      if (
        clientX >= -buffer &&
        clientX <= width + buffer &&
        clientY >= -buffer &&
        clientY <= height + buffer
      ) {
        mouseX.set(clientX);
        mouseY.set(clientY);
        if (!isHovered) setIsHovered(true);
      } else {
        if (isHovered) setIsHovered(false);
      }
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isHovered, mouseX, mouseY, isMobile]);

  // Separate effect for container-scoped events (Touch on Desktop)
  useEffect(() => {
    if (isMobile) return;
    const container = containerRef.current;
    if (!container) return;


    const handleTouchMove = (e: TouchEvent) => {
      if (!boundsRef.current) return;
      const touch = e.touches[0];
      const x = touch.clientX - boundsRef.current.left;
      const y = touch.clientY - boundsRef.current.top;
      mouseX.set(x);
      mouseY.set(y);
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
    };

    container.addEventListener("touchmove", handleTouchMove, { passive: true });
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
    }
  }, [mouseX, mouseY, isMobile]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group/evervault absolute inset-0 overflow-hidden rounded-lg pointer-events-none m-0 p-0",
        className
      )}
      style={{ margin: 0, padding: 0 }}
    >
      <EvervaultPattern
        mouseX={smoothMouseX}
        mouseY={smoothMouseY}
        radius={smoothRadius}
        isHovered={isHovered}
        isMobile={isMobile}
      />
    </div>
  );
}

// Canvas-based Pattern Component
const EvervaultPattern = React.memo(function EvervaultPattern({
  mouseX,
  mouseY,
  radius,
  isHovered,
  isMobile
}: {
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  radius: any; // Allow MotionValue or number
  isHovered: boolean;
  isMobile: boolean;
}) {
  let maskImage = useMotionTemplate`radial-gradient(${radius}px at ${mouseX}px ${mouseY}px, white, transparent)`;
  let style = { maskImage, WebkitMaskImage: maskImage };

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configuration
    const fontSize = isMobile ? 12 : 15;
    const font = `${fontSize}px monospace`;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    // Throttling frames for scramble effect
    let lastTime = 0;
    const interval = 50;
    let animationFrameId: number;

    const draw = (time: number) => {
      // Logic for automatic resizing
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      const width = rect.width * dpr;
      const height = rect.height * dpr;

      // Efficient resize check
      const needsResize = Math.abs(canvas.width - width) > 1 || Math.abs(canvas.height - height) > 1;

      if (needsResize) {
        canvas.width = width;
        canvas.height = height;

        ctx.scale(dpr, dpr);
      }

      if (time - lastTime > interval || needsResize) {
        lastTime = time;

        ctx.clearRect(0, 0, rect.width, rect.height);

        ctx.font = `bold ${fontSize}px monospace`;
        ctx.fillStyle = "rgba(240, 237, 228, 0.8)"; // text-secondary/80
        ctx.textBaseline = "top";

        const charMetrics = ctx.measureText("M");
        const charWidth = charMetrics.width;

        if (charWidth > 0 && rect.width > 0 && rect.height > 0) {
          const columns = Math.ceil(rect.width / charWidth) + 2;
          const rows = Math.ceil(rect.height / fontSize) + 1;

          // Draw the grid
          for (let i = 0; i < rows; i++) {
            let line = "";
            const safeColumns = Math.min(columns, 500);
            for (let j = 0; j < safeColumns; j++) {
              line += chars[Math.floor(Math.random() * chars.length)];
            }
            ctx.fillText(line, 0, i * fontSize);
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile]);

  return (
    <div className="pointer-events-none m-0 p-0" style={{ margin: 0, padding: 0 }}>
      {/* Base gradient fade */}
      <div className="absolute inset-0 [mask-image:linear-gradient(white,transparent)] opacity-30 transition-opacity duration-500" />

      {/* Vibrant gradient layer */}
      <motion.div
        className={`absolute inset-0 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={{
          ...style,
          background: `radial-gradient(circle at center, 
            rgba(231, 125, 34, 0.8) 0%,
            rgba(231, 125, 34, 0.6) 25%,
            rgba(240, 237, 228, 0.4) 50%,
            rgba(231, 125, 34, 0.3) 75%,
            transparent 100%)`,
          willChange: "mask-image"
        }}
      />

      {/* Canvas Text Layer - masked by the same motion template */}
      <motion.div
        className={`absolute inset-0 mix-blend-overlay transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"
          }`}
        style={style}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />
      </motion.div>
    </div>
  );
});
