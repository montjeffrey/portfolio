// Renders each resume variant in data.mjs to HTML, then prints it to
// public/resumes/<file> with headless Chrome or Edge.
//   npm run resumes            build every variant
//   npm run resumes -- --html  also keep the HTML next to the PDFs' source
// Set CHROME_PATH if the browser is not in a standard location.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { contact, variants } from "./data.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, "..", "public", "resumes");
const keepHtml = process.argv.includes("--html");

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const css = (compact) => `
@page { size: Letter; margin: ${compact ? "0.45in 0.55in" : "0.5in 0.6in"}; }
* { box-sizing: border-box; }
body { margin: 0; font-family: "Calibri", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 10.2pt; line-height: 1.32; color: #1a1a1a; }
header { text-align: center; margin-bottom: 8pt; }
h1 { font-family: Georgia, "Times New Roman", serif; font-size: 21pt;
  margin: 0; font-weight: 700; text-transform: uppercase; }
.headline { font-size: 11pt; font-weight: 600; color: #1f4e79; margin: 2pt 0 3pt; }
.contact { font-size: 9.2pt; color: #333; }
h2 { font-size: 10.5pt; text-transform: uppercase; color: #1f4e79;
  border-bottom: 1px solid #1f4e79; margin: 9pt 0 4pt; padding-bottom: 1pt; }
p { margin: 0 0 3pt; }
.skills p { margin: 0 0 1.5pt; }
.job, .proj { margin-bottom: 5pt; break-inside: avoid; }
.row { display: flex; justify-content: space-between; gap: 12pt; }
.role { font-weight: 700; }
.dates { white-space: nowrap; color: #333; }
.sub { font-style: italic; color: #333; }
ul { margin: 2pt 0 0; padding-left: 14pt; }
li { margin: 0 0 1.5pt; }
.meta { color: #444; font-size: 9.2pt; }
.plain { list-style: none; padding-left: 0; }
body.compact { font-size: 9.7pt; line-height: 1.27; }
body.compact h2 { margin: 7pt 0 3pt; }
`;

function render(v) {
  const jobs = v.experience
    .map(
      (j) => `<div class="job">
  <div class="row"><span><span class="role">${esc(j.role)}</span>, ${esc(j.org)}</span><span class="dates">${esc(j.dates)}</span></div>
  <div class="sub">${esc(j.place)}${j.blurb ? ` · ${esc(j.blurb)}` : ""}</div>
  <ul>${j.bullets.map((b) => `<li>${Array.isArray(b) ? `<strong>${esc(b[0])}:</strong> ${esc(b[1])}` : esc(b)}</li>`).join("")}</ul>
</div>`
    )
    .join("\n");

  const earlier = `<div class="job"><div class="role">Earlier experience</div><ul>${v.earlier
    .map((e) => `<li><strong>${esc(e.role)}</strong>, ${esc(e.org)}, ${esc(e.place)} (${esc(e.dates)}): ${esc(e.note)}</li>`)
    .join("")}</ul></div>`;

  const projects = v.projects.length
    ? `<h2>${esc(v.projectsTitle)}</h2>\n${v.projects
        .map(
          (p) => `<div class="proj"><p><strong>${esc(p.name)}</strong> <span class="meta">(${esc(p.meta)})</span>: ${esc(p.text)}</p></div>`
        )
        .join("\n")}`
    : "";

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<title>${esc(contact.name)} – ${esc(v.label)} Resume</title>
<meta name="author" content="${esc(contact.name)}">
<style>${css(v.compact)}</style></head>
<body${v.compact ? ' class="compact"' : ""}>
<header>
  <h1>${esc(contact.name)}</h1>
  <div class="headline">${esc(v.headline)}</div>
  <div class="contact">${contact.line.map(esc).join(" · ")}</div>
</header>
<h2>Summary</h2>
<p>${esc(v.summary)}</p>
<h2>Skills</h2>
<div class="skills">${v.skills.map(([k, items]) => `<p><strong>${esc(k)}:</strong> ${esc(items)}</p>`).join("")}</div>
<h2>Experience</h2>
${jobs}
${earlier}
${projects}
<h2>Certifications</h2>
<ul class="plain">${v.certs.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>
<h2>Education</h2>
<ul class="plain">${v.education.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
</body></html>`;
}

function findBrowser() {
  const candidates = [
    process.env.CHROME_PATH,
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) throw new Error("No Chrome or Edge found; set CHROME_PATH.");
  return found;
}

const browser = findBrowser();
const work = mkdtempSync(join(tmpdir(), "resumes-"));
mkdirSync(outDir, { recursive: true });

try {
  for (const v of variants) {
    const html = render(v);
    const htmlPath = join(work, `${v.id}.html`);
    writeFileSync(htmlPath, html, "utf8");
    if (keepHtml) writeFileSync(join(here, `${v.id}.html`), html, "utf8");
    const pdfPath = join(outDir, v.file);
    execFileSync(
      browser,
      [
        "--headless=new",
        "--disable-gpu",
        "--no-pdf-header-footer",
        `--user-data-dir=${join(work, "profile")}`,
        `--print-to-pdf=${pdfPath}`,
        pathToFileURL(htmlPath).href,
      ],
      { stdio: "ignore" }
    );
    if (!existsSync(pdfPath)) throw new Error(`Browser did not write ${pdfPath}`);
    console.log(`wrote public/resumes/${v.file}`);
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}
