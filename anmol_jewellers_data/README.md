# Anmol Jewellers, Sundar Nagar — Data Extract

Collected: **2026-06-26**

## Verified business profile (source: Google Maps)

| Field | Value |
|---|---|
| Name | Anmol Jewellers (अनमोल ज्वेलर्स) |
| Category | Goldsmith / Jewellery store |
| Address | Bhojpur, Sundar Nagar, Himachal Pradesh 175002, India |
| Plus Code | GVMQ+2R Sundar Nagar |
| Phone | +91 86289 11161 |
| Google rating | 5.0 |
| Hours (Thu, confirmed) | 9:00 AM – 8:00 PM |
| Facebook | https://www.facebook.com/AnmolJewellersSundernagar/ |
| Instagram | None found (see below) |

Full structured profile: [`business_profile.json`](business_profile.json)

## Folder structure

```
anmol_jewellers_data/
├── README.md              # this file
├── business_profile.json  # verified structured data
├── sources.md             # every source URL used
├── DATA_GAPS.md           # what could NOT be auto-extracted + how to get it
├── images/                # (empty - see DATA_GAPS)
├── products/              # (empty - see DATA_GAPS)
└── reviews/               # (empty - see DATA_GAPS)
```

## What's confirmed vs. missing

- ✅ **Google business profile** — name, address, plus code, phone, rating, category, partial hours.
- ❌ **Product list & product images** — not publicly extractable (FB/IG login-gated; Maps photos lazy-loaded).
- ❌ **Review text** — Google shows 5.0 rating but review bodies are not exposed to anonymous fetches.
- ❌ **Facebook content** — page is login-gated; only the page name/location is public.
- ⚠️ **Instagram** — no Sundar Nagar–specific account exists in search results. The "Instagram" link you supplied was a duplicate of the Facebook URL.

See [`DATA_GAPS.md`](DATA_GAPS.md) for exactly how to fill the gaps.
