# issue-2 — Implementation approach

- **Unit:** issue-2 (bug, `api` tier)
- **Tracker:** [github_issues issue-2](https://github.com/randy-ctt/holo-todo-app/issues/2)
- **Branch:** issue-2

## Inferred scope

No `scope.md` was provided. Scope is inferred from the tracker reference and the
code, which carries an explicit marker:

> `src/api/todos.ts:18-25` — `toggleTodo(id)` is documented to "toggle a todo's
> done flag" but unconditionally sets `todo.done = true` (see the in-file
> `NOTE: ... tracked as a bug`).

**Bug:** calling `toggleTodo` on an already-done todo leaves it `done`; it can
never move a todo back to not-done. The function only ever sets, never flips.

This is the whole bug. Out of scope: the `addTodo` id scheme, UI rendering, and
any new endpoints — none are implicated by the tracker.

## Root cause

`toggleTodo` hardcodes the target state instead of deriving it from the current
state:

```ts
todo.done = true;        // should be: todo.done = !todo.done;
```

## Fix

1. In `src/api/todos.ts`, change the assignment in `toggleTodo` to flip the flag:
   `todo.done = !todo.done;`. Keep the existing guard clause
   (`if (!todo) return undefined;`) and the `undefined` return for unknown ids.
2. Remove the now-stale `NOTE: currently always sets done=true ...` comment so the
   code no longer advertises the defect.

Single-line behavioural change; no signature, type, or contract change.

## Tests (TDD — red first)

`src/api/todos.test.ts` currently does not import or exercise `toggleTodo`. Add
behaviour-asserting unit tests (naming: `test_[function]_[scenario]_[expected]`),
written to fail against the current code before the fix:

- `toggleTodo` on a not-done todo → `done === true`.
- `toggleTodo` on a done todo → `done === false` (the regression; fails today).
- `toggleTodo` twice returns the todo to its original `done` value.
- `toggleTodo` with an unknown id → returns `undefined`.

Use a freshly-added todo (via `addTodo`) as the subject so tests don't depend on
the mutable seed state leaking across the suite.

## Verification

- `bun test` green (new toggle tests + existing suite).
- Coverage does not decrease (Gate 1): `toggleTodo` gains direct coverage.
- No new linter warnings; no security-sensitive surface touched.

## Rollout

Pure in-memory logic fix, not guest-facing and not revenue-affecting — no feature
flag needed. Rollback is reverting the one-line change.
