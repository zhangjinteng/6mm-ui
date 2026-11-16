# Contract VIP table

Import `MmContractVipTable`, `ContractVipRow`, `ContractVipQuery` and `ContractVipRequest` from `@work-gpt/6mm-ui`. The host request returns `{ rows, total, updatedAt? }` and receives `{ signal }` for cancellation. The table owns keyword/VIP filters, sort whitelist, pagination, amount/progress display, and request lifecycle.

Default columns omit ownership metadata. Platform passes its existing source columns and a `field-keyword` slot to retain source-type/name controls. That slot also receives `loading`; do not embed cross-tenant controls in the white-label adapter. Source-type rendering can be supplied through `cell-source_type`.

Use `cell-user_id`/`cell-username` for host-owned identity display. Without a UID slot, clicking the UID emits `open-user` with the original row; Platform retains internal-ID modal navigation. Agent uses its public-UID detail button, backed by the existing server scope check.

The Agent view is `user/contractVip`, matching the reserved menu component for `/admin/userManage/contractVip`; permission is `users:contractVip`. This implementation does not insert menus or assign permissions to roles. Tests: `npx vitest run src/components/contract-vip-table/contract-vip.test.ts`.
