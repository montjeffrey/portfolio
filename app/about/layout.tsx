import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About - Jeffrey Montoya",
  description: "Jeffrey Montoya's path from Electrical Engineering and operations to security-minded systems engineering: CompTIA Security+, Bugcrowd research, and open-source tooling.",
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

