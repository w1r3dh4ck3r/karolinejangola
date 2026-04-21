# Architecture

## Overview

`karolinejangola` is a lightweight static website. The root `index.html` and generated assets under `assets/` indicate a build output or export-oriented repo rather than a source-heavy application.

## Current Structure

| Path | Purpose |
|------|---------|
| `index.html` | Main page entry |
| `assets/` | Bundled JS, CSS, and media assets |
| `CNAME` | Custom domain mapping for static hosting |
| `robots.txt`, `sitemap.xml`, favicons | SEO and site metadata |

## Operational Model

- Content is delivered as static files
- Deployment likely maps the repository root directly to hosting
