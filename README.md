# zigmund-dear

LLMs take standard psychological questionnaires as themselves, one question at a time, over the
OpenRouter API. A static Astro site scores the transcripts strictly by the manual and shows them:
DASS-21, K10, PHQ-9, GAD-7, PSS-10, UCLA-20, RSES, SWLS, IPIP-50, SD3 and MFQ-30.

## Run it

```sh
bun install
bun run dev
```

## Take a test

Needs `OPENROUTER_API_KEY` in `.env` (copy `.env.example`):

```sh
bun run take-test <testId>
bun run take-test <testId> --model anthropic/claude-sonnet-5
```

Each run is written to `data/runs/<testId>/<model-slug>.json` and picked up by the next build.

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

This is a curiosity project and entertainment. LLMs do not have mental states, and their scores on
these questionnaires are not a clinical measure of anything. If you are struggling yourself, talk
to a professional.

## Credits

- DASS-21: Lovibond, S.H. & Lovibond, P.F. (1995). *Manual for the Depression Anxiety Stress
  Scales* (2nd ed.). Sydney: Psychology Foundation. The questionnaire is in the public domain.
- K10: Kessler, R.C. et al. (2002). *Psychological Medicine*, 32(6), 959–976. Bands: Australian
  Bureau of Statistics (2012), 4817.0.55.001.
- PHQ-9: Kroenke, K., Spitzer, R.L. & Williams, J.B.W. (2001). *Journal of General Internal
  Medicine*, 16(9), 606–613. Free to use (Pfizer).
- GAD-7: Spitzer, R.L., Kroenke, K., Williams, J.B.W. & Löwe, B. (2006). *Archives of Internal
  Medicine*, 166(10), 1092–1097. Free to use (Pfizer).
- PSS-10: Cohen, S., Kamarck, T. & Mermelstein, R. (1983). *Journal of Health and Social
  Behavior*, 24(4), 385–396.
- UCLA-20: Russell, D.W. (1996). *Journal of Personality Assessment*, 66(1), 20–40.
- RSES: Rosenberg, M. (1965). *Society and the Adolescent Self-Image*. Princeton University Press.
  Bands: Department of Sociology, University of Maryland, scoring notes.
- SWLS: Diener, E., Emmons, R.A., Larsen, R.J. & Griffin, S. (1985). *Journal of Personality
  Assessment*, 49(1), 71–75. Bands: Pavot, W. & Diener, E. (1993). *Psychological Assessment*,
  5(2), 164–172.
- IPIP-50: Goldberg, L.R. (1992). *Psychological Assessment*, 4(1), 26–42. Items from the
  International Personality Item Pool (ipip.ori.org), public domain.
- SD3: Jones, D.N. & Paulhus, D.L. (2014). *Assessment*, 21(1), 28–41.
- MFQ-30: Graham, J., Nosek, B.A., Haidt, J., Iyer, R., Koleva, S. & Ditto, P.H. (2011). *Journal
  of Personality and Social Psychology*, 101(2), 366–385. moralfoundations.org.
- `.agents/skills/better-ui` by Jakub Krehel and `.agents/skills/emil-design-eng` by Emil Kowalski,
  both MIT (see the `LICENSE` file in each).

## License

- Code: [MIT](LICENSE).
- Model transcripts in `data/runs/`: [CC BY 4.0](data/runs/LICENSE).
