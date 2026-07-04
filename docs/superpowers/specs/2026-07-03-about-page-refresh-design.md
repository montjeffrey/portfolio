# About Page Refresh — Design

**Date:** 2026-07-03
**File touched:** `app/about/page.tsx` (content/data + one new section)
**Approach:** Option B — rebalance the narrative toward the present while reusing existing components.

## Problem

The About page reads as an *origin story*. Three of four timeline slots and the entire "My Story" section cover how the user got *into* tech; everything built since is compressed into one vague "2024–Present" card, and the Bugcrowd security research is absent. Certifications are stale (Security+ shown as in-progress; Azure/Network+/A+ listed but inactive).

## Goals

1. Rebalance the timeline so the building phase gets real weight.
2. Rewrite the "My Story" ending to reflect who the user is *now*.
3. Surface concrete proof-of-work via a new stat band.
4. Correct the certifications to current, honest status.

## Changes

### 1. Timeline — split into two present-era cards

- Keep entries 1 (2017–2019 Engineering Foundation) and 2 (2019–2022 Operations & Management) unchanged.
- Entry 3 (2022–2024 The Strategic Pivot): drop stale "AWS (In Progress) / Azure (In Progress)" language.
- Replace the single 2024–Present card with two:
  - **2024 — Freelance & First Builds** (icon: `Rocket`): Launched independent practice; first production client sites, automations, ML sports analytics platform, law-firm CRM integration serving 5,000+ clients with a 60% lead-quality lift.
  - **2025–Present — Security Research & Scaling Clients** (icon: `Shield`): Earned Security+, joined Bugcrowd (accepted finding), delivered four live business websites plus ongoing automation/integration work, pursuing CCNA.

### 2. "My Story" — present-tense ending

Keep the first three paragraphs. Replace the generic 4th paragraph with two new paragraphs: one on shipped work (four live sites, ML platform, automations, 5,000+ CRM clients), one on the security pivot (Security+ → Bugcrowd accepted finding → CCNA).

### 3. NEW — "By the Numbers" stat band

A new section placed immediately after the hero, before the timeline. Four cards in the existing `bg-bg-elevated` / `border-primary/20` style with `whileInView` animation:

| Value | Label |
|---|---|
| 4 | Live client websites shipped |
| 5,000+ | Clients served via CRM integration |
| 60% | Lead-quality lift delivered |
| Bugcrowd | Accepted security research finding |

### 4. Certifications — updated data

- **Completed:** CompTIA Security+ (2026); FreeCodeCamp JS Algorithms & Data Structures (2025); FreeCodeCamp Responsive Web Design (2025); AWS Cloud Practitioner — *coursework completed*; HTM: Train Your Intake Specialist (2024).
- **In progress:** Cisco CCNA.
- **Removed:** Azure AZ-900, CompTIA Network+/A+.

## Non-goals

- No layout/visual redesign (Option C rejected).
- No changes to `components/AboutIntro.tsx` (homepage intro, separate surface).
- No new dependencies; new icons (`Shield`) come from the already-used `lucide-react`.

## Verification

- `npm run build` / dev server renders `/about` without errors.
- Visual check: five timeline cards, stat band after hero, updated certs (Security+ under completed, CCNA under in-progress, no Azure/Network+/A+).
