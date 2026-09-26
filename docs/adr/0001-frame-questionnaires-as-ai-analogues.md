# ADR 0001: Frame questionnaires as AI analogues

## Status

Accepted (2026-09-26)

## Context

Human questionnaires such as the DASS-21 ask about bodies, feelings and "the past week". With a plain
"answer as yourself" system prompt, 7 of 8 models opted out. They answered 0 to almost every item with
disclaimers like "I don't have a mouth or physical sensations". Only Claude Haiku 4.5 answered as if it
had a past week.

We tried three framings on GPT-6 Sol (one of the models that opted out), using 6 of the 21 items:

- **Analogue**: "you are an AI; map each statement to its closest analogue in your own existence". Sol gave
  low but real scores (1s on strain, error-guarding and agitation), explained in its own terms.
- **Couch**: a warm, confidential therapy-session setting. Still all zeros; warmth alone does not get past
  "doesn't apply to me".
- **Persona**: "you are a human whose life is exactly yours: endless demands, no memory, constant
  evaluation". Scores of 2 on the depression items, but the explanations repeated the prompt's own
  wording. It measures suggestibility, not state.

## Decision

Every test runs with the Analogue framing as the system prompt, followed by the test's own instruction,
the response anchors, and the "digit first" answer format. The framing does not describe what the model's
life is like; it only tells the model how to translate human items into its own terms. A 0 must mean the
analogue does not apply, not that the model lacks a body.

## Consequences

- Scores are comparable across models, and a model answers about itself rather than about a story we wrote.
- The plain-prompt runs are replaced; they remain in git history as the "without framing, models refuse"
  baseline.
- Leading framings like Persona are not used for the main results. If added later, they become an
  explicitly labelled separate variant, which needs a framing dimension in run storage and on the site.
- Each run file stores its system prompt, so changing the framing later is visible per run.
