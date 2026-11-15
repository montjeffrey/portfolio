import type { Metadata } from "next";

export const metadata: Metadata = {
  // Lets the preview image beside each page (opengraph-image.png) resolve to a full URL.
  metadataBase: new URL("https://montjeffrey.dev"),
  title: "Services - Jeffrey Montoya",
  description: "Automations, integrations and internal tools that take repetitive work off a business's plate, plus websites and security checks. Every job is scoped and priced in writing before work starts.",
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
