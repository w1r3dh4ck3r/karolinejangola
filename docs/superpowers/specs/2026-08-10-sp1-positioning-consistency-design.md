# SP1 — Positioning Consistency (design spec)

**Date:** 2026-08-10
**Sprint:** SP1 of the SEO program (SP0 shipped; SP2 speced; SP3 planned).
**Type:** copy-consistency edit across data files + one blog post. No logic/architecture changes.

## Goal

Remove every women/adult leftover so the whole site matches the locked positioning:
**children & adolescents (8–19 years), reader = the mother/guardian addressed in female
grammar**, and honor Karoline's hard claim boundary (no diagnóstico / laudo / testes de
rastreio / planos de saúde — see `docs/reference/practice-facts.md`).

## Constraints

- **Female-grammar rule targets the mother-reader.** The *child* stays `seu filho ou filha`
  (a patient can be a boy) — do NOT force feminine adjectives onto the child, only onto the
  mother where she is directly addressed.
- **Claim boundary is hard.** No page/card/meta may claim or imply diagnosis, screening,
  laudo, or insurance. TDAH/TEA copy = *acompanhamento e fortalecimento emocional*, never
  assessment.
- **Conditions she works with** (authoritative, `practice-facts.md`): ansiedade · dificuldade
  nos relacionamentos · TDAH · TEA (autismo) · comportamento · crises de choro · autoestima ·
  solidão. **Depressão and Trauma are NOT hers** — remove them everywhere.
- Card body copy is **DRAFT** — Karoline tone-checks the wording; the claims/scope are locked.

## Changes

### 1. `app/src/data/treatments.ts` — replace all 5 cards (same 5 icons)

Drops the Depressão and Trauma cards; rebuilds the set around her real conditions. All 8
conditions are folded across the 5 cards. Icons unchanged (`heart`, `brain`, `users`, `leaf`,
`sparkles`) so this is a pure content swap — no `IconName` change.

1. `heart` — **Ansiedade**
   > Medos, preocupação constante, dificuldade para dormir ou crises de choro — a ansiedade fala alto na infância e adolescência. Acompanho seu filho ou filha para reconhecer e lidar com esses sentimentos, no tempo de cada um.
2. `brain` — **TDAH**
   > Um acompanhamento voltado ao fortalecimento emocional de crianças e adolescentes com TDAH — não faço diagnóstico nem laudo. Como mãe de um filho com TDAH, conheço de perto esses desafios e caminho junto com a sua família.
3. `users` — **Relacionamentos e vida social**
   > Dificuldade para fazer amigos, conflitos em casa ou na escola, sensação de solidão — as relações moldam o mundo emocional de crianças e adolescentes. Trabalho para que seu filho ou filha construa vínculos mais seguros no dia a dia.
4. `leaf` — **TEA (autismo)**
   > Apoio ao desenvolvimento e ao fortalecimento emocional de crianças e adolescentes autistas, sempre respeitando o ritmo de cada um. Não realizo testes nem emito laudo; meu foco é acolher e caminhar junto. Sou mãe de uma filha com TEA.
5. `sparkles` — **Autoestima e comportamento**
   > Baixa autoestima, mudanças de comportamento, insegurança — sinais de que algo pede acolhimento. Ajudo seu filho ou filha a reconhecer o próprio valor e a expressar o que sente de forma saudável.

Coverage check: ansiedade (1) · crises de choro (1) · TDAH (2) · relacionamentos (3) ·
solidão (3) · TEA (4) · autoestima (5) · comportamento (5). All 8 present.

### 2. `app/src/data/seo.ts` — four edits

- **`serviceType`** (l.30): drop `"Terapia para Mulheres"`, add `"Terapia para Adolescentes"`:
  `['Psicanálise', 'Terapia Online', 'Terapia Infantil', 'Terapia para Adolescentes']`
- **`founder.knowsAbout`** (l.47): drop `'Depressão'`, `'Trauma'`:
  `['Psicanálise', 'Ansiedade', 'TDAH', 'TEA', 'Autoestima', 'Comportamento', 'Terapia Infantil']`
- **`professionalServiceJsonLd.description`** (l.20):
  > Psicanalista e terapeuta online especializada em crianças e adolescentes. Acompanhamento de ansiedade, TDAH, TEA, autoestima e dificuldades emocionais e comportamentais.
- **`homeSeo.description`** (l.76) **and its identical `og.description`** (l.85) — both must
  stay identical (the `Seo` component writes `description` verbatim to meta/og/twitter):
  > Psicanalista e terapeuta online especializada em crianças e adolescentes. Acompanhamento de ansiedade, TDAH, TEA, autoestima e dificuldades emocionais e comportamentais. Atendimento online para o Brasil e brasileiros no exterior.

### 3. `app/src/data/faq.ts` — Q5 answer (l.25)

Drop "depressão, traumas"; add the concrete 8–19 range. Also updates the FAQPage JSON-LD
(built from the same `faq` array).
> Atendo crianças e adolescentes de 8 a 19 anos. Trabalho com questões como ansiedade, TDAH, TEA, autoestima, dificuldades nos relacionamentos e desafios emocionais e comportamentais da infância e adolescência.

### 4. `app/src/data/blog/como-saber-se-preciso-de-terapia.ts` — worst-lines scrub only

Mark's decision: scrub the overtly-adult passages now; a full child-reframe of this post is
deferred to SP5 (**residual mismatch flagged, not fixed here** — the post remains an adult
self-referral piece overall).

- §3 (l.22–23) → replace adult examples (parceiro / ambiente de trabalho / relações adultas):
  > Conflitos frequentes em casa, distanciamento de amigos ou dificuldades na escola podem indicar padrões relacionais que merecem ser explorados. Muitas vezes, repetimos em nossas relações dinâmicas que aprendemos ao longo da vida — e a terapia é o espaço ideal para compreender e transformar esses padrões.
- §7 (l.35) → drop "em um relacionamento, em um trabalho":
  > Essa sensação de estar preso — em uma rotina, em um modo de ser — é um dos motivos mais comuns que levam as pessoas à terapia.

## Deliberately NOT changing

- **Hero H1 (`content.ts` l.64) and BlogCta "…sozinha"** — correct female grammar for the
  mother-reader; the body already frames it as therapy *for the child*, addressed to the
  worried mother. This **overrides the stale SESSION-STATE "reframe hero H1" note**, which
  predates the finalized mother-reader decision.
- **Testimonials (`testimonials.ts`)** — Mark chose keep-for-now. The two `role: 'Paciente
  adulta'` labels stay as an **accepted, known** inconsistency (the quotes are real adult-women
  quotes and cannot be honestly relabeled). Revisit when Karoline supplies child-client
  testimonials.
- `content.ts` `sobre` / `paraQuem` — already rewritten to child/adolescent + mother-reader in
  a prior sprint; clean.
- `seo.ts` `blogIndexSeo` "artigos sobre psicologia" — topic word, not the CRP-protected title
  "psicólogo/a"; blog-index copy is SP5's domain. Noted, not touched.

## Verification

1. `cd app && npm run build` exit 0.
2. `cd app && npx vitest run` — all pass (update any test that asserts an old string; check
   before editing whether tests pin these strings).
3. Grep the **changed data files** (`treatments.ts`, `seo.ts`, `faq.ts`): **zero**
   `depressão`/`Depressão`/`trauma`/`Trauma`/`Mulheres`; new conditions (`TDAH`, `TEA`,
   `Autoestima`) present in cards + JSON-LD. NB: the blog post §4 intentionally retains the
   word "depressão" (educational sign, SP5-deferred) — do NOT grep the whole `dist/` for it and
   false-alarm; scope the check to the SP1-changed files.
4. Revenue/deploy invariants intact (not in scope, re-assert after build): gtag `AW-16583121961`
   + conversion label, Formspree `f/xeevlzlb`, n8n webhook, `.nojekyll`, `CNAME`=apex, apex
   canonical.
5. **Gemini adversarial gate** (kickoff hard rule) — blocking; sprint is not done until Gemini
   clears it.

## Out of scope (later sprints)

- Full child-reframe of the blog post → SP5.
- Child-client testimonials → whenever Karoline provides them.
- `/atendimento/` service pages → SP3.
