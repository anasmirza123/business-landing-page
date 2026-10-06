# Al-Noor Auto Workshop: Landing Page

A responsive local-business landing page built with plain HTML5, CSS3 (Flexbox + Grid) and a small amount of vanilla JavaScript. No frameworks, no build step. Open `index.html` in a browser.

**All business details, reviews and contact information are demo placeholders for a portfolio project.**

## Structure

```
index.html        Page markup, SEO meta tags, LocalBusiness (AutoRepair) JSON-LD
css/style.css     Tokens (CSS variables), layout, components, breakpoints
js/script.js      Mobile menu, active nav link, WhatsApp links, form validation
images/           Placeholder SVGs, to be replaced with real photos
```

## Customize

1. **WhatsApp**: edit `WHATSAPP.number` and `WHATSAPP.message` at the top of `js/script.js`. Every link marked `data-whatsapp` updates automatically.
2. **Business details**: search for `123 Main Road`, `+92 300 0000000` / `+923000000000`, `info@example.com` and `example.com` in `index.html` (visible text, footer, JSON-LD, canonical and Open Graph tags).
3. **Map**: replace the `src` of the `<iframe>` in the Location section with the Google Maps "Embed a map" URL for the real address.
4. **Images**: add your photos to `images/` and change the `src` values in `index.html` (for example `hero.svg` to `hero.jpg`). Keep the `width`/`height` attributes matching the new image to avoid layout shift, and update the `alt` text. For larger photos, add `srcset`/`sizes` with resized copies. Use a JPG/PNG for `og:image`, as many social platforms do not render SVG.
5. **Colors**: change the variables in `:root` at the top of `style.css`.
6. **Reviews**: replace the demo testimonials with real, permitted customer feedback before going live, and remove the demo notes.
7. **Contact form**: it validates on the frontend only and sends nothing. Connect it to a backend or form service (for example by replacing the `submit` handler in `script.js`).

## Breakpoints

Mobile-first. Navigation switches to the desktop bar at 68em (about 1088px); grids move to 2 columns at 40em and 3 columns at 64em.
