"use client";

import { motion } from "framer-motion";
import { BookOpen, Briefcase, RefreshCw, Rocket, Award, Target, Code2, Shield } from "lucide-react";

const timeline = [
  {
    period: "2017-2019",
    title: "Engineering Foundation",
    institution: "NJIT - Electrical Engineering",
    description: "Built analytical thinking and problem-solving skills through 69 credits of engineering coursework. Developed systematic approaches to complex problems that I apply to every coding challenge today.",
    icon: BookOpen,
    color: "text-blue-400",
  },
  {
    period: "2019-2022",
    title: "Operations & Management",
    institution: "CVS Pharmacy & Dover College Promise",
    description: "Managed teams, streamlined operations, and discovered my passion for using technology to solve business problems. Led digital transformation initiatives and served as sole IT support for nonprofit organization.",
    icon: Briefcase,
    color: "text-green-400",
  },
  {
    period: "2022-2024",
    title: "The Strategic Pivot",
    institution: "Certifications & Skill Building",
    description: "Completed FreeCodeCamp's JavaScript Algorithms & Data Structures and Responsive Web Design tracks, and self-taught Python, React, and ML fundamentals. Traded a management title for the skills to build the systems I used to manage.",
    icon: RefreshCw,
    color: "text-purple-400",
  },
  {
    period: "2024",
    title: "Freelance & First Builds",
    institution: "Freelance Developer & Consultant",
    description: "Launched an independent practice and started shipping results for clients: business websites that win local search, automations that erase hours of manual work, and a law-firm CRM integration serving 5,000+ clients that lifted lead quality 60%—plus a machine-learning analytics platform on the side.",
    icon: Rocket,
    color: "text-primary",
  },
  {
    period: "2025-Present",
    title: "Security Research & Scaling Clients",
    institution: "Freelance + Bugcrowd Researcher",
    description: "Expanded from building to breaking. Earned CompTIA Security+ and joined Bugcrowd as a security researcher — landing an accepted vulnerability finding. Delivered four live business websites plus ongoing automation and integration work, while deepening networking expertise toward the CCNA.",
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
    name: "AWS Cloud Practitioner",
    year: "Coursework completed",
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
];

const stats = [
  { value: "4", label: "Live client websites shipped" },
  { value: "5,000+", label: "Clients served via CRM integration" },
  { value: "60%", label: "Lead-quality lift delivered" },
  { value: "Bugcrowd", label: "Accepted security research finding" },
];

const technicalSkills = [
  {
    category: "Languages & Frameworks",
    skills: [
      { name: "Frontend", items: ["HTML5", "CSS3", "JavaScript (ES6+)", "React"] },
      { name: "Backend", items: ["Python", "Java", "C#", "Node.js"] },
      { name: "Databases", items: ["SQL", "Relational database design"] },
      { name: "Cloud", items: ["AWS (VPC, EC2, S3)", "Azure fundamentals"] },
    ],
  },
  {
    category: "Tools & Platforms",
    skills: [
      { name: "Version Control", items: ["Git", "GitHub"] },
      { name: "CRM/CMS", items: ["Salesforce", "Lawmatics", "Docketwise"] },
      { name: "Development", items: ["VS Code", "REST APIs", "Postman"] },
      { name: "Security", items: ["Wireshark", "Nmap", "CVSS framework"] },
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
              My path to software development wasn't traditional, but that's exactly what makes me valuable to your team.
            </p>
            <p>
              I started in Electrical Engineering at NJIT, where I learned to think systematically about complex problems. When I transitioned to operations management at CVS and later at a law firm, I discovered how technology could transform business efficiency—but only when built by someone who truly understands operational needs.
            </p>
            <p>
              Managing CRM systems for 5000+ clients taught me that good code isn't just functional; it's maintainable, scalable, and user-friendly. Leading teams showed me that the best solutions come from understanding both technical constraints and human needs.
            </p>
            <p>
              Today that operational instinct shows up in results for the businesses I work with: four live websites winning local search, automations that erase hours of manual busywork every week, and integrations that keep messy data in sync. Managing CRM data for 5,000+ clients taught me that software only matters when it makes someone's day easier—so that's exactly what I build.
            </p>
            <p>
              I've also turned that same systematic thinking toward security. After earning my CompTIA Security+, I began researching vulnerabilities on Bugcrowd, where an accepted finding confirmed what I'd suspected: understanding how systems break makes you better at building ones that don't. For the clients I serve, that means solutions that are secure and reliable by default—and I'm deepening those foundations further toward the CCNA.
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
                <li>• <strong className="text-secondary">Problem-Solving:</strong> Every bug is a puzzle, every feature request an opportunity to innovate</li>
                <li>• <strong className="text-secondary">Continuous Learning:</strong> From AWS certifications to new frameworks, I'm always expanding my toolkit</li>
                <li>• <strong className="text-secondary">Real Impact:</strong> Building solutions that deliver measurable business results</li>
                <li>• <strong className="text-secondary">Community:</strong> Mentoring the next generation through Dover College Promise</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary mb-4 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-primary" />
                Beyond The Code
              </h3>
              <p className="text-secondary/80 leading-relaxed">
                When I'm not debugging code or optimizing databases, you'll find me mentoring students, exploring new ML algorithms, or contributing to open-source projects. I believe in giving back to the community that helped me transition into tech.
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
              <h3 className="text-2xl font-serif text-secondary mb-6">Current Certifications</h3>
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
                "Public speaking and mentorship",
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

