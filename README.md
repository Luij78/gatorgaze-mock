# Gator Gaze Media — demo mockup

Unaffiliated static mockup of the [Gator Gaze Media](https://www.gatorgazemedia.com) marketing site and the Aryeo-style listing order form. It is for demonstration only. No form on this site submits data anywhere.

**Demo mockup — not affiliated with Gator Gaze Media.**

## Pages

- Marketing: Home, About, Services (and each service), Pricing, Projects, Gallery, Blog, Reviews, FAQ, Contact, Book Now, Home Prep, service-area landings, privacy, and terms.
- Order form (`order/`): Address, Services, Scheduling, Contact, and Confirm. Package prices follow the published square-footage tiers. Placing an order shows a demo confirmation and stays in the browser.

## Publish on GitHub Pages

The workflow in `.github/workflows/pages.yml` deploys this repo on every push to `main`. It cannot turn Pages on by itself.

In the repo, open **Settings → Pages → Build and deployment** and set **Source** to **GitHub Actions**. Then re-run the failed “Deploy GitHub Pages” workflow (or push another commit). The site will be at:

https://luij78.github.io/gatorgaze-mock/

## Run locally

From the repo root, so asset paths match GitHub Pages:

```bash
python3 -m http.server 4173
```

Open `http://localhost:4173/`. On GitHub Pages the same files are served from `/gatorgaze-mock/`. Links are relative, so both work.

## Pricing source

Square-footage tiers, à la carte services, and the travel example are encoded in `js/catalog.js` and rendered on the pricing page and the order form. `node scripts/check-catalog.js` checks the tier boundaries.

Regenerate the HTML after editing `scripts/generate-pages.mjs`:

```bash
node scripts/generate-pages.mjs
```
