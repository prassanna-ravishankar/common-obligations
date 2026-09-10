---
name: Common Obligations
description: Crossing — an architectural visual essay on ivory paper.
colors:
  paper: "#f1eee5"
  ink: "#24231f"
  muted: "#625f56"
  line: "#c6bfb0"
  accent: "#9f3e26"
typography:
  display:
    fontFamily: '"Instrument Serif", Georgia, serif'
    fontSize: "clamp(72px, 8.9vw, 148px)"
    fontWeight: 400
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: '"Instrument Serif", Georgia, serif'
    fontSize: "clamp(48px, 6vw, 88px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  title:
    fontFamily: '"Instrument Serif", Georgia, serif'
    fontSize: "clamp(30px, 3vw, 44px)"
    fontWeight: 400
    lineHeight: 1.08
    letterSpacing: "-0.025em"
  body:
    fontFamily: '"DM Sans", Arial, sans-serif'
    fontSize: "17px"
    lineHeight: 1.65
  comparison-body:
    fontFamily: '"DM Sans", Arial, sans-serif'
    fontSize: "16px"
    lineHeight: 1.75
  comparison-label:
    fontFamily: '"DM Sans", Arial, sans-serif'
    fontSize: "13px"
    fontWeight: 600
    lineHeight: 1.5
spacing:
  control-gap: "8px"
  compact: "20px"
  column-gap: "36px"
  section-gap: "45px"
  gutter: "6%"
components:
  primary-link:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.paper}"
    padding: "14px 24px"
  primary-link-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
  motion-button:
    textColor: "{colors.ink}"
    padding: "10px 0"
  chapter-navigation:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "0 6%"
  comparison-radio:
    textColor: "{colors.ink}"
    size: "17px"
  evidence-disclosure:
    textColor: "{colors.ink}"
    padding: "22px 0"
---

# Design System: Common Obligations

## Overview

**Creative North Star: "Crossing"**

Crossing combines ivory paper, charcoal engraved architecture and rust threads with expressive serif typography. The atmosphere is reflective and spacious: abstract boundaries and suspended fragments give the argument a material setting, while clear paper supports sustained reading.

Depth belongs to the illustrations. Semantic text, restrained native controls and unboxed comparisons remain calm and legible. The recurring thread is a visual motif; conceptual imagery never stands in for evidence.

**Key Characteristics:**

- Ivory reading surfaces and charcoal text.
- Engraved architectural imagery with precise rust SVG threads.
- Expressive serif headings paired with quiet sans-serif reading.
- Natural page flow, native controls and optional motion.

## Colors

One rust accent organizes a warm neutral palette. Frontmatter contains the normative values, drawn from the root properties in foundation.css.

### Primary

- **Rust** (`accent`): italic emphasis, primary action, active controls, focus outlines, thread strokes and occasional full-bleed closing emphasis.

### Neutral

- **Ivory Paper** (`paper`): page background and opaque reading surfaces.
- **Charcoal Ink** (`ink`): primary text and engraved architectural character; also the primary action's hover surface.
- **Muted Stone** (`muted`): supporting explanations, comparison descriptions and attribution.
- **Paper Seam** (`line`): fine separators between controls, options and disclosure rows.

**The Clear Paper Rule.** Place reading text on opaque paper where artwork passes behind its composition.

Measured contrast on paper is 13.56:1 for ink, 5.50:1 for muted text and 5.67:1 for rust. Seams are decorative separators, not a substitute for visible control state.

## Typography

Instrument Serif supplies display and heading roles with Georgia as fallback. DM Sans supplies body copy, navigation, controls and factual labels with Arial as fallback. Both families are self-hosted as WOFF2; Instrument Serif has actual regular and italic faces, and DM Sans is variable.

The type ramp pairs large, closely spaced, regular-weight serif headings with compact sans-serif controls and generous body leading. Use the frontmatter hierarchy rather than introducing a third family.

**The Semantic Type Rule.** Keep headings and argument text as semantic HTML, and use the real italic serif face for expressive emphasis.

Comparison descriptions use the comparison-body role with a maximum measure of 65ch; chapter paragraphs can reach 75ch. Full-essay reading uses 18px type with 1.85 leading in a 710px column. On small screens the default body becomes 16px. Display sizes contract fluidly, with the mobile display clamp at 59px–78px and chapter headings at 43px–60px.

## Layout

Use normal vertical document flow. Major sections center within 1440px with 6% horizontal gutters; chapter reading content centers within 1160px. Short explanations generally stop at 65ch, longer chapter paragraphs at 75ch. Separators and whitespace organize content without enclosing every item in a card.

Desktop comparison options share equal-width columns with a 36px gap and a fine vertical separator. At 1000px and below, three-option comparisons use two columns with the third spanning the row. At 600px and below, comparisons and most reading grids become one column with horizontal separators. Obligation detail columns collapse at 800px. Selected single options use a maximum 75ch column.

The chapter navigation remains sticky at the viewport top, with a 68px summary height, reduced to 60px on mobile. Its expanded links use four columns on desktop and two below 1000px. Keep anchor offsets clear of this control. Never introduce independently scrolling reading panels.

## Elevation & Depth

The interface has no box-shadow vocabulary. Depth comes from engraved imagery, multiply-blended distance layers, overlapping opaque paper, diagonal clipping and SVG thread placement.

The hero combines a distant landscape, SVG threads and a transparent foreground portal. Chapter scenes use their own distinct raster bases and the shared vector threads; the foreground portal is emitted only for the hero. Do not infer additional chapter foregrounds from unused CSS selectors.

**The Optional Motion Rule.** Artwork motion enhances natural scrolling; reading and comparison state never depend on it.

Scroll-linked transforms and temporary chapter-art pinning apply only above 1000px width, at least 700px height, with motion enabled and no reduced-motion preference. Mobile and reduced-motion modes retain static compositions and all content. The manual motion control also disables animation and transitions. Do not animate reading paragraphs.

## Shapes

The prevailing interface geometry is square and unboxed: flat rectangular actions, fine straight rules and open text columns. Native radio circles remain native. Architectural apertures, diagonal masks and curved thread paths supply the expressive geometry rather than a generalized rounded-card system.

Disclosure marks are inline, stroke-based SVG crosses, sized 24px with a 1.4 stroke; an open disclosure rotates the mark 45 degrees.

## Components

### Primary action

A flat rust link with paper text and an inline SVG arrow. Hover changes the background to ink while preserving paper text. It has a minimum height of 50px; mobile reduces padding to 12px 18px and text to 14px.

### Motion control

A native button with no filled background and one fine lower rule. It has a minimum 44px target and a text state supplied by the motion controller. Preserve the explicit pause/resume affordance.

### Chapter navigation

A native details disclosure on paper with top and bottom rules. The current chapter is rust and semibold; links retain at least 44px height. Expansion stays in document flow and exposes the full navigation.

### Comparison controls and columns

Use fieldset, legend and labelled native radios. Radio inputs are rust-accented; checked policy labels also gain rust text and semibold weight. Control labels have a minimum 44px height. Render all authored options into HTML; native radio selection and CSS determine the visible subset without requiring JavaScript.

Option columns remain unboxed, with serif titles, optional rust italic theses, sans-serif term labels and muted description text. Preserve the same readable layout when one option is selected.

### Evidence and reading disclosures

Use native details and summary with paper seams and inline SVG disclosure marks. Evidence summaries have a minimum 64px height. Expanded evidence can use two columns on desktop and one on mobile. Links inside evidence and essay text are underlined, with a 4px underline offset.

### Chapter artwork and reading frame

Combine a distinct conceptual base with the shared SVG thread motif. Overlay chapter headings on opaque paper and keep the following reading body in normal flow. Preserve the visible conceptual-illustration attribution and accessible figure description.

All links, buttons, summaries and inputs use a rust 2px focus-visible outline offset by 6px. Keep focus visible even when the surrounding illustration is clipped.

## Do's and Don'ts

- Do use opaque paper to protect text from artwork.
- Do retain semantic headings, native radio groups and native disclosures.
- Do use distinct chapter illustrations with the recurring SVG thread motif.
- Do preserve natural scrolling, visible keyboard focus and static reduced-motion compositions.
- Don't turn comparison text into independently scrolling panels.
- Don't present conceptual artwork or its thread as factual evidence or a causal relationship.
- Don't introduce shadows or a rounded-card system into the flat reading interface.
- Don't rasterize headings, controls or argument text.
