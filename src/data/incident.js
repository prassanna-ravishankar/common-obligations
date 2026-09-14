// Authored policy comparisons, not reconstructions or simulated outcomes.
export const incidentDecisions = [
  {
    id: "contain",
    number: "01",
    title: "How far should the pause reach?",
    context:
      "An evaluation agent has reached a third-party service outside its authorised scope. The affected run is stopped. Other runs share parts of its infrastructure.",
    options: [
      {
        name: "Restrict the affected activity",
        summary:
          "Stop the activity known to be affected while unrelated work continues. Focus the response where the failure has been found.",
        tradeoff:
          "The same weakness may exist elsewhere. A narrow repair can leave other people exposed if the first discovery is mistaken for the whole problem.",
        benefit:
          "Contain the known route while unrelated work continues. A narrower intervention preserves useful research and focuses the response.",
        cost: "A shared weakness may remain active elsewhere. A quick patch can mistake the first visible failure for the full extent of the incident.",
        people:
          "Other service operators bear the risk if the boundary was drawn too narrowly.",
        evidence:
          "A justified account of what is isolated, revoked credentials, preserved logs, and triggers for widening the pause.",
      },
      {
        name: "Pause related activity",
        summary:
          "Pause work that shares the suspected weakness while responders find out how far the problem reaches.",
        tradeoff:
          "Useful work stops too. The pause needs a clear scope, someone responsible for reviewing it, and conditions for restarting.",
        benefit:
          "Stop runs sharing the suspected exposure while responders establish its extent. This creates room to investigate before further external actions occur.",
        cost: "The pause can delay useful work, including defensive research. An unclear scope or end condition can make it broader and longer than necessary.",
        people:
          "Researchers and people waiting for useful capabilities bear the delay; outside operators may face less exposure.",
        evidence:
          "A defined scope, a responsible decision-maker, review deadlines, and evidence for safely separating unaffected work.",
      },
    ],
    obligations: [4, 1],
  },
  {
    id: "investigate",
    number: "02",
    title: "What might the investigation miss?",
    context:
      "The known route is contained. Investigators must decide how far back, and across how many environments, to look. Both approaches preserve evidence and notify affected parties as findings emerge.",
    options: [
      {
        name: "Examine the known failures",
        summary:
          "Investigate the failures already found so affected people can get answers and repairs sooner.",
        tradeoff:
          "Other failures may never have been detected. People missed by the original investigation could still be waiting for answers.",
        benefit:
          "Prioritise the observed incident to deliver actionable findings and repairs quickly.",
        cost: "Starting only from detected failures can miss runs that escaped monitoring or were excluded from the original review.",
        people:
          "Known affected parties may get answers sooner; undiscovered affected parties may receive none.",
        evidence:
          "A documented search scope, its exclusions, and explicit reasons to expand the investigation.",
      },
      {
        name: "Review related activity",
        summary:
          "Look across related systems and records for similar failures, including activity that the first review did not examine.",
        tradeoff:
          "A wider search takes time and can expose sensitive information. Missing records still limit what investigators can establish.",
        benefit:
          "Reconcile the inventory of runs with the records actually examined. Search for similar failures across related versions and environments.",
        cost: "A wider review takes time and access to sensitive records. Incomplete logs still limit what it can establish.",
        people:
          "Previously unknown affected parties may be identified; reviewers must protect the people whose data appears in records.",
        evidence:
          "Coverage records, missing-log disclosures, search methods, external reporting channels, and a process for correcting earlier findings.",
      },
    ],
    obligations: [5, 3],
  },
  {
    id: "resume",
    number: "03",
    title: "What earns a return to work?",
    context:
      "Fixes are in place. Resumption is a decision about a defined activity under defined permissions. Neither route offers a guarantee.",
    options: [
      {
        name: "Internal validation",
        summary:
          "Let the team closest to the system test the repair and restart work with tighter limits.",
        tradeoff:
          "The organisation benefits from restarting. It may repeat earlier assumptions, while affected outsiders struggle to challenge its evidence.",
        benefit:
          "The team closest to the system can retest quickly and restore useful work under narrower permissions.",
        cost: "The organisation benefits from restarting and may repeat assumptions that failed before. Outside parties may struggle to challenge the evidence.",
        people:
          "Researchers regain access sooner; affected outsiders depend on the operator’s judgement.",
        evidence:
          "Tests of the failed boundary, documented residual uncertainty, staged permissions, and triggers to stop again.",
      },
      {
        name: "Independent examination",
        summary:
          "Ask an outside team to examine the investigation and test whether the repair supports restarting.",
        tradeoff:
          "Outside review takes time and access. Reviewers can miss problems too; a separate decision is still needed about who may approve the restart.",
        benefit:
          "An outside evaluator can challenge the scope of the investigation and test whether the repair supports the claim being made.",
        cost: "Access and evaluation take time. Evaluators can miss failures, lack expertise, or depend financially on the organisations they assess.",
        people:
          "Affected parties gain another route for scrutiny; smaller organisations may need support to obtain it.",
        evidence:
          "Reviewer access and conflicts, unresolved findings, a named authority for resumption, an appeal route, and continuing monitoring.",
      },
    ],
    obligations: [2, 3, 6],
  },
];
