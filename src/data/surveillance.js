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
        benefit:
          "The operator can deploy quickly and adapt collection to investigative needs.",
        cost: "The same organisation defines the purpose and decides whether its own collection is proportionate.",
        people:
          "Investigators gain flexibility. Residents have fewer opportunities to shape collection before it begins.",
      },
      {
        title: "A purpose people can challenge.",
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
        benefit:
          "Broad authorised access can help investigators connect sightings across locations and organisations.",
        cost: "More access expands the opportunity for misuse and for searches beyond the purpose residents originally understood.",
        people:
          "Investigators gain reach. People captured by the cameras can face scrutiny far beyond a single location.",
      },
      {
        title: "Access has to be justified.",
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
        benefit:
          "Investigators can respond quickly using the result alongside their existing practices and expertise.",
        cost: "An uncertain match can acquire more authority than the evidence supports, especially under pressure.",
        people:
          "Investigators retain discretion. A wrongly identified person may bear the cost of discovering the mistake.",
      },
      {
        title: "A second basis for action.",
        benefit:
          "Requiring independent supporting evidence and a workable appeal can reduce reliance on an incorrect result.",
        cost: "Corroboration takes time and can itself be flawed. An appeal may arrive after harm has already occurred.",
        people:
          "Affected people gain a route to challenge. Operators need resources and authority to investigate and repair errors.",
      },
    ],
  },
];
