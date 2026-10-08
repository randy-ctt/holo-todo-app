# Plan: issue-1

**Work type:** feature · **Tier:** ui · **Tracker:** [issue-1](https://github.com/randy-ctt/holo-todo-app/issues/1)

> **Inferred scope (no scope.md provided).** The GitHub issue was not reachable from this
> worktree. Inferring from the manifest (`work_type: feature`, `tier: ui`) and the code:
> `renderRow` in `src/ui/render.ts` currently renders every todo as `- <title>` and ignores
> the `done` flag that the data model already carries. The feature is therefore: **show each
> todo's completion status in the rendered list.** Confirm against the issue before coding; if
> the real feature differs, this plan's structure still applies but the specifics change.

## Components
- **Changed:** `src/ui/render.ts` — `renderRow` (and transitively `renderTodos`). This is the
  only load-bearing change; the UI tier is where completion status becomes visible.
- **Unchanged (depended on, not modified):** `src/api/todos.ts` — the `Todo` model already
  exposes `done: boolean`. No API change is needed; the feature is purely presentational.
  Note: `toggleTodo` has a known bug (always sets `done=true`) tracked as a *separate* unit —
  out of scope here, but it means manual end-to-end toggling won't look right until that fix
  lands. Do not fold that fix into this unit.
- **New:** none. No new files or modules.

## Contracts
- **Boundary:** `renderTodos(): string` and `renderRow(t: Todo): string` — plain-text output,
  no public signature change. Callers continue to receive a newline-joined string.
- **Output format (the real contract being added):** each row encodes completion as a
  leading marker. Proposed: `- [x] <title>` when `done`, `- [ ] <title>` when not. This is a
  behavioural change to the rendered string — anything asserting the old `- <title>` shape
  must be updated. No consumers outside this repo depend on the format (in-memory demo app).
- **Input:** `Todo` is a trusted internal domain type; no boundary re-validation needed.

## Golden path
1. Update `renderRow` to prefix the marker based on `t.done`; keep the title text intact.
2. `renderTodos` is unchanged — it already maps rows and joins with `\n`, so the new format
   flows through for free. End-to-end slice (seeded `t1` done, `t2` not done) renders:
   `- [x] write the spec` / `- [ ] ship the demo`.

## Failure modes
- **Missing/undefined `done`:** the model types `done` as a required boolean, so this can't
  occur through the public API; the ternary on a boolean is total. No defensive branch needed.
- **Empty list:** `renderTodos` returns `""` (empty `map().join`) — unchanged, acceptable.
- **Long/odd titles:** rendering is pass-through text; no escaping concern for plain-text output.

## Test strategy
Load-bearing tier: **unit** (this is a pure formatting function — ~100% unit, no
integration/e2e warranted for an in-memory demo).
- `test_renderRow_doneTodo_showsCheckedMarker` — `renderRow({done:true})` contains `[x]`.
- `test_renderRow_pendingTodo_showsUncheckedMarker` — `renderRow({done:false})` contains `[ ]`.
- `test_renderTodos_seededList_rendersStatusPerRow` — asserts both markers present for the
  seeded todos, one row per todo.
- Assert behaviour (the visible marker + title), not the exact whitespace back to itself.
- Coverage must not decrease (Gate 1): add tests alongside the change.

## Observability
None. Pure synchronous string function with no I/O, side effects, or external calls — there
is nothing to log, meter, or trace. A human verifies by reading the rendered output / tests.

## Rollout
No feature flag or canary — in-memory demo, no deploy surface, no guest-facing or
revenue-affecting path. **Rollback** = revert the single commit touching `src/ui/render.ts`
and its tests. Behaviour-isolated, so revert is clean and complete.

## Ordered steps (each leaves the system green)
1. Add/adjust unit tests in `src/ui/` asserting the `[x]`/`[ ]` markers (red).
2. Update `renderRow` to emit the marker from `t.done` (green).
3. Run `bun test`; confirm all pass and no prior test regressed. Commit.
