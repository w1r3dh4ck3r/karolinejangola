# SESSION-STATE

## Current Task (2026-08-10 — SP3 DONE, DEPLOYED + LIVE ✅)
SP3 (9 `/atendimento/` pages) built via SDD, deployed + live-verified on karolinejangola.com (deploy commit `38dc741`, Pages `built`). 3 service + 6 condition pages under fixed root `/atendimento/`, each prerendered w/ apex canonical + BreadcrumbList; FAQPage + verbatim boundary FAQ on tdah/tea/comportamento; visible breadcrumb + tracked `<WhatsAppLink>` CTA; home cards→pages links; footer links all 9. VERIFIED ALL GREEN (30/30 tests; revenue constants intact; forbidden-term sweep clean; live-curl pass; **Gemini gate CLEARED**). Full detail: notes.md `2026-08-10 — SP3` entry.

## Key facts
- Source `app/src/`, content in `app/src/data/`. Build `cd app && npm run build` → `app/dist/`; `npm run publish:site` copies dist → repo root (Pages serves root); needs `npx playwright install chromium` once.
- Deploy = build + publish:site + commit root artifacts + `approved-push main` = LIVE (Ads site). Pages status: `gh api repos/w1r3dh4ck3r/karolinejangola/pages`.
- **Keep `.nojekyll` at root forever** (else Jekyll fails on `{{ }}`; publish.mjs has a carve-out).
- Positioning: **children & adolescents only** (no women). Reader = mother in female grammar; child = "seu filho ou filha"; mixed group "crianças e adolescentes" = masculine-neutral. Credential psicanalista/terapeuta, NEVER "psicólogo/a" (CRP). No diagnóstico/laudo/teste/plano claims. Fonts DM Serif Display/DM Sans; sage/terracotta.
- The 9 `/atendimento/` pages live in `app/src/data/pages/{manifest.json,content.ts}`; boundary FAQ in `pages/faq.ts`; JSON-LD in `seo.ts`; render in `StaticPage.tsx`.
- SEO program: SP0✅ SP1✅ SP2✅ SP3✅ → SP4 authority → SP5 blog → SP6 local → SP7 lead magnet → SP8 CWV.
- www TLS: FULLY RESOLVED (apex+www cert, HTTPS enforced). Nothing outstanding.

## Last Action
SP3 deployed (`38dc741`) + live-verified + Gemini-cleared. Wrap-up: branch/SDD-workspace deleted, notes.md pre-2026-08-07 archived to `docs/notes-archive.md`, SDD lessons saved to memory.

## Next Step
- **Karoline tone-pass** the 9 page drafts (claims LOCKED, wording soft). Deferred-minors to raise: recurring closer "…seguirmos juntas"; "[noun] acontece(m) por videochamada" ×2; comportamento hedged "muitas vezes…o alívio aparece primeiro"; autoestima dropped a SECONDARY kw "como melhorar a autoestima da criança"; footer heading "Como posso ajudar" echoes the home Tratamentos eyebrow; 8-word phrase "caminha junto do acompanhamento do seu filho ou filha" recurs ×3 (under the 12-word threshold).
- **Next sprint:** SP4 (authority — BLOCKED on Mark's real credentials) or SP5 (blog engine + deferred blog-body depressão/psicólogo reframe + a guard tripwire for the TDAH/TEA disclaimer text).
- **Carried, low-priority:** Mark once asked for a pt-BR "improvements" summary to Telegram; the bridge was disconnected, delivered in chat instead. Re-raise only if wanted.

## Files to touch next
- Depends on the next sprint. SP5 → `app/src/data/blog/*.ts` (blog reframe). SP4 → `seo.ts` + an authority/credentials surface (needs Mark's real creds first).

<!-- session-state-sync: last written by session 46fae98d at 2026-08-10 21:42:51 -0300 -->
