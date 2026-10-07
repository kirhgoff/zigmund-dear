# zigmund-dear

LLMs take standard psychological questionnaires; a static Astro site shows the results.

Decisions are recorded as ADRs in `docs/adr/` (`# ADR NNNN: Title`, Status / Context / Decision / Consequences). Read them before changing how tests are prompted or scored. ADR 0001 sets the Analogue framing; ADR 0002 sets the one-schema-for-all-questionnaires shape (parts, subscales, bands with severity); ADR 0003 adopts the 2026-09 design handoff.

## Layout

- `data/` — test definitions (`data/tests/`) and run outputs (`data/runs/<testId>/<modelSlug>.json`).
- `docs/design/2026-09-handoff` — the design system (README spec, tokens.css, HTML reference). Tokens are
  `--zd-*` custom properties in `src/styles/global.css`, mapped into Tailwind `@theme` as `zd-*` utilities
  (`bg-zd-surface`, `text-zd-body`, `rounded-zd-lg`). One accent (lavender); other colour only for severity
  bands. ADR 0003.
- `scripts/take-test.ts` — runs a test against a model over the OpenRouter API and writes a run file.
- `src/assessments/services` — pure scoring, answer parsing, run/test validation, and the OpenRouter call.
- `src/components` — presentational React components rendered server-side into `.astro` pages.
- `src/pages` — the site's routes.
- `xlib/result` — the shared `Result` type.

## Conventions

UI polish: load `better-ui` and `emil-design-eng` from `.claude/skills/`. No code comments except a single line for truly non-obvious logic.

### Who imports whom

`.dependency-cruiser.js` is the authority (`bun run depcruise`, part of `verify`); in prose:

- `src/pages` and `src/layouts` are glue. The frontmatter reads `Astro.params`, `getCollection('runs')` and
  `data/*.json`, filters and sorts, and hands display-ready data to components from `@/components`. A score
  or a band is never computed there: it is already in the run file, put there by a service.
- `src/assessments/services` holds the logic. One exported function per file, named after it
  (`scoreTest.ts` → `scoreTest`), each taking a single object argument so a new option is a new field, not a
  new positional parameter. A service imports `xlib`, `zod` and its siblings; nothing from `src/pages`, and no
  `process.env`: `scripts/take-test.ts` reads `src/config/env.ts` and passes `apiKey` in. A helper only one
  service uses (`completeChat`, `buildSystemPrompt`) stays out of `index.ts`.
- Callers import the barrel (`@/assessments/services`, `@/components`), never a file behind it. The shadcn
  primitives in `src/components/ui/` are imported by path, as shadcn expects.
- `xlib/` imports only `xlib/`. `src/config/env` is read by `scripts/` alone; the site builds without a key.

### Types and validation

- Zod sits at the two places untrusted data enters: JSON files on disk (`loadTest`, `parseRun`) and the
  OpenRouter response (`completeChat`). Each schema is private behind a `parse*` function. The one exported
  schema is `runSchema`, because `src/content.config.ts` needs a schema object for the `runs` collection.
- Services export functions, not types. Take a shape from the function that produces it:
  `type Test = Awaited<ReturnType<typeof loadTest>>`. A shape used in one file is a non-exported `type`.

### Failures

- An outcome the caller must branch on travels as `Result` from `xlib/result` (`R.success` / `R.error`):
  `completeChat` returns `MODEL_UNAVAILABLE` when OpenRouter answers with an error status, and `takeTest`
  passes that `Result` straight up. The error value is `{ code: '...' as const, cause: Error }`, built by a
  small function next to the code that returns it; `as const` is what makes the `code` a union the compiler
  can check. Callers narrow on `success`, `switch` on `error.code`, and keep a `default` that assigns the code
  to a `never`, so a new code fails `astro check` in `scripts/take-test.ts` instead of slipping through.
- Absence is `null`, not an error: `parseAnswer` on a reply with no usable digit, a run file missing for a
  model (the page is simply not generated).
- Bugs and infrastructure faults are thrown. `scripts/take-test.ts` is the boundary that logs and exits
  non-zero; a `catch` that discards an error without logging is a bug.

### Names

Directories kebab-case; `.ts` camelCase after its export; `.tsx` PascalCase; `.astro` kebab-case except
Astro's route syntax (`[...test]`, `index`).

## Commands

- `bun run dev` — local dev server.
- `bun run take-test <testId> [--model <id>]` — needs `OPENROUTER_API_KEY` in `.env`. Test ids: `dass21`,
  `k10`, `phq9`, `gad7`, `pss10`, `ucla20`, `rses`, `swls`, `ipip50`, `sd3`, `mfq30`.
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
- All models: `bun run take-test <testId>`. A run takes a few minutes per model and overwrites
  `data/runs/<testId>/<slug>.json`. Run it in the background and give it a generous timeout. Longer tests
  (IPIP-50 at 50 items, SD3 at 27, MFQ-30 at 32) cost proportionally more per model — the full conversation
  is kept per ADR 0001, so prompt tokens grow quadratically with item count.
- To rerun only the missing models, loop over `jq -r '.[].id' data/models.json` and skip ids whose run file exists.
- After a run, check for unparsed answers:
  `jq '[.items[] | select(.score == null) | .n]' data/runs/<testId>/*.json`.
- Run files are real model output. Never hand-edit them or create fake ones. For a render check, use a temporary
  fixture outside `data/` and delete it afterwards.

### Adding a test

- Add `data/tests/<id>.json` matching the schema in `loadTest.ts`: `id`, `name`, `fullName`, `group`,
  `period`, `framing`, `parts` (each `{ instruction, anchors, items }`), `subscales` (each with
  `aggregate: 'sum' | 'mean'`, a `multiplier`, and optional `bands: [{ band, min, severity }]`), and `about`
  (`measures`, `scoring`, `source`). The site discovers tests via `import.meta.glob` and serves them at
  `/<id>/` automatically (`dass21` stays at `/`).
- For `framing`, keep the two shared sentences and write only the ANALOGUES and OPTOUT clauses for the new
  test — see ADR 0002 for the recipe and the existing test JSON files for examples.
- Band ids are frozen once runs exist for that test: they are stored verbatim in run files, so renaming one
  needs a re-run or a migration.
- If the scoring differs from summed or averaged subscales with bands, extend `scoreTest` and its test first.

### Publishing results

- Run `bun run verify`, then commit `data/runs/`. Commits must be signed (the user's git config handles it;
  never disable signing). Push to `origin main` (GitHub `kirhgoff/zigmund-dear`).
- Deploy with `bun run deploy`. It needs `wrangler login` (or `CLOUDFLARE_API_TOKEN`); ask the user first if not logged in.

### SEO

- `Layout.astro` owns the shared `<head>` tags (description, canonical, robots, Open Graph, Twitter card,
  theme-color, jsonLd scripts) from its `title`/`description`/`noindex`/`jsonLd` props. Each test page builds
  its own title, description and a `Dataset` JSON-LD from that test's JSON — a new test in `data/tests/`
  picks all of this up automatically, and also shows up in the sitemap and `llms.txt` with no extra wiring.
- `site` in `astro.config.mjs` must be updated if the project moves to a custom domain (canonical URLs,
  `og:url`, the sitemap and `robots.txt`'s `Sitemap:` line all derive from it).
- Manual checklist after a domain change or first deploy: add a Google Search Console URL-prefix property and
  verify it (verification meta tag in `Layout.astro`'s `<head>`), submit `/sitemap-index.xml`, check
  `/llms.txt` and `/robots.txt` resolve, and run the page through Google's Rich Results test.

### Licensing

- Code is MIT (`LICENSE`), run transcripts are CC BY 4.0 (`data/runs/LICENSE`). Vendored skills in
  `.agents/skills/*` keep their upstream MIT `LICENSE` files. Credit new questionnaires in `README.md`.
