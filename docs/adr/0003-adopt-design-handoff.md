# ADR 0003: Adopt the Claude Design handoff

## Status

Accepted (2026-09-26)

## Context

The first site was styled ad hoc: shadcn semantic tokens in oklch, a blue-violet base with a per-group
tint (mood / self / values) on the nav, the About card and the chat bubbles, and transcripts drawn as
left/right chat bubbles. It read as a generic dashboard, and every new test needed a tint decision.
A design handoff (`docs/design/2026-09-handoff`: README spec, `tokens.css`, an HTML reference of the
DASS-21 page) proposes "the analyst's office, at night": dark surfaces, one lavender accent, and three
type voices.

## Decision

- Tokens are the handoff's `--zd-*` custom properties, kept verbatim in `src/styles/global.css` and
  mapped into Tailwind's `@theme` as `zd-*` utilities. shadcn semantic tokens, per-group tints and
  bubble colours are removed.
- One accent colour (`#a59ddb`). Colour otherwise appears only as meaning: the five severity bands,
  keyed by a band's `severity`, so reversed scales (RSES, SWLS) and profile tests (no bands, accent
  meter) need no special casing.
- Three type voices: Instrument Serif italic for the analyst (hero line, test title, model name,
  questions), Geist for the reader (body, UI, replies), Geist Mono for the instrument (scores, meta,
  eyebrows).
- Transcripts are numbered question headings with an answer card (reply, score dots, anchor label,
  times), replacing chat bubbles. Score meters are segmented by band width on the subscale's true range.
- Three small interactions: table sorting, a subscale filter and collapsible session notes, all in
  vanilla JS in the page script; hash routing for the selected model stays.
- The footer keeps the repo, feedback and licence links, restyled.

## Consequences

- Every instrument page uses the same templates; bands, ranges and subscale counts come from the test
  JSON, so a new test needs no design work.
- `@shadcn/lint` still guards components: no arbitrary values, inline styles or raw colours, so new
  values go through `global.css` tokens.
- The About "How it is scored" paragraph is split around its inline band list, which becomes a table;
  the sentences are otherwise verbatim.
- Google Fonts adds Geist and Instrument Serif; Bricolage Grotesque and Instrument Sans are gone.
