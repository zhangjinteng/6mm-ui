# MmFundingOverviewTable

Shared current USDT overview for Agent's funding overview and Platform's user-assets page.

```vue
<MmFundingOverviewTable :request="requestOverview">
  <template #cell-user_id="{ row }"><UserDetailLink :user-id="row.platform_user_id">{{ row.user_id }}</UserDetailLink></template>
</MmFundingOverviewTable>
```

The request receives `FundingOverviewListQuery` plus `{ signal }` and returns `{ rows, total, updatedAt? }`. Hosts translate HTTP envelopes and handle authentication/source filters. Columns, identity cells and query-field slots are extensible; the component contains no application API URLs or user dialogs.

Default sort is funding balance descending. Keyword/date filters, sortable fields, server pagination, column settings, loading/error/retry states and manual refresh use MmProTable. Auto-refresh is disabled. Amounts reuse the funding formatter: two decimal places, exact-string half-up rounding, grouping separators, no floating-point precision loss.

Build with `npm run build`; run the component regression with `npm test -- --run src/components/funding-overview-table/__tests__/FundingOverviewTable.test.ts`. No package version is changed by this extraction.
