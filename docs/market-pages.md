# Shared market pages

Import `MmMarketCurrentPage` and `MmMarketHistoryPage` from `@work-gpt/6mm-ui` (plus the usual `@work-gpt/6mm-ui/style.css`). Both pages are read-only and own their table/filter/paging UI.

- Current page: supply `MarketCurrentApi` (`preview`, `symbols`, `tradeStats`) and an optional reactive `MarketPriceMap`. The host owns its public ticker websocket and cleanup. Unknown prices and failed statistics render `-`, not synthetic prices. A successful, empty trade aggregate retains zero-volume semantics.
- History page: supply `MarketHistoryApi` (`history`, `symbols`). Index price is the default; mark price is also available. Decimal strings retain precision, UTC buckets display in the browser timezone, and page changes reuse the server's `end_ms` anchor.
- Both expose a `symbol` slot with `{ symbol }` so hosts retain their existing coin display components. API callbacks receive an `AbortSignal`; requests are canceled on unmount and stale responses cannot replace the active page.

Platform adapters keep `/symbol/preview`, `/symbol/list/all`, `/symbol/all`, `/symbol/trade-stats-24h`, and `/market/history`. Agent white-label adapters use `/market/preview`, `/market/symbols`, `/market/trade-stats-24h`, and `/market/history`. Authentication, permissions, tenant filtering and DB credentials stay in the PHP hosts; do not call Platform's privileged APIs from Agent.

Agent view components match the existing menu component paths `config/symbol_list/index` and `historical/other_price_history/index`, used by `/admin/contractTrading/market/symbol_list` and `/admin/contractTrading/market/history`. No static routes or menu/permission records are inserted by the components.

Run `npm run test:market`, `npm run typecheck`, and `npm run build` to verify. Building/local dependency sync does not publish a release.
