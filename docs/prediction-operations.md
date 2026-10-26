# Shared Prediction Lists

`MmPredictionOperationTable` implements UP_DOWN rounds/current/history and HIGH_LOW current/history. `MmPredictionGridOrderTable` implements GRID current/history. Import them explicitly from `@work-gpt/6mm-ui` together with `@work-gpt/6mm-ui/style.css`.

## Host Boundary

Supply a `PredictionPageAdapter` or `PredictionGridAdapter` and a reactive `PredictionPageContext`. The host retains its router, authenticated HTTP transport, token refresh/logout hooks, permission source and symbol asset component. The SDK must never read browser tokens or select an API host.

- `actorId`: current authenticated operator ID as a string.
- `identityKey`: changes whenever trusted login identity, root merchant or site scope changes. Hosts currently derive this from their user-store identity snapshot. Never include credentials.
- `permissions`: original host permission keys, including its existing wildcard behavior. UI checks are not server authorization.
- `route`: reactive `fullPath` and query for existing order deep links.
- Adapters accept an `AbortSignal` and return the unwrapped typed response or reject. They must not convert failures into successful empty pages.
- `showSources`: Platform uses true; Agent uses false to preserve merchant presentation. This is display only and never changes server scope.
- `locale`: Agent passes its existing `zh-CN`/`en-US` locale; absent values inherit the 6mm locale provider.
- `symbolComponent`/`symbols`: optional host-owned symbol display and directory. Historical symbols remain searchable if the directory is unavailable.
- `field-agent_id` slot: optional Platform merchant selector, backed by its existing authorized endpoint.

## Shared Behavior

Date confirmation updates the draft only. Rows, totals and page stay unchanged until Query. Query starts at page 1; pagination and Refresh use the last committed query. Rounds and histories default to seven local calendar days. A cleared date uses the existing bounded default, never an unlimited request.

The components use `MmProTable` pagination and common scrollbars. Historical layouts retain centered actions, row-detail drawers, ledger IDs in drawers, time fields at the end and two-line timestamps. Platform history column profiles total 1750px; Agent omits unavailable source columns. All identifiers and money remain strings; nickname takes precedence over username.

Identity/route/permission changes cancel outstanding reads, clear rows/totals and close detail drawers. Late results cannot repopulate another identity's view. Deep links still pass through the host locator and permission checks.

## Errors And Verification

SDK presentation maps whitelisted error codes to safe localized messages. Unknown errors never display transport messages, SQL or credentials. Host authentication hooks remain responsible for logout/redirection. Do not add toast or catch-and-empty logic in page wrappers.

`src/components/prediction-operations/__tests__/PredictionPages.test.ts` covers all seven modes, draft/commit behavior, default range, permissions, cancellation, drawer fields, precision and error redaction. Run `npm test -- --run` and `npm run typecheck` before packaging. No request in these components performs a business write.
