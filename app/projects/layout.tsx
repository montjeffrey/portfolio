import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Jeffrey Montoya",
  description: "Open-source security and infrastructure tooling, client sites, and research by Jeffrey Montoya: tailnet-sentry, agent-harness, landfirst, compute-pool.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

