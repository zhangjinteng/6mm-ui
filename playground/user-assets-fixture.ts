import type { UserAssetListQuery, UserAssetListResult, UserAssetRow } from '../src'

export interface UserAssetPreviewRow extends UserAssetRow {
  agent_user_id: string
  nice_name: string | null
  ua_id: number
  user_type: 1 | 2
  username: string
}

const symbols = ['BTCUSDT', 'ETHUSDT', 'SOLUSDT'] as const

export const userAssetRows: UserAssetPreviewRow[] = Array.from({ length: 47 }, (_, index) => {
  const sequence = index + 1
  const symbol = symbols[index % symbols.length]!
  const quantity = Number((0.02 + (index % 7) * 0.015).toFixed(4))
  const entryPrice = symbol === 'BTCUSDT'
    ? 68_000 + index * 37
    : symbol === 'ETHUSDT'
      ? 3_500 + index * 3
      : 145 + index * 0.35
  const wallet = 7_500 + index * 427.35
  const margin = 380 + index * 22.18

  return {
    agent_user_id: `EXT-${8100 + sequence}`,
    available_balance: (wallet - margin).toFixed(2),
    nice_name: sequence % 4 === 0 ? `资产用户 ${sequence}` : null,
    positions: [{
      entry_price: entryPrice,
      margin: margin.toFixed(2),
      quantity,
      side: sequence % 5 === 0 ? 'short' : 'long',
      symbol,
    }],
    total_margin: margin.toFixed(2),
    total_quantity: { [symbol]: String(quantity) },
    ua_id: 5000 + sequence,
    user_id: 739_000_000 + sequence * 137,
    user_type: sequence % 3 === 0 ? 2 : 1,
    username: `asset_${String(sequence).padStart(4, '0')}`,
    wallet_balance: wallet.toFixed(2),
  }
})

export function resolveUserAssets(query: UserAssetListQuery): UserAssetListResult<UserAssetPreviewRow> {
  const keyword = query.keyword.trim().toLowerCase()
  const rows = userAssetRows.filter((row) => {
    const matchesKeyword = !keyword || [
      row.user_id,
      row.username,
      row.nice_name,
      row.agent_user_id,
    ].some(value => String(value ?? '').toLowerCase().includes(keyword))
    const matchesType = !query.user_type || Number(query.user_type) === row.user_type
    return matchesKeyword && matchesType
  })

  const direction = query.order_dir === 'asc' ? 1 : -1
  rows.sort((left, right) => {
    const leftValue = query.order_by === 'ua_id' ? left.ua_id : Number(left.user_id)
    const rightValue = query.order_by === 'ua_id' ? right.ua_id : Number(right.user_id)
    return (leftValue - rightValue) * direction
  })

  const start = (query.page_no - 1) * query.page_size
  return {
    rows: rows.slice(start, start + query.page_size),
    total: rows.length,
  }
}
