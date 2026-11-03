# Tenant channel settings

`MmSocialChannels` is the shared controlled 12-platform form used inside Platform's
existing channel dialog. `MmTenantChannelSettings` wraps it in a full-page header,
social section, loading/error states and saved/dirty footer for Agent.

```vue
<MmTenantChannelSettings
  :load="getOwnTenantChannels"
  :save="saveOwnTenantChannels"
  :can-edit="hasPermission(['whiteLabel:site:channel:save'])"
/>
```

The callbacks return `TenantChannelDetail` / `TenantChannelSaveResult`. The full page
sends social links and the original version token only; the host resolves ownership.
Both host `canEdit` and server `detail.can_edit` must allow editing. For route navigation,
use the exposed `hasUnsavedChanges` value in the host's navigation guard.

No autosave, polling, URL navigation or business API is built into the components.
Blank links are hidden. Invalid HTTPS links are not counted as configured and disable saving.
Configuration conflicts preserve the draft and offer explicit discard/reload.

Run `npm run typecheck` and `npx vitest run src/components/tenant-channel-config/tenant-channels.test.ts`.
The in-memory preview is available at `/tenant-channels` after `npm run dev`;
`?readonly` exercises server-side read-only state. Preview saves never call business APIs.

Source-only handoff: publish compatible PHP/UI versions and update both hosts together
in a later release. This change does not alter dependency pins or lockfiles. Deploy Agent's
channel-save permission migration after the existing site-menu migration; grant the new
save action explicitly to editable non-owner roles. Existing view-only grants remain read-only.
