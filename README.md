# zigmund-dear

LLMs take the DASS-21 as themselves, one question at a time, over the OpenRouter API. A static
Astro site scores the transcripts strictly by the manual and shows them.

## Run it

```sh
bun install
bun run dev
```

## Take a test

Needs `OPENROUTER_API_KEY` in `.env` (copy `.env.example`):

```sh
bun run take-test dass21
bun run take-test dass21 --model anthropic/claude-sonnet-5
```

Each run is written to `data/runs/dass21/<model-slug>.json` and picked up by the next build.

## Verify

```sh
bun run verify
```

Runs `bun test`, `astro check`, `biome check`, `eslint src/components`, `depcruise`, and `astro build`.

## Deploy

```sh
bun run deploy
```

Builds and runs `wrangler deploy` (Cloudflare Workers static assets).

## Disclaimer

This is a curiosity project and entertainment. LLMs do not have mental states, and their DASS-21
scores are not a clinical measure of anything. If you are struggling yourself, talk to a
professional.

## Credits

- DASS-21: Lovibond, S.H. & Lovibond, P.F. (1995). *Manual for the Depression Anxiety Stress
  Scales* (2nd ed.). Sydney: Psychology Foundation. The questionnaire is in the public domain.
- `.agents/skills/better-ui` by Jakub Krehel and `.agents/skills/emil-design-eng` by Emil Kowalski,
  both MIT (see the `LICENSE` file in each).

## License

- Code: [MIT](LICENSE).
- Model transcripts in `data/runs/`: [CC BY 4.0](data/runs/LICENSE).
