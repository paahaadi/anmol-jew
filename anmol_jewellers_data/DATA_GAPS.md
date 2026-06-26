# Data gaps & how to fill them

Products, product images, review bodies, and the Facebook/Instagram feeds are
**not reachable by plain web fetching** — those platforms render content via
JavaScript behind a login wall, and the Google Maps photo/review panels are
lazy-loaded. To pull them, one of these is needed:

| Gap | What it needs |
|---|---|
| Product images + captions (Facebook) | Authenticated session or an **Apify Facebook Page scraper** (the `apify-*` skills here). Requires an Apify API token. |
| Google Maps reviews + photos | **Apify Google Maps Scraper** (`apify-ecommerce` / `apify-ultimate-scraper` skills) with an API token. |
| Instagram feed | A valid Instagram handle first (none found for the Sundar Nagar branch), then an Apify Instagram scraper. |

## Fastest paths to complete this

1. **Give me an Apify API token** → I can run the Google Maps + Facebook scrapers
   and drop the products/images/reviews straight into these folders.
2. **Confirm the real Instagram handle** (if one exists) — the link you sent
   pointed to Facebook, not Instagram.
3. **Manual**: open the Facebook page while logged in, save the product photos,
   and drop them in `images/` — I'll catalogue and tag them into
   `products/products.json`.
