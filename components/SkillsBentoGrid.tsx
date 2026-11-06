"use client";

import { Cloud, Shield, Code, BarChart3 } from "lucide-react";
import { EvervaultBackground } from "@/components/ui/evervault-background";

const skills = [
  {
    title: "Automation & Integration",
    icon: BarChart3,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Pipelines that don&apos;t drop records</strong> —
        Integrations across CRMs, payroll, and accounting APIs, with
        validation at every hop and failure tested on purpose.
      </>
    ),
    outcome: "Exactly-once job processing, proven by a chaos test that kills the worker mid-batch",
    badges: ["Transactional Outbox", "Redis / BullMQ", "ETL"],
    emoji: "📊",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Full-Stack Development",
    icon: Code,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Typed apps from the API to the database</strong> —
        Web apps, internal tools, and the client sites small businesses
        run on.
      </>
    ),
    outcome: "Three production client sites shipped and maintained end to end",
    badges: ["Next.js", "TypeScript", "Supabase / Postgres"],
    emoji: "💻",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Cloud & Infrastructure",
    icon: Cloud,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Least privilege by default</strong> —
        Containers, tailnets, and CI pipelines built so a single leaked
        credential doesn&apos;t become an incident.
      </>
    ),
    outcome: "Read-only CI tokens, SHA-pinned actions, secret scanning, and release binaries with signed build provenance",
    badges: ["Docker", "Tailscale", "GitHub Actions"],
    emoji: "🌩️",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Security-first architecture</strong> —
        Network analysis, web application testing, and defensive tooling
        for networks I own.
      </>
    ),
    outcome: "CompTIA Security+ certified, with an accepted Bugcrowd finding",
    badges: ["Security+", "OWASP Testing", "Kali Linux"],
    emoji: "🛡️",
    gradient: "from-primary/20 to-primary/5",
  },
];

// Skill Card component - glassmorphism effect that reveals background effect on hover
const SkillCard = ({
  skill,
  index,
  Icon
}: {
  skill: typeof skills[0];
  index: number;
  Icon: typeof Cloud;
}) => {
  return (
    <div
      data-spotlight-anchor="skills-card"
      className="relative group rounded-2xl p-5 sm:p-8 border transition-all duration-300 overflow-hidden
        backdrop-blur-xl bg-bg-elevated/60
        border-primary/30 hover:border-primary/60
        hover:bg-bg-elevated/40 hover:backdrop-blur-2xl md:hover:scale-105 md:hover:-translate-y-2
        active:scale-95 transition-transform
        shadow-lg shadow-primary/10 hover:shadow-primary/20"
    >
      {/* Glassmorphism overlay for depth */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />

      {/* Content layer */}
      <div className="relative z-10 h-full flex flex-col">
        <div className="flex items-start gap-3 sm:gap-4 mb-4">
          <div className="text-3xl sm:text-4xl">{skill.emoji}</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 sm:gap-3 mb-2">
              <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 text-primary" />
              <h3 className="text-xl sm:text-2xl break-words min-w-0 font-serif text-secondary font-bold">
                {skill.title}
              </h3>
            </div>
            <p className="text-secondary/80 leading-relaxed mb-4">
              {skill.description}
            </p>

            {/* Outcome Line */}
            <div className="mb-4 pl-3 sm:pl-4 border-l-2 border-primary/50 text-secondary/90 italic text-sm">
              "{skill.outcome}"
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {skill.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-1 bg-primary/10 rounded-md text-xs font-semibold text-primary border border-primary/20 sm:whitespace-nowrap"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function SkillsBentoGrid() {
  return (
    <section className="relative py-20 px-6 bg-bg-dark overflow-hidden min-h-[800px] group/section">
      {/* Evervault background effect - covers entire section */}
      <EvervaultBackground className="rounded-none spotlight-fade" radius={450} />

      {/* Top Gradient Blend */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark to-transparent z-10 pointer-events-none" />

      {/* Content wrapper - allows mouse events to pass through to background */}
      <div className="spotlight-text relative z-10 max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-16">
          <h2
            data-spotlight-anchor="skills-title"
            className="text-4xl md:text-5xl font-serif text-secondary text-center relative z-20 
              backdrop-blur-xl bg-bg-elevated/60 rounded-2xl py-4 px-8
              border border-primary/30 shadow-lg shadow-primary/10
              hover:border-primary/60 hover:bg-bg-elevated/40 hover:backdrop-blur-2xl
              transition-all duration-300"
          >
            Skills Snapshot
          </h2>
          <div
            className="mt-6 backdrop-blur-md bg-bg-elevated/40 rounded-full py-2 px-6
              border border-primary/20 shadow-sm
              hover:border-primary/40 hover:bg-bg-elevated/50
              transition-all duration-300 text-center"
          >
            <span className="text-xl text-secondary/90 font-serif italic text-center animate-fade-in">
              Where technical depth meets business impact
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-20">
          {skills.map((skill, index) => {
            const Icon = skill.icon;
            return (
              <SkillCard key={skill.title} skill={skill} index={index} Icon={Icon} />
            );
          })}
        </div>
      </div>
    </section>
  );
}
