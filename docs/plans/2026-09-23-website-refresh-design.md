# Website Refresh — Design

Source: `website_refresh.md` (feedback from business partner review).

## Goals

1. Separate "how we engage with clients" (process) from "what we offer" (capabilities) — currently conflated on the Services page.
2. Make the homepage hero stats about industries clickable, driving traffic to `/industries`.
3. Give the Services page visual explanation, not just text.
4. Expand and rename industries to match current positioning.

## 1. Homepage (`src/pages/index.astro`)

- The "25 yrs" and "6" stat cards in `.hero-stats` become `<a href={withBase("/industries")}>` links (add a hover/focus style so they read as clickable; the "Embedded" and "Zero" cards stay plain divs).
- "6" becomes "7" to match the new industry count.
- The "See how we work" hero CTA changes to link to `/how-we-work` instead of `/services`. Label may become "See how we engage" for clarity.
- The homepage industry preview section (`industries.map(...)`) switches from its own hardcoded array to importing from the new shared `src/lib/industries.ts`.

## 2. New page: How We Work (`src/pages/how-we-work.astro`)

Not added to the primary header nav (`Header.astro` links stay: Home, Services, Industries, About, Contact). Reachable via:
- Homepage "See how we engage" CTA
- A link/CTA from the Services page
- A new entry in the Footer's "Company" link list

Content — 4-step timeline (reuse the existing `.timeline` CSS from the current services page):

1. **Initial Consultation** — understand the problem, the team, and the constraints before proposing anything.
2. **Engagement & Proposal** — a scoped plan built around the actual problem, not a generic playbook.
3. **Embedded Delivery** — a forward-deployed engineer embeds with your team, solves the real problem with AI, and teaches your team to do the same along the way (embed → solve → skill up).
4. **Pilot-to-Production Acceleration** — hardening what worked in step 3 for real production traffic, data, security, and compliance sign-off.

Most of this is a restructure of the current `services.astro` copy (Forward-Deployed AI Engineering / AI Operating Model & Best Practices / Pilot-to-Production Acceleration sections) into 4 timeline steps instead of 3 flat cards, rewritten to read as a process/journey rather than a service list.

Page ends with the standard CTA band ("Get in touch").

## 3. Rebuilt Services page (`src/pages/services.astro`)

Replaces the current "how we work"-flavored content entirely.

**Core Competencies** — 5 cards, each with a short description (copy to be drafted in the style of existing site copy):
- Analysis & Design
- QA Automation
- Cybersecurity
- LLM Training & Deployment
- AI Adoption

**Diagram** — inline SVG, hub-and-spoke layout: AI Adoption at the center (the outcome), the other 4 competencies arranged as spokes feeding into it (the capabilities that support it). No external image assets or chart libraries — static SVG styled with existing CSS custom properties so it themes correctly.

Page CTA band adds a secondary link to `/how-we-work` for visitors who came here looking for the engagement process instead.

## 4. Industries update

New shared data file: `src/lib/industries.ts`

```ts
export interface Industry {
  name: string;
  blurb: string;      // short, for homepage preview
  longBlurb: string;  // longer, for industries page
}

export const industries: Industry[] = [
  { name: "Pharma", ... },
  { name: "Life Sciences", ... },
  { name: "Financial Services", ... },   // new
  { name: "Insurance", ... },
  { name: "Retail", ... },               // renamed from "Retail IT"
  { name: "Cybersecurity", ... },
  { name: "Hospitality", ... },          // renamed from "Food Services"
];
```

- `src/pages/index.astro` and `src/pages/industries.astro` both import `industries` from this file instead of hardcoding their own arrays (fixes existing drift between the two pages).
- Homepage preview shows all 7 industries (no curation/subset).
- `industries.astro`'s intro copy ("25 years of experience...") and hero stay as-is aside from the list update.

## Out of scope / not changing

- Primary header nav structure (stays 5 links).
- About/Contact pages.
- Any CMS or content-collection migration — a single typed data file is enough for this size of site.
