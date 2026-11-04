# Tenant feature settings

`MmTenantFeatureSettings` shares the frontend-entry editor between Platform (embedded dialog) and Agent (full page). This version supports **only `trade_ranking`**; other screenshot entries are intentionally not exposed.

Provide `load(signal, siteId?)` and `save({ site_id, features, expected_updated_at })` callbacks. Both return the server detail; saves return `{ changed, detail }`. The host owns authentication, API envelopes and error reporting. `canEdit` and server `can_edit` both constrain edits. Agent supplies `sites` containing only its enabled sites. Site changes with a draft require confirmation.

The editor does not autosave or poll. It preserves failed drafts, supports discard/reload, prevents duplicate saves, and exposes `hasUnsavedChanges`, `isSaving`, `isBusy` for host navigation guards. `fullPage=false` supplies dialog content and emits `close`/`saved`.

Backend contract: use `SixMm\Shared\TenantFeatures\FeatureConfigStore`; derive Agent tenant identity on the server. Only feature-classified `control_plane.wl_site_modules` rows may change. Missing ranking config means enabled, without inserting on read. Save requires the exact version and a transactional audit callback; it never publishes business entitlements or snapshots.

Source-only integration requires a later shared-package release and host dependency upgrade. For isolated QA before release, build to a temporary directory and alias that output in a test server; do not replace installed dependencies or tracked `dist`.
