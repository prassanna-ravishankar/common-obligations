---
number: 1
slug: traceable
title: Keep responsibility traceable.
short: Know who is responsible for an AI system, including when the work passes between companies.
prevents: Harm that falls into the gap between suppliers, with no one left to answer for it.
figure: relay
parts:
  rest: deployer, answerable
  items:
    - employer, named
    - agent provider, named
    - data supplier, named
    - model developer, named
    - tool server, named
case: traceable
evidence:
  - A named operator for every consequential system.
  - Records of material decisions, data provenance and permissions.
  - Documented responsibilities at every handoff between suppliers, including software dependencies, gateways, tool servers and research contributions.
failure:
  - Records become paperwork if no one has the authority or resources to investigate and repair harm.
objections:
  - claim: Supply chains are too complex to trace.
    answer: The obligation asks for a usable record of who knew what, who could change what, and who decided to proceed, not for every supplier to answer for every downstream act.
  - claim: Responsibility will just be pushed onto the smallest supplier.
    answer: The organisation deploying a system stays answerable for that deployment, even when its investigation later finds a supplier at fault.
sources:
  - openai-navier-stokes
  - tao-blowup
---

Every consequential AI system should have an identifiable organisation responsible for its operation, and a clear account of the responsibilities held by its suppliers. The person affected should have somewhere to go when something fails.

Consider a hiring service assembled from a foundation model, a candidate database, and an agent that ranks applicants. The employer controls the decision to use the ranking. The agent provider controls its workflow. The data supplier controls the information it supplies and what it says about that information. The model developer controls the underlying release and its documented limitations. Those responsibilities overlap, but they need not disappear into the overlap.

Each participant should document the decisions it controls, preserve the evidence needed to investigate failures, and identify the organisation receiving that responsibility at the next handoff. For the data supplier, this includes origin, permission to use the data, known gaps, and a process for corrections. A claim that a dataset is representative needs an explanation of whom it represents and for which purpose.

This obligation does not make every supplier responsible for every downstream act. It does require a usable record of who knew what, who could change what, and who decided to proceed. An organisation deploying a system should remain answerable for that deployment even when its investigation later identifies a supplier’s fault.
