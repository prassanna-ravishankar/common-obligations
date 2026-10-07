// Test expectations come from the content itself, so a page can never pass by
// matching strings the test happens to know.
import { readdirSync, readFileSync } from "node:fs";
import yaml from "js-yaml";

const dir = new URL("../src/content/", import.meta.url);
const read = (p) => readFileSync(new URL(p, dir), "utf8");
const front = (md) => yaml.load(md.split(/^---$/m)[1]);

export const sources = yaml.load(read("sources.yaml"));
export const events = yaml.load(read("events.yaml"));
export const cases = Object.fromEntries(
  readdirSync(new URL("cases/", dir)).map((f) => [
    f.replace(".yaml", ""),
    yaml.load(read(`cases/${f}`)),
  ]),
);
export const obligations = readdirSync(new URL("obligations/", dir))
  .map((f) => front(read(`obligations/${f}`)))
  .sort((a, b) => a.number - b.number);
export const home = front(read("pages/home.md"));
export const sourceById = Object.fromEntries(sources.map((s) => [s.id, s]));
