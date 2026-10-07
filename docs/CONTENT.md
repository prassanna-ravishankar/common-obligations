# Content

All copy lives in `src/content`; pages only arrange it. Schemas are in `src/content.config.ts`.

| File                                     | Holds                                                                                                                                                                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `obligations/N-slug.md`                  | One obligation: title, short form (at most 120 characters), what it prevents, its figure and the items the figure's read-out names (`parts`), compliance evidence, failure modes, objections, sources. The body is "What it asks". |
| `cases/<slug>.yaml`                      | The illustrative case on that obligation's page: situation, decisions, every option with its reasoning, the documented accounts it draws on, notes and the inference.                                                              |
| `events.yaml`                            | The dated record. `date` is when it was reported, disclosed or signed; `occurredOn` (a month) is when it happened, if earlier, and needs an `occurredLabel`.                                                                       |
| `sources.yaml`                           | Every source the site cites, once. `checkedOn` is the date it was last verified, never an event date.                                                                                                                              |
| `pages/home.md`, `record.md`, `essay.md` | Page copy. The essay body is HTML; its section ids are stable link targets.                                                                                                                                                        |

Adding an event: add it to `events.yaml` with its source in `sources.yaml`, list the obligations it bears on, and write its `limit` (what the date and the source do and do not establish). It then appears on the record, on each obligation page it bears on, and on the axis.

No em or en dashes anywhere: the schemas and `npm run lint:content` reject them.
