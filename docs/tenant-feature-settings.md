# Site feature switches

`MmTenantFeatureSettings` keeps the Platform-compatible, ranking-only behavior by default.
Agent explicitly adds the boolean `content-features` prop to render five additional cards in
服务与内容: news, academy, help center, feedback, and announcements.

```vue
<MmTenantFeatureSettings :load="load" :save="save" content-features />
```

The opted-in load adapter must return all six boolean `features` fields and the server's
64-character `expected_revision`. Missing content flags/revision are treated as a load
error rather than silently defaulting to values that might overwrite existing configuration.
`expected_updated_at` is retained for display and legacy compatibility.

Toggling these cards only changes a local draft. Save submits site ID, both version values,
and the six flags; no tenant or actor ID is supplied by the component. Discard restores the
last loaded values; switching sites with unsaved edits requires confirmation. Counts and
pending-change status include all visible entry switches.

`customer-service` remains optional and independent: its own tenant-wide switch applies
immediately, and is never included in the site feature-save payload. Without `content-features`,
Platform continues displaying/submitting only `trade_ranking`, even if a load response
contains additional fields.

Upgrade the shared PHP store and Agent backend before enabling the new frontend package.
No database schema migration is required (`wl_site_modules`, `module_type=feature`).
Public website/APP clients still need to read the five feature flags to control their own
entry visibility. These switches are not CMS authorization or business entitlements.
