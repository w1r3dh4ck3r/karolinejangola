# SP3 — Build the /atendimento/ Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the 9 hybrid service/condition pages under `/atendimento/` defined by the SP2 spec, each prerendered as real HTML with correct SEO metadata, JSON-LD, internal links, and a conversion-tracked WhatsApp CTA.

**Architecture:** Extends the existing SP0 manifest pipeline. Each page = one `PageMeta` entry in `manifest.json` + one HTML body in `pagesContent`. Shared infra tasks add per-page JSON-LD (BreadcrumbList always; FAQPage on boundary pages) to `staticPageSeo`, a tracked `<WhatsAppLink>` CTA to `StaticPage`, and a permanent `atendimento` section root to the publish allowlist. Pages are built in demand tiers P0→P1→P2.

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind; Vitest; Playwright prerender (`scripts/prerender.mjs`); Node publish script (`scripts/publish.mjs`).

## Global Constraints
Copied verbatim from the SP2 spec (`docs/superpowers/specs/2026-08-09-sp2-ia-keyword-map-design.md`). Every task implicitly includes these:
- **Credential:** use **psicanalista / terapeuta** in every title, H1, and JSON-LD. **NEVER "psicólogo/a"** (CRP-protected title). "psicólogo" may appear only in FAQ copy that clarifies she is *not* a psicóloga.
- **Claim boundary:** no page claims or implies screening (testes de rastreio), diagnosis, laudos, or health-insurance acceptance. TDAH/TEA/comportamento are framed as **acompanhamento e fortalecimento emocional**, never assessment.
- **Voice:** Portuguese, **exclusively female grammar**, addressing the **mother/guardian** ("você" = a mãe). Calm, warm, low-anxiety tone (see project `CLAUDE.md`). Audience = children & adolescents 8–19 only; no women, no adults.
- **URL:** all pages under the single fixed section root `atendimento`; apex canonical (`https://karolinejangola.com`, handled by `staticPageSeo`).
- **Revenue-critical, do not break:** WhatsApp conversion (`fireConversion` → `AW-16583121961/shGzCIOqipYcEKm4ueM9`) fires on every CTA; `.nojekyll`, `CNAME`=apex preserved.
- **No `depressão`/`trauma` pages** (not in Karoline's list).

## ⚠️ Cross-sprint prerequisite (SP1)
Task 13 (hub-card links from the home `#tratamentos` section) **depends on SP1 having rewritten those cards** to Karoline's real conditions/services. **Recommend running SP1 before Task 13.** Tasks 1–12 and 14 (footer + in-page cross-links) do **not** depend on SP1 and give crawlers a complete internal-link path meanwhile. If SP1 is not done when Task 13 is reached, skip Task 13 and record it as SP1-blocked.

## File Structure
- **Modify** `app/scripts/lib/generated-paths.mjs` — export `BASE_GENERATED_PATHS` (incl. `'atendimento'`).
- **Modify** `app/scripts/publish.mjs` — import `BASE_GENERATED_PATHS` instead of the inline literal.
- **Modify** `app/src/data/seo.ts` — add `breadcrumbJsonLd(page)`; extend `staticPageSeo(page, faqItems?)` to emit `jsonLd`.
- **Create** `app/src/data/pages/faq.ts` — the shared boundary FAQ constant + `pagesFaq: Record<string, FaqItem[]>`.
- **Modify** `app/src/components/StaticPage.tsx` — pass page FAQ into `staticPageSeo`; render the `<WhatsAppLink>` CTA below `<article>`.
- **Modify** `app/src/data/pages/manifest.json` — the 9 `PageMeta` entries (added tier by tier).
- **Modify** `app/src/data/pages/content.ts` — the 9 HTML bodies (added tier by tier).
- **Modify** `app/src/components/Footer.tsx` — the page link list.
- **Tests:** extend `app/scripts/lib/generated-paths.test.mjs`, `app/src/data/seo.test.ts`; existing `manifest.test.ts`/`content.test.ts` gate every page addition automatically.

**One-time setup:** `cd app && npx playwright install chromium` (prerender needs it).

---

### Task 1: Permanent `atendimento` section root in the publish allowlist

Implements SP0 orphan fix / spec Decision 5: `atendimento` is always wiped+recopied like `blog/`, so removing the last page still self-cleans.

**Files:**
- Modify: `app/scripts/lib/generated-paths.mjs`
- Modify: `app/scripts/publish.mjs:28`
- Test: `app/scripts/lib/generated-paths.test.mjs`

**Interfaces:**
- Produces: `BASE_GENERATED_PATHS: string[]` exported from `generated-paths.mjs`.

- [ ] **Step 1: Write the failing test** — append to `generated-paths.test.mjs`:

```js
import { BASE_GENERATED_PATHS, computeGeneratedPaths } from './generated-paths.mjs'

describe('BASE_GENERATED_PATHS', () => {
  it('always includes the fixed atendimento section root, even with no manifest pages', () => {
    expect(BASE_GENERATED_PATHS).toContain('atendimento')
    const result = computeGeneratedPaths(BASE_GENERATED_PATHS, [], () => false)
    expect(result).toContain('atendimento')
  })
})
```

- [ ] **Step 2: Run it, verify it fails** — `cd app && npx vitest run scripts/lib/generated-paths.test.mjs` → FAIL (`BASE_GENERATED_PATHS` undefined).

- [ ] **Step 3: Implement** — in `generated-paths.mjs`, add above `computeGeneratedPaths`:

```js
// The fixed root-level dirs publish.mjs always regenerates, independent of the
// manifest. 'atendimento' is here (not merely added per-page) so removing the
// LAST /atendimento/ page still wipes+recopies the section instead of orphaning
// its published dir — the SP0 parked finding.
export const BASE_GENERATED_PATHS = [
  'assets', 'index.html', '404.html', 'blog', 'sitemap.xml', 'placeholder.svg', 'atendimento',
]
```

  Then in `publish.mjs`: change the import to `import { BASE_GENERATED_PATHS, computeGeneratedPaths } from './lib/generated-paths.mjs'` and replace the inline `const GENERATED_PATHS = [...]` (line 28) with `const GENERATED_PATHS = BASE_GENERATED_PATHS`.

- [ ] **Step 4: Run tests** — `cd app && npx vitest run` → PASS.

- [ ] **Step 5: Commit** — `git add app/scripts/lib/generated-paths.mjs app/scripts/lib/generated-paths.test.mjs app/scripts/publish.mjs && git commit -m "feat(sp3): permanent atendimento section root in publish allowlist"`

---

### Task 2: `breadcrumbJsonLd` + boundary FAQ data + `staticPageSeo` JSON-LD

**Files:**
- Modify: `app/src/data/seo.ts`
- Create: `app/src/data/pages/faq.ts`
- Test: `app/src/data/seo.test.ts`

**Interfaces:**
- Consumes: `PageMeta`, `faqPageJsonLd(items)` (existing), `FaqItem` (from `./faq`).
- Produces: `breadcrumbJsonLd(page: PageMeta): Record<string, unknown>`; `staticPageSeo(page: PageMeta, faqItems?: FaqItem[]): SeoProps` (now with `jsonLd`); `BOUNDARY_FAQ: FaqItem[]` and `pagesFaq: Record<string, FaqItem[]>` from `app/src/data/pages/faq.ts`.

- [ ] **Step 1: Create the FAQ data** — `app/src/data/pages/faq.ts`:

```ts
import type { FaqItem } from '../faq'

/** Claim-boundary FAQ (SP2 spec §2). Rendered on TDAH/TEA/comportamento pages
 *  and emitted as FAQPage JSON-LD. Keeps the pages honest re: no laudo/diagnóstico. */
export const BOUNDARY_FAQ: FaqItem[] = [
  {
    q: 'Você faz diagnóstico ou emite laudo?',
    a: 'Não realizo testes de rastreio, diagnósticos ou laudos. Meu trabalho é o fortalecimento emocional e o acompanhamento contínuo. Se você busca um laudo, o profissional indicado é um(a) neuropediatra ou psiquiatra.',
  },
  { q: 'Atende por plano de saúde?', a: 'Atualmente atendo apenas de forma particular.' },
]

/** slug -> FAQ items for that page (feeds both the rendered FAQ and FAQPage JSON-LD). */
export const pagesFaq: Record<string, FaqItem[]> = {
  'terapia-para-tdah': BOUNDARY_FAQ,
  'apoio-emocional-tea': BOUNDARY_FAQ,
  'comportamento-infantil': BOUNDARY_FAQ,
}
```

- [ ] **Step 2: Write the failing test** — append to `seo.test.ts`:

```ts
import { BOUNDARY_FAQ } from './pages/faq'

describe('staticPageSeo jsonLd', () => {
  it('always emits a BreadcrumbList', () => {
    const jsonLd = staticPageSeo(page).jsonLd ?? []
    expect(jsonLd.some((x) => x['@type'] === 'BreadcrumbList')).toBe(true)
  })
  it('emits FAQPage only when faqItems are passed', () => {
    expect((staticPageSeo(page).jsonLd ?? []).some((x) => x['@type'] === 'FAQPage')).toBe(false)
    const withFaq = staticPageSeo(page, BOUNDARY_FAQ).jsonLd ?? []
    expect(withFaq.some((x) => x['@type'] === 'FAQPage')).toBe(true)
  })
})
```

- [ ] **Step 3: Run it, verify it fails** — `cd app && npx vitest run src/data/seo.test.ts` → FAIL (`jsonLd` undefined).

- [ ] **Step 4: Implement** — in `seo.ts`, add the builder and extend `staticPageSeo`:

```ts
import type { FaqItem } from './faq'

export function breadcrumbJsonLd(page: PageMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Atendimento', item: `${SITE_URL}/#tratamentos` },
      { '@type': 'ListItem', position: 3, name: page.title, item: `${SITE_URL}${page.path}` },
    ],
  }
}

export function staticPageSeo(page: PageMeta, faqItems?: FaqItem[]): SeoProps {
  const jsonLd: Record<string, unknown>[] = [breadcrumbJsonLd(page)]
  if (faqItems && faqItems.length > 0) jsonLd.push(faqPageJsonLd(faqItems))
  return {
    title: `${page.title} | Karoline Jangola`,
    description: page.description,
    canonical: `${SITE_URL}${page.path}`,
    og: { image: OG_IMAGE },
    jsonLd,
  }
}
```

- [ ] **Step 5: Run tests** — `cd app && npx vitest run` → PASS (existing staticPageSeo tests still green; they call `staticPageSeo(page)` with no faq).

- [ ] **Step 6: Commit** — `git add app/src/data/seo.ts app/src/data/pages/faq.ts app/src/data/seo.test.ts && git commit -m "feat(sp3): breadcrumb + boundary-FAQ JSON-LD for static pages"`

---

### Task 3: `StaticPage` renders JSON-LD + tracked CTA

**Files:**
- Modify: `app/src/components/StaticPage.tsx`

**Interfaces:**
- Consumes: `staticPageSeo(page, faqItems?)`, `pagesFaq` (Task 2), `WhatsAppLink`, `WA.general`.

- [ ] **Step 1: Implement** — replace the body of `StaticPage.tsx` render so it looks up the FAQ, passes it to `staticPageSeo`, and adds a CTA below `<article>`:

```tsx
import Footer from './Footer'
import Nav from './Nav'
import Seo from './Seo'
import WhatsAppLink from './WhatsAppLink'
import NotFound from '../pages/NotFound'
import { pages } from '../data/pages'
import { pagesContent } from '../data/pages/content'
import { pagesFaq } from '../data/pages/faq'
import { staticPageSeo } from '../data/seo'
import { WA } from '../lib/whatsapp'

export default function StaticPage({ slug }: { slug: string }) {
  const page = pages.find((p) => p.slug === slug)
  if (!page) return <NotFound />

  return (
    <>
      <Seo {...staticPageSeo(page, pagesFaq[slug])} />
      <Nav />
      <main className="min-h-screen bg-background pb-20 pt-24">
        <div className="container mx-auto max-w-3xl px-6 md:px-12">
          <h1 className="mb-8 font-serif text-3xl leading-tight text-foreground md:text-4xl">
            {page.title}
          </h1>
          <article className="prose-blog" dangerouslySetInnerHTML={{ __html: pagesContent[slug] ?? '' }} />
          <div className="mt-12 rounded-2xl bg-secondary/40 p-8 text-center">
            <p className="mb-4 font-serif text-xl text-foreground">
              Quer conversar sobre o seu filho?
            </p>
            <WhatsAppLink
              className="inline-block rounded-lg bg-primary px-6 py-3 font-sans text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 active:scale-[0.97]"
              href={WA.general}
              text="Falar comigo pelo WhatsApp"
            />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

  This CTA is a real React `<WhatsAppLink>` (fires `fireConversion`), rendered **outside** the injected HTML — the spec §5 gotcha. In-body CTAs, if any page adds one, must use the inline-onclick snippet in the page-authoring note below.

- [ ] **Step 2: Verify it compiles + tests green** — `cd app && npm run build:app && npx vitest run` → tsc/vite exit 0, tests PASS. (No component-render harness exists; full HTML verification lands in Task 4 via prerender grep.)

- [ ] **Step 3: Commit** — `git add app/src/components/StaticPage.tsx && git commit -m "feat(sp3): StaticPage emits per-page JSON-LD + tracked WhatsApp CTA"`

---

### PAGE-AUTHORING NOTE (applies to Tasks 4–12)
Each page task does three concrete things, then verifies via prerender:
1. **Append its `PageMeta` to `manifest.json`** with the exact values from the spec (§1 path/slug/sectionRoot/outputDir, §2 title/description). `outputDir` = path without leading slash. `sectionRoot` = `"atendimento"`.
2. **Add its HTML body to `pagesContent`** keyed by slug. Body contract: uses only `<h2>/<h3>/<p>/<ul>/<a>` (rendered inside `.prose-blog`); H1 is auto (the page title). Include the H2 sections listed in the spec's H2 skeleton for that page; weave the primary + secondary keywords naturally; **female grammar addressing the mother**; **zero forbidden claims**. Add in-body internal links: every condition page links to `/atendimento/terapia-infantil` **and** `/atendimento/terapia-para-adolescentes` and to `/atendimento/orientacao-para-pais`; service pages link to their 2–3 top condition pages. Use root-relative `<a href="/atendimento/...">`.
3. **Boundary-FAQ pages only** (TDAH, TEA, comportamento): render the two `BOUNDARY_FAQ` Q/A as an `<h2>Perguntas frequentes</h2>` + `<h3>`/`<p>` block at the end of the body (the FAQPage JSON-LD is already emitted by Task 2/3 via `pagesFaq`).
4. **In-body CTA (optional):** if a page needs a mid-body WhatsApp link, it must carry the conversion inline (React won't bind an onClick inside injected HTML): `<a href="https://wa.me/557996491276?text=..." target="_blank" rel="noopener noreferrer" onclick="window.gtag&&window.gtag('event','conversion',{send_to:'AW-16583121961/shGzCIOqipYcEKm4ueM9'})">…</a>`. Otherwise rely on the StaticPage CTA.

**Per-page verification (same for every page task):**
```bash
cd app && npx vitest run            # manifest.test + content.test gate the new entry
npm run build                        # tsc + vite + prerender (needs playwright chromium)
S=<slug>
grep -q '<link rel="canonical"[^>]*karolinejangola.com/atendimento/'$S dist/atendimento/$S/index.html
grep -q 'BreadcrumbList' dist/atendimento/$S/index.html
grep -q 'Falar comigo pelo WhatsApp' dist/atendimento/$S/index.html    # StaticPage CTA present
grep -q "atendimento/$S" dist/sitemap.xml                               # sitemap entry
# boundary pages only:
grep -q 'FAQPage' dist/atendimento/$S/index.html
```
Then commit `git add app/src/data/pages/manifest.json app/src/data/pages/content.ts && git commit -m "feat(sp3): <slug> page"`.

---

### Task 4: Page `terapia-infantil` (P0, service) — WORKED EXEMPLAR
Establishes the pattern; Tasks 5–12 follow it with their own spec rows.

**Files:** Modify `app/src/data/pages/manifest.json`, `app/src/data/pages/content.ts`.

- [ ] **Step 1: Add manifest entry** (first entry, so `manifest.json` becomes `[ { … } ]`):

```json
{
  "slug": "terapia-infantil",
  "path": "/atendimento/terapia-infantil",
  "outputDir": "atendimento/terapia-infantil",
  "sectionRoot": "atendimento",
  "title": "Terapia Infantil Online",
  "description": "Terapia infantil online com psicanalista especializada em crianças. Um espaço seguro e acolhedor para fortalecer as emoções do seu filho, no conforto de casa."
}
```

- [ ] **Step 2: Add content** to `pagesContent` in `content.ts` (real body, female grammar, no forbidden claims, internal links present):

```ts
'terapia-infantil': `
<p>Se você percebe que algo não vai bem com o seu filho e não sabe por onde começar, a terapia infantil online é um espaço seguro para acolher — e fortalecer — o mundo emocional da criança, no conforto de casa.</p>
<h2>Como funciona a terapia infantil online</h2>
<p>Como psicanalista especializada em crianças, recebo o seu filho por videochamada, com a mesma escuta e o mesmo cuidado do atendimento presencial. Através da fala, do brincar e do desenho, a criança encontra formas de expressar o que ainda não consegue colocar em palavras.</p>
<h2>Quando procurar</h2>
<p>Sinais como <a href="/atendimento/ansiedade-infantil">ansiedade</a>, crises de choro, mudanças de comportamento, dificuldade de fazer amigos ou queda na <a href="/atendimento/autoestima">autoestima</a> podem indicar que a criança precisa de um espaço para ser ouvida.</p>
<h2>O papel dos pais no processo</h2>
<p>Você não fica de fora. A <a href="/atendimento/orientacao-para-pais">orientação para os pais</a> caminha junto do acompanhamento, para que em casa vocês tenham apoio e direção.</p>
<h2>Como começar</h2>
<p>O primeiro passo é uma conversa, sem compromisso, para eu entender o momento do seu filho e vocês sentirem se faz sentido seguirmos juntas.</p>
`,
```

- [ ] **Step 3: Run per-page verification** (see PAGE-AUTHORING NOTE, `S=terapia-infantil`; skip the FAQPage line — not a boundary page). All greps exit 0.

- [ ] **Step 4: Commit** — `git commit -m "feat(sp3): terapia-infantil page"`

---

### Task 5: Page `terapia-para-adolescentes` (P0, service)
Follow the PAGE-AUTHORING NOTE + Task 4 pattern. Manifest title `Terapia para Adolescentes Online`, description from spec §2 row 2. H2s: Desafios emocionais da adolescência · Como funciona online · Como os pais participam · Como começar. Primary kw "terapia para adolescentes online"; link to `ansiedade-infantil`, `autoestima`, `orientacao-para-pais`. Verify (`S=terapia-para-adolescentes`, no FAQPage). Commit.

### Task 6: Page `ansiedade-infantil` (P0, condition)
Title `Terapia para Ansiedade Infantil`, description spec §2 row 3. H2s: Sinais de ansiedade na infância e adolescência · **Crises de choro: o que podem estar comunicando** (fold-in) · Como a terapia ajuda · Como começar. Primary "terapia para ansiedade infantil"; link to `terapia-infantil`, `terapia-para-adolescentes`, `orientacao-para-pais`. Verify (`S=ansiedade-infantil`, no FAQPage). Commit.

### Task 7: Page `terapia-para-tdah` (P0, condition — BOUNDARY)
Title `TDAH: Terapia e Acompanhamento`, description spec §2 row 4. H2s: Como o acompanhamento ajuda no TDAH · **O que este trabalho não é** · O papel dos pais · Como começar — **and** the `Perguntas frequentes` block rendering `BOUNDARY_FAQ` (step 3 of the note). `pagesFaq['terapia-para-tdah']` is already wired (Task 2). Framing: acompanhamento/fortalecimento only — no diagnosis/laudo. Link to `terapia-infantil`, `terapia-para-adolescentes`, `orientacao-para-pais`. Verify (`S=terapia-para-tdah`, **include** the FAQPage grep). Commit. **← End of P0 (review gate before P1).**

### Task 8: Page `orientacao-para-pais` (P1, service)
Title `Orientação para Pais`, description spec §2 row 5. H2s: O que é a orientação para pais · Quando ela ajuda · Avulsa ou no pacote mensal · Como começar. Primary "orientação para pais". Link to `terapia-infantil`, `terapia-para-adolescentes`. Verify (`S=orientacao-para-pais`, no FAQPage). Commit.

### Task 9: Page `apoio-emocional-tea` (P1, condition — BOUNDARY)
Title `TEA (Autismo): Apoio Emocional`, description spec §2 row 6. H2s: Como é o apoio emocional no TEA · **O que este trabalho não inclui** · Apoio à família · Como começar + `Perguntas frequentes` (BOUNDARY_FAQ). `pagesFaq['apoio-emocional-tea']` wired. Framing: apoio emocional, never avaliação/laudo. Link to `terapia-infantil`, `terapia-para-adolescentes`, `orientacao-para-pais`. Verify (`S=apoio-emocional-tea`, include FAQPage). Commit.

### Task 10: Page `autoestima` (P1, condition)
Title `Terapia para Autoestima Infantil`, description spec §2 row 7. H2s: Sinais de baixa autoestima · Como a terapia fortalece · Como começar. Primary "terapia para baixa autoestima infantil". Link to `terapia-infantil`, `terapia-para-adolescentes`, `orientacao-para-pais`. Verify (`S=autoestima`, no FAQPage). Commit. **← End of P1 (review gate before P2).**

### Task 11: Page `comportamento-infantil` (P2, condition — BOUNDARY)
Title `Terapia para Comportamento Infantil`, description spec §2 row 8. H2s: O que o comportamento pode estar comunicando · Como o trabalho ajuda (apoio em casa) · O papel dos pais · Como começar + `Perguntas frequentes` (BOUNDARY_FAQ). `pagesFaq['comportamento-infantil']` wired. Support-at-home framing, no TOD diagnosis. Link to `terapia-infantil`, `terapia-para-adolescentes`, `orientacao-para-pais`. Verify (`S=comportamento-infantil`, include FAQPage). Commit.

### Task 12: Page `dificuldades-de-relacionamento` (P2, condition)
Title `Dificuldade de Relacionamento e Timidez`, description spec §2 row 9. H2s: Timidez × dificuldade de relacionamento · **Quando a solidão pede atenção** (fold-in) · Como a terapia ajuda · Como começar. Primary "terapia para dificuldade de relacionamento na adolescência". Link to `terapia-infantil`, `terapia-para-adolescentes`, `orientacao-para-pais`. Verify (`S=dificuldades-de-relacionamento`, no FAQPage). Commit. **← End of P2 (all 9 pages live).**

---

### Task 13: Hub links from the home `#tratamentos` cards ⚠️ SP1-DEPENDENT
Only after SP1 has rewritten the home treatment cards to Karoline's real conditions/services.

**Files:** Modify `app/src/data/treatments.ts` (add a `href` per card) and `app/src/sections/Tratamentos.tsx` (wrap each card in a `<Link>`).

- [ ] **Step 1: Verify prerequisite** — confirm `treatments.ts` cards are the child/adolescent set (SP1 done). If they still read adult/women copy, **STOP** and record Task 13 as SP1-blocked.
- [ ] **Step 2:** Add an optional `href` to the `Treatment` interface + each card, pointing to its `/atendimento/...` page; render the card as a `react-router-dom` `<Link to={t.href}>` when `href` is set. (Read `Tratamentos.tsx` first to match its markup.)
- [ ] **Step 3: Verify** — `cd app && npx vitest run && npm run build:app` exit 0; each card links to a real page path.
- [ ] **Step 4: Commit** — `git commit -m "feat(sp3): link home treatment cards to /atendimento pages"`

### Task 14: Footer link list (crawl path, SP1-independent)

**Files:** Modify `app/src/components/Footer.tsx`.

- [ ] **Step 1: Read `Footer.tsx`** (current markup) then add a link list above the copyright row — a "Como posso ajudar" group linking all 9 `/atendimento/...` pages via `react-router-dom` `<Link>`. Keep the existing copyright + "Atendimento exclusivamente online" line and the sage/terracotta styling.
- [ ] **Step 2: Verify** — `cd app && npm run build:app` exit 0; `npm run build` then `grep -c 'atendimento/' dist/index.html` ≥ 9 (footer renders on the home snapshot too).
- [ ] **Step 3: Commit** — `git commit -m "feat(sp3): footer link list to /atendimento pages"`

---

## Self-Review (checked against the SP2 spec)
- **Spec coverage:** §1 inventory → Tasks 4–12 (all 9 pages, tiers preserved). §2 metadata/keywords/H2/fold-ins/boundary-FAQ/negatives → per-page tasks + Task 2 FAQ data. §3 internal linking → in-body links (each page task) + Task 14 footer + Task 13 hub cards. §4 JSON-LD → Tasks 2–3 (Breadcrumb all, FAQPage on 7/9/11). §5 conversion gotcha → Task 3 CTA + inline-onclick note. §6 sitemap → automatic (verified per page). §7 coupling → Task 13 SP1 flag. §Decision 5 fixed root → Task 1.
- **Placeholder scan:** infra tasks carry full code; page tasks carry exact manifest JSON + a worked exemplar (Task 4) + concrete per-page contract & verification commands. Body prose is authored during execution against the spec (the spec fixes structure + claims; pre-writing 9 bodies here would be executing, not planning).
- **Type consistency:** `staticPageSeo(page, faqItems?)`, `pagesFaq`, `BASE_GENERATED_PATHS`, `breadcrumbJsonLd(page)` names match across Tasks 1–3 and their consumers.

## Open items (from spec §9, resolve during execution)
- **Child/teen age split** on pages 1–2: keep "crianças"/"adolescentes" without hard sub-ages unless Karoline specifies.
- **Meta descriptions & body tone** are drafts — fine to send Karoline for a tone pass; the *claims* are fixed and must not change.
