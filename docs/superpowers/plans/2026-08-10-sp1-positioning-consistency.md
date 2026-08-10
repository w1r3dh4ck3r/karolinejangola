# SP1 — Positioning Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove every women/adult leftover from the site's content surfaces so the whole site matches the locked positioning — children & adolescents (8–19), reader = mother/guardian in female grammar — and add a durable guard test so it can't regress.

**Architecture:** Pure content edits in four `app/src/data/` files (no logic/architecture change), fronted by a new vitest positioning-invariant test that fails on the current copy and passes once the edits land. Then build + publish + verify revenue/deploy invariants locally.

**Tech Stack:** React 18 + Vite + TypeScript + Tailwind; vitest; content lives in `app/src/data/`.

## Global Constraints

- Positioning = **children & adolescents only (8–19)**; reader = **the mother/guardian, female grammar**. The rule targets the mother-reader — the *child* stays `seu filho ou filha`; never force feminine adjectives onto the child.
- **Hard claim boundary** (`docs/reference/practice-facts.md`): no page/card/meta may claim or imply diagnóstico, laudo, testes de rastreio, or planos de saúde. TDAH/TEA copy = *acompanhamento e fortalecimento emocional* only.
- **Depressão and Trauma are NOT conditions Karoline treats** — remove them from every content surface.
- Card body copy is **DRAFT** — Karoline tone-checks wording; claims/scope are locked.
- Source spec: `docs/superpowers/specs/2026-08-10-sp1-positioning-consistency-design.md`.
- Preserve verbatim (out of scope, re-assert after build): gtag `AW-16583121961` + conversion label, Formspree `f/xeevlzlb`, n8n webhook, `.nojekyll`, `CNAME`=apex, apex canonical.
- Run everything from `app/`. `git commit` steps only — **no push** (push + Gemini gate happen after the plan, at the kickoff gate, with Mark's approval).

---

### Task 1: Positioning guard test + data-file copy edits (treatments, seo, faq)

Bundled because they share one invariant and one failing test: remove women/adult framing and the non-treated conditions, add the real ones. A reviewer accepts/rejects them as one positioning change.

**Files:**
- Create: `app/src/data/positioning.test.ts`
- Modify: `app/src/data/treatments.ts` (replace all 5 cards)
- Modify: `app/src/data/seo.ts` (l.20 description, l.30 serviceType, l.47 knowsAbout, l.76+l.85 homeSeo description)
- Modify: `app/src/data/faq.ts` (Q5 answer, l.25)

**Interfaces:**
- Consumes: `treatments` (`Treatment[]`), `faq` (`FaqItem[]`), `professionalServiceJsonLd`, `homeSeo` — all existing exports, unchanged signatures.
- Produces: nothing new for later tasks (content-only). `homeSeo.og.description` must stay identical to `homeSeo.description`.

- [ ] **Step 1: Write the failing test** — `app/src/data/positioning.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { treatments } from './treatments'
import { faq } from './faq'
import { professionalServiceJsonLd, homeSeo } from './seo'

// SP1 invariant: the practice targets children & adolescents only. These core
// content surfaces must never reintroduce adult-women framing or conditions
// Karoline does not treat. See docs/reference/practice-facts.md.
const FORBIDDEN = [/depress/i, /trauma/i, /mulher/i]

function coreSurfaceText(): string {
  return [
    ...treatments.flatMap((t) => [t.title, t.body]),
    ...faq.flatMap((f) => [f.q, f.a]),
    professionalServiceJsonLd.description,
    professionalServiceJsonLd.serviceType.join(' '),
    professionalServiceJsonLd.founder.knowsAbout.join(' '),
    homeSeo.description,
    homeSeo.og?.description ?? '',
  ].join(' \n ')
}

describe('SP1 positioning invariants', () => {
  it('has no adult-women / non-treated-condition terms in the core content surfaces', () => {
    const text = coreSurfaceText()
    for (const term of FORBIDDEN) {
      expect(text).not.toMatch(term)
    }
  })

  it('advertises the real child/adolescent conditions', () => {
    const titles = treatments.map((t) => t.title).join(' ')
    expect(titles).toMatch(/TDAH/)
    expect(titles).toMatch(/TEA/)
    expect(professionalServiceJsonLd.serviceType).toContain('Terapia para Adolescentes')
    expect(professionalServiceJsonLd.founder.knowsAbout).toEqual(
      expect.arrayContaining(['TDAH', 'TEA', 'Autoestima']),
    )
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npx vitest run src/data/positioning.test.ts`
Expected: FAIL — current `treatments.ts`/`seo.ts`/`faq.ts` still contain Depressão/Trauma/Mulheres, and titles lack TDAH/TEA.

- [ ] **Step 3: Replace all 5 cards in `app/src/data/treatments.ts`**

Replace the entire `treatments` array body (icons unchanged) with:

```ts
export const treatments: Treatment[] = [
  {
    icon: 'heart',
    title: 'Ansiedade',
    body: 'Medos, preocupação constante, dificuldade para dormir ou crises de choro — a ansiedade fala alto na infância e adolescência. Acompanho seu filho ou filha para reconhecer e lidar com esses sentimentos, no tempo de cada um.',
  },
  {
    icon: 'brain',
    title: 'TDAH',
    body: 'Um acompanhamento voltado ao fortalecimento emocional de crianças e adolescentes com TDAH — não faço diagnóstico nem laudo. Como mãe de um filho com TDAH, conheço de perto esses desafios e caminho junto com a sua família.',
  },
  {
    icon: 'users',
    title: 'Relacionamentos e vida social',
    body: 'Dificuldade para fazer amigos, conflitos em casa ou na escola, sensação de solidão — as relações moldam o mundo emocional de crianças e adolescentes. Trabalho para que seu filho ou filha construa vínculos mais seguros no dia a dia.',
  },
  {
    icon: 'leaf',
    title: 'TEA (autismo)',
    body: 'Apoio ao desenvolvimento e ao fortalecimento emocional de crianças e adolescentes autistas, sempre respeitando o ritmo de cada um. Não realizo testes nem emito laudo; meu foco é acolher e caminhar junto. Sou mãe de uma filha com TEA.',
  },
  {
    icon: 'sparkles',
    title: 'Autoestima e comportamento',
    body: 'Baixa autoestima, mudanças de comportamento, insegurança — sinais de que algo pede acolhimento. Ajudo seu filho ou filha a reconhecer o próprio valor e a expressar o que sente de forma saudável.',
  },
]
```

- [ ] **Step 4: Apply the four `app/src/data/seo.ts` edits**

1. `professionalServiceJsonLd.description` (l.20) →
   `'Psicanalista e terapeuta online especializada em crianças e adolescentes. Acompanhamento de ansiedade, TDAH, TEA, autoestima e dificuldades emocionais e comportamentais.'`
2. `serviceType` (l.30) →
   `['Psicanálise', 'Terapia Online', 'Terapia Infantil', 'Terapia para Adolescentes']`
3. `founder.knowsAbout` (l.47) →
   `['Psicanálise', 'Ansiedade', 'TDAH', 'TEA', 'Autoestima', 'Comportamento', 'Terapia Infantil']`
4. `homeSeo.description` (l.76) **and** `homeSeo.og.description` (l.85) — both to the identical string:
   `'Psicanalista e terapeuta online especializada em crianças e adolescentes. Acompanhamento de ansiedade, TDAH, TEA, autoestima e dificuldades emocionais e comportamentais. Atendimento online para o Brasil e brasileiros no exterior.'`

- [ ] **Step 5: Edit the Q5 answer in `app/src/data/faq.ts`** (l.25)

Replace the "Para quem é indicado o seu atendimento?" answer with:
```ts
    a: 'Atendo crianças e adolescentes de 8 a 19 anos. Trabalho com questões como ansiedade, TDAH, TEA, autoestima, dificuldades nos relacionamentos e desafios emocionais e comportamentais da infância e adolescência.',
```

- [ ] **Step 6: Run the guard test + typecheck**

Run: `cd app && npx vitest run src/data/positioning.test.ts && npm run build:app`
Expected: test PASS (both cases); `tsc -b && vite build` exit 0.

- [ ] **Step 7: Commit**

```bash
git add app/src/data/positioning.test.ts app/src/data/treatments.ts app/src/data/seo.ts app/src/data/faq.ts
git commit -m "feat(sp1): scrub women/adult leftovers from cards, seo, faq + guard test"
```

---

### Task 2: Blog worst-lines scrub

Separate deliverable and separate decision (Mark: "fix the worst lines", full reframe deferred to SP5). A reviewer could accept Task 1 but want a different blog approach.

**Files:**
- Create: `app/src/data/blog/como-saber-se-preciso-de-terapia.test.ts`
- Modify: `app/src/data/blog/como-saber-se-preciso-de-terapia.ts` (§3 and §7 paragraphs)

**Interfaces:**
- Consumes: `comoSaberSePrecisoDeTerapia` (`BlogPost`, existing export).
- Produces: nothing.

- [ ] **Step 1: Write the failing test** — `app/src/data/blog/como-saber-se-preciso-de-terapia.test.ts`

```ts
import { describe, it, expect } from 'vitest'
import { comoSaberSePrecisoDeTerapia } from './como-saber-se-preciso-de-terapia'

// SP1: scrub the overtly-adult passages (§3, §7). A full child-reframe of this
// post is SP5; §4's educational "depressão" is intentionally retained.
describe('como-saber-se-preciso-de-terapia — adult-framing scrub', () => {
  const html = comoSaberSePrecisoDeTerapia.bodyHtml
  for (const term of [/parceiro/i, /ambiente de trabalho/i, /relações adultas/i, /em um trabalho/i]) {
    it(`no longer contains ${term}`, () => {
      expect(html).not.toMatch(term)
    })
  }
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `cd app && npx vitest run src/data/blog/como-saber-se-preciso-de-terapia.test.ts`
Expected: FAIL — §3 has "parceiro"/"ambiente de trabalho"/"relações adultas", §7 has "em um trabalho".

- [ ] **Step 3: Edit §3** (the `<h2>3. Conflitos frequentes nos relacionamentos</h2>` paragraph)

Replace that `<p>…</p>` with:
```html
<p>Conflitos frequentes em casa, distanciamento de amigos ou dificuldades na escola podem indicar padrões relacionais que merecem ser explorados. Muitas vezes, repetimos em nossas relações dinâmicas que aprendemos ao longo da vida — e a terapia é o espaço ideal para compreender e transformar esses padrões.</p>
```

- [ ] **Step 4: Edit §7** (the `<h2>7. Sensação de estar "travado" na vida</h2>` paragraph)

Change `— em um relacionamento, em um trabalho, em um modo de ser —` to `— em uma rotina, em um modo de ser —`, so the sentence reads:
```html
<p>Você sente que está girando em círculos, tomando as mesmas decisões, caindo nos mesmos padrões? Essa sensação de estar preso — em uma rotina, em um modo de ser — é um dos motivos mais comuns que levam as pessoas à terapia. E um dos mais transformáveis.</p>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `cd app && npx vitest run src/data/blog/como-saber-se-preciso-de-terapia.test.ts`
Expected: PASS (all four cases).

- [ ] **Step 6: Commit**

```bash
git add app/src/data/blog/como-saber-se-preciso-de-terapia.test.ts app/src/data/blog/como-saber-se-preciso-de-terapia.ts
git commit -m "fix(sp1): scrub overtly-adult lines from como-saber blog post (SP5 does full reframe)"
```

---

### Task 3: Full build, publish, and invariant verification

Cross-cutting verification of the whole change set before it's declared done. No new code — runs the real build/publish and asserts nothing revenue/deploy-critical moved.

**Files:** none modified (regenerates repo-root published files via `publish:site`).

- [ ] **Step 1: Full test suite + build**

Run: `cd app && npx vitest run && npm run build`
Expected: all tests PASS; `tsc -b && vite build && node scripts/prerender.mjs` exit 0. (Prerender needs chromium once: `npx playwright install chromium`.)

- [ ] **Step 2: Publish to repo root**

Run: `cd app && npm run publish:site`
Expected: exit 0.

- [ ] **Step 3: Verify positioning in the changed data files (scoped, per spec)**

Run:
```bash
cd app && ! grep -riE 'depress|trauma|mulheres' src/data/treatments.ts src/data/seo.ts src/data/faq.ts && grep -q 'TDAH' src/data/treatments.ts && echo OK-positioning
```
Expected: prints `OK-positioning`. (Do NOT grep all of `dist/` for "depressão" — the blog §4 keeps it intentionally.)

- [ ] **Step 4: Re-assert revenue/deploy invariants in the published root**

Run:
```bash
cd .. && grep -rq 'AW-16583121961' assets/*.js && grep -rq 'xeevlzlb' assets/*.js && test -f .nojekyll && grep -q 'karolinejangola.com' CNAME && grep -q 'rel="canonical" href="https://karolinejangola.com"' index.html && echo OK-invariants
```
Expected: prints `OK-invariants`.

- [ ] **Step 5: Commit the published output**

```bash
git add -A
git commit -m "build(sp1): publish positioning-consistency copy"
```

---

## Post-plan (kickoff gate — controller, with Mark's approval)

1. **Gemini adversarial review gate** (blocking, kickoff hard rule) — package spec + plan + changed files, send via `gemini-review`, address findings, re-run until cleared.
2. On Gemini clearance + Mark's push approval: `approved-push main` → verify GitHub Pages build `built` → live-verify apex homepage serves the new copy.

## Self-Review

- **Spec coverage:** treatments 5 cards → Task 1 Step 3 ✓; seo 4 edits → Task 1 Step 4 ✓; faq Q5 → Task 1 Step 5 ✓; blog §3/§7 → Task 2 ✓; "not changing" (hero, testimonials) → no task touches them ✓; verification (build/test/grep/invariants/Gemini) → Task 3 + Post-plan ✓.
- **Placeholder scan:** none — all copy strings and test code are literal.
- **Type consistency:** test imports match existing exports (`treatments: Treatment[]`, `faq: FaqItem[]`, `professionalServiceJsonLd`, `homeSeo` with `og.description`); no new types introduced.
