// Labels only: ownership must never be inferred from a site ID or a missing value.
export function orderIdentityText(key: string, row: Record<string, unknown>): string | undefined {
    if (key === 'source_name') return typeof row.source_name === 'string' && row.source_name ? row.source_name : '-'
    if (key === 'source_type') {
        switch (row.source_type) {
            case 'merchant': return '商户'
            case 'white_label': return '白标'
            case 'platform': return '平台'
            default: return '-'
        }
    }
    if (key === 'user_name') {
        if (String(row.user_type ?? '') === '3' && typeof row.user_name === 'string' && row.user_name.trim())
            return row.user_name
        return typeof row.nick_name === 'string' && row.nick_name.trim() ? row.nick_name : '匿名用户'
    }
    if (!['ownership_type', 'ownership_id', 'ownership_name'].includes(key)) return undefined
    const agent = row.agent_id
    if (typeof agent !== 'string' || !/^(0|[1-9]\d*)$/.test(agent)) return '—'
    if (key === 'ownership_type') return String(row.user_type ?? '') === '3' ? '机器人' : agent === '0' ? '白标' : '商户'
    if (key === 'ownership_id') return agent
    if (agent === '0') return '6mm'
    return typeof row.agent_name === 'string' && row.agent_name.trim() ? row.agent_name : '—'
}
