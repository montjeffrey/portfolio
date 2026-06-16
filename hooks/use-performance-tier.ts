import { useState, useEffect } from 'react';

export type PerformanceTier = 'flagship' | 'high' | 'medium' | 'low';

/**
 * Detects device performance tier for adaptive rendering
 *
 * Tiers:
 * - flagship: High-end mobile (iPhone 13 Pro+, S21 Ultra+, Pixel 6 Pro+)
 * - high: Desktop/laptop devices
 * - medium: Mid-range mobile (4-5 cores, 2-3 years old)
 * - low: Budget mobile (≤4 cores, older devices)
 */
// Returns `null` until detection runs on the client. Callers should hold off mounting
// any heavy renderer until a concrete tier is known — otherwise the SSR/initial default
// would build the desktop-class scene on phones and immediately tear it down, leaking a
// WebGL context on every load.
export function usePerformanceTier(): PerformanceTier | null {
    const [tier, setTier] = useState<PerformanceTier | null>(null);

    useEffect(() => {
        const detectTier = (): PerformanceTier => {
            // Detect mobile/tablet
            const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

            // Hardware concurrency (CPU cores)
            const concurrency = navigator.hardwareConcurrency || 4;

            // OS Version Detection
            const userAgent = navigator.userAgent;
            let iosVersion: number | null = null;
            let androidVersion: number | null = null;

            // Parse iOS version (e.g., "iPhone OS 15_0" or "Version/15.0")
            const iosMatch = userAgent.match(/OS (\d+)_/i) || userAgent.match(/Version\/(\d+)\./i);
            if (iosMatch && /iPhone|iPad|iPod/i.test(userAgent)) {
                iosVersion = parseInt(iosMatch[1], 10);
            }

            // Parse Android version (e.g., "Android 11")
            const androidMatch = userAgent.match(/Android (\d+)/i);
            if (androidMatch) {
                androidVersion = parseInt(androidMatch[1], 10);
            }

            // GPU Detection via WebGL
            let gpuTier: 'high' | 'medium' | 'low' = 'medium';
            try {
                const canvas = document.createElement('canvas');
                const gl = canvas.getContext('webgl') as WebGLRenderingContext | null;

                if (gl) {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string;

                        // High-end mobile GPUs
                        if (/Apple GPU|Apple M[0-9]|A1[5-9] GPU|A[2-9][0-9] GPU/i.test(renderer)) {
                            gpuTier = 'high'; // Apple A15+ or M-series
                        } else if (/Adreno [7-9][0-9]{2}|Mali-G7[0-9]|Mali-G[8-9][0-9]|Immortalis/i.test(renderer)) {
                            gpuTier = 'high'; // Modern Android flagships
                        } else if (/Adreno [5-6][0-9]{2}|Mali-G5[0-9]|Mali-G6[0-9]/i.test(renderer)) {
                            gpuTier = 'medium'; // Mid-range GPUs
                        } else if (/Adreno [0-4][0-9]{2}|Mali-[0-4]/i.test(renderer)) {
                            gpuTier = 'low'; // Budget GPUs
                        }
                    }
                }
            } catch (e) {
                // WebGL not available, fall back to CPU detection
                console.warn('WebGL detection failed, using CPU-based tier detection');
            }

            // Device-specific detection for known flagships
            const isFlagshipApple = /iPhone1[3-9]|iPhone[2-9][0-9]|iPad.*Pro.*M[0-9]/i.test(userAgent);
            const isFlagshipSamsung = /SM-S9[0-9]{2}|SM-S2[0-9]{2}/i.test(userAgent); // S21+, S22+, S23+, S24+
            const isFlagshipPixel = /Pixel [6-9].*Pro|Pixel [1-9][0-9].*Pro/i.test(userAgent);

            // Desktop devices
            if (!isMobile) {
                return 'high';
            }

            // Check if OS version is outdated (even on flagship hardware)
            const isOutdatedOS =
                (iosVersion !== null && iosVersion < 16) ||      // iOS < 16 (pre-2022)
                (androidVersion !== null && androidVersion < 12); // Android < 12 (pre-2021)

            // Flagship mobile detection
            // Criteria: 6+ cores OR flagship GPU OR known flagship device
            const isFlagshipHardware =
                concurrency >= 6 ||
                gpuTier === 'high' ||
                isFlagshipApple ||
                isFlagshipSamsung ||
                isFlagshipPixel;

            if (isFlagshipHardware) {
                // Downgrade flagship to medium if on outdated OS
                // Old Safari/Chrome versions have worse WebGL performance
                if (isOutdatedOS) {
                    return 'medium';
                }
                return 'flagship';
            }

            // Mid-range mobile
            if (concurrency >= 5 || gpuTier === 'medium') {
                // Downgrade to low if on very old OS
                if (isOutdatedOS) {
                    return 'low';
                }
                return 'medium';
            }

            // Budget mobile
            return 'low';
        };

        const detectedTier = detectTier();
        setTier(detectedTier);

        // Log tier for debugging (remove in production)
        if (process.env.NODE_ENV === 'development') {
            // Parse versions for logging
            const userAgent = navigator.userAgent;
            const iosMatch = userAgent.match(/OS (\d+)_/i) || userAgent.match(/Version\/(\d+)\./i);
            const androidMatch = userAgent.match(/Android (\d+)/i);
            const iosVersion = iosMatch && /iPhone|iPad|iPod/i.test(userAgent) ? parseInt(iosMatch[1], 10) : null;
            const androidVersion = androidMatch ? parseInt(androidMatch[1], 10) : null;

            console.log('[Performance Tier]', detectedTier, {
                cores: navigator.hardwareConcurrency,
                iosVersion,
                androidVersion,
                userAgent: navigator.userAgent
            });
        }
    }, []);

    return tier;
}
