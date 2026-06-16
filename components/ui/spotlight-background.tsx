"use client";

import React, { useEffect } from "react";
import { motion, useMotionValue, useSpring, animate } from "framer-motion";

export const SpotlightBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for the mouse follower
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = ({ clientX, clientY }: MouseEvent) => {
            mouseX.set(clientX);
            mouseY.set(clientY);
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.touches[0];
            mouseX.set(touch.clientX);
            mouseY.set(touch.clientY);
        };

        if (typeof window !== "undefined") {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("touchmove", handleTouchMove, { passive: true });
            return () => {
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("touchmove", handleTouchMove);
            };
        }
    }, [mouseX, mouseY]);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
            {/* Main moving spotlight following cursor (subtle) */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full blur-[120px] opacity-20"
                style={{
                    background: "radial-gradient(circle, rgba(231,125,34,0.3) 0%, rgba(231,125,34,0) 70%)",
                    left: springX,
                    top: springY,
                    transform: "translate(-50%, -50%)",
                }}
            />

            {/* Ambient drifting lights for visual interest even without interaction */}
            <motion.div
                className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] rounded-full blur-[150px] opacity-10 bg-secondary/20"
                animate={{
                    scale: [1, 1.2, 1],
                    x: [0, 50, 0],
                    y: [0, 30, 0],
                }}
                transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
            />

            <motion.div
                className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[130px] opacity-15 bg-primary/20"
                animate={{
                    scale: [1, 1.1, 1],
                    x: [0, -30, 0],
                    y: [0, -50, 0],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1,
                }}
            />
        </div>
    );
};
