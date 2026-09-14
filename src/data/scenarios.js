export const scenarios = [
  {
    id: "surveillance",
    number: "01",
    title: "The watching city",
    question: "A stolen car is found. Who else is being watched?",
    lens: "Legitimacy",
  },
  {
    id: "release",
    number: "02",
    title: "The release decision",
    question: "It can suggest an action. Is it ready to carry one out?",
    lens: "Readiness",
  },
  {
    id: "defense",
    number: "03",
    title: "The defensive advantage",
    question: "A small team protects software we depend on. Who helps them?",
    lens: "Access",
  },
  {
    id: "discovery",
    number: "04",
    title: "The discovery",
    question: "Researchers can check a result. Can they build on it?",
    lens: "Understanding",
  },
  {
    id: "incident",
    number: "05",
    title: "After the boundary fails",
    question: "Something has gone wrong. When is it safe to restart?",
    lens: "Recovery",
  },
  {
    id: "race",
    number: "06",
    title: "The race to lead",
    question: "An outside team finds a serious risk. What happens next?",
    lens: "Cooperation",
  },
];
export const defenseOptions = [
  {
    name: "Broad access",
    summary:
      "Give defenders access to tools that find security flaws, including small teams the provider might otherwise overlook.",
    tradeoff:
      "Attackers may use the same capability. Finding a flaw also does not give a maintainer the time or money to fix it.",
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
    summary:
      "Give selected defenders access first, so they can find and repair weaknesses before the tools become widely available.",
    tradeoff:
      "The provider decides who gets help. Less-connected maintainers may be left protecting important software without the same tools.",
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
    summary:
      "Give maintainers the tools, computing resources and repair funding they need to protect the software people depend on.",
    tradeoff:
      "Someone still chooses who receives support. Users benefit only when repairs reach them, and the tools can still be misused.",
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
    summary:
      "Publish the result and its proof promptly, so other researchers can check the work and start using it.",
    tradeoff:
      "A proof can be checkable without being understandable. Explaining and maintaining the work may fall to people who received neither credit nor funding.",
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
    summary:
      "Share explanations, examples and support alongside the proof, so other researchers can understand the ideas and build on them.",
    tradeoff:
      "That work takes time and may delay publication. Requiring approval from established experts can also exclude new contributors.",
    benefit:
      "Pair verification with readable exposition, expert collaboration, peer review, and examples that reveal reusable ideas.",
    cost: "This takes time and resources and can delay publication. Requiring established experts to approve everything can also entrench existing gatekeepers.",
    people:
      "Researchers and learners gain more usable knowledge; contributors need credit and support for the work of explanation.",
    evidence:
      "An accountable author, contribution records, talks and explanatory materials, independent review, and a supported handoff when authors cannot finish the work.",
  },
];
