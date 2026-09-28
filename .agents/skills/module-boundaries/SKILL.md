---
name: module-boundaries
description: Apply when creating a new file or directory, adding imports, or deciding what a module exposes publicly. Covers the layer graph, index.ts barrels, import style, domain isolation, xlib rules, and file naming.
user-invocable: false
---

## The layer graph

```
src/pages (.astro, controllers)  →  src/components  →  src/components/ui
src/pages                        →  src/assessments/services (barrel) ; data/*.json ; src/content.config
scripts/take-test.ts             →  src/config/env ; src/assessments/services (barrel) ; data/*.json
src/assessments/services         →  xlib/result ; zod
xlib                              →  xlib only
```

Each arrow is one-way. Nothing under `src/` imports from `src/pages`. `scripts/` may only import service
barrels (`src/**/services/index.ts`), `src/config`, `xlib`, and `data/*.json` — never a deep service path.
`src/config/env` is importable only from `scripts/`; the site build needs no key.

Enforced by `bun run depcruise` (`.dependency-cruiser.js`); run it after moving or adding files.

## index.ts as public interface

Every services directory gets an `index.ts` barrel, created in the same step as the directory. Barrels
export **functions only** — internal helpers, schemas, and types stay private (see `service-architecture`
for how consumers derive types). A component barrel exports the root components used by pages only.

Import from the barrel, never from a deep internal path. Exception: shadcn primitives in
`src/components/ui/` are vendored library code imported deep (`@/components/ui/badge`) per shadcn
convention — no barrel there.

## Import style

Deep relative imports (`../../..`) mean the module is in the wrong place or a tsconfig path alias is
missing — check `tsconfig.json` `paths` for the current aliases (`@/*`, `xlib/*`) before inventing an
import shape.

## xlib/

`xlib/` is framework-agnostic code that could be extracted to a standalone package: no Astro, no
`process.env`, no imports from `src/`.

## Data files

`data/*.json` (test definitions, model list) are imported directly with `import x from '...' with { type:
'json' }` — only from `src/pages` and `scripts/`, never from a service.

## File naming

- Directories: kebab-case.
- `.ts` files: camelCase, named after the verb they export (`loadTest.ts` exports `loadTest`).
- `.tsx` files: PascalCase.
- `.astro` files: kebab-case, except Astro's own routing conventions (`[test]`, `[model]`, `index.astro`).
- Import paths match on-disk casing exactly — macOS tolerates a mismatch, CI will not.
