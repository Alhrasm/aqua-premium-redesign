# Aqua Premium Foods — website redesign concept

**Live preview:** https://alhrasm.github.io/aqua-premium-redesign/

A redesign concept for [aquapremiumfoods.com](https://www.aquapremiumfoods.com): a premium, bilingual (English / العربية) site for Aqua Premium's canned, frozen and pantry range and for the trade services of PURE, the company behind the brand, in Cairo and Dubai.

## What's in it

- **Editorial hero.** Real product photography with cut-out packs layered over it, under the line *Premium food. Global supply.*
- **Three lines up close.** Tuna, canned legumes and vegetables, and frozen foods, each with its carton and container figures.
- **The full catalogue.** All 65 products in 10 lines, with pack sizes, units per carton, and cartons and pallets per 20ft / 40ft container. It is searchable, and every product can be added to a quote list.
- **Product sheets.** A side panel on desktop and a bottom sheet on mobile.
- **Trade services.** Private label, import & export, food supply and logistics.
- **Quality policy and offices.** The quality policy and the Cairo and Dubai offices, with each office's local time.
- **Quote request form.** Pre-filled with the quote list; it opens a ready-to-send email.
- **Full Arabic version.** Mirrored RTL layout and Arabic typography (Markazi Text + Readex Pro); the language choice is remembered.
- **Responsive and accessible.** Designed mobile-first, keyboard accessible, and it respects `prefers-reduced-motion`.

## Structure

```
index.html          ← built file (what GitHub Pages serves)
src/
  head.html         ← <head>: meta, fonts
  body.html         ← page markup (EN text + data-ar Arabic text)
  styles.css        ← design system and layout
  app.js            ← catalogue data, language switch, quote list, drawer, form
scripts/build.mjs   ← assembles src/ into index.html
assets/img/         ← logos, product pack shots, photography
```

## Work on it

```bash
npm run build      # rebuild index.html after editing anything in src/
npm run serve      # preview at http://localhost:5173
```

No dependencies: Node 18+ for the build and any static server for preview.

## Content

Product names, pack sizes and container figures come from the Aqua Premium product catalogue. Company, service and contact details come from the catalogue and the current website. Product imagery is the brand's own packaging and photography.

---

Redesign concept by Mohamed Tarek.
