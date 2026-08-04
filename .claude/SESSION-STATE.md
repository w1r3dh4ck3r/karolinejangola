# SESSION-STATE

## Current Task
DONE + LIVE: source reconstruction (React 18 + Vite + TS + Tailwind under `app/`), the 3 content changes, and the children-&-adolescents repositioning (no women). All pushed to `origin/main` and deployed on karolinejangola.com.

## Key facts
- Source `app/src/`; content in `app/src/data/`. Build `cd app && npm run build` → `app/dist/`; `npm run publish:site` → repo root (GitHub Pages serves root). Needs `npx playwright install chromium`.
- **Keep `.nojekyll` at root forever** — GitHub Pages runs Jekyll otherwise and fails on `{{ }}` in docs. `publish.mjs` has a `.nojekyll` copy carve-out (its dotfile denylist otherwise half-deletes root).
- Deploy = `git push` of `main` = LIVE. Site runs Google Ads. If a push doesn't go live, check `gh api repos/w1r3dh4ck3r/karolinejangola/pages` status; POST `.../pages/builds` to force.
- Positioning is now **children & adolescents only** (no women). Fonts DM Serif Display/DM Sans; sage/terracotta.

## Last Action
www TLS (2026-08-04): GitHub Support gave a canned "read the articles" non-answer; ticket effectively stalled. Re-verified LIVE state: Pages cert STILL `dns_changed`/"Requesting a new certificate", `domains:['karolinejangola.com']` (www never added) — unchanged 3 days. DNS still clean (apex→4 Pages IPs, no AAAA/CNAME/CAA; www→github.io CNAME inherits github.io CAA authorizing letsencrypt.org). Apex serves valid LE cert (SAN apex-only); www serves *.github.io fallback → warning. **Found an in-our-control bug the earlier sessions missed: SEO canonical/`SITE_URL` was `https://www.karolinejangola.com` (the BROKEN host) while CNAME/Pages primary = apex.** FIXED locally: `SITE_URL` (seo.ts:6) + 4 index.html literals (canonical/og:url/og:image/twitter:image) → apex. Built + published, served root has ZERO www, canonical now `https://karolinejangola.com`, `.nojekyll` intact. This does NOT touch CNAME/publish.mjs guard/Pages primary — the forbidden "www-primary flip" was NOT done. **PUSHED + LIVE** (commit `79ed3df`, Pages build `built`, live apex homepage verified serving apex canonical + og:url). Mark's decisions: (a) pushed the fix; (b) **Google Ads point at the APEX** → www breakage is LOW-severity (paid traffic unaffected; only manual www typers hit the warning); (c) cert path = **press the GitHub ticket**. Escalation reply drafted at `docs/github-support-www-cert-escalation.md` for Mark to paste into the existing ticket thread.

## Last Action (prior — 2026-08-01)
www TLS (2026-08-01): unstick attempt + research. Removed+re-added Pages custom domain via API + forced build → cleared a `status: errored` build state (old Jekyll leftover) that likely blocked provisioning. Ruled out client-side causes: DNS clean (apex→4 Pages IPs, no AAAA/stray CNAME; www→github.io CNAME), CAA authorizes letsencrypt.org. Cert STILL `dns_changed`/apex-only. **Research (primary GitHub sources) found this matches an ACTIVE 2026 GitHub Pages backend bug (July 19–20 incident; community discussions #202318, #200447): provisioning job stalls before starting the LE request; state is DOMAIN-scoped, so www-primary flip is NOT confirmed to help and risks mirroring the bug onto the apex.** Staff say STOP removing/re-adding (resets timer) and open GitHub Support. DECISION (Mark): hold the www flip. Built the flip locally then REVERTED it (working tree clean, apex config intact). **DONE: Mark FILED the GitHub Support ticket 2026-08-01 ~17:00** (repo w1r3dh4ck3r/karolinejangola, category "Repository features/Branches" — portal has no Pages category; GitHub's own AI triage confirmed DNS is correct + no self-service fix exists). Now WAITING on GitHub Support reply.

## Next Step (all Mark's; none blocking)
- Mark rewrites the 5 treatments cards; swap the 2 adult-women testimonials (Ana Carolina, Lívia).
- Female-grammar call: hero H1 "…sozinha" still female-addressed; decide mothers vs neutral parent. `CLAUDE.md` female-grammar rule left pending.
- www TLS (2026-08-04): GitHub Support gave a canned non-answer; **Mark to PASTE the escalation reply** (`docs/github-support-www-cert-escalation.md`) into the existing ticket thread demanding escalation to the Pages team. Still a GitHub backend provisioning bug, NOT client-side — DNS+CAA verified clean, cert stuck `dns_changed`/apex-only 3+ days. **Ads point at the APEX, so this is LOW-severity** — apex is valid/safe, paid traffic unaffected; only manual www typers see the warning, and canonical no longer points at www. **Do NOT flip to www-primary and do NOT remove/re-add again** (domain-scoped bug, cycling resets GitHub's timer + risks the apex). Fallback if the ticket dies: Cloudflare-in-front (Mark deferred it — apex works, not worth the infra change now). Re-check periodically: `gh api repos/w1r3dh4ck3r/karolinejangola/pages` (want cert `domains` to include www) and `echo \| openssl s_client -servername www.karolinejangola.com -connect www.karolinejangola.com:443 \| openssl x509 -noout -subject` (want CN=www or apex SAN incl. www).

## Files to touch next
- Treatments: `app/src/data/treatments.ts` (+ `Tratamentos.tsx` if layout). Testimonials: `app/src/data/testimonials.ts`.
- After edits: `cd app && npm run build && npm run publish:site`, then `approved-push main`.
- Note: JSON-LD `serviceType` in `seo.ts:29` still lists "Terapia para Mulheres" — a repositioning leftover; flag/remove when touching content.

<!-- session-state-sync: last written by session 4863060e at 2026-08-01 17:00:15 -0300 -->
