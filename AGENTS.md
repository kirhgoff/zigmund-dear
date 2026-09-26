# zigmund-dear

LLMs take standard psychological questionnaires; a static Astro site shows the results.

## Layout

- `data/` — test definitions (`data/tests/`) and run outputs (`data/runs/<testId>/<modelSlug>.json`).
- `scripts/take-test.ts` — runs a test against a model over the OpenRouter API and writes a run file.
- `src/assessments/services` — pure scoring, answer parsing, run/test validation, and the OpenRouter call.
- `src/components` — presentational React components rendered server-side into `.astro` pages.
- `src/pages` — the site's routes.
- `xlib/result` — the shared `Result` type.

## Conventions

Before editing, load the matching skill in `.claude/skills/`: `pages` (src/pages), `service-architecture`
(services), `error-handling` (Result), `module-boundaries` (new files/imports). UI polish: `better-ui`,
`emil-design-eng`. No code comments except a single line for truly non-obvious logic.

## Commands

- `bun run dev` — local dev server.
- `bun run take-test dass21 [--model <id>]` — needs `OPENROUTER_API_KEY` in `.env`.
- `bun run deploy` — build and deploy to Cloudflare.

## Verify

`bun run verify` — runs `bun test`, `astro check`, `biome check`, `eslint`, `depcruise`, and `astro build`.
