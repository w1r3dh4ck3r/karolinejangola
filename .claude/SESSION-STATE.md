# SESSION-STATE

## Current Task (2026-09-11 — SP6 local/AI-search STARTED)
GEO/AEO push: make Karoline appear in ChatGPT/AI local recommendations. Real practice city confirmed = **Vila Velha/ES** (online-only, service-area business — no consultório). On-site done this session: added `address` (locality Vila Velha / region ES / country BR) + expanded `areaServed` (Vila Velha→Grande Vitória→ES→Brasil) to `ProfessionalService` JSON-LD in `app/src/data/seo.ts`. Tests 30/30 green. **DEPLOYED + LIVE-verified** (`c0ab193`; served JSON-LD shows `addressLocality:Vila Velha`, `addressRegion:ES`). PT-BR off-site task list for Karoline written to `docs/reference/tarefas-karoline-busca-ia.md`. Key finding: ChatGPT local results run live-Bing crawl of directories+reviews, so biggest levers are OFF-site (Bing Places, GBP, real reviews) — those need Karoline. Phone `+55-79` confirmed correct for now; DDD-27 (ES) number transition planned (redo site + NAP together then).

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
- **Practice city = Vila Velha/ES** (confirmed 2026-09-11); online-only, service-area business (no consultório/presencial). Phone `+55-79-9649-1276` confirmed correct for now; Karoline transitioning to a DDD-27 (ES) number soon → when it changes, update `seo.ts` telephone + ALL listings together (NAP). Memory: [[practice-city-vila-velha-es]].

## Last Action
SP6 DEPLOYED: (1) Bing ownership file `BingSiteAuth.xml` (token 785CA5…57AF) at root + `app/public/`, pushed `422b980`, LIVE-verified (HTTP 200) — Mark verified in BWT + submitted sitemap. (2) Vila Velha/ES local signals in `seo.ts` JSON-LD (address + areaServed) — opus reviewer GO, build+publish PASS, rebuilt root artifacts + PT-BR doc committed, pushed `c0ab193`. LIVE-verified: served home JSON-LD shows `addressLocality:Vila Velha`/`addressRegion:ES`.

## Next Step (SP6)
- On-site DONE ✅ (Bing verification file + Vila Velha/ES JSON-LD both live). Remaining is off-site (Karoline) + a few optional technical adds.
- **Off-site (Karoline, from the PT-BR doc):** Bing Places + Google Meu Negócio (service-area, Vila Velha, hide address), real reviews, NAP consistency, directory eligibility check (psicanalista ≠ CRP psicóloga). Phone: use current `+55-79` in listings now (matches site); redo NAP + `seo.ts` telephone together when the DDD-27 number is live.
- **Technical follow-ups:** AI-crawler reachability ✅ VERIFIED 2026-09-11 (bingbot/OAI-SearchBot/GPTBot/PerplexityBot all HTTP 200 + full prerendered HTML; robots open; live sitemap 14 URLs; Breadcrumb+FAQPage JSON-LD present on live pages). Bing submission is human-gated: no Bing/MS creds in secrets, BWT needs a Microsoft-account login + ownership verify (offer GSC-import shortcut, or drop `BingSiteAuth.xml` token file once they supply the token). Anonymous Bing sitemap-ping is deprecated → IndexNow is the only account-free Bing nudge (stage `<key>.txt` at root + submit script, deploys with next push). Add GBP/Bing `sameAs` URLs to seo.ts once those profiles exist. Optional: subtle visible "Vila Velha/ES · atendimento online" line (needs copy/review gate + Karoline's ok on public framing).

## Old Next Step
- **Karoline tone-pass** the 9 page drafts (claims LOCKED, wording soft). Deferred-minors to raise: recurring closer "…seguirmos juntas"; "[noun] acontece(m) por videochamada" ×2; comportamento hedged "muitas vezes…o alívio aparece primeiro"; autoestima dropped a SECONDARY kw "como melhorar a autoestima da criança"; footer heading "Como posso ajudar" echoes the home Tratamentos eyebrow; 8-word phrase "caminha junto do acompanhamento do seu filho ou filha" recurs ×3 (under the 12-word threshold).
- **Next sprint:** SP4 (authority — BLOCKED on Mark's real credentials) or SP5 (blog engine + deferred blog-body depressão/psicólogo reframe + a guard tripwire for the TDAH/TEA disclaimer text).
- **Carried, low-priority:** Mark once asked for a pt-BR "improvements" summary to Telegram; the bridge was disconnected, delivered in chat instead. Re-raise only if wanted.

## Files to touch next
- Depends on the next sprint. SP5 → `app/src/data/blog/*.ts` (blog reframe). SP4 → `seo.ts` + an authority/credentials surface (needs Mark's real creds first).

<!-- session-state-sync: last written by session 2da30da8 at 2026-09-11 19:27:28 -0300 -->
