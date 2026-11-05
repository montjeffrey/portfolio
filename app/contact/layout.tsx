import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact - Jeffrey Montoya",
  description: "Contact Jeffrey Montoya about security, infrastructure, and automation roles, or a select client project. Based in Dover, NJ, open to hybrid or remote work.",
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

