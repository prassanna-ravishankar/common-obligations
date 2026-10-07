// Fragments on the single-page edition, mapped to where that content lives now.
// Fragments never reach the server, so these are resolved on the home page.
const ob = (slug: string, frag = "") => `/obligations/${slug}/${frag}`;
export const LEGACY: Record<string, string> = {
  timeline: "/record/",
  introduction: "/",
  provision: "/",
  decisions: "/#obligations",
  obligations: "/#obligations",
  reading: "/essay/",
  "essay-content": "/essay/",
  "economy-essay": "/essay/#economy-essay",
  surveillance: ob("recourse", "#case"),
  "story-stage-0": ob("recourse", "#decision-collection"),
  "story-stage-1": ob("recourse", "#decision-connection"),
  "story-stage-2": ob("recourse", "#decision-consequence"),
  "surveillance-0-all": ob("recourse", "#decision-collection"),
  "surveillance-1-all": ob("recourse", "#decision-connection"),
  "surveillance-2-all": ob("recourse", "#decision-consequence"),
  release: ob("evidence", "#case"),
  "release-approach-all": ob("evidence", "#decision-release"),
  defense: ob("failures", "#case"),
  "defense-access-all": ob("failures", "#decision-access"),
  discovery: ob("traceable", "#case"),
  "discovery-publication-all": ob("traceable", "#decision-publication"),
  incident: ob("autonomy", "#case"),
  "incident-contain": ob("autonomy", "#decision-contain"),
  "incident-investigate": ob("autonomy", "#decision-investigate"),
  "incident-resume": ob("autonomy", "#decision-resume"),
  "incident-contain-all": ob("autonomy", "#decision-contain"),
  "incident-investigate-all": ob("autonomy", "#decision-investigate"),
  "incident-resume-all": ob("autonomy", "#decision-resume"),
  race: ob("scrutiny", "#case"),
  "coordination-agreement-all": ob("scrutiny", "#decision-agreement"),
  "obligation-1": ob("traceable"),
  "obligation-2": ob("evidence"),
  "obligation-3": ob("scrutiny"),
  "obligation-4": ob("autonomy"),
  "obligation-5": ob("failures"),
  "obligation-6": ob("recourse"),
};
// Old timeline rows were #timeline-<event id>; events keep their ids on the record.
export const resolve = (hash: string) => {
  const id = decodeURIComponent(hash.replace(/^#/, ""));
  if (id.startsWith("timeline-"))
    return `/record/#${id.slice("timeline-".length)}`;
  return LEGACY[id];
};
