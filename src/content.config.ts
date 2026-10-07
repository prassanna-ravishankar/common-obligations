import { defineCollection, reference } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

// Every human-facing string. Em and en dashes are banned site-wide.
const prose = z
  .string()
  .min(1)
  .refine((s) => !/[–—]/.test(s), "no em or en dashes");
const isoDay = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const isoMonth = z.string().regex(/^\d{4}-\d{2}$/);
const obligationNumber = z.number().int().min(1).max(6);
const figureName = z.enum([
  "switchyard",
  "relay",
  "scaffold",
  "loupe",
  "paddock",
  "beacons",
  "hatches",
]);
// A field that may differ between a case's framings (the incident case).
const framed = z.union([prose, z.record(z.string(), prose)]);

const sources = defineCollection({
  loader: file("src/content/sources.yaml"),
  schema: z.object({
    publisher: prose,
    title: prose,
    url: z.url(),
    kind: z.enum([
      "provider",
      "advocate",
      "regulator",
      "researcher",
      "press",
      "institution",
      "event",
    ]),
    publishedOn: isoDay.optional(),
    updatedOn: isoDay.optional(),
    checkedOn: isoDay.optional(),
  }),
});

// Dates describe publication, disclosure or signing, never retrieval.
const events = defineCollection({
  loader: file("src/content/events.yaml"),
  schema: z
    .object({
      date: isoDay,
      dateKind: prose,
      title: prose,
      summary: prose,
      limit: prose,
      occurredOn: isoMonth.optional(),
      occurredLabel: prose.optional(),
      obligations: z.array(obligationNumber).min(1),
      source: reference("sources"),
    })
    .refine((e) => !e.occurredOn || e.occurredLabel, {
      message: "occurredOn needs an occurredLabel",
    })
    .refine((e) => !e.occurredOn || e.occurredOn <= e.date.slice(0, 7), {
      message: "an event cannot occur after it is reported",
    }),
});

const option = z.object({
  name: prose,
  thesis: prose.optional(),
  summary: prose,
  tradeoff: prose,
  benefit: prose,
  cost: prose,
  people: prose.optional(),
  evidence: framed.optional(),
  dependsOn: prose.optional(),
});

const cases = defineCollection({
  loader: glob({ base: "./src/content/cases", pattern: "*.yaml" }),
  schema: z.object({
    obligation: obligationNumber,
    title: prose,
    question: prose,
    situation: prose,
    framings: z
      .array(z.object({ id: z.string(), label: prose, note: prose.optional() }))
      .optional(),
    decisions: z
      .array(
        z.object({
          id: z.string(),
          prompt: prose,
          context: framed,
          obligations: z.array(obligationNumber).optional(),
          options: z.array(option).min(2),
        }),
      )
      .min(1),
    accounts: z.array(
      z.object({
        title: prose,
        label: prose,
        occurred: prose.optional(),
        disclosed: prose.optional(),
        paragraphs: z.array(prose).min(1),
        source: reference("sources"),
        also: z.array(reference("sources")).optional(),
      }),
    ),
    notes: z.array(prose).optional(),
    inference: prose,
    takeaway: prose,
  }),
});

const obligations = defineCollection({
  loader: glob({ base: "./src/content/obligations", pattern: "*.md" }),
  schema: z.object({
    number: obligationNumber,
    slug: z.string().regex(/^[a-z]+$/),
    title: prose,
    short: prose.refine((s) => s.length <= 120, "short must be quotable"),
    prevents: prose,
    figure: figureName,
    parts: z.object({ rest: prose, items: z.array(prose).min(3) }),
    case: reference("cases"),
    evidence: z.array(prose).min(1),
    failure: z.array(prose).min(1),
    objections: z.array(z.object({ claim: prose, answer: prose })).min(1),
    sources: z.array(reference("sources")),
  }),
});

const section = z.object({ heading: prose, lede: prose.optional() });
const pages = defineCollection({
  loader: glob({ base: "./src/content/pages", pattern: "*.md" }),
  schema: z.object({
    title: prose,
    description: prose,
    claim: prose.optional(),
    standfirst: prose.optional(),
    reviewed: isoDay.optional(),
    figure: z.object({ name: figureName, label: prose }).optional(),
    scope: prose.optional(),
    whyNow: section.extend({ events: z.array(reference("events")) }).optional(),
    obligationsIntro: section.optional(),
    objections: section
      .extend({ items: z.array(z.object({ claim: prose, answer: prose })) })
      .optional(),
    ask: section
      .extend({
        groups: z.array(z.object({ who: prose, items: z.array(prose) })),
      })
      .optional(),
    furtherReading: section.extend({ record: prose, essay: prose }).optional(),
  }),
});

const site = defineCollection({
  loader: file("src/content/site.yaml"),
  schema: z.object({
    name: prose,
    url: z.url(),
    author: prose,
    authorUrl: z.url(),
    byline: prose,
    nav: z.array(z.object({ label: prose, href: z.string() })),
  }),
});

export const collections = {
  sources,
  events,
  cases,
  obligations,
  pages,
  site,
};
