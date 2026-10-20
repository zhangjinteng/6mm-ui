# MmLiquidationWarningTable

Shared warning table built on `MmPositionTable`. It reuses query/paging/cancellation, column configuration and caller slots, adds the risk-rate/level columns and the warning-rule dialog, and keeps automatic refresh disabled.

```vue
<MmLiquidationWarningTable
  :request="listWarnings"
  :load-rules="loadRules"
  :save-rules="saveRules"
  :can-edit-rules="canEditRules"
  :market-prices="marketPrices"
>
  <template #cell-user_id="{ row }">
    <UserUidDetailButton :value="row.user_id" />
  </template>
</MmLiquidationWarningTable>
```

`request` follows `PositionListRequest` and returns `{ rows, total }`. `loadRules()` and `saveRules(payload)` return the three API fields: `min_large_position_value`, `liquidation_high_risk_threshold`, `liquidation_warning_notify_enabled`. API values are **percentages**, while each row's `margin_ratio` is a **fractional ratio**. Do not multiply either value twice.

The host owns authorization and persistence. `canEditRules` defaults to false; a missing saver makes the dialog read-only. Host endpoints must derive merchant/site scope on the server. A successful save refreshes the list; a failed save keeps the draft open. Configuration-load failures disable saving and expose an explicit retry. The component does not fabricate thresholds or risk grades when loading fails.

Platform may pass custom `columns` and source-selection slots. Agent uses the shared defaults without the cross-source selectors. All position-table slots are forwarded, with built-in fallbacks for `query-actions` and `cell-warning_level`.

Exports include `MmLiquidationWarningRulesDialog`, public rule/loader/saver types, and the pure parsing, validation, risk-formatting and warning-level helpers.
