# AIAIP website

Git-first Astro website for the African Institute for Artificial Intelligence Policy.

## Local development

```bash
npm install
npm run dev
```

Production verification:

```bash
npm run build
npm run preview
```

## Cloudflare Pages

Connect this repository to Cloudflare Pages using:

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Node version: `24`
- Environment variable: `ASTRO_TELEMETRY_DISABLED=1`

The project is fully static. No Cloudflare adapter is required unless server-rendered routes are added later.

## Content model and future CMS

Shared navigation, metrics, research themes and publication metadata are in `src/data/site.ts`. Page components consume that structured data rather than duplicating content.

A headless CMS can later replace this file as the content source without redesigning the components or changing the public routes.

## Pre-launch boundaries

The current research entries and event details are design-stage demonstration content. Before production launch:

1. Replace demonstration publications with approved titles, authors, dates, summaries and files.
2. Replace the placeholder event with a confirmed event or remove the section.
3. Add approved privacy and terms text.
4. Connect the contact form to a production endpoint and Cloudflare Turnstile.
5. Replace placeholder external social links with AIAIP's verified profiles.
6. Verify all numerical impact claims and partner marks.
