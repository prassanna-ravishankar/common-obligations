export const scenarios = [
  {
    id: "surveillance",
    number: "01",
    title: "The watching city",
    question: "When does a useful tool become an unacceptable use of power?",
    lens: "Legitimacy",
  },
  {
    id: "release",
    number: "02",
    title: "The release decision",
    question: "What evidence should accompany greater authority?",
    lens: "Readiness",
  },
  {
    id: "defense",
    number: "03",
    title: "The defensive advantage",
    question: "Who gets the tools to protect everyone else?",
    lens: "Access",
  },
  {
    id: "discovery",
    number: "04",
    title: "The discovery",
    question: "A result is verified. Who helps us understand it?",
    lens: "Understanding",
  },
  {
    id: "incident",
    number: "05",
    title: "After the boundary fails",
    question: "What must we establish before work resumes?",
    lens: "Recovery",
  },
  {
    id: "race",
    number: "06",
    title: "The race to lead",
    question: "What makes a shared commitment credible?",
    lens: "Cooperation",
  },
];
export const defenseOptions = [
  {
    name: "Broad access",
    benefit:
      "Defenders can examine their own systems without waiting for a provider to select them. Small teams can investigate neglected software.",
    cost: "The same capability may accelerate exploitation. Access alone does not give maintainers time or resources to repair what is found.",
    people:
      "Small defenders gain access; users of vulnerable systems bear exposure if exploitation outruns patching.",
    evidence:
      "Authorised testing boundaries, measured defensive outcomes, abuse monitoring where feasible, and a coordinated disclosure process.",
  },
  {
    name: "Vetted access",
    benefit:
      "A staged programme can give selected defenders time to investigate and repair flaws before broader availability.",
    cost: "The provider becomes a gatekeeper. Selection can favour well-connected organisations and exclude people protecting less visible systems.",
    people:
      "Selected participants gain a head start; excluded maintainers depend on others to find and communicate their risks.",
    evidence:
      "Published eligibility criteria, time-limited restrictions, an appeal route, and evidence that findings reach affected maintainers.",
  },
  {
    name: "Supported maintainer access",
    benefit:
      "Pair scoped access with compute, triage support, and repair funding for maintainers responsible for widely used dependencies.",
    cost: "Choosing recipients remains a power. Funding can create dependency, and additional access still carries misuse risk.",
    people:
      "Maintainers gain capacity to act; downstream users benefit only if fixes are adopted. Neglected projects still need representation.",
    evidence:
      "Transparent selection, conflict disclosures, support for under-resourced projects, patch validation, and uptake rather than bug counts alone.",
  },
];
export const discoveryOptions = [
  {
    name: "Publish the verified result",
    benefit:
      "Make the claim and its proof available promptly so others can check it and begin working with it.",
    cost: "A technically checkable artefact may remain difficult to understand. Exposition and maintenance can fall to people who did not receive the credit or funding.",
    people:
      "Specialists may gain an early result; students and neighbouring fields may lack a usable explanation.",
    evidence:
      "The precise theorem and assumptions, reproducible verification instructions, dependency versions, limitations, and provenance of the work.",
  },
  {
    name: "Develop it with the community",
    benefit:
      "Pair verification with readable exposition, expert collaboration, peer review, and examples that reveal reusable ideas.",
    cost: "This takes time and resources and can delay publication. Requiring established experts to approve everything can also entrench existing gatekeepers.",
    people:
      "Researchers and learners gain more usable knowledge; contributors need credit and support for the work of explanation.",
    evidence:
      "An accountable author, contribution records, talks and explanatory materials, independent review, and a supported handoff when authors cannot finish the work.",
  },
];
