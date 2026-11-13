import { Briefcase, Shield, Workflow, type LucideIcon } from "lucide-react";

// The PDFs are generated from resumes/data.mjs with `npm run resumes`.
// Keep ids in step with the `file` names there.
export type ResumeVariant = {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  downloadName: string;
  icon: LucideIcon;
  color: string;
};

export const resumeVariants: ResumeVariant[] = [
  {
    id: "technical",
    title: "Security & Infrastructure",
    description: "For security engineering, SOC, cloud and infrastructure roles",
    highlights: [
      "Least-privilege workers and secrets handling in production",
      "tailnet-sentry, signed release provenance, security lab",
      "Security+, accepted Bugcrowd finding, CCNA in progress",
    ],
    downloadName: "Jeffrey-Montoya-Security-Infrastructure-Resume.pdf",
    icon: Shield,
    color: "text-red-400",
  },
  {
    id: "solutions-engineer",
    title: "Systems & Automation",
    description: "For software, automation, integration and solutions engineering roles",
    highlights: [
      "Production CRM, OAuth integrations and exactly-once job queues",
      "ETL between business systems and automated KPI reporting",
      "Open-source Go and Python tools, 14 merged upstream PRs",
    ],
    downloadName: "Jeffrey-Montoya-Systems-Automation-Resume.pdf",
    icon: Workflow,
    color: "text-blue-400",
  },
  {
    id: "general",
    title: "IT & Operations",
    description: "For IT support, systems administration, data and operations roles",
    highlights: [
      "CRM administration across 5,000+ records",
      "Data validation, reporting automation and audit-ready records",
      "Network and endpoint support, bilingual English/Spanish",
    ],
    downloadName: "Jeffrey-Montoya-IT-Operations-Resume.pdf",
    icon: Briefcase,
    color: "text-green-400",
  },
];

export const resumePath = (id: string) => `/resumes/${id}.pdf`;
