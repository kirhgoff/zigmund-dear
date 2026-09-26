---
name: error-handling
description: Apply when writing functions that can fail, handling errors in services or scripts, or deciding what to return when an operation doesn't succeed. Covers Result types, error-builder functions, expected vs unexpected errors, and silent catch prohibition.
user-invocable: false
---

## Expected vs unexpected errors

- **Expected** ("model unavailable", "unparseable answer") — return an explicit value, never a thrown
  exception.
- **Unexpected** (network failure, programmer error) — throw and let it propagate; log at the boundary
  before any rethrow or discard.

## Return types for fallible functions

| Scenario | Return type |
|---|---|
| Operation can fail with a typed reason | `Result<Data, Error>` from `xlib/result` |
| Thing may not exist and that's the normal outcome | `null` |

A page's `getStaticPaths` filtering out a missing entry is the normal outcome, not an error. Multi-step
operations (`takeTest`) return `Result`.

## Result construction: error builders

Construct with `R.success(data)` / `R.error(reason)` from `xlib/result`. Every error reason is built by a
**named error-builder function** returning `{ code: "..." as const, cause: new Error("...") }` — the
`as const` is what gives callers a discriminated union:

```ts
export const takeTest = async ({ test, model, apiKey }: Params) => {
  const first = await completeChat({ apiKey, model: model.id, messages });
  if (!first.success) return first;
  ...
  return R.success(run);
};

const modelUnavailableError = (status: number, body: string) =>
  R.error({ code: "MODEL_UNAVAILABLE" as const, cause: new Error(`OpenRouter ${status}: ${body}`) });
```

Builders live at the bottom of the file when single-use; a shared `*Errors.ts` sibling when two files need
the same one.

## Consuming a Result

Narrow on `result.success`. Callers switch on `result.error.code` **exhaustively**, with a `never`-typed
default so an unhandled new code fails the build:

```ts
if (!result.success) {
  switch (result.error.code) {
    case "MODEL_UNAVAILABLE":
      console.error(result.error.cause.message);
      break;
    default: {
      const exhaustive: never = result.error.code;
      throw result.error.cause;
    }
  }
}
```

## No silent catch

A `catch` block logs via `console.error` at the script boundary before discarding or rethrowing. An empty
`catch {}` is never acceptable in this codebase.
