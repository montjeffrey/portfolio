// Response headers for every route, including the static files in public/.
// The site loads only its own scripts, styles, images and fonts (next/font
// self-hosts Inter at build time), and the one network call is the contact
// form's POST to /__forms.html, so the policy below is all 'self'.
// Next's inline bootstrap scripts and Framer Motion's inline styles need
// 'unsafe-inline'. The full policy is Report-Only until it has been checked
// against the browser console; the enforced one is only frame-ancestors,
// which browsers ignore in Report-Only.
const contentSecurityPolicyReportOnly = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self'",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=31536000" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  {
    key: "Content-Security-Policy-Report-Only",
    value: contentSecurityPolicyReportOnly,
  },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so Next doesn't pick up a stray parent lockfile
  // (e.g. C:\Users\colom\package-lock.json) as the inferred root.
  turbopack: {
    root: import.meta.dirname,
  },
  images: {
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;

