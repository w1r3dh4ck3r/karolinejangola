# Source Reconstruction Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruct a clean React + Vite + TypeScript + Tailwind source tree whose `npm run build` reproduces the current live karolinejangola.com site.

**Architecture:** Source lives in `app/` (its own Vite project). `npm run build` compiles to the repo root, preserving the current GitHub-Pages-serves-root deploy model. A Playwright post-build script snapshots every route to static HTML for SEO (fixing the current stale prerenders). Content is stored as typed data modules; browser-only integrations (gtag conversion, Formspree, n8n webhook) are reproduced verbatim.

**Tech Stack:** Vite 5, React 18, TypeScript, Tailwind CSS 3, React Router 6, Playwright (build-time prerender only).

**Design reference (READ BEFORE STARTING):** `docs/reference/current-site-inventory.md` — verbatim ground truth (all copy, URLs, tokens, JSON-LD). This plan references it by section (§) instead of duplicating 400 lines of Portuguese copy. Pull exact strings from there; preserve every accent/diacritic.

**Spec:** `docs/superpowers/specs/2026-07-25-source-reconstruction-design.md`.

**Note on "tests":** This is a faithful reconstruction, not logic-heavy code. The verification for each task is **output/behavior assertion** — grep the build output or the running app for the exact constants the acceptance criteria require (conversion label, Formspree endpoint, phone number, JSON-LD, tokens), plus a browser comparison against the live site. That is the correct test shape here; classic unit tests are used only where there is real logic (URL builders).

## Global Constraints

- **Copy grammar:** all Portuguese copy uses **female** grammatical agreement only (project `CLAUDE.md` copy rule). Reconstruction copies existing live text verbatim — do not alter agreement.
- **No content changes this sprint.** Reproduce current copy exactly, including the ISO 9001 mentions and the audience split. Content edits are a separate follow-up.
- **Preserve verbatim** (exact string constants, no paraphrase):
  - gtag id `AW-16583121961`; conversion `send_to` = `AW-16583121961/shGzCIOqipYcEKm4ueM9`
  - Google Search Console meta `content="Ruj7meDK4FLvod_D-fpotUiUGCEJKgnUcQ1_RhVpBCs"`
  - Formspree endpoint `https://formspree.io/f/xeevlzlb`
  - n8n webhook `https://n8n.w1r3d.dev/webhook/visitor`
  - WhatsApp number `557996491276`
  - email `karoljangola@gmail.com`; Instagram `https://www.instagram.com/psicanalista_karolinejangola`
  - `CNAME` = `karolinejangola.com`
- **Fonts:** DM Serif Display (headings) + DM Sans (body). **Not** Playfair/Inter.
- **Deploy unchanged:** build output must land at the repo root (`index.html`, `assets/`, `blog/**`, `404.html`) with `emptyOutDir:false` so `.git/` and `docs/` are never wiped.
- **Node 24 / npm 11** (verified available).
- **Do not carry forward:** `placeholder.svg` and the 8 orphaned old `assets/index-*.js|css` bundles (inventory §5).
- **Never push.** Nothing deploys until Mark validates. The pre-rebuild live dist is tagged `pre-rebuild-dist` (local restore point).

---

### Task 1: Scaffold the Vite + React + TS project that builds to repo root

**Files:**
- Create: `app/package.json`, `app/vite.config.ts`, `app/tsconfig.json`, `app/tsconfig.node.json`, `app/index.html`, `app/src/main.tsx`, `app/src/App.tsx`, `app/.gitignore`
- Create passthrough: `app/public/CNAME`, `app/public/robots.txt`, `app/public/favicon.ico`, `app/public/favicon-192.png`, `app/public/apple-touch-icon.png`, `app/public/og-image.jpg`
- Modify: root `.gitignore` (add `app/node_modules/`, `app/dist/` not used, keep build outputs tracked)

**Interfaces:**
- Produces: a working `npm run build` (from `app/`) that emits `../index.html` + `../assets/*` at repo root; `npm run dev` serves the app.

- [ ] **Step 1: Init the project.** In `app/`, create `package.json` with deps: `react`, `react-dom`, `react-router-dom`; devDeps: `vite`, `@vitejs/plugin-react`, `typescript`, `tailwindcss`, `postcss`, `autoprefixer`, `playwright` (for prerender), `@types/react`, `@types/react-dom`, `@types/node`. Scripts:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build && node scripts/prerender.mjs",
    "build:app": "tsc -b && vite build",
    "preview": "vite preview"
  }
}
```
- [ ] **Step 2: `vite.config.ts`** — build to repo root, never empty it:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',            // CNAME, robots, favicons, og-image copied to output
  build: {
    outDir: path.resolve(__dirname, '..'),
    emptyOutDir: false,           // repo root holds .git/ and docs/ — NEVER wipe
    assetsDir: 'assets',
  },
})
```
- [ ] **Step 3: `app/index.html`** — the Vite entry template. Head must contain, verbatim, everything from inventory §1 `index.html`: charset, GSC meta, viewport, title, description, keywords, author, canonical, favicon links, all og:/twitter: meta, the gtag loader `<script async src=…AW-16583121961>` + inline `gtag('config','AW-16583121961')`, and `<div id="root"></div>`. The module script + stylesheet are injected by Vite. (Per-page/JSON-LD head is added in Task 8.)
- [ ] **Step 4: `main.tsx` + minimal `App.tsx`** — render a router with a single placeholder route returning `<div>ok</div>` so the build is verifiable before real content exists.
- [ ] **Step 5: Move static passthrough files into `app/public/`.** Copy the current root `CNAME`, `robots.txt`, `favicon.ico`, `favicon-192.png`, `apple-touch-icon.png`, `og-image.jpg` into `app/public/` (verbatim; binaries unchanged). They will be re-emitted to root on build.
- [ ] **Step 6: Build and verify output lands at root.**
Run: `cd app && npm install && npm run build:app`
Expected: `../index.html` exists and references a hashed `/assets/index-*.js`; `../assets/` contains the new bundle; `../CNAME` still = `karolinejangola.com`. `.git/` and `docs/` untouched.
- [ ] **Step 7: Verify the head survived the build.**
Run: `grep -c "AW-16583121961" ../index.html && grep -c "Ruj7meDK4FLvod" ../index.html`
Expected: both ≥ 1 (gtag + GSC meta present in built index.html).
- [ ] **Step 8: Commit.** `git add app/ .gitignore && git commit -m "feat: scaffold Vite+React+TS app building to repo root"`

---

### Task 2: Design tokens, fonts, and global stylesheet

**Files:**
- Create: `app/src/styles/index.css`, `app/tailwind.config.ts`, `app/postcss.config.js`
- Modify: `app/src/main.tsx` (import `./styles/index.css`)

**Interfaces:**
- Produces: Tailwind utility classes bound to the exact live tokens (`bg-background`, `text-foreground`, `bg-primary`/`sage`, `bg-accent`/`terracotta`, `font-serif`, `font-sans`) and the `.animate-reveal-up` + `.prose-blog` classes consumed by later tasks.

- [ ] **Step 1: `index.css`** — top of file, the exact Google Fonts `@import` from inventory §4 (DM Sans axes + DM Serif Display). Then `@tailwind base; @tailwind components; @tailwind utilities;`. Then `:root { … }` with every HSL custom property from the inventory §4 table verbatim (`--background:40 33% 96%`, `--foreground:20 12% 22%`, `--primary:150 18% 38%`, `--accent:16 50% 58%`, `--terracotta-dark:16 44% 50%`, `--sage-light`, `--cream`, `--cream-dark`, etc.). Add `html{scroll-behavior:smooth}` and set base `body` font-family to DM Sans. Add the `@keyframes reveal-up` + `.animate-reveal-up` block verbatim (inventory §4). Add the full `.prose-blog` rules (inventory §4).
- [ ] **Step 2: `tailwind.config.ts`** — `content: ['./index.html','./src/**/*.{ts,tsx}']`. Extend `theme.colors` mapping each token via `hsl(var(--x) / <alpha-value>)` (shadcn pattern): `background, foreground, card, primary, 'primary-foreground', secondary, accent, 'accent-foreground', muted, 'muted-foreground', border, sage, 'sage-light', terracotta, 'terracotta-dark', cream, 'cream-dark'`. Extend `fontFamily: { serif: ['DM Serif Display','Georgia','serif'], sans: ['DM Sans','system-ui','sans-serif'] }`.
- [ ] **Step 3: `postcss.config.js`** — `{ plugins: { tailwindcss: {}, autoprefixer: {} } }`.
- [ ] **Step 4: Build and verify tokens + fonts in the emitted CSS.**
Run: `cd app && npm run build:app && grep -o "DM Serif Display" ../assets/*.css | head -1 && grep -o "150 18% 38%" ../assets/*.css | head -1`
Expected: both found (fonts + sage token compiled in).
- [ ] **Step 5: Commit.** `git commit -am "feat: design tokens, DM fonts, global stylesheet"`

---

### Task 3: Content data modules (verbatim from inventory)

**Files:**
- Create: `app/src/data/site.ts`, `app/src/data/content.ts`, `app/src/data/treatments.ts`, `app/src/data/testimonials.ts`, `app/src/data/faq.ts`, `app/src/data/blog/index.ts`, `app/src/data/blog/ansiedade-sintomas-tratamento.ts`, `app/src/data/blog/como-saber-se-preciso-de-terapia.ts`, `app/src/data/blog/terapia-online-funciona.ts`

**Interfaces:**
- Produces:
  - `site` (from `site.ts`): `{ whatsappNumber:'557996491276', email:'karoljangola@gmail.com', instagram:{url,handle}, heroImage:'/assets/hero-therapy-CgSB5jl3.webp', portraitImage:'/assets/therapist-portrait-DhhPXLzJ.avif', conversionSendTo:'AW-16583121961/shGzCIOqipYcEKm4ueM9', formspree:'https://formspree.io/f/xeevlzlb', visitorWebhook:'https://n8n.w1r3d.dev/webhook/visitor' }`
  - `treatments: {icon,title,body}[]` (5 items, inventory §2 Tratamentos)
  - `testimonials: {name,role,quote}[]` (3 items, inventory §2 Depoimentos)
  - `faq: {q,a}[]` (5 items, inventory §2 FAQ — used by both the FAQ section and the FAQPage JSON-LD)
  - `audienceCards: {key,icon,description,ctaLabel,ctaText}[]` (2 items, inventory §2 para-quem — keep each card's own pre-filled WhatsApp text)
  - `blogPosts: {slug,title,date,readTime,excerpt,bodyHtml}[]` (3 items; slugs + titles inventory §6; article `bodyHtml` from the prerendered `blog/<slug>/index.html` `<article>` markup — verified NOT stale for prose, inventory §2b)

- [ ] **Step 1: `site.ts`** — export the `site` object above, exact strings.
- [ ] **Step 2: `content.ts`** — hero (eyebrow/h1/body/ctaLabel), sobre (eyebrow/h2/4 paragraphs from array `Nv` + the highlighted closing line + 2 stat tiles), para-quem (eyebrow/h2 + `audienceCards`), section eyebrows/headings for tratamentos/depoimentos/faq, contato (h2/body/ctaLabel/info row/form intro + field labels/placeholders + success & error strings). All verbatim from inventory §2. **The `contact-mensagem` textarea label is "O que te trouxe até aqui? (opcional)".**
- [ ] **Step 3: `treatments.ts`, `testimonials.ts`, `faq.ts`** — the exact arrays from inventory §2 (icons map to Lucide names: heart, brain, users, leaf, sparkles).
- [ ] **Step 4: blog data.** For each of the 3 slugs, read the `<article>` body from the on-disk `blog/<slug>/index.html` (prose confirmed current) and store as `bodyHtml`; title/date/readTime/excerpt from inventory §6. `blog/index.ts` exports the ordered list.
- [ ] **Step 5: Verify no copy was mangled.**
Run: `cd app && grep -c "certificação de qualidade ISO 9001" src/data/content.ts && grep -c "adolescentes" src/data/content.ts`
Expected: ISO line present (kept, per spec); "adolescentes" present (the child-audience wording).
- [ ] **Step 6: Commit.** `git commit -am "feat: content data modules (verbatim from live inventory)"`

---

### Task 4: Integration libs (gtag conversion, WhatsApp, visitor webhook)

**Files:**
- Create: `app/src/lib/gtag.ts`, `app/src/lib/whatsapp.ts`, `app/src/lib/tracking.ts`, `app/src/types/global.d.ts`
- Test: `app/src/lib/whatsapp.test.ts` (URL builder is the only real logic; use `vitest` or a tiny assert script)

**Interfaces:**
- Produces: `fireConversion()`, `CONVERSION_SEND_TO`; `waUrl(text)`, `WA.{general,paraMim,paraFilho,blog}`, `WHATSAPP_NUMBER`; `trackVisit()`.

- [ ] **Step 1: Failing test for `waUrl`.**
```ts
import { waUrl, WA } from './whatsapp'
// waUrl encodes text and targets the live number
console.assert(waUrl('Olá') === 'https://wa.me/557996491276?text=Ol%C3%A1', 'encode')
console.assert(WA.paraMim.includes('para%20mim'), 'paraMim prefilled')
```
Run it; expect failure (module missing).
- [ ] **Step 2: `whatsapp.ts`:**
```ts
export const WHATSAPP_NUMBER = '557996491276'
export const waUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
export const WA = {
  general:  waUrl('Olá, vi seu site e gostaria de mais informações.'),
  paraMim:  waUrl('Olá, vim pelo site e gostaria de atendimento para mim.'),
  paraFilho:waUrl('Olá, vim pelo site e gostaria de atendimento para meu filho/a.'),
  blog:     waUrl('Olá, vi seu blog e gostaria de mais informações.'),
}
```
Verify the 4 encoded URLs match inventory §2/§3 exactly.
- [ ] **Step 3: `gtag.ts`:**
```ts
export const CONVERSION_SEND_TO = 'AW-16583121961/shGzCIOqipYcEKm4ueM9'
export function fireConversion(): void {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', 'conversion', { send_to: CONVERSION_SEND_TO })
  }
}
```
- [ ] **Step 4: `tracking.ts`** — the exact n8n `fetch` from inventory §3 (`{site,page,referrer,ua}`, `keepalive:true`, try/catch-silent). Add a guard so it is a **no-op when `navigator.webdriver` is true** (prevents the prerender browser from POSTing during snapshotting).
- [ ] **Step 5: `global.d.ts`** — `declare global { interface Window { gtag?: (...args:any[])=>void; dataLayer?: any[] } }`.
- [ ] **Step 6: Run the test — expect PASS.**
- [ ] **Step 7: Commit.** `git commit -am "feat: gtag conversion, whatsapp, visitor-webhook libs"`

---

### Task 5: Shared components — WhatsAppLink, RevealUp, Accordion, Nav, Footer, Seo

**Files:**
- Create: `app/src/components/WhatsAppLink.tsx`, `RevealUp.tsx`, `Accordion.tsx`, `Nav.tsx`, `Footer.tsx`, `Seo.tsx`
- Modify: `app/src/App.tsx` (mount `trackVisit()` on route change via a small hook/effect)

**Interfaces:**
- Consumes: Task 3 `site`, Task 4 libs.
- Produces:
  - `<WhatsAppLink href text className>` — renders `<a target="_blank" rel="noopener noreferrer" onClick={fireConversion}>`; used by every WhatsApp CTA.
  - `<Accordion items={{q,a}[]}>` — one-open-at-a-time; buttons `aria-expanded`; keyboard accessible.
  - `<Nav>` — logo → `/`; anchor links to `/#sobre …#contato`; "Agendar" WhatsApp CTA; **mobile hamburger** (`aria-label="Menu"`) toggling a `useState` menu. (Inventory flags mobile-menu behavior UNVERIFIED — implement a standard accessible toggle and confirm against the live site in the browser.)
  - `<Footer>` — `© {new Date().getFullYear()} Karoline Jangola — Psicanalista e Terapeuta` + "Atendimento exclusivamente online".
  - `<Seo title description canonical og jsonLd?>` — sets `document.title` and injects/updates `<meta>`/`<link rel=canonical>`/`<script type=application/ld+json>` into `<head>` (helmet-style; no dep — a small effect that upserts tags). Consumed by pages in Task 8.

- [ ] **Step 1: WhatsAppLink + RevealUp** (RevealUp = wrapper adding `animate-reveal-up` via IntersectionObserver, or just the class on mount to match current behavior).
- [ ] **Step 2: Accordion** — verify it renders all 5 FAQ items; only structural, no external dep.
- [ ] **Step 3: Nav + Footer** per interfaces. Nav "Agendar" uses `WA.general`.
- [ ] **Step 4: Seo component** — upserts head tags; safe to run under the prerender browser (its output must appear in captured HTML).
- [ ] **Step 5: `trackVisit` on mount** in `App.tsx` (fires per page; no-op under webdriver per Task 4).
- [ ] **Step 6: Build; dev-server smoke check** the nav/footer render and the mobile menu toggles.
Run: `cd app && npm run build:app` (expect exit 0).
- [ ] **Step 7: Commit.** `git commit -am "feat: shared components (nav, footer, accordion, whatsapp link, seo)"`

---

### Task 6: Homepage sections + Home page assembly

**Files:**
- Create: `app/src/sections/Hero.tsx`, `Sobre.tsx`, `ParaQuem.tsx`, `Tratamentos.tsx`, `Depoimentos.tsx`, `Faq.tsx`, `Contato.tsx`
- Create: `app/src/pages/Home.tsx`

**Interfaces:**
- Consumes: Task 3 data, Task 5 components.
- Produces: `<Home>` rendering, in order: `<Nav>`, `<Hero>`, `#sobre`, `#para-quem`, `#tratamentos`, `#depoimentos`, `#faq`, `#contato`, `<Footer>`.

- [ ] **Step 1: Hero** — eyebrow/H1/body/CTA (`WA.general`) over `site.heroImage` with the `from-foreground/70 via-foreground/40 to-transparent` gradient overlay (inventory §2.0).
- [ ] **Step 2: Sobre** (`id="sobre"`) — portrait (`site.portraitImage`, `-rotate-2` frame), eyebrow "Quem sou eu", H2 "Karoline Jangola", 4 paragraphs + highlighted closing line, 2 stat tiles ("100%"/"atendimento online", "ISO 9001"/"certificado de qualidade"). **Keep both ISO mentions** (spec: no content change).
- [ ] **Step 3: ParaQuem** (`id="para-quem"`) — 2 audience cards from `audienceCards`, each `<WhatsAppLink>` using that card's own pre-filled text (`WA.paraMim` / `WA.paraFilho`).
- [ ] **Step 4: Tratamentos / Depoimentos / Faq** — map `treatments` (5 cards, Lucide icons), `testimonials` (3), `faq` (5, via `<Accordion>`).
- [ ] **Step 5: Contato** (`id="contato"`) — H2/body, primary CTA (`WA.general`), info row (email `mailto:`, "Atendimento online para todo o Brasil", Instagram). Then the **contact form** (component below).
- [ ] **Step 6: Contact form logic** inside `Contato.tsx`:
```tsx
const [state, setState] = useState<'idle'|'submitting'|'ok'|'error'>('idle')
async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault()
  const form = e.currentTarget
  setState('submitting')
  try {
    const res = await fetch(site.formspree, {
      method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' },
    })
    if (res.ok) { fireConversion(); setState('ok') } else setState('error')
  } catch { setState('error') }
}
```
Fields exactly per inventory §2 contato (`contact-nome` required, `contact-telefone` tel, `contact-mensagem` textarea rows=3). Submit label "Enviar mensagem" → "Enviando…" while submitting. Success panel "Mensagem recebida! Entrarei em contato em breve.". Error text "Erro ao enviar. Tente diretamente pelo WhatsApp.".
- [ ] **Step 7: Assemble `Home.tsx`** in the exact section order.
- [ ] **Step 8: Build + browser compare against live** homepage (side-by-side): section order, copy, CTAs, form. Resolve the two UNVERIFIED items (mobile menu, FAQ accordion animation) by matching the live site.
Run: `cd app && npm run build:app`
Verify in built `assets/*.js`: `grep -c "formspree.io/f/xeevlzlb" ../assets/*.js` ≥1; `grep -c "shGzCIOqipYcEKm4ueM9" ../assets/*.js` ≥1; `grep -c "557996491276" ../assets/*.js` ≥1.
- [ ] **Step 9: Commit.** `git commit -am "feat: homepage sections + assembly (byte-faithful copy)"`

---

### Task 7: Blog pages, 404, and router

**Files:**
- Create: `app/src/pages/Blog.tsx`, `app/src/pages/BlogPost.tsx`, `app/src/pages/NotFound.tsx`, `app/src/components/BlogCta.tsx`
- Modify: `app/src/App.tsx` (routes)

**Interfaces:**
- Consumes: Task 3 `blogPosts`, Task 5 components.
- Produces: routes `/` → Home, `/blog` → Blog, `/blog/:slug` → BlogPost, `*` → NotFound.

- [ ] **Step 1: Router in `App.tsx`** — `<BrowserRouter>` with the 4 routes; `<Nav>`/`<Footer>` shared.
- [ ] **Step 2: Blog index** — list the 3 posts (title, date, readTime, excerpt) linking to `/blog/:slug`.
- [ ] **Step 3: BlogPost** — render `bodyHtml` inside a `.prose-blog` container; end-of-post `<BlogCta>` aside using `WA.blog`.
- [ ] **Step 4: NotFound** — the app's catch-all (client-side); the served static `404.html` is the prerendered homepage (Task 9), matching current SPA-fallback behavior.
- [ ] **Step 5: Build; verify routes render** in dev server (`/blog`, each article).
- [ ] **Step 6: Commit.** `git commit -am "feat: blog index, article pages, router, 404 route"`

---

### Task 8: Per-page head / SEO + JSON-LD

**Files:**
- Modify: `app/src/pages/Home.tsx`, `Blog.tsx`, `BlogPost.tsx` (add `<Seo>`)
- Create: `app/src/data/seo.ts` (per-route title/description/canonical/OG + the two JSON-LD builders)

**Interfaces:**
- Consumes: Task 5 `<Seo>`, Task 3 `faq`/`site`/`blogPosts`.
- Produces: `professionalServiceJsonLd` (inventory §1, verbatim incl. `telephone:+55-79-9649-1276`, `email`, `sameAs`), `faqPageJsonLd(faq)` (built from the 5 items), and per-route meta.

- [ ] **Step 1: `seo.ts`** — export the ProfessionalService JSON-LD object exactly as inventory §1 (drop `hasOfferCatalog`, matching current bundle), and `faqPageJsonLd()` mapping `faq` → `mainEntity[{@type:Question,name,acceptedAnswer:{@type:Answer,text}}]`.
- [ ] **Step 2: Home `<Seo>`** — title/description/canonical/OG from inventory §1; `jsonLd=[professionalService, faqPage]`.
- [ ] **Step 3: Blog + BlogPost `<Seo>`** — per-page title/description/canonical (`…/blog`, `…/blog/<slug>`); article OG.
- [ ] **Step 4: Verify JSON-LD is in the DOM at runtime** (dev server → view source of `#root` / `document.head` has `application/ld+json` with `ProfessionalService` + `FAQPage`).
- [ ] **Step 5: Commit.** `git commit -am "feat: per-page SEO head + ProfessionalService/FAQPage JSON-LD"`

---

### Task 9: Playwright prerender + sitemap regeneration

**Files:**
- Create: `app/scripts/prerender.mjs`
- Output (regenerated): root `index.html` (prerendered homepage), `404.html`, `blog/index.html`, `blog/<slug>/index.html` ×3, `sitemap.xml`

**Interfaces:**
- Consumes: the built app at repo root; the 3 blog slugs.
- Produces: static per-route HTML with fully-rendered content + head, and a refreshed sitemap. This runs as the final step of `npm run build`.

- [ ] **Step 1: Write `prerender.mjs`.** Logic:
  1. Start a static server rooted at the repo root (the freshly built output) — e.g. a tiny `http.createServer` + `sirv`/manual file serve, or `vite preview`. Serve `index.html` for unknown paths so the SPA router can resolve any route.
  2. Launch Playwright chromium. Routes to snapshot: `['/','/blog','/blog/ansiedade-sintomas-tratamento','/blog/como-saber-se-preciso-de-terapia','/blog/terapia-online-funciona']`.
  3. For each route: `page.route('**/n8n.w1r3d.dev/**', r => r.abort())` (belt-and-suspenders with the Task 4 webdriver guard); `page.goto(url, {waitUntil:'networkidle'})`; wait for a hydration marker (e.g. `#root` has children / a known heading is present); capture `'<!doctype html>\n' + await page.content()`.
  4. Write: `/` → `index.html` **and** `404.html` (same homepage snapshot, SPA fallback); `/blog` → `blog/index.html`; each article → `blog/<slug>/index.html`.
  5. The captured HTML keeps the `<script type=module>` tag so the served static page still hydrates client-side (matches current behavior).
- [ ] **Step 2: Regenerate `sitemap.xml`** — 5 URLs (inventory §7) with `lastmod` = today (`2026-07-25`), same priorities/changefreq. (Today's date is passed in / read from `new Date` at build time — acceptable in a build script.)
- [ ] **Step 3: Run the full build.**
Run: `cd app && npm run build`
Expected: exit 0; the 5 HTML files + sitemap written.
- [ ] **Step 4: Verify prerenders carry CURRENT content, not stale.**
Run (from repo root):
```
grep -c "557996491276" index.html && ! grep -q "5527995119177" index.html \
 && grep -c "Para quem é este atendimento" index.html \
 && grep -c "Quem sou eu" index.html \
 && grep -c "formspree.io/f/xeevlzlb" index.html \
 && grep -c "AW-16583121961" index.html
```
Expected: new phone present, OLD phone absent, audience split present, "Quem sou eu" present, form + gtag present.
- [ ] **Step 5: Commit.** `git commit -am "feat: Playwright prerender of all routes + fresh sitemap"`

---

### Task 10: Clean orphaned artifacts + finalize output shape

**Files:**
- Delete: root `placeholder.svg`, the 8 orphaned `assets/index-*.{js,css}` bundles listed in inventory §5 (keep only the current build's hashed bundle + the 2 real media assets `hero-therapy-*.webp`, `therapist-portrait-*.avif`).
- Verify: root `index.html`, `assets/`, `blog/**`, `404.html`, `CNAME`, `robots.txt`, `sitemap.xml`, favicons, `og-image.jpg` all present and correct.

- [ ] **Step 1: Confirm the media assets Vite emitted** match the referenced hashes in `site.ts` (`hero-therapy-CgSB5jl3.webp`, `therapist-portrait-DhhPXLzJ.avif`). If Vite re-hashes them, update `site.ts` references to the emitted names (or import them so Vite manages the URLs) — the requirement is the built HTML points at real emitted files. Prefer importing the images in a module so hashing is automatic.
- [ ] **Step 2: Delete orphans.** Remove `placeholder.svg` and the 8 stale bundles (they are only referenced by files we are overwriting).
- [ ] **Step 3: Verify no dangling references.**
Run: `grep -rE "index-(BFxxg0Sd|CVgSuWO4|B1oDKpVj|BDMY6MmL|BOijH4fk|BsQtoF4y|CrR6NOxw|DfDBf3s-|DzrNWhAe|zp-71f8a)" . --include=*.html || echo CLEAN`
Expected: `CLEAN`.
- [ ] **Step 4: Commit.** `git commit -am "chore: remove orphaned bundles and placeholder.svg"`

---

### Task 11: Full acceptance verification (spec §Acceptance)

**Files:** none (verification only). Produce a short `docs/reference/rebuild-verification.md` recording the results.

- [ ] **Step 1: Clean rebuild from scratch.**
Run: `cd app && rm -rf node_modules && npm ci && npm run build`
Expected: exit 0 on Node 24 / npm 11.
- [ ] **Step 2: Assert every preserved constant** in the built output (root): gtag `AW-16583121961`, conversion `shGzCIOqipYcEKm4ueM9`, GSC `Ruj7meDK4FLvod`, Formspree `f/xeevlzlb`, n8n `n8n.w1r3d.dev/webhook/visitor`, phone `557996491276`, email `karoljangola@gmail.com`, Instagram handle, `CNAME`=`karolinejangola.com`. Record each grep result.
- [ ] **Step 3: Serve the built root locally and browser-compare** against `https://www.karolinejangola.com`: homepage section order + copy, both audience CTAs open WhatsApp with the correct pre-filled text, form posts to Formspree (network tab), `/blog` + 3 articles, DM fonts + sage/terracotta palette, mobile menu, FAQ accordion. Note any diff.
- [ ] **Step 4: Confirm the 3 improvements-over-live** in prerenders: correct phone, audience split present, contact form present; sitemap `lastmod` refreshed.
- [ ] **Step 5: Write `rebuild-verification.md`** with the pass/fail table and any known cosmetic deltas. Commit. **Do NOT push — hand to the Gemini review gate.**

---

## Self-Review (author checklist — completed)

**Spec coverage:** Every spec requirement maps to a task — stack/layout (T1), tokens/fonts (T2), content incl. preserved ISO + audience split (T3/T6), gtag/whatsapp/n8n/formspree integrations (T4/T6), components incl. mobile nav + accordion (T5), homepage order (T6), blog/routes/404 (T7), JSON-LD + head + GSC/OG (T1/T8), prerender-all-routes-with-current-content + sitemap (T9), orphan cleanup + CNAME/robots/favicons/og preserved (T1/T10), clean-build + browser parity acceptance (T11). Non-goals (content changes, CI migration, byte-identical bundles) are explicitly excluded.

**Placeholder scan:** No TBD/TODO. Content is referenced to specific inventory sections (a durable committed repo file), not hand-waved. The only deliberately deferred micro-decisions (mobile-menu + FAQ-animation exact behavior) are the inventory's UNVERIFIED items, resolved by live browser comparison in T5/T6/T11 — flagged, not hidden.

**Type consistency:** `site` field names, `fireConversion`/`CONVERSION_SEND_TO`, `waUrl`/`WA.*`, `trackVisit`, `<Seo>` props, `professionalServiceJsonLd`/`faqPageJsonLd` are named identically wherever referenced across tasks.
