# AI Agent Instructions for This Repo (Next.js Portfolio)

Use these repo-specific notes to be productive immediately. Keep changes idiomatic to this codebase.

## Stack & Routing
- Next.js App Router with TypeScript in `app/` (e.g., `app/page.tsx`, per-route `layout.tsx`).
- Styling via Tailwind; theme tokens defined in `tailwind.config.ts`:
  - Colors: `primary` (#E77D22), `secondary` (#F0EDE4), `bg-dark` (#0D0D0D), `bg-elevated` (#1A1A1A)
  - Fonts: `font-serif`, `font-mono`, `font-sans`
- Animations: Framer Motion. 3D visuals: Three.js, constrained to the Hero.
- Icons: `lucide-react`. Utilities: `clsx`, `tailwind-merge`.

## Architecture & Conventions
- Root shell in `app/layout.tsx` wires `Navbar`, `Footer`, and wraps content in `components/ErrorBoundary`.
- Client-heavy components declare `"use client"` (e.g., `components/Hero.tsx`, `app/contact/page.tsx`). Add this when using hooks or browser APIs.
- Error handling: prefer `ErrorBoundary` around interactive sections; keep dev-only stack rendering behind `process.env.NODE_ENV === "development"`.
- Performance gating: use `hooks/use-performance-tier.ts` to pick heavy vs light visuals. Hero uses `MobileBeam` for lower tiers and post-processing beam for high tier.

## Content & Copy
- Site copy lives in the page and component files themselves (Home, Projects, About, Services, Contact, Resume).
- Components should consume copy from props or inline literals; there’s no CMS wired yet.

## Key Files & Patterns
- `components/Hero.tsx`: Three.js beam background + typing effect; switches renderer based on `usePerformanceTier()`.
- `app/contact/page.tsx`: Framer Motion transitions; the form posts to Netlify Forms with `fetch("/__forms.html")`. The form is declared in `public/__forms.html` (Netlify detects forms only in static HTML), and the field names there must match the ones the page sends. If the POST fails, the page offers a pre-filled `mailto:` instead. The site has no database.
- `components/ErrorBoundary.tsx`: reusable boundary with a themed fallback; supports optional `fallback` prop.
- `components/ui/*`: small, focused UI primitives (resume modal, indicators, backgrounds). Prefer adding reusable bits here.
- `lib/utils.ts`: general helpers. Co-locate small utilities here unless a new domain module is justified.

## Styling Guidelines
- Use Tailwind tokens instead of raw hex in components: `bg-bg-dark`, `bg-bg-elevated`, `text-secondary`, `text-primary`.
- For dynamic class composition, prefer `clsx` + `tailwind-merge` to avoid conflicting utilities.
- Maintain the Dark Tech Premium theme; do not introduce unrelated palettes.

## Developer Workflows
- Dev: `npm run dev` (Next.js)
- Lint: `npm run lint` (Next.js ESLint config)
- Build: `npm run build` → `npm start` (production)
- Deployment: Netlify. `main` deploys to production and pull requests get deploy previews; `sharp` is a regular dependency for `next/image`.

## Adding Features
- Pages: create `app/<route>/page.tsx` and optional `layout.tsx`. Export a default React component; add `"use client"` when using state/effects.
- Errors: wrap new top-level page content in `ErrorBoundary` if it involves external APIs or heavy client code.
- Animations: use Framer Motion patterns seen in `app/contact/page.tsx` (fade/slide via `initial/animate/transition`).
- 3D/Canvas: keep Three.js isolated to components; do not leak globals. Dispose resources in `useEffect` cleanup.

## Integration Notes
- The contact form submits to Netlify Forms (`public/__forms.html`), validates client-side, and shows success/error banners. There is no API route, server action or database, and no environment variables are needed. Client-side checks are not a security boundary, so keep the honeypot (`bot-field`) and input length limits in step with the declared form.
  - If a backend or database is ever added, validate on the server, keep secrets in server code only, and never put a service key in a `NEXT_PUBLIC_*` variable. With Supabase, expose only the anon key to the browser and enable row level security with insert-only policies first.

## Examples
- Error boundary usage:
  - Wrap: `<ErrorBoundary><Section /></ErrorBoundary>`; provide `fallback` for custom UI when needed.
- Performance tier:
  - `const tier = usePerformanceTier(); const showHeavy = tier === 'high';`
  - Render light visuals on `medium/low` to avoid jank.

## Guardrails
- Don’t add global state libraries unless necessary; current app is stateless beyond local UI.
- Keep component names and file placement consistent with existing structure (feature-level in `components/`, primitives in `components/ui/`).
- Respect TypeScript types and Next.js client/server boundaries.
