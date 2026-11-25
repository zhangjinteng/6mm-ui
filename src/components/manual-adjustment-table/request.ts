import type { AccountChangeLogListQuery, AccountChangeLogListResult, AccountChangeLogRequestContext } from '../account-change-log-table'
import type { ManualAdjustmentRow } from './types'

interface ManualAdjustmentApiResult {
    lists?: ManualAdjustmentRow[]
    has_more?: boolean
    has_previous?: boolean
    next_cursor?: string | null
    previous_cursor?: string | null
}

export function createManualAdjustmentRequest(get: (params: Record<string, unknown>, signal: AbortSignal) => Promise<ManualAdjustmentApiResult>) {
    return async function getManualAdjustments(
    query: AccountChangeLogListQuery & { source_type?: string; agent_id?: string | number; tenant_id?: string | number },
    context: AccountChangeLogRequestContext
): Promise<AccountChangeLogListResult<ManualAdjustmentRow>> {
    const scalarFilter = (key: string) => {
        const value = context.filters[key]
        return typeof value === 'string' ? value.trim() : ''
    }
    const result = await get({
            page_size: query.page_size,
            cursor: query.cursor,
            keyword: query.keyword,
            start_time: query.start_time,
            end_time: query.end_time,
            order_by: query.order_by === 'id' ? 'created_at' : query.order_by,
            order_dir: query.order_dir,
            source_type: query.source_type,
            agent_id: query.agent_id,
            tenant_id: query.tenant_id,
            flow_id: scalarFilter('flow_id'),
            username: scalarFilter('username'),
            asset_type: scalarFilter('asset_type'),
            direction: scalarFilter('direction'),
            account_type: scalarFilter('account_type')
    }, context.signal)
    return {
        rows: Array.isArray(result?.lists) ? result.lists.map(row => ({
            ...row, id: row.record_key || `${row.account_type}:${row.id}`
        })) : [],
        hasMore: Boolean(result?.has_more),
        hasPrevious: Boolean(result?.has_previous),
        nextCursor: result?.next_cursor || null,
        previousCursor: result?.previous_cursor || null,
        updatedAt: new Date()
    }
}
}
