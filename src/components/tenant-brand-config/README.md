# Shared brand/domain settings

`MmTenantBrandSettings` implements the existing domain-only brand editor, including
adding/removing domains, primary selection, maximum 20 domains, validation, pending
site-switch confirmation, explicit save confirmation, rollback/discard and error retry.
It does not add new brand/logo fields or make network calls itself.

```vue
<MmTenantBrandSettings
  :load="getOwnTenantBrand"
  :save="saveOwnTenantBrand"
  :can-edit="hasPermission(['whiteLabel:site:brand'])"
/>
```

Use `full-page="false"` inside Platform's existing tenant-selection dialog. Agent uses
the full-page header, selected site's update time, domain tab/count and bottom save bar.
The component combines host permission with `detail.can_edit`, and emits `saved` /
`close`. Hosts can use exposed `hasUnsavedChanges` / `isSaving` for navigation guards.
Existing domain text remains read-only, matching Platform: remove/add to rename.

Save callbacks receive only the selected `site_id`, original `expected_revision` and
normalized `domains`. Platform adds its authorized selected tenant; Agent's server
derives tenant identity. Raw snapshot/publisher data must never be sent from the UI.

Run `npm run typecheck` and `npx vitest run src/components/tenant-brand-config/tenant-brand.test.ts`.
The `/tenant-brand` playground preview uses in-memory data only (`?readonly` for read-only).

Source-only handoff: no publishing or dependency changes are included. A later coordinated
6mm-php / 6mm-ui release and both-host dependency upgrade is required for live use.
