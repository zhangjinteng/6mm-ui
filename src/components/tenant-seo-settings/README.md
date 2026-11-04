# MmTenantSeoSettings

Shared editor for per-site SEO: full page in Agent, embedded fixed-height dialog in Platform (`fullPage=false`). Preserves the existing indexing, multilingual copy and optional Google Search Console cards. The multilingual dialog retains independent drafts, configured-target counts, blank-only translation, explicit apply, field-level retry, cancellation and protection against late responses overwriting manual edits.

Hosts supply `load(signal, siteId?)`, `save({site_id, expected_version, ...draft})`, `translation.loadContext` and `translation.translate` callbacks. Identity is not selected by this component. Agent only receives server-owned enabled sites; dirty site changes require confirmation. Both host `canEdit` and server `can_edit` are enforced. Exposes `hasUnsavedChanges`, `isSaving`, `isBusy`, `requestClose` for host navigation/modal guards. No autosave/polling; errors preserve drafts and reads can be retried.

Both hosts may supply optional `translation.saveSettings` and `translation.testConnection`. Platform retains its existing configuration permission and platform-wide scope. Agent uses SEO-authorized endpoints that reuse the CMS validation/encryption service and enforce the logged-in tenant's enabled site-space scope; it cannot edit platform-wide or other tenants' settings. The dialog distinguishes platform configuration from the current content space and clears candidate keys on close/save. Saving refreshes configured language rows without discarding the SEO draft.

The component does not output website meta tags, robots.txt, canonical links, hreflang or sitemaps; it edits the existing backend configuration only. It uses 6mm tokens/components and native textarea inputs, so adding SEO does not make the root library require Element Plus.

Tests: `node --test src/components/tenant-seo-settings/seo.behavior.test.mjs` (migrated Platform regression coverage), `npx vitest run src/components/tenant-seo-settings/seo.test.ts`, `npx playwright test tests/browser/tenant-seo.spec.ts`.

Source only: release shared packages and upgrade host dependencies in a separate deployment. For QA before release, build to a temporary output and use isolated Vite aliases; do not replace tracked dist or installed packages.
