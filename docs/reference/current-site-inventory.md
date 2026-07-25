# Karoline Jangola — Live Site Inventory

> **HISTORICAL SNAPSHOT (2026-07-25):** This captures the ORIGINAL site at reconstruction time. The site has since changed — notably the practice **repositioned to children & adolescents only (no women)**, so this doc's "mulheres e crianças" positioning, the ISO 9001 mentions, and the audience-split cards are PRE-CHANGE history. Trust the current `app/src/` source for live content, not this snapshot.

**CRITICAL METHODOLOGY NOTE — READ FIRST**

`404.html` and `blog/*/index.html` are **STALE prerendered snapshots**, last regenerated at commit
`f304a22` (2026-03-27, "navbar links use absolute paths") / `fc18f69`. They predate FOUR later
content-changing commits:

- `99e673e` "deploy: audience split, contact form, blog CTAs, phone number update" (2026-04-21 02:09)
- `3c9c1a3` "chore: deploy broaden child audience to adolescentes" (2026-04-21 02:18)
- `018a529` "fix: move Quem sou section before Para quem é este atendimento" (2026-04-21 21:44)
- `ab855e7` "fix: rename Quem sou to Quem sou eu" (2026-04-21 21:45) — **this is HEAD's last content commit**

Verified: `git log -1 --format=%ai -- 404.html` = 2026-03-27 23:40:19; `git log -1 --format=%ai -- index.html`
= 2026-04-21 21:45:57. The 404.html still reads "Quem sou" (not "Quem sou eu"), still has the OLD phone
number `5527995119177`, and has **no** "Para quem é este atendimento" audience-split section at all —
proof it is stale, not a design omission.

**Ground truth for current live content is therefore the JS bundle `assets/index-NAF8EB0S.js`** (referenced
by the current `index.html`, built at commit `ab855e7`), NOT `404.html`. Everything in Section 2 below is
extracted from that bundle (esbuild/Vite minifies identifiers but leaves JSX string literals and data arrays
intact and readable). `404.html`/blog prerenders are documented separately in Section 2b so the discrepancy
is explicit and the stale copies are never mistaken for current content.

Verified via: `git show --stat <hash>` for each commit above, and `grep`/Python string search directly on
`assets/index-NAF8EB0S.js`.

---

## 1. `<head>` — verbatim

### Current `index.html` (SPA shell, live, HEAD/`ab855e7`) — 56 lines total, reproduced in full:

```html
<!doctype html>
<html lang="pt-BR" class="scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="google-site-verification" content="Ruj7meDK4FLvod_D-fpotUiUGCEJKgnUcQ1_RhVpBCs" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Karoline Jangola | Psicanalista e Terapeuta Online</title>
    <meta name="description" content="Psicanalista e terapeuta online especializada em mulheres e crianças. Tratamento de ansiedade, depressão, trauma e terapia infantil (TDAH/TEA). Atendimento online para todo o Brasil." />
    <meta name="author" content="Karoline Jangola" />
    <meta name="keywords" content="psicanalista online, terapeuta online, terapia infantil, psicóloga online Brasil, ansiedade, depressão, TDAH, TEA, terapia para mulheres, psicanálise online" />
    <link rel="canonical" href="https://www.karolinejangola.com" />
    <link rel="icon" href="/favicon.ico" sizes="32x32" />
    <link rel="icon" type="image/png" href="/favicon-192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

    <meta property="og:title" content="Karoline Jangola | Psicanalista e Terapeuta Online" />
    <meta property="og:description" content="Psicanalista e terapeuta online especializada em mulheres e crianças. Tratamento de ansiedade, depressão, trauma e terapia infantil. Atendimento para todo o Brasil." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://www.karolinejangola.com" />
    <meta property="og:image" content="https://www.karolinejangola.com/og-image.jpg" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:site_name" content="Karoline Jangola - Psicanalista" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Karoline Jangola | Psicanalista e Terapeuta Online" />
    <meta name="twitter:description" content="Psicanálise e terapia humanizada para mulheres e crianças. Atendimento online para todo o Brasil." />
    <meta name="twitter:image" content="https://www.karolinejangola.com/og-image.jpg" />

    <script async src="https://www.googletagmanager.com/gtag/js?id=AW-16583121961"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() {
        dataLayer.push(arguments);
      }
      gtag("js", new Date());
      gtag("config", "AW-16583121961");
    </script>
    <script type="module" crossorigin src="/assets/index-NAF8EB0S.js"></script>
    <link rel="stylesheet" crossorigin href="/assets/index-CW6KlUxW.css">
  </head>
  <body>
    <div id="root"></div>
  </body>
 </html>
```

**Notable: current `index.html` has NO `geo.region`/`geo.placename` meta tags and NO JSON-LD `<script>` blocks
in the static shell** — these moved into the JS bundle and are injected client-side via `react-helmet`-style
components (`Xo()` per-page SEO, `zv()` for the global JSON-LD). This is a real architectural difference from
`404.html`'s static head (see 2b) which was prerendered when JSON-LD still lived in static HTML.

**Also gone from `index.html` since the last prerender:** the inline visitor-tracking `fetch` script and the
"Bot Lead Capturado" `document.addEventListener('click', ...)` delegated-click script that commit `c596b95`
added directly to `index.html`. Both are superseded by JS-bundle equivalents (Section 3) — the static inline
scripts no longer exist in the current file.

### JSON-LD (from the JS bundle, function `zv()` — this is what actually renders client-side today):

**ProfessionalService** (structurally identical to the old static one, with two live-data differences —
`telephone` and phone-derived `sameAs`/email come from the shared `le` config object, see Section 3):

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Karoline Jangola - Psicanalista e Terapeuta",
  "description": "Psicanalista e terapeuta online especializada em mulheres e crianças. Tratamento de ansiedade, depressão, trauma e terapia infantil (TDAH/TEA).",
  "url": "https://www.karolinejangola.com",
  "telephone": "+55-79-9649-1276",
  "email": "karoljangola@gmail.com",
  "image": "https://www.karolinejangola.com/og-image.jpg",
  "priceRange": "$$",
  "areaServed": { "@type": "Country", "name": "Brasil" },
  "serviceType": ["Psicanálise", "Terapia Online", "Terapia Infantil", "Terapia para Mulheres"],
  "openingHoursSpecification": [
    {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      "opens": "08:00",
      "closes": "20:00"
    }
  ],
  "availableLanguage": ["Portuguese"],
  "paymentAccepted": "Pix, Transferência bancária",
  "sameAs": ["https://www.instagram.com/psicanalista_karolinejangola"],
  "founder": {
    "@type": "Person",
    "name": "Karoline Jangola",
    "jobTitle": "Psicanalista e Terapeuta",
    "url": "https://www.karolinejangola.com",
    "knowsAbout": ["Psicanálise", "Ansiedade", "Depressão", "Trauma", "TDAH", "TEA", "Terapia Infantil"],
    "sameAs": ["https://www.instagram.com/psicanalista_karolinejangola"]
  }
}
```
Note: the live bundle's version dropped `hasOfferCatalog` (present in the old static 404.html JSON-LD, absent
from the current bundle's `zv()` — verified by direct string search, `hasOfferCatalog` does not appear
anywhere in `index-NAF8EB0S.js`).

**FAQPage** — dynamically built from the same 5-item FAQ data array used to render the FAQ section (`Ad`, see
Section 2 §FAQ) via `mainEntity:Ad.map(...)`. Content is IDENTICAL between the FAQ section body and the
JSON-LD (single source of truth in the current codebase, unlike the old static duplication).

### `google-site-verification`: `Ruj7meDK4FLvod_D-fpotUiUGCEJKgnUcQ1_RhVpBCs` (unchanged everywhere — index.html, 404.html, blog pages).

### Google Ads gtag: tag id `AW-16583121961`, loaded via `https://www.googletagmanager.com/gtag/js?id=AW-16583121961`, config call `gtag('config', 'AW-16583121961')`. Present in `index.html`, `404.html`, and every blog prerender.

---

## 2. Homepage sections — CURRENT LIVE ORDER (verified from bundle position order: `id:"..."` literals
and component-call sites merged and sorted by byte offset in `Rv()`, the homepage component)

**7 sections after the (unlabeled) hero: `sobre` → `para-quem` → `tratamentos` → `depoimentos` → `faq` → `contato`.**
(Hero has no `id` attribute in current markup — nav "Agendar" link and in-page anchors only target the 6
labelled sections below.)

### 0. Hero (no id)
- Eyebrow: "Terapia Humanizada"
- H1: "Você não precisa carregar tudo sozinha"
- Body: "Psicanálise e terapia para mulheres e crianças. Se a carga está pesada demais, deixe-me ajudar você a encontrar o equilíbrio."
- CTA: "Fale comigo pelo WhatsApp" → `https://wa.me/557996491276?text=Ol%C3%A1%2C%20vi%20seu%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es.` (`onClick` fires the `qt()` gtag conversion, see §3)
- Background image: `le.heroImage` = `/assets/hero-therapy-CgSB5jl3.webp`, alt "Ambiente acolhedor para terapia", with a `bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent` overlay.

### 1. `id="sobre"` — "Quem sou eu" (renamed from "Quem sou" per commit `ab855e7`)
- Eyebrow: "Quem sou eu"
- H2: "Karoline Jangola"
- Portrait image: `le.portraitImage` = `/assets/therapist-portrait-DhhPXLzJ.avif`, alt "Karoline Jangola — psicanalista e terapeuta online especializada em crianças e mulheres", inside a rotated `-rotate-2` secondary-color card frame.
- Body copy (4 paragraphs, exact, from bundle array `Nv`):
  1. "Olá, me chamo Karoline. Sou psicanalista e terapeuta, mãe de três filhos e tenho uma vivência muito próxima com o universo do desenvolvimento infantil, incluindo o TDAH e o TEA."
  2. "Minha jornada na psicanálise começou justamente pelo desejo de compreender melhor essas condições e oferecer um suporte mais sensível, acolhedor e eficaz — tanto para meus filhos quanto para outras famílias que passam por desafios semelhantes."
  3. "Hoje, sou especializada no acompanhamento de crianças e pré-adolescentes, com certificação de qualidade ISO 9001. Meu trabalho é ajudar os pequenos a reconhecerem, entenderem e expressarem suas emoções de forma segura, respeitando o tempo e a individualidade de cada um."
  4. "Se você percebe que seu filho ou filha está enfrentando dificuldades emocionais, sociais ou comportamentais, posso te ajudar nesse processo com um atendimento humanizado e cuidadoso."
  - Plus a highlighted closing line (separate from the array, styled bold): "💬 Estou aqui para acolher, orientar e caminhar junto com sua família." (confirmed present in 404.html; bundle truncated at the point read but this line is part of the same block per 404.html snapshot — treat as HIGH confidence, not byte-verified from bundle).
- **Stat tiles (2)** — "100%" / "atendimento online" and "ISO 9001" / "certificado de qualidade". Note: ISO 9001 appears TWICE on the page — once in stat tile, once inline in paragraph 3 ("com certificação de qualidade ISO 9001").

### 2. `id="para-quem"` — "Para quem é este atendimento?" (AUDIENCE SPLIT — new since `99e673e`/`3c9c1a3`)
- Eyebrow: "Para quem é este atendimento?"
- H2: "Encontre o seu caminho"
- Two cards, rendered from bundle array `jv` — **exact data, including individual WhatsApp CTA links (each with its own pre-filled message, important for Ads attribution)**:

  **Card 1 — "Para mim" (key: `adult`, icon: heart)**
  - Description: "Mulheres que enfrentam ansiedade, depressão, trauma ou dificuldades nos relacionamentos. Um espaço seguro, só seu, para o que você carrega — sem julgamento."
  - CTA label: "Quero cuidar de mim"
  - CTA href: `https://wa.me/557996491276?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20atendimento%20para%20mim.` (i.e. `encodeURIComponent("Olá, vim pelo site e gostaria de atendimento para mim.")`)

  **Card 2 — "Para meu filho/a" (key: `child`, icon: sparkles)**
  - Description: "Crianças e adolescentes com desafios emocionais, comportamentais ou de aprendizado — TDAH, TEA, ansiedade, dificuldades na escola." (note: "adolescentes" wording — this is the "broaden child audience to adolescentes" change from `3c9c1a3`)
  - CTA label: "Quero ajuda para meu filho/a"
  - CTA href: `https://wa.me/557996491276?text=Ol%C3%A1%2C%20vim%20pelo%20site%20e%20gostaria%20de%20atendimento%20para%20meu%20filho%2Fa.` (i.e. `encodeURIComponent("Olá, vim pelo site e gostaria de atendimento para meu filho/a.")`)

  Both CTAs also fire `onClick={qt}` (same Google Ads conversion event as every other WhatsApp link — the
  bundle does NOT distinguish these two audience CTAs with separate conversion labels; only one `send_to`
  label exists site-wide, see §3).

### 3. `id="tratamentos"` — "Tratamentos"
- Eyebrow: "Como posso ajudar"
- H2: "Tratamentos"
- 5 cards, bundle array `Tv`, unchanged from the old static build:
  1. **Ansiedade** (icon: heart) — "Insônia, pensamentos acelerados, tensão constante — sinais de que algo pede atenção. Juntas, investigamos as raízes dessa ansiedade para que você compreenda o que seus sintomas estão comunicando."
  2. **Depressão** (icon: brain) — "Quando a tristeza se torna persistente e o vazio parece não ter fim, a terapia oferece um espaço seguro para explorar esses sentimentos e identificar os padrões que alimentam o sofrimento."
  3. **Relacionamentos** (icon: users) — "Dependência emocional, medo de abandono, conflitos recorrentes — padrões que se repetem sem percebermos. Exploramos como suas experiências moldaram a forma como você se relaciona."
  4. **Trauma** (icon: leaf) — "Experiências traumáticas deixam marcas que afetam como vivemos e nos relacionamos. A psicanálise oferece um espaço seguro, no seu ritmo, para processar essas experiências sem retraumatizar."
  5. **Terapia de Jovens** (icon: sparkles) — "Crianças e pré-adolescentes muitas vezes não conseguem expressar o que sentem. Como mãe de um filho com TDAH e uma filha com TEA, compreendo de perto esses desafios."
- No section-level CTA (removed per historical commits `5980faa`/`aabb63a` — grid of cards only, no mid-page WhatsApp button).

### 4. `id="depoimentos"` — "Depoimentos"
- Eyebrow: "Depoimentos"
- H2: "O que dizem meus pacientes"
- 3 testimonial cards, bundle array `Pv`, unchanged:
  1. **Roseane** (Mãe de paciente) — "Estou sentindo uma diferença imensa na minha filha depois que ela começou a fazer terapia. Eu tinha muito preconceito com terapia online, achava que não funcionava. Hoje vejo que era puro preconceito. Terapia online funciona, sim! Sou muito grata pelo excelente trabalho e por todo cuidado com a minha filha."
  2. **Ana Carolina** (Paciente adulta) — "Você está me mostrando quem sou eu mesma. Sem ter necessidade de acreditar em migalhas, traições e enganações. Sou grata a Deus por ter colocado você no meu caminho."
  3. **Lívia** (Paciente adulta) — "Sou muito grata por ti. Fez que pudesse ir atrás da minha paz. Sei que está difícil, mas creio que tudo vai ser organizado na minha cabeça e serei feliz com a minha própria companhia. Você me trouxe leveza, o que eu estava precisando."

### 5. `id="faq"` — "Perguntas frequentes"
- Eyebrow: "Tire suas dúvidas"
- H2: "Perguntas frequentes"
- 5 accordion items, bundle array `Ad` (this is also the JSON-LD FAQPage source, single source of truth):
  1. Q: "Como funciona a primeira sessão?" A: "A primeira sessão é um espaço de acolhimento onde conversamos sobre o que trouxe você até aqui. Não há julgamento — é um momento para você se sentir ouvida e começar a construir um vínculo de confiança. A partir daí, traçamos juntas o melhor caminho para o seu acompanhamento." **(Note: this answer is LONGER than the old static JSON-LD in 404.html — it gained the closing sentence "A partir daí, traçamos juntas o melhor caminho para o seu acompanhamento." since the last prerender.)**
  2. Q: "Quanto tempo dura o tratamento?" A: "Cada pessoa tem seu próprio ritmo. Algumas questões podem ser trabalhadas em poucos meses, enquanto outras pedem um acompanhamento mais longo. Conversamos sobre isso ao longo do processo, sempre respeitando o seu tempo." (also longer than 404.html's stale version, which cuts off after "mais longo.")
  3. Q: "Como funciona o atendimento online?" A: "As sessões acontecem por videochamada, com a mesma qualidade e privacidade do atendimento presencial. Você só precisa de um ambiente tranquilo e uma conexão com a internet. Atendo de qualquer lugar do Brasil." (unchanged)
  4. Q: "Você atende por plano de saúde?" A: "Atualmente atendo apenas de forma particular. Porém, emito recibo para que você possa solicitar reembolso ao seu plano de saúde, caso ele ofereça essa possibilidade." (unchanged)
  5. Q: "Para quem é indicado o seu atendimento?" A: "Atendo mulheres adultas e crianças/pré-adolescentes. Trabalho com questões como ansiedade, depressão, traumas, dificuldades nos relacionamentos e desafios emocionais da infância e adolescência." (unchanged)

### 6. `id="contato"` — Contact section (CTA + NEW contact form since `99e673e`)
- H2: "O primeiro passo é o mais importante"
- Body: "Estou aqui para te ouvir. Vamos encontrar juntas o melhor caminho para você."
- Primary CTA: "Agende sua consulta" → `le.whatsappUrl` (same wa.me link as hero), `onClick={qt}`.
- Footer-style info row: "Atendimento online para todo o Brasil" · `mailto:karoljangola@gmail.com` (label = the email itself) · Instagram link → `https://www.instagram.com/psicanalista_karolinejangola`, label "@psicanalista_karolinejangola".
- **Contact form** (component `Iv`, NEW — not present in the old static build at all):
  - Intro line: "Prefere escrever primeiro? Deixe seus dados e entrarei em contato."
  - Field 1: label "Nome *", `id`/`name` = `contact-nome`, `type="text"`, placeholder "Seu nome", `required`.
  - Field 2: label "WhatsApp / Telefone", `id`/`name` = `contact-telefone`, `type="tel"`, placeholder "(79) 99999-9999", NOT required.
  - Field 3: label "O que te trouxe até aqui? (opcional)", `id`/`name` = `contact-mensagem`, `<textarea rows="3">`, placeholder "Pode compartilhar um pouco sobre o que está sentindo...", NOT required.
  - Submit button: "Enviar mensagem" (shows "Enviando..." while `state==="submitting"`, disabled during submit).
  - **Submission mechanism: JS `fetch` POST to Formspree** — `https://formspree.io/f/xeevlzlb`, `body: new FormData(form)`, `headers: {Accept: "application/json"}`. NOT mailto, NOT WhatsApp, NOT a custom backend.
  - On success (`response.ok`): fires `qt()` (the same Google Ads conversion event as WhatsApp clicks — form submission is also tracked as a conversion), then shows a success panel replacing the form: "Mensagem recebida! Entrarei em contato em breve." (serif, styled as `text-primary-foreground`).
  - On failure/exception: inline red text "Erro ao enviar. Tente diretamente pelo WhatsApp." underneath the button; form stays visible.

### Footer (component `Lv`, global, all pages)
- "© {current year, `new Date().getFullYear()`} Karoline Jangola — Psicanalista e Terapeuta" (dynamic year, NOT a hardcoded "© 2026" — the old prerender's static "© 2026" was baked in at build time, but the live app computes it client-side).
- "Atendimento exclusivamente online"
- No footer links beyond this — Instagram/email live in the contato section, not the footer.

---

## 2b. Stale prerendered snapshots (`404.html`, `blog/index.html`, `blog/*/index.html`) — for contrast only

These are DOM snapshots frozen at commit `f304a22`/`fc18f69` (2026-03-27), used by GitHub Pages as the
404 fallback / initial paint for crawlers. They differ from current live content in:
- Old phone number `+5527995119177` / `+55-27-99511-9177` everywhere (wa.me links, JSON-LD `telephone`).
- Section heading "Quem sou" (not "Quem sou eu").
- **No** "Para quem é este atendimento" audience-split section at all — only 6 sections total: hero, sobre,
  tratamentos, depoimentos, faq, contato.
- **No** contact form — contato section ends at the CTA button + info row.
- Shorter FAQ answers (items 1 and 2 missing their trailing sentences).
- References old asset hashes `assets/index-BFxxg0Sd.js` (350KB) / `assets/index-CVgSuWO4.css` (64KB) — both
  still present on disk but orphaned; not loaded by current `index.html`.
- `blog/index.html` and the 3 blog article prerenders share this same staleness for anything in the
  page shell (old phone/email in JSON-LD), but their **article body content** (headings, paragraphs) is
  unchanged — verified by spot-checking the live bundle's `Ev` template-literal against the prerendered
  `<article>` markup start; no commit since `fc18f69` touched blog article prose.
- Old email in these files: JSON-LD shows `karoljangola@gmail.com` too (consistent with current — email did
  NOT change).

Do not use these files as the source of truth for section structure or copy — use Section 2 above.

---

## 3. Behaviors / interactions

**WhatsApp phone number (current, live): `557996491276`** (i.e. +55 79 99649-1276, Sergipe DDD 79). This
REPLACES the old `5527995119177` (DDD 27, Espírito Santo) seen in every stale prerendered file — confirmed
via `git show --stat 99e673e` ("phone number update") and direct grep of the live bundle.

- Two base WhatsApp URLs, from config object `le`:
  - `le.whatsappUrl` = `https://wa.me/557996491276?text=Olá, vi seu site e gostaria de mais informações.` (used by nav "Agendar", hero CTA, contato CTA)
  - `le.blogWhatsappUrl` = `https://wa.me/557996491276?text=Olá, vi seu blog e gostaria de mais informações.` (used by the blog-article end-of-post CTA aside, component `Mv`)
  - Plus 2 more audience-specific pre-filled texts on the "Para quem" cards (Section 2 §2 above).

- **Conversion tracking — single function, single label, used everywhere:**
  ```js
  function qt() {
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", "conversion", { send_to: "AW-16583121961/shGzCIOqipYcEKm4ueM9" });
    }
  }
  ```
  `qt` is wired as `onClick` on every WhatsApp `<a>` (hero, nav "Agendar", both "Para quem" cards, tratamentos-none, contato CTA, blog CTA) AND on successful contact-form submission. **There is only one conversion label site-wide** — the "Bot Lead Capturado" name from commit `c596b95` was a comment/commit-message label for this same `send_to` id (`AW-16583121961/shGzCIOqipYcEKm4ueM9`), not a distinct gtag event name. That commit's original implementation (a document-level delegated click listener injected as an inline `<script>` in `index.html`) has since been REMOVED from the static HTML and replaced by this per-element `onClick={qt}` pattern inside the React bundle — functionally equivalent, differently implemented.

- **Visitor-tracking webhook** (component `_v`, fires once on mount via `useEffect`, every page):
  ```js
  fetch("https://n8n.w1r3d.dev/webhook/visitor", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      site: window.location.hostname,
      page: window.location.pathname,
      referrer: document.referrer || "direct",
      ua: navigator.userAgent
    }),
    keepalive: true
  });
  ```
  (Wrapped in try/catch, silently ignores failure — same shape as the old inline script that used to live directly in `index.html`/`404.html`, now moved into the JS bundle.)

- **Smooth scroll**: `html { scroll-behavior: smooth }` (plain CSS, plus `class="scroll-smooth"` on `<html>` — belt and suspenders, same mechanism, no JS smooth-scroll library). Nav anchors are plain `href="/#tratamentos"` etc. (from-blog-page-safe absolute paths, confirmed fix from `f304a22`).

- **Mobile nav**: hamburger button exists (`aria-label="Menu"`, Lucide `menu` icon) in the OLD prerendered nav markup — could not confirm its open/close behavior from the current minified bundle within the time budget (no `useState` toggle string found near the nav function during search); treat mobile-menu interactivity as **UNVERIFIED** for the current build and re-check directly against `bs` nav-links usage if this needs to be pixel-perfect.

- **Reduced-motion**: grepped the live CSS bundle for `prefers-reduced-motion` — **zero matches**. No reduced-motion handling exists in the compiled CSS. Only animation present: `@keyframes reveal-up` (`opacity:0→1`, `translateY(18px)→0`, `.7s ease forwards`), applied via `.animate-reveal-up` to the hero content block and a couple of `sobre`/testimonial containers. No Radix accordion open/close keyframes (`animate-accordion-up/down`) are defined in the current compiled CSS at all, despite those class names appearing in the old 404.html snapshot — meaning either the accordion no longer animates or the current FAQ implementation differs from the old Radix Accordion primitive. **UNVERIFIED which; flagging for direct browser check.**

---

## 4. Design tokens (from `assets/index-CW6KlUxW.css`, the CURRENT live stylesheet — 21.5KB)

**IMPORTANT DEVIATION FROM CLAUDE.md BRAND BRIEF:** the live site's actual fonts and colors do NOT match
this project's `CLAUDE.md` design-context section (which specifies Playfair Display + Inter, and hex
`#5a4a3a`/`#f8f6f3`). The live CSS uses different fonts and a different (though visually similar, warm/sage)
palette. Flagging this explicitly per the "audit the artifacts, not the config/docs" principle — the CSS is
the metal, the CLAUDE.md brief may be aspirational/outdated. Reconcile with Mark before rebuilding.

### Fonts — loaded via a single `@import` at the top of the CSS (Google Fonts), NOT `<link>` tags, NOT `@font-face`:
```css
@import "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,300;1,9..40,400&family=DM+Serif+Display:ital@0;1&display=swap";
```
- **Heading font (`.font-serif`)**: `DM Serif Display, Georgia, serif` — regular + italic (`ital@0;1`), no numeric weights (DM Serif Display only ships as one weight).
- **Body font (`.font-sans`)**: `DM Sans, system-ui, sans-serif` — weights 300/400/500, both roman and italic (variable-font axis syntax `ital,opsz,wght@0,9..40,300;...`).
- Base `html`/`body` font-family also DM Sans (`font-family:DM Sans,system-ui,sans-serif` on `html,:host` and again on `body`).
- **NOT Playfair Display, NOT Inter** — those are not present anywhere in the CSS or JS bundle (verified via grep, zero matches for either name).

### Color tokens — CSS custom properties on `:root`, defined as raw HSL triples (used everywhere as `hsl(var(--x) / opacity)`):

| Token | HSL | Hex (computed) | Notes |
|---|---|---|---|
| `--background` | `40 33% 96%` | `#f8f5f1` | near-cream |
| `--foreground` | `20 12% 22%` | `#3e3531` | warm dark brown-black, body text |
| `--card` | `40 30% 93%` | `#f2eee7` | |
| `--primary` | `150 18% 38%` | `#4f7260` | sage green (also aliased `--sage`) |
| `--primary-foreground` | `40 33% 96%` | `#f8f5f1` | = background/cream |
| `--secondary` | `30 30% 88%` | `#e9e0d7` | |
| `--secondary-foreground` | `20 12% 22%` | `#3e3531` | |
| `--accent` | `16 50% 58%` | `#c97a5e` | terracotta (also aliased `--terracotta`) |
| `--accent-foreground` | `40 33% 96%` | `#f8f5f1` | |
| `--muted` | `35 20% 90%` | `#eae6e0` | |
| `--muted-foreground` | `25 10% 42%` | `#756960` | body/secondary text |
| `--border` | `35 18% 84%` | `#ddd7ce` | |
| `--sage` | `150 18% 38%` | `#4f7260` | same as primary |
| `--sage-light` | `150 14% 52%` | `#739584` | used for eyebrow labels/icons |
| `--terracotta` | `16 50% 58%` | `#c97a5e` | CTA buttons, accents |
| `--terracotta-dark` | `16 44% 50%` | `#b76547` | CTA hover state |
| `--cream` | `40 33% 96%` | `#f8f5f1` | hero text color |
| `--cream-dark` | `38 28% 88%` | `#e8e2d7` | hero secondary text |

**No `--radius` custom property** — border-radii are plain fixed Tailwind utility values: `rounded-lg` = `0.5rem`, `rounded-xl` = `0.75rem`, `rounded-2xl` = `1rem`, `rounded-full`.

### Breakpoints (standard Tailwind defaults, all present in the compiled CSS): `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`.

### Keyframes/animations: only ONE defined in the compiled CSS —
```css
@keyframes reveal-up { 0%{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
.animate-reveal-up{animation:reveal-up .7s ease forwards}
```
Transitions used throughout: `transition-all`/`transition-colors`/`transition-opacity`/`transition-shadow`/`transition-transform`, all `cubic-bezier(.4,0,.2,1)`, durations `.15s` (default) / `.2s` (`duration-200`) / `.3s` (`duration-300`). Active-press feedback: `active:scale-[0.97]` on buttons.

### `.prose-blog` (blog article typography, defined in this same CSS file):
- Base: `font-family: DM Sans`, `font-size: 1rem`, `line-height: 2rem`, color = `--muted-foreground`.
- `h2`: `DM Serif Display, Georgia, serif`, `1.5rem`, `margin-top: 2.5rem`, color = `--foreground`.
- `h3`: `DM Serif Display, Georgia, serif`, `1.25rem`, `margin-top: 2rem`, color = `--foreground`.
- `strong`: weight 500, `--foreground` color. `em`: italic, `--foreground` color.
- `ul`: disc, `padding-left: 1.5rem`. `li`: `margin-bottom: .5rem`.
- `a`: weight 500, `--primary` color, underline at 40% opacity of primary, `text-underline-offset: 4px`; hover → `--terracotta`.

---

## 5. Assets inventory (only assets actually referenced by CURRENT live index.html/CSS/JS)

| Asset | Referenced from | Used for |
|---|---|---|
| `/favicon.ico` (3.2KB) | `index.html` `<link rel="icon" sizes="32x32">` | browser tab icon |
| `/favicon-192.png` (48.1KB) | `index.html` `<link rel="icon" type="image/png" sizes="192x192">` | larger PWA-style icon |
| `/apple-touch-icon.png` (42.5KB) | `index.html` `<link rel="apple-touch-icon">` | iOS home-screen icon |
| `/og-image.jpg` (97.6KB) | `og:image`/`twitter:image` meta tags | social share preview |
| `/assets/hero-therapy-CgSB5jl3.webp` (103.7KB) | JS bundle, `le.heroImage` | hero section background |
| `/assets/therapist-portrait-DhhPXLzJ.avif` (15.7KB) | JS bundle, `le.portraitImage` | "Quem sou eu" section portrait |
| `/assets/index-NAF8EB0S.js` (222.9KB min) | `index.html` `<script type="module">` | the entire React app |
| `/assets/index-CW6KlUxW.css` (21.5KB min) | `index.html` `<link rel="stylesheet">` | all styles |

**`/placeholder.svg` (28.0KB) is UNREFERENCED anywhere** in the current live HTML/CSS/JS — confirmed via grep,
zero matches. It is orphaned dead weight, almost certainly a leftover default asset from the original
Lovable/shadcn scaffold. Do not carry it forward into the rebuilt source unless a use is found.

**8 additional orphaned JS/CSS bundles exist on disk** (old builds from prior deploys, none referenced by any
current HTML file): `index-B1oDKpVj.js`, `index-BDMY6MmL.js`, `index-BFxxg0Sd.js` (referenced only by the
stale `404.html`), `index-BOijH4fk.js`, `index-BsQtoF4y.js`, `index-CVgSuWO4.css` (referenced only by stale
`404.html`), `index-CrR6NOxw.css`, `index-DfDBf3s-.js`, `index-DzrNWhAe.js`, `index-zp-71f8a.js`. These are
build artifacts from the commit history (`99e673e`, `018a529`, `3c9c1a3`, etc. each shipped a new hashed
bundle) — safe to ignore for reconstruction purposes, they are not part of the "current" site.

---

## 6. Routing model

React Router (or equivalent) config found in bundle, 4 routes:
```
path: "/"            → homepage (component Rv)
path: "/blog"         → blog index (component Dv)
path: "/blog/:slug"   → individual blog article
path: "*"             → catch-all / 404
```
This is a client-side SPA router. **GitHub Pages 404 fallback pattern**: `404.html` is a full prerendered
snapshot of the homepage (not a generic "not found" page) — GitHub Pages serves `404.html` for any unmatched
path, and since it's a complete homepage DOM (stale, see Section 2b), the effective behavior for a deep-link
404 is "show an old homepage snapshot," with the live JS bundle then presumably taking over hydration and
routing client-side once loaded (standard SPA-on-static-host trick). The blog article pages
(`blog/<slug>/index.html`) are pre-generated per-slug so direct navigation to a blog URL also gets a real
prerendered page rather than falling through to the stale 404 snapshot.

**Blog routes/slugs** (3 articles, from bundle array `Ld`, matches the 3 `blog/*/` folders on disk):
1. `ansiedade-sintomas-tratamento` — "Ansiedade: Sintomas, Causas e Como o Tratamento Pode Ajudar"
2. `como-saber-se-preciso-de-terapia` — "Como Saber Se Preciso de Terapia? 7 Sinais Para Prestar Atenção"
3. `terapia-online-funciona` — "Terapia Online Funciona? Tudo Que Você Precisa Saber"

(All three: `date: "27 de março de 2026"`, read times 6–7 min, full article body stored as HTML template
literals — `Ev`, `Cv`, `Sv` — directly in the JS bundle, e.g. `Ev` starts: `<p>Muitas pessoas passam anos
convivendo com dificuldades emocionais sem buscar ajuda...`.)

---

## 7. Static config files (unchanged, verified read directly)

**`robots.txt`** (73 bytes, verbatim):
```
User-agent: *
Allow: /

Sitemap: https://karolinejangola.com/sitemap.xml
```

**`CNAME`** (20 bytes, verbatim): `karolinejangola.com`

**`sitemap.xml`** (1017 bytes) — 5 URLs, all `lastmod` dates from the March prerender pass (NOT updated
alongside the April content changes — another staleness data point):
- `/` — priority 1.0, monthly
- `/blog` — priority 0.8, weekly
- `/blog/como-saber-se-preciso-de-terapia` — priority 0.7, monthly
- `/blog/terapia-online-funciona` — priority 0.7, monthly
- `/blog/ansiedade-sintomas-tratamento` — priority 0.7, monthly
(all `lastmod` = `2026-03-21` for `/`, `2026-03-27` for the rest)
