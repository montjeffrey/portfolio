// Renders the link-preview cards for individual pages: /services and two project pages.
// Sites that show a link as a card (LinkedIn, chat apps) fall back to a stock picture when a
// page has no preview image, so every link to this site looked the same there.
//
// Each card is written next to its page as opengraph-image.png, which Next picks up by file
// name. The cards use the site's own fonts, Georgia and Courier New. They are system fonts
// that can't be committed or relied on in the Linux build, so the images are rendered here
// once and the PNGs are committed. Re-run after changing the copy:
//
//   node scripts/generate-page-og-images.mjs
//
// Font files are read from the OS: C:\Windows\Fonts by default, or set OG_FONT_DIR to a
// folder holding georgia.ttf and cour.ttf.

import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/dist/compiled/@vercel/og/index.node.js";

const W = 1200;
const H = 630;
const ORANGE = "#E77D22";
const CREAM = "#F0EDE4";
const DARK = "#0D0D0D";

const fontDir = process.env.OG_FONT_DIR ?? "C:\\Windows\\Fonts";
const [georgia, courier] = await Promise.all([
  readFile(join(fontDir, "georgia.ttf")),
  readFile(join(fontDir, "cour.ttf")),
]);

const h = (type, style, ...children) => ({
  type,
  props: { style: { display: "flex", ...style }, children: children.length === 1 ? children[0] : children },
});

const layer = (background) => h("div", { position: "absolute", left: 0, top: 0, width: W, height: H, background });

// The home page's dot field, frozen mid-ripple: a hex grid that brightens toward one point
// and rings outward from it. Each card moves the point and the ring width so the cards are
// told apart at thumbnail size.
function dotField({ cx, cy, reach, ringWidth }) {
  const dots = [];
  const spacing = 24;
  for (let col = 0; col * spacing < W + spacing; col++) {
    for (let row = -1; row * spacing < H + spacing; row++) {
      const x = col * spacing;
      const y = row * spacing + (col % 2 ? spacing / 2 : 0);
      const d = Math.hypot(x - cx, y - cy);
      const k = Math.exp(-((d / reach) ** 2)) * (0.55 + 0.45 * Math.cos(d / ringWidth - 0.6));
      if (k < 0.03) continue;
      const r = 1.2 + 2.2 * k;
      dots.push(
        h("div", {
          position: "absolute",
          left: x - r,
          top: y - r,
          width: r * 2,
          height: r * 2,
          borderRadius: r,
          background: ORANGE,
          opacity: Math.min(0.95, 0.12 + 0.85 * k),
        }),
      );
    }
  }
  return dots;
}

// A screenshot of a client's site in a plain browser frame, on the right of the card.
function sitePanel(dataUri) {
  const width = 470;
  const bar = 34;
  return h(
    "div",
    {
      position: "absolute",
      left: 658,
      top: 80,
      width,
      height: bar + 436,
      flexDirection: "column",
      borderRadius: 14,
      overflow: "hidden",
      border: "1px solid rgba(240,237,228,0.22)",
      background: "#1A1A1A",
    },
    h(
      "div",
      { height: bar, alignItems: "center", gap: 8, paddingLeft: 14 },
      ...[0, 1, 2].map(() => h("div", { width: 10, height: 10, borderRadius: 5, background: "rgba(240,237,228,0.28)" })),
    ),
    { type: "img", props: { src: dataUri, width, height: Math.round((width * 686) / 700), style: { display: "flex" } } },
  );
}

function card({ tag, headline, subtitle, field, textWidth = 700, headlineSize = 60, panel }) {
  return h(
    "div",
    { position: "relative", width: W, height: H, background: DARK, fontFamily: "Georgia" },
    // glow behind the field, then the field, then a fade so the text sits on clean dark
    layer(
      `radial-gradient(circle at ${field.cx}px ${field.cy}px, rgba(231,125,34,0.28) 0%, rgba(231,125,34,0.08) 30%, rgba(13,13,13,0) 55%)`,
    ),
    ...dotField(field),
    layer("linear-gradient(90deg, #0D0D0D 0%, rgba(13,13,13,0.92) 42%, rgba(13,13,13,0) 72%)"),
    ...(panel ? [panel] : []),
    h(
      "div",
      {
        position: "absolute",
        left: 72,
        top: 64,
        bottom: 64,
        width: textWidth,
        flexDirection: "column",
        justifyContent: "space-between",
      },
      h("div", { fontFamily: "Courier New", fontSize: 22, letterSpacing: 4, color: ORANGE }, "JEFFREY MONTOYA"),
      h(
        "div",
        { flexDirection: "column", gap: 28 },
        h("div", { fontSize: headlineSize, lineHeight: 1.15, color: CREAM }, headline),
        h("div", { fontSize: 28, lineHeight: 1.35, color: "rgba(240,237,228,0.72)" }, subtitle),
      ),
      h(
        "div",
        { alignItems: "center", gap: 18, fontFamily: "Courier New", fontSize: 22, color: "rgba(240,237,228,0.6)" },
        h(
          "div",
          { background: CREAM, color: ORANGE, padding: "6px 14px", borderRadius: 6, fontFamily: "Georgia", fontSize: 24 },
          tag,
        ),
        "montjeffrey.dev",
      ),
    ),
  );
}

const genZMamaShot = await readFile(join(process.cwd(), "scripts", "og-assets", "the-gen-z-mama-site.jpg"));

const pages = [
  {
    dir: ["app", "services"],
    tag: "Services",
    headline: "Automations, integrations and internal tools.",
    subtitle: "Plus websites and security checks. Every job is scoped in writing before work starts.",
    field: { cx: 960, cy: 190, reach: 420, ringWidth: 34 },
  },
  {
    dir: ["app", "projects", "crm-integration"],
    tag: "Case study",
    headline: "Law firm lead tracking and records.",
    subtitle: "Lead pipelines from marketing partners, scanned documents logged, 5,000+ records maintained.",
    field: { cx: 900, cy: 500, reach: 460, ringWidth: 22 },
  },
  {
    dir: ["app", "projects", "the-gen-z-mama"],
    tag: "Client website",
    headline: "The Gen Z Mama",
    subtitle: "A childcare website, designed and built. Live at thegenzmama.com.",
    field: { cx: 900, cy: 320, reach: 520, ringWidth: 40 },
    textWidth: 540,
    panel: sitePanel(`data:image/jpeg;base64,${genZMamaShot.toString("base64")}`),
  },
];

for (const { dir, ...page } of pages) {
  const res = new ImageResponse(card(page), {
    width: W,
    height: H,
    fonts: [
      { name: "Georgia", data: georgia, weight: 400, style: "normal" },
      { name: "Courier New", data: courier, weight: 400, style: "normal" },
    ],
  });
  const out = join(process.cwd(), ...dir, "opengraph-image.png");
  await writeFile(out, Buffer.from(await res.arrayBuffer()));
  console.log(`wrote ${out}`);
}
