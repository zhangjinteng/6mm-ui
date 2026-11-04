# Tenant channel settings

`MmSocialChannels` is the shared controlled 12-platform form used inside Platform's
existing channel dialog. `MmTenantChannelSettings` wraps it in a full-page header,
social section, loading/error states and saved/dirty footer for Agent.

```vue
<MmTenantChannelSettings
  :load="getOwnTenantChannels"
  :save="saveOwnTenantChannels"
  :can-edit="hasPermission(['whiteLabel:site:channel'])"
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
in a later release. This change does not alter dependency pins or lockfiles. Agent uses
`whiteLabel:site:channel` for both reading and saving: accounts granted the channel page
can edit their own tenant. The legacy `whiteLabel:site:channel:save` action is not required
and does not independently grant access. Tenant isolation and transactional auditing remain enforced.
