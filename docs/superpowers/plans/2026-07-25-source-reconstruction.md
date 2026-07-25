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
- **Deploy unchanged, but publish is deliberate:** the app builds to `app/dist/` (safe, self-contained). A separate **publish** step (Task 10) clears the root `assets/` + generated HTML and copies `dist/`→root. The repo root **stays the current live site** until publish is run intentionally — no intermediate build ever overwrites the served root. `.git/`, `docs/`, `app/` are never touched by publish.
- **Asset URLs preserved (no re-hashing):** the 2 real media assets keep their exact current URLs `/assets/hero-therapy-CgSB5jl3.webp` and `/assets/therapist-portrait-DhhPXLzJ.avif` by living in `app/public/assets/` (Vite copies `public/` verbatim, no content-hashing). `site.ts` references these literal paths. Do **not** `import` them (that would re-hash).
- **.gitignore invariants:** `app/node_modules/` and `app/dist/` are ignored; the tracked deployable output at the repo root (`index.html`, `assets/`, `blog/**`, `404.html`, `sitemap.xml`, `CNAME`, `robots.txt`, favicons, `og-image.jpg`) stays tracked. A `.gitignore` rule must never match the root `assets/`.
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
    "publish:site": "node scripts/publish.mjs",
    "preview": "vite preview"
  }
}
```
`build` produces the finished site inside `app/dist/` (vite build + prerender). `publish:site` is the **separate, deliberate** step that copies `dist/`→repo root (Task 10). No `build` ever writes to the root.
- [ ] **Step 2: `vite.config.ts`** — build to the self-contained `app/dist/` (NOT the repo root; publishing to root is a separate deliberate step in Task 10):
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',   // CNAME, robots, favicons, og-image, assets/*.webp|avif copied verbatim
  build: {
    outDir: 'dist',      // app/dist — cleared each build, safe; root is never overwritten by a build
    assetsDir: 'assets',
  },
})
```
- [ ] **Step 3: `app/index.html`** — the Vite entry template. Head must contain, verbatim, everything from inventory §1 `index.html`: charset, GSC meta, viewport, title, description, keywords, author, canonical, favicon links, all og:/twitter: meta, the gtag loader `<script async src=…AW-16583121961>` + inline `gtag('config','AW-16583121961')`, and `<div id="root"></div>`. The module script + stylesheet are injected by Vite. (Per-page/JSON-LD head is added in Task 8.)
- [ ] **Step 4: `main.tsx` + minimal `App.tsx`** — render a router with a single placeholder route returning `<div>ok</div>` so the build is verifiable before real content exists.
- [ ] **Step 5: Static passthrough files into `app/public/`.** Copy the current root `CNAME`, `robots.txt`, `favicon.ico`, `favicon-192.png`, `apple-touch-icon.png`, `og-image.jpg` into `app/public/` (verbatim; binaries unchanged). Also copy the 2 media assets **keeping their exact hashed filenames** into `app/public/assets/`: `hero-therapy-CgSB5jl3.webp`, `therapist-portrait-DhhPXLzJ.avif` (from the current root `assets/`). Vite copies `public/` verbatim → the URLs `/assets/hero-therapy-CgSB5jl3.webp` and `/assets/therapist-portrait-DhhPXLzJ.avif` are preserved exactly (no re-hash).
- [ ] **Step 6: `.gitignore` for `app/`** — ignore `node_modules/` and `dist/`. Confirm the **root** `.gitignore` does not match `assets/` (the deployable root output must stay tracked).
- [ ] **Step 7: Build and verify output lands in `app/dist/` (NOT root).**
Run: `cd app && npm install && npm run build:app`
Expected: `dist/index.html` exists, references a hashed `/assets/index-*.js`, and `dist/CNAME` = `karolinejangola.com`; `dist/assets/hero-therapy-CgSB5jl3.webp` present. The **repo root is unchanged** (still the current live site).
- [ ] **Step 8: Verify the head survived the build.**
Run: `grep -c "AW-16583121961" dist/index.html && grep -c "Ruj7meDK4FLvod" dist/index.html`
Expected: both ≥ 1 (gtag + GSC meta present in built index.html).
- [ ] **Step 9: Commit.** `git add app/ && git commit -m "feat: scaffold Vite+React+TS app (builds to app/dist)"`

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
Run: `cd app && npm run build:app && grep -o "DM Serif Display" dist/assets/*.css | head -1 && grep -o "150 18% 38%" dist/assets/*.css | head -1`
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
- [ ] **Step 4: `tracking.ts`** — the exact n8n `fetch` from inventory §3 (`{site,page,referrer,ua}`, `keepalive:true`, try/catch-silent). Add a guard so it is a **no-op when `navigator.webdriver` is true** (helps prevent the prerender browser POSTing). NOTE: `navigator.webdriver` is not reliably set by every Playwright launch config — it is a belt, not the braces. Task 9 ALSO route-aborts the webhook; keep both.
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
Verify in built `dist/assets/*.js`: `grep -c "formspree.io/f/xeevlzlb" dist/assets/*.js` ≥1; `grep -c "shGzCIOqipYcEKm4ueM9" dist/assets/*.js` ≥1; `grep -c "557996491276" dist/assets/*.js` ≥1.
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

### Task 9: Playwright prerender + sitemap regeneration (operates on `app/dist/`)

**Files:**
- Create: `app/scripts/prerender.mjs`
- Output (written into `app/dist/`, overwriting the vite-built shells): `dist/index.html` (prerendered homepage), `dist/404.html`, `dist/blog/index.html`, `dist/blog/<slug>/index.html` ×3, `dist/sitemap.xml`

**Interfaces:**
- Consumes: the vite build in `app/dist/`; the 3 blog slugs.
- Produces: static per-route HTML with fully-rendered content + head, and a refreshed sitemap — all inside `dist/`. This runs as the final step of `npm run build`. (Publishing `dist/`→root is Task 10, separate.)

- [ ] **Step 1: Write `prerender.mjs`.** Logic:
  1. Start a static server rooted at **`app/dist/`** (the freshly built output). Serve `index.html` for unknown paths so the SPA router can resolve any route.
  2. Launch Playwright chromium. Routes to snapshot: `['/','/blog','/blog/ansiedade-sintomas-tratamento','/blog/como-saber-se-preciso-de-terapia','/blog/terapia-online-funciona']`.
  3. For each route: abort the webhook with a broad glob — `page.route('**n8n.w1r3d.dev**', r => r.abort())` (Playwright may not match a narrow `**/host/**` form; keep this broad). `page.goto(url, {waitUntil:'networkidle'})`.
  4. **Wait for a concrete post-effect marker, NOT just network state** — the `<Seo>` component injects JSON-LD via a React effect that may not have flushed at `networkidle`: `await page.waitForSelector('script[type="application/ld+json"]')` (and for `/`, also wait for the `#contato` form / a known heading). Only then capture `'<!doctype html>\n' + await page.content()`.
  5. Write into `dist/`: `/` → `index.html` **and** `404.html` (same homepage snapshot, SPA fallback); `/blog` → `blog/index.html`; each article → `blog/<slug>/index.html`.
  6. The captured HTML keeps the `<script type=module>` tag so the served static page still hydrates client-side (matches current behavior).
- [ ] **Step 2: Regenerate `dist/sitemap.xml`** — 5 URLs (inventory §7) with `lastmod` = build date, same priorities/changefreq. (Read from `new Date()` in the build script — acceptable there.)
- [ ] **Step 3: Run the full build.**
Run: `cd app && npm run build`
Expected: exit 0; the 5 HTML files + sitemap written under `dist/`.
- [ ] **Step 4: Verify prerenders carry CURRENT content AND the effect-injected head.**
Run (from `app/`):
```
cd dist \
 && grep -c "557996491276" index.html && ! grep -q "5527995119177" index.html \
 && grep -c "Para quem é este atendimento" index.html \
 && grep -c "Quem sou eu" index.html \
 && grep -c "formspree.io/f/xeevlzlb" index.html \
 && grep -c "AW-16583121961" index.html \
 && grep -c "ProfessionalService" index.html \
 && grep -c "FAQPage" index.html
```
Expected: new phone present, OLD phone absent, audience split present, "Quem sou eu" present, form + gtag present, **and both JSON-LD types present** (proves the `<Seo>` effect flushed before capture — the core prerender risk).
- [ ] **Step 5: Commit.** `git commit -am "feat: Playwright prerender of all routes + fresh sitemap"`

---

### Task 10: Publish `dist/` → repo root (the deliberate deploy-shape step)

**Files:**
- Create: `app/scripts/publish.mjs`
- Modify (via the script): root `index.html`, `404.html`, `assets/`, `blog/**`, `sitemap.xml` (replaced from `dist/`); delete root `placeholder.svg` and the 8 orphaned `index-*.{js,css}` bundles (inventory §5)
- Preserve: `.git/`, `docs/`, `app/`, `CNAME`, `robots.txt`, favicons, `og-image.jpg` (the last four also come through `dist/`, identical)

This is the ONLY step that changes the served repo root. Run it deliberately; the `pre-rebuild-dist` tag is the restore point.

- [ ] **Step 1: Write `publish.mjs`.** Logic: (a) refuse to run if `app/dist/index.html` is missing (build first). (b) Remove the root generated set: `assets/` (whole dir), `index.html`, `404.html`, `blog/`, `sitemap.xml`, `placeholder.svg`. Never touch `.git`, `docs`, `app`, `.gitignore`, `.claude`, `CLAUDE.md`, `ARCHITECTURE.md`, `STACK.md`, `WORKFLOW.md`. (c) Copy every file from `dist/` → repo root, recursively. (d) Print a summary of files written.
- [ ] **Step 2: Build then publish.**
Run: `cd app && npm run build && npm run publish:site`
Expected: root now holds the reconstructed site; `dist/`→root copy reported.
- [ ] **Step 3: Verify the published root shape.**
Run (from repo root): `ls index.html 404.html sitemap.xml CNAME robots.txt og-image.jpg && ls assets/ && ls blog/ && test ! -e placeholder.svg && echo NO_PLACEHOLDER`
Expected: all served files present; `placeholder.svg` gone.
- [ ] **Step 4: Verify no dangling references to orphaned bundles.**
Run: `grep -rE "index-(BFxxg0Sd|CVgSuWO4|B1oDKpVj|BDMY6MmL|BOijH4fk|BsQtoF4y|CrR6NOxw|DfDBf3s-|DzrNWhAe|zp-71f8a)" . --include=*.html || echo CLEAN`
Expected: `CLEAN`.
- [ ] **Step 5: Commit.** `git add -A && git commit -m "feat: publish reconstructed build to repo root (replaces compiled-only dist)"`

---

### Task 11: Full acceptance verification (spec §Acceptance)

**Files:** none (verification only). Produce a short `docs/reference/rebuild-verification.md` recording the results.

- [ ] **Step 1: Clean rebuild from scratch, then publish.**
Run: `cd app && rm -rf node_modules dist && npm ci && npm run build && npm run publish:site`
Expected: exit 0 on Node 24 / npm 11; root republished.
- [ ] **Step 2: Assert every preserved constant** in the published root: gtag `AW-16583121961`, conversion `shGzCIOqipYcEKm4ueM9`, GSC `Ruj7meDK4FLvod`, Formspree `f/xeevlzlb`, n8n `n8n.w1r3d.dev/webhook/visitor`, phone `557996491276`, email `karoljangola@gmail.com`, Instagram handle, `CNAME`=`karolinejangola.com`. Record each grep result.
- [ ] **Step 3: Serve the published root locally and browser-compare** against `https://www.karolinejangola.com`: homepage section order + copy, both audience CTAs open WhatsApp with the correct pre-filled text, form posts to Formspree (network tab), `/blog` + 3 articles, DM fonts + sage/terracotta palette, mobile menu, FAQ accordion. Note any diff.
- [ ] **Step 4: Confirm the 3 improvements-over-live** in the prerendered root files: correct phone, audience split present, contact form present; sitemap `lastmod` refreshed.
- [ ] **Step 5: Write `rebuild-verification.md`** with the pass/fail table and any known cosmetic deltas. Commit. **Do NOT push — hand to the Gemini review gate.**

---

## Self-Review (author checklist — completed)

**Spec coverage:** Every spec requirement maps to a task — stack/layout (T1), tokens/fonts (T2), content incl. preserved ISO + audience split (T3/T6), gtag/whatsapp/n8n/formspree integrations (T4/T6), components incl. mobile nav + accordion (T5), homepage order (T6), blog/routes/404 (T7), JSON-LD + head + GSC/OG (T1/T8), prerender-all-routes-with-current-content + sitemap (T9), deliberate publish `dist/`→root + orphan removal + CNAME/robots/favicons/og preserved (T1/T10), clean-build + browser parity acceptance against published root (T11). Non-goals (content changes, CI migration, byte-identical bundles) are explicitly excluded. **Build/publish separation:** no build ever writes the served root; only T10's `publish:site` does — the root stays the current live site until deliberately republished, and `pre-rebuild-dist` is the restore point.

**Placeholder scan:** No TBD/TODO. Content is referenced to specific inventory sections (a durable committed repo file), not hand-waved. The only deliberately deferred micro-decisions (mobile-menu + FAQ-animation exact behavior) are the inventory's UNVERIFIED items, resolved by live browser comparison in T5/T6/T11 — flagged, not hidden.

**Type consistency:** `site` field names, `fireConversion`/`CONVERSION_SEND_TO`, `waUrl`/`WA.*`, `trackVisit`, `<Seo>` props, `professionalServiceJsonLd`/`faqPageJsonLd` are named identically wherever referenced across tasks.
