import type {
  MmProTableRequestParams,
  ProTableColumn,
  QueryBarField,
  UserListQuery,
  UserRow,
} from '../src'

export type TradingAccountType = 'internal' | 'live'

export interface TradingAccountRow extends UserRow {
  externalId: string
  flag: string
  id: string
  lastLoginAt: string
  location: string
  loginIp: string
  registeredAt: string
  uid: string
  username: string
  userType: TradingAccountType
  vipLevel: string
}

export const tradingAccountQueryFields: QueryBarField[] = [
  {
    key: 'uidExternal',
    label: '用户 UID/外部用户 ID',
    placeholder: '用户 UID/外部用户 ID',
    type: 'keyword',
    width: 208,
  },
  { key: 'username', label: '用户名', placeholder: '用户名', type: 'keyword', width: 208 },
  { key: 'loginIp', label: 'IP', placeholder: 'IP', type: 'keyword', width: 208 },
  {
    defaultValue: 'all',
    key: 'userType',
    label: '用户类型',
    options: [
      { label: '全部类型', value: 'all' },
      { label: '实盘', value: 'live' },
      { label: '内盘', value: 'internal' },
    ],
    type: 'select',
    width: 148,
  },
  {
    defaultValue: null,
    key: 'registeredAt',
    label: '注册时间',
    placeholder: '开始日期 - 结束日期',
    type: 'date-range',
    width: 218,
  },
]

export const tradingAccountColumns: ProTableColumn<TradingAccountRow>[] = [
  { dataIndex: 'uid', hideable: false, key: 'uid', sortable: true, title: '用户 UID', width: 110 },
  { dataIndex: 'username', key: 'username', sortable: true, title: '用户名', width: 108 },
  { dataIndex: 'externalId', key: 'externalId', sortable: true, title: '外部用户 ID', width: 116 },
  { align: 'center', dataIndex: 'userType', key: 'userType', sortable: true, title: '用户类型', width: 82 },
  { align: 'center', dataIndex: 'vipLevel', key: 'vipLevel', sortable: true, title: 'VIP等级', width: 76 },
  { dataIndex: 'loginIp', hideable: false, key: 'loginIp', sortable: true, title: '登录IP', width: 186 },
  { dataIndex: 'registeredAt', key: 'registeredAt', sortable: true, title: '注册时间', width: 140 },
  { dataIndex: 'lastLoginAt', key: 'lastLoginAt', sortable: true, title: '最后登录时间', width: 146 },
]

export const tradingAccountRegions = [
  { flag: '🇭🇰', location: '中国香港 / 香港 / 中西区' },
  { flag: '🇯🇵', location: '日本 / 东京 / 东京' },
  { flag: '🇸🇬', location: '新加坡 / 新加坡 / 新加坡' },
  { flag: '🇺🇸', location: '美国 / 加利福尼亚州 / 洛杉矶' },
  { flag: '🇻🇳', location: '越南 / 胡志明市 / 第一区' },
  { flag: '🇰🇷', location: '韩国 / 首尔 / 江南区' },
  { flag: '🇬🇧', location: '英国 / 英格兰 / 伦敦' },
  { flag: '🇩🇪', location: '德国 / 黑森州 / 法兰克福' },
]

export const tradingAccountRows: TradingAccountRow[] = Array.from({ length: 68 }, (_, index) => {
  const sequence = index + 1
  const region = tradingAccountRegions[index % tradingAccountRegions.length]!
  const day = String(12 - (index % 7)).padStart(2, '0')
  const hour = String(9 + (index % 9)).padStart(2, '0')
  const timestamp = `2026-07-${day} ${hour}:28`
  const uid = String(936001273 + index * 137)
  return {
    agent_user_id: `EXT-${String(8100 + sequence)}`,
    created_at: timestamp,
    externalId: `EXT-${String(8100 + sequence)}`,
    flag: region.flag,
    id: uid,
    last_login_at: timestamp,
    last_login_ip: `103.24.${9 + sequence}.${30 + sequence}`,
    lastLoginAt: timestamp,
    location: region.location,
    loginIp: `103.24.${9 + sequence}.${30 + sequence}`,
    registeredAt: timestamp,
    uid,
    user_id: uid,
    username: `user_${String(sequence).padStart(4, '0')}`,
    userType: sequence % 2 === 0 ? 'internal' : 'live',
    user_type: sequence % 2 === 0 ? 2 : 1,
    vip_level: (sequence + 2) % 7 === 0 ? 1 : 0,
    vipLevel: (sequence + 2) % 7 === 0 ? 'V1' : 'V0',
  }
})

function comparable(value: unknown): number | string {
  const numeric = Number(value)
  if (value !== '' && Number.isFinite(numeric)) return numeric
  return String(value ?? '')
}

export function resolveTradingAccounts({
  filters,
  page,
  pageSize,
  sort,
}: Pick<MmProTableRequestParams, 'filters' | 'page' | 'pageSize' | 'sort'>): { rows: TradingAccountRow[], total: number } {
  const uidExternal = String(filters.uidExternal ?? '').trim().toLocaleLowerCase()
  const username = String(filters.username ?? '').trim().toLocaleLowerCase()
  const loginIp = String(filters.loginIp ?? '').trim().toLocaleLowerCase()
  const userType = String(filters.userType ?? 'all')
  const registeredAt = Array.isArray(filters.registeredAt) ? filters.registeredAt : null
  const startDate = String(registeredAt?.[0] ?? '')
  const endDate = String(registeredAt?.[1] ?? '')

  const filtered = tradingAccountRows.filter((row) => {
    const registeredDate = row.registeredAt.slice(0, 10)
    return (!uidExternal || `${row.uid} ${row.externalId}`.toLocaleLowerCase().includes(uidExternal))
      && (!username || row.username.toLocaleLowerCase().includes(username))
      && (!loginIp || row.loginIp.toLocaleLowerCase().includes(loginIp))
      && (userType === 'all' || row.userType === userType)
      && (!startDate || registeredDate >= startDate)
      && (!endDate || registeredDate <= endDate)
  })

  const ordered = [...filtered]
  if (sort.key && sort.order) {
    ordered.sort((left, right) => {
      const leftValue = comparable(left[sort.key])
      const rightValue = comparable(right[sort.key])
      const result = typeof leftValue === 'number' && typeof rightValue === 'number'
        ? leftValue - rightValue
        : String(leftValue).localeCompare(String(rightValue), 'zh-CN', { numeric: true })
      return sort.order === 'desc' ? -result : result
    })
  }

  const start = (page - 1) * pageSize
  return { rows: ordered.slice(start, start + pageSize), total: ordered.length }
}

export function resolveUserAccounts(query: UserListQuery): { rows: TradingAccountRow[], total: number } {
  const keyword = query.keyword.trim().toLocaleLowerCase()
  const userType = Number(query.user_type) || 0
  const vipLevel = Number(query.vip_level) || 0
  const startTime = query.create_time_start
  const endTime = query.create_time_end

  const filtered = tradingAccountRows.filter(row => (!keyword
    || `${row.uid} ${row.externalId} ${row.username}`.toLocaleLowerCase().includes(keyword))
    && (!userType || Number(row.user_type) === userType)
    && (!vipLevel || Number(row.vip_level) === vipLevel)
    && (!startTime || row.registeredAt >= startTime)
    && (!endTime || row.registeredAt <= endTime))

  const ordered = [...filtered].sort((left, right) => {
    const leftValue = comparable(left[query.order_by])
    const rightValue = comparable(right[query.order_by])
    const result = typeof leftValue === 'number' && typeof rightValue === 'number'
      ? leftValue - rightValue
      : String(leftValue).localeCompare(String(rightValue), 'zh-CN', { numeric: true })
    return query.order_dir === 'desc' ? -result : result
  })
  const start = (query.page_no - 1) * query.page_size

  return { rows: ordered.slice(start, start + query.page_size), total: ordered.length }
}
