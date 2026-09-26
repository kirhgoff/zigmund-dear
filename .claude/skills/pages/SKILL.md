---
name: pages
description: Apply when writing or editing anything under src/pages or src/layouts.
user-invocable: false
---

## Pages connect the site to services

Everything under `src/pages` is the **controller layer**: it reads `Astro.params`, calls
`getCollection`/services, and renders components from `@/components`. A page importing a deep service
path or `src/config/env` is a layering bug (`bun run depcruise` catches it).

## Frontmatter

A page's frontmatter does lookups only — load data, filter, join, sort — never business logic. Anything
that computes a derived value (a score, a band) belongs in `src/assessments/services`, already computed
before the page ever runs.

## getStaticPaths

`getStaticPaths` derives its paths from the content collection (`getCollection('runs')`), mapping each
entry to `params` and `props`. There is no fallback route for a missing run — the page simply isn't
generated.

## Presentation

Presentation-only markup shared across pages becomes a component in `src/components/` (PascalCase,
barrel exports the root components used by pages only).
