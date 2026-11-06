# CMS Source Filters Implementation Plan

**Goal:** Keep CMS ownership controls, submitted list filters and tenant options consistent across all nine shared pages.

**Architecture:** One CMS source coordinator owns metadata loading and binds the existing pro-table controller. Scope changes submit current filters; explicit query/reset handlers record the submitted scope to avoid duplicate automatic queries. White-label mode retains site-scoped transport and hides cross-owner controls.

**Tech Stack:** Vue 3, TypeScript, Vitest, Vue Test Utils, Vite.

## Tasks

1. [x] Mount all nine actual page components with a host-style duplicate-request cancellation fixture. Reproduce missing immediate list submission and empty tenant options.
2. [x] Centralize metadata loading, ownership normalization and query coordination in `src/cms/views/content/cmsSources.ts`. Replace duplicate page metadata loaders and wire all nine tables to the coordinator.
3. [x] Cover manual search, reset, paging, rapid scope changes, failed/stale requests, disposal and white-label isolation.
4. [x] Run CMS regression tests, type checking and a library build. Verify the source playground in a browser using read-only fixtures.

## Constraints

- No backend, database, global Axios cancellation or authorization changes.
- Preserve unrelated work already present in this worktree and its generated build output.
- Do not publish, tag, bump versions or modify platform/agent dependency manifests.
- Existing keyword searches remain manual; only ownership controls submit immediately.

## Verification

- Initial full-page regression run reproduced 12 failures, including duplicate metadata calls on eight pages and missing ownership submission on all nine pages.
- CMS script tests: 41 passed.
- Final full Vitest suite: 164 files, 946 tests passed, including 32 full-page ownership regressions.
- `npm run typecheck` and `npm run build` passed; library declarations and distribution output regenerated.
- Browser read-only fixture: metadata/list counts started at 1/1, then 2/2 after selecting white-label, 3/3 after selecting a tenant, and 4/4 after reset. Tenant choices were populated and rows matched the selection without clicking Search.
- Agent white-label fixture retained only the current tenant's rows, with no cross-owner controls and one initial metadata/list request each.
- No real backend/configuration changes, package publishing, or platform/agent dependency upgrades were performed.
