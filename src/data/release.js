export const releases = [
  {
    label: "THE CASE FOR SPEED",
    title: "Benefits arrive sooner.",
    summary:
      "Let the developer decide when its system is ready. The team knows the technology and can make useful tools available sooner.",
    tradeoff:
      "It also benefits from releasing the system. People outside the company may be unable to check its evidence or challenge the decision.",
    for: "Developers know their systems intimately. Letting them assess readiness can bring useful capabilities to people sooner and avoid an expensive external bottleneck.",
    against:
      "The organisation making the case for release also benefits from it. External parties may be unable to examine the evidence or challenge the decision.",
    assumption:
      "The quality of internal testing, honest disclosure, and credible consequences for misleading claims.",
  },
  {
    label: "THE CASE FOR SCRUTINY",
    title: "The claims face a challenge.",
    summary:
      "Ask an outside team to test the system and challenge the developer’s assumptions before more people rely on it.",
    tradeoff:
      "Review takes time and money. Reviewers can make mistakes, and expensive checks can shut out smaller builders.",
    for: "An independent evaluator can test assumptions the developer missed and give affected parties a stronger basis for trust.",
    against:
      "Evaluation can delay useful access and impose costs that favour large companies. Evaluators can also make mistakes or be influenced by the firms they assess.",
    assumption:
      "Meaningful access, competent evaluators, transparent methods, manageable costs, and a process for appealing decisions.",
  },
  {
    label: "THE CASE FOR LEARNING",
    title: "Learn within boundaries.",
    summary:
      "Start with a limited release, restricting what the system can do while learning how it behaves in real use.",
    tradeoff:
      "Small trials can still cause serious harm. They need clear stopping rules, not an assumption that a pilot is safe.",
    for: "A limited release can expose a system to realistic conditions while restricting permissions, access, and the scale of possible harm.",
    against:
      "A small deployment can still cause serious harm. A pilot can become permanent, and limited access may privilege a small group.",
    assumption:
      "Enforceable boundaries, informed participation where possible, incident reporting, and explicit criteria for expanding or stopping.",
  },
];
