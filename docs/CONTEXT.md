# Common Obligations: conversation and development handoff

## Development update: 8 September 2026

The user subsequently authorised an npm modular refactor, deployment to commonobligations.org on their Clusterkit cluster, and additional imagery and transitions. The implementation is now an Astro static site: see README.md for the current structure, commands, validation and deployment contract. The buildless paths and untested-browser notes below describe the original import, not the current source tree.

Chapter components, shared scenario data, browser modules and styles are separated under src/. Two further conceptual illustrations accompany release and international coordination; prompts are in docs/ARTWORK.md. New state transitions respect motion preferences, and the manual motion control is available on mobile. Eight desktop/mobile browser journeys pass against nginx, and a desktop/mobile screenshot pass was completed.

Clusterkit infrastructure registration is committed separately. Live launch depends on applying that registration and completing the Site GitHub Actions workflow; consult the workflow and live domain for deployment status rather than assuming this handoff proves publication. The explicit launch request supersedes the earlier lack of publishing permission for this domain.

---

This is a comprehensive project-context export of the Common Obligations conversation. It records the user's intentions, the decisions we reached, the arguments behind them, the resulting implementation, and unfinished work. It is a curated handoff, not a verbatim transcript, and does not include unrelated personal context, hidden instructions, or credentials.

## Start here in a new chat

Suggested first message:

> Continue developing Common Obligations from this repository. Read docs/CONTEXT.md and README.md, then inspect the current site before making changes. Preserve the conceptual approach: curated comparisons of one shared situation under different conditions, not an exponentially branching game or a prediction engine. Visual and typographic beauty are central. Keep the long-form argument, evidence, counterarguments, accessibility, and mobile experience. Tell me what you understand and work on the next change I request. Do not assume I have approved publishing publicly or changing DNS merely because I ask for an edit.

The user's name is Prassanna Ravishankar; GitHub account: `prassanna-ravishankar`. They are a technically experienced AI/agents engineer and prefer concrete work, plain language, and minimal unnecessary confirmation. They use coding agents and want to continue the project across chats or locally.

## Project identity and locations

- Name chosen together: **Common Obligations**.
- Domain: **commonobligations.org**. The user explicitly confirmed purchasing it. Ownership was reported by the user; registrar and DNS were not inspected.
- Public source repository: https://github.com/prassanna-ravishankar/common-obligations
- Working private site: https://common-obligations.thenomadiccoder.chatgpt.site
- Original blog draft PR: https://github.com/prassanna-ravishankar/prassanna-ravishankar.github.io/pull/14
- Original blog file: `src/content/blog/common-obligations.md` on branch `blog/common-obligations` in the personal website repo. Last known state: draft PR, article `draft: true`. Recheck live GitHub state before changing it.
- The purchased domain has **not** been connected by this session. The public GitHub repo does not automatically publish the site on that domain.

The private site was deployed successfully using ChatGPT Sites. This repository is a portable export, with no dependence on that hosting service. It deliberately excludes the Sites project manifest, source credentials, and unrelated files.

## Original idea and evolution

The user began with an unused domain named around “the sovereign AI framework .ai” and wondered whether they could write commandments or a framework for all AI companies: foundation models, agents, data, and others.

They clarified that their concern was the international race: governments compete while society waits for something like an independent global regulator, drawing an analogy to the atomic regulator or the UN. The objective became shared obligations that remain meaningful regardless of which company or country leads.

The initial discussion clarified that the IAEA is not a global authority with automatic jurisdiction over everything nuclear. Its safeguards operate through international agreements and defined access; national authorities retain regulatory responsibilities. An AI proposal needs a concrete job description, access to evidence, legitimacy, and enforcement mechanisms.

The user wanted readability and accessibility comparable to AI 2027. This was a request for communication quality and reach, not an instruction to copy its predictions, presentation, or prose. We discussed a readable essay, memorable commitments, specific examples, and a deeper practical framework.

The user shared OpenAI's “An Alien Mind” (https://openai.com/index/an-alien-mind/), published 6 September 2026, noting the timing. Its discussion of recursive self-improvement, collective restraint, mandated safety requirements, and international coordination connected to the idea. The essay attributes the account to Jakub Pachocki and treats it as an interested participant's assessment, partly based on internal evidence, rather than independent proof or an international agreement.

The user then explicitly rejected letting the previously owned sovereign-AI domain constrain the project: “I don’t want to box us in.” We broadened the question to what AI builders owe everyone else and how those obligations can hold. Neither national sovereignty nor one particular institutional model should determine the answer in advance.

The user asked for the essay to be written, a new domain chosen, and a blog draft placed in their personal GitHub website. We chose Common Obligations / commonobligations.org, wrote approximately 2,700 words, generated a cover image, and created draft PR #14. The user subsequently bought the domain.

## Central argument

The freedom to build powerful AI should come with responsibilities to people who never chose to use it.

Companies can sincerely seek safety while having incentives to advance quickly. Governments can sincerely seek public protection while pursuing economic and strategic leadership. Neither should settle everyone else's acceptable exposure to risk on its own.

The proposal should be understandable to an ordinary reader, implementable by an engineer, and examinable by an independent body. Apply it across model developers, agent providers, data suppliers, deployers, and government users. Responsibilities vary with actual control, capability, deployment conditions, and impact.

This is an initial public proposal, not an established standard, certification, regulator, organisation with members, or claim of adoption. Do not invent endorsements, institutions, signatories, metrics, or a successful movement.

## The six obligations

1. **Keep responsibility traceable.** Name the operator and supplier responsibilities; retain evidence of material decisions and data provenance. Delegation does not erase responsibility, but suppliers are not automatically responsible for every downstream act.
2. **Match power with evidence.** Assess actual system versions, permissions, environments, limitations, and material changes. A model suggesting an action differs from an agent authorised to execute it. Avoid pretending one benchmark or invented threshold proves safety.
3. **Make scrutiny independent.** Qualified outsiders need meaningful access and routes to report adverse findings. Confidential access may protect sensitive evidence. Evaluators themselves need oversight and conflict disclosure.
4. **Bound autonomy and prepare for failure.** Enforce limits outside the model, bound delegated authority, expire credentials, test containment and recovery, and explain what cannot be recalled or reversed.
5. **Report serious failures so others can learn.** Define incident thresholds, recipients, deadlines, confidentiality, and later public reporting. Distinguish observations from hypotheses and honest disclosure from concealment.
6. **Give affected people a way to challenge.** Provide notice, explanations, workable appeals, and remedies. Following later feedback, this explicitly includes challenging the legitimacy of a system's use, not just correcting its output.

Enforcement discussion includes version-specific public records, procurement and contractual requirements, independent evaluation, coordinated public authorities, possible international agreements, proportional restrictions, explicit restart conditions, time-limited emergency powers, and appeals. No final institutional form was settled.

Anti-capture safeguards are central: affordable requirements proportionate to risk, multiple evaluators, transparent methods and funding, support for small developers, open research, and representation beyond big labs and compute-rich countries.

## Feedback that shaped the visual site

The user relayed two pieces of feedback:

> “might be interesting to quote some relevant failures in the world of AI so far that motivate the need for what youre suggesting”

> “the China vs US narrative that seems so present in people's minds is also interesting to consider here. open-source vs closed-source as well”

They added surveillance, especially Flock cameras, as an example.

We agreed to use a few documented cases linked to concrete obligations, not a catalogue of AI disasters. Distinguish allegations, settlements, advocacy accounts, provider claims, and findings. Do not imply that an illustrative scenario documents how every named provider operates.

Surveillance matters because a person can be exposed without choosing the system. A perfectly accurate system can still enable an unacceptable use of power. Ask who permits collection, searches, sharing, retention, and new uses; who can investigate misuse; and whether a use should be authorised at all. Governments must be subject to scrutiny of their own deployments.

For US–China competition, state the strongest objection to unilateral restraint. Examine reciprocal commitments, verifiable compliance, evasion, non-participation, national-security costs, and the role of countries outside that rivalry. Do not reduce the entire world to two countries or pretend promises alone solve the incentive problem.

Open versus closed is a separate dimension from safety or deployment control. Openly released weights can support scrutiny, adaptation, and distributed participation, while being difficult to recall. Provider-controlled access can enforce restrictions and updates while concentrating discretion. Open weights are not automatically open source. Neither category automatically resolves accountability.

## The visual-experience discussion

The user asked for a “beautiful, animated, sometimes parallaxy, timeliney way of things panning out and how checks and balances at right spots can change the future,” with substantial text available to readers who want depth.

We initially proposed an unfolding timeline with decision forks. The user asked how readers could see both sides, and we suggested keeping corresponding moments aligned, showing benefits and costs side by side, and making assumptions visible.

The user identified exponential branching: each later fork doubles the number of paths. We considered branching and rejoining chapters while retaining consequences, but then the user asked for a better first-principles approach.

The final conceptual direction was:

- **One shared situation, examined under different conditions.**
- The goal is to understand what a decision changes, who bears the consequences, and when a safeguard helps or fails.
- **The world:** visually explain the system and where power sits.
- **The intervention:** change one rule and inspect plausible effects against the original condition.
- **The evidence:** open sources, uncertainties, and strong objections.
- A timeline can progress from collection to deployment to widespread dependence. Time provides context; comparison does the teaching.
- Curate meaningful comparisons rather than supporting every combination of policies. An arbitrary interactive combination engine would imply a reliable model of society we do not possess.
- No numerical “good future” score and no winning route. Show who benefits, what becomes harder, and what remains uncertain.
- Strong arguments on both sides do not require equal evidential weight. The project can advocate a position while showing its reasoning and what could change it.
- The end should clarify where accountability matters, not claim that a preferred policy guarantees a good future.

The user then asked: “Can you build it out, visual and typographic beauty is key. Build images wherever needed.” The website in this repo is the first implemented response.

## Current implementation

A buildless, single-page site using semantic HTML, CSS, and vanilla JavaScript. Serve `public/` directly. No package installation, backend, database, authentication code, form handling, or build step is required.

- `public/index.html`: all narrative sections, six obligation accordions, citations, source notes, and full original essay.
- `public/style.css`: responsive layout, large serif typography, muted monochrome/green surfaces, rust-red accent, parallax-related styling, reveals, print styles, and reduced-motion support.
- `public/app.js`: comparison content and event handlers, scrolling progress, chapter highlights, subtle hero parallax, reveal animations, and motion control.
- `public/assets/city.webp`: aerial night-city conceptual illustration.
- `public/assets/street.webp`: generic security camera overlooking a pedestrian, conceptual illustration.
- `public/favicon.svg`: a simple typographic co mark.
- `README.md`: local preview, editing, and hosting instructions.

Typography: Instrument Serif for display and DM Sans for body, loaded from Google Fonts with fallbacks. Hero text: “The future is a series of decisions.” Large editorial serif headlines, generous whitespace, monochrome cinematic images, restrained rust-red accents, dark surveillance chapter, and deep muted-green international chapter.

### Sections and controls

1. Opening question and city artwork, followed by the project's premise and an explicit scenario-not-forecast note.
2. Sticky chapter navigation.
3. **The watching city:** three stages (Collect, Connect, Act). At every stage compare operator discretion with an independent check. The result includes what the condition enables, its cost, and who feels the difference. A button opens both conditions side by side. The photograph zooms subtly between stages; it is not a geographical simulation.
4. **The release decision:** a simple functional diagram distinguishes a model that suggests an action from an agent that can execute it. Three selectable approaches: developer assessment, independent evaluation, limited deployment. Each exposes the argument, unresolved cost, and dependencies. Open/closed considerations appear alongside.
5. **The race to lead:** examine promises versus verified commitments. Show benefits of moving first, arguments for common limits, and weaknesses of verification. The state-A/state-B relationship is conceptual, not a model of government behaviour.
6. Six expandable obligations, each with evidence examples and failure conditions.
7. Closing question: “Where can we still change what happens next?”
8. Full essay accordion and source/editorial notes. The full essay preserves the initial draft; visual chapters incorporate later feedback. A future editorial pass should decide how to integrate them into one updated reading edition.

### Motion and accessibility

Semantic buttons use `aria-pressed`; comparison reveal uses `aria-expanded`; dynamic surveillance and release results use live regions. Native details/summary elements carry deeper reading. There is a skip link, visible focus styling, internal section anchors, reduced-motion CSS and scripting, and system-font fallbacks.

A manual motion toggle is currently visible on wide desktops but hidden by CSS at narrower widths. System reduced-motion preferences still apply. Consider making manual motion control available at all sizes in a future accessibility pass.

The basic essay, obligation explanations, and evidence notes remain available without JavaScript. Interactive comparisons require JavaScript. Print CSS exists, but printing and all details expansion need real-browser verification.

## Evidence and source notes

- OpenAI / Jakub Pachocki: https://openai.com/index/an-alien-mind/
  Participant's argument on recursive self-improvement, safety bars, and coordination. Avoid treating private internal results as independently verified evidence.
- FTC Rite Aid announcement: https://www.ftc.gov/news-events/news/press-releases/2023/12/rite-aid-banned-using-ai-facial-recognition-after-ftc-says-retailer-deployed-technology-without
  The visual site describes the agency's December 2023 allegations and proposed settlement, including alleged false positives and insufficient testing. It deliberately does not assert all allegations were adjudicated.
- Robert Williams / Detroit settlement: https://www.aclu.org/press-releases/civil-rights-advocates-achieve-the-nations-strongest-police-department-policy-on-facial-recognition-technology
  An account from his legal representatives, with settlement links; wrongful arrest in 2020, settlement in June 2024, independent corroboration requirements and audit. Attribution is explicit.
- Flock trust page: https://www.flocksafety.com/trust
  Provider account of products and privacy/customer controls. The page links to it without asserting independent verification of every deployment. Plate recognition and facial recognition are explicitly distinguished.
- IAEA safeguards: https://www.iaea.org/topics/basics-of-iaea-safeguards
- UN scientific panel/global dialogue: https://www.un.org/global-digital-compact/en/ai
- OECD AI Principles: https://www.oecd.org/en/topics/sub-issues/ai-principles.html
- NIST AI RMF: https://www.nist.gov/itl/ai-risk-management-framework
- Open Source AI Definition: https://opensource.org/ai/open-source-ai-definition

Sources and contemporary institutional claims should be checked again when revising or launching. Some UN pages were accessible through search snippets but returned access errors when opened directly in the research environment. Do not invent supporting details from those failures.

## Artwork provenance

Two images were generated specifically for this visual site using the built-in image generation tool and converted to WebP. They are labelled conceptual AI illustrations, not documentary photographs or actual Flock hardware installations.

Image briefs:

1. Wide cinematic monochrome aerial city, intersecting luminous roads and headlights, high contrast deep blacks and silvery light, analog grain, collective systems and unseen power; no text, logos, specific real location, or surveillance UI.
2. Wide cinematic monochrome city street, lone pedestrian beneath a streetlight, generic security camera prominent in foreground, wet pavement and atmospheric depth; no identifiable real location, Flock branding, text, or documentary claim.

The earlier personal-blog cover is a separate coloured abstract illustration with luminous paths sharing a foundation. It is not used by this visual site.

## Writing preferences and scope boundaries

The personal website repository includes `.claude/skills/long-form-writing/SKILL.md`. Its relevant preferences were read and applied to the draft: connected prose, paragraphs developing full ideas, concrete examples, deliberate rhythm, epistemic honesty, no em dashes, no marketing language, and no unnecessary bullet-heavy exposition.

Use clear accessible language without flattening difficult tradeoffs. Preserve technical substance where it supports the argument. Avoid pretending uncertainty has been resolved. Do not force the project back under a sovereign-AI identity or a predetermined global-regulator blueprint.

The user values beautiful visuals and typography, not merely a page advertising an eventual experience. Continue building the actual comparisons and narrative. Avoid speculative forms, signups, donations, scores, dashboards, or claims of community adoption that were never requested.

## Validation and known limitations

Completed for the first visual version:

- JavaScript syntax checked with Node.
- Local image, script, stylesheet, and favicon references verified.
- Internal anchor targets and duplicate HTML IDs checked.
- Original generated images inspected.
- Private hosting deployment confirmed succeeded.

**Not completed:** browser-based interaction testing, responsive screenshots, visual QA, keyboard journey testing, external-font loading checks in the final browser, and print rendering. Do not describe the first version as browser-tested. The earlier personal-blog Astro production build passed, but that is a separate project and not proof of this site's browser behaviour.

This is a coherent first implementation, not a fully validated public launch. The site's comparisons are editorially authored, not computed causal forecasts. More elaborate animation, deeper timeline progression, and polished transition choreography remain possible refinements, subject to the user's direction.

## Current request and next steps

The user requested a new public GitHub repo for this website. The GitHub connection could write to repositories but could not create them. A portable ZIP was prepared with `public/`, README, and `.gitignore`. The user manually created the public repo and said “created.” The repository was confirmed public and initially empty. This source import includes the website, artwork, local preview instructions, and this handoff.

During upload, the user also asked: “and once done, can you export all this conversational context so i can continue the development from a new chat?” This document answers that request and is intended to travel with the source.

Useful follow-on work, not automatically authorised new tasks:

- Ask what the user thought of the actual first version and iterate from that feedback.
- Run explicitly requested browser/visual QA, including every comparison, keyboard access, mobile layout, font loading, motion preferences, and reading view.
- Improve the read-only experience and reconcile the original essay with the expanded visual argument.
- Refine copy after checking sources, particularly government surveillance, international competition, and open-model distinctions.
- Select public hosting and configure commonobligations.org when the user requests launch/domain connection. The public source repo alone is not that connection.
- Choose a licence if the user wants one. No software or content licence has been selected; do not invent a licence grant.

For local work, use `python3 -m http.server 8000 --directory public`. Refer to README for the rest. Never reuse or request disclosure of prior hosting credentials; those are intentionally absent from this repository.
