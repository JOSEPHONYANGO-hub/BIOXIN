# Bioxcin Kenya

Website for **bioxcin.co.ke**, the Kenyan home of the Bioxcin hair care, skin care and supplement range.

Built with Next.js 16, React 19, TypeScript and Tailwind CSS 4, the same stack as our other sites. No database: products and pages are typed files in `src/lib/`.

## Commands

| Command | What it does |
|---|---|
| `npm install` | Install dependencies |
| `npm run dev` | Development server on http://localhost:3000 |
| `npm run build` | Production build |
| `npm start` | Run the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test:e2e` | Playwright responsive and accessibility tests (needs a running server; set `BASE_URL` if not on :3000) |

## Where things live

- `src/lib/site.ts`: every business detail (phone, WhatsApp, email, address, hours, social links, enquiry inbox). Only values marked `approved: true` are shown.
- `src/lib/catalog.ts`: categories, product families and products. A product only gets a **Buy now** button when it has a `shopSlug` (its product page on the retail shop).
- `src/app/globals.css`: brand colours and font (from the brand identity document).
- `src/app/actions.ts` and `src/lib/forms.ts`: enquiry forms (contact, pharmacy, distributor), with validation, honeypot, timing check and rate limit.

## Deploying on Coolify

- **Build pack:** Dockerfile (in the repo root). **Port:** 3000. **Health check:** `/healthz`.
- **Environment variables:** see `.env.example`. Set `NEXT_PUBLIC_SERVER_URL` (e.g. `https://bioxcin.co.ke`) and `NEXT_PUBLIC_SITE_ENV` as **build** variables. `production` allows search engines; anything else keeps the site out of search results.
- **Email:** enquiries are only logged until `MESSAGING_MODE=live` and the `SMTP_*` and `EMAIL_FROM` variables are set.
