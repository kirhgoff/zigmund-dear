# zigmund-dear

LLMs take standard psychological questionnaires; a static Astro site shows the results.

Decisions are recorded as ADRs in `docs/adr/` (`# ADR NNNN: Title`, Status / Context / Decision / Consequences). Read them before changing how tests are prompted or scored.

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

## Runbook

### OpenRouter key

- The key lives in `.env` as `OPENROUTER_API_KEY` (gitignored). Never print it, never commit it.
- If the user says the key is on the clipboard, write it without echoing:
  `K=$(pbpaste | tr -d '[:space:]'); printf 'OPENROUTER_API_KEY=%s\n' "$K" > .env`, then check it starts with `sk-or-`.
- Check it works at no cost: `curl -s https://openrouter.ai/api/v1/key -H "Authorization: Bearer $OPENROUTER_API_KEY" | jq .data`
  (shows `limit`, `limit_remaining`, `usage`). Load `.env` first with `set -a && . ./.env && set +a`.
- Keys can be created programmatically with a provisioning key via `POST https://openrouter.ai/api/v1/keys`; there is no official CLI.

### Models

- Models are listed in `data/models.json` (`id` = OpenRouter id, `slug` = run file name, `name`, `vendor`).
- Find or verify ids from the public catalogue before adding one:
  `curl -s https://openrouter.ai/api/v1/models | jq -r '.data[].id' | grep -i <vendor>`.
  Skip `:batch` variants.

### Taking tests

- Smoke test on the cheapest model first: `bun run take-test dass21 --model anthropic/claude-haiku-4.5`
  (about 14k prompt tokens, about one cent).
- All models: `bun run take-test dass21`. A run takes a few minutes per model and overwrites
  `data/runs/<testId>/<slug>.json`. Run it in the background and give it a generous timeout.
- To rerun only the missing models, loop over `jq -r '.[].id' data/models.json` and skip ids whose run file exists.
- After a run, check for unparsed answers:
  `jq '[.items[] | select(.score == null) | .number]' data/runs/dass21/*.json`.
- Run files are real model output. Never hand-edit them or create fake ones. For a render check, use a temporary
  fixture outside `data/` and delete it afterwards.

### Adding a test

- Add `data/tests/<id>.json` with the same schema as `dass21.json`. The site discovers tests via `import.meta.glob`.
- If the scoring differs from summed subscales with bands, extend `scoreTest` and its test first.

### Publishing results

- Run `bun run verify`, then commit `data/runs/`. Commits must be signed (the user's git config handles it;
  never disable signing). Push to `origin main` (GitHub `kirhgoff/zigmund-dear`).
- Deploy with `bun run deploy`. It needs `wrangler login` (or `CLOUDFLARE_API_TOKEN`); ask the user first if not logged in.

### Licensing

- Code is MIT (`LICENSE`), run transcripts are CC BY 4.0 (`data/runs/LICENSE`). Vendored skills in
  `.agents/skills/*` keep their upstream MIT `LICENSE` files. Credit new questionnaires in `README.md`.
