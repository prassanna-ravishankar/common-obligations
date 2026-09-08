# Common Obligations

An interactive visual essay on AI power, accountability, and the decisions that shape what happens next. By Prassanna Ravishankar.

## Run locally

No build step or package installation is required. With Python 3 installed:

```sh
python3 -m http.server 8000 --directory public
```

Open http://localhost:8000.

## Structure

- `public/index.html`: visual essay, six obligations, source notes, and complete long-form essay.
- `public/style.css`: responsive typography, layout, animation, and reduced-motion support.
- `public/app.js`: surveillance stages, side-by-side comparisons, release choices, coordination conditions, and scroll effects.
- `public/assets/`: two original AI-generated conceptual illustrations in WebP format.

The site uses Instrument Serif and DM Sans through Google Fonts, with system font fallbacks.

## Editing

Edit the HTML for narrative text and sources. Interactive comparison content is in `public/app.js`; keep the initial HTML state in sync when changing default selections. CSS lives in `public/style.css`.

The comparisons are conditional arguments, not forecasts or simulated estimates. Preserve attribution, distinguish allegations from findings, and identify conceptual imagery. The street illustration depicts a generic camera, not a Flock installation.

## Hosting

Deploy the contents of `public/` to any static web host. No server, database, or secrets are required. The purchased domain is commonobligations.org; DNS and hosting configuration are separate steps.

The original ChatGPT Sites deployment manifest and source credentials are intentionally excluded from this portable repository.

## Validation performed

JavaScript syntax, local asset references, internal anchors, and duplicate HTML IDs were checked. Browser interaction and visual QA have not been performed for this version.
