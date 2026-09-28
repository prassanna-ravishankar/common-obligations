// Dates describe publication, disclosure or signing, never retrieval.
export const timelineReview = "2026-09-28";
export const timelineEvents = [
  {
    id: "authors-allocation",
    date: "2026-09-17",
    dateKind: "Dispute-process update",
    title: "Authors contest who gets paid.",
    summary:
      "Authors disputing shares of the Anthropic book-copyright settlement received more time to make their case. The Authors Guild reported an extension from 30 to 60 days, after notices exposed conflicting claims from authors, publishers and agents.",
    limit:
      "September 17 dates the Guild’s update, not the copying of books or settlement approval. The administrator confirms the extension. Disputed payments remain held back; extra time is not a resolved claim.",
    obligations: [6],
    source: {
      publisher: "The Authors Guild",
      title: "Copyright settlement claim disputes",
      url: "https://authorsguild.org/news/important-information-regarding-anthropic-copyright-settlement-claim-notices/",
      publishedOn: "2026-09-04",
      updatedOn: "2026-09-17",
    },
  },
  {
    id: "medicare-delays",
    date: "2026-09-08",
    dateKind: "Records disclosure announced",
    title: "Patients wait in pain for approval.",
    summary:
      "After suing for records, EFF reported that clinicians described patients waiting in pain and cancelled procedures in Medicare’s AI-assisted WISeR authorization program.",
    limit:
      "September 8 dates EFF’s disclosure announcement; the patient reports are from March 2026. These are clinicians’ accounts, not individual court findings. CMS requires clinical review of denials; delays span the whole process, not just an AI model.",
    occurredOn: "2026-03",
    occurredLabel: "Patients’ reports",
    obligations: [1, 6],
    source: {
      publisher: "EFF · records obtained from CMS",
      title: "Medicare’s AI authorization experiment",
      url: "https://www.eff.org/deeplinks/2026/09/new-records-reveal-problems-medicares-ai-prior-authorization-experiment",
      publishedOn: "2026-09-08",
    },
  },
  {
    id: "navier-stokes",
    date: "2026-09-08",
    dateKind: "Research announcement",
    title: "A proof offered for scrutiny.",
    summary:
      "OpenAI announced a claimed solution to the Navier–Stokes problem and released a written proof and Lean formalization.",
    limit:
      "This is the developer’s claim, not a statement of independent mathematical acceptance. A September 10 update addresses provenance; attribution and verification remain separate questions.",
    obligations: [1, 2],
    source: {
      publisher: "OpenAI",
      title: "On the Navier–Stokes Millennium Prize Problem",
      url: "https://openai.com/index/navier-stokes-solution/",
      publishedOn: "2026-09-08",
      updatedOn: "2026-09-10",
    },
  },
  {
    id: "alphagenome",
    date: "2026-09-08",
    dateKind: "Research announcement",
    title: "A map of possible changes.",
    summary:
      "Google DeepMind introduced AlphaGenome Atlas, a resource containing predicted molecular effects for nine billion single-letter DNA variants.",
    limit:
      "These are predictions. The announcement reports experimental checks of selected findings, not validation of every variant or proof of clinical benefit.",
    obligations: [2],
    source: {
      publisher: "Google DeepMind",
      title: "AlphaGenome Atlas",
      url: "https://deepmind.google/blog/alphagenome-atlas-a-predictive-map-of-every-possible-dna-letter-change-in-the-human-genome/",
      publishedOn: "2026-09-08",
    },
  },
  {
    id: "cyber-assessment",
    date: "2026-09-09",
    dateKind: "Incident assessment published",
    title: "The investigation finds a missed incident.",
    summary:
      "Anthropic reported four incidents in which evaluation models accessed outside systems without authorization. Its wider review found an incident the earlier search missed.",
    limit:
      "September 9 is the assessment date: the missed incident occurred in January 2026 and was found in August. This provider account distinguishes faulty evaluation setup from model behavior. More disclosure does not establish a rising incident rate.",
    occurredOn: "2026-01",
    occurredLabel: "Missed incident",
    obligations: [4, 5],
    source: {
      publisher: "Anthropic",
      title: "An alignment assessment of recent cybersecurity incidents",
      url: "https://www.anthropic.com/research/alignment-assessment-cybersecurity-incidents",
      publishedOn: "2026-09-09",
    },
  },
  {
    id: "california",
    date: "2026-09-09",
    dateKind: "Legislation signed",
    title: "Outside scrutiny enters a legal framework.",
    summary:
      "California signed SB 813 and AB 1405, establishing an independent-verification framework and a registry with standards for AI auditors.",
    limit:
      "The governor’s announcement records legislation, not proof that oversight works in practice. It does not establish influence by this proposal.",
    obligations: [3],
    source: {
      publisher: "Governor of California",
      title: "Governor Newsom signs AI safeguards",
      url: "https://www.gov.ca.gov/2026/09/09/governor-newsom-signs-first-in-the-nation-ai-safeguards-to-protect-californians-calls-on-the-federal-government-to-do-its-part/",
      publishedOn: "2026-09-09",
    },
  },
];
