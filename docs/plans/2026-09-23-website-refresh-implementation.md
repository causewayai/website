# Website Refresh Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Split "how we work" (process) from "services" (capabilities) into separate pages, add a hub-and-spoke diagram to Services, make homepage industry stats clickable, and expand/rename the industries list to 7, backed by a single shared data file.

**Architecture:** Static Astro site, no framework/build changes needed. One new data file (`src/lib/industries.ts`) becomes the single source of truth for industries content, replacing two hardcoded arrays. One new page (`how-we-work.astro`) absorbs and restructures the current Services copy. Services is rebuilt with new content plus an inline SVG diagram — no new dependencies.

**Tech Stack:** Astro 4, plain CSS (`src/styles/global.css`), no test framework present in this repo.

**Verification approach:** This repo has no test suite. "Verify" steps below mean: `npm run build` succeeds (catches Astro syntax/type errors) and a visual check via `npm run dev`. Do this after every task, not just at the end.

---

### Task 0: Baseline build check

**Step 1:** Confirm the site currently builds clean before making changes.

Run: `npm run build`
Expected: Build succeeds with no errors (existing site is already deployed, so this should pass).

---

### Task 1: Shared industries data file

**Files:**
- Create: `src/lib/industries.ts`

**Step 1: Write the data file**

```ts
export interface Industry {
  name: string;
  blurb: string;      // short — used on homepage preview
  longBlurb: string;  // longer — used on /industries page
}

export const industries: Industry[] = [
  {
    name: "Pharma",
    blurb: "Regulated manufacturing, quality, and compliance.",
    longBlurb:
      "Regulated manufacturing, quality systems, and compliance workflows where mistakes have real consequences. Our engineering practices are built around audit and validation from the start.",
  },
  {
    name: "Life Sciences",
    blurb: "Research, clinical, and lab operations at scale.",
    longBlurb:
      "Deep familiarity with research and lab operations, where data integrity and traceability aren't optional. We build AI systems that respect the rigor this field demands.",
  },
  {
    name: "Financial Services",
    blurb: "Regulatory reporting, risk, and transaction systems under strict compliance demands.",
    longBlurb:
      "Regulatory reporting, risk management, and transaction processing where compliance and auditability aren't optional. We build AI systems your risk and compliance teams can actually sign off on.",
  },
  {
    name: "Insurance",
    blurb: "Underwriting, claims, and risk operations.",
    longBlurb:
      "Underwriting, claims, and risk operations where accuracy and explainability matter as much as speed. We help teams apply AI without compromising the controls the business relies on.",
  },
  {
    name: "Retail",
    blurb: "Store systems, e-commerce, and supply chain operations.",
    longBlurb:
      "25 years of experience keeping store systems, e-commerce platforms, and supply chains running at scale. We know how AI has to fit around peak-season traffic and razor-thin tolerance for downtime.",
  },
  {
    name: "Cybersecurity",
    blurb: "Threat operations and secure-by-design engineering.",
    longBlurb:
      "Threat operations and secure-by-design engineering are in our background, not an afterthought. Every system we build is engineered with security as a first-class requirement.",
  },
  {
    name: "Hospitality",
    blurb: "Operations, safety, and logistics under tight margins.",
    longBlurb:
      "Operations, safety, and logistics under tight margins and constant operational pressure. We design AI support that fits real-world operational tempo, not a lab environment.",
  },
];
```

**Step 2: Verify**

Run: `npm run build`
Expected: Still succeeds (new file isn't imported anywhere yet, so this just confirms no syntax errors in the `.ts` file).

**Step 3: Commit**

```bash
git add src/lib/industries.ts
git commit -m "Add shared industries data file"
```

---

### Task 2: Update `/industries` page to use shared data

**Files:**
- Modify: `src/pages/industries.astro`

**Step 1: Replace the hardcoded array and update the template**

Replace lines 1–30 (imports + hardcoded `industries` const) with:

```astro
---
import Layout from "../layouts/Layout.astro";
import { withBase } from "../lib/url";
import { industries } from "../lib/industries";
---
```

Update the card-rendering loop (currently `ind.blurb`) to use `ind.longBlurb`:

```astro
      <div class="grid grid-2">
        {industries.map((ind) => (
          <div class="card">
            <h3>{ind.name}</h3>
            <p>{ind.longBlurb}</p>
          </div>
        ))}
      </div>
```

Leave the rest of the page (hero copy, CTA band) unchanged — the `description` prop on `<Layout>` can stay as-is or be updated to mention "seven" instead of an implicit six; it doesn't name a count today so no change needed there.

**Step 2: Verify**

Run: `npm run build`
Expected: Succeeds. Run `npm run dev`, open `/industries`, confirm 7 cards render: Pharma, Life Sciences, Financial Services, Insurance, Retail, Cybersecurity, Hospitality.

**Step 3: Commit**

```bash
git add src/pages/industries.astro
git commit -m "Wire industries page to shared data (adds Financial Services, renames Retail/Hospitality)"
```

---

### Task 3: Update homepage industries preview to use shared data

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace the hardcoded array**

Replace the `const industries = [...]` block (lines 5–12) with an import:

```astro
---
import Layout from "../layouts/Layout.astro";
import { withBase } from "../lib/url";
import { industries } from "../lib/industries";
---
```

**Step 2: Update the preview loop to use `.blurb` (short) — no change needed there**, since the existing loop already reads `ind.blurb` and the shared data type keeps that field name. Just confirm the loop still reads:

```astro
      <div class="industry-list">
        {industries.map((ind) => (
          <div class="industry-item">
            <span class="dot"></span>
            <div>
              <h4>{ind.name}</h4>
              <p>{ind.blurb}</p>
            </div>
          </div>
        ))}
      </div>
```

**Step 3: Verify**

Run: `npm run build`. Run `npm run dev`, open `/`, confirm the Industries section shows all 7 entries.

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "Sync homepage industries preview with shared data"
```

---

### Task 4: Make homepage hero stat cards link to Industries, update count

**Files:**
- Modify: `src/pages/index.astro`
- Modify: `src/styles/global.css`

**Step 1: Change the two stat cards to links**

In the `.hero-stats` block, change:

```astro
        <div class="stat-card">
          <div class="num">25 yrs</div>
          <p class="label">Enterprise engineering experience</p>
        </div>
        <div class="stat-card">
          <div class="num">6</div>
          <p class="label">Regulated industries served</p>
        </div>
```

to:

```astro
        <a href={withBase("/industries")} class="stat-card stat-card-link">
          <div class="num">25 yrs</div>
          <p class="label">Enterprise engineering experience</p>
        </a>
        <a href={withBase("/industries")} class="stat-card stat-card-link">
          <div class="num">{industries.length}</div>
          <p class="label">Regulated industries served</p>
        </a>
```

Using `{industries.length}` instead of hardcoding `7` means this number can never drift from the data file again.

The other two cards ("Embedded", "Zero") stay as plain `<div class="stat-card">`.

**Step 2: Add hover/focus styling for the new link cards**

In `src/styles/global.css`, immediately after the existing `.stat-card .label` rule (around line 239), add:

```css
.stat-card-link {
  text-decoration: none;
  display: block;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.stat-card-link:hover,
.stat-card-link:focus-visible {
  border-color: var(--accent);
  transform: translateY(-2px);
}
```

**Step 3: Verify**

Run: `npm run build`. Run `npm run dev`, open `/`, confirm the "25 yrs" and "7" cards are clickable, navigate to `/industries`, and hover shows the accent border + lift.

**Step 4: Commit**

```bash
git add src/pages/index.astro src/styles/global.css
git commit -m "Link homepage industry stat cards to /industries"
```

---

### Task 5: Point homepage CTA at the new How We Work page

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Update the hero CTA**

Change:

```astro
          <a href={withBase("/services")} class="btn btn-outline">See how we work</a>
```

to:

```astro
          <a href={withBase("/how-we-work")} class="btn btn-outline">See how we engage</a>
```

(This link will 404 until Task 6 creates the page — that's fine, it's part of the same feature and will be fixed within this same work session before it's ever deployed.)

**Step 2: Commit**

```bash
git add src/pages/index.astro
git commit -m "Point homepage CTA to How We Work instead of Services"
```

(No standalone build/dev verification here — Task 6 verification covers this link once the target page exists.)

---

### Task 6: Create the How We Work page

**Files:**
- Create: `src/pages/how-we-work.astro`

**Step 1: Write the page**

```astro
---
import Layout from "../layouts/Layout.astro";
import { withBase } from "../lib/url";

const steps = [
  {
    title: "Initial Consultation",
    desc: "We start by understanding the problem, your team, and the constraints you're actually operating under — before proposing anything.",
  },
  {
    title: "Engagement & Proposal",
    desc: "A scoped plan built around your actual problem, not a generic AI playbook. You know exactly what you're getting and why.",
  },
  {
    title: "Embedded Delivery",
    desc: "A forward-deployed engineer embeds directly with your team, solves the real problem with AI, and teaches your team to do the same along the way — embed, solve, and skill up.",
  },
  {
    title: "Pilot-to-Production Acceleration",
    desc: "We harden what worked into something that survives real production traffic, real data, and real security and compliance sign-off.",
  },
];
---

<Layout
  title="How We Work"
  description="How CausewayAI engages with clients: initial consultation, engagement and proposal, embedded delivery, and pilot-to-production acceleration."
  current="how-we-work"
>
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">How We Work</p>
      <h1>How we engage, from first conversation to production.</h1>
      <p class="lead">
        This is our process for working with your team — not a slide deck, an actual engagement
        model built around embedding, solving your real problem, and leaving your team better
        equipped than we found them.
      </p>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="timeline">
        {steps.map((step) => (
          <div class="timeline-item">
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="cta-band">
        <h2>Ready to talk through your situation?</h2>
        <p>Tell us where you're stuck, and we'll walk you through how an engagement would actually work.</p>
        <div class="hero-actions">
          <a href={withBase("/contact")} class="btn btn-accent">Get in touch</a>
        </div>
      </div>
    </div>
  </section>
</Layout>
```

**Step 2: Verify**

Run: `npm run build`
Expected: Succeeds. Run `npm run dev`, open `/how-we-work` directly, confirm the 4-step timeline renders using the existing timeline styling. Then go to `/` and click "See how we engage" — confirm it lands here.

**Step 3: Commit**

```bash
git add src/pages/how-we-work.astro
git commit -m "Add How We Work page with 4-step engagement timeline"
```

---

### Task 7: Add How We Work to the footer link list

**Files:**
- Modify: `src/components/Footer.astro`

**Step 1: Add the link**

In the "Company" column, change:

```astro
      <div>
        <h4>Company</h4>
        <a href={withBase("/services")}>Services</a>
        <a href={withBase("/industries")}>Industries</a>
        <a href={withBase("/about")}>About</a>
        <a href={withBase("/contact")}>Contact</a>
      </div>
```

to:

```astro
      <div>
        <h4>Company</h4>
        <a href={withBase("/services")}>Services</a>
        <a href={withBase("/how-we-work")}>How We Work</a>
        <a href={withBase("/industries")}>Industries</a>
        <a href={withBase("/about")}>About</a>
        <a href={withBase("/contact")}>Contact</a>
      </div>
```

**Step 2: Verify**

Run: `npm run build`. Run `npm run dev`, check the footer on any page shows "How We Work" and links correctly.

**Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "Add How We Work link to footer"
```

---

### Task 8: Rebuild the Services page — core competencies content

**Files:**
- Modify: `src/pages/services.astro`

**Step 1: Replace the entire file**

```astro
---
import Layout from "../layouts/Layout.astro";
import { withBase } from "../lib/url";

const competencies = [
  {
    id: "analysis-design",
    title: "Analysis & Design",
    desc: "We start with the problem worth solving, not the model that's trendy. Requirements, data flows, and system design happen before a line of AI code ships.",
  },
  {
    id: "qa-automation",
    title: "QA Automation",
    desc: "Automated testing and evaluation pipelines that catch regressions before your customers do — built for systems where \"it looked right in the demo\" isn't good enough.",
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    desc: "Secure-by-design engineering for the systems AI touches — threat modeling, access controls, and audit trails built in from day one.",
  },
  {
    id: "llm-training",
    title: "LLM Training & Deployment",
    desc: "Fine-tuning, evaluation, and production deployment of language models inside your infrastructure, with the monitoring and guardrails regulated environments require.",
  },
  {
    id: "ai-adoption",
    title: "AI Adoption",
    desc: "The organizational side of AI: governance, ownership, and the operating-model changes that make adoption stick instead of stalling in pilot purgatory.",
  },
];
---

<Layout
  title="Services"
  description="Core AI engineering competencies: analysis and design, QA automation, cybersecurity, LLM training and deployment, and AI adoption."
  current="services"
>
  <section class="page-hero">
    <div class="wrap">
      <p class="eyebrow">Services</p>
      <h1>The capabilities behind every engagement.</h1>
      <p class="lead">
        These are the core competencies our engineers bring to your team. For how we actually
        run an engagement from first call to production, see
        {" "}<a href={withBase("/how-we-work")}>how we work</a>.
      </p>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="section-head">
        <p class="eyebrow">How it fits together</p>
        <h2>Everything feeds AI adoption that actually sticks.</h2>
      </div>
      <!-- Hub-and-spoke diagram: see Task 9 for the SVG markup -->
    </div>
  </section>

  <section class="alt">
    <div class="wrap">
      <div class="grid grid-3">
        {competencies.map((c) => (
          <div class="card" id={c.id}>
            <h3>{c.title}</h3>
            <p>{c.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>

  <section>
    <div class="wrap">
      <div class="cta-band">
        <h2>Not sure which engagement fits?</h2>
        <p>Send us a few sentences about where you're stuck, and we'll point you to the right starting place.</p>
        <div class="hero-actions">
          <a href={withBase("/contact")} class="btn btn-accent">Get in touch</a>
          <a href={withBase("/how-we-work")} class="btn btn-outline">See how we engage</a>
        </div>
      </div>
    </div>
  </section>
</Layout>
```

Note: the diagram markup is added in Task 9 inside the empty section above — this task establishes the text content and card grid first so it can be verified independently.

**Step 2: Verify**

Run: `npm run build`
Expected: Succeeds. Run `npm run dev`, open `/services`, confirm 5 competency cards render with the new copy, and both CTA links (Get in touch, See how we engage) work.

**Step 3: Commit**

```bash
git add src/pages/services.astro
git commit -m "Rebuild Services page around 5 core competencies"
```

---

### Task 9: Add the hub-and-spoke diagram to Services

**Files:**
- Modify: `src/pages/services.astro`
- Modify: `src/styles/global.css`

**Step 1: Replace the placeholder comment with inline SVG**

In `services.astro`, replace:

```astro
      <!-- Hub-and-spoke diagram: see Task 9 for the SVG markup -->
```

with:

```astro
      <svg
        class="hub-diagram"
        viewBox="0 0 640 420"
        role="img"
        aria-labelledby="hub-diagram-title"
      >
        <title id="hub-diagram-title">
          AI Adoption at the center, supported by Analysis & Design, QA Automation,
          Cybersecurity, and LLM Training & Deployment
        </title>
        <line x1="320" y1="210" x2="320" y2="100" class="hub-spoke-line" />
        <line x1="320" y1="210" x2="480" y2="210" class="hub-spoke-line" />
        <line x1="320" y1="210" x2="320" y2="320" class="hub-spoke-line" />
        <line x1="320" y1="210" x2="160" y2="210" class="hub-spoke-line" />

        <g class="hub-spoke">
          <circle cx="320" cy="80" r="52" />
          <text x="320" y="76" text-anchor="middle">Analysis</text>
          <text x="320" y="94" text-anchor="middle">& Design</text>
        </g>
        <g class="hub-spoke">
          <circle cx="530" cy="210" r="52" />
          <text x="530" y="206" text-anchor="middle">QA</text>
          <text x="530" y="224" text-anchor="middle">Automation</text>
        </g>
        <g class="hub-spoke">
          <circle cx="320" cy="340" r="52" />
          <text x="320" y="344" text-anchor="middle">Cybersecurity</text>
        </g>
        <g class="hub-spoke">
          <circle cx="110" cy="210" r="52" />
          <text x="110" y="200" text-anchor="middle">LLM Training</text>
          <text x="110" y="218" text-anchor="middle">&amp; Deployment</text>
        </g>

        <g class="hub-center">
          <circle cx="320" cy="210" r="66" />
          <text x="320" y="206" text-anchor="middle">AI</text>
          <text x="320" y="226" text-anchor="middle">Adoption</text>
        </g>
      </svg>
```

**Step 2: Add diagram styles**

In `src/styles/global.css`, add after the `.icon-badge` rule (around line 297):

```css
.hub-diagram {
  width: 100%;
  max-width: 560px;
  height: auto;
  display: block;
  margin: 0 auto;
}

.hub-spoke-line {
  stroke: var(--slate-200);
  stroke-width: 2;
}

.hub-spoke circle {
  fill: var(--white);
  stroke: var(--navy-700);
  stroke-width: 2;
}

.hub-spoke text {
  fill: var(--slate-600);
  font-size: 13px;
  font-weight: 600;
}

.hub-center circle {
  fill: var(--navy-900);
}

.hub-center text {
  fill: var(--white);
  font-size: 15px;
  font-weight: 800;
}
```

**Step 3: Verify**

Run: `npm run build`
Expected: Succeeds. Run `npm run dev`, open `/services`, confirm the diagram renders above the competency cards: a dark "AI Adoption" hub in the center with 4 outlined circles connected by lines (Analysis & Design, QA Automation, Cybersecurity, LLM Training & Deployment). Resize the browser narrow and confirm it scales down without overflowing.

**Step 4: Commit**

```bash
git add src/pages/services.astro src/styles/global.css
git commit -m "Add hub-and-spoke diagram to Services page"
```

---

### Task 10: Full site pass

**Step 1:** Run a full production build.

Run: `npm run build`
Expected: Succeeds with no errors or warnings about broken links.

**Step 2:** Manual click-through with `npm run dev`:
- `/` — hero stat cards link to `/industries`, "See how we engage" goes to `/how-we-work`, industries preview shows 7 entries.
- `/services` — hub diagram + 5 competency cards, CTA links to `/contact` and `/how-we-work`.
- `/how-we-work` — 4-step timeline, CTA to `/contact`.
- `/industries` — 7 cards with new names (Pharma, Life Sciences, Financial Services, Insurance, Retail, Cybersecurity, Hospitality).
- Footer on any page — "How We Work" link present and working.
- Header nav unchanged (Home, Services, Industries, About, Contact — 5 links, no How We Work).

**Step 3:** No commit needed for this task — it's verification only. If anything fails, fix it under the relevant task above and commit there.
