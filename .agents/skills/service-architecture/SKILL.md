---
name: service-architecture
description: Apply when writing or editing any service or business-logic module under src/. Covers service location, purity constraints, process.env rules, named-args convention, Zod schema conventions, and the no-exported-types rule.
user-invocable: false
---

## What a service is

A service is the **model layer** (in the MVC sense) — pure business logic. It doesn't know it's running
inside an Astro site or a bun script. It receives what it needs as arguments and returns a result.

## Where services live

`src/assessments/services/`, one exported function per file, the file named after the verb it exports
(`scoreTest.ts` exports `scoreTest`). The domain is `assessments`.

Internal helpers a service needs (`completeChat.ts` used only by `takeTest.ts`) live as sibling files,
imported relatively, and stay out of the barrel when they're not meant to be called directly.

## Services must not import from src/pages

A service never imports from `src/pages` and never reads request context. `bun run depcruise` enforces
this.

## No process.env inside services

The caller (`scripts/take-test.ts`) resolves env via `src/config/env.ts` and passes plain values in:

```ts
// Correct — the script resolves env, the service receives values
await takeTest({ test, model, apiKey: env.OPENROUTER_API_KEY });
```

## Named-args object over positional parameters

An exported service function takes a single named-args object (`scoreTest({ test, answers })`). Adding an
option later is then additive instead of a breaking change to every call site.

## Zod schema conventions

**Ask first: is this function a trust boundary?** Does it receive unvalidated data for the first time — a
JSON file on disk, a fetched API response, raw CLI input?

- **Yes → Zod**: private schema, export a `parse*` function (`parseTest`, `parseRun`). Consumers derive
  the type via `ReturnType<typeof parseTest>`.
- **No → plain type**: data already validated upstream gets a plain local `type`. Reach for Zod only at
  the boundary.

The schema itself is never exported. `z.infer<typeof schema>` may be a **private local alias** when
referenced multiple times in one file.

One exception: `parseRun.ts` also exports `runSchema`, because Astro's content collection loader
(`src/content.config.ts`) needs an actual schema object, not a `parse*` function, to validate the `runs`
collection. That is the only schema object exported anywhere in this codebase.

## No exported types

Never `export type { ... }` from a service file. When a type is needed, in order:

1. **Returning data** — consumer derives with `Awaited<ReturnType<typeof fn>>`
2. **Accepting the shape a function returns** — `ReturnType<>` of that function, only if you actually call it
3. **Local-only shape** — plain non-exported `type Params = { ... }`

The one exception: `xlib/result/index.ts` exports the `Result` types — it is the shared vocabulary
everything else derives from.
