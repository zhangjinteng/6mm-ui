# Report Display Status Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** All 11 requested reports display only processing/completed, based on whether the UTC statistical day/month contains today.

**Architecture:** Extract the existing trade-summary date comparison into a shared public utility. All shared report status slots and both applications' existing date-status adapters use this utility; source statuses and producer jobs remain unchanged. Work in the current checkout to preserve the user's in-progress shared-library integration; do not publish, deploy or commit unrelated changes.

**Tech Stack:** Vue 3, TypeScript, Vitest, Node test runner, Vite.

---

### Task 1: Date/status regression coverage

**Files:**
- Create: `src/shared/__tests__/report-status-components.test.ts`.
- Move/extend: `src/components/platform-trade-summary-report/__tests__/date-status.test.ts` to `src/shared/__tests__/report-date-status.test.ts`.

1. Add parameterized tests for all 11 components in merchant/platform mode. Current day/month must be warning/processing even with completed source status; historical/future periods must be success/completed even with processing/partial/failed source status. Returned source records remain unchanged.
2. Run `npm test -- --run src/shared/__tests__/report-status-components.test.ts`; expect failures before applying the shared rule.

### Task 2: One shared date rule

**Files:**
- Create: `src/shared/report-date-status.ts`; modify `src/shared/index.ts`.
- Modify status slots in `UserDailyReport.vue`, `PlatformTradeSummaryReport.vue`, `PlatformPnlReport.vue`, `FuturesTradeReport.vue`, `FuturesPnlReport.vue`, `FuturesUserNetPnlReport.vue`, `FuturesFeeReport.vue`, `FuturesFundingFeeReport.vue`, `FuturesRiskReport.vue`, `FuturesPositionReport.vue`, `PredictionUserPnlReport.vue` in their existing `src/components/*-report/` directories.
- Remove the superseded trade-summary-only `date-status.ts`.

1. Implement `isCurrentReportPeriod(statDate, now)` by comparing a normalized report day with `now.toISOString().slice(0, 10)` or a report month with its first seven characters.
2. Export `resolveReportDateStatus` returning only `processing` or `completed`, plus the public status type.
3. Replace source-status predicates in each slot with the common date predicate. Keep amounts, filters, requests, producer status and table layout unchanged.
4. Update old source-status expectations, run report tests and `npm run typecheck`, then build the shared package.

### Task 3: Both application adapters and verification

**Files:**
- Agent: `/Users/mac/PhpstormProjects/agent/agent_admin_view/src/utils/daily-report-status.ts` and `.test.mjs`.
- Platform: `/Users/mac/PhpstormProjects/platform/platform_admin_view/src/utils/report-date-status.ts` and `.test.mjs`.

1. Re-export the shared function from both adapters, keeping existing consumer names intact.
2. Update tests to UTC and exact-period matching; include future periods and invalid/empty dates as completed. Check that old page status overrides still use the adapters.
3. Run both Node adapter/page regression suites; build both apps into temporary output directories to avoid replacing the user's existing build assets.
4. Verify both locally installed dependency copies contain the rebuilt shared package. The apps currently use registry-installed 1.0.72 rather than symlinks; synchronize generated `dist/` for local verification only. A formal release and dependency version update are separate work. No migrations, source queries, schedule changes, releases or Git commits are part of this request.

## Verification results

- Shared UI: 137 test files, 638 tests passed; type checking passed.
- Agent adapters/pages: 18 tests passed.
- Platform adapters/pages: 22 tests passed.
- The new date-status helper, all 11 report components, and both page adapters are covered. Generated shared bundle hashes match across the source package and both local installed copies.
