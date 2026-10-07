---
number: 4
slug: autonomy
title: Bound autonomy. Prepare for failure.
short: Limit what a system can do, outside the model, and be ready to contain and repair what goes wrong.
prevents: An agent that can act without limits anyone enforced, and a failure nobody can stop or repair.
figure: paddock
parts:
  rest: within its limits
  items:
    - spend cap, held
    - data access, held
    - credentials, expired
    - delegation, held
case: autonomy
evidence:
  - Spending and access limits enforced by the services the system calls, not by instructions to the model.
  - Credentials that expire, and delegation that cannot exceed the original permission.
  - Recovery exercises, and containment plans specific to each release.
  - Updates validated before they inherit permissions; installed artefacts traced and exposed credentials revoked after a compromise.
failure:
  - A stop button cannot undo every completed action.
  - Publicly released artefacts may remain accessible after withdrawal.
objections:
  - claim: Limits will make agents useless.
    answer: The limits are set by what the system is trusted to do, and widen as evidence accumulates. A refund agent with a spending cap still issues refunds.
  - claim: The model can be told to stay within bounds.
    answer: An instruction is not an enforcement mechanism. If the payment service does not hold the cap, the cap does not exist.
sources:
  - openai-hf-incident
  - reuters-anthropic-fourth
---

An AI system that acts should have explicit limits on its authority and tested ways to contain failure. Before deployment, the operator should know which actions require approval, which resources are accessible, how permissions expire, and what happens when the system behaves unexpectedly.

Suppose an agent can issue refunds. Its spending limit should be enforced by the payment service. A sentence asking the model to stay within budget is insufficient. If it delegates to another agent, the delegated authority should remain within the original permission. Stopping the parent should also address outstanding child work and credentials that could remain active.

Recovery deserves equal attention. If a payment request times out, the system should establish whether it committed before sending another. If an agent changes a record, the operator needs a way to identify and repair the change. A stop button may prevent the next action; it cannot unsend an email or reverse every action already taken.

Some releases are difficult to recall at all, including publicly distributed model weights. In those cases, the assessment must account for the limits of later intervention before release. Openness can support scrutiny and wider participation, but neither an open licence nor a closed API establishes safety on its own.

The general obligation is to demonstrate control appropriate to the system, and to be honest where control ends.
