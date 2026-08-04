# SESSION-STATE

## Current Task
DONE + LIVE: source reconstruction (React 18 + Vite + TS + Tailwind under `app/`), the 3 content changes, and the children-&-adolescents repositioning (no women). All pushed to `origin/main` and deployed on karolinejangola.com.

## Key facts
- Source `app/src/`; content in `app/src/data/`. Build `cd app && npm run build` → `app/dist/`; `npm run publish:site` → repo root (GitHub Pages serves root). Needs `npx playwright install chromium`.
- **Keep `.nojekyll` at root forever** — GitHub Pages runs Jekyll otherwise and fails on `{{ }}` in docs. `publish.mjs` has a `.nojekyll` copy carve-out (its dotfile denylist otherwise half-deletes root).
- Deploy = `git push` of `main` = LIVE. Site runs Google Ads. If a push doesn't go live, check `gh api repos/w1r3dh4ck3r/karolinejangola/pages` status; POST `.../pages/builds` to force.
- Positioning is now **children & adolescents only** (no women). Fonts DM Serif Display/DM Sans; sage/terracotta.

## Last Action
www TLS (2026-08-04): GitHub Support gave a canned "read the articles" non-answer; ticket effectively stalled. Re-verified LIVE state: Pages cert STILL `dns_changed`/"Requesting a new certificate", `domains:['karolinejangola.com']` (www never added) — unchanged 3 days. DNS still clean (apex→4 Pages IPs, no AAAA/CNAME/CAA; www→github.io CNAME inherits github.io CAA authorizing letsencrypt.org). Apex serves valid LE cert (SAN apex-only); www serves *.github.io fallback → warning. **Found an in-our-control bug the earlier sessions missed: SEO canonical/`SITE_URL` was `https://www.karolinejangola.com` (the BROKEN host) while CNAME/Pages primary = apex.** FIXED locally: `SITE_URL` (seo.ts:6) + 4 index.html literals (canonical/og:url/og:image/twitter:image) → apex. Built + published, served root has ZERO www, canonical now `https://karolinejangola.com`, `.nojekyll` intact. This does NOT touch CNAME/publish.mjs guard/Pages primary — the forbidden "www-primary flip" was NOT done. **STAGED, UNPUSHED — awaiting Mark's approved-push.** Awaiting Mark's decisions: (a) push the canonical fix; (b) Google Ads destination host (severity input); (c) cert path — press ticket vs Cloudflare-in-front vs leave-www-broken.

## Last Action (prior — 2026-08-01)
www TLS (2026-08-01): unstick attempt + research. Removed+re-added Pages custom domain via API + forced build → cleared a `status: errored` build state (old Jekyll leftover) that likely blocked provisioning. Ruled out client-side causes: DNS clean (apex→4 Pages IPs, no AAAA/stray CNAME; www→github.io CNAME), CAA authorizes letsencrypt.org. Cert STILL `dns_changed`/apex-only. **Research (primary GitHub sources) found this matches an ACTIVE 2026 GitHub Pages backend bug (July 19–20 incident; community discussions #202318, #200447): provisioning job stalls before starting the LE request; state is DOMAIN-scoped, so www-primary flip is NOT confirmed to help and risks mirroring the bug onto the apex.** Staff say STOP removing/re-adding (resets timer) and open GitHub Support. DECISION (Mark): hold the www flip. Built the flip locally then REVERTED it (working tree clean, apex config intact). **DONE: Mark FILED the GitHub Support ticket 2026-08-01 ~17:00** (repo w1r3dh4ck3r/karolinejangola, category "Repository features/Branches" — portal has no Pages category; GitHub's own AI triage confirmed DNS is correct + no self-service fix exists). Now WAITING on GitHub Support reply.

## Next Step (all Mark's; none blocking)
- Mark rewrites the 5 treatments cards; swap the 2 adult-women testimonials (Ana Carolina, Lívia).
- Female-grammar call: hero H1 "…sozinha" still female-addressed; decide mothers vs neutral parent. `CLAUDE.md` female-grammar rule left pending.
- www TLS (2026-08-01): **WAITING on GitHub Support** (ticket filed ~17:00). It's a GitHub backend provisioning bug (see Last Action), NOT client-side — DNS + CAA verified clean. **Do NOT flip to www-primary and do NOT remove/re-add again** — research shows the stuck state is domain-scoped (won't help) and staff say cycling resets the timer + risks breaking the apex. Apex stays valid/safe throughout; www keeps showing the browser warning until GitHub fixes it. `https_enforced` False (can't enable until cert covers www). When GitHub replies (or periodically): re-check with `echo \| openssl s_client -servername www.karolinejangola.com -connect www.karolinejangola.com:443 \| openssl x509 -noout -subject` (want `CN = www.karolinejangola.com` or apex SAN incl. www) and `gh api repos/w1r3dh4ck3r/karolinejangola/pages` (want cert `domains` to include www). Small chance it self-heals <24h from the errored-state clear.

## Files to touch next
- Treatments: `app/src/data/treatments.ts` (+ `Tratamentos.tsx` if layout). Testimonials: `app/src/data/testimonials.ts`.
- www flip: `CNAME`, `app/public/CNAME`, `app/scripts/publish.mjs` guard, `app/src/data/seo.ts` canonical if needed.
- After edits: `cd app && npm run build && npm run publish:site`, then `approved-push main`.

<!-- session-state-sync: last written by session 4863060e at 2026-08-01 17:00:15 -0300 -->
