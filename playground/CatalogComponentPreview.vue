<script setup lang="ts">
import { ref, watch } from "vue";

import type {
  CheckboxValue,
  DatePickerValue,
  DateRangeValue,
  IconName,
  QueryBarField,
  QueryBarValue,
  RadioValue,
  SelectValue,
} from "../src";
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
  MmCollapse,
  MmCollapseItem,
  MmColor,
  MmContainer,
  MmCursorPagination,
  MmDatePicker,
  MmDatePickerPanel,
  MmDateRangePicker,
  MmDescriptions,
  MmDescriptionsItem,
  MmDialog,
  MmDivider,
  MmDrawer,
  MmDropdown,
  MmEmpty,
  MmFilterDrawer,
  MmForm,
  MmFormItem,
  MmIcon,
  MmImage,
  MmInfoGrid,
  MmInfoGridItem,
  MmInput,
  MmInputNumber,
  MmLayout,
  MmLink,
  MmLoading,
  MmMenu,
  MmMenuItem,
  MmMessage,
  MmMessageBox,
  MmPageHeader,
  MmPagination,
  MmPopover,
  MmProgress,
  MmProTable,
  MmProTableCursorPagination,
  MmProTablePagination,
  MmQueryBar,
  MmRadio,
  MmRadioGroup,
  MmResult,
  MmScrollbar,
  MmSegmented,
  MmSelect,
  MmSpace,
  MmStatistic,
  MmSteps,
  MmTable,
  MmTabPane,
  MmTabs,
  MmTag,
  MmText,
  MmTooltip,
  MmTypography,
  MmUpload,
} from "../src";

import AppHeaderPreview from "./AppHeaderPreview.vue";
import AgentSidebarPreview from "./AgentSidebarPreview.vue";

const props = withDefaults(
  defineProps<{ expanded?: boolean; name: string }>(),
  {
    expanded: false,
  },
);

const checkboxValue = ref<CheckboxValue>(true);
const radioValue = ref<RadioValue>("maker");
const inputValue = ref("网格策略 #2048");
const numberValue = ref(3);
const selectValue = ref<SelectValue>("running");
const dateValue = ref<DatePickerValue>("2026-07-16");
const panelDate = ref<DatePickerValue>("2026-07-16");
const panelMonth = ref("2026-07");
const rangeValue = ref<DateRangeValue | null>(["2026-07-01", "2026-07-16"]);
const queryBarValue = ref<QueryBarValue>({
  coin: "USDT",
  keyword: "",
  level: "",
  range: null,
  status: "all",
});
const filterDrawerValue = ref<QueryBarValue>({
  account: "EXT-8101",
  ip: "",
  lastActive: null,
  region: "",
  userType: "all",
  username: "",
});
const filterDrawerOpen = ref(false);
const calendarValue = ref<DatePickerValue>("2026-07-16");
const calendarMonth = ref("2026-07");
const collapseValue = ref<Array<string | number>>(["risk"]);
const segmentedValue = ref<string | number>("24h");
const menuValue = ref<string | number>("overview");
const tabValue = ref<string | number>("summary");
const pageValue = ref(2);
const cursorPageValue = ref(2);
const proTablePageValue = ref(1);
const proTableCursorPageValue = ref(2);
const proTablePaginationPageValue = ref(1);
const dialogOpen = ref(false);
const drawerOpen = ref(false);
const messageBoxOpen = ref(false);
const formModel = ref({ name: "网格策略 #2048" });

const selectOptions = [
  { label: "运行中", value: "running" },
  { label: "等待复核", value: "review" },
];
const queryBarFields: QueryBarField[] = [
  {
    key: "keyword",
    label: "关键词",
    placeholder: "账号 / UID",
    type: "keyword",
    width: 180,
  },
  {
    key: "level",
    label: "等级",
    options: [
      { label: "普通用户", value: "normal" },
      { label: "VIP", value: "vip" },
    ],
    type: "select",
    width: 130,
  },
  {
    key: "coin",
    label: "币种",
    options: ["USDT", "BTC", "ETH"],
    type: "coin",
    width: 110,
  },
  { key: "range", label: "日期范围", type: "date-range", width: 200 },
  {
    defaultValue: "all",
    key: "status",
    label: "状态",
    options: [
      { label: "全部", value: "all" },
      { label: "在线", value: "online" },
    ],
    type: "segmented",
    width: 150,
  },
];
const filterDrawerFields: QueryBarField[] = [
  {
    key: "account",
    label: "账户",
    placeholder: "用户 UID / 外部用户 ID",
    type: "keyword",
  },
  { key: "username", label: "用户名", placeholder: "用户名", type: "keyword" },
  { key: "ip", label: "登录 IP", placeholder: "IP 地址", type: "keyword" },
  {
    defaultValue: "all",
    key: "userType",
    label: "用户类型",
    options: [
      { label: "全部", value: "all" },
      { label: "实盘", value: "live" },
      { label: "内盘", value: "internal" },
    ],
    type: "segmented",
  },
  {
    key: "region",
    label: "登录地区",
    options: [
      { label: "中国香港", value: "hk" },
      { label: "日本东京", value: "tokyo" },
      { label: "新加坡", value: "sg" },
    ],
    type: "select",
  },
  { key: "lastActive", label: "最后活跃时间", type: "date-range" },
];
const dropdownItems = [
  { label: "编辑配置", value: "edit" },
  { label: "查看审计", value: "audit" },
];
const stepItems = [
  { description: "参数已冻结", title: "配置锁定" },
  { description: "等待确认", title: "风险复核" },
  { description: "灰度队列", title: "执行上线" },
];
const tableColumns = [
  { dataIndex: "name", key: "name", title: "策略" },
  { dataIndex: "status", key: "status", title: "状态", width: 90 },
];
const tableRows = [
  { id: 1, name: "网格 #2048", status: "RUNNING" },
  { id: 2, name: "趋势 #113", status: "REVIEW" },
];
const proTableColumns = [
  { dataIndex: "name", key: "name", title: "策略", hideable: false },
  { dataIndex: "market", key: "market", title: "市场" },
  { dataIndex: "status", key: "status", title: "状态", width: 96 },
];
const proTableRows = [
  { id: 1, market: "BTC-USDT", name: "网格 #2048", status: "RUNNING" },
  { id: 2, market: "ETH-USDT", name: "趋势 #113", status: "REVIEW" },
  { id: 3, market: "SOL-USDT", name: "套利 #071", status: "PAUSED" },
];
const chartPreview = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 180">
    <rect width="480" height="180" fill="#10171b"/>
    <g stroke="#27343a"><path d="M24 36H456M24 90H456M24 144H456"/><path d="M24 24V156M132 24V156M240 24V156M348 24V156M456 24V156"/></g>
    <path d="M24 132C82 126 94 142 150 104S238 98 278 88 346 42 456 50" fill="none" stroke="#0accaa" stroke-width="4" stroke-linecap="round"/>
  </svg>`)}`;
const compactIconNames: IconName[] = ["check", "alert", "calendar"];
const expandedIconNames: IconName[] = [
  "check",
  "alert",
  "calendar",
  "search",
  "settings",
  "user",
];
const previewSizes = [
  { label: "SM", value: "sm" },
  { label: "MD", value: "md" },
  { label: "LG", value: "lg" },
] as const;

watch(
  () => props.name,
  () => {
    dialogOpen.value = false;
    drawerOpen.value = false;
    filterDrawerOpen.value = false;
    messageBoxOpen.value = false;
  },
);
</script>

<template>
  <section
    class="catalog-live-preview"
    :data-preview-component="name"
    :data-preview-mode="expanded ? 'expanded' : 'compact'"
    data-testid="live-component-preview"
    :aria-label="`${name} 实时组件预览`"
  >
    <header class="catalog-live-preview__header">
      <span><i /> LIVE COMPONENT</span>
      <b>{{ name }}</b>
    </header>

    <div
      class="catalog-live-preview__canvas"
      :class="`is-${name.toLowerCase().replaceAll(' ', '-')}`"
    >
      <div
        v-if="name === 'Button'"
        class="preview-size-stack"
        data-size-preview="Button"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmButton :size="size.value" variant="primary">保存配置</MmButton>
          </div>
        </div>
      </div>

      <MmBorder
        v-else-if="name === 'Border'"
        class="preview-surface"
        padding="16px"
        radius="md"
        >带边框的内容区域</MmBorder
      >

      <div
        v-else-if="name === 'Color'"
        class="preview-size-stack"
        data-size-preview="Color"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmColor
              label="Primary"
              selectable
              show-value
              :size="size.value"
              value="#087765"
            />
          </div>
        </div>
      </div>

      <MmContainer
        v-else-if="name === 'Container'"
        class="preview-container"
        :gutter="16"
        size="sm"
        >容器内的页面内容</MmContainer
      >

      <div v-else-if="name === 'Icon'" class="preview-icon-row">
        <span
          v-for="iconName in expanded ? expandedIconNames : compactIconNames"
          :key="iconName"
        >
          <MmIcon :name="iconName" :size="20" />{{ iconName }}
        </span>
      </div>

      <MmLayout
        v-else-if="name === 'Layout'"
        class="preview-blocks"
        direction="row"
        :gap="10"
      >
        <span>MAIN</span><span>ASIDE</span>
      </MmLayout>

      <div v-else-if="name === 'Link' && expanded" class="preview-variant-flow">
        <MmLink href="#component-link" tone="primary">Primary</MmLink>
        <MmLink href="#component-link">Default</MmLink>
        <MmLink href="#component-link" tone="muted">Muted</MmLink>
        <MmLink href="#component-link" tone="danger">Danger</MmLink>
      </div>

      <MmLink v-else-if="name === 'Link'" external href="https://6mm.com"
        >访问 6MM</MmLink
      >

      <div
        v-else-if="name === 'Text'"
        class="preview-size-stack"
        data-size-preview="Text"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmText :size="size.value" tone="primary" weight="medium"
              >账户总览 ¥82,430.18</MmText
            >
          </div>
        </div>
      </div>

      <MmScrollbar
        v-else-if="name === 'Scrollbar'"
        always
        class="preview-scrollbar"
        :height="118"
      >
        <p v-for="index in 6" :key="index">
          AUDIT {{ index.toString().padStart(2, "0") }} · 策略配置已同步
        </p>
      </MmScrollbar>

      <MmSpace v-else-if="name === 'Space'" :size="8" wrap>
        <MmTag>ALPHA</MmTag><MmTag type="success">RUNNING</MmTag
        ><MmTag type="warning">REVIEW</MmTag>
      </MmSpace>

      <MmTypography
        v-else-if="name === 'Typography'"
        copyable
        density="compact"
        title="接口签名说明"
        >API 请求必须携带签名，并使用 UTC 毫秒时间戳。</MmTypography
      >

      <div
        v-else-if="name === 'Autocomplete'"
        class="preview-size-stack"
        data-size-preview="Autocomplete"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmAutocomplete
              model-value="BTC-USDT"
              :size="size.value"
              :suggestions="['BTC-USDT', 'ETH-USDT', 'SOL-USDT']"
            />
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Checkbox'"
        class="preview-size-stack"
        data-size-preview="Checkbox"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmCheckbox v-model="checkboxValue" :size="size.value"
              >API 通知</MmCheckbox
            >
          </div>
        </div>
      </div>

      <MmDatePickerPanel
        v-else-if="name === 'Date Picker Panel'"
        v-model="panelDate"
        v-model:displayed-month="panelMonth"
        compact
        :first-day-of-week="1"
      />

      <div
        v-else-if="name === 'Date Picker'"
        class="preview-size-stack"
        data-size-preview="Date Picker"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmDatePicker
              v-model="dateValue"
              :size="size.value"
              trigger-variant="filter"
            />
          </div>
        </div>
      </div>

      <MmDateRangePicker
        v-else-if="name === 'Date Range Picker'"
        v-model="rangeValue"
      />

      <MmQueryBar
        v-else-if="name === 'Query Bar'"
        v-model="queryBarValue"
        :fields="queryBarFields"
      />

      <div v-else-if="name === 'Filter Drawer'" class="preview-filter-toolbar">
        <span><small>ONLINE ACCOUNTS</small><strong>高级筛选</strong></span>
        <MmFilterDrawer
          v-model="filterDrawerValue"
          v-model:open="filterDrawerOpen"
          :fields="filterDrawerFields"
          subtitle="在线账户"
        />
      </div>

      <MmForm
        v-else-if="name === 'Form'"
        class="preview-form"
        :label-width="78"
        :model="formModel"
      >
        <MmFormItem label="策略名称"
          ><MmInput v-model="formModel.name"
        /></MmFormItem>
        <MmFormItem
          ><MmButton size="sm" variant="primary">提交表单</MmButton></MmFormItem
        >
      </MmForm>

      <div
        v-else-if="name === 'Input'"
        class="preview-size-stack"
        data-size-preview="Input"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmInput v-model="inputValue" clearable :size="size.value" />
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Input Number'"
        class="preview-size-stack"
        data-size-preview="Input Number"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmInputNumber
              v-model="numberValue"
              :max="12"
              :min="1"
              :size="size.value"
            />
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Radio'"
        class="preview-size-stack"
        data-size-preview="Radio"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmRadio button model-value="maker" :size="size.value" value="maker"
              >Maker</MmRadio
            >
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Select'"
        class="preview-size-stack"
        data-size-preview="Select"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmSelect
              v-model="selectValue"
              :options="selectOptions"
              :size="size.value"
            />
          </div>
        </div>
      </div>

      <MmUpload
        v-else-if="name === 'Upload'"
        accept=".json,.csv"
        :auto-upload="false"
        drag
        :limit="2"
      />

      <div v-else-if="name === 'Avatar'" class="preview-variant-flow is-avatar">
        <MmAvatar fallback="LG" size="lg" />
        <MmAvatar fallback="MD" size="md" />
        <MmAvatar fallback="SM" size="sm" />
        <MmAvatar fallback="SQ" shape="square" size="lg" />
      </div>

      <div
        v-else-if="name === 'Badge' && expanded"
        class="preview-variant-flow is-badge"
      >
        <MmBadge :value="8" type="primary"><MmAvatar fallback="PR" /></MmBadge>
        <MmBadge dot type="success" aria-label="在线"
          ><MmAvatar fallback="OK"
        /></MmBadge>
        <MmBadge :value="32" type="info"><MmAvatar fallback="IN" /></MmBadge>
        <MmBadge :value="6" type="warning"><MmAvatar fallback="WA" /></MmBadge>
        <MmBadge :max="99" :value="128" type="danger"
          ><MmAvatar fallback="ER"
        /></MmBadge>
      </div>

      <MmBadge
        v-else-if="name === 'Badge'"
        dot
        type="success"
        aria-label="节点在线"
        ><MmAvatar fallback="TK" size="lg"
      /></MmBadge>

      <MmCalendar
        v-else-if="name === 'Calendar'"
        v-model="calendarValue"
        v-model:displayed-month="calendarMonth"
        :first-day-of-week="1"
      />

      <MmCard
        v-else-if="name === 'Card'"
        class="preview-card"
        hoverable
        shadow="hover"
        subtitle="最近更新 1 分钟前"
        title="策略状态"
      >
        <strong>RUNNING / HEALTHY</strong>
      </MmCard>

      <MmCollapse
        v-else-if="name === 'Collapse'"
        v-model="collapseValue"
        class="preview-wide"
      >
        <MmCollapseItem name="risk" title="风险约束"
          >最大回撤 8%，单笔订单不超过可用余额的 3%。</MmCollapseItem
        >
        <MmCollapseItem name="notice" title="通知策略"
          >成交与熔断事件通过 API 通知。</MmCollapseItem
        >
      </MmCollapse>

      <MmDescriptions
        v-else-if="name === 'Descriptions'"
        class="preview-wide"
        :column="1"
        bordered
        title="策略摘要"
      >
        <MmDescriptionsItem label="市场">BTC-USDT-PERP</MmDescriptionsItem>
        <MmDescriptionsItem label="状态">运行中</MmDescriptionsItem>
      </MmDescriptions>

      <MmInfoGrid
        v-else-if="name === 'Info Grid'"
        class="preview-wide"
        :columns="2"
        size="md"
      >
        <MmInfoGridItem label="用户 UID">5804991015</MmInfoGridItem>
        <MmInfoGridItem label="用户类型">实盘</MmInfoGridItem>
        <MmInfoGridItem label="仓位编号" :span="2">101184211</MmInfoGridItem>
      </MmInfoGrid>

      <MmEmpty
        v-else-if="name === 'Empty'"
        description="暂无运行记录"
        :image-size="64"
      />

      <MmImage
        v-else-if="name === 'Image'"
        alt="账户权益曲线"
        :height="142"
        preview
        :src="chartPreview"
        width="100%"
      />

      <div
        v-else-if="name === 'Pagination'"
        class="preview-size-stack"
        data-size-preview="Pagination"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmPagination
              v-model:current-page="pageValue"
              :page-size="10"
              :size="size.value"
              :total="30"
            />
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Cursor Pagination'"
        class="preview-size-stack"
        data-size-preview="Cursor Pagination"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmCursorPagination
              :current-page="cursorPageValue"
              has-more
              :size="size.value"
              @next="cursorPageValue += 1"
              @prev="cursorPageValue = Math.max(1, cursorPageValue - 1)"
            />
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Progress' && expanded"
        class="preview-variant-stack is-progress"
      >
        <div class="preview-variant-line">
          <small>NORMAL</small><MmProgress :percentage="42" />
        </div>
        <div class="preview-variant-line">
          <small>SUCCESS</small><MmProgress :percentage="76" status="success" />
        </div>
        <div class="preview-variant-line">
          <small>WARNING</small><MmProgress :percentage="63" status="warning" />
        </div>
        <div class="preview-variant-line">
          <small>ERROR</small><MmProgress :percentage="28" status="error" />
        </div>
      </div>

      <MmProgress
        v-else-if="name === 'Progress'"
        class="preview-wide"
        :percentage="76"
        status="success"
      />

      <MmProTable
        v-else-if="name === 'Pro Table'"
        v-model:current-page="proTablePageValue"
        class="preview-wide preview-pro-table"
        :columns="proTableColumns"
        :data="proTableRows"
        :page-size="3"
        :page-sizes="[3, 6, 9]"
        row-key="id"
        :total="12"
        striped
      />

      <MmProTablePagination
        v-else-if="name === 'Pro Table Pagination'"
        v-model:current-page="proTablePaginationPageValue"
        class="preview-wide"
        :page-size="15"
        :page-sizes="[15, 30]"
      />

      <MmProTableCursorPagination
        v-else-if="name === 'Pro Table Cursor Pagination'"
        class="preview-wide"
        :current-page="proTableCursorPageValue"
        has-more
        :page-size="15"
        :row-count="7"
        @next="proTableCursorPageValue += 1"
        @prev="
          proTableCursorPageValue = Math.max(1, proTableCursorPageValue - 1)
        "
      />

      <MmResult
        v-else-if="name === 'Result'"
        status="success"
        subtitle="配置可以安全发布"
        title="校验通过"
      />

      <MmTable
        v-else-if="name === 'Table'"
        class="preview-wide"
        bordered
        :columns="tableColumns"
        :data="tableRows"
        row-key="id"
        striped
      />

      <div
        v-else-if="name === 'Tag'"
        class="preview-size-stack"
        data-size-preview="Tag"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmTag :size="size.value" type="success">RUNNING</MmTag>
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Statistic' && expanded"
        class="preview-statistic-grid"
      >
        <MmStatistic
          :precision="2"
          prefix="¥"
          title="账户净值"
          trend="up"
          :value="82430.5"
        />
        <MmStatistic
          :precision="2"
          suffix="%"
          title="最大回撤"
          trend="down"
          :value="8.24"
        />
        <MmStatistic title="活动策略" trend="neutral" :value="12" />
      </div>

      <MmStatistic
        v-else-if="name === 'Statistic'"
        :precision="2"
        prefix="¥"
        title="账户净值"
        trend="up"
        :value="82430.5"
      />

      <div
        v-else-if="name === 'Segmented'"
        class="preview-size-stack"
        data-size-preview="Segmented"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <MmSegmented
              v-model="segmentedValue"
              :options="['24h', '7d', '30d']"
              :size="size.value"
            />
          </div>
        </div>
      </div>

      <MmDropdown v-else-if="name === 'Dropdown'" :items="dropdownItems">
        <template #trigger="{ triggerAttrs }"
          ><MmButton v-bind="triggerAttrs">策略操作</MmButton></template
        >
      </MmDropdown>

      <MmMenu
        v-else-if="name === 'Menu'"
        v-model="menuValue"
        class="preview-wide"
        mode="horizontal"
        aria-label="预览菜单"
      >
        <MmMenuItem value="overview">运行概览</MmMenuItem>
        <MmMenuItem value="risk">风险中心</MmMenuItem>
        <MmMenuItem value="audit">审计日志</MmMenuItem>
      </MmMenu>

      <AppHeaderPreview
        v-else-if="name === 'App Header'"
        :expanded="expanded"
      />

      <AgentSidebarPreview
        v-else-if="name === 'Sidebar Nav'"
        :expanded="expanded"
      />

      <MmPageHeader
        v-else-if="name === 'Page Header'"
        class="preview-wide"
        show-back
        subtitle="BTC-USDT-PERP"
        title="网格策略 #2048"
      />

      <MmSteps
        v-else-if="name === 'Steps'"
        class="preview-wide"
        :current="1"
        :items="stepItems"
      />

      <MmTabs
        v-else-if="name === 'Tabs'"
        v-model="tabValue"
        class="preview-wide"
        aria-label="预览标签页"
        type="card"
      >
        <MmTabPane name="summary" label="运行摘要"
          >策略运行正常，最近延迟 24ms。</MmTabPane
        >
        <MmTabPane name="orders" label="订单流"
          >最近提交 128 笔订单。</MmTabPane
        >
      </MmTabs>

      <div
        v-else-if="name === 'Alert' && expanded"
        class="preview-variant-stack"
      >
        <MmAlert
          description="常规状态说明。"
          show-icon
          title="信息提示"
          type="info"
        />
        <MmAlert
          description="主备节点延迟均低于 30ms。"
          show-icon
          title="运行正常"
          type="success"
        />
        <MmAlert
          description="保证金使用率接近阈值。"
          show-icon
          title="需要关注"
          type="warning"
        />
        <MmAlert
          description="行情连接已经中断。"
          show-icon
          title="连接异常"
          type="error"
        />
      </div>

      <MmAlert
        v-else-if="name === 'Alert'"
        class="preview-wide"
        description="主备节点延迟均低于 30ms。"
        title="行情通道稳定"
        type="success"
      />

      <MmButton
        v-else-if="name === 'Dialog'"
        data-testid="dialog-preview-trigger"
        @click="dialogOpen = true"
        >打开 Dialog 预览</MmButton
      >

      <MmButton
        v-else-if="name === 'Drawer'"
        data-testid="drawer-preview-trigger"
        @click="drawerOpen = true"
        >打开 Drawer 预览</MmButton
      >

      <div
        v-else-if="name === 'Loading'"
        class="preview-size-stack"
        data-size-preview="Loading"
      >
        <div
          v-for="size in previewSizes"
          :key="size.value"
          class="preview-size-line"
          :data-preview-size="size.value"
        >
          <span
            ><b>{{ size.label }}</b
            ><small>{{ size.value }}</small></span
          >
          <div class="preview-size-demo">
            <div class="preview-loading-host is-inline">
              <span>策略数据区域</span
              ><MmLoading :size="size.value" text="正在同步" />
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="name === 'Message' && expanded"
        class="preview-variant-stack is-message"
      >
        <MmMessage
          :closable="false"
          :duration="0"
          message="普通信息提示"
          type="info"
        />
        <MmMessage
          :closable="false"
          :duration="0"
          message="配置保存成功"
          type="success"
        />
        <MmMessage
          :closable="false"
          :duration="0"
          message="保证金接近阈值"
          type="warning"
        />
        <MmMessage
          :closable="false"
          :duration="0"
          message="请求执行失败"
          type="error"
        />
      </div>

      <MmMessage
        v-else-if="name === 'Message'"
        :duration="0"
        message="配置保存成功"
        type="success"
      />

      <MmButton
        v-else-if="name === 'Message Box'"
        data-testid="message-box-preview-trigger"
        @click="messageBoxOpen = true"
        >打开 Message Box 预览</MmButton
      >

      <MmPopover
        v-else-if="name === 'Popover'"
        floating-class="catalog-preview-popover"
        :offset="10"
        placement="bottom"
        :width="252"
      >
        <MmButton>查看 Popover</MmButton>
        <template #content>
          <div class="preview-popover-panel">
            <header>
              <span class="preview-popover-panel__icon" aria-hidden="true"
                ><MmIcon name="info" :size="14"
              /></span>
              <div>
                <small>COMPONENT BOUNDARY</small>
                <strong>ZERO BUSINESS IO</strong>
              </div>
            </header>
            <p>组件只负责交互与状态管理，业务请求由外部注入。</p>
            <footer>
              <span><i /> UI STATE ONLY</span><code>POPOVER / 07</code>
            </footer>
          </div>
        </template>
      </MmPopover>

      <MmTooltip
        v-else-if="name === 'Tooltip'"
        content="查看策略详情"
        :open-delay="0"
      >
        <template #default="{ triggerAttrs }"
          ><MmButton v-bind="triggerAttrs">悬停或聚焦</MmButton></template
        >
      </MmTooltip>

      <MmDivider
        v-else-if="name === 'Divider'"
        class="preview-wide"
        align="start"
        label="策略参数"
      />
    </div>

    <MmDialog v-model="dialogOpen" title="Dialog 组件预览">
      <p>这是从技术抽屉中打开的真实 Dialog 组件。</p>
      <template #footer
        ><MmButton variant="primary" @click="dialogOpen = false"
          >确认</MmButton
        ></template
      >
    </MmDialog>

    <MmDrawer
      v-model="drawerOpen"
      placement="right"
      :size="360"
      title="Drawer 组件预览"
    >
      <p>这是从技术抽屉中打开的真实 Drawer 组件。</p>
      <template #footer
        ><MmButton variant="primary" @click="drawerOpen = false"
          >完成</MmButton
        ></template
      >
    </MmDrawer>

    <MmMessageBox
      v-model="messageBoxOpen"
      message="确认执行当前策略配置？"
      title="Message Box 组件预览"
      type="confirm"
    />
  </section>
</template>

<style scoped>
.catalog-live-preview {
  min-width: 0;
  display: grid;
  overflow: hidden;
  border: 1px solid var(--mm-color-line);
  border-radius: var(--mm-radius-md);
  background: var(--mm-color-panel);
}
.catalog-live-preview__header {
  min-height: 38px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-bottom: 1px solid var(--mm-color-line);
  padding: 0 12px;
  background: var(--mm-color-soft);
}
.catalog-live-preview__header span {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: var(--mm-color-primary);
  font: 700 9px/1 var(--mm-font-family-mono);
  letter-spacing: 0.08em;
}
.catalog-live-preview__header i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--mm-color-success);
  box-shadow: 0 0 0 3px var(--mm-color-success-soft);
}
.catalog-live-preview__header b {
  color: var(--mm-color-text-subtle);
  font: 700 9px/1 var(--mm-font-family-mono);
  letter-spacing: 0.05em;
}
.catalog-live-preview__canvas {
  min-height: 154px;
  position: relative;
  display: grid;
  min-width: 0;
  align-items: center;
  justify-items: center;
  overflow: visible;
  padding: 18px;
  background-color: var(--mm-color-panel);
  background-image:
    linear-gradient(var(--mm-color-line) 1px, transparent 1px),
    linear-gradient(90deg, var(--mm-color-line) 1px, transparent 1px);
  background-size: 20px 20px;
}
.catalog-live-preview__canvas.is-date-picker-panel,
.catalog-live-preview__canvas.is-calendar {
  padding: 12px;
}
.catalog-live-preview__canvas.is-popover {
  min-height: 230px;
  align-items: start;
  padding-top: 46px;
}
.catalog-live-preview__canvas.is-form,
.catalog-live-preview__canvas.is-query-bar,
.catalog-live-preview__canvas.is-filter-drawer,
.catalog-live-preview__canvas.is-collapse,
.catalog-live-preview__canvas.is-descriptions,
.catalog-live-preview__canvas.is-image,
.catalog-live-preview__canvas.is-table,
.catalog-live-preview__canvas.is-pro-table,
.catalog-live-preview__canvas.is-pro-table-cursor-pagination,
.catalog-live-preview__canvas.is-pro-table-pagination,
.catalog-live-preview__canvas.is-menu,
.catalog-live-preview__canvas.is-app-header,
.catalog-live-preview__canvas.is-sidebar-nav,
.catalog-live-preview__canvas.is-page-header,
.catalog-live-preview__canvas.is-steps,
.catalog-live-preview__canvas.is-tabs,
.catalog-live-preview__canvas.is-alert,
.catalog-live-preview__canvas.is-divider {
  justify-items: stretch;
}
.preview-wide {
  width: 100%;
}
.preview-variant-flow {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.preview-variant-flow.is-avatar {
  gap: 16px;
}
.preview-variant-flow.is-badge {
  gap: 22px;
  padding: 6px 4px;
}
.preview-variant-stack {
  width: 100%;
  display: grid;
  gap: 10px;
}
.preview-variant-line {
  min-width: 0;
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.preview-variant-line small {
  color: var(--mm-color-text-subtle);
  font: 700 8px/1 var(--mm-font-family-mono);
  letter-spacing: 0.07em;
}
.preview-size-stack {
  width: 100%;
  display: grid;
  overflow: hidden;
  border: 1px solid var(--mm-color-line);
  border-radius: var(--mm-radius-md);
  background: color-mix(
    in srgb,
    var(--mm-color-panel) 92%,
    var(--mm-color-soft)
  );
}
.preview-size-line {
  min-width: 0;
  min-height: 56px;
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr);
  align-items: center;
  gap: 12px;
  border-top: 1px solid var(--mm-color-line);
  padding: 9px 12px;
}
.preview-size-line:first-child {
  border-top: 0;
}
.preview-size-line > span {
  align-self: stretch;
  display: grid;
  place-content: center start;
  gap: 4px;
  border-right: 1px solid var(--mm-color-line);
}
.preview-size-line > span b {
  color: var(--mm-color-primary);
  font: 800 10px/1 var(--mm-font-family-mono);
  letter-spacing: 0.08em;
}
.preview-size-line > span small {
  color: var(--mm-color-text-subtle);
  font: 700 8px/1 var(--mm-font-family-mono);
  text-transform: uppercase;
}
.preview-size-demo {
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow-x: auto;
  padding: 2px;
}
.preview-size-demo :deep(.mm-autocomplete),
.preview-size-demo :deep(.mm-date-picker),
.preview-size-demo :deep(.mm-input),
.preview-size-demo :deep(.mm-input-number),
.preview-size-demo :deep(.mm-select) {
  width: min(100%, 280px);
}
.preview-size-demo :deep(.mm-pagination) {
  flex-wrap: nowrap;
  justify-content: flex-start;
}
.preview-color-list {
  width: min(100%, 280px);
  display: grid;
  justify-self: start;
  gap: 10px;
}
.preview-color-list :deep(.mm-color) {
  width: 100%;
  justify-content: flex-start;
}
.preview-text-list {
  width: 100%;
  display: grid;
  justify-items: start;
  gap: 9px;
}
.preview-statistic-grid {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
}
.preview-statistic-grid :deep(.mm-statistic) {
  min-width: 0;
  border: 1px solid var(--mm-color-line);
  border-radius: var(--mm-radius-sm);
  padding: 10px;
  background: var(--mm-color-soft);
}
.preview-variant-stack.is-progress :deep(.mm-progress),
.preview-variant-stack.is-message :deep(.mm-message) {
  width: 100%;
}
.preview-surface {
  width: min(100%, 300px);
  color: var(--mm-color-text);
  background: var(--mm-color-soft) !important;
  font-size: var(--mm-font-size-xs);
  text-align: center;
}
.preview-container {
  width: 100%;
  border: 1px dashed var(--mm-color-primary);
  padding-block: 18px;
  color: var(--mm-color-text);
  background: var(--mm-color-primary-soft);
  font-size: var(--mm-font-size-xs);
  text-align: center;
}
.preview-icon-row {
  display: flex;
  gap: 20px;
}
.preview-icon-row span {
  display: grid;
  justify-items: center;
  gap: 7px;
  color: var(--mm-color-text-muted);
  font: 700 9px/1 var(--mm-font-family-mono);
}
.preview-icon-row :deep(.mm-icon) {
  color: var(--mm-color-primary);
}
.preview-blocks {
  width: 100%;
}
.preview-blocks span {
  min-height: 72px;
  display: grid;
  flex: 1;
  place-items: center;
  border: 1px solid var(--mm-color-line);
  border-radius: var(--mm-radius-sm);
  color: var(--mm-color-text-subtle);
  background: var(--mm-color-soft);
  font: 700 9px/1 var(--mm-font-family-mono);
}
.preview-scrollbar {
  width: min(100%, 360px);
  border: 1px solid var(--mm-color-line);
  border-radius: var(--mm-radius-sm);
  background: var(--mm-color-soft);
}
.preview-scrollbar p {
  margin: 0;
  border-top: 1px solid var(--mm-color-line);
  padding: 9px 10px;
  color: var(--mm-color-text-muted);
  font: 600 9px/1.3 var(--mm-font-family-mono);
}
.preview-scrollbar p:first-child {
  border-top: 0;
}
.preview-form {
  width: 100%;
  max-width: 380px;
}
.preview-card {
  width: min(100%, 340px);
}
.preview-card strong {
  color: var(--mm-color-success);
  font: 700 10px/1 var(--mm-font-family-mono);
}
.preview-filter-toolbar {
  width: min(100%, 360px);
  min-height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--mm-color-line);
  border-radius: var(--mm-radius-md);
  padding: 9px 10px 9px 13px;
  background: color-mix(
    in srgb,
    var(--mm-color-panel) 94%,
    var(--mm-color-primary-soft)
  );
  box-shadow: var(--mm-shadow-sm);
}
.preview-filter-toolbar > span {
  min-width: 0;
  display: grid;
  gap: 5px;
}
.preview-filter-toolbar small {
  color: var(--mm-color-primary);
  font: 750 8px/1 var(--mm-font-family-mono);
  letter-spacing: 0.09em;
}
.preview-filter-toolbar strong {
  color: var(--mm-color-text);
  font-size: var(--mm-font-size-sm);
  line-height: 1;
}
.preview-loading-host {
  width: min(100%, 320px);
  min-height: 112px;
  position: relative;
  display: grid;
  place-items: center;
  border: 1px solid var(--mm-color-line);
  border-radius: var(--mm-radius-sm);
  color: var(--mm-color-text-subtle);
  background: var(--mm-color-soft);
  font: 700 9px/1 var(--mm-font-family-mono);
}
.preview-popover-panel {
  display: grid;
  gap: 11px;
}
.preview-popover-panel > header {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  align-items: center;
  gap: 10px;
}
.preview-popover-panel__icon {
  width: 30px;
  height: 30px;
  display: grid;
  place-items: center;
  border: 1px solid
    color-mix(in srgb, var(--mm-color-primary) 34%, var(--mm-color-line));
  border-radius: var(--mm-radius-sm);
  color: var(--mm-color-primary);
  background: var(--mm-color-primary-soft);
}
.preview-popover-panel > header > div {
  min-width: 0;
  display: grid;
  gap: 4px;
}
.preview-popover-panel small {
  color: var(--mm-color-primary);
  font: 750 8px/1 var(--mm-font-family-mono);
  letter-spacing: 0.1em;
}
.preview-popover-panel strong {
  font-size: var(--mm-font-size-sm);
  line-height: 1.1;
  letter-spacing: -0.01em;
}
.preview-popover-panel > p {
  margin: 0;
  color: var(--mm-color-text-muted);
  font-size: var(--mm-font-size-xs);
  line-height: 1.6;
}
.preview-popover-panel > footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid var(--mm-color-line);
  padding-top: 9px;
}
.preview-popover-panel > footer span {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--mm-color-success);
  font: 750 8px/1 var(--mm-font-family-mono);
  letter-spacing: 0.06em;
}
.preview-popover-panel > footer i {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  box-shadow: 0 0 0 3px var(--mm-color-success-soft);
}
.preview-popover-panel > footer code {
  color: var(--mm-color-text-subtle);
  font: 700 8px/1 var(--mm-font-family-mono);
}
:global(.catalog-preview-popover) {
  border-color: color-mix(
    in srgb,
    var(--mm-color-primary) 28%,
    var(--mm-color-line-strong)
  );
  background: linear-gradient(
    145deg,
    var(--mm-color-panel),
    color-mix(in srgb, var(--mm-color-primary-soft) 34%, var(--mm-color-panel))
  );
  box-shadow:
    0 2px 5px rgb(15 23 42 / 8%),
    0 18px 44px rgb(15 23 42 / 18%);
}
:global(.catalog-preview-popover .mm-popover__arrow) {
  border-color: color-mix(
    in srgb,
    var(--mm-color-primary) 28%,
    var(--mm-color-line-strong)
  );
  background: var(--mm-color-panel);
}
.catalog-live-preview__canvas :deep(.mm-date-panel) {
  box-sizing: border-box;
  background: var(--mm-color-panel);
}
.catalog-live-preview__canvas :deep(.mm-calendar) {
  width: 100%;
  max-width: 390px;
  background: var(--mm-color-panel);
}
.catalog-live-preview__canvas :deep(.mm-pagination) {
  max-width: 100%;
  justify-content: center;
}
.catalog-live-preview__canvas :deep(.mm-pro-table__pagination .mm-pagination) {
  justify-content: flex-start;
}
.preview-pro-table :deep(.mm-pro-table__body) {
  min-height: 0;
}
.preview-pro-table :deep(.mm-pro-table__body > .mm-table .mm-table__scroll) {
  max-height: 220px;
}
.catalog-live-preview__canvas :deep(.mm-result) {
  padding-block: 8px;
}

@media (max-width: 520px) {
  .catalog-live-preview__canvas {
    padding: 14px 10px;
  }
  .catalog-live-preview__header {
    padding-inline: 10px;
  }
  .preview-icon-row {
    gap: 13px;
  }
  .preview-statistic-grid {
    grid-template-columns: 1fr;
  }
  .preview-variant-line {
    grid-template-columns: 52px minmax(0, 1fr);
    gap: 7px;
  }
  .preview-size-line {
    grid-template-columns: 48px minmax(0, 1fr);
    gap: 8px;
    padding-inline: 9px;
  }
  .catalog-live-preview__canvas :deep(.mm-steps--horizontal) {
    min-width: 390px;
  }
  .catalog-live-preview__canvas.is-steps {
    overflow-x: auto;
  }
}
</style>
