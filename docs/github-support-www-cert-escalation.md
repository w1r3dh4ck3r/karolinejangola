# GitHub Support — escalation reply (www TLS certificate stuck)

Paste this into the existing ticket thread (reply to the canned "help articles"
response). Written 2026-08-04.

---

Thank you, but the linked help articles describe the self-service steps I have
**already completed and verified**, so they do not resolve this. This is not a
DNS or configuration problem on my side — it is a stalled certificate-provisioning
job on the GitHub Pages backend, and I need it escalated to the Pages engineering
team to be manually re-triggered.

**Repository:** w1r3dh4ck3r/karolinejangola
**Custom domain (primary):** karolinejangola.com (apex)
**Affected host:** www.karolinejangola.com

**The exact stuck state (from the Pages API, `GET /repos/{owner}/{repo}/pages`):**

- `https_certificate.state`: `dns_changed`
- `https_certificate.description`: "Detected a change to DNS settings. Requesting a new certificate."
- `https_certificate.domains`: `["karolinejangola.com"]` — **www.karolinejangola.com was never added to the certificate**
- `https_enforced`: `false` (I cannot enable it until the certificate covers www)

This state has been **unchanged since 2026-08-01** (first observed) through
2026-08-04 — three days with no progress. A certificate request that is genuinely
in progress does not sit in this state for days. The provisioning job appears to
have stalled before issuing the Let's Encrypt request for the www hostname.

**Result for visitors:** the apex (https://karolinejangola.com) serves a valid
Let's Encrypt certificate (SAN: karolinejangola.com). www.karolinejangola.com has
no certificate, so it falls back to the `*.github.io` shared certificate and every
browser shows a certificate-name-mismatch warning.

**DNS and CAA are verified correct — please confirm on your side and rule them out:**

- apex `karolinejangola.com` → A records `185.199.108.153`, `185.199.109.153`,
  `185.199.110.153`, `185.199.111.153` (the four GitHub Pages IPs). No AAAA, no
  CNAME, no CAA record on the apex.
- `www.karolinejangola.com` → CNAME `w1r3dh4ck3r.github.io`.
- CAA: www inherits github.io's CAA, which authorizes `letsencrypt.org`
  (`0 issue "letsencrypt.org"`). Nothing blocks Let's Encrypt from issuing.

**What I have already done (the self-service steps in the articles):**

- Removed and re-added the custom domain via the API and forced a rebuild — this
  cleared a stale `errored` build state; Pages is now `built`. The certificate
  state still did not advance to include www.
- I have **stopped** removing/re-adding the domain, per community guidance that
  cycling it resets your internal provisioning timer.

This matches the GitHub Pages certificate-provisioning incident reported around
2026-07-19/20 (community discussions #202318 and #200447), where the provisioning
job stalls before starting the Let's Encrypt request and the stuck state is
domain-scoped.

**My request:** please escalate to the Pages team to manually re-trigger /
unblock certificate provisioning for **www.karolinejangola.com** so the
certificate covers both the apex and www. There is no remaining self-service
action on my end — DNS, CAA, and the custom-domain configuration are all correct
and verified.

Thank you.
