"use client";

import { Cloud, Shield, Code, BarChart3 } from "lucide-react";
import { EvervaultBackground } from "@/components/ui/evervault-background";

const skills = [
  {
    title: "Automation & Operations",
    icon: BarChart3,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Business process automation</strong> —
        Erasing manual busywork by streamlining workflows across CRMs,
        spreadsheets, and APIs with intelligent data validation.
      </>
    ),
    outcome: "Cut manual data tasks by 50% through custom CRM automation workflows",
    badges: ["5,000+ Records Managed", "CRM Automation"],
    emoji: "📊",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Full-Stack Development",
    icon: Code,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Responsive, data-driven applications</strong> —
        Building robust web tools from complex CRM integrations to ML-powered
        analytics.
      </>
    ),
    outcome: "74% prediction accuracy in ML sports analytics platform",
    badges: ["ML", "Random Forest", "API Integrations"],
    emoji: "💻",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Cloud & Infrastructure",
    icon: Cloud,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Secure, scalable cloud foundations</strong> —
        VPC configuration, DNS management, and production deployments on AWS &
        Azure.
      </>
    ),
    outcome: "Deployed production sites on AWS with infrastructure-as-code practices",
    badges: ["AWS Deployed", "Multi-Environment"],
    emoji: "🌩️",
    gradient: "from-primary/20 to-primary/5",
  },
  {
    title: "Security & Compliance",
    icon: Shield,
    description: (
      <>
        <strong className="text-secondary group-hover:text-primary transition-colors duration-300">Security-first architecture</strong> —
        Network analysis, vulnerability assessment, and automated testing
        suites.
      </>
    ),
    outcome: "Reduced vulnerability exposure through automated security testing suites",
    badges: ["Kali Linux", "CVSS Tools", "Vulnerability Scanning"],
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
      className="relative group rounded-2xl p-8 border transition-all duration-300 overflow-hidden
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
        <div className="flex items-start gap-4 mb-4">
          <div className="text-4xl">{skill.emoji}</div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Icon className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-serif text-secondary font-bold">
                {skill.title}
              </h3>
            </div>
            <p className="text-secondary/80 leading-relaxed mb-4">
              {skill.description}
            </p>

            {/* Outcome Line */}
            <div className="mb-4 pl-4 border-l-2 border-primary/50 text-secondary/90 italic text-sm">
              "{skill.outcome}"
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mt-auto">
              {skill.badges.map((badge) => (
                <span
                  key={badge}
                  className="px-2 py-1 bg-primary/10 rounded-md text-xs font-semibold text-primary border border-primary/20 whitespace-nowrap"
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
      <EvervaultBackground className="rounded-none" radius={450} />

      {/* Top Gradient Blend */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-bg-dark to-transparent z-10 pointer-events-none" />

      {/* Content wrapper - allows mouse events to pass through to background */}
      <div className="relative z-10 max-w-7xl mx-auto">
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
