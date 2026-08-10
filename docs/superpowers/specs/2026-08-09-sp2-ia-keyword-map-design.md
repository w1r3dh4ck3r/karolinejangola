# SP2 — Information Architecture + Keyword→Page Map (design spec)

**Date:** 2026-08-09
**Sprint:** SP2 of the SEO program (SP0 ✅ → SP1 → **SP2** → SP3 → …)
**Status:** design, pending implementation plan (`writing-plans`)
**Deliverable:** this spec only — the page taxonomy, keyword map, and the linking/schema/
tracking *architecture*. **No page copy, no code** — SP3 builds the pages from this map.

## Inputs (authoritative sources)
- [`docs/reference/practice-facts.md`](../../reference/practice-facts.md) — Karoline's own answers:
  conditions, services, age 8–19, and the hard claim boundary (no screening/diagnosis/laudo/planos).
- [`docs/reference/keyword-research-2026-08-09.md`](../../reference/keyword-research-2026-08-09.md) —
  web-grounded pt-BR clusters + sources + the title-regulation finding.

## Decisions (locked in brainstorming with Mark)
1. **Positioning:** children & adolescents only (no women); reader = the **mother/guardian**,
   addressed in **female Portuguese grammar**.
2. **Title/credential (hard constraint):** the site uses **psicanalista / terapeuta**, and
   **never claims "psicólogo/a"** in titles, H1s, or JSON-LD. "Psicólogo/a" is a CRP-protected
   title (Lei 4.119/1962; Lei 5.766/1971); psicanálise/psicoterapia are unregulated. Claiming it
   is both false-advertising risk and a promise (diagnóstico/laudo/testes) she does not deliver.
   "psicólogo infantil" may appear ONLY in supporting/FAQ copy that clarifies she is not a psicóloga.
3. **Claim boundary:** no page may claim or imply screening (testes de rastreio), diagnosis,
   clinical reports (laudos), or health-insurance acceptance. TDAH/TEA/comportamento pages are
   framed as **acompanhamento e fortalecimento emocional**, never assessment.
4. **IA model:** **Hybrid** — service pages + condition pages, cross-linked.
5. **URL structure:** all pages nest under a **single fixed section root `/atendimento/…`**,
   registered once in `publish.mjs`'s `GENERATED_PATHS` and wiped+recopied like `blog/`. This
   resolves the SP0 parked finding (a page removed from the manifest self-cleans instead of
   orphaning its published directory).
6. **Excluded:** no *depressão* or *trauma* pages (not in Karoline's list); the leftover live copy
   referencing them is corrected downstream (SP1/SP3). No geo/local pages (she is 100% online,
   national + abroad; local/GMB is SP6, and the real practice city is still unconfirmed).

## 1. Page inventory (9 pages, single root `/atendimento/`)
Tiered for SP3 phasing. "Acompanhamento contínuo / pacote mensal" is **not** a standalone page
(thin demand) — it is woven into the service CTAs.

| # | Page | Type | Path | Tier |
|---|---|---|---|---|
| 1 | Terapia infantil online | Service | `/atendimento/terapia-infantil` | **P0** |
| 2 | Terapia para adolescentes online | Service | `/atendimento/terapia-para-adolescentes` | **P0** |
| 3 | Ansiedade infantil e adolescente | Condition | `/atendimento/ansiedade-infantil` | **P0** |
| 4 | TDAH — acompanhamento terapêutico | Condition | `/atendimento/terapia-para-tdah` | **P0** |
| 5 | Orientação para os pais | Service | `/atendimento/orientacao-para-pais` | P1 |
| 6 | TEA/autismo — apoio emocional | Condition | `/atendimento/apoio-emocional-tea` | P1 |
| 7 | Autoestima infantil e adolescente | Condition | `/atendimento/autoestima` | P1 |
| 8 | Comportamento infantil | Condition | `/atendimento/comportamento-infantil` | P2 |
| 9 | Dificuldades de relacionamento / timidez | Condition | `/atendimento/dificuldades-de-relacionamento` | P2 |

**SP3 build phasing:** P0 (4) first → P1 (3) → P2 (2).

Each entry becomes a `PageMeta` in `app/src/data/pages/manifest.json` with:
`slug` (= last path segment), `path` (`/atendimento/<slug>`), `outputDir` (`atendimento/<slug>`),
`sectionRoot: "atendimento"` (fixed, shared by all 9), `title`, `description`.

## 2. Keyword→page map + metadata
Titles are the pre-suffix `PageMeta.title` (`staticPageSeo` appends " | Karoline Jangola");
kept short so the SERP title stays ≲60 chars. Meta descriptions are **drafts** — female grammar,
primary keyword present, no forbidden claims. SP3 may refine wording; the *claims* are fixed.

| # | Title | Primary keyword | Secondary keywords | Meta description (draft) |
|---|---|---|---|---|
| 1 | Terapia Infantil Online | terapia infantil online | psicanalista infantil online; psicoterapia infantil; terapia para criança | Terapia infantil online com psicanalista especializada em crianças. Um espaço seguro e acolhedor para fortalecer as emoções do seu filho, no conforto de casa. |
| 2 | Terapia para Adolescentes Online | terapia para adolescentes online | psicoterapia para adolescente; terapeuta para adolescente online; ajuda para adolescente | Terapia para adolescentes online. Um espaço de escuta sem julgamento para o seu filho atravessar essa fase com mais segurança emocional. |
| 3 | Terapia para Ansiedade Infantil | terapia para ansiedade infantil | ansiedade infantil sintomas; ansiedade em adolescentes; meu filho tem ansiedade; crises de choro | Seu filho tem crises de choro, medos ou preocupação constante? A terapia acolhe e fortalece as emoções da criança e do adolescente com ansiedade. |
| 4 | TDAH: Terapia e Acompanhamento | terapia para criança com TDAH | acompanhamento psicológico TDAH infantil; psicoterapia TDAH; como ajudar filho com TDAH | Acompanhamento terapêutico para crianças e adolescentes com TDAH, focado no fortalecimento emocional e no dia a dia. Não realizo laudos nem diagnósticos. |
| 5 | Orientação para Pais | orientação para pais | aconselhamento para pais; como lidar com meu filho; apoio para mães | Orientação para você, mãe, entender e apoiar melhor o seu filho. Separadamente ou junto ao acompanhamento mensal. |
| 6 | TEA (Autismo): Apoio Emocional | psicanalista para criança com autismo | terapia para criança autista; como ajudar filho autista; apoio emocional TEA | Apoio emocional para crianças e adolescentes autistas e suas famílias, no ritmo de cada um. Trabalho de fortalecimento — não realizo laudos ou avaliações. |
| 7 | Terapia para Autoestima Infantil | terapia para baixa autoestima infantil | autoestima do adolescente; filha com baixa autoestima; como melhorar autoestima da criança | Quando a criança ou o adolescente se sente "menos que os outros", a terapia ajuda a reconstruir a autoestima com acolhimento e no tempo de cada um. |
| 8 | Terapia para Comportamento Infantil | terapia para problemas de comportamento infantil | criança com birra frequente; desobediência infantil o que fazer | Birras frequentes, desafios e conflitos em casa? A terapia ajuda a compreender o que o comportamento do seu filho comunica — sem rótulos. |
| 9 | Dificuldade de Relacionamento e Timidez | terapia para dificuldade de relacionamento na adolescência | criança tímida; ansiedade social infantil; filho sem amigos; criança que se sente sozinha | Timidez, dificuldade de fazer amigos ou sensação de solidão? A terapia ajuda crianças e adolescentes a se relacionarem com mais segurança. |

### H2 skeletons (SP3 writes the body copy under these)
- **1 Terapia infantil:** Como funciona a terapia infantil online · Quando procurar · O papel dos pais no processo · Como começar
- **2 Terapia adolescentes:** Desafios emocionais da adolescência · Como funciona online · Como os pais participam · Como começar
- **3 Ansiedade:** Sinais de ansiedade na infância e adolescência · *Crises de choro: o que podem estar comunicando* (fold-in) · Como a terapia ajuda · Como começar
- **4 TDAH:** Como o acompanhamento ajuda no TDAH · **O que este trabalho não é** (boundary FAQ) · O papel dos pais · Como começar
- **5 Orientação para pais:** O que é a orientação para pais · Quando ela ajuda · Avulsa ou no pacote mensal · Como começar
- **6 TEA:** Como é o apoio emocional no TEA · **O que este trabalho não inclui** (boundary FAQ) · Apoio à família · Como começar
- **7 Autoestima:** Sinais de baixa autoestima · Como a terapia fortalece · Como começar
- **8 Comportamento:** O que o comportamento pode estar comunicando · Como o trabalho ajuda (apoio em casa) · O papel dos pais · Como começar
- **9 Relacionamento/timidez:** Timidez × dificuldade de relacionamento · *Quando a solidão pede atenção* (fold-in) · Como a terapia ajuda · Como começar

### Fold-ins (no own URL)
- **crises de choro** → H2 within page 3 (ansiedade).
- **solidão infantil** → H2/FAQ within page 9 (relacionamento).

### Shared claim-boundary FAQ (pages 4 TDAH, 6 TEA, 8 comportamento; feeds FAQPage schema)
- **"Você faz diagnóstico ou emite laudo?"** → "Não realizo testes de rastreio, diagnósticos ou
  laudos. Meu trabalho é o fortalecimento emocional e o acompanhamento contínuo. Se você busca um
  laudo, o profissional indicado é um(a) neuropediatra ou psiquiatra."
- **"Atende por plano de saúde?"** → "Atualmente atendo apenas de forma particular." (reuses `faq.ts`.)

### Negative keywords (do NOT target; disclaim defensively via the FAQ)
Any **diagnóstico / laudo / teste / avaliação / plano de saúde** intent — especially TDAH
("teste de TDAH online", "laudo de TDAH", "avaliação neuropsicológica") and TEA ("laudo de autismo",
"laudo para escola/BPC", "diagnóstico de autismo"). Full list in the keyword-research doc §3.

## 3. Internal-linking architecture (hub-and-spoke)
Grounded in the live components (`Nav.tsx`, `StaticPage.tsx`, `Footer.tsx`, `App.tsx`).
- **Hub = home `#tratamentos` section.** SP1 rewrites those cards to Karoline's real
  conditions/services; **each card links to its `/atendimento/…` page** (SP3 wires the links once
  pages exist). Reuses the existing section as the hub — **no new index page, no top-nav change**
  (the Ads-landing header stays as-is beyond SP1's own edits).
- **Footer link list (new):** a compact "Como posso ajudar / Serviços" group linking all 9 pages —
  sitewide crawl path + internal links. Added in `Footer.tsx` (SP3).
- **Spoke-to-spoke cross-links:** every condition page links to the relevant service page
  (ansiedade/autoestima/comportamento → terapia-infantil + terapia-para-adolescentes) and to
  orientação-para-pais; service pages link to their top condition pages. Contextual, in-body.
- **Breadcrumb** Home › Atendimento › {Page} (visual + `BreadcrumbList` schema). "Atendimento"
  crumb points to the home `#tratamentos` hub anchor (no dedicated index page).

## 4. Structured data (JSON-LD)
**Verified:** `staticPageSeo()` returns no `jsonLd` today, so static pages emit none. SP3 extends
`staticPageSeo`/`StaticPage` to pass a `jsonLd` array to the existing `Seo` component.
- **BreadcrumbList** on all 9 pages.
- **FAQPage** on pages 4/6/8 (the boundary-FAQ pages), built via existing `faqPageJsonLd()`.
- *Optional/minor:* `Service` schema on the 3 service pages (provider = existing
  `professionalServiceJsonLd`). **No** medical/MedicalWebPage schema — she is not a medical provider.

## 5. Conversion tracking (REQUIREMENT — verified gotcha)
Ads conversion fires **only** through the React `<WhatsAppLink>` component
(`onClick={fireConversion}`). Static-page bodies are injected as **raw HTML** via
`dangerouslySetInnerHTML`, so a `<a>` written inside `pagesContent[slug]` **will not fire the
conversion**. Therefore:
- **`StaticPage` renders a standard `<WhatsAppLink href={WA.general}>` CTA below the `<article>`**
  (SP3, in `StaticPage.tsx`) → every page gets one guaranteed converting CTA outside the HTML blob.
- Any **in-body** CTA must use an inline `onclick` invoking the same gtag conversion (SP3 provides a
  documented snippet) — otherwise rely on the component CTA above.
- **Visitor webhook** already fires on every route via `RouteTracker` in `App.tsx` (verified) —
  no change needed for the new routes.
- *Optional:* per-page WhatsApp prefilled message for lead context — define per page or defer to SP3.

## 6. Sitemap
Automatic: `prerender.mjs` enumerates the manifest → `lib/sitemap.mjs`. Registering the 9 pages in
`manifest.json` ships them to the sitemap with no extra work (SP3).

## 7. Cross-sprint coupling (so nothing falls between sprints)
- **SP1** — rewrites the home `#tratamentos` cards (copy) → the hub spokes.
- **SP2** (this) — the taxonomy, keyword map, and linking/schema/tracking *architecture*.
- **SP3** — registers the 9 manifest entries; writes each body HTML (H2 skeletons + boundary FAQ);
  wires card→page links, footer links, cross-links; adds the `StaticPage` CTA + per-page JSON-LD;
  fixes the leftover *depressão/trauma* + "Terapia para Mulheres" residue if SP1 hasn't.

## 8. Out of scope (SP2)
No body copy (SP3), no blog articles (SP5 — informational ideas parked in keyword-research §5),
no geo/GMB (SP6), no authority/credentials (SP4), no card rewrites (SP1).

## 9. Open items
- **Child/teen age split:** pages 1 & 2 imply a boundary. Karoline stated 8–19 with no cut; pages
  keep "crianças" vs "adolescentes" without hard sub-ages unless she specifies (e.g. ~8–12 / 13–19).
- **Meta descriptions** are drafts pending Karoline's tone check; the *claims* within them are fixed.
- **"Rel. demand"** in the keyword research is directional (no volume tool), a prioritization signal
  only — revisit if real volume data becomes available (could refine the P0/P1/P2 tiers).
