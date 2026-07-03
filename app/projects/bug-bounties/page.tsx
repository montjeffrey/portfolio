"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Bug,
  Shield,
  ShieldCheck,
  Target,
  Award,
  Lock,
  KeyRound,
  Fingerprint,
  FileCode,
  Crosshair,
  FileText,
  Search,
} from "lucide-react";

const PROFILE_URL = "https://bugcrowd.com/h/montjeffrey";

export default function BugBountyResearchCaseStudy() {
  return (
    <div className="min-h-screen bg-bg-dark pt-8 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          <h1 className="text-5xl md:text-6xl font-serif text-secondary mb-6">
            Bug Bounty Research
          </h1>
          <div className="flex flex-wrap gap-3 mb-6">
            <span className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30">
              Security Research
            </span>
            <span className="px-4 py-2 bg-secondary/10 text-secondary/80 rounded-full">
              Bugcrowd
            </span>
          </div>
          <p className="text-xl text-secondary/80 leading-relaxed mb-8">
            Web-application security research on Bugcrowd across multiple public
            programs. I focus on how applications handle identity and state —
            access control, authentication, OAuth/SSO, and exposed secrets —
            mapping how a system is actually used and probing it the way an
            attacker would. Findings below are described by technique and impact
            only; all targets are anonymized and tested within authorized
            program scope.
          </p>

          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            View Bugcrowd Profile
            <ExternalLink className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Authorization / Ethics banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-16 flex items-start gap-4 bg-bg-elevated rounded-2xl p-6 border border-primary/30"
        >
          <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
          <p className="text-secondary/80 leading-relaxed text-sm">
            <span className="text-secondary font-semibold">
              Authorized testing only.
            </span>{" "}
            All research is performed within the published scope and rules of
            each program under coordinated disclosure. No target names, live
            proof-of-concept exploits, or reproducible steps are published on
            this page — findings are described by vulnerability class, impact,
            and remediation.
          </p>
        </motion.div>

        {/* Bugcrowd Record */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Bugcrowd Record
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { value: "3", label: "Submissions reported" },
              { value: "1", label: "Accepted (P5, informational)" },
              { value: "3", label: "Public programs" },
              { value: "Web App", label: "Primary focus" },
            ].map((stat, i) => (
              <div
                key={i}
                className="bg-bg-elevated rounded-xl p-6 border border-primary/20 text-center"
              >
                <div className="text-3xl md:text-4xl font-serif text-primary font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-secondary/70 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
            <p className="text-secondary/80 leading-relaxed mb-6">
              Three submissions across three public bug bounty programs — one
              accepted as an informational finding, two triaged Not Applicable
              for lack of demonstrated impact. Early on the platform and building
              a track record of clean, in-scope reports through coordinated
              disclosure. The value here is in the techniques and the surface
              they cover, shown anonymized below.
            </p>

            <div className="flex items-center gap-3 mb-3">
              <Award className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold text-secondary">
                Earned achievements
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {["Bounty Bee — Level 1", "Submission Shogun — Level 1"].map(
                (badge, i) => (
                  <span
                    key={i}
                    className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30 text-sm font-semibold"
                  >
                    {badge}
                  </span>
                )
              )}
            </div>

            <a
              href={PROFILE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-6 text-primary hover:text-primary/80 font-semibold transition-colors"
            >
              Verify on Bugcrowd
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </motion.section>

        {/* Selected Research */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-4 flex items-center gap-3">
            <Search className="w-8 h-8 text-primary" />
            Selected Research
          </h2>
          <p className="text-secondary/70 leading-relaxed mb-8 text-sm">
            Reported findings across public programs, anonymized. Described by
            technique and impact only — no target names or reproducible detail.
          </p>

          <div className="space-y-6">
            {[
              {
                icon: FileCode,
                title: "Secrets Exposure in Client-Side Code",
                tags: ["Sensitive Data Exposure", "Web App"],
                status: "Reported · triaged Not Applicable",
                body: "An administrative API-gateway subscription key was hardcoded in a public JavaScript bundle, exposing authenticated API access to anyone who read the shipped frontend. Technique: auditing client-side bundles for leaked keys and tokens, then reasoning about what gateway-level access that key actually unlocks.",
              },
              {
                icon: Fingerprint,
                title: "Subdomain Takeover → OAuth Code Interception",
                tags: ["Subdomain Takeover", "OAuth", "Web App"],
                status: "Reported (P3) · triaged Not Applicable",
                body: "A dangling DNS record left a subdomain claimable — and that subdomain was referenced as an OAuth redirect_uri, so claiming it could intercept authorization codes. Technique: dangling-DNS / subdomain-takeover discovery chained with OAuth redirect-flow analysis.",
              },
              {
                icon: KeyRound,
                title: "User-ID Disclosure via Password-Reset Flow",
                tags: ["Info Disclosure", "Username Enumeration", "Web App"],
                status: "Accepted · P5 (informational)",
                body: "A forgot-password flow leaked an identity-provider user identifier and allowed username enumeration, letting an unauthenticated user confirm valid accounts and map internal IDs. Technique: authentication-flow analysis, enumeration, and identity-provider information-leak identification.",
              },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="bg-bg-elevated rounded-2xl p-8 border border-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <Icon className="w-7 h-7 text-primary shrink-0 mt-1" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {item.tags.map((tag, t) => (
                          <span
                            key={t}
                            className="px-3 py-1 bg-primary/20 text-primary text-xs rounded-full border border-primary/30 font-mono"
                          >
                            {tag}
                          </span>
                        ))}
                        <span className="px-3 py-1 bg-secondary/10 text-secondary/70 text-xs rounded-full">
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-secondary mb-2">
                        {item.title}
                      </h3>
                      <p className="text-secondary/80 leading-relaxed">
                        {item.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Technique deep-dive (lab) */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-4 flex items-center gap-3">
            <Bug className="w-8 h-8 text-primary" />
            Technique Deep-Dive: CSRF Forced Logout
          </h2>
          <p className="text-secondary/70 leading-relaxed mb-8 text-sm">
            A walkthrough from my own lab research — not a program submission —
            included to show how these request-forgery issues actually work.
          </p>

          <div className="bg-bg-elevated rounded-2xl p-8 border border-primary/20">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  The idea
                </h3>
                <p className="text-secondary/80 leading-relaxed">
                  A state-changing session endpoint accepts a cross-origin{" "}
                  <span className="font-mono text-primary">POST</span> with no
                  anti-CSRF protection. Because the request qualifies as a CORS
                  &quot;simple request&quot; (a{" "}
                  <span className="font-mono text-primary">text/plain</span>{" "}
                  body, so no preflight) and the session cookie is set{" "}
                  <span className="font-mono text-primary">SameSite=None</span>,
                  a page on any origin can submit the form with the victim&apos;s
                  cookies attached and trigger the action — forcing a logout.
                </p>
              </div>

              {/* Illustrative, sanitized concept — non-functional, reserved example domains */}
              <div>
                <h3 className="text-xl font-semibold text-secondary mb-3">
                  Mechanism (sanitized)
                </h3>
                <div className="bg-bg-dark rounded-lg p-6 border border-primary/20 font-mono text-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-secondary/60">
                      concept.html — illustrative only
                    </span>
                  </div>
                  <pre className="text-secondary/80 overflow-x-auto whitespace-pre-wrap">
{`<!-- Conceptual: a state-changing endpoint that skips CSRF
     validation and accepts a preflight-free "simple" request.
     Reserved example domains; not a working exploit. -->
<form action="https://victim.example/session/token"
      method="POST" enctype="text/plain">
  <input name='{"email":"a@evil.example","x":"' value='"}' />
</form>
<script>document.forms[0].submit()</script>`}
                  </pre>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-secondary mb-2">
                  Remediation
                </h3>
                <ul className="space-y-2">
                  {[
                    "Require an anti-CSRF token (or strict Origin/Referer checks) on all state-changing requests.",
                    "Reject text/plain bodies on JSON endpoints so they can no longer bypass CORS preflight.",
                    "Scope session cookies to SameSite=Lax or Strict rather than None.",
                  ].map((item, i) => (
                    <li
                      key={i}
                      className="text-secondary/70 text-sm flex items-start gap-2"
                    >
                      <span className="text-primary mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Focus Areas */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <Crosshair className="w-8 h-8 text-primary" />
            Focus Areas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                title: "Access Control & Authorization",
                description:
                  "Whether an unauthenticated or low-privilege user can reach data or actions they shouldn't — the class behind my accepted finding.",
                icon: Lock,
              },
              {
                title: "Authentication & Sessions",
                description:
                  "Login, logout, password-reset, and session handling — where identity is established and where it leaks.",
                icon: KeyRound,
              },
              {
                title: "OAuth & SSO Flows",
                description:
                  "redirect_uri handling, authorization-code flows, and identity-provider integrations that can be redirected or intercepted.",
                icon: Fingerprint,
              },
              {
                title: "Secrets in Client-Side Code",
                description:
                  "Keys, tokens, and internal endpoints leaked in shipped JavaScript bundles and the access they quietly grant.",
                icon: FileCode,
              },
            ].map((area, i) => {
              const Icon = area.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                  className="bg-bg-elevated rounded-xl p-6 border border-primary/20"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="w-6 h-6 text-primary" />
                    <h3 className="text-xl font-semibold text-secondary">
                      {area.title}
                    </h3>
                  </div>
                  <p className="text-secondary/80 leading-relaxed">
                    {area.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Process */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-16 bg-bg-elevated rounded-2xl p-8 border border-primary/20"
        >
          <h2 className="text-3xl font-serif text-secondary mb-8 flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Process
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[
              {
                step: "01",
                title: "Scope & recon",
                description:
                  "Read the program rules, stay in scope, and map the reachable attack surface before touching anything.",
              },
              {
                step: "02",
                title: "Hypothesis & test",
                description:
                  "Target a specific trust boundary and build the minimal test that would prove a real weakness.",
              },
              {
                step: "03",
                title: "Prove impact",
                description:
                  "Establish reproducibility and the concrete consequence — the bar that separates an accepted finding from an informational one.",
              },
              {
                step: "04",
                title: "Report & retest",
                description:
                  "Submit a clear write-up with severity and remediation, then verify the fix once the team ships it.",
              },
            ].map((phase, i) => (
              <div key={i} className="flex gap-4">
                <span className="text-2xl font-serif text-primary/60 font-bold">
                  {phase.step}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-secondary mb-1">
                    {phase.title}
                  </h3>
                  <p className="text-secondary/70 text-sm leading-relaxed">
                    {phase.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Tools & Techniques */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-serif text-secondary mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Tools &amp; Techniques
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              "Web Proxy / Intercept",
              "HTTP / CORS",
              "OAuth / SSO Flows",
              "JS Bundle Analysis",
              "Subdomain Enumeration",
              "Kali Linux",
              "VRT / Severity Triage",
            ].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-primary/20 text-primary rounded-full border border-primary/30 font-mono text-sm"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <a
            href={PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary hover:bg-primary/90 text-bg-dark rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            View Bugcrowd Profile
            <ExternalLink className="w-5 h-5" />
          </a>
          <Link
            href="/projects"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-primary/30 hover:border-primary text-secondary rounded-lg font-semibold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-sm"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Projects
          </Link>
        </motion.section>
      </div>
    </div>
  );
}
