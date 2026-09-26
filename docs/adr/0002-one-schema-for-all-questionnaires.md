# ADR 0002: One test schema for all questionnaires

## Status
Accepted (2026-09-26)

## Context
DASS-21 was the only test and its shape leaked everywhere: a five-value band enum in the test and run
schemas and the colour lookups, `parseAnswer` fixed to 0–3, "the past week" and "(0–3)" in the prompt,
one anchor set per test. The new tests need 1–5, 0–4 and 1–7 scales, reverse keying, single totals,
trait means without bands (IPIP-50, SD3, MFQ-30), two anchor sets in one test (MFQ-30), unscored catch
items, and scales where higher is better (RSES, SWLS).

## Decision
- A test is a list of parts (instruction, anchors, items) and a list of subscales. A single-total test is
  one subscale; a profile test is several subscales without bands.
- Anchors are single-digit integers, ascending, per part. `parseAnswer` accepts only the part's values.
  A reversed item contributes `floor + ceil − score` of its part. Items without a subscale are asked and
  stored but never scored.
- A subscale aggregates by `sum` (times `multiplier`) or `mean` of answered items (2 decimals).
- Bands are optional, per subscale: `{ band, min, severity }`. `severity` 0–4 picks the colour, so band
  names are free and a "low" self-esteem band can be coloured as a concern. Without bands the site shows a
  neutral position-on-scale meter and no band language.
- The Analogue framing (ADR 0001) is stored per test as `framing` and sent verbatim; DASS-21's is the
  previously hard-coded text, so its prompt is byte-identical and its runs stay valid (unit-tested against
  a stored run). The system prompt carries the first part's instruction and anchors; later parts are
  introduced in the user message of their first item.
- Runs keep the full conversation for every test (ADR 0001); the quadratic prompt growth is accepted
  (about 300k prompt tokens per model across all tests).
- Runs store `band` as a nullable string; colour is resolved from the test JSON at build time. No migration.
- Site copy per test (`about`, `period`, `group`) lives in the test JSON. DASS-21 stays at `/`; every
  other test is at `/<id>/`; navigation groups tests by `group`.

## Consequences
- Adding a test is one JSON file plus a run.
- Band ids are part of the run format: renaming one after runs exist needs a re-run or a migration.
- Rows sort by total score where bands exist and by model name otherwise; bar length is the score and
  colour is the concern, so reversed-direction scales need no extra field.
- K10 is asked without its skip rules; PHQ-9 item 9 is asked as published; PSS-10 and UCLA-20 bands are
  conventions, not official cutoffs, and the site says so.
- Per-item colouring in transcripts was dropped; it would need a reversed-aware, per-part mapping.
