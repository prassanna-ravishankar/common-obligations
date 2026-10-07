import { getCollection, getEntry, type CollectionEntry } from "astro:content";

export type Obligation = CollectionEntry<"obligations">;
export type Event = CollectionEntry<"events">;
export type Case = CollectionEntry<"cases">;
export type Source = CollectionEntry<"sources">;

export const site = async () => (await getEntry("site", "site"))!.data;

export async function obligations() {
  return (await getCollection("obligations")).sort(
    (a, b) => a.data.number - b.data.number,
  );
}

export const href = (o: Obligation) => `/obligations/${o.data.slug}/`;
export const pad = (n: number) => String(n).padStart(2, "0");

/** Events for one obligation (or all), newest first. */
export async function events(number?: number) {
  return (await getCollection("events"))
    .filter((e) => number === undefined || e.data.obligations.includes(number))
    .sort((a, b) => b.data.date.localeCompare(a.data.date));
}

export async function source(ref: { id: string }) {
  const entry = await getEntry("sources", ref.id);
  if (!entry) throw new Error(`unknown source ${ref.id}`);
  return entry;
}

export async function neighbours(o: Obligation) {
  const all = await obligations();
  const i = all.findIndex((x) => x.id === o.id);
  return { prev: all[i - 1], next: all[i + 1] };
}

/** The three registers a reader can be in, named on every section. */
export const REGISTER = {
  proposed: "Proposed",
  illustrative: "Illustrative",
  reported: "Reported",
} as const;

/** Field labels for a policy option, shared by every case. */
export const OPTION_LABELS = {
  benefit: "The strongest case",
  cost: "What it asks us to accept",
  people: "Who feels the difference",
  evidence: "What would need to be shown",
  dependsOn: "Depends on",
} as const;
