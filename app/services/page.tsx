import Link from "next/link";
import { EvervaultBackground } from "@/components/ui/evervault-background";
import {
  ArrowRight,
  Workflow,
  Network,
  LayoutDashboard,
  Globe,
  HeartPulse,
  ShieldCheck,
  Lock,
  Users,
  type LucideIcon,
} from "lucide-react";
import Reveal from "@/components/Reveal";

type Service = {
  title: string;
  description: string;
  icon: LucideIcon;
};

const groups: { title: string; lead: string; services: Service[] }[] = [
  {
    title: "Automation and integrations",
    lead: "Most of my work is connecting the tools a business already uses, so nobody has to copy information from one into another.",
    services: [
      {
        title: "Automate one task",
        icon: Workflow,
        description:
          "One piece of repeated work handled from start to finish: data entry between two tools, a weekly report, reminders, or collecting documents from clients.",
      },
      {
        title: "Connect your systems",
        icon: Network,
        description:
          "Two or more tools kept in step, such as a CRM, QuickBooks, scheduling software, spreadsheets and email, so information is entered once.",
      },
      {
        title: "Internal tools and dashboards",
        icon: LayoutDashboard,
        description:
          "A small web app or dashboard built around a process that has outgrown its spreadsheet.",
      },
    ],
  },
  {
    title: "Websites",
    lead: "Sites for small businesses, built to load fast, read well on a phone and bring in enquiries.",
    services: [
      {
        title: "A new website",
        icon: Globe,
        description:
          "A mobile-first site with a contact form that reaches you and local search set up properly.",
      },
      {
        title: "Care plan",
        icon: HeartPulse,
        description:
          "Hosting, security updates, uptime and form checks, and small changes each month.",
      },
      {
        title: "Website security checkup",
        icon: ShieldCheck,
        description:
          "A plain-English report on how your site holds up, with the fixes listed in priority order.",
      },
    ],
  },
  {
    title: "For engineering teams",
    lead: "Help for teams that ship code and want an extra pair of hands.",
    services: [
      {
        title: "Build and release hardening",
        icon: Lock,
        description:
          "Pinned dependencies, least-privilege tokens, secret and vulnerability scanning, and signed releases for your CI/CD pipeline.",
      },
      {
        title: "Overflow development",
        icon: Users,
        description:
          "For agencies at capacity: I build to your spec and standards, under your name.",
      },
    ],
  },
];

const steps = [
  {
    title: "Tell me what's taking up time",
    description:
      "A short message or call about the task, the tools involved and what a good result looks like.",
  },
  {
    title: "I tell you what I'd do",
    description:
      "You get a written scope and a fixed price before any work starts. No obligation.",
  },
  {
    title: "I build it and hand it over",
    description:
      "You review the work as it comes together, and it arrives with notes so anyone can maintain it.",
  },
];

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-dark";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      {/* Hero header with the spotlight background, as on the other inner pages */}
      <div className="relative w-full min-h-[440px] pt-28 pb-12 flex items-center justify-center overflow-hidden mb-16">
        <EvervaultBackground className="absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
          <Reveal className="text-center bg-bg-elevated/50 backdrop-blur-md border border-primary/20 rounded-2xl p-8 md:p-12 shadow-2xl">
            <p className="text-sm font-mono uppercase tracking-widest text-primary mb-4">
              Services
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-6 text-balance">
              Work I take on
            </h1>
            <p className="text-xl md:text-2xl text-secondary/80 leading-relaxed text-balance">
              I build automations and the systems behind a business, and I keep
              what I build secure.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <Reveal className="text-center mb-20">
          <p className="text-lg md:text-xl text-secondary/70 max-w-2xl mx-auto leading-relaxed">
            Below is what I can help with. Every job starts with a
            conversation and a written scope.
          </p>
        </Reveal>

        {groups.map((group) => (
          <section key={group.title} className="mb-20">
            <Reveal className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-4 text-balance">
                {group.title}
              </h2>
              <p className="text-lg text-secondary/70 max-w-2xl mx-auto leading-relaxed">
                {group.lead}
              </p>
            </Reveal>

            <ul
              className={
                group.services.length === 2
                  ? "grid grid-cols-1 md:grid-cols-2 gap-6 lg:max-w-4xl lg:mx-auto"
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:max-lg:[&>li:last-child:nth-child(odd)]:col-span-2"
              }
            >
              {group.services.map((service, index) => {
                const Icon = service.icon;
                return (
                  <li key={service.title} className="flex">
                    <Reveal delay={index * 0.08} className="w-full">
                      <div
                        className="relative group h-full rounded-2xl p-6 sm:p-8 border transition-all duration-300 overflow-hidden
                          backdrop-blur-xl bg-bg-elevated/60
                          border-primary/30 hover:border-primary/60
                          hover:bg-bg-elevated/40
                          shadow-lg shadow-primary/10 hover:shadow-primary/20"
                      >
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent pointer-events-none" />
                        <EvervaultBackground className="rounded-2xl" radius={220} buffer={0} desktopOnly tone="soft" />

                        <div className="spotlight-text relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="flex items-center justify-center shrink-0 w-12 h-12 rounded-xl bg-primary/15 border border-primary/30">
                              <Icon className="w-6 h-6 text-primary" aria-hidden />
                            </span>
                            <h3 className="text-xl min-w-0 font-serif text-secondary font-bold">
                              {service.title}
                            </h3>
                          </div>
                          <p className="text-secondary/80 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </Reveal>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}

        <section className="mb-20">
          <Reveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-secondary text-balance">
              How it works
            </h2>
          </Reveal>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((step, index) => (
              <li key={step.title} className="flex">
                <Reveal delay={index * 0.08} className="w-full">
                  <div className="h-full rounded-2xl p-6 sm:p-8 border backdrop-blur-xl bg-bg-elevated/60 border-primary/30 shadow-lg shadow-primary/10">
                    <span
                      aria-hidden
                      className="block font-mono text-3xl text-primary mb-4"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-xl font-serif text-secondary font-bold mb-3">
                      {step.title}
                    </h3>
                    <p className="text-secondary/80 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="relative overflow-hidden rounded-3xl py-12 sm:py-16 px-4 sm:px-8">
          <EvervaultBackground className="rounded-3xl spotlight-fade" radius={450} />
          <Reveal className="spotlight-text relative z-10 max-w-3xl mx-auto text-center rounded-2xl p-8 sm:p-12 border backdrop-blur-xl bg-bg-elevated/50 border-primary/20 shadow-lg shadow-primary/10">
            <h2 className="text-3xl md:text-4xl font-serif text-secondary mb-4 text-balance">
              Something getting typed twice?
            </h2>
            <p className="text-lg text-secondary/70 max-w-2xl mx-auto leading-relaxed mb-8">
              Tell me about it. I&apos;m glad to take a look and tell you what
              I&apos;d do.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link
                href="/contact"
                className={`inline-flex items-center gap-2 px-8 py-4 bg-primary text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:bg-primary/90 motion-safe:hover:scale-105 group/button ${focusRing}`}
              >
                <span>Start a conversation</span>
                <ArrowRight
                  className="w-5 h-5 motion-safe:group-hover/button:translate-x-1 transition-transform"
                  aria-hidden
                />
              </Link>
              <Link
                href="/projects"
                className={`text-secondary underline underline-offset-4 decoration-primary/60 hover:text-primary rounded-sm ${focusRing}`}
              >
                See past work
              </Link>
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}
