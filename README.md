# Al-Noor Auto Workshop: Full-Stack Website

A demo local-business website for a fictional auto workshop: premium responsive front end plus a Node.js/Express API that validates and stores service requests. **All business details, reviews and contact data are placeholders.**

## Features
- Sticky header, accessible full-screen mobile menu, scroll-spy navigation
- Hero with live "Open now / Closed" status (Pakistan time), WhatsApp, call and email actions
- Six services, each with a **View Service** modal (details, typical time, **Book this service** pre-fills the form)
- Gallery lightbox: previous/next buttons, arrow keys, Esc, click outside, scroll lock
- Reviews carousel (arrows, dots, touch swipe), clearly marked as demo reviews
- Location: Google Maps embed, **Get Directions**, **Call Workshop**, **WhatsApp**
- Booking form: client validation, server validation, loading state, duplicate-submit guard, 12 s timeout, success and error states, toast notifications
- Express API with Helmet, CORS allow-list, rate limiting, 10 KB body limit, honeypot, safe JSON errors
- SEO tags, Open Graph/Twitter, `AutoRepair` structured data (no fake ratings), reduced-motion support

## Tech stack
HTML5, CSS3 (Grid/Flexbox), vanilla JavaScript; Node.js 18+, Express 4, Helmet, cors, express-rate-limit, dotenv.

## Structure
```
client/            index.html, css/style.css, js/app.js, assets/images/
server/            server.js, routes/, controllers/, middleware/, utils/
.env.example  render.yaml  package.json
```

## Install and run
```bash
npm install
cp .env.example .env      # Windows: copy .env.example .env
npm run dev               # or: npm start
```
Open http://localhost:5000 (Express serves the client and the API on one port).

## Environment variables
| Variable | Purpose |
|---|---|
| `PORT` | Server port (default 5000) |
| `NODE_ENV` | `production` enables long asset caching and HTTPS upgrade |
| `CORS_ORIGIN` | Comma-separated origins allowed to call `/api` from another domain. Empty = same origin only |
| `TRUST_PROXY` | `1` when behind a proxy so rate limiting sees real IPs |
| `DATA_FILE` | Where requests are stored (JSON lines) |

No secrets are used in the front end.

## API
| Method | Path | Body | Result |
|---|---|---|---|
| GET | `/api/health` | none | `{ success, status, uptime }` |
| POST | `/api/booking` | `name, phone, vehicle, service` required; `email, date, time, message` optional | `201 { success: true, message, id }` |
| POST | `/api/contact` | `name, email, message` required; `phone` optional | `201 { success: true, message, id }` |

Errors return `{ success: false, message, errors? }` with 400 (validation), 413 (too large), 429 (rate limit) or 500 (generic). Allowed `service` values and times are in `server/utils/validate.js` and must match the form's `<select>` options. The site's form uses `/api/booking`; `/api/contact` is available for a future general enquiry form.

Stored fields: `id, type, name, phone, email, vehicle, service, preferred_date, preferred_time, message, created_at` in `data/requests.ndjson`.

## Customize
- Phone, email, address, WhatsApp number/message: `CONTACT` and `WHATSAPP` at the top of `client/js/app.js` (also update the visible text, JSON-LD, canonical and Open Graph URLs in `index.html`).
- Photos: put files in `client/assets/images/` and list them in `PHOTOS` in `app.js`. Until then, generated placeholders are shown.
- Map: replace the iframe `src` in the Location section.
- Colors: CSS variables at the top of `style.css`.

## Deployment
- **One service (recommended): Render, Railway or a VPS.** Express serves everything. On Render, connect the repo (`render.yaml` is included): build `npm install`, start `npm start`, health check `/api/health`. Keep `CORS_ORIGIN` empty.
- **Split: client on Netlify/Vercel, API elsewhere.** Publish the `client/` folder as static files, set `<meta name="api-base" content="https://your-api.example.com">` in `index.html`, and set `CORS_ORIGIN=https://your-site.example.com` on the API. The API's CSP only applies to pages it serves.
- **VPS:** run with `pm2 start server/server.js`, put nginx or Caddy in front for HTTPS, set `TRUST_PROXY=1`.
- Free hosts often have ephemeral disks: replace `server/utils/store.js` with a database or email service before real use.

## Testing checklist
Manual checks to run in a browser: every nav link and the mobile menu; each View Service modal (open, Esc, Close, Book this service); lightbox (open, previous, next, arrow keys, Esc); carousel arrows, dots and swipe; Get Directions, Call Workshop, WhatsApp, Email Us; form with empty fields, bad email/phone, a Sunday date, a valid submission, and the API stopped (error toast); no horizontal scroll at 320, 375, 768, 1024 and 1440 px.

## Future improvements
Database (PostgreSQL), email/WhatsApp notifications to staff, admin view for requests, CAPTCHA, real photos and reviews, automated API and browser tests, Arabic/Urdu translation.
