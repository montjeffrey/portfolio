"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, RefreshCw, Rocket, Award, Target, Code2, Shield } from "lucide-react";

const timeline = [
  {
    period: "2017-2019",
    title: "Engineering Foundation",
    institution: "NJIT - Electrical Engineering",
    description: "Completed 69 credits of electrical engineering coursework. It taught me to take a hard problem apart and work through it one piece at a time.",
    icon: BookOpen,
    color: "text-blue-400",
  },
  {
    period: "2019-2022",
    title: "Operations & Management",
    institution: "CVS Pharmacy & Dover College Promise",
    description: "Managed teams and daily operations at CVS, and was the only IT support for the nonprofit Dover College Promise. Both jobs showed me how much everyday work the right software could take over.",
    icon: Briefcase,
    color: "text-green-400",
  },
  {
    period: "2022-2025",
    title: "Where Data Integrity Started",
    institution: "The Scheer Immigration Law Group",
    description: "Administered Lawmatics (CRM) and Docketwise (CMS) across 1,000+ clients and 5,000+ records, and led the move to digital record-keeping for sensitive legal documents. This is where I got back into coding, picking Python and JavaScript up again to build the systems I was administering.",
    icon: RefreshCw,
    color: "text-purple-400",
  },
  {
    period: "2025-2026",
    title: "Freelance & Open Source",
    institution: "Freelance Developer & Consultant",
    description: "Shipped and maintain production sites for three local businesses, then in 2026 published developer tooling: agent-harness for coding agents, landfirst for merge planning, and tailnet-sentry and compute-pool for Tailscale networks.",
    icon: Rocket,
    color: "text-primary",
  },
  {
    period: "Dec 2025-Present",
    title: "Systems & Automation, Security-First",
    institution: "Divine Energy Solutions + Bugcrowd Researcher",
    description: "Building the internal platform and integrations for an energy-efficiency contractor: exactly-once job processing, OAuth integrations, and unprivileged containerized workers. Earned CompTIA Security+, landed an accepted Bugcrowd finding, and working toward the CCNA.",
    icon: Shield,
    color: "text-red-400",
  },
];

const certifications = [
  {
    name: "CompTIA Security+",
    year: "2026",
    status: "completed",
  },
  {
    name: "FreeCodeCamp JavaScript Algorithms & Data Structures",
    year: "2025",
    status: "completed",
  },
  {
    name: "FreeCodeCamp Responsive Web Design",
    year: "2025",
    status: "completed",
  },
  {
    name: "AWS Cloud Practitioner 2023 training (Skillsoft, 9 courses)",
    year: "2025",
    status: "completed",
  },
  {
    name: "HTM: Train Your Intake Specialist",
    year: "2024",
    status: "completed",
  },
  {
    name: "Cisco Certified Network Associate (CCNA)",
    year: "In progress",
    status: "in-progress",
  },
  {
    name: "CompTIA CySA+",
    year: "Up next",
    status: "in-progress",
  },
];

const stats = [
  { value: "Security+", label: "CompTIA certified" },
  { value: "4", label: "Open-source tools published" },
  { value: "3", label: "Live client websites shipped" },
  { value: "Bugcrowd", label: "Accepted security research finding" },
];

const technicalSkills = [
  {
    category: "Languages & Frameworks",
    skills: [
      { name: "Languages", items: ["TypeScript", "Python", "Go", "SQL"] },
      { name: "Web", items: ["Next.js", "React", "Node.js", "Tailwind CSS"] },
      { name: "Data", items: ["PostgreSQL / Supabase", "Redis / BullMQ", "Celery"] },
      { name: "Cloud", items: ["Azure", "AWS (training: VPC, EC2, IAM, S3)", "Netlify", "DNS"] },
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Infrastructure", items: ["Docker", "Linux", "Tailscale", "GitHub Actions"] },
      { name: "Integration", items: ["REST APIs", "OAuth 2.0", "Webhooks", "Playwright"] },
      { name: "Agents", items: ["MCP servers", "Claude Code", "Codex"] },
      { name: "Security", items: ["Kali Linux", "Nmap", "Wireshark", "Metasploit"] },
    ],
  },
];

import { EvervaultBackground } from "@/components/ui/evervault-background";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-bg-dark pb-20">
      {/* Hero Header with Evervault */}
      <div className="relative w-full h-[40vh] min-h-[400px] flex items-center justify-center overflow-hidden mb-20">
        <EvervaultBackground className="absolute inset-0" />
        <div className="relative z-10 max-w-4xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center bg-bg-elevated/50 backdrop-blur-md border border-primary/20 rounded-2xl p-8 md:p-12 shadow-2xl"
          >
            <h1 className="text-4xl md:text-6xl font-serif text-secondary mb-6">
              About Me
            </h1>
            <p className="text-xl md:text-2xl text-secondary/80 leading-relaxed">
              From Circuit Boards to Dashboards
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6">

        {/* By the Numbers */}
        <section className="mb-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-bg-elevated rounded-2xl p-6 md:p-8 border border-primary/20 text-center"
              >
                <div className="text-3xl md:text-4xl font-serif text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-secondary/70 text-sm leading-snug">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Professional Journey Timeline */}
        <section className="mb-20">
          <h2 className="text-4xl font-serif text-secondary mb-12 text-center">
            Professional Journey Timeline
          </h2>

          <div className="space-y-12">
            {timeline.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row gap-8 items-start ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                    }`}
                >
                  <div className="flex-1 bg-bg-elevated rounded-2xl p-8 border border-primary/20">
                    <div className="flex items-center gap-4 mb-4">
                      <Icon className={`w-8 h-8 ${item.color}`} />
                      <div>
                        <div className="text-primary font-mono text-sm mb-1">
                          {item.period}
                        </div>
                        <h3 className="text-2xl font-serif text-secondary font-bold">
                          {item.title}
                        </h3>
                        <div className="text-secondary/60 text-sm mt-1">
                          {item.institution}
                        </div>
                      </div>
                    </div>
                    <p className="text-secondary/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* About Me Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20 bg-bg-elevated rounded-2xl p-8 md:p-12 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6">
            My Story
          </h2>
          <div className="space-y-6 text-secondary/80 leading-relaxed">
            <p>
              I started coding in high school. Then, for a good few years, life took me elsewhere: I studied electrical engineering at NJIT, managed teams at CVS, and ran the client and case systems at an immigration law firm.
            </p>
            <p>
              The law firm is where I found it again. Keeping records straight for more than a thousand clients meant a lot of careful work by hand, and I kept thinking that code could do it better. So I picked Python and JavaScript back up and started building. I haven&apos;t stopped since.
            </p>
            <p>
              The years in between turned out to be useful. I know what it&apos;s like to be the person who depends on a system all day, so that&apos;s who I build for. I want the software to be easy to use, easy to keep running, and right about its records.
            </p>
            <p>
              Today I build the internal systems a business runs on: job queues that survive a worker being killed mid-batch, integrations that move invoices and job data between platforms without anyone re-keying them, and the sites three local businesses use to win customers. On my own time I write developer tooling and publish it on GitHub.
            </p>
            <p>
              Security is how I build, not a separate track. After earning my CompTIA Security+, I began researching vulnerabilities on Bugcrowd, where an accepted finding confirmed what I&apos;d suspected: understanding how systems break makes you better at building ones that don&apos;t. That shows up as least-privilege workers, secrets kept out of the environment, and failure tested on purpose. Next up are the CCNA and CySA+.
            </p>
          </div>

          {/* What Drives Me */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                What Drives Me
              </h3>
              <ul className="space-y-3 text-secondary/80">
                <li>• <strong className="text-secondary">Getting to the cause:</strong> I like finding out why something keeps going wrong and fixing it for good.</li>
                <li>• <strong className="text-secondary">Learning:</strong> There&apos;s always a next thing to learn. Right now it&apos;s the CCNA.</li>
                <li>• <strong className="text-secondary">Work that gets used:</strong> I care most about whether the people it was built for are still using it a year later.</li>
                <li>• <strong className="text-secondary">Giving back:</strong> People invested in me when they didn&apos;t have to. I want to do the same for others.</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Beyond The Code
              </h3>
              <p className="text-secondary/80 leading-relaxed">
                Outside of work I write developer tools and contribute to open-source projects. I mentored students through Dover College Promise for a while. My plate is too full for that right now, but I still believe in giving back to the people who invested in me.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-serif text-secondary mb-12 text-center flex items-center justify-center gap-3">
            <Award className="w-10 h-10 text-primary" />
            Certifications & Continuous Learning
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-serif text-secondary mb-6">Certifications & Training</h3>
              <div className="space-y-4">
                {certifications
                  .filter((c) => c.status === "completed")
                  .map((cert, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-primary text-xl">✅</span>
                      <div>
                        <div className="text-secondary font-semibold">{cert.name}</div>
                        <div className="text-secondary/60 text-sm">({cert.year})</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
              <h3 className="text-2xl font-serif text-secondary mb-6">In Progress</h3>
              <div className="space-y-4">
                {certifications
                  .filter((c) => c.status === "in-progress")
                  .map((cert, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-primary text-xl">🎯</span>
                      <div>
                        <div className="text-secondary font-semibold">{cert.name}</div>
                        <div className="text-secondary/60 text-sm">({cert.year})</div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Technical Proficiencies */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-4xl font-serif text-secondary mb-12 text-center">
            Technical Proficiencies
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {technicalSkills.map((group, groupIndex) => (
              <motion.div
                key={groupIndex}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: groupIndex * 0.2 }}
                className="bg-bg-elevated rounded-2xl p-8 border border-primary/20"
              >
                <h3 className="text-2xl font-serif text-secondary mb-6">{group.category}</h3>
                <div className="space-y-6">
                  {group.skills.map((skillGroup, skillIndex) => (
                    <div key={skillIndex}>
                      <h4 className="text-lg font-semibold text-secondary mb-3">
                        {skillGroup.name}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {skillGroup.items.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="px-3 py-1 bg-primary/20 text-primary rounded-full border border-primary/30 text-sm font-mono"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Soft Skills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
          >
            <h3 className="text-2xl font-serif text-secondary mb-6">
              Soft Skills That Matter
            </h3>
            <div className="flex flex-wrap gap-3">
              {[
                "Bilingual communication (English/Spanish)",
                "Cross-functional team leadership",
                "Client relationship management",
                "Technical documentation",
                "Public speaking",
              ].map((skill, i) => (
                <span
                  key={i}
                  className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-lg border border-primary/20 text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>
        </motion.section>
      </div>
    </div>
  );
}

