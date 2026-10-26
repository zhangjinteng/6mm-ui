/** 新场次编号单行完整显示；历史内部编号可悬停查看全值。 */
export function predictionColumnWidth(key: string, view?: 'rounds' | 'up-down-current' | 'up-down-history' | 'high-low-history' | 'grid-history'): number {
    if (view === 'grid-history') {
        if (key === 'order_no') return 176
        if (key === 'user_name') return 102
        if (key === 'source_type') return 76
        if (['source_name', 'symbol', 'result_price'].includes(key)) return 112
        if (key === 'price_range') return 200
        if (key === 'locked_multiplier') return 88
        if (['created_at_ms', 'settled_at_ms'].includes(key)) return 94
        if (key === 'operation') return 64
        return 104
    }
    if (view === 'high-low-history') {
        if (key === 'order_id') return 176
        if (['public_user_id', 'source_name', 'symbol'].includes(key)) return 104
        if (['user_name', 'open_price', 'result_price'].includes(key)) return 100
        if (key === 'source_type') return 76
        if (key === 'duration_seconds') return 56
        if (['direction', 'actual_direction', 'operation'].includes(key)) return 64
        if (['stake', 'actual_return'].includes(key)) return 92
        if (key === 'fixed_odds') return 80
        if (key === 'order_status') return 96
        if (key === 'realized_pnl') return 90
        if (['expire_at_ms', 'funds_completed_at_ms'].includes(key)) return 94
    }
    if (view === 'up-down-history') {
        if (key === 'order_id') return 200
        if (key === 'round_id') return 202
        if (key === 'public_user_id') return 104
        if (key === 'source_name') return 100
        if (key === 'symbol') return 128
        if (['open_price', 'result_price'].includes(key)) return 112
        if (key === 'user_name') return 124
        if (['stake', 'actual_return', 'realized_pnl'].includes(key)) return 96
        if (key === 'order_status') return 84
        if (key === 'source_type') return 76
        if (key === 'duration_seconds') return 56
        if (['direction', 'actual_direction', 'operation'].includes(key)) return 64
        if (key === 'final_odds') return 80
        if (key === 'funds_completed_at_ms') return 94
        if (['debit_ledger_id', 'settlement_ledger_id'].includes(key)) return 148
    }
    if (view === 'up-down-current') {
        if (key === 'round_id') return 202
        if (['user_name', 'ownership_name', 'stake', 'open_price', 'order_status'].includes(key)) return 100
        if (key === 'ownership_type') return 80
        if (key === 'ownership_id') return 90
        if (['symbol', 'estimated_return'].includes(key)) return 110
        if (key === 'duration_seconds') return 60
        if (key === 'direction') return 64
        if (key === 'final_odds') return 72
        if (key === 'created_at_ms') return 156
    }
    if (view === 'rounds') {
        if (key === 'round_id') return 202
        if (key === 'symbol') return 110
        if (['bet_open_at_ms', 'bet_close_at_ms', 'draw_at_ms'].includes(key)) return 94
        if (['start_price', 'end_price'].includes(key)) return 98
        if (key === 'settled_at_ms') return 100
        if (key === 'duration_seconds') return 50
        if (['draw_outcome', 'participant_count', 'order_count'].includes(key)) return 70
        if (key === 'status') return 80
        if (['up_pool', 'down_pool'].includes(key)) return 110
        if (['total_stake', 'total_return', 'round_pnl'].includes(key)) return 100
    }
    if (key === 'order_no') return 196
    if (key === 'round_id') return 252
    if (['order_id', 'debit_ledger_id', 'settlement_ledger_id'].includes(key)) return 164
    if (key.endsWith('_at_ms')) return 164
    if (key === 'price_range') return 184
    if (key === 'order_status') return 120
    if (key === 'source_name') return 150
    if (key === 'source_type') return 100
    if (['user_name', 'ownership_name'].includes(key)) return 116
    if (['public_user_id', 'user_id', 'ownership_id'].includes(key)) return 104
    if (key === 'symbol') return 116
    if (['duration_seconds', 'fixed_odds', 'final_odds', 'locked_multiplier'].includes(key)) return 80
    if (['direction', 'actual_direction', 'ownership_type', 'draw_outcome', 'status', 'cell_id', 'result_cell', 'participant_count', 'order_count'].includes(key)) return 88
    return 116
}
