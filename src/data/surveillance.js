export const stages = [
  {
    name: "COLLECTION",
    kicker: "A narrowly defined purpose",
    title: "Find a<br>stolen car.",
    description:
      "A camera records a vehicle passing a street. Investigators look for a car connected to a reported theft.",
    question: "Who decides what gets collected?",
    conditions: [
      {
        title: "A faster path to use.",
        summary:
          "Let investigators decide where cameras are needed so they can start looking for stolen cars sooner.",
        tradeoff:
          "The same organisation decides whether watching a neighbourhood is justified. Residents have less say before collection starts.",
        benefit:
          "The operator can deploy quickly and adapt collection to investigative needs.",
        cost: "The same organisation defines the purpose and decides whether its own collection is proportionate.",
        people:
          "Investigators gain flexibility. Residents have fewer opportunities to shape collection before it begins.",
      },
      {
        title: "A purpose people can challenge.",
        summary:
          "Require someone outside the investigation team to approve the purpose, the limits and when camera use must be reviewed.",
        tradeoff:
          "Residents get a chance to challenge the decision, but useful investigations may wait. The reviewer needs real expertise and authority.",
        benefit:
          "Independent authorisation can establish a specific purpose, limits on collection, and a review date before deployment.",
        cost: "Review takes time and resources. Its value depends on the reviewer’s competence, legitimacy, and authority.",
        people:
          "Residents gain a point of intervention. Investigators may face delays, including for valuable uses.",
      },
    ],
  },
  {
    name: "CONNECTION",
    kicker: "From a sighting to a history",
    title: "Connect<br>the dots.",
    description:
      "Records from many cameras become searchable together. A local tool can reveal movement across a much larger area.",
    question: "Who can search across the network?",
    conditions: [
      {
        title: "A wider field of view.",
        summary:
          "Let authorised investigators search across camera networks to follow a vehicle beyond one street or town.",
        tradeoff:
          "That reach can also expose someone’s daily movements to searches they never expected. More access creates more opportunities for misuse.",
        benefit:
          "Broad authorised access can help investigators connect sightings across locations and organisations.",
        cost: "More access expands the opportunity for misuse and for searches beyond the purpose residents originally understood.",
        people:
          "Investigators gain reach. People captured by the cameras can face scrutiny far beyond a single location.",
      },
      {
        title: "Access has to be justified.",
        summary:
          "Require a reason for each wider search, restrict who can make it, and let an outside reviewer check the records.",
        tradeoff:
          "Checks can slow urgent work. Emergency exceptions or an overloaded reviewer can also leave people unprotected.",
        benefit:
          "Purpose-bound permissions, independent review, and audited searches can make access more accountable.",
        cost: "Permissions create friction. Emergency exceptions and reviewer workload can weaken the check.",
        people:
          "Residents gain protections against casual searches. Investigators must explain the need for broader access.",
      },
    ],
  },
  {
    name: "CONSEQUENCE",
    kicker: "When an inference becomes an action",
    title: "Decide what<br>happens next.",
    description:
      "A search result enters an investigation. Someone must decide how much weight it deserves before taking action.",
    question: "What turns a result into evidence?",
    conditions: [
      {
        title: "Judgment stays with the operator.",
        summary:
          "Let investigators decide how to use a match alongside the other information they have.",
        tradeoff:
          "A weak match can start to look like proof. If it is wrong, the person identified may have to uncover the mistake.",
        benefit:
          "Investigators can respond quickly using the result alongside their existing practices and expertise.",
        cost: "An uncertain match can acquire more authority than the evidence supports, especially under pressure.",
        people:
          "Investigators retain discretion. A wrongly identified person may bear the cost of discovering the mistake.",
      },
      {
        title: "A second basis for action.",
        summary:
          "Require supporting evidence before acting on a match, and give the person affected a way to challenge it.",
        tradeoff:
          "Finding that evidence takes time, and it can be wrong too. An appeal may arrive only after someone has been harmed.",
        benefit:
          "Requiring independent supporting evidence and a workable appeal can reduce reliance on an incorrect result.",
        cost: "Corroboration takes time and can itself be flawed. An appeal may arrive after harm has already occurred.",
        people:
          "Affected people gain a route to challenge. Operators need resources and authority to investigate and repair errors.",
      },
    ],
  },
];
