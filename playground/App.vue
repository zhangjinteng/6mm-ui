<script setup lang="ts">
import { computed, onScopeDispose, ref, watch } from 'vue'

import type {
  CheckboxValue,
  DateRangeValue,
  DropdownItem,
  FormExpose,
  FormRules,
  IconName,
  QueryBarField,
  QueryBarFieldValue,
  QueryBarValue,
  SelectOption,
  SelectValue,
  StepItem,
  TableColumn,
  TableKey,
  TableSortState,
  UploadFile,
  UploadRequestOptions,
} from '../src'

import {
  MmAlert,
  MmAutocomplete,
  MmAvatar,
  MmBadge,
  MmBorder,
  MmButton,
  MmCalendar,
  MmCard,
  MmCheckbox,
  MmCheckboxGroup,
  MmCollapse,
  MmCollapseItem,
  MmColor,
  MmContainer,
  MmDatePicker,
  MmDatePickerPanel,
  MmDateRangePicker,
  MmDescriptions,
  MmDescriptionsItem,
  MmDivider,
  MmDialog,
  MmDrawer,
  MmDropdown,
  MmEmpty,
  MmForm,
  MmFormItem,
  MmIcon,
  MmImage,
  MmInput,
  MmInputNumber,
  MmLayout,
  MmLink,
  MmLoading,
  MmMenu,
  MmMenuItem,
  MmMessage,
  MmPageHeader,
  MmRadio,
  MmRadioGroup,
  MmScrollbar,
  MmSelect,
  MmSpace,
  MmText,
  MmTooltip,
  MmTypography,
  MmUpload,
  MmPopover,
  MmPagination,
  MmProgress,
  MmQueryBar,
  MmResult,
  MmSegmented,
  MmStatistic,
  MmSteps,
  MmSubMenu,
  MmTable,
  MmTabPane,
  MmTabs,
  MmTag,
  iconNames,
  message,
  messageBox,
  vMmLoading,
} from '../src'

import CatalogComponentPreview from './CatalogComponentPreview.vue'
import { componentCatalog, componentCategories, getComponentTechnicalDetails } from './component-catalog'
import type { ComponentCatalogItem, ComponentCategory } from './component-catalog'

const theme = ref<'dark' | 'light'>('light')
const activeColor = ref('#087765')
const executions = ref(0)
const activePeriod = ref('24h')
const openPanels = ref<Array<string | number>>(['risk'])
const calendarDate = ref('2026-07-16')
const calendarMonth = ref('2026-07')
const directPanelDate = ref('2026-07-16')
const directPanelMonth = ref('2026-07')
const auditPage = ref(1)
const auditPageSize = ref(3)
const auditSelection = ref<TableKey[]>([])
const auditExpanded = ref<TableKey[]>([])
const auditSort = ref<TableSortState>({ key: 'pnl', order: null })
const activeNavigation = ref<string | number>('overview')
const openNavigationGroups = ref<Array<string | number>>(['operations'])
const activeDetailTab = ref<string | number>('summary')
const releaseStep = ref(1)
const dropdownAction = ref<string | number>()
const navigationEvent = ref('READY')
const feedbackDialogOpen = ref(false)
const feedbackDrawerOpen = ref(false)
const iconPreviewOpen = ref(false)
const copiedIconName = ref<IconName>()
const technicalDrawerOpen = ref(false)
const feedbackLoading = ref(false)
const feedbackEvent = ref('READY')
const formRef = ref<FormExpose>()
const formState = ref<'ready' | 'success' | 'error'>('ready')
let copiedIconTimer: ReturnType<typeof setTimeout> | undefined
const formModel = ref({
  account: '',
  channels: ['api'] as CheckboxValue[],
  limit: 3 as number | null,
  mode: 'maker' as CheckboxValue,
})
const formRules: FormRules = {
  account: [
    { message: '请输入操作员账号', required: true },
    { message: '账号至少 4 个字符', min: 4 },
    {
      trigger: 'blur',
      validator: async (value) => {
        await Promise.resolve()
        return value === 'reserved' ? '该账号已被保留' : true
      },
    },
  ],
  channels: { message: '至少选择一个通知通道', required: true },
}

watch(theme, (value) => {
  document.documentElement.dataset.mmTheme = value
}, { immediate: true })
const advancedModel = ref({
  documents: [] as UploadFile[],
  market: '',
  settlement: '2026-07-16',
  strategies: ['grid'] as SelectValue[],
  window: ['2026-07-14', '2026-07-20'] as DateRangeValue,
})
const standaloneQueryBarFields: QueryBarField[] = [
  { key: 'keyword', label: '关键词', placeholder: '账号 / UID / 邮箱', type: 'keyword', width: 200 },
  {
    key: 'level',
    label: '用户等级',
    options: [{ label: '普通用户', value: 'normal' }, { label: 'VIP', value: 'vip' }, { label: '机构', value: 'institution' }],
    placeholder: '全部等级',
    type: 'select',
    width: 136,
  },
  { defaultValue: 'USDT', key: 'coin', label: '币种', options: ['USDT', 'BTC', 'ETH'], type: 'coin', width: 118 },
  { key: 'range', label: '注册时间', placeholder: '开始日期 - 结束日期', type: 'date-range', width: 218 },
  {
    defaultValue: 'all',
    key: 'status',
    label: '状态',
    options: [{ label: '全部', value: 'all' }, { label: '在线', value: 'online' }, { label: '冻结', value: 'frozen' }],
    type: 'segmented',
    width: 178,
  },
]
const standaloneQueryBarValue = ref<QueryBarValue>({ coin: 'USDT', keyword: '', level: '', range: null, status: 'all' })
const standaloneQueryBarSnapshot = ref<QueryBarValue>(cloneQueryBarValue(standaloneQueryBarValue.value))
const standaloneQueryBarEvent = ref<'QUERY' | 'READY' | 'RESET'>('READY')
const strategyOptions: SelectOption[] = [
  { label: '网格策略', value: 'grid' },
  { label: '趋势跟随', value: 'trend' },
  { label: '跨所对冲', value: 'hedge' },
  { disabled: true, label: '期权波动率（维护）', value: 'volatility' },
]
const navigationActions: DropdownItem[] = [
  { label: '复制策略链接', value: 'copy-link' },
  { label: '导出审计记录', value: 'export-audit' },
  { disabled: true, label: '归档策略（运行中）', value: 'archive' },
]
const releaseSteps: StepItem[] = [
  { description: '参数与密钥已冻结', title: '配置锁定' },
  { description: '等待 operator-12 确认', title: '风险复核' },
  { description: '进入灰度发布队列', title: '执行上线' },
]
const marketSuggestions = [
  { label: 'BTC / USDT · 永续', value: 'BTC-USDT-PERP' },
  { label: 'ETH / USDT · 永续', value: 'ETH-USDT-PERP' },
  { label: 'SOL / USDT · 现货', value: 'SOL-USDT' },
  { label: 'XRP / USDT · 现货', value: 'XRP-USDT' },
]

const chartPreview = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 380">
    <rect width="720" height="380" fill="#10171b"/>
    <g stroke="#27343a" stroke-width="1"><path d="M48 52H684M48 116H684M48 180H684M48 244H684M48 308H684"/><path d="M48 52V328M154 52V328M260 52V328M366 52V328M472 52V328M578 52V328M684 52V328"/></g>
    <path d="M48 286C110 270 132 292 188 242S276 214 324 226 408 158 458 174 536 108 584 124 640 72 684 86" fill="none" stroke="#0accaa" stroke-width="5" stroke-linecap="round"/>
    <path d="M48 286C110 270 132 292 188 242S276 214 324 226 408 158 458 174 536 108 584 124 640 72 684 86V328H48Z" fill="url(#g)" opacity=".42"/>
    <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#0accaa"/><stop offset="1" stop-color="#0accaa" stop-opacity="0"/></linearGradient></defs>
    <g fill="#98a7ad" font-family="monospace" font-size="13"><text x="48" y="34">EQUITY CURVE / 24H</text><text x="614" y="350">+4.82%</text></g>
  </svg>`)}`
const chartPreviewAlt = chartPreview.replace('%230accaa', '%2360a5fa')

const auditColumns: TableColumn[] = [
  { dataIndex: 'strategy', fixed: 'left', key: 'strategy', title: '策略', width: 170 },
  { dataIndex: 'market', key: 'market', title: '市场', width: 150 },
  { dataIndex: 'owner', key: 'owner', title: '负责人', width: 130 },
  { dataIndex: 'status', key: 'status', title: '状态', width: 110 },
  { align: 'right', dataIndex: 'pnl', key: 'pnl', sortable: true, title: '盈亏 USDT', width: 130 },
]
const initialAuditRows = [
  { id: 'grid-2048', market: 'BTC-USDT', name: '网格 #2048', owner: 'operator-07', pnl: 1284.18, status: 'running', strategy: '网格 #2048' },
  { id: 'trend-113', market: 'ETH-USDT', name: '趋势 #113', owner: 'operator-12', pnl: 462.7, status: 'running', strategy: '趋势 #113' },
  { id: 'hedge-82', market: 'SOL-USDT', name: '对冲 #82', owner: 'operator-03', pnl: -81.42, status: 'paused', strategy: '对冲 #82' },
  { id: 'grid-1991', market: 'XRP-USDT', name: '网格 #1991', owner: 'operator-07', pnl: 208.33, status: 'running', strategy: '网格 #1991' },
  { id: 'trend-109', market: 'BNB-USDT', name: '趋势 #109', owner: 'operator-12', pnl: 94.16, status: 'review', strategy: '趋势 #109' },
  { id: 'hedge-71', market: 'DOGE-USDT', name: '对冲 #71', owner: 'operator-03', pnl: 31.08, status: 'running', strategy: '对冲 #71' },
]
const generatedAuditRows = Array.from({ length: 24 }, (_, index) => {
  const sequence = index + 7
  const strategyType = ['网格', '趋势', '对冲'][sequence % 3]!
  const strategyNumber = 2100 - sequence
  const strategy = `${strategyType} #${strategyNumber}`
  const market = ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'XRP-USDT', 'BNB-USDT', 'DOGE-USDT'][sequence % 6]!
  const owner = `operator-${String((sequence % 12) + 1).padStart(2, '0')}`
  const pnl = Number(((sequence % 4 === 0 ? -1 : 1) * sequence * 37.41).toFixed(2))
  const status = sequence % 7 === 0 ? 'paused' : sequence % 5 === 0 ? 'review' : 'running'

  return { id: `audit-${sequence}`, market, name: strategy, owner, pnl, status, strategy }
})
const auditRows = [...initialAuditRows, ...generatedAuditRows]
const pagedAuditRows = computed(() => auditRows.slice((auditPage.value - 1) * auditPageSize.value, auditPage.value * auditPageSize.value))

async function fetchMarkets(query: string, signal: AbortSignal) {
  await Promise.resolve()
  if (signal.aborted) return []
  const normalized = query.toLowerCase()
  return marketSuggestions.filter((option) => option.label.toLowerCase().includes(normalized))
}

function uploadConfiguration({ file, onProgress, signal }: UploadRequestOptions): Promise<unknown> {
  onProgress(36)
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => resolve({ name: file.name, stored: true }), 90)
    signal.addEventListener('abort', () => {
      window.clearTimeout(timer)
      reject(new DOMException('已取消', 'AbortError'))
    }, { once: true })
  })
}

const colors = [
  ['Primary', '#087765'],
  ['Success', '#0b7651'],
  ['Warning', '#b45309'],
  ['Danger', '#c23838'],
  ['Ink', '#172033'],
] as const

const activity = [
  ['15:42:18', 'API 凭证已轮换', '成功'],
  ['15:36:02', '保证金阈值已更新', '成功'],
  ['15:28:41', 'BTC-USDT 回调重试', '等待'],
  ['15:17:09', '管理员会话已验证', '成功'],
  ['15:04:33', '结算报表已生成', '成功'],
]

type CatalogFilter = '全部' | ComponentCategory
const catalogFilters: CatalogFilter[] = ['全部', ...componentCategories]

const selectedCatalogItem = ref<ComponentCatalogItem>()
const pendingPreviewGroup = ref<string>()
const activeTechnicalDetails = computed(() => selectedCatalogItem.value
  ? getComponentTechnicalDetails(selectedCatalogItem.value)
  : null)

const activeCatalogFilter = ref<CatalogFilter>('全部')
const catalogQuery = ref('')
const visibleCatalogItems = computed(() => {
  const query = catalogQuery.value.trim().toLocaleLowerCase()
  return componentCatalog.filter((item) => {
    const matchesCategory = activeCatalogFilter.value === '全部' || item.category === activeCatalogFilter.value
    const matchesQuery = !query || `${item.name} ${item.category}`.toLocaleLowerCase().includes(query)
    return matchesCategory && matchesQuery
  })
})
const visibleCatalogSections = computed(() => componentCategories
  .map((category) => ({
    category,
    items: visibleCatalogItems.value.filter((item) => item.category === category),
  }))
  .filter((section) => section.items.length > 0))

function catalogCategoryCount(category: CatalogFilter): number {
  return category === '全部'
    ? componentCatalog.length
    : componentCatalog.filter((item) => item.category === category).length
}

function jumpToPreview(group: string): void {
  const target = document.getElementById(`preview-${group}`)
  if (!target) return
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' })
  target.focus({ preventScroll: true })
}

function openTechnicalDrawer(item: ComponentCatalogItem): void {
  pendingPreviewGroup.value = undefined
  selectedCatalogItem.value = item
  technicalDrawerOpen.value = true
}

function viewTechnicalPreview(): void {
  if (!selectedCatalogItem.value) return
  pendingPreviewGroup.value = selectedCatalogItem.value.name === 'Query Bar'
    ? 'query-bar'
    : selectedCatalogItem.value.group
  technicalDrawerOpen.value = false
}

function handleTechnicalDrawerClosed(): void {
  if (!pendingPreviewGroup.value) return
  const group = pendingPreviewGroup.value
  pendingPreviewGroup.value = undefined
  jumpToPreview(group)
}

function toggleTheme(): void {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}

function cloneQueryBarValue(value: QueryBarValue): QueryBarValue {
  return Object.fromEntries(Object.entries(value).map(([key, fieldValue]) => [
    key,
    Array.isArray(fieldValue) ? [fieldValue[0], fieldValue[1]] : fieldValue,
  ]))
}

function formatQueryBarValue(value: QueryBarFieldValue | undefined): string {
  if (Array.isArray(value)) return value.filter(Boolean).join(' → ') || 'ALL'
  if (value === null || value === '') return 'ALL'
  return String(value)
}

function handleStandaloneQuery(value: QueryBarValue): void {
  standaloneQueryBarSnapshot.value = cloneQueryBarValue(value)
  standaloneQueryBarEvent.value = 'QUERY'
  executions.value++
}

function handleStandaloneReset(value: QueryBarValue): void {
  standaloneQueryBarSnapshot.value = cloneQueryBarValue(value)
  standaloneQueryBarEvent.value = 'RESET'
}

async function submitForm(): Promise<void> {
  executions.value++
  formState.value = await formRef.value?.validate() ? 'success' : 'error'
}

function resetForm(): void {
  formRef.value?.resetFields()
  formState.value = 'ready'
}

function recordNavigation(event: string): void {
  navigationEvent.value = event
}

function sendFeedbackMessage(): void {
  message.success({ message: '策略配置已进入发布队列', duration: 2600 })
  feedbackEvent.value = 'MESSAGE_SENT'
}

function iconSnippet(name: IconName): string {
  return `<MmIcon name="${name}" />`
}

function copyWithSelection(value: string): boolean {
  if (typeof document === 'undefined' || !document.body) return false
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.readOnly = true
  textarea.style.position = 'fixed'
  textarea.style.inset = '-9999px auto auto -9999px'
  document.body.append(textarea)
  textarea.select()
  try {
    return document.execCommand('copy')
  } finally {
    textarea.remove()
  }
}

async function copyIconSnippet(name: IconName): Promise<void> {
  const snippet = iconSnippet(name)
  let copied = false

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(snippet)
      copied = true
    }
  } catch {
    copied = false
  }

  if (!copied) copied = copyWithSelection(snippet)
  if (!copied) {
    message.error('复制失败，请检查浏览器剪贴板权限')
    return
  }

  copiedIconName.value = name
  if (copiedIconTimer) clearTimeout(copiedIconTimer)
  copiedIconTimer = setTimeout(() => (copiedIconName.value = undefined), 1600)
  message.success({ duration: 1600, message: `已复制 ${snippet}` })
}

function requestFeedbackPrompt(): void {
  feedbackEvent.value = 'PROMPT_OPEN'
  void messageBox.prompt('请输入本次变更的审批备注。', '审批备注', {
    inputPlaceholder: '至少输入 4 个字符',
    inputValidator: (value) => value.trim().length >= 4 || '审批备注至少需要 4 个字符',
  }).then((result) => {
    feedbackEvent.value = `PROMPT_${result.value.toUpperCase()}`
    message.success('审批备注已记录')
  }).catch(() => {
    feedbackEvent.value = 'PROMPT_CANCELLED'
  })
}

onScopeDispose(() => {
  if (copiedIconTimer) clearTimeout(copiedIconTimer)
})
</script>

<template>
  <main class="playground mm-ui" :data-mm-theme="theme">
    <MmContainer class="playground__container" :gutter="24" size="xl">
      <header class="masthead">
        <div class="masthead__mark"><span>6</span><i /></div>
        <div class="masthead__copy">
          <MmText as="p" size="xs" tone="primary" weight="bold">VENDOR / 6MM-UI / FEEDBACK</MmText>
          <h1>组件标本台</h1>
          <MmText as="p" size="sm" tone="muted">Vue 3 primitives · 精密后台界面基线</MmText>
        </div>
        <MmSpace class="masthead__actions" :size="6" wrap>
          <a class="masthead__nav-link" href="/">HOME</a>
          <a class="masthead__nav-link" href="/sidebar-nav">SIDEBAR NAV</a>
          <a class="masthead__nav-link" href="/component-info">COMPONENT INFO</a>
          <a class="masthead__nav-link" href="/pro-table">PRO TABLE</a>
          <span class="build-state"><i /> BUILD PASS</span>
          <MmButton
            icon-only
            size="sm"
            variant="text"
            :aria-label="theme === 'light' ? '切换到暗色主题' : '切换到亮色主题'"
            @click="toggleTheme"
          >
            <template #icon><MmIcon :name="theme === 'light' ? 'moon' : 'sun'" :size="15" /></template>
          </MmButton>
        </MmSpace>
      </header>

      <section class="status-rail" aria-label="组件库状态">
        <div><span>COMPONENTS</span><strong>{{ componentCatalog.length }}</strong></div>
        <div><span>THEME</span><strong>{{ theme.toUpperCase() }}</strong></div>
        <div><span>ACCENT</span><strong :style="{ color: activeColor }">{{ activeColor }}</strong></div>
        <div><span>RUN COUNT</span><strong>{{ executions.toString().padStart(2, '0') }}</strong></div>
      </section>

      <section class="component-catalog" aria-label="组件预览目录">
        <header class="component-catalog__header">
          <div>
            <MmText as="p" size="xs" tone="primary" weight="bold">COMPONENT INDEX / {{ componentCatalog.length }} READY</MmText>
            <h2>完整组件目录</h2>
            <MmText as="p" size="sm" tone="muted">按分类筛选或搜索组件，点击名称查看实时预览、技术信息与可复制的调用示例。</MmText>
          </div>
          <div class="component-catalog__meter" aria-live="polite">
            <strong>{{ visibleCatalogItems.length.toString().padStart(2, '0') }}</strong>
            <span>/ {{ componentCatalog.length }} VISIBLE</span>
          </div>
        </header>

        <div class="component-catalog__controls">
          <MmInput
            v-model="catalogQuery"
            aria-label="搜索组件"
            clearable
            placeholder="搜索 Button、表单、反馈…"
          >
            <template #prefix><span class="component-catalog__search-mark" aria-hidden="true">⌕</span></template>
          </MmInput>
          <div class="component-catalog__filters" role="group" aria-label="组件分类筛选">
            <MmButton
              v-for="category in catalogFilters"
              :key="category"
              :aria-label="`筛选${category}组件，共 ${catalogCategoryCount(category)} 个`"
              :aria-pressed="activeCatalogFilter === category"
              class="component-catalog__filter"
              :class="{ 'is-active': activeCatalogFilter === category }"
              native-type="button"
              size="sm"
              @click="activeCatalogFilter = category"
            >
              <span>{{ category }}</span>
              <b>{{ catalogCategoryCount(category).toString().padStart(2, '0') }}</b>
            </MmButton>
          </div>
        </div>

        <div v-if="visibleCatalogSections.length" class="component-catalog__groups">
          <section v-for="section in visibleCatalogSections" :key="section.category" class="catalog-group">
            <header>
              <h3>{{ section.category }}</h3>
              <span>{{ section.items.length.toString().padStart(2, '0') }}</span>
            </header>
            <div class="catalog-group__items">
              <MmButton
                v-for="item in section.items"
                :key="item.name"
                :aria-expanded="technicalDrawerOpen && selectedCatalogItem?.name === item.name"
                :aria-label="`${item.name}：查看技术信息`"
                aria-haspopup="dialog"
                class="catalog-group__button"
                :data-component-name="item.name"
                native-type="button"
                size="sm"
                variant="text"
                @click="openTechnicalDrawer(item)"
              >
                <span>{{ item.name }}</span>
                <b>{{ item.group }}</b>
              </MmButton>
            </div>
          </section>
        </div>
        <div v-else class="component-catalog__empty" role="status">
          <b>NO COMPONENT MATCHED</b>
          <span>换个关键词，或切换到“全部”分类。</span>
        </div>
      </section>

      <div class="specimen-grid">
        <MmBorder id="preview-01" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>01</span><div><strong>Button / Icon / Link</strong><small>动作、状态和导航语义</small></div></header>
          <MmDivider :margin="14" />
          <MmLayout direction="column" :gap="16">
            <MmSpace :size="8" wrap>
              <MmButton variant="primary" @click="executions++"><template #icon><MmIcon name="check" /></template>执行任务</MmButton>
              <MmButton><template #icon><MmIcon name="copy" /></template>复制凭证</MmButton>
              <MmButton variant="success">确认入账</MmButton>
              <MmButton variant="warning">风险复核</MmButton>
              <MmButton variant="danger">撤销权限</MmButton>
              <MmButton plain variant="success">白底成功</MmButton>
              <MmButton plain variant="warning">白底警告</MmButton>
              <MmButton plain variant="danger">白底危险</MmButton>
              <MmButton disabled>不可操作</MmButton>
              <MmButton loading>处理中</MmButton>
            </MmSpace>
            <MmSpace :size="10" wrap>
              <MmButton icon-only size="sm" aria-label="返回"><template #icon><MmIcon name="arrow-left" /></template></MmButton>
              <MmButton size="sm" variant="text">小号文本按钮</MmButton>
              <MmButton round size="lg" variant="primary">大号圆角按钮</MmButton>
              <MmLink href="https://6mm.com" external>访问 6MM<template #suffix><MmIcon name="external-link" :size="13" /></template></MmLink>
            </MmSpace>
          </MmLayout>
        </MmBorder>

        <MmBorder id="preview-02" as="section" background="var(--mm-color-panel)" class="specimen" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>02</span><div><strong>Color</strong><small>语义色与自动对比</small></div></header>
          <MmDivider :margin="14" />
          <MmLayout direction="column" :gap="10">
            <MmColor
              v-for="([label, value]) in colors"
              :key="value"
              :label="label"
              selectable
              show-value
              :value="value"
              @select="activeColor = $event"
            />
          </MmLayout>
        </MmBorder>

        <MmBorder id="preview-03" as="section" background="var(--mm-color-panel)" class="specimen" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>03</span><div><strong>Text</strong><small>尺寸、权重和语义层级</small></div></header>
          <MmDivider :margin="14" />
          <MmLayout direction="column" :gap="9">
            <MmText size="xl" weight="bold">账户总览 ¥ 82,430.18</MmText>
            <MmText size="lg" weight="semibold">结算周期 2026-W29</MmText>
            <MmText tone="muted">当前保证金率保持在安全区间。</MmText>
            <MmText size="sm" tone="success" weight="semibold">● 系统运行正常</MmText>
            <MmText size="sm" tone="warning">注意：3 项回调等待处理</MmText>
            <MmText :line-clamp="2" size="xs" tone="subtle">这是一段用于检查多行截断行为的长文本，在空间不足时应保持信息密度并避免破坏布局。</MmText>
          </MmLayout>
        </MmBorder>

        <MmBorder id="preview-04" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>04</span><div><strong>Layout / Space / Scrollbar</strong><small>布局组合与密集数据滚动</small></div></header>
          <MmDivider label="最近活动" align="start" :margin="14" />
          <MmScrollbar always :height="196">
            <div class="activity-table">
              <div v-for="([time, action, state], index) in activity" :key="time" class="activity-row">
                <code>{{ time }}</code>
                <span><i :style="{ opacity: 1 - index * 0.12 }" />{{ action }}</span>
                <b :class="{ 'is-waiting': state === '等待' }">{{ state }}</b>
                <MmButton icon-only size="sm" variant="text" aria-label="查看"><template #icon><MmIcon name="chevron-right" :size="14" /></template></MmButton>
              </div>
            </div>
          </MmScrollbar>
        </MmBorder>

        <MmBorder id="preview-05" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>05</span><div><strong>Typography / Divider / Container</strong><small>可复制、可折叠的长文本结构</small></div></header>
          <MmDivider dashed :margin="14" />
          <MmTypography
            collapsible
            copyable
            :collapsed-lines="3"
            copy-text="API 请求必须携带 X-6MM-Signature，并使用 UTC 毫秒时间戳。"
            :level="2"
            title="接口签名说明"
          >
            API 请求必须携带 <code>X-6MM-Signature</code>，并使用 UTC 毫秒时间戳。签名原文按照 method、path、timestamp、body 的顺序连接；服务端会拒绝超过允许时间窗口的请求。生产环境应通过密钥管理服务注入凭证，不应把密钥写入前端代码或日志。
          </MmTypography>
        </MmBorder>

        <MmBorder id="preview-06" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>06</span><div><strong>Form / Input / Selection</strong><small>字段协议、异步校验和组合输入</small></div></header>
          <MmDivider label="权限策略草稿" align="start" :margin="14" />
          <div class="form-lab">
            <MmForm
              ref="formRef"
              :model="formModel"
              :rules="formRules"
              :scroll-to-error="true"
              :label-width="104"
              @submit.prevent="submitForm"
            >
              <MmFormItem label="操作员账号" prop="account">
                <MmInput v-model="formModel.account" clearable show-count :maxlength="18" placeholder="输入账号；reserved 可测试异步错误">
                  <template #prefix><span class="input-prefix">ID</span></template>
                </MmInput>
              </MmFormItem>
              <MmFormItem label="并发上限" prop="limit">
                <MmInputNumber v-model="formModel.limit" :min="1" :max="12" name="concurrency" />
              </MmFormItem>
              <MmFormItem label="通知通道" prop="channels">
                <MmCheckboxGroup v-model="formModel.channels" :min="1" :max="2" name="channels">
                  <MmCheckbox value="api">API</MmCheckbox>
                  <MmCheckbox value="email">邮件</MmCheckbox>
                  <MmCheckbox value="sms">短信</MmCheckbox>
                </MmCheckboxGroup>
              </MmFormItem>
              <MmFormItem label="费率模式" prop="mode">
                <MmRadioGroup v-model="formModel.mode" name="fee-mode">
                  <MmRadio button value="maker">Maker</MmRadio>
                  <MmRadio button value="taker">Taker</MmRadio>
                </MmRadioGroup>
              </MmFormItem>
              <MmFormItem>
                <MmSpace :size="8">
                  <MmButton native-type="submit" variant="primary">验证并保存</MmButton>
                  <MmButton @click="resetForm">重置字段</MmButton>
                </MmSpace>
              </MmFormItem>
            </MmForm>

            <aside class="form-console" aria-live="polite">
              <div class="form-console__head">
                <span>FORM STATE</span>
                <b :class="`is-${formState}`">{{ formState.toUpperCase() }}</b>
              </div>
              <dl>
                <div><dt>ACCOUNT</dt><dd>{{ formModel.account || '—' }}</dd></div>
                <div><dt>CONCURRENCY</dt><dd>{{ formModel.limit ?? '—' }}</dd></div>
                <div><dt>CHANNELS</dt><dd>{{ formModel.channels.join(' + ') }}</dd></div>
                <div><dt>FEE MODE</dt><dd>{{ String(formModel.mode).toUpperCase() }}</dd></div>
              </dl>
              <p>提交空表单检查错误聚焦；输入 <code>reserved</code> 后移焦可检查异步规则。</p>
            </aside>
          </div>
        </MmBorder>

        <MmBorder id="preview-07" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header specimen__header--actions">
            <span>07</span>
            <div><strong>Autocomplete / Select / Date / Upload</strong><small>异步建议、复合选择和文件生命周期</small></div>
            <MmPopover placement="bottom-end" :width="250">
              <MmButton size="sm" variant="text">交互协议</MmButton>
              <template #content>
                <div class="protocol-note"><b>ZERO BUSINESS IO</b><p>建议与上传请求全部由 props 注入；组件只管理取消、状态和键盘语义。</p></div>
              </template>
            </MmPopover>
          </header>
          <MmDivider label="策略投放参数" align="start" :margin="14" />
          <div class="advanced-lab">
            <MmForm class="advanced-form" :model="advancedModel" :label-width="94">
              <MmFormItem label="市场搜索" prop="market">
                <MmAutocomplete
                  v-model="advancedModel.market"
                  data-testid="market-autocomplete"
                  :debounce="0"
                  :fetch-suggestions="fetchMarkets"
                  placeholder="输入 BTC、ETH…"
                />
              </MmFormItem>
              <MmFormItem label="策略类型" prop="strategies">
                <MmSelect
                  v-model="advancedModel.strategies"
                  data-testid="strategy-select"
                  filterable
                  multiple
                  :max="3"
                  :options="strategyOptions"
                  placeholder="筛选策略"
                />
              </MmFormItem>
              <MmFormItem label="结算日期" prop="settlement">
                <MmDatePicker v-model="advancedModel.settlement" data-testid="settlement-date" />
              </MmFormItem>
              <MmFormItem label="回测窗口" prop="window">
                <MmDateRangePicker v-model="advancedModel.window" data-testid="backtest-range" :editable="false" />
              </MmFormItem>
            </MmForm>

            <div class="advanced-upload">
              <div class="advanced-upload__title"><span>CONFIG BUNDLE</span><b>{{ advancedModel.documents.length }}/2</b></div>
              <MmUpload
                v-model="advancedModel.documents"
                data-testid="advanced-upload"
                accept=".json,.csv"
                drag
                :limit="2"
                :max-size="1048576"
                :multiple="true"
                :request="uploadConfiguration"
              />
            </div>
          </div>
          <div class="advanced-state" aria-live="polite">
            <span>MARKET <b>{{ advancedModel.market || 'UNSET' }}</b></span>
            <span>STRATEGIES <b>{{ advancedModel.strategies.join(' + ') || 'UNSET' }}</b></span>
            <span>SETTLEMENT <b>{{ advancedModel.settlement || 'UNSET' }}</b></span>
            <span data-testid="window-state">WINDOW <b>{{ advancedModel.window.filter(Boolean).join(' → ') }}</b></span>
          </div>
          <section class="direct-date-panel" aria-labelledby="direct-date-panel-title">
            <div class="direct-date-panel__copy">
              <span>DIRECT COMPONENT</span>
              <h3 id="direct-date-panel-title">MmDatePickerPanel</h3>
              <p>不经过输入框或弹层包装，直接使用受控日期值与当前月份。</p>
              <dl aria-live="polite">
                <div><dt>SELECTED</dt><dd data-testid="direct-panel-value">{{ directPanelDate }}</dd></div>
                <div><dt>MONTH</dt><dd>{{ directPanelMonth }}</dd></div>
              </dl>
            </div>
            <MmDatePickerPanel
              v-model="directPanelDate"
              v-model:displayed-month="directPanelMonth"
              aria-label="独立日期选择面板"
              data-testid="direct-date-picker-panel"
              :first-day-of-week="1"
              min="2026-07-01"
              max="2026-08-31"
            />
          </section>
        </MmBorder>

        <MmBorder
          id="preview-query-bar"
          as="section"
          aria-labelledby="query-bar-section-title"
          background="var(--mm-color-panel)"
          class="specimen specimen--wide"
          data-testid="query-bar-section"
          padding="20px"
          radius="lg"
          tabindex="-1"
        >
          <header class="specimen__header">
            <span>Q7</span>
            <div>
              <strong id="query-bar-section-title">MmQueryBar</strong>
              <small>关键词、选择、币种、日期区间与状态筛选的统一查询入口</small>
            </div>
          </header>
          <MmDivider label="商户账户查询" align="start" :margin="14" />
          <div class="query-bar-lab">
            <MmQueryBar
              v-model="standaloneQueryBarValue"
              aria-label="商户账户查询示例"
              data-testid="standalone-query-bar"
              :fields="standaloneQueryBarFields"
              @query="handleStandaloneQuery"
              @reset="handleStandaloneReset"
            />
            <aside class="query-bar-console" aria-live="polite">
              <div class="query-bar-console__event">
                <span>LAST EVENT</span>
                <b data-testid="query-bar-event">{{ standaloneQueryBarEvent }}</b>
              </div>
              <dl data-testid="query-bar-snapshot">
                <div v-for="field in standaloneQueryBarFields" :key="field.key">
                  <dt>{{ field.label }}</dt>
                  <dd>{{ formatQueryBarValue(standaloneQueryBarSnapshot[field.key]) }}</dd>
                </div>
              </dl>
            </aside>
          </div>
        </MmBorder>

        <MmBorder id="preview-08" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>08</span><div><strong>Avatar / Badge / Card / Tag / Empty</strong><small>身份、状态与空内容的紧凑表达</small></div></header>
          <MmDivider label="运行身份" align="start" :margin="14" />
          <div class="identity-lab">
            <MmCard title="执行节点" subtitle="东京 · ap-northeast-1" hoverable shadow="hover">
              <div class="operator-row">
                <MmBadge dot type="success" aria-label="节点在线"><MmAvatar fallback="TK" size="lg" /></MmBadge>
                <div><strong>trade-kernel-07</strong><small>心跳延迟 18ms</small></div>
                <MmTag round type="success">HEALTHY</MmTag>
              </div>
              <template #footer>
                <MmSpace :size="6" wrap>
                  <MmTag effect="outline" size="sm" type="primary">PERP</MmTag>
                  <MmTag effect="outline" size="sm">READ / WRITE</MmTag>
                  <MmTag closable size="sm" type="warning">观察中</MmTag>
                </MmSpace>
              </template>
            </MmCard>
            <MmCard title="待处理告警" subtitle="最近 30 分钟">
              <MmEmpty description="当前没有未确认告警" :image-size="68"><MmButton size="sm" variant="text">查看历史</MmButton></MmEmpty>
            </MmCard>
          </div>
        </MmBorder>

        <MmBorder id="preview-09" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>09</span><div><strong>Statistic / Progress / Result</strong><small>量化指标、执行进度与结果反馈</small></div></header>
          <MmDivider label="结算观测" align="start" :margin="14" />
          <div class="metrics-lab">
            <div class="metric-stack">
              <MmSegmented v-model="activePeriod" aria-label="统计周期" block :options="[{ label: '24H', value: '24h' }, { label: '7D', value: '7d' }, { label: '30D', value: '30d' }]" />
              <div class="metric-grid">
                <MmStatistic title="账户净值" :value="82430.5" :precision="2" prefix="¥" trend="up" />
                <MmStatistic title="已实现盈亏" :value="1284.18" :precision="2" prefix="+" suffix=" USDT" trend="up" />
                <MmStatistic title="风险敞口" :value="18.7" :precision="1" suffix="%" trend="down" />
              </div>
              <div class="progress-stack">
                <label>策略部署 <MmProgress :percentage="76" /></label>
                <label>数据同步 <MmProgress :percentage="100" status="success" /></label>
              </div>
            </div>
            <MmResult class="compact-result" status="success" title="校验通过" subtitle="配置包可以安全发布">
              <template #extra><MmButton size="sm" variant="primary">进入发布队列</MmButton></template>
            </MmResult>
          </div>
        </MmBorder>

        <MmBorder id="preview-10" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>10</span><div><strong>Descriptions / Collapse / Segmented</strong><small>结构化详情与分层信息披露</small></div></header>
          <MmDivider label="策略审计摘要" align="start" :margin="14" />
          <div class="disclosure-lab">
            <MmDescriptions bordered :column="2" title="网格策略 #A-2048">
              <template #extra><MmTag type="success">运行中</MmTag></template>
              <MmDescriptionsItem label="交易市场">BTC-USDT-PERP</MmDescriptionsItem>
              <MmDescriptionsItem label="资金账户">alpha-main</MmDescriptionsItem>
              <MmDescriptionsItem label="价格区间">58,000 — 74,000</MmDescriptionsItem>
              <MmDescriptionsItem label="网格数量">48</MmDescriptionsItem>
              <MmDescriptionsItem label="最后变更" :span="2">2026-07-16 16:42 / operator-07</MmDescriptionsItem>
            </MmDescriptions>
            <MmCollapse v-model="openPanels">
              <MmCollapseItem name="risk" title="风险约束">最大回撤 8%，单次下单不超过可用余额的 3%。</MmCollapseItem>
              <MmCollapseItem name="notice" title="通知策略">成交、熔断与凭证异常通过 API 和邮件通知。</MmCollapseItem>
              <MmCollapseItem name="locked" title="系统托管项" disabled>此项由平台策略统一控制。</MmCollapseItem>
            </MmCollapse>
          </div>
        </MmBorder>

        <MmBorder id="preview-11" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>11</span><div><strong>Image / Calendar / Table / Pagination</strong><small>资源预览、日期视图与受控数据工作台</small></div></header>
          <MmDivider label="审计数据面板" align="start" :margin="14" />
          <div class="media-calendar-lab">
            <MmCard title="账户权益曲线" subtitle="点击图像打开键盘可关闭的预览">
              <MmImage
                data-testid="evidence-image"
                alt="账户权益曲线"
                fit="cover"
                :height="252"
                preview
                :preview-src-list="[chartPreview, chartPreviewAlt]"
                :src="chartPreview"
              />
            </MmCard>
            <MmCard title="执行日历" :subtitle="`当前选择 ${calendarDate}`">
              <MmCalendar
                v-model="calendarDate"
                v-model:displayed-month="calendarMonth"
                data-testid="audit-calendar"
                :disabled-date="(date: string) => date.endsWith('-19')"
              >
                <template #date="{ cell }"><span>{{ cell.day }}</span><i v-if="cell.value === '2026-07-16'" aria-hidden="true" /></template>
              </MmCalendar>
            </MmCard>
          </div>
          <div class="table-lab">
            <div class="table-lab__head"><span>STRATEGY AUDIT LOG</span><b>{{ auditSelection.length }} SELECTED</b></div>
            <MmTable
              v-model:selected-row-keys="auditSelection"
              v-model:expanded-row-keys="auditExpanded"
              v-model:sort="auditSort"
              data-testid="audit-table"
              bordered
              :columns="auditColumns"
              :data="pagedAuditRows"
              row-key="id"
              selectable
              striped
            >
              <template #cell-status="{ value }"><MmTag size="sm" :type="value === 'running' ? 'success' : value === 'paused' ? 'warning' : 'info'">{{ String(value).toUpperCase() }}</MmTag></template>
              <template #cell-pnl="{ value }"><span :class="Number(value) >= 0 ? 'pnl-up' : 'pnl-down'">{{ Number(value) >= 0 ? '+' : '' }}{{ Number(value).toFixed(2) }}</span></template>
              <template #expanded-row="{ row }"><div class="audit-detail"><b>{{ row.strategy }}</b><span>最近变更由 {{ row.owner }} 提交，风险检查与签名验证均已记录。</span></div></template>
            </MmTable>
            <MmPagination
              v-model:current-page="auditPage"
              v-model:page-size="auditPageSize"
              data-testid="audit-pagination"
              :page-sizes="[3, 6]"
              show-jumper
              show-size-changer
              :total="auditRows.length"
            />
          </div>
        </MmBorder>

        <MmBorder id="preview-12" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>12</span><div><strong>Page Header / Steps</strong><small>页面层级、返回路径与发布进度</small></div></header>
          <MmDivider label="策略发布上下文" align="start" :margin="14" />
          <div class="page-navigation-lab">
            <MmPageHeader
              data-testid="strategy-page-header"
              :breadcrumbs="[{ href: '#strategies', label: '策略中心' }, { label: '网格 #2048' }]"
              show-back
              subtitle="BTC-USDT-PERP · 主账户 · 东京节点"
              title="网格策略 #2048"
              @back="recordNavigation('BACK_TO_STRATEGIES')"
            >
              <template #extra>
                <MmDropdown
                  v-model="dropdownAction"
                  data-testid="strategy-actions"
                  :items="navigationActions"
                  placement="bottom-end"
                  @select="recordNavigation(`ACTION_${String($event.value).toUpperCase()}`)"
                >
                  <template #trigger="{ triggerAttrs }">
                    <MmButton v-bind="triggerAttrs" size="sm">策略操作<template #icon><MmIcon name="chevron-down" :size="13" /></template></MmButton>
                  </template>
                </MmDropdown>
              </template>
              <div class="navigation-state"><span>NAV EVENT</span><b>{{ navigationEvent }}</b><span>ACTION</span><b>{{ dropdownAction || 'UNSET' }}</b></div>
            </MmPageHeader>
            <MmSteps
              data-testid="release-steps"
              aria-label="策略发布进度"
              clickable
              :current="releaseStep"
              :items="releaseSteps"
              @change="releaseStep = $event"
            />
          </div>
        </MmBorder>

        <MmBorder id="preview-13" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>13</span><div><strong>Menu / Dropdown / Tabs</strong><small>键盘漫游、受控选择与延迟面板</small></div></header>
          <MmDivider label="控制台导航工作区" align="start" :margin="14" />
          <div class="navigation-workspace">
            <aside>
              <span class="navigation-kicker">WORKSPACE</span>
              <MmMenu
                v-model="activeNavigation"
                v-model:open-keys="openNavigationGroups"
                data-testid="console-menu"
                aria-label="控制台导航"
              >
                <MmMenuItem value="overview"><template #icon><MmIcon name="info" :size="14" /></template>运行概览</MmMenuItem>
                <MmMenuItem value="risk"><template #icon><MmIcon name="alert" :size="14" /></template>风险中心</MmMenuItem>
                <MmMenuItem value="billing" disabled>账单结算（维护）</MmMenuItem>
                <MmSubMenu value="operations" label="执行管理">
                  <MmMenuItem value="queue">发布队列</MmMenuItem>
                  <MmMenuItem value="history">执行历史</MmMenuItem>
                </MmSubMenu>
                <MmMenuItem value="audit">审计日志</MmMenuItem>
              </MmMenu>
              <div class="navigation-selection">SELECTED <b>{{ String(activeNavigation).toUpperCase() }}</b></div>
            </aside>
            <MmTabs v-model="activeDetailTab" data-testid="strategy-tabs" aria-label="策略视图" type="card">
              <MmTabPane name="summary" label="运行摘要">
                <div class="tab-console"><b>RUNNING / HEALTHY</b><p>策略已连续运行 19 小时，最近一次订单撮合延迟为 24ms。</p></div>
              </MmTabPane>
              <MmTabPane name="orders" label="订单流" lazy>
                <div class="tab-console" data-testid="lazy-orders-panel"><b>ORDER STREAM</b><p>最近 30 分钟共提交 128 笔订单，撤单率 4.6%。</p></div>
              </MmTabPane>
              <MmTabPane name="disabled" label="敏感配置" disabled>需要更高权限。</MmTabPane>
              <MmTabPane name="audit" label="变更审计">
                <div class="tab-console"><b>AUDIT TRAIL</b><p>operator-07 于 16:42 更新了价格区间与网格数量。</p></div>
              </MmTabPane>
            </MmTabs>
          </div>
        </MmBorder>

        <MmBorder id="preview-14" as="section" background="var(--mm-color-panel)" class="specimen specimen--wide" padding="20px" radius="lg" tabindex="-1">
          <header class="specimen__header"><span>14</span><div><strong>Alert / Loading / Overlay / Message</strong><small>实时状态、焦点管理与函数式反馈</small></div></header>
          <MmDivider label="反馈控制台" align="start" :margin="14" />
          <div class="feedback-lab">
            <div class="feedback-alerts">
              <MmAlert title="行情通道稳定" description="主备节点延迟均低于 30ms。" type="success" />
              <MmAlert closable title="凭证即将过期" description="operator-07 的签名密钥将在 15 分钟后失效。" type="warning" />
              <MmMessage :closable="false" :duration="0" message="函数式消息将显示在页面顶部，并自动维护队列。" />
            </div>
            <div
              v-mm-loading="{ visible: feedbackLoading, text: '正在同步审计记录' }"
              class="feedback-console"
              data-testid="feedback-loading-region"
            >
              <div class="feedback-console__state"><span>FEEDBACK EVENT</span><b>{{ feedbackEvent }}</b></div>
              <p>所有遮罩共享层级管理器、滚动锁引用计数和焦点回退合同。</p>
              <MmSpace :size="8" wrap>
                <MmTooltip content="支持 hover 与键盘 focus" :open-delay="0">
                  <template #default="{ triggerAttrs }"><MmButton v-bind="triggerAttrs" data-testid="feedback-tooltip" size="sm">提示说明</MmButton></template>
                </MmTooltip>
                <MmButton data-testid="feedback-message-trigger" size="sm" variant="success" @click="sendFeedbackMessage">发送成功消息</MmButton>
                <MmButton data-testid="feedback-loading-trigger" size="sm" @click="feedbackLoading = !feedbackLoading">切换加载层</MmButton>
                <MmButton data-testid="icon-preview-trigger" size="sm" variant="primary" @click="iconPreviewOpen = true">ICON 预览</MmButton>
                <MmButton data-testid="feedback-dialog-trigger" size="sm" @click="feedbackDialogOpen = true">打开 Dialog</MmButton>
                <MmButton data-testid="feedback-drawer-trigger" size="sm" @click="feedbackDrawerOpen = true">打开 Drawer</MmButton>
                <MmButton data-testid="feedback-prompt-trigger" size="sm" variant="warning" @click="requestFeedbackPrompt">输入审批备注</MmButton>
              </MmSpace>
            </div>
          </div>
        </MmBorder>
      </div>

      <MmDialog v-model="feedbackDialogOpen" title="策略发布确认">
        <p>配置锁定、风险复核与审计快照均已完成。确认后将进入灰度发布队列。</p>
        <template #footer>
          <MmButton @click="feedbackDialogOpen = false">取消</MmButton>
          <MmButton variant="primary" @click="feedbackDialogOpen = false; feedbackEvent = 'DIALOG_CONFIRMED'">确认发布</MmButton>
        </template>
      </MmDialog>

      <MmDialog
        v-model="iconPreviewOpen"
        data-testid="icon-preview-dialog"
        :width="'min(720px, calc(100vw - 32px))'"
        title="6MM UI 图标目录"
      >
        <div class="icon-preview-intro">
          <p>当前公开支持的命名图标。点击任意图标即可复制完整的 <code>&lt;MmIcon name=&quot;...&quot; /&gt;</code> 调用代码。</p>
          <b>{{ iconNames.length }} ICONS</b>
        </div>
        <div class="icon-preview-grid" role="list" aria-label="6MM UI 支持的图标">
          <article v-for="name in iconNames" :key="name" class="icon-preview-item" role="listitem" :data-icon-name="name">
            <button
              type="button"
              class="icon-preview-card"
              :class="{ 'is-copied': copiedIconName === name }"
              :aria-label="`复制 ${iconSnippet(name)}`"
              @click="copyIconSnippet(name)"
            >
              <span class="icon-preview-card__glyph"><MmIcon :name="name" :size="22" :spin="name === 'loading'" /></span>
              <span class="icon-preview-card__copy">
                <code>{{ name }}</code>
                <small aria-live="polite">{{ copiedIconName === name ? '已复制' : '点击复制' }}</small>
              </span>
            </button>
          </article>
        </div>
        <template #footer>
          <MmButton @click="iconPreviewOpen = false">关闭预览</MmButton>
        </template>
      </MmDialog>

      <MmDrawer
        v-model="technicalDrawerOpen"
        data-testid="technical-drawer"
        placement="right"
        :size="'min(520px, calc(100vw - 24px))'"
        title="组件技术信息"
        @closed="handleTechnicalDrawerClosed"
      >
        <article v-if="activeTechnicalDetails" class="technical-drawer">
          <header class="technical-drawer__hero">
            <div class="technical-drawer__index">{{ activeTechnicalDetails.group }}</div>
            <div>
              <span>{{ activeTechnicalDetails.category }} / READY</span>
              <h2>{{ activeTechnicalDetails.componentName }}</h2>
              <p>{{ activeTechnicalDetails.description }}</p>
            </div>
          </header>

          <dl class="technical-drawer__meta">
            <div><dt>组件名</dt><dd>{{ activeTechnicalDetails.name }}</dd></div>
            <div><dt>导出名</dt><dd><code>{{ activeTechnicalDetails.componentName }}</code></dd></div>
            <div><dt>所属分类</dt><dd>{{ activeTechnicalDetails.category }}</dd></div>
            <div><dt>预览编号</dt><dd>#{{ activeTechnicalDetails.group }}</dd></div>
            <div><dt>包名</dt><dd><code>@work-gpt/6mm-ui</code></dd></div>
          </dl>

          <CatalogComponentPreview
            :key="activeTechnicalDetails.name"
            :name="activeTechnicalDetails.name"
          />

          <MmTypography
            class="technical-drawer__example"
            :copy-text="activeTechnicalDetails.example"
            copyable
            density="compact"
            :level="3"
            title="调用示例（Vue 3）"
          >
            <pre data-testid="technical-example"><code>{{ activeTechnicalDetails.example }}</code></pre>
          </MmTypography>

          <aside class="technical-drawer__note">
            <MmIcon name="info" :size="15" />
            <p>示例采用按需导入。项目入口只需引入一次组件库样式，业务页面无需重复引入。</p>
          </aside>
        </article>
        <template #footer>
          <MmButton @click="technicalDrawerOpen = false">关闭</MmButton>
          <MmButton variant="primary" @click="viewTechnicalPreview">
            查看实际示例
            <template #icon><MmIcon name="arrow-right" :size="14" /></template>
          </MmButton>
        </template>
      </MmDrawer>

      <MmDrawer v-model="feedbackDrawerOpen" placement="right" :size="420" title="运行详情">
        <MmDescriptions :column="1" bordered>
          <MmDescriptionsItem label="执行节点">trade-kernel-07</MmDescriptionsItem>
          <MmDescriptionsItem label="最近延迟">24ms</MmDescriptionsItem>
          <MmDescriptionsItem label="审计状态">已签名</MmDescriptionsItem>
        </MmDescriptions>
        <template #footer><MmButton variant="primary" @click="feedbackDrawerOpen = false">知道了</MmButton></template>
      </MmDrawer>

      <footer class="page-footer">
        <MmText size="xs" tone="subtle">@6mm/ui · FEEDBACK · 2026.07</MmText>
        <MmSpace :size="10">
          <span>ASYNC SAFE</span><span>KEYBOARD READY</span><span>A11Y READY</span><span>ESM</span>
        </MmSpace>
      </footer>
    </MmContainer>
  </main>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }
:global(html),
:global(body),
:global(#app) { min-width: 320px; min-height: 100%; margin: 0; }
:global(body) { background: #0c1215; font-family: var(--mm-font-family); }

.playground {
  min-height: 100vh;
  padding: 32px 0 56px;
  color: var(--mm-color-text);
  background-color: var(--mm-color-bg);
  background-image: linear-gradient(var(--mm-color-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--mm-color-line) 1px, transparent 1px);
  background-size: 32px 32px;
  transition: color var(--mm-duration-normal), background-color var(--mm-duration-normal);
}

.playground__container { position: relative; }
.masthead { min-height: 92px; display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 18px; border: 1px solid var(--mm-color-line); border-bottom: 0; padding: 18px 20px; background: color-mix(in srgb, var(--mm-color-panel) 94%, transparent); }
.masthead__mark { width: 52px; height: 52px; position: relative; display: grid; place-items: center; overflow: hidden; border: 1px solid color-mix(in srgb, var(--mm-color-primary) 52%, var(--mm-color-line)); border-radius: var(--mm-radius-md); color: var(--mm-color-on-primary); background: var(--mm-color-primary); }
.masthead__mark span { z-index: 1; font-size: 26px; font-weight: 800; letter-spacing: -0.08em; }
.masthead__mark i { width: 32px; height: 1px; position: absolute; right: -9px; bottom: 10px; background: currentColor; transform: rotate(-45deg); }
.masthead__copy { min-width: 0; display: grid; gap: 4px; }
.masthead__copy h1 { margin: 0; font-size: clamp(22px, 3vw, 32px); line-height: 1; letter-spacing: -0.04em; }
.masthead__actions { justify-content: flex-end; }
.masthead__nav-link { height: 28px; display: inline-flex; align-items: center; justify-content: center; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-sm); padding: 0 9px; color: var(--mm-color-text-muted); background: var(--mm-color-panel); font: 700 var(--mm-font-size-xs)/1 var(--mm-font-family-mono); letter-spacing: .04em; text-decoration: none; transition: border-color var(--mm-duration-fast) var(--mm-ease-standard), color var(--mm-duration-fast) var(--mm-ease-standard), background var(--mm-duration-fast) var(--mm-ease-standard); }
.masthead__nav-link:hover { border-color: color-mix(in srgb, var(--mm-color-primary) 42%, var(--mm-color-line)); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); }
.masthead__nav-link:focus-visible { outline: 0; box-shadow: var(--mm-focus-ring); }
.build-state { height: 28px; display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-sm); padding: 0 9px; color: var(--mm-color-text-muted); background: var(--mm-color-soft); font: 700 var(--mm-font-size-xs)/1 var(--mm-font-family-mono); }
.build-state i { width: 6px; height: 6px; border-radius: 50%; background: var(--mm-color-success); box-shadow: 0 0 0 3px var(--mm-color-success-soft); }

.status-rail { display: grid; grid-template-columns: repeat(4, 1fr); border: 1px solid var(--mm-color-line); background: var(--mm-color-panel); }
.status-rail > div { min-width: 0; display: grid; gap: 4px; border-left: 1px solid var(--mm-color-line); padding: 12px 16px; }
.status-rail > div:first-child { border-left: 0; }
.status-rail span { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.status-rail strong { overflow: hidden; font: 700 var(--mm-font-size-sm)/1.2 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }

.component-catalog { position: relative; overflow: hidden; scroll-margin-top: 24px; border: 1px solid var(--mm-color-line); margin-top: 12px; padding: 20px; background: color-mix(in srgb, var(--mm-color-panel) 96%, var(--mm-color-primary)); box-shadow: var(--mm-shadow-sm); }
.component-catalog::before { width: 132px; height: 2px; position: absolute; top: 0; left: 20px; content: ''; background: var(--mm-color-primary); }
.component-catalog__header { display: grid; grid-template-columns: minmax(0, 1fr) auto; align-items: end; gap: 24px; }
.component-catalog__header > div:first-child { min-width: 0; display: grid; gap: 5px; }
.component-catalog__header :deep(.mm-text) { margin: 0; }
.component-catalog__header h2 { margin: 0; font-size: clamp(20px, 2vw, 27px); line-height: 1.1; letter-spacing: -.035em; }
.component-catalog__meter { display: grid; grid-template-columns: auto auto; align-items: baseline; gap: 6px; font-family: var(--mm-font-family-mono); }
.component-catalog__meter strong { color: var(--mm-color-primary); font-size: 28px; line-height: 1; }
.component-catalog__meter span { color: var(--mm-color-text-subtle); font-size: 9px; font-weight: 700; letter-spacing: .08em; }
.component-catalog__controls { display: grid; grid-template-columns: minmax(230px, .72fr) minmax(0, 1.7fr); align-items: center; gap: 14px; border-block: 1px solid var(--mm-color-line); margin-top: 18px; padding-block: 12px; }
.component-catalog__controls :deep(.mm-input) { width: 100%; }
.component-catalog__search-mark { display: inline-block; color: var(--mm-color-primary); font: 700 18px/1 var(--mm-font-family-mono); transform: translateY(-1px); }
.component-catalog__filters { display: flex; min-width: 0; justify-content: flex-end; gap: 6px; flex-wrap: wrap; }
.component-catalog__filter { min-height: 30px; height: 30px; border-color: var(--mm-color-line); padding: 0 9px; color: var(--mm-color-text-muted); background: var(--mm-color-panel); box-shadow: none; font-size: var(--mm-font-size-xs); }
.component-catalog__filter :deep(.mm-button__label) { display: inline-flex; align-items: center; gap: 7px; }
.component-catalog__filter:hover:not(:disabled) { border-color: var(--mm-color-line-strong); color: var(--mm-color-text); background: var(--mm-color-panel); }
.component-catalog__filter.is-active { border-color: color-mix(in srgb, var(--mm-color-primary) 48%, var(--mm-color-line)); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); }
.component-catalog__filters b { min-width: 18px; color: inherit; font: 700 9px/1 var(--mm-font-family-mono); text-align: right; }
.component-catalog__groups { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; margin-top: 12px; }
.catalog-group { min-width: 0; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); padding: 11px; background: var(--mm-color-panel); }
.catalog-group > header { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-bottom: 1px solid var(--mm-color-line); margin-bottom: 9px; padding: 0 2px 8px; }
.catalog-group h3 { margin: 0; font-size: var(--mm-font-size-xs); line-height: 1; letter-spacing: .02em; }
.catalog-group > header span { color: var(--mm-color-primary); font: 700 9px/1 var(--mm-font-family-mono); }
.catalog-group__items { display: flex; align-content: flex-start; gap: 5px; flex-wrap: wrap; }
.catalog-group__button { min-height: 30px; height: 30px; border-color: transparent; padding: 0 7px 0 9px; color: var(--mm-color-text); background: var(--mm-color-soft); font-size: var(--mm-font-size-xs); }
.catalog-group__button :deep(.mm-button__label) { display: inline-flex; align-items: center; gap: 8px; }
.catalog-group__button:hover:not(:disabled) { border-color: color-mix(in srgb, var(--mm-color-primary) 42%, var(--mm-color-line)); color: var(--mm-color-primary); background: var(--mm-color-soft); transform: translateY(-1px); }
.catalog-group__items b { min-width: 19px; border-left: 1px solid var(--mm-color-line); padding-left: 6px; color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); }
.component-catalog__empty { min-height: 126px; display: grid; place-content: center; gap: 7px; margin-top: 12px; color: var(--mm-color-text-muted); text-align: center; }
.component-catalog__empty b { color: var(--mm-color-primary); font: 700 var(--mm-font-size-xs)/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.component-catalog__empty span { font-size: var(--mm-font-size-xs); }

.technical-drawer { display: grid; gap: 18px; }
.technical-drawer__hero { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: start; gap: 14px; border-bottom: 1px solid var(--mm-color-line); padding-bottom: 18px; }
.technical-drawer__index { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--mm-color-primary) 45%, var(--mm-color-line)); border-radius: var(--mm-radius-sm); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); font: 800 11px/1 var(--mm-font-family-mono); }
.technical-drawer__hero > div:last-child { min-width: 0; display: grid; gap: 5px; }
.technical-drawer__hero span { color: var(--mm-color-primary); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.technical-drawer__hero h2 { margin: 0; color: var(--mm-color-text); font-size: clamp(22px, 4vw, 30px); line-height: 1.15; letter-spacing: -.035em; }
.technical-drawer__hero p { margin: 2px 0 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); line-height: 1.65; }
.technical-drawer__meta { display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); margin: 0; overflow: hidden; }
.technical-drawer__meta > div { min-width: 0; display: grid; gap: 5px; border-top: 1px solid var(--mm-color-line); border-left: 1px solid var(--mm-color-line); padding: 11px 12px; background: var(--mm-color-soft); }
.technical-drawer__meta > div:nth-child(-n + 2) { border-top: 0; }
.technical-drawer__meta > div:nth-child(odd) { border-left: 0; }
.technical-drawer__meta > div:last-child { grid-column: 1 / -1; }
.technical-drawer__meta dt { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .06em; }
.technical-drawer__meta dd { min-width: 0; overflow: hidden; margin: 0; color: var(--mm-color-text); font-size: var(--mm-font-size-xs); font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
.technical-drawer__meta code { color: var(--mm-color-primary); font-family: var(--mm-font-family-mono); }
.technical-drawer__example { gap: 9px; }
.technical-drawer__example :deep(.mm-typography__title) { font-size: var(--mm-font-size-sm); }
.technical-drawer__example :deep(.mm-typography__actions button) { border: 1px solid color-mix(in srgb, var(--mm-color-primary) 36%, var(--mm-color-line)); background: var(--mm-color-primary-soft); }
.technical-drawer__example pre { max-height: 360px; overflow: auto; border: 1px solid #25323a; border-radius: var(--mm-radius-md); margin: 0; padding: 15px; color: #d8e4e8; background: #10171b; font: 11px/1.7 var(--mm-font-family-mono); tab-size: 2; white-space: pre; }
.technical-drawer__example code { font: inherit; }
.technical-drawer__note { display: grid; grid-template-columns: auto minmax(0, 1fr); align-items: start; gap: 9px; border-left: 2px solid var(--mm-color-primary); padding: 10px 12px; color: var(--mm-color-text-muted); background: var(--mm-color-primary-soft); }
.technical-drawer__note :deep(.mm-icon) { margin-top: 2px; color: var(--mm-color-primary); }
.technical-drawer__note p { margin: 0; font-size: var(--mm-font-size-xs); line-height: 1.6; }

.specimen-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
.specimen { box-shadow: var(--mm-shadow-sm); }
.specimen[id] { scroll-margin-top: 16px; }
.specimen[id]:focus-visible { outline: 2px solid var(--mm-color-primary); outline-offset: 3px; }
.specimen--wide { grid-column: 1 / -1; }
.specimen__header { display: flex; align-items: center; gap: 10px; }
.specimen__header > span { width: 27px; height: 27px; display: grid; place-items: center; border-radius: var(--mm-radius-xs); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); font: 700 9px/1 var(--mm-font-family-mono); }
.specimen__header > div { display: grid; gap: 2px; }
.specimen__header strong { font-size: var(--mm-font-size-sm); }
.specimen__header small { color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); }
.specimen__header--actions { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; }

.activity-table { min-width: 620px; display: grid; }
.activity-row { min-height: 38px; display: grid; grid-template-columns: 88px minmax(0, 1fr) 64px 28px; align-items: center; gap: 12px; border-top: 1px solid var(--mm-color-line); padding: 4px 8px; }
.activity-row:first-child { border-top: 0; }
.activity-row code { color: var(--mm-color-text-subtle); font-size: var(--mm-font-size-xs); }
.activity-row > span { min-width: 0; display: flex; align-items: center; gap: 8px; font-size: var(--mm-font-size-sm); }
.activity-row > span i { width: 5px; height: 5px; flex: 0 0 auto; border-radius: 50%; background: var(--mm-color-primary); }
.activity-row > b { width: fit-content; border-radius: var(--mm-radius-round); padding: 3px 7px; color: var(--mm-color-success); background: var(--mm-color-success-soft); font-size: 9px; }
.activity-row > b.is-waiting { color: var(--mm-color-warning); background: var(--mm-color-warning-soft); }
.mm-typography code { border-radius: var(--mm-radius-xs); padding: 2px 5px; color: var(--mm-color-primary); background: var(--mm-color-primary-soft); font: var(--mm-font-size-xs)/1.4 var(--mm-font-family-mono); }

.form-lab { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(230px, .75fr); gap: 24px; align-items: start; }
.form-lab :deep(.mm-form-item:last-child) { margin-bottom: 0; }
.form-lab :deep(.mm-input-number) { max-width: 180px; }
.input-prefix { border-right: 1px solid var(--mm-color-line); padding-right: 8px; color: var(--mm-color-primary); font: 700 9px/1 var(--mm-font-family-mono); }
.form-console { min-height: 238px; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); padding: 14px; background: var(--mm-color-soft); }
.form-console__head { display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--mm-color-line); padding-bottom: 10px; }
.form-console__head > span { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.form-console__head b { border-radius: var(--mm-radius-round); padding: 4px 7px; color: var(--mm-color-text-muted); background: var(--mm-color-panel); font: 700 9px/1 var(--mm-font-family-mono); }
.form-console__head b.is-success { color: var(--mm-color-success); background: var(--mm-color-success-soft); }
.form-console__head b.is-error { color: var(--mm-color-danger); background: var(--mm-color-danger-soft); }
.form-console dl { display: grid; gap: 0; margin: 8px 0 12px; }
.form-console dl > div { min-width: 0; display: grid; grid-template-columns: 92px minmax(0, 1fr); gap: 8px; border-bottom: 1px solid var(--mm-color-line); padding: 8px 0; }
.form-console dt { color: var(--mm-color-text-subtle); font: 700 9px/1.4 var(--mm-font-family-mono); }
.form-console dd { overflow: hidden; margin: 0; color: var(--mm-color-text); font: 600 var(--mm-font-size-xs)/1.4 var(--mm-font-family-mono); text-align: right; text-overflow: ellipsis; white-space: nowrap; }
.form-console p { margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); line-height: 1.55; }
.form-console code { color: var(--mm-color-primary); font-family: var(--mm-font-family-mono); }

.advanced-lab { display: grid; grid-template-columns: minmax(0, 1.55fr) minmax(250px, .75fr); gap: 24px; align-items: start; }
.advanced-form { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); column-gap: 18px; }
.advanced-form :deep(.mm-form-item) { gap: 9px; }
.advanced-upload { min-width: 0; border-left: 1px solid var(--mm-color-line); padding-left: 24px; }
.advanced-upload__title { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.advanced-upload__title b { color: var(--mm-color-primary); }
.advanced-state { display: grid; grid-template-columns: 1.2fr 1.3fr 1fr 1.5fr; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-sm); margin-top: 4px; background: var(--mm-color-soft); }
.advanced-state span { min-width: 0; display: grid; gap: 4px; border-left: 1px solid var(--mm-color-line); padding: 9px 11px; color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); letter-spacing: .06em; }
.advanced-state span:first-child { border-left: 0; }
.advanced-state b { overflow: hidden; color: var(--mm-color-text); font-size: 10px; text-overflow: ellipsis; white-space: nowrap; }
.query-bar-lab { display: grid; gap: 12px; }
.query-bar-console { display: grid; grid-template-columns: 132px minmax(0, 1fr); overflow: hidden; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-sm); background: var(--mm-color-soft); }
.query-bar-console__event { display: grid; align-content: center; gap: 5px; border-right: 1px solid var(--mm-color-line); padding: 11px 13px; }
.query-bar-console__event span,
.query-bar-console dt { color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); letter-spacing: .07em; }
.query-bar-console__event b { color: var(--mm-color-primary); font: 800 11px/1 var(--mm-font-family-mono); }
.query-bar-console dl { min-width: 0; display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); margin: 0; }
.query-bar-console dl > div { min-width: 0; display: grid; align-content: center; gap: 5px; border-left: 1px solid var(--mm-color-line); padding: 11px 12px; }
.query-bar-console dl > div:first-child { border-left: 0; }
.query-bar-console dd { overflow: hidden; margin: 0; color: var(--mm-color-text); font: 700 10px/1.25 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.direct-date-panel { display: grid; grid-template-columns: minmax(0, 1fr) minmax(260px, 292px); align-items: start; gap: 24px; border-top: 1px solid var(--mm-color-line); margin-top: 16px; padding-top: 16px; }
.direct-date-panel__copy { min-width: 0; display: grid; align-content: start; gap: 8px; padding: 8px 0; }
.direct-date-panel__copy > span { color: var(--mm-color-primary); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.direct-date-panel__copy h3 { margin: 0; font-size: var(--mm-font-size-lg); line-height: 1.2; }
.direct-date-panel__copy p { max-width: 440px; margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); line-height: 1.6; }
.direct-date-panel__copy dl { display: grid; gap: 0; margin: 8px 0 0; }
.direct-date-panel__copy dl > div { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-bottom: 1px solid var(--mm-color-line); padding: 9px 0; }
.direct-date-panel__copy dt { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .06em; }
.direct-date-panel__copy dd { margin: 0; color: var(--mm-color-text); font: 700 var(--mm-font-size-xs)/1 var(--mm-font-family-mono); }
.direct-date-panel :deep(.mm-date-panel) { box-sizing: border-box; width: 100%; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); box-shadow: var(--mm-shadow-sm); }
.protocol-note { padding: 14px; }
.protocol-note b { color: var(--mm-color-primary); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.protocol-note p { margin: 8px 0 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); line-height: 1.55; }

.identity-lab, .metrics-lab, .disclosure-lab { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; align-items: start; }
.operator-row { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: center; gap: 12px; }
.operator-row > div { min-width: 0; display: grid; gap: 4px; }
.operator-row strong { overflow: hidden; font: 600 var(--mm-font-size-sm)/1.2 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.operator-row small { color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); }
.identity-lab :deep(.mm-empty) { padding-block: 12px; }
.metric-stack { display: grid; gap: 18px; }
.metric-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
.metric-grid :deep(.mm-statistic) { border-left: 2px solid var(--mm-color-line); padding-left: 12px; }
.progress-stack { display: grid; gap: 12px; }
.progress-stack label { display: grid; grid-template-columns: 72px minmax(0, 1fr); align-items: center; gap: 12px; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); }
.compact-result { min-height: 100%; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); background: var(--mm-color-soft); }
.disclosure-lab :deep(.mm-collapse) { align-self: stretch; }
.media-calendar-lab { display: grid; grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr); gap: 14px; align-items: stretch; }
.media-calendar-lab :deep(.mm-card) { min-width: 0; }
.media-calendar-lab :deep(.mm-card__body) { padding: 12px; }
.media-calendar-lab :deep(.mm-calendar) { border: 0; }
.media-calendar-lab :deep(.mm-date-panel__day) { position: relative; }
.media-calendar-lab :deep(.mm-date-panel__day i) { width: 4px; height: 4px; position: absolute; bottom: 4px; border-radius: 50%; background: currentColor; }
.table-lab { display: grid; gap: 12px; margin-top: 14px; }
.table-lab__head { display: flex; align-items: center; justify-content: space-between; color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.table-lab__head b { color: var(--mm-color-primary); }
.pnl-up { color: var(--mm-color-success); font-family: var(--mm-font-family-mono); }
.pnl-down { color: var(--mm-color-danger); font-family: var(--mm-font-family-mono); }
.audit-detail { display: flex; justify-content: space-between; gap: 16px; }
.audit-detail span { color: var(--mm-color-text-muted); }
.page-navigation-lab { display: grid; gap: 22px; }
.navigation-state { display: grid; grid-template-columns: auto minmax(120px, 1fr) auto minmax(90px, auto); align-items: center; gap: 8px 12px; }
.navigation-state span { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .07em; }
.navigation-state b { color: var(--mm-color-primary); font: 700 var(--mm-font-size-xs)/1.2 var(--mm-font-family-mono); }
.navigation-workspace { display: grid; grid-template-columns: 224px minmax(0, 1fr); gap: 18px; align-items: stretch; }
.navigation-workspace > aside { display: flex; min-width: 0; flex-direction: column; gap: 9px; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); padding: 10px; background: var(--mm-color-soft); }
.navigation-workspace :deep(.mm-menu) { width: 100%; background: transparent; border: 0; }
.navigation-kicker { padding: 3px 8px; color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .09em; }
.navigation-selection { display: flex; align-items: center; justify-content: space-between; gap: 8px; border-top: 1px solid var(--mm-color-line); padding: 10px 8px 2px; color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); letter-spacing: .07em; }
.navigation-selection b { overflow: hidden; color: var(--mm-color-primary); font-size: 9px; text-overflow: ellipsis; }
.navigation-workspace :deep(.mm-tabs) { min-width: 0; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); padding: 14px; background: color-mix(in srgb, var(--mm-color-panel) 94%, var(--mm-color-soft)); }
.tab-console { min-height: 118px; display: grid; align-content: center; gap: 10px; border: 1px dashed var(--mm-color-line-strong); border-radius: var(--mm-radius-md); padding: 18px; background: var(--mm-color-soft); }
.tab-console b { color: var(--mm-color-primary); font: 700 var(--mm-font-size-xs)/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.tab-console p { max-width: 620px; margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-sm); line-height: 1.65; }
.feedback-lab { display: grid; grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr); gap: 16px; align-items: stretch; }
.feedback-alerts { display: grid; gap: 9px; }
.feedback-alerts :deep(.mm-message) { box-shadow: none; }
.feedback-console { position: relative; display: grid; min-height: 176px; align-content: center; gap: 14px; overflow: hidden; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-md); padding: 16px; background: var(--mm-color-soft); }
.feedback-console__state { display: flex; min-width: 0; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--mm-color-line); padding-bottom: 10px; }
.feedback-console__state span { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.feedback-console__state b { overflow: hidden; color: var(--mm-color-primary); font: 700 var(--mm-font-size-xs)/1.2 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.feedback-console > p { margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); line-height: 1.55; }
.icon-preview-intro { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; border-bottom: 1px solid var(--mm-color-line); padding-bottom: 14px; }
.icon-preview-intro p { max-width: 520px; margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); line-height: 1.6; }
.icon-preview-intro code { color: var(--mm-color-primary); font-family: var(--mm-font-family-mono); }
.icon-preview-intro b { flex: none; border: 1px solid color-mix(in srgb, var(--mm-color-primary) 45%, var(--mm-color-line)); border-radius: var(--mm-radius-round); padding: 5px 8px; color: var(--mm-color-primary); background: var(--mm-color-primary-soft); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .07em; }
.icon-preview-grid { max-height: min(56vh, 500px); display: grid; grid-template-columns: repeat(auto-fit, minmax(132px, 1fr)); gap: 8px; overflow: auto; margin-top: 14px; padding: 2px; }
.icon-preview-item { min-width: 0; }
.icon-preview-card { width: 100%; min-width: 0; display: grid; grid-template-columns: 36px minmax(0, 1fr); align-items: center; gap: 10px; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-sm); padding: 9px; color: inherit; background: var(--mm-color-soft); cursor: copy; text-align: left; transition: border-color var(--mm-duration-fast) var(--mm-ease-standard), background var(--mm-duration-fast) var(--mm-ease-standard), transform var(--mm-duration-fast) var(--mm-ease-standard); }
.icon-preview-card:hover { border-color: color-mix(in srgb, var(--mm-color-primary) 48%, var(--mm-color-line)); transform: translateY(-1px); }
.icon-preview-card:focus-visible { outline: 2px solid var(--mm-color-primary); outline-offset: 2px; }
.icon-preview-card.is-copied { border-color: var(--mm-color-success); background: color-mix(in srgb, var(--mm-color-success) 9%, var(--mm-color-soft)); }
.icon-preview-card__glyph { width: 36px; height: 36px; display: grid; place-items: center; border: 1px solid var(--mm-color-line); border-radius: var(--mm-radius-xs); color: var(--mm-color-primary); background: var(--mm-color-panel); }
.icon-preview-card__copy { min-width: 0; display: grid; gap: 4px; }
.icon-preview-card code { overflow: hidden; color: var(--mm-color-text); font: 700 10px/1.25 var(--mm-font-family-mono); text-overflow: ellipsis; white-space: nowrap; }
.icon-preview-card small { color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); letter-spacing: .04em; }
.icon-preview-card.is-copied small { color: var(--mm-color-success); }

.page-footer { display: flex; align-items: center; justify-content: space-between; gap: 16px; border: 1px solid var(--mm-color-line); margin-top: 12px; padding: 12px 16px; background: var(--mm-color-panel); }
.page-footer :deep(.mm-space) { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .06em; }

@media (max-width: 980px) {
  .component-catalog__controls { grid-template-columns: 1fr; }
  .component-catalog__filters { justify-content: flex-start; }
  .component-catalog__groups { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}

@media (max-width: 760px) {
  .playground { padding-top: 16px; }
  .masthead { grid-template-columns: auto minmax(0, 1fr); }
  .masthead__actions { grid-column: 1 / -1; justify-self: stretch; justify-content: flex-start; }
  .status-rail { grid-template-columns: 1fr 1fr; }
  .status-rail > div:nth-child(3) { border-top: 1px solid var(--mm-color-line); border-left: 0; }
  .status-rail > div:nth-child(4) { border-top: 1px solid var(--mm-color-line); }
  .component-catalog { padding: 18px 14px 14px; }
  .component-catalog::before { left: 14px; }
  .component-catalog__header { grid-template-columns: 1fr; gap: 12px; }
  .component-catalog__meter { justify-self: start; }
  .component-catalog__groups { grid-template-columns: 1fr; }
  .component-catalog__filter { flex: 1 0 auto; }
  .component-catalog__filter :deep(.mm-button__label) { width: 100%; justify-content: space-between; }
  .technical-drawer__meta { grid-template-columns: 1fr; }
  .technical-drawer__meta > div,
  .technical-drawer__meta > div:nth-child(-n + 2) { border-top: 1px solid var(--mm-color-line); border-left: 0; }
  .technical-drawer__meta > div:first-child { border-top: 0; }
  .technical-drawer__meta > div:last-child { grid-column: auto; }
  .specimen-grid { grid-template-columns: 1fr; }
  .specimen--wide { grid-column: auto; }
  .form-lab { grid-template-columns: 1fr; }
  .advanced-lab,
  .advanced-form,
  .direct-date-panel { grid-template-columns: 1fr; }
  .advanced-upload { border-top: 1px solid var(--mm-color-line); border-left: 0; padding-top: 18px; padding-left: 0; }
  .query-bar-console { grid-template-columns: 1fr; }
  .query-bar-console__event { display: flex; align-items: center; justify-content: space-between; border-right: 0; border-bottom: 1px solid var(--mm-color-line); }
  .query-bar-console dl { grid-template-columns: repeat(auto-fit, minmax(132px, 1fr)); }
  .query-bar-console dl > div { border-top: 1px solid var(--mm-color-line); }
  .direct-date-panel :deep(.mm-date-panel) { max-width: 292px; justify-self: start; }
  .advanced-state { grid-template-columns: 1fr 1fr; }
  .advanced-state span:nth-child(3) { border-top: 1px solid var(--mm-color-line); border-left: 0; }
  .advanced-state span:nth-child(4) { border-top: 1px solid var(--mm-color-line); }
  .identity-lab, .metrics-lab, .disclosure-lab { grid-template-columns: 1fr; }
  .media-calendar-lab { grid-template-columns: 1fr; }
  .navigation-workspace { grid-template-columns: 1fr; }
  .feedback-lab { grid-template-columns: 1fr; }
  .icon-preview-intro { align-items: flex-start; flex-direction: column; gap: 10px; }
  .icon-preview-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .navigation-state { grid-template-columns: auto minmax(0, 1fr); }
  .metric-grid { grid-template-columns: 1fr; }
  .audit-detail { flex-direction: column; gap: 4px; }
  .page-footer { align-items: flex-start; flex-direction: column; }
}
</style>
