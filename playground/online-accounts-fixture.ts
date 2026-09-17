import type {
  MmProTableRequestParams,
  ProTableColumn,
  QueryBarField,
  TableRow,
} from '../src'

export interface AccountRow extends TableRow {
  createdAt: string
  equity: number
  exposure: number
  id: string
  lastActive: string
  loginIp: string
  region: string
  status: 'offline' | 'online' | 'review'
  userType: 'internal' | 'live'
  username: string
}

export const onlineAccountQueryFields: QueryBarField[] = [
  { key: 'keyword', label: '关键词', placeholder: '账户 ID / 用户名 / IP', type: 'keyword', width: 210 },
  {
    defaultValue: 'all',
    key: 'status',
    label: '在线状态',
    options: [
      { label: '全部状态', value: 'all' },
      { label: '在线', value: 'online' },
      { label: '离线', value: 'offline' },
      { label: '待复核', value: 'review' },
    ],
    clearable: false,
    type: 'select',
    width: 138,
  },
  {
    defaultValue: 'all',
    key: 'userType',
    label: '用户类型',
    options: [
      { label: '全部用户', value: 'all' },
      { label: '实盘', value: 'live' },
      { label: '内盘', value: 'internal' },
    ],
    type: 'segmented',
    width: 220,
  },
  {
    defaultValue: 'all',
    key: 'region',
    label: '地区',
    options: [
      { label: '全部地区', value: 'all' },
      { label: '新加坡', value: 'SG' },
      { label: '东京', value: 'JP' },
      { label: '法兰克福', value: 'DE' },
    ],
    type: 'select',
    width: 138,
  },
]

export const onlineAccountColumns: ProTableColumn<AccountRow>[] = [
  { dataIndex: 'id', hideable: false, key: 'id', sortable: true, title: '账户 ID', width: 118 },
  { dataIndex: 'username', key: 'username', sortable: true, title: '用户名', width: 130 },
  { align: 'center', dataIndex: 'userType', key: 'userType', title: '用户类型', width: 92 },
  { align: 'center', dataIndex: 'status', key: 'status', title: '在线状态', width: 96 },
  { align: 'right', dataIndex: 'equity', key: 'equity', sortable: true, title: '账户权益(U)', width: 132 },
  { align: 'right', dataIndex: 'exposure', key: 'exposure', sortable: true, title: '风险敞口(U)', width: 128 },
  { dataIndex: 'region', key: 'region', title: '地区', width: 96 },
  { dataIndex: 'loginIp', key: 'loginIp', title: '登录 IP', width: 132 },
  { dataIndex: 'lastActive', key: 'lastActive', sortable: true, title: '最后活跃时间', width: 164 },
  { dataIndex: 'createdAt', defaultHidden: true, key: 'createdAt', sortable: true, title: '注册时间', width: 164 },
  { align: 'center', fixed: 'right', hideable: false, key: 'actions', title: '操作', width: 64 },
]

export const onlineAccountRegions = [
  { code: 'SG', label: '新加坡' },
  { code: 'JP', label: '东京' },
  { code: 'DE', label: '法兰克福' },
]

export const onlineAccountRows: AccountRow[] = Array.from({ length: 86 }, (_, index) => {
  const sequence = index + 1
  const region = onlineAccountRegions[index % onlineAccountRegions.length]!
  const day = String(17 - (index % 16)).padStart(2, '0')
  const hour = String(8 + (index % 10)).padStart(2, '0')
  const minute = String((index * 7) % 60).padStart(2, '0')
  return {
    createdAt: `2026-06-${String(1 + (index % 28)).padStart(2, '0')} ${hour}:${minute}:00`,
    equity: Number((8200 + sequence * 367.28).toFixed(2)),
    exposure: Number((sequence % 4 === 0 ? sequence * 84.2 : sequence * 19.64).toFixed(2)),
    id: `ACC-${String(8100 + sequence)}`,
    lastActive: `2026-07-${day} ${hour}:${minute}:18`,
    loginIp: `10.${18 + (index % 7)}.${32 + (index % 19)}.${80 + (index % 101)}`,
    region: region.code,
    status: sequence % 9 === 0 ? 'review' : sequence % 4 === 0 ? 'offline' : 'online',
    userType: sequence % 3 === 0 ? 'internal' : 'live',
    username: index === 0
      ? 'alice.ops'
      : index === 1
        ? 'operator_002_with_a_name_that_exceeds_the_column_width'
        : `operator_operator_operator_operator_operator_operator_${String(sequence).padStart(3, '0')}`,
  }
})

function comparable(value: unknown): number | string {
  const numeric = Number(value)
  if (value !== '' && Number.isFinite(numeric)) return numeric
  return String(value ?? '')
}

export function resolveOnlineAccounts({ filters, page, pageSize, sort }: Pick<MmProTableRequestParams, 'filters' | 'page' | 'pageSize' | 'sort'>): { rows: AccountRow[], total: number } {
  const keyword = String(filters.keyword ?? '').trim().toLocaleLowerCase()
  const status = String(filters.status ?? 'all')
  const userType = String(filters.userType ?? 'all')
  const region = String(filters.region ?? 'all')
  const filtered = onlineAccountRows.filter((row) => {
    const matchesKeyword = !keyword || `${row.id} ${row.username} ${row.loginIp}`.toLocaleLowerCase().includes(keyword)
    return matchesKeyword
      && (status === 'all' || row.status === status)
      && (userType === 'all' || row.userType === userType)
      && (region === 'all' || row.region === region)
  })
  const ordered = [...filtered]
  if (sort.order && sort.key) {
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
