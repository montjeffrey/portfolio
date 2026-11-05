"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "framer-motion";

// Scene 5: the cursor spotlight becomes a flashlight. Each client screenshot rests dimmed
// and lights up where the cursor is. Phones (no hover) light a card as it reaches the
// middle of the screen, and keyboard focus lights the whole card. The cursor position is
// written to CSS variables on the card, so moving it never re-renders React.

function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);
  return matches;
}

type Client = {
  name: string;
  domain: string;
  blurb: string;
  stack: string[];
  image: string;
  caseStudy: string;
};

// Stack labels come from each site's own repository (package.json, config files)
const CLIENTS: Client[] = [
  {
    name: "Elevate HRG",
    domain: "elevatehrg.com",
    blurb:
      "A marketing site for a veteran-owned exterior renovation contractor in northern New Jersey, built to win local search and book consultations.",
    stack: ["Next.js", "Playwright end-to-end tests", "Automated accessibility checks", "Lighthouse CI"],
    image: "/clients/elevate-hrg.webp",
    caseStudy: "/projects/elevate-hrg",
  },
  {
    name: "The Gen Z Mama",
    domain: "thegenzmama.com",
    blurb: "A site for a licensed childcare provider in Wharton, NJ, with a blog the owner updates without a developer.",
    stack: ["Next.js", "Sanity CMS", "Resend email", "Turnstile spam check"],
    image: "/clients/the-gen-z-mama.webp",
    caseStudy: "/projects/the-gen-z-mama",
  },
  {
    name: "Levelz Barber Studio",
    domain: "levelzbarberstudio.com",
    blurb: "A mobile-first site for a local barbershop, with appointments booked online through Booksy.",
    stack: ["HTML, CSS, and JavaScript", "Booksy booking", "Netlify"],
    image: "/clients/levelz.webp",
    caseStudy: "/projects/levelz-barber-studio",
  },
];

// Dark everywhere except a soft circle at the cursor
const FLASHLIGHT =
  "radial-gradient(circle var(--fr, 220px) at var(--fx, -999px) var(--fy, -999px), transparent 0%, transparent 40%, #000 100%)";

function ClientCard({ client, canHover, featured }: { client: Client; canHover: boolean; featured: boolean }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const inView = useInView(frameRef, { amount: 0.6 });
  const [hovering, setHovering] = useState(false);

  const move = (e: PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--fx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--fy", `${e.clientY - rect.top}px`);
  };

  // Phones have no cursor, so the whole screenshot lights up once it's in view
  const lit = !canHover && inView;

  return (
    <article className={`group flex flex-col gap-5 ${featured ? "lg:col-span-2" : ""}`}>
      <div
        ref={frameRef}
        onPointerMove={canHover ? move : undefined}
        onPointerEnter={canHover ? () => setHovering(true) : undefined}
        onPointerLeave={canHover ? () => setHovering(false) : undefined}
        className="relative overflow-hidden rounded-xl border border-secondary/15 bg-bg-elevated"
        style={{ ["--fr" as string]: featured ? "320px" : "220px" }}
      >
        {/* Browser bar, so it reads as a live site rather than a picture */}
        <div aria-hidden="true" className="flex items-center gap-2 border-b border-secondary/10 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-secondary/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-secondary/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-secondary/20" />
          <span className="ml-3 font-mono text-xs text-secondary/50">{client.domain}</span>
        </div>
        <div className="relative aspect-video">
          <Image
            src={client.image}
            alt={`Home page of ${client.domain}`}
            fill
            sizes={featured ? "(min-width: 1024px) 1100px, 100vw" : "(min-width: 1024px) 540px, 100vw"}
            className="object-cover object-top"
          />
          <div
            aria-hidden="true"
            className={`absolute inset-0 bg-bg-dark/85 transition-opacity duration-500 group-focus-within:opacity-0 ${
              lit ? "opacity-0" : "opacity-100"
            }`}
            style={canHover && hovering ? { WebkitMaskImage: FLASHLIGHT, maskImage: FLASHLIGHT } : undefined}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-2xl font-serif text-secondary">{client.name}</h3>
        <p className="text-[15px] leading-relaxed text-secondary/70 max-w-2xl">{client.blurb}</p>
        <ul className="flex flex-wrap gap-2" aria-label={`${client.name} stack`}>
          {client.stack.map((s) => (
            <li key={s} className="rounded-full border border-secondary/15 px-3 py-1 font-mono text-xs text-secondary/60">
              {s}
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1 font-mono text-sm">
          <a
            href={`https://${client.domain}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline-offset-4 hover:underline"
          >
            Visit {client.domain} ↗
          </a>
          <Link href={client.caseStudy} className="text-secondary/70 underline-offset-4 hover:text-primary hover:underline">
            Case study →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ClientSpotlight() {
  const canHover = useMediaQuery("(hover: hover) and (pointer: fine)");

  return (
    <section aria-labelledby="clients-heading" className="relative py-24 px-6 bg-bg-dark">
      <div className="max-w-6xl mx-auto">
        <div className="max-w-2xl flex flex-col gap-5">
          <span className="font-mono text-sm tracking-widest text-primary">04 · SHIPPED FOR REAL BUSINESSES</span>
          <h2 id="clients-heading" className="text-4xl md:text-5xl font-serif text-secondary leading-tight">
            Sites that local businesses run on every day.
          </h2>
          <p className="text-lg text-secondary/70 leading-relaxed">
            {canHover ? "Move your cursor over a site to light it up." : "Each site lights up as you reach it."} All three are
            live.
          </p>
        </div>

        <div className="mt-14 grid gap-14 lg:grid-cols-2 lg:gap-x-10">
          {CLIENTS.map((c, i) => (
            <ClientCard key={c.name} client={c} canHover={canHover} featured={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
