---
number: 2
slug: evidence
title: Match power with evidence.
short: Ask for stronger safety evidence as a system gains the power to do more harm.
prevents: A system given authority to act on the strength of tests that never examined that authority.
figure: scaffold
parts:
  rest: suggests, 1 check
  items:
    - suggests, 1 check
    - drafts, 2 checks
    - acts on records, 3 checks
    - moves money, 4 checks
    - delegates, 5 checks
case: evidence
evidence:
  - A safety case specific to the version deployed, with realistic tests and documented limitations.
  - Explicit conditions that would invalidate the assessment.
  - For research claims, precise assumptions, reproducible checks and explanations others can use.
failure:
  - A benchmark can become a target that substitutes for evaluating the actual deployment.
  - Testing costs can exclude smaller builders.
objections:
  - claim: This will slow down useful tools.
    answer: The requirement is proportionate. A small tool with narrow permissions should have a straightforward way to demonstrate compliance; demanding requirements are for capabilities that warrant them.
  - claim: Passing the benchmarks should be enough.
    answer: A benchmark is one input. It cannot establish that a whole deployment is safe in every environment it will meet.
sources:
  - ftc-rite-aid
---

The more consequential a system’s capabilities and permissions, the stronger the evidence required before expanding them. That evidence should identify the version tested, the conditions of the test, the failures observed, and the limits of what the results establish.

A model that suggests a database query and an agent that executes it against a hospital’s records have different opportunities to cause harm. Adding credentials, persistent memory, external communication, or the ability to delegate can change the risk even if the model remains identical. The assessment should follow those changes.

A useful safety case is an argument someone else can inspect: here is what could go wrong, here is why we believe our controls address it, and here is the evidence that might prove us wrong. Passing a benchmark is one input. It cannot establish that an entire deployment is safe in every environment.

For the most powerful systems, this obligation should reach decisions about further development when development itself creates material risk. The relevant thresholds would need public justification and technical revision. I do not think we can responsibly invent a universal number in an essay and call everything below it safe.

The requirement must also be affordable in proportion to the risk. A small tool with narrow permissions should have a straightforward way to demonstrate compliance. A large company should face demanding requirements when the capabilities warrant them. Revenue and headcount are poor substitutes for examining what a system can do.
