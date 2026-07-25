# Source Reconstruction — Design Spec

**Date:** 2026-07-25
**Status:** Approved (Mark, 2026-07-25)
**Authoritative content reference:** [`docs/reference/current-site-inventory.md`](../../reference/current-site-inventory.md) — exhaustive, verbatim inventory of the live site extracted from the compiled bundle. This spec references it rather than duplicating all copy; the implementation plan pulls exact strings from there.

## Problem

The `karolinejangola` repo contains **only the compiled build output** of the live site (minified `assets/index-NAF8EB0S.js`, `index-CW6KlUxW.css`, and a thin `<div id="root">` SPA shell). There is **no source**: no `package.json`, no `src/`, no `.tsx`. Git history goes Wix/Velo → a "static HTML/CSS rebuild" → the current React bundle; the React/TypeScript source was **never committed** and is not on the machine or recoverable (no sourcemap). The original was most likely a Lovable.dev project (unproven; `placeholder.svg` is their logo).

Consequence: the requested content changes (edit the ISO 9001 text, remove the audience split, add "brasileiros no exterior") all live **inside the minified bundle** and cannot be edited cleanly. Getting real, rebuildable source is the actual blocker — and the explicit priority. **Content changes are out of scope for this sprint** and come after.

## Goal

Reconstruct a clean, maintainable **React + Vite + TypeScript + Tailwind** source tree in this repo whose `npm run build` reproduces the current live site. After this sprint, Mark can rebuild and modify the site from source.

## Non-goals (this sprint)

- The three content changes (ISO text, remove audience split, exterior copy) — deferred to a follow-up sprint.
- Migrating deployment to GitHub Actions CI — documented as a later option; deploy mechanics stay as-is.
- Byte-for-byte identical JS/CSS bundles — impossible from a fresh Vite build (different hashing/minification); not a goal.
- Pixel-level redesign or "fixing" the palette/fonts to the (stale) `CLAUDE.md` brand brief.

## Ground-truth facts that constrain the build

From the inventory (all verified against the live bundle/CSS):

- **Routes (React Router):** `/` (homepage), `/blog` (index), `/blog/:slug` (3 articles), `*` (catch-all).
- **Homepage order:** Hero (no id) → `#sobre` "Quem sou eu" → `#para-quem` audience split → `#tratamentos` → `#depoimentos` → `#faq` → `#contato` (CTA + contact form).
- **WhatsApp:** number `557996491276`. Four pre-filled messages — general (hero/nav/contato CTA), "para mim", "para meu filho/a", blog. Full URLs in inventory §2/§3.
- **Conversion tracking:** `gtag('event','conversion',{send_to:'AW-16583121961/shGzCIOqipYcEKm4ueM9'})` fired `onClick` of every WhatsApp `<a>` and on successful form submit. Single label site-wide.
- **Contact form:** `fetch` POST to `https://formspree.io/f/xeevlzlb`, `FormData` body, `Accept: application/json`. Fields: `contact-nome` (required), `contact-telefone` (tel, optional), `contact-mensagem` (textarea, optional). Success → conversion event + success panel; failure → inline error pointing to WhatsApp.
- **Visitor webhook:** `fetch` POST to `https://n8n.w1r3d.dev/webhook/visitor` on every page mount (`{site,page,referrer,ua}`, `keepalive:true`, try/catch-silent).
- **gtag loader + config** (`AW-16583121961`) and **Search Console** meta (`google-site-verification=Ruj7meDK4FLvod_D-fpotUiUGCEJKgnUcQ1_RhVpBCs`) live in `index.html` head — preserve verbatim.
- **JSON-LD:** `ProfessionalService` (global) + `FAQPage` (built from the 5 FAQ items) — injected per current bundle; full JSON in inventory §1. `telephone: +55-79-9649-1276`, `email: karoljangola@gmail.com`.
- **Fonts:** DM Serif Display (headings) + DM Sans (body), via a single Google Fonts `@import` in the CSS. **Not** Playfair/Inter.
- **Color tokens:** exact HSL custom properties on `:root` (background `#f8f5f1`, foreground `#3e3531`, primary/sage `#4f7260`, accent/terracotta `#c97a5e`, terracotta-dark `#b76547`, etc. — full table in inventory §4).
- **Animation:** one keyframe `reveal-up` (`.animate-reveal-up`). No `prefers-reduced-motion` handling currently exists.
- **Assets referenced:** `hero-therapy-CgSB5jl3.webp`, `therapist-portrait-DhhPXLzJ.avif`, `og-image.jpg`, favicons. `placeholder.svg` and 8 orphaned old bundles are dead weight — **not** carried forward.
- **Static config:** `CNAME` = `karolinejangola.com`; `robots.txt` and `sitemap.xml` as in inventory §7.

## Architecture

### Stack
Vite + React 18 + TypeScript + Tailwind CSS + React Router. **No shadcn/Radix** — the live DOM is plain Tailwind; the two interactive primitives (FAQ accordion, mobile nav) are rebuilt as small local components. Rationale: minimize dependencies, which are what rotted and lost the source originally.

### Directory layout (source added to the existing repo; build regenerates root)
```
/                         # served by GitHub Pages (build output lands here)
  index.html              # BUILD OUTPUT (regenerated) — thin shell + head
  assets/                 # BUILD OUTPUT (regenerated hashed bundles)
  blog/…/index.html       # BUILD OUTPUT (prerendered)
  404.html                # BUILD OUTPUT (prerendered homepage, SPA fallback)
  CNAME robots.txt sitemap.xml favicon* og-image.jpg   # static, preserved
  app/                    # SOURCE (new)
    index.html            # Vite entry template (head: gtag, GSC, meta)
    package.json vite.config.ts tsconfig.json tailwind.config.ts postcss.config.js
    src/
      main.tsx App.tsx (router)
      pages/        Home.tsx Blog.tsx BlogPost.tsx NotFound.tsx
      sections/     Hero, Sobre, ParaQuem, Tratamentos, Depoimentos, Faq, Contato, Footer, Nav
      components/   Accordion, WhatsAppLink, Seo (head mgmt), RevealUp
      data/         site.ts (config: whatsapp, urls, emails), content.ts (sections copy),
                    treatments.ts, testimonials.ts, faq.ts, blog/*.ts (article bodies)
      lib/          gtag.ts (conversion), tracking.ts (n8n webhook), whatsapp.ts
      styles/       index.css (tokens + @import fonts + reveal-up + prose-blog)
    scripts/prerender.ts  # post-build static snapshot of all routes
```

The exact build output location (root vs a `dist/` then copy) is a plan-level detail; the requirement is that after `npm run build`, the repo root holds the same served-file shape as today.

### Prerendering (decision #2 — approved)
Regenerate static SEO snapshots for **all** routes with **current** content: `index.html` (homepage prerendered, not just a thin shell), `404.html` (homepage snapshot for SPA fallback), `blog/index.html`, `blog/<slug>/index.html` ×3. This fixes the current stale-prerender bug (old phone number, missing sections) as a byproduct. Also regenerate `sitemap.xml` `lastmod` dates.

Prerender mechanism: a post-build script that loads each route from the built app and writes fully-rendered HTML. Exact tool (e.g. `vite-react-ssg`, or a Playwright/Puppeteer snapshot script mirroring what the current build already does) is chosen in the plan after verifying current maintenance status; requirement is deterministic, correct per-route HTML with the right `<head>` (canonical, OG, JSON-LD) per page.

### Head / SEO management
Per-page `<head>` (title, description, canonical, OG/Twitter, JSON-LD) via a lightweight head component (helmet-style), matching how the current bundle injects it client-side, and materialized into each prerendered file.

### Integrations (preserve exactly)
- `lib/gtag.ts` → the `qt()` conversion function, wired to every WhatsApp link and form success.
- `lib/tracking.ts` → the n8n visitor webhook on mount.
- Contact form → Formspree endpoint, same fields/behavior/states.
- gtag loader + GSC meta in the entry `index.html` head.

## Decisions (approved)

1. **Fonts/palette:** match the **live** site (DM Serif Display + DM Sans; sage/terracotta/cream tokens). The `CLAUDE.md` brand brief (Playfair/Inter, warm browns) is stale vs. the live site and is flagged for separate reconciliation — not applied here.
2. **Prerendering:** regenerate all routes with current content (see above).
3. **Deploy:** unchanged — `npm run build` regenerates served files at the repo root; GitHub Pages continues serving root. GitHub Actions CI is a documented later option.

## Acceptance criteria

`npm run build` produces output that:

1. Renders the **same DOM structure, copy, and layout** as the current live site for `/`, `/blog`, the 3 blog articles, and 404 (verified against the inventory + a live browser comparison).
2. Preserves **verbatim**: gtag loader + `config('AW-16583121961')`, conversion `send_to` label, GSC verification meta, Formspree endpoint, n8n webhook endpoint, JSON-LD ProfessionalService + FAQPage content, `CNAME`, `robots.txt`, favicons, `og-image.jpg`.
3. Uses the exact live color tokens and DM fonts.
4. Fires the conversion event on every WhatsApp link and on form success; fires the visitor webhook on mount.
5. Prerendered files reflect **current** content (correct phone `557996491276`, audience split present, contact form present, "Quem sou eu" heading, full FAQ answers).
6. Builds cleanly (`npm run build` exits 0) on Node 24 / npm 11.

Parity for JS/CSS bundle **bytes** is explicitly **not** required. Parity is exact for content, meta, tracking, and static config; functional/visual for the app itself.

## Risks

- **Live Ads site:** a dropped conversion tag or broken WhatsApp link costs money. Mitigation: acceptance criterion #2/#4; the pre-rebuild dist is tagged `pre-rebuild-dist` (local restore point); nothing is pushed until Mark validates.
- **Prerender fidelity:** the head/JSON-LD must materialize correctly per page. Mitigation: verify each prerendered file's head against the inventory.
- **Two UNVERIFIED behaviors** in the inventory (mobile-menu open/close; whether the FAQ accordion animates): resolve by direct browser check during implementation, not assumption.
- **Formspree/n8n endpoints** must be reproduced exactly or leads silently vanish — treat as literal constants pulled from the inventory.
