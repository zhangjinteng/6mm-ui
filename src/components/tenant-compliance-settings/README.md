# MmTenantComplianceSettings

Shared per-site compliance editor for Agent full-page settings and Platform's embedded modal. Includes the profile and five agreement types, validation/focus, published-template metadata, read-only mode, dirty-site switching, cancellation and explicit save. No HTTP client, polling, automatic save or public agreement renderer.

```vue
<MmTenantComplianceSettings
  :load="(signal, siteId) => getOwnCompliance(signal, siteId)"
  :save="saveOwnCompliance"
  :can-edit="hasCompliancePermission"
/>
```

- Import component, models and `ComplianceDetail / ComplianceSaveInput / ComplianceSaveResult` from the package root.
- `load(signal, siteId?)` returns the detail, revision, optional owned `sites` list and `can_edit`. Both host and server read-only flags are enforced.
- `save(input)` receives only site ID, expected revision, five profile fields and agreement drafts. It must return the freshly persisted detail. The host supplies authenticated tenant context; a component prop is never an authorization boundary.
- Platform uses `:full-page="false"` inside a fixed-height modal; append the selected tenant ID in the host adapter and retain its separate save permission. `saved` refreshes the list; `close` closes the modal.
- Exposes `hasUnsavedChanges`, `isSaving`, `isBusy` for host route/modal guards. Agent confirms dirty route departure. Abort signals and generation checks prevent stale reads applying after unmount.
- Structured validation errors may be `{ errors }` or Axios's `response.data.data.errors`. Unknown save failures block repeat submission until explicit reload; revision conflicts remain blocked after local edits.
- Profile fields are site-level, shared with existing account profiles. Support email is not the tenant-level channel fallback email. Tenant name is read-only.
- Effective date uses `MmDatePicker` in both full-page and embedded modes, with `YYYY-MM-DD` display/persistence. Clearing normalizes to an empty string; invalid typed dates block saving until corrected or discarded. Disabled/readonly permissions and platform-template required validation still apply.
- Existing custom content can be retained or replaced with a URL, not authored here. Only published template metadata is displayed; saving site settings does not publish platform drafts.

Tests: `npm run test:tenant-compliance`; browser fixture `/tenant-compliance` uses memory only, including `?readonly`, `?uncertain`, `?conflict`.

Source-only integration: publish a coordinated shared package version and upgrade both hosts later. Do not copy the editor/model back into either host or modify tracked `dist` for this extraction.
