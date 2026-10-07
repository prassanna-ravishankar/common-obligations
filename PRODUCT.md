# Common Obligations

## Purpose

An independent proposal by Prassanna Ravishankar: the freedom to build powerful AI should come with obligations to the people it affects. A reader with no background in AI governance should leave knowing six concrete obligations, why each matters, and what each asks of the people who build, buy and regulate these systems. They should be able to quote it.

## Readers

People affected by systems they did not choose, first. Engineers, buyers and policy readers second: they can go deeper on each obligation page, in the record and in the essay.

## Structure

- `/` states the proposal on one page: the claim, its scope, why now, the six obligations, the strongest objections, and what it asks.
- `/obligations/<slug>/` gives each obligation one canonical home: what it asks, what compliance looks like, the illustrative case that tests it, the documented accounts that case draws on, the dated record, where it can fail, and its sources.
- `/record/` is the dated record of events the proposal cites.
- `/essay/` is the full argument.

The six scenarios of the earlier edition are the cases on the obligation pages, one each, with every option and its reasoning kept. They are no longer a sequence every reader walks through.

## Editorial invariants

1. **Date honesty.** An event is dated by when it was reported, disclosed or signed. When it happened earlier, that is shown separately and labelled. Retrieval dates are never event dates.
2. **Registers are named.** Every section says whether it is the proposal (Proposed), an authored comparison that predicts nothing (Illustrative), or a documented event (Reported).
3. **No implied credit or endorsement.** A law, programme or company commitment is described, not enlisted as support for this proposal or as evidence that it caused anything.
4. **Attribution.** Every factual claim links its source; provider statements and advocates' accounts are identified as such.
5. **Plain language.** No jargon without a gloss. No em or en dashes anywhere, including titles.
6. **Quotable units.** Each obligation has a one-sentence short form of at most 120 characters.
7. **Substance belongs to the author.** Claims, obligation wording, objection answers, the ask and any dated fact change only with Prassanna's approval. Presentation does not need it.

## Access

Every page is complete without JavaScript, on a phone, in dark mode and under reduced motion. Figures self-tour only when motion is allowed and can be paused from the header.

## Content lives in `src/content`

Schemas in `src/content.config.ts` enforce the invariants they can: no dashes, dates in ISO form, an occurrence label wherever an occurrence date is given, an event never occurring after it is reported, each obligation tied to exactly one case. See `docs/CONTENT.md`.
