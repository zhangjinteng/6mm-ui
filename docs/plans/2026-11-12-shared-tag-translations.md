# Shared tag translations implementation plan

**Goal:** Agent and Platform tag translations reuse the SEO multilingual editor and the shared PHP translation engine without changing database schemas or credential ownership.

**Architecture:** Extract field-driven multilingual editing into 6mm-ui. SEO keeps its site context/settings wrapper; tag dialogs adapt their single name field and existing load/translate/save contracts. Extract plain-text translation orchestration into 6mm-php and reuse the existing Google client. Agent retains its encrypted agent_translation_config; Platform uses its existing CMS platform translation configuration. Translations remain in symbol_tag_translation and legacy Chinese/English columns.

**Tech stack:** Vue 3, TypeScript, Laravel 8, shared PHP, Vitest, PHPUnit, isolated SQLite/fake HTTP.

## Steps

1. Add a generic multilingual fields component and tests (single/multiple fields, readonly, field errors); use it in both existing dialogs while keeping draft/apply/late-response protection.
2. Share tag translation storage/validation and plain-text Google calls in 6mm-php. Keep Agent's adapter/API and error compatibility; test exact scoped/legacy ownership.
3. Wire Platform tag translation callbacks, authenticated read/translate/save routes, draft translations in existing create/edit transactions, existing platform credentials and publication hook. Preserve unrelated dirty edits.
4. Run shared/editor/tag/SEO tests, Agent/Platform isolated regression tests, lint/type checks. Do not migrate, release, update dependencies, edit vendor, or call actual Google/Redis/database services.

No credential-source migration or schema migration is included. CMS full-page content/job management remains a separate workflow, not an SEO/tag editor.
