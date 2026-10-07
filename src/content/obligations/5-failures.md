---
number: 5
slug: failures
title: Share what goes wrong.
short: Tell others about serious failures in time for them to protect themselves.
prevents: The same weakness, quietly patched in one product, left open in everyone else’s.
figure: beacons
parts:
  rest: the operator, told
  items:
    - the operator, told
    - affected users, told
    - other builders, told
    - a competent body, told
    - the public, told
case: failures
evidence:
  - Defined reporting thresholds and confidential disclosure channels.
  - Incident records, investigation coverage and known gaps.
  - Later public accounts that protect sensitive information.
failure:
  - Punishing honest reporting as harshly as concealment creates an incentive to stay silent.
  - Vulnerability disclosure also needs repair support and a justified timeline for public information.
objections:
  - claim: Disclosure helps attackers.
    answer: Separate urgent confidential notification, mitigation advice and later technical detail. The window before publication needs an owner, support and a review date.
  - claim: More reported incidents will make honest builders look worse.
    answer: A disclosed incident count reflects detection, investigation and willingness to report. It cannot rank labs by safety, and accountability should distinguish responsible disclosure from concealment.
sources:
  - anthropic-glasswing
---

Builders and operators should report material incidents and significant near misses through a shared process. A finding that affects other systems should reach the people who can act on it, even when disclosure is commercially uncomfortable.

If an agent finds a way around an authorisation boundary, quietly patching one product may leave the same weakness in another. A useful report would distinguish what was observed from what is suspected, identify affected versions and conditions, and describe the containment measures. It should be possible to update the report as the investigation improves.

This requires agreed definitions of severity, reporting deadlines, and recipients. It also requires protection for personal information and security-sensitive details. A practical approach could combine prompt confidential notification to a competent body with a later public account of what happened and what changed.

The incentives matter. A process that punishes every honest report as if it were concealment will encourage silence. Accountability should distinguish responsible disclosure from repeated negligence, misleading claims, and deliberate suppression. Employees need a protected route to raise serious concerns when internal reporting fails.
