// Dates describe the publication, disclosure or signing, never the retrieval date.
export const timelineReview = "2026-09-28";
export const timelineEvents = [
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
      "Anthropic published its assessment of four incidents in which evaluation models accessed third-party systems without authorization. A wider review had found transcripts missed by the earlier search.",
    limit:
      "September 9 is the assessment date. The newly identified incident occurred in January 2026 and was found in August. This is Anthropic’s account; more disclosure does not establish a rising incident rate. It distinguishes evaluation misconfiguration from the models’ behavior.",
    occurredOn: "2026-01",
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
      "California’s governor announced the signing of SB 813, establishing a framework for independent verification organizations, and AB 1405, creating a registry and standards for AI auditors.",
    limit:
      "Signing establishes a framework. It does not demonstrate that reviews are operating effectively, nor that this proposal influenced the legislation.",
    obligations: [3],
    source: {
      publisher: "Governor of California",
      title: "Governor Newsom signs AI safeguards",
      url: "https://www.gov.ca.gov/2026/09/09/governor-newsom-signs-first-in-the-nation-ai-safeguards-to-protect-californians-calls-on-the-federal-government-to-do-its-part/",
      publishedOn: "2026-09-09",
    },
  },
  {
    id: "independent-assessment",
    date: "2026-09-22",
    dateKind: "Commitment published",
    title: "A commitment to deeper outside access.",
    summary:
      "OpenAI published principles for independent assessment across training, evaluation and deployment, committing to access that lets assessors challenge its assumptions and reach their own conclusions.",
    limit:
      "This records a commitment and the developer’s account of its practices. It does not establish that every promised assessment is implemented or independently effective.",
    obligations: [3],
    source: {
      publisher: "OpenAI",
      title: "Priorities and principles for effective third party assessments",
      url: "https://openai.com/index/priorities-principles-third-party-assessments/",
      publishedOn: "2026-09-22",
    },
  },
  {
    id: "qwen-omni",
    date: "2026-09-22",
    dateKind: "Technical report submitted",
    title: "More ways for an agent to act.",
    summary:
      "The Qwen team published its Qwen3.8-Omni report, describing multimodal agents with tool use, memory and delegated work, alongside frameworks for audio and video workflows.",
    limit:
      "Performance results are the authors’ evaluations. A capability report does not establish safe permissions, containment or recovery in a particular deployment.",
    obligations: [4],
    source: {
      publisher: "Qwen team · arXiv",
      title: "Qwen3.8-Omni: Towards Native Omni-Modal Agents",
      url: "https://arxiv.org/abs/2609.25611v1",
      publishedOn: "2026-09-22",
    },
  },
  {
    id: "enzyme-system",
    date: "2026-09-23",
    dateKind: "Research announcement",
    title: "A discovery with an open question.",
    summary:
      "Anthropic reported that Claude identified a previously uncharacterized enzyme system with DNA repeats, followed by analysis and laboratory testing by its scientists.",
    limit:
      "The announcement explicitly says the system’s function remains unknown. It is an early research finding, not an established gene-editing tool or demonstrated medical benefit.",
    obligations: [2],
    source: {
      publisher: "Anthropic",
      title: "Claude discovers a novel enzyme system",
      url: "https://www.anthropic.com/news/claude-discovers-novel-enzyme-system",
      publishedOn: "2026-09-23",
    },
  },
];
