"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useTransform, useMotionValue, useReducedMotion, type MotionValue } from "framer-motion";
import { ScrollScene, useSceneProgress } from "@/lib/parallax/scroll-scene";

// Scene 2: the hero's dots gather into a tailnet, and a tailnet-sentry pass flags the
// one device that doesn't belong. Visitors can uncover who each device can reach, pull
// nodes around, and isolate the anomaly the way the real CLI does: dry run first, then
// apply, and release undoes it.

type NetworkId = "home" | "remote" | "cellular" | "unknown";

// Illustrative networks, not a real setup. Every tailnet address comes from
// Tailscale's 100.64.0.0/10 range; LAN addresses sit inside their own subnet.
const NETWORKS: Record<NetworkId, string> = {
  home: "home LAN 192.168.50.0/24",
  remote: "remote Wi-Fi 10.20.0.0/24",
  cellular: "cellular, carrier NAT",
  unknown: "unknown network",
};

type DeviceInfo = {
  os: string;
  owner: string;
  tags: string;
  tailnetIp: string;
  network: NetworkId;
  lanIp: string;
  // How it reaches its peers: direct on the LAN, direct through NAT traversal
  // (WireGuard over UDP 41641), or relayed through DERP over HTTPS 443
  path: string;
  role?: string;
  lastSeen: string;
};

type Device = { id: string; x: number; y: number; anomaly?: boolean; info: DeviceInfo };

const VIEW = { w: 440, h: 360 };
const HUB = { x: 220, y: 180 };

// Demo data, shaped like a real `sentry scan`
const DEVICES: Device[] = [
  {
    id: "desktop",
    x: 72,
    y: 72,
    info: { os: "windows", owner: "you@github", tags: "-", tailnetIp: "100.101.2.10", network: "home", lanIp: "192.168.50.20", path: "direct, same LAN", lastSeen: "now" },
  },
  {
    id: "build-box",
    x: 222,
    y: 34,
    info: { os: "linux", owner: "you@github", tags: "tag:server", tailnetIp: "100.88.14.2", network: "home", lanIp: "192.168.50.30", path: "direct, same LAN", lastSeen: "now" },
  },
  {
    id: "laptop",
    x: 352,
    y: 66,
    info: { os: "windows", owner: "you@github", tags: "-", tailnetIp: "100.101.7.33", network: "remote", lanIp: "10.20.0.117", path: "direct via NAT traversal (UDP 41641)", lastSeen: "now" },
  },
  {
    id: "tablet",
    x: 108,
    y: 176,
    info: { os: "android", owner: "you@github", tags: "-", tailnetIp: "100.66.120.7", network: "home", lanIp: "192.168.50.61", path: "direct, same LAN", lastSeen: "1 h ago" },
  },
  {
    id: "nas",
    x: 46,
    y: 266,
    info: {
      os: "linux",
      owner: "you@github",
      tags: "tag:server",
      tailnetIp: "100.84.9.40",
      network: "home",
      lanIp: "192.168.50.40",
      path: "direct, same LAN",
      role: "subnet router for 192.168.50.0/24",
      lastSeen: "now",
    },
  },
  {
    id: "phone",
    x: 168,
    y: 318,
    info: { os: "ios", owner: "you@github", tags: "-", tailnetIp: "100.70.44.5", network: "cellular", lanIp: "carrier-assigned", path: "relayed via DERP (HTTPS 443)", lastSeen: "2 min ago" },
  },
  {
    id: "pi-hole",
    x: 318,
    y: 304,
    info: {
      os: "linux",
      owner: "you@github",
      tags: "tag:dns",
      tailnetIp: "100.92.3.18",
      network: "home",
      lanIp: "192.168.50.53",
      path: "direct, same LAN",
      role: "DNS resolver for the tailnet",
      lastSeen: "now",
    },
  },
  {
    id: "kali",
    x: 396,
    y: 192,
    anomaly: true,
    info: { os: "linux", owner: "mallory@example.com", tags: "tag:ci", tailnetIp: "100.77.201.9", network: "unknown", lanIp: "not reported", path: "relayed via DERP (HTTPS 443)", lastSeen: "4 min ago" },
  },
];
const KALI = DEVICES.findIndex((d) => d.anomaly);
const KALI_FINDINGS = ["new-device: not in baseline", "unexpected-owner: mallory@example.com", "unexpected-tags: tag:ci"];
const indexOf = (id: string) => DEVICES.findIndex((d) => d.id === id);

// Tailscale is a full mesh: every healthy machine reaches every other directly, and the
// control plane only coordinates. kali's links come from tag:ci, which the policy lets
// reach servers; that is why it matters.
const HEALTHY_IDX = DEVICES.map((_, i) => i).filter((i) => i !== KALI);
const PEERS: [number, number][] = [
  ...HEALTHY_IDX.flatMap((a, n) => HEALTHY_IDX.slice(n + 1).map((b) => [a, b] as [number, number])),
  [KALI, indexOf("build-box")],
  [KALI, indexOf("nas")],
];

// compute-pool: pools CPU across these machines; each task goes to the one with
// the most idle CPU
const POOL = ["desktop", "build-box", "laptop"].map(indexOf);
const POOL_PAD = 38;

// A soft closed outline around the pool members (Catmull-Rom through padded points)
function poolPath(points: { x: number; y: number }[]): string {
  const cx = points.reduce((n, p) => n + p.x, 0) / points.length;
  const cy = points.reduce((n, p) => n + p.y, 0) / points.length;
  const ring = points
    .map((p) => {
      const dx = p.x - cx;
      const dy = p.y - cy;
      const len = Math.hypot(dx, dy) || 1;
      return { x: p.x + (dx / len) * POOL_PAD, y: p.y + (dy / len) * POOL_PAD, a: Math.atan2(dy, dx) };
    })
    .sort((m, n) => m.a - n.a);
  // Pad between members too, so a near-straight row still gets a rounded envelope
  const pts = ring.flatMap((p, i) => {
    const q = ring[(i + 1) % ring.length];
    const mx = (p.x + q.x) / 2;
    const my = (p.y + q.y) / 2;
    const dx = mx - cx;
    const dy = my - cy;
    const len = Math.hypot(dx, dy) || 1;
    return [p, { x: mx + (dx / len) * POOL_PAD, y: my + (dy / len) * POOL_PAD, a: 0 }];
  });
  const n = pts.length;
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = pts[(i - 1 + n) % n];
    const p1 = pts[i];
    const p2 = pts[(i + 1) % n];
    const p3 = pts[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return `${d} Z`;
}

const reaches = (i: number) => PEERS.filter(([a, b]) => a === i || b === i).map(([a, b]) => DEVICES[a === i ? b : a].id);

// Quarantined kali drifts away from the hub
const KALI_DRIFT = (() => {
  const k = DEVICES[KALI];
  const len = Math.hypot(k.x - HUB.x, k.y - HUB.y);
  return { x: ((k.x - HUB.x) / len) * 22, y: ((k.y - HUB.y) / len) * 22 };
})();

const HEALTHY = "#4CC38A";
const ACCENT = "#E77D22";
const CREAM = "#F0EDE4";

// Deterministic scatter so server and client render the same dots
const MORPH_DOTS = Array.from({ length: 96 }, (_, i) => {
  const col = i % 12;
  const row = Math.floor(i / 12);
  const jitter = (n: number) => ((Math.sin(i * 12.9898 + n * 78.233) * 43758.5453) % 1) * 10;
  const targets = [HUB, ...DEVICES];
  const target = targets[i % targets.length];
  return {
    from: { x: 18 + col * 37 + jitter(1), y: 20 + row * 46 + jitter(2) },
    to: { x: target.x + jitter(3) * 0.6, y: target.y + jitter(4) * 0.6 },
  };
});

function MorphDot({ from, to, progress }: { from: { x: number; y: number }; to: { x: number; y: number }; progress: MotionValue<number> }) {
  const x = useTransform(progress, [0.08, 0.3], [from.x, to.x]);
  const y = useTransform(progress, [0.08, 0.3], [from.y, to.y]);
  const opacity = useTransform(progress, [0.26, 0.33], [0.75, 0]);
  return <motion.circle r={1.8} fill={ACCENT} style={{ x, y, opacity }} />;
}

// --- Details card ------------------------------------------------------------------

type Active = number | "hub" | "pool" | null;

function DeviceCard({ active, isolated }: { active: Active; isolated: boolean }) {
  if (active === null) {
    return (
      <p className="text-secondary/55">
        Hover, tap or tab to a device to uncover its links, or to the compute-pool envelope. Drag a node to pull the mesh around.
      </p>
    );
  }

  if (active === "pool") {
    return (
      <div className="space-y-1">
        <p className="text-secondary">
          compute-pool <span className="text-secondary/50">· pooled compute</span>
        </p>
        <p className="text-secondary/70">
          Pools CPU across {POOL.map((i) => DEVICES[i].id).join(", ")} over the tailnet, even though laptop sits
          on a different network. Each task runs on the machine with the most idle CPU, and batches fan out across
          every free job slot in the pool.
        </p>
        <a
          href="https://github.com/montjeffrey/compute-pool"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block pt-1 text-primary underline-offset-4 hover:underline"
        >
          compute-pool on GitHub →
        </a>
      </div>
    );
  }

  if (active === "hub") {
    return (
      <div className="space-y-1">
        <p className="text-secondary">
          tailnet <span className="text-secondary/50">· Tailscale control plane</span>
        </p>
        <p className="text-secondary/65">
          Coordinates keys and policy only. Traffic is WireGuard, peer to peer: UDP 41641 when a direct path exists,
          DERP relay over HTTPS 443 when NAT blocks one.
        </p>
        <p className="text-secondary/65">Tailnet addresses: 100.64.0.0/10, one per device.</p>
        <p className="text-secondary/65">
          Networks: {NETWORKS.home} (5) · {NETWORKS.remote} (1) · cellular (1) · unknown (1)
        </p>
        <p className="text-secondary/65">
          {PEERS.length - (isolated ? 2 : 0)} peer links · 8 devices · {isolated ? "1 quarantined" : "1 not in baseline"}
        </p>
      </div>
    );
  }

  const device = DEVICES[active];
  const anomaly = device.anomaly;
  const status = anomaly ? (isolated ? "QUARANTINED" : "ANOMALY (high)") : "healthy";
  const statusColor = anomaly ? ACCENT : HEALTHY;
  const tags = anomaly && isolated ? "tag:quarantine" : device.info.tags;
  const peers = anomaly && isolated ? [] : reaches(active);

  return (
    <div className="space-y-1">
      <p className="text-secondary">
        {device.id} <span style={{ color: statusColor }}>· {status}</span>
      </p>
      <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-0.5 text-secondary/70">
        <dt className="text-secondary/45">os</dt>
        <dd>{device.info.os}</dd>
        <dt className="text-secondary/45">owner</dt>
        <dd className={anomaly ? "text-primary" : undefined}>{device.info.owner}</dd>
        <dt className="text-secondary/45">tags</dt>
        <dd className={anomaly ? "text-primary" : undefined}>{tags}</dd>
        <dt className="text-secondary/45">tailnet ip</dt>
        <dd>{device.info.tailnetIp}</dd>
        <dt className="text-secondary/45">network</dt>
        <dd className={anomaly ? "text-primary" : undefined}>{NETWORKS[device.info.network]}</dd>
        <dt className="text-secondary/45">lan ip</dt>
        <dd>{device.info.lanIp}</dd>
        <dt className="text-secondary/45">path</dt>
        <dd>{device.info.path}</dd>
        {device.info.role && (
          <>
            <dt className="text-secondary/45">role</dt>
            <dd>{device.info.role}</dd>
          </>
        )}
        <dt className="text-secondary/45">last seen</dt>
        <dd>{device.info.lastSeen}</dd>
        <dt className="text-secondary/45">reaches</dt>
        <dd className={anomaly ? "text-primary" : undefined}>
          {peers.length ? (anomaly ? peers.join(", ") : `all ${peers.length} peers`) : "nothing: policy denies tag:quarantine"}
          {anomaly && !isolated && " (via tag:ci)"}
        </dd>
        {POOL.includes(active) && (
          <>
            <dt className="text-secondary/45">pool</dt>
            <dd className="text-primary/90">compute-pool member</dd>
          </>
        )}
      </dl>
      {anomaly && !isolated && (
        <ul className="pt-1 text-primary/90">
          {KALI_FINDINGS.map((f) => (
            <li key={f}>high · {f}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- Graph -------------------------------------------------------------------------

function TailnetGraph({ isolated, progress, animated }: { isolated: boolean; progress: MotionValue<number>; animated: boolean }) {
  const reduceMotion = useReducedMotion();
  const graphOpacity = useTransform(progress, [0.26, 0.36], [0, 1]);

  const [hover, setHover] = useState<Active>(null);
  const [pinned, setPinned] = useState<Active>(null);
  const active = hover ?? pinned;

  const svgRef = useRef<SVGSVGElement>(null);
  const spokeRefs = useRef<(SVGLineElement | null)[]>([]);
  const peerRefs = useRef<(SVGLineElement | null)[]>([]);
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const poolRef = useRef<SVGPathElement>(null);
  const poolLabelRef = useRef<SVGTextElement>(null);

  // Per-node displacement from its home spot, driven by drag and a spring back.
  // The render loop reads this without re-rendering React.
  const live = useRef({
    dx: DEVICES.map(() => 0),
    dy: DEVICES.map(() => 0),
    vx: DEVICES.map(() => 0),
    vy: DEVICES.map(() => 0),
    drift: 0,
    isolated,
    drag: null as null | { index: number; pointerId: number; grabX: number; grabY: number; startX: number; startY: number; moved: boolean },
  });
  live.current.isolated = isolated;

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    let frame = 0;
    let visible = false;
    let last = performance.now();
    let t = 0;

    const position = (i: number) => {
      const s = live.current;
      const d = DEVICES[i];
      const float = reduceMotion ? 0 : 1;
      let x = d.x + s.dx[i] + Math.sin(t * 0.7 + i * 1.9) * 3 * float;
      let y = d.y + s.dy[i] + Math.cos(t * 0.55 + i * 1.3) * 3 * float;
      if (i === KALI) {
        x += KALI_DRIFT.x * s.drift;
        y += KALI_DRIFT.y * s.drift;
      }
      return { x, y };
    };

    const draw = () => {
      const pos = DEVICES.map((_, i) => position(i));
      pos.forEach((p, i) => {
        nodeRefs.current[i]?.setAttribute("transform", `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
        const spoke = spokeRefs.current[i];
        if (spoke) {
          spoke.setAttribute("x2", p.x.toFixed(1));
          spoke.setAttribute("y2", p.y.toFixed(1));
        }
      });
      const members = POOL.map((i) => pos[i]);
      poolRef.current?.setAttribute("d", poolPath(members));
      if (poolLabelRef.current) {
        const left = members.reduce((m, p) => (p.x < m.x ? p : m));
        poolLabelRef.current.setAttribute("x", (left.x - POOL_PAD + 4).toFixed(1));
        poolLabelRef.current.setAttribute("y", (Math.min(...members.map((p) => p.y)) - POOL_PAD - 4).toFixed(1));
      }
      PEERS.forEach(([a, b], k) => {
        const el = peerRefs.current[k];
        if (!el) return;
        el.setAttribute("x1", pos[a].x.toFixed(1));
        el.setAttribute("y1", pos[a].y.toFixed(1));
        el.setAttribute("x2", pos[b].x.toFixed(1));
        el.setAttribute("y2", pos[b].y.toFixed(1));
      });
    };

    const tick = (now: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      t += dt;
      const s = live.current;

      // Spring every released node back home
      for (let i = 0; i < DEVICES.length; i++) {
        if (s.drag?.index === i) continue;
        const ax = -90 * s.dx[i] - 12 * s.vx[i];
        const ay = -90 * s.dy[i] - 12 * s.vy[i];
        s.vx[i] += ax * dt;
        s.vy[i] += ay * dt;
        s.dx[i] += s.vx[i] * dt;
        s.dy[i] += s.vy[i] * dt;
      }
      s.drift += ((s.isolated ? 1 : 0) - s.drift) * (1 - Math.exp(-4 * dt));
      draw();
    };

    const start = () => {
      if (frame || !visible || document.hidden) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      frame = 0;
    };

    // Only animate while the graph is on screen
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(svg);
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);
    draw();

    const toSvg = (ev: PointerEvent) => {
      const m = svg.getScreenCTM();
      if (!m) return { x: 0, y: 0 };
      const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
      return { x: p.x, y: p.y };
    };

    const onMove = (ev: PointerEvent) => {
      const drag = live.current.drag;
      if (!drag || drag.pointerId !== ev.pointerId) return;
      if (!drag.moved && Math.hypot(ev.clientX - drag.startX, ev.clientY - drag.startY) > 4) {
        drag.moved = true;
        // Capture only once it is a real drag: capturing on press would retarget the
        // click to the svg and a plain tap would never select the node
        svg.setPointerCapture(ev.pointerId);
      }
      if (!drag.moved) return;
      const p = toSvg(ev);
      const d = DEVICES[drag.index];
      // Leash the node so it can't be thrown out of the frame
      const lx = Math.max(-90, Math.min(90, p.x - drag.grabX - d.x));
      const ly = Math.max(-90, Math.min(90, p.y - drag.grabY - d.y));
      live.current.dx[drag.index] = lx;
      live.current.dy[drag.index] = ly;
      live.current.vx[drag.index] = 0;
      live.current.vy[drag.index] = 0;
      if (!frame) draw();
    };
    const onUp = (ev: PointerEvent) => {
      const drag = live.current.drag;
      if (!drag || drag.pointerId !== ev.pointerId) return;
      live.current.drag = null;
      // A press that never became a drag is a tap. Selecting here rather than on click
      // keeps taps reliable while the node drifts under the pointer.
      if (!drag.moved && ev.type === "pointerup") {
        const index = drag.index;
        setPinned((p) => (p === index ? null : index));
      }
    };

    svg.addEventListener("pointermove", onMove);
    svg.addEventListener("pointerup", onUp);
    svg.addEventListener("pointercancel", onUp);

    return () => {
      stop();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      svg.removeEventListener("pointermove", onMove);
      svg.removeEventListener("pointerup", onUp);
      svg.removeEventListener("pointercancel", onUp);
    };
  }, [reduceMotion]);

  const grab = (i: number) => (ev: React.PointerEvent<SVGGElement>) => {
    const svg = svgRef.current;
    const m = svg?.getScreenCTM();
    if (!svg || !m) return;
    const p = new DOMPoint(ev.clientX, ev.clientY).matrixTransform(m.inverse());
    const s = live.current;
    const d = DEVICES[i];
    s.drag = {
      index: i,
      pointerId: ev.pointerId,
      grabX: p.x - (d.x + s.dx[i]),
      grabY: p.y - (d.y + s.dy[i]),
      startX: ev.clientX,
      startY: ev.clientY,
      moved: false,
    };
  };

  const choose = (id: Exclude<Active, null>) => setPinned((p) => (p === id ? null : id));

  const nodeHandlers = (id: Exclude<Active, null>) => ({
    tabIndex: 0,
    role: "button" as const,
    "aria-pressed": pinned === id,
    className: "cursor-pointer outline-none [&:focus-visible>circle:first-child]:stroke-primary",
    onPointerEnter: () => setHover(id),
    onPointerLeave: () => setHover(null),
    onFocus: () => setHover(id),
    onBlur: () => setHover(null),
    onClick: () => choose(id),
    onKeyDown: (ev: React.KeyboardEvent) => {
      if (ev.key === "Enter" || ev.key === " ") {
        ev.preventDefault();
        setPinned((p) => (p === id ? null : id));
      }
    },
  });

  // Which mesh links are uncovered right now
  const peerVisible = (a: number, b: number) => {
    if (active === null) return false;
    if (isolated && (a === KALI || b === KALI)) return false;
    if (active === "hub") return true;
    if (active === "pool") return POOL.includes(a) && POOL.includes(b);
    return a === active || b === active;
  };

  const nodeLabel = (i: number) => {
    const d = DEVICES[i];
    const status = d.anomaly ? (isolated ? "quarantined" : "anomaly, high severity") : "healthy";
    return `${d.id}: ${status}. ${d.info.os}, owner ${d.info.owner}. Show who it can reach.`;
  };

  return (
    <div className="rounded-2xl border border-secondary/10 bg-bg-dark/80 p-4 md:p-6">
      <svg
        ref={svgRef}
        viewBox={`0 -36 ${VIEW.w} ${VIEW.h + 36}`}
        className="w-full h-auto select-none overflow-visible"
        style={{ touchAction: "pan-y" }}
        role="group"
        aria-label={
          isolated
            ? "A tailnet of eight devices around its control plane. Seven are healthy; kali is quarantined and cut off."
            : "A tailnet of eight devices around its control plane. Seven are healthy and kali is flagged as an anomaly."
        }
      >
        {animated && MORPH_DOTS.map((dot, i) => <MorphDot key={i} from={dot.from} to={dot.to} progress={progress} />)}

        <motion.g style={animated ? { opacity: graphOpacity } : undefined}>
          {/* compute-pool envelope */}
          <g
            {...nodeHandlers("pool")}
            className="cursor-pointer outline-none [&:focus-visible>path]:[stroke-opacity:1] [&:focus-visible>path]:[stroke-width:2.5]"
            aria-label="compute-pool. Show details."
          >
            <path
              ref={poolRef}
              d={poolPath(POOL.map((i) => DEVICES[i]))}
              fill={ACCENT}
              fillOpacity={active === "pool" ? 0.1 : 0.04}
              stroke={ACCENT}
              strokeOpacity={active === "pool" ? 0.7 : 0.3}
              strokeDasharray="6 5"
              strokeWidth={1.2}
              style={{ transition: "fill-opacity 250ms ease, stroke-opacity 250ms ease" }}
            />
            <text ref={poolLabelRef} x={46} y={0} fill={ACCENT} fillOpacity={0.8} fontSize={11} fontFamily="monospace">
              compute-pool
            </text>
          </g>

          {/* Mesh links, uncovered on demand */}
          {PEERS.map(([a, b], k) => {
            const kaliLink = a === KALI || b === KALI;
            const on = peerVisible(a, b);
            return (
              <line
                key={`peer-${k}`}
                ref={(el) => {
                  peerRefs.current[k] = el;
                }}
                x1={DEVICES[a].x}
                y1={DEVICES[a].y}
                x2={DEVICES[b].x}
                y2={DEVICES[b].y}
                stroke={kaliLink ? ACCENT : HEALTHY}
                strokeOpacity={on ? (kaliLink ? 0.85 : 0.6) : kaliLink ? (isolated ? 0 : 0.28) : active !== null ? 0.03 : 0.08}
                strokeWidth={on ? 1.4 : 1}
                strokeDasharray={on ? "2 5" : undefined}
                strokeLinecap="round"
                className={on ? "peer-flow" : undefined}
                style={{ transition: "stroke-opacity 250ms ease" }}
              />
            );
          })}

          {/* Spokes to the control plane */}
          {DEVICES.map((d, i) => {
            const kaliSpoke = i === KALI;
            const hot = active === i || active === "hub";
            return (
              <line
                key={`spoke-${d.id}`}
                ref={(el) => {
                  spokeRefs.current[i] = el;
                }}
                x1={HUB.x}
                y1={HUB.y}
                x2={d.x}
                y2={d.y}
                stroke={kaliSpoke ? ACCENT : CREAM}
                strokeOpacity={kaliSpoke ? (isolated ? 0.2 : 0.6) : hot ? 0.45 : active !== null ? 0.08 : 0.18}
                strokeWidth={kaliSpoke ? 1.5 : 1}
                strokeDasharray={kaliSpoke && isolated ? "4 6" : undefined}
                style={{ transition: "stroke-opacity 250ms ease" }}
              />
            );
          })}

          {isolated && (
            <text
              x={(HUB.x + DEVICES[KALI].x) / 2}
              y={(HUB.y + DEVICES[KALI].y) / 2 + 5}
              textAnchor="middle"
              fill={ACCENT}
              fontSize={16}
              fontFamily="monospace"
            >
              ✕
            </text>
          )}

          {/* Control plane */}
          <g transform={`translate(${HUB.x} ${HUB.y})`} aria-label="tailnet control plane. Show the whole mesh." {...nodeHandlers("hub")}>
            <circle r={24} fill="transparent" stroke="transparent" strokeWidth={2} />
            <circle r={active === "hub" ? 16 : 14} fill={CREAM} style={{ transition: "r 200ms ease" }} />
            <text y={34} textAnchor="middle" fill={CREAM} fillOpacity={0.65} fontSize={12} fontFamily="monospace">
              tailnet
            </text>
          </g>

          {/* Devices */}
          {DEVICES.map((d, i) => {
            const on = active === i;
            const linked =
              (typeof active === "number" && active !== i && PEERS.some(([a, b]) => peerVisible(a, b) && (a === i || b === i))) ||
              (active === "pool" && POOL.includes(i));
            const dim = active !== null && !on && !linked && active !== "hub";
            const color = d.anomaly ? ACCENT : HEALTHY;
            return (
              <g
                key={d.id}
                ref={(el) => {
                  nodeRefs.current[i] = el;
                }}
                transform={`translate(${d.x} ${d.y})`}
                aria-label={nodeLabel(i)}
                style={{ touchAction: "none", opacity: dim ? 0.35 : 1, transition: "opacity 250ms ease" }}
                {...nodeHandlers(i)}
                onPointerDown={grab(i)}
                // Pointer taps select in the pointerup handler; keyboard uses onKeyDown
                onClick={undefined}
              >
                {/* Generous hit area for touch */}
                <circle r={22} fill="transparent" stroke="transparent" strokeWidth={2} />
                {d.anomaly && !isolated && <circle r={11} fill="none" stroke={ACCENT} strokeOpacity={0.5} className="scan-pulse" />}
                {(on || linked) && <circle r={d.anomaly ? 17 : 14} fill="none" stroke={color} strokeOpacity={on ? 0.8 : 0.4} />}
                <circle
                  r={d.anomaly ? 11 : 8}
                  fill={d.anomaly && isolated ? "#0D0D0D" : color}
                  stroke={d.anomaly ? ACCENT : "none"}
                  strokeWidth={2}
                  style={{ transition: "fill 400ms ease" }}
                />
                <text
                  y={d.anomaly ? 28 : 24}
                  textAnchor="middle"
                  fill={d.anomaly ? ACCENT : CREAM}
                  fillOpacity={d.anomaly || on || linked ? 1 : 0.6}
                  fontSize={12}
                  fontFamily="monospace"
                >
                  {d.anomaly ? (isolated ? "kali · quarantined" : "kali · anomaly") : d.id}
                </text>
              </g>
            );
          })}
        </motion.g>
      </svg>

      <div className="mt-3 min-h-[268px] rounded-lg border border-secondary/10 bg-black/40 p-4 font-mono text-[12.5px] leading-relaxed" aria-live="polite">
        <DeviceCard active={active} isolated={isolated} />
        <p className="mt-3 text-[11px] text-secondary/35">Demo data shaped like a real sentry scan. Addresses and networks are illustrative.</p>
      </div>
    </div>
  );
}

// --- Scene ---------------------------------------------------------------------------

type Stage = "flagged" | "planned" | "isolated";

function ScanBody() {
  const scene = useSceneProgress();
  const fallback = useMotionValue(1);
  const progress = scene?.progress ?? fallback;
  const animated = scene !== null && scene.mode !== "off";

  const [stage, setStage] = useState<Stage>("flagged");
  const isolated = stage === "isolated";

  return (
    <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] gap-10 lg:gap-14 items-center">
      {/* Copy + terminal */}
      <div className="space-y-6 order-2 lg:order-1">
        <span className="font-mono text-sm tracking-widest text-primary">01 · SECURITY</span>
        <h2 id="scan-heading" className="text-4xl md:text-5xl font-serif text-secondary leading-tight">
          Security is an engineering property, not a review at the end.
        </h2>
        <p className="text-lg text-secondary/75 leading-relaxed">
          CompTIA Security+. Least privilege, secrets out of repos, untrusted input treated as data.
          This is <span className="text-secondary">tailnet-sentry</span>, my Go CLI: it inventories a
          tailnet, compares it with a known-good baseline, and isolates what doesn&apos;t belong.
        </p>

        <div
          className="rounded-xl border border-primary/25 bg-black/60 p-5 font-mono text-[13px] leading-relaxed text-secondary/85 min-h-[300px]"
          aria-live="polite"
        >
          <p className="text-secondary/50">$ sentry scan</p>
          <p>8 devices: 7 healthy, <span className="text-primary">1 anomaly</span>.</p>
          <p className="text-secondary/60">high&nbsp; kali&nbsp; new-device, unexpected-owner, unexpected-tags</p>

          {stage !== "flagged" && (
            <>
              <p className="mt-3 text-secondary/50">$ sentry isolate kali</p>
              <p>1. set tags to [tag:quarantine]</p>
              {stage === "planned" && <p className="text-secondary/60">Dry run: nothing was changed.</p>}
            </>
          )}
          {isolated && (
            <>
              <p className="mt-3 text-secondary/50">$ sentry isolate kali --apply</p>
              <p style={{ color: HEALTHY }}>✓ kali tagged tag:quarantine. Audit log entry written.</p>
              <p className="text-secondary/60">The tailnet policy gives tag:quarantine no access.</p>
            </>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            {stage === "flagged" && (
              <button
                type="button"
                onClick={() => setStage("planned")}
                className="rounded-md border border-primary px-3 py-1.5 text-primary hover:bg-primary/15 transition-colors"
              >
                Dry run: isolate kali
              </button>
            )}
            {stage === "planned" && (
              <>
                <button
                  type="button"
                  onClick={() => setStage("isolated")}
                  className="rounded-md bg-primary px-3 py-1.5 text-bg-dark font-semibold hover:bg-primary/90 transition-colors"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={() => setStage("flagged")}
                  className="rounded-md border border-secondary/25 px-3 py-1.5 text-secondary/80 hover:border-secondary/60 transition-colors"
                >
                  Cancel
                </button>
              </>
            )}
            {isolated && (
              <>
                <button
                  type="button"
                  onClick={() => setStage("flagged")}
                  className="rounded-md border border-secondary/25 px-3 py-1.5 text-secondary/80 hover:border-secondary/60 transition-colors"
                >
                  sentry release kali
                </button>
                <a
                  href="https://github.com/montjeffrey/tailnet-sentry"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md px-3 py-1.5 text-primary underline-offset-4 hover:underline"
                >
                  tailnet-sentry on GitHub →
                </a>
              </>
            )}
          </div>
        </div>

        <p className="font-mono text-xs text-secondary/45">
          Scan means inventory from the Tailscale API. tailnet-sentry sends no packets and probes no ports.
        </p>
      </div>

      {/* Graph */}
      <div className="order-1 lg:order-2">
        <TailnetGraph isolated={isolated} progress={progress} animated={animated} />
      </div>
    </div>
  );
}

export default function TailnetScan() {
  return (
    <ScrollScene className="py-24 px-6 bg-bg-dark overflow-hidden">
      <section aria-labelledby="scan-heading">
        <ScanBody />
      </section>
    </ScrollScene>
  );
}
