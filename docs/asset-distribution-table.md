# Current account asset distribution table

Import `MmAssetDistributionTable`, `AssetDistributionRequest`, `AssetDistributionQuery`, and `AssetDistributionRow` from `@work-gpt/6mm-ui`. Supply a read-only request returning `{rows,total}`, receiving the query plus `{signal}`. The component owns filtering, sorting, paging, cancellation, account/source tags and decimal formatting.

Platform uses default `showSources=true` to retain platform/tenant/merchant filters and source columns. Agent uses `showSources=false`: only account filtering remains, source columns are omitted, and the component does not submit source parameters. The server must still enforce tenant scope; the UI flag is not authorization.

The `currency` slot receives `{row}` for host coin rendering. Supply `formatTimestamp` for the host's browser-timezone formatter. Missing amounts/shares remain `-`; amounts retain decimal-string precision; shares are server-supplied percentage points, not ratios recalculated from the visible rows. Incomplete snapshots retain their warning.

Agent component path `assets/distribution` matches the reserved menu at `/admin/fundManagement/assetDistribution`, permission `asset:distribution`. The existing period-based report component is not replaced. No menus or role bindings are inserted by the UI.

Verification: `npm run test:asset-distribution`, `npm run typecheck`, `npm run build`. Local build/artifact synchronization is not a publication.
