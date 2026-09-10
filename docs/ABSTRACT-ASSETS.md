# Abstract chapter artwork

## Current whole-site depth layers

The September whole-site revision adds `crossing-distance-v2.webp` (opaque low horizon) and six alpha-transparent foregrounds: `crossing-screen-v2.webp`, `crossing-threshold-v2.webp`, `crossing-defense-v2.webp`, `crossing-discovery-v2.webp`, `crossing-incident-v2.webp`, and `crossing-race-v2.webp`. The threshold also supplies a separate middle-distance plane. These built-in generated images were individually inspected, converted to WebP quality 86, and their encoded alpha checked. Full prompts and original paths accompany each asset. SVG threads remain separate geometry. Clear reading space comes from image composition and masks, not text panels.

The active social card is `social-crossing-v2.jpg` (1200 × 630, JPEG quality 88), with full generation prompt in `social-crossing-v2.prompt.json`. It shows the actual headline beside nested thresholds and a low island horizon. The earlier social card below is retained for provenance, not active metadata.

## Hero layers and sharing image

The hero combines `landscape.webp` (1536 × 1024, opaque engraved valley) with `fragments.webp` (1024 × 1536, alpha-transparent floating apertures). Both were generated with the built-in image-generation tool, inspected, and converted with ImageMagick to WebP. Transparency was checked on the encoded foreground. Rust threads remain separate SVG paths, never baked into the reusable landscape.

`social-abstract.jpg` is the previous 1200 × 630 Open Graph/Twitter image, generated and inspected with the actual headline and charcoal/rust typography, then converted to JPEG quality 84. Each of these three assets has an adjacent JSON file containing its complete prompt, generation method and original PNG path. These illustrations make no documentary claim.

## Chapter base layers

Generated with the built-in `image_gen.imagegen` tool for the approved Crossing direction. All six are text-free, opaque charcoal/ivory engraved illustrations. Original generated PNGs remain outside the repository at the paths recorded in each sidecar. Images are conceptual illustrations, not documentation of real events.

| Asset                                                            | Dimensions  |  Bytes | Motif                                             |
| ---------------------------------------------------------------- | ----------- | -----: | ------------------------------------------------- |
| [surveillance.webp](../public/assets/abstract/surveillance.webp) | 1536 × 1024 | 406076 | Converging stone apertures                        |
| [release.webp](../public/assets/abstract/release.webp)           | 1536 × 1024 | 400266 | Single threshold along a causeway                 |
| [defense.webp](../public/assets/abstract/defense.webp)           | 1536 × 1024 | 392348 | Distributed refuges and connected gates           |
| [discovery.webp](../public/assets/abstract/discovery.webp)       | 1536 × 1024 | 348184 | Exploded architecture exposing inner organization |
| [incident.webp](../public/assets/abstract/incident.webp)         | 1536 × 1024 | 432400 | Fractured span with partial repair                |
| [race.webp](../public/assets/abstract/race.webp)                 | 1536 × 1024 | 341476 | Separate structures across a gulf                 |

Each matching `.webp.json` contains the exact full prompt, generation method, original path, dimensions and conversion. Prompt provenance was added with Impeccable's `embed-prompt.mjs`; WebP uses its supported JSON sidecar fallback. Production conversion: ImageMagick, maximum width 1536px, WebP quality 82.

## Visual inspection

Every final WebP was opened and inspected. All six have distinct compositions, no visible text, and no literal cameras, servers, UI or colored threads. Surveillance converges apertures; release isolates one threshold; defense distributes small structures; discovery exposes an articulated inner structure; incident leaves a visible gap alongside a partial repair; cooperation balances separate architecture across open space.

## Integration notes and limits

The original six images are landscape base layers, not foreground cutouts. Use the new separate cutouts for depth; mask the base artwork to leave clear negative space for reading. Do not rely on any architectural connection as an evidentiary or causal diagram. Total weight of these six base files is 2,320,750 bytes; lazy-load chapter scenes. The generated ivory texture varies slightly across scenes and is not a flat exact hex swatch.
