# Karoline Jangola — Project Context

## Overview

Static single-page website for **Karoline Jangola**, a Brazilian psychoanalyst and psychotherapist based in Vila Velha, ES. She serves women and children exclusively online, for all of Brazil.

- **Live URL:** https://www.karolinejangola.com
- **Hosting:** GitHub Pages (repo: `w1r3dh4ck3r/karolinejangola`, branch: `main`)
- **Domain:** Registered at Wix, DNS managed via Wix DNS panel
- **Language:** Brazilian Portuguese (pt-BR)

## Tech Stack

Pure static site — no framework, no build tools.

| File | Purpose |
|------|---------|
| `index.html` | Full single-page site with structured data (MedicalBusiness + FAQPage schema) |
| `styles.css` | Mobile-first CSS with custom properties, WCAG 2.1 AA compliant |
| `script.js` | Hamburger menu (aria-expanded, Escape key), smooth scroll, dynamic copyright year |
| `CNAME` | GitHub Pages custom domain (`www.karolinejangola.com`) |

## Images

All in `images/`:

| File | Size | Notes |
|------|------|-------|
| `hero-bg.avif` | 164KB | Desktop hero background (converted from 786KB JPG, q=25) |
| `hero-bg-mobile.avif` | 63KB | Mobile variant (768px wide) |
| `hero-bg.jpg` | 805KB | Original JPG fallback |
| `FotoProfissionalKarol.avif` | 16KB | Professional headshot for "Quem Sou" section |
| `ISO9001.avif` | 17KB | ISO 9001 certification badge |
| `PsicanalistaVerificadoKarol.avif` | 29KB | RQP credential badge (shown as image only, no text reference) |

## Site Sections

1. **Hero** — "Terapia Humanizada" with warm radial gradient overlay, WhatsApp CTA
2. **Quem Sou** — Bio with professional photo and credential badges
3. **Tratamentos** — 5 treatment cards (Ansiedade, Depressao, Relacionamentos, Trauma, Terapia de Jovens). No couples therapy.
4. **Depoimentos** — 3 real testimonials (Roseane, Karol, Livia) from WhatsApp screenshots
5. **Perguntas Frequentes** — 5-item CSS-only accordion using `<details>`/`<summary>`
6. **Contato** — WhatsApp + email, with pre-filled WhatsApp message
7. **Footer** — Dynamic year, Instagram placeholder link

## Key Details

- **WhatsApp:** +55 27 99511-9177
- **Email:** karoljangola@gmail.com
- **WhatsApp pre-filled message:** "Ola, vi seu site e gostaria de mais informacoes."
- **RQP register:** K-69702-DF (badge image shown, but NOT mentioned in body text per client request)
- **No in-person practice** — exclusively online
- **No couples therapy** — removed from site

## DNS Configuration

Domain registered and DNS managed at Wix:

| Type | Host | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | w1r3dh4ck3r.github.io |

HTTPS enforced via GitHub Pages settings.

## CSS Architecture

- Mobile-first with `min-width` breakpoints: 769px (tablet), 1025px (desktop)
- CSS custom properties for colors:
  - `--color-brand: #5a4a3a` (warm brown)
  - `--color-brand-light: #f8f6f3`
  - `--color-whatsapp: #25D366`
  - `--color-whatsapp-link: #1a9e4a` (darker, passes 4.5:1 contrast)
- `prefers-reduced-motion` support
- `@media (hover: hover)` for hover-only effects
- `:focus-visible` outlines for keyboard navigation
- 48px minimum touch targets

## Accessibility (WCAG 2.1 AA)

- `aria-expanded` on hamburger button
- `aria-label="Menu principal"` on nav
- Escape key closes mobile menu
- SVG sprite for WhatsApp icon (deduplicated)
- Semantic HTML: `<main>`, `<nav>`, `<blockquote>`, `<cite>`, `<details>/<summary>`

## Repo Structure

```
karolinejangola/
  index.html          # Main site
  styles.css          # All styles
  script.js           # Menu + interactions
  CNAME               # Custom domain
  context.md          # This file
  .gitignore
  images/             # All site images (AVIF + JPG fallback)
  testimonials/       # WhatsApp screenshot source images
  screenshots/        # Playwright visual test captures
  docs/plans/         # Design refactor plan
  content/            # Legacy Wix content (local only)
```

## Outstanding / Future Work

- **Favicon:** KJ initials in brand color — favicon.svg, favicon.ico, apple-touch-icon.png (done)
- **OG image:** Create 1200x630 social sharing image
- **Instagram link:** https://www.instagram.com/psicanalista_karolinejangola (done)
- **Welcome video:** Client may add an introductory video later
- **Blog/content marketing:** Future consideration
- **Google Business Profile:** Not yet set up
