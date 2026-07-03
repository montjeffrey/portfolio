import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects - Jeffrey Montoya",
  description: "Explore work by Jeffrey Montoya — business automation, client websites, systems integration, ML analytics, and security tooling.",
};

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

