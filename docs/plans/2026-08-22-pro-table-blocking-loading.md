# MmProTable Blocking Loading Implementation Plan

> **Goal:** Make query, reset, manual refresh, retry, pagination, page-size, and sort requests reuse the centered initial-loading state, while keeping timer-driven auto refresh lightweight.

**Architecture:** `useMmProTable` owns request intent and exposes a `blockingLoading` binding. `MmProTable` renders the existing loading state as an opaque overlay when rows already exist, preserving table layout and cached rows. Direct `MmProTable` consumers retain backward-compatible behavior: `loading=true` is blocking unless `blockingLoading` is explicitly set.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite.

---

## Task 1: Lock request-intent behavior with composable tests

**Files:**

- Modify: `src/composables/__tests__/use-pro-table.test.ts`
- Modify: `src/composables/use-pro-table.ts`

1. Add a pending-request test proving manual reload exposes `blockingLoading=true` after rows exist.
2. Add an auto-refresh assertion proving `refreshing=true` but `blockingLoading=false`.
3. Run the focused test and confirm it fails before implementation.
4. Add the new reactive binding and sequence-safe cleanup.
5. Run the focused test and confirm it passes.

## Task 2: Render the same centered loading state over populated tables

**Files:**

- Modify: `src/components/pro-table/__tests__/ProTable.test.ts`
- Modify: `src/components/pro-table/types.ts`
- Modify: `src/components/pro-table/ProTable.vue`
- Modify: `src/components/pro-table/pro-table.css`

1. Add component tests for the populated-table blocking overlay and lightweight auto-refresh state.
2. Confirm the new component test fails before implementation.
3. Add the optional `blockingLoading` prop with a backward-compatible fallback.
4. Reuse the existing loading copy/icon in an absolute body overlay and preserve the table DOM.
5. Disable query tools and pagination only during blocking requests.
6. Run the focused component tests and confirm they pass.

## Task 3: Verify library integrity

**Files:**

- Verify all changed files only.

1. Run Prettier on changed source, test, and plan files.
2. Run `git diff --check`.
3. Run focused Vitest suites.
4. Run `npm run typecheck`.
5. Run `npm run build`.
6. Review the final diff and preserve unrelated workspace changes.

No 6mm-php change is required because this is request-state presentation, not API data or backend behavior. Publishing a new 6mm-ui version and updating application dependencies is a separate release step and will not be performed unless requested.
