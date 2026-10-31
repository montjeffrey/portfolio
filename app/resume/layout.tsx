import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume Hub - Jeffrey Montoya",
  description: "Download Jeffrey Montoya's resume: security-minded systems engineering, automation, and infrastructure.",
};

export default function ResumeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

