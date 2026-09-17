# @work-gpt/6mm-ui

面向 6MM 产品的 Vue 3 组件库。当前包含基础组件与 `MmDateRangePicker`、`MmQueryBar`、`MmFilterDrawer`、`MmProTable`、`MmHedgingMonitor`、`MmUserTable`、`MmUserAssetTable`、`MmCurrentOrderTable`、`MmHistoryOrderTable`、`MmConditionOrderTable`、`MmTpSlOrderTable`、`MmPositionTable`、`MmHistoryPositionTable`、`MmLiquidationTable`、`MmLiquidationTradesDialog`、`MmTradeFillTable`、`MmAccountChangeLogTable`、`MmFeeCommissionTable`、`MmHandlingFeeConfig`、`MmOnlineUserTable`、`MmUserDetailDialog`、`MmAdminLoginShell`、`MmSidebarNav`、`MmAppHeader` 组合组件、函数式反馈服务、Loading 指令、组合式工具、明暗主题 token，以及完整的 TypeScript 声明。

该包位于项目 `vendor/6mm-ui`，保持独立构建和发布，不依赖现有业务页面、路由、权限或接口。

## 环境要求

- Node.js >= 20.19.0
- Vue >= 3.4.0 且 < 4
- 支持 ESM、CSS Custom Properties 与 `color-mix()` 的现代浏览器

## 安装

```bash
npm install '@work-gpt/6mm-ui@git+https://github.com/zhangjinteng/6mm-ui.git#v1.0.23' --save-exact
```

生产项目应固定到明确的 `vX.Y.Z` 标签，避免跟随 `main` 产生不可重复安装。

## 全量注册

组件、`v-mm-loading` 指令和公共样式可以通过以下方式接入：

```ts
import { createApp } from "vue";
import MmUI from "@work-gpt/6mm-ui";
import "@work-gpt/6mm-ui/style.css";

import App from "./App.vue";

createApp(App).use(MmUI).mount("#app");
```

全量注册后的组件名统一使用 `Mm` 前缀，例如 `<MmButton>`、`<MmForm>` 和 `<MmTable>`。

## 按需导入

所有组件、服务、指令和公开类型都可以从包根入口具名导入。公共 CSS 仍需在应用入口导入一次。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MmButton, MmInput, message, type ButtonProps } from "@work-gpt/6mm-ui";

import "@work-gpt/6mm-ui/style.css";

const value = ref("");
const button: ButtonProps = { variant: "primary" };
</script>

<template>
  <MmInput v-model="value" aria-label="策略名称" />
  <MmButton v-bind="button" @click="message.success('已保存')">保存</MmButton>
</template>
```

## 快捷日期范围

`MmDateRangePicker` 在 `MmDatePicker` 上组合了六种快捷范围、手动范围选择和确认式提交。快捷按钮和日历只修改内部草稿，点击“确定”后才更新外部值。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MmDateRangePicker, type DateRangeValue } from "@work-gpt/6mm-ui";

const dateRange = ref<DateRangeValue | null>(null);
</script>

<template>
  <MmDateRangePicker v-model="dateRange" placeholder="选择时间范围" />
</template>
```

默认快捷项为今日、昨日、近 7 日、近 30 日、本月和上月。可以使用 `shortcuts` 调整顺序或隐藏项目，并继续使用 `min`、`max` 与 `disabledDate` 限制可选范围。

## 统一查询栏

`MmQueryBar` 用显式字段配置统一关键词、Select、币种、日期范围、Segmented、重置和查询。组件只管理筛选草稿；请求、分页、缓存和 URL 状态仍由页面负责。

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  MmQueryBar,
  type QueryBarField,
  type QueryBarValue,
} from "@work-gpt/6mm-ui";

const filters = ref<QueryBarValue>({});
const fields: QueryBarField[] = [
  {
    key: "keyword",
    label: "关键词",
    placeholder: "账号 / UID",
    type: "keyword",
  },
  {
    key: "level",
    label: "用户等级",
    options: [
      { label: "普通用户", value: "normal" },
      { label: "VIP", value: "vip" },
    ],
    type: "select",
  },
  { key: "coin", label: "币种", options: ["USDT", "BTC", "ETH"], type: "coin" },
  { key: "createdAt", label: "创建日期", type: "date-range" },
  {
    defaultValue: "all",
    key: "status",
    label: "状态",
    options: [
      { label: "全部", value: "all" },
      { label: "在线", value: "online" },
    ],
    type: "segmented",
  },
];

function loadAccounts(value: QueryBarValue) {
  // 重置分页并发起页面请求
  console.log(value);
}
</script>

<template>
  <MmQueryBar v-model="filters" :fields="fields" @query="loadAccounts" />
</template>
```

字段类型必须通过 `type` 明确声明，不根据 label 或业务字段名推断。`query`、`reset` 和 `change` 都会返回新的值快照；`field-{key}` 与 `actions` 插槽可以扩展特殊筛选和页面操作。

传入 `return-context="{ route, label }"` 后，查询字段前会显示“返回{label}”按钮，并通过 `return-context` 事件交由页面执行路由跳转。URL 参数建议统一使用 `mmReturnTo` 和 `mmReturnLabel`，由页面解析并校验为站内路由后再传入组件；`MmProTable` 会透传相同属性与事件。

## 更多筛选抽屉

`MmFilterDrawer` 复用 `MmQueryBar` 字段协议，将低频筛选收进右侧抽屉。组件在打开时创建私有草稿；关闭、点击遮罩或按 Escape 会丢弃未提交修改，只有查询和重置才会更新外部筛选值。

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  MmFilterDrawer,
  type QueryBarField,
  type QueryBarValue,
} from "@work-gpt/6mm-ui";

const filters = ref<QueryBarValue>({ keyword: "", userType: "all" });
const fields: QueryBarField[] = [
  {
    key: "keyword",
    label: "关键词",
    placeholder: "用户 UID / 用户名 / IP",
    type: "keyword",
  },
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
];

function loadAccounts(value: QueryBarValue): void {
  console.log(value);
}
</script>

<template>
  <MmFilterDrawer
    v-model="filters"
    :fields="fields"
    subtitle="在线账户"
    @query="loadAccounts"
  />
</template>
```

默认触发器是带激活数量的筛选图标按钮。`v-model:open` 可控制抽屉，`trigger` 可替换触发器，`field-{key}` 可复用 QueryBar 的自定义字段扩展点；业务请求、分页和 URL 状态仍由页面负责。

## 类型化 Table

`MmTable` 会从 `data` 和 `columns` 推断行类型，列格式化函数与插槽可获得对应类型。传入 `max-height` 可限制整张表格的最大高度；达到上限后仅表体滚动，表头保持在滚动区域之外，稀疏数据不会被强制撑高。

```ts
import type { TableColumn, TableRow } from "@work-gpt/6mm-ui";

type Strategy = TableRow & {
  id: number;
  market: string;
  name: string;
};

const columns: TableColumn<Strategy>[] = [
  { dataIndex: "name", key: "name", title: "策略" },
  { dataIndex: "market", key: "market", title: "市场" },
];
```

## 高级列表工作台

`MmProTable` 组合 `MmQueryBar`、`MmFilterDrawer`、`MmTable` 和 `MmPagination`，提供服务端排序、列设置、自动刷新以及加载、错误、空数据状态。可选的 `header` 插槽用于在查询区之前展示页面标题、说明和摘要等上下文信息；未传入时不会生成额外节点或占用空间。默认单元格会把完整的格式化文本写入原生 `title`，便于在省略号上悬停查看；自定义 `cell-*` 插槽不会被覆盖，也可通过 `:show-cell-title="false"` 关闭。只要传入 `queryFields`，表格就会在“显示字段”后提供同源的更多筛选抽屉；抽屉与行内查询共享当前筛选值及查询/重置事件。默认两处都展示完整字段；传入 `inline-query-field-keys` 后，顶部查询栏只展示指定 key，抽屉仍展示完整 `queryFields`。筛选抽屉可通过 `:filter-drawer="false"` 关闭。普通模式下表格默认使用 `520px` 的最大高度，可通过 `max-height` 调整；在具有明确高度的容器中可传入 `fill-height`，让头部、查询栏和分页保持固定，只滚动中间表格区域，此时忽略 `max-height`。组件不内置业务接口，并为未受控的选择状态提供内部回退；`useMmProTable` 负责请求竞态取消、分页/排序联动、重试和后台刷新，同时提供可直接绑定组件的 `proTableBindings`。

```vue
<script setup lang="ts">
import {
  MmProTable,
  useMmProTable,
  type ProTableColumn,
  type QueryBarField,
  type TableRow,
} from "@work-gpt/6mm-ui";

type Account = TableRow & { id: string; username: string };

const columns: ProTableColumn<Account>[] = [
  { dataIndex: "id", key: "id", sortable: true, title: "账户 ID" },
  { dataIndex: "username", key: "username", title: "用户名" },
];

const queryFields: QueryBarField[] = [
  { key: "keyword", label: "关键词", type: "keyword" },
  {
    defaultValue: "all",
    key: "status",
    label: "状态",
    options: [{ label: "全部", value: "all" }],
    type: "select",
  },
];

const { proTableBindings } = useMmProTable<Account>({
  initialPageSize: 20,
  queryFields,
  request: async ({ filters, page, pageSize, signal, sort }) => {
    const result = await accountApi.list({
      filters,
      page,
      pageSize,
      signal,
      sort,
    });
    return { rows: result.items, total: result.total };
  },
});
</script>

<template>
  <MmProTable
    v-bind="proTableBindings"
    :columns="columns"
    :inline-query-field-keys="['keyword']"
  />
</template>
```

本地运行 `npm run dev` 后，可通过 `/pro-table` 查看包含查询、排序、列偏好、自动刷新和故障恢复的完整预览。

## 用户列表

`MmUserTable` 基于 `MmProTable` 统一普通用户列表的关键词、用户类型、VIP、注册时间筛选，以及默认列、服务端排序、分页、列设置和不同设备下的布局。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。传入 `recommendationOptions` 后会增加可选推荐关系筛选和展示列；传入 `actions.cancelAllOrders` 或 `actions.closeAllPositions` 后会增加对应操作按钮。宿主通过 `request(query, { signal })` 注入接口；权限、确认流程和具体业务 API 仍由应用负责。

`MmIpLocation` 统一 IP、国旗 emoji 和地区信息的两行展示，支持 `locationFirst`、`countryFirst`、`showIpLabel`、`showTooltip` 与仅地区模式。组件根据 `country_code` 在浏览器内生成 emoji，并通过当前 6mmUI locale 本地化国家名称，不依赖图片 CDN。服务端应提供 `ip`、`kind`、`country_code`、`country`、`region`、`city`、`timezone` 组成的标准数据；IPinfo token 和查询请求不得进入前端。`MmOnlineUserTable`、`MmUserTable` 和 `MmUserDetailDialog` 已默认使用该组件，原有单元格与详情插槽继续可覆盖默认展示。

```vue
<script setup lang="ts">
import { MmUserTable, type UserListRequest } from "@work-gpt/6mm-ui";

const request: UserListRequest = async (query, context) => {
  const result = await userApi.list(query, { signal: context.signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const openUser = (userId: number | string) => console.log(userId);

const recommendationOptions = [
  { label: "平台用户", value: 0 },
  { label: "代理 A", value: 10 },
];

const actions = {
  async cancelAllOrders(row, { reload }) {
    await userApi.cancelAllOrders({ user_id: row.user_id });
    await reload();
  },
  async closeAllPositions(row, { reload }) {
    await userApi.closeAllPositions({ user_id: row.user_id });
    await reload();
  },
};
</script>

<template>
  <MmUserTable
    :actions="actions"
    :recommendation-options="recommendationOptions"
    :request="request"
  >
    <template #cell-user_id="{ row }">
      <button type="button" @click="openUser(row.user_id)">
        {{ row.user_id }}
      </button>
    </template>
  </MmUserTable>
</template>
```

上述三项均为可选能力：不传 `recommendationOptions` 时不会出现推荐关系筛选，不传某个 action 回调时不会出现对应按钮。组件会阻止同一用户同一操作的重复点击；回调负责权限校验、确认提示、接口调用和成功消息。

## 用户资产表

`MmUserAssetTable` 统一用户资产页的关键词、用户类型、推荐关系筛选、默认列、服务端排序、分页和列设置。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。默认同时展示内部 `ID`（`platform_user_id`）和公开 UID（`user_id`）。宿主通过 `request(query, { signal })` 注入基础资产与交易内核数据，通过 `marketPrices` 注入实时行情；组件据此计算持仓价值和缺省的未实现盈亏，但不建立 WebSocket、不持有登录令牌，也不调用具体业务接口。

```vue
<script setup lang="ts">
import { computed } from "vue";
import { MmUserAssetTable, type UserAssetListRequest } from "@work-gpt/6mm-ui";

const request: UserAssetListRequest = async (query, { signal }) => {
  const result = await assetApi.list(query, { signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const marketPrices = computed(() => ({ BTCUSDT: 70000, ETHUSDT: 3800 }));

const recommendationOptions = [
  { label: "平台用户", value: 0 },
  { label: "代理 A", value: 10 },
];

const actions = {
  deposit: async (row) => openBalanceDialog(row.platform_user_id, "inc"),
  deduct: async (row) => openBalanceDialog(row.platform_user_id, "dec"),
};
</script>

<template>
  <MmUserAssetTable
    :actions="actions"
    :market-prices="marketPrices"
    :recommendation-options="recommendationOptions"
    :request="request"
  >
    <template #cell-user_id="{ row }">
      <button type="button" @click="openUser(row.user_id)">
        {{ row.user_id }}
      </button>
    </template>
  </MmUserAssetTable>
</template>
```

身份列均提供默认显示，同时支持 `cell-platform_user_id`、`cell-user_id`、`cell-username`、`cell-agent_user_id`、`cell-recommendation` 和 `cell-user_type` 插槽。传入 `recommendationOptions` 后才显示推荐关系筛选与表格列；传入 `actions.deposit` 或 `actions.deduct` 后才显示对应操作按钮。组件处理操作加载态和防重复点击，权限、确认流程和余额接口仍由宿主负责。金额计算优先使用接口给出的 `position_amount` / `position_pnl`，缺失时才根据 `total_quantity`、`positions` 和行情价格计算，便于宿主逐步迁移。

## 合约账变表

`MmAccountChangeLogTable` 统一合约账变和盈亏流水的关键词、用户类型、账变类型、合约、时间筛选，以及服务端排序、列设置和无总数游标分页。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。`mode="all"` 提供完整账变列，`mode="pnl"` 切换为盈亏流水列；宿主只需注入请求，并通过单元格插槽和 `actions.detail` 接入用户详情、产品图标与账变详情等业务能力。

```vue
<script setup lang="ts">
import {
  MmAccountChangeLogTable,
  type AccountChangeLogListRequest,
} from "@work-gpt/6mm-ui";

const request: AccountChangeLogListRequest = async (query, { signal }) => {
  const result = await accountChangeApi.list(query, { signal });
  return {
    rows: result.lists,
    hasMore: result.has_more,
    hasPrevious: result.has_previous,
    nextCursor: result.next_cursor,
    previousCursor: result.previous_cursor,
    updatedAt: new Date(),
  };
};

const actions = {
  detail: (row) => openAccountChangeDetail(row),
};
</script>

<template>
  <MmAccountChangeLogTable :actions="actions" :request="request" />
</template>
```

组件管理筛选、排序、请求取消和游标栈；认证、权限、接口封装、时区转换及详情抽屉仍由宿主负责。所有默认列均可通过 `cell-*` 插槽替换，也可使用 `columns` 解析函数增删业务列。

## 当前委托表

`MmCurrentOrderTable` 统一当前委托的用户、合约、委托类型、保证金模式、方向、杠杆、只减仓、Maker 和委托时间筛选，并提供默认列、无总数游标分页、列设置、请求取消及详情/撤单回调。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。宿主通过 `request(query, { signal })` 注入交易源，通过 `actions` 接入自身确认弹窗和交易指令。

```vue
<script setup lang="ts">
import {
  MmCurrentOrderTable,
  type CurrentOrderListRequest,
} from "@work-gpt/6mm-ui";

const request: CurrentOrderListRequest = async (query, { signal }) => {
  const result = await orderApi.list(query, { signal });
  return {
    rows: result.lists,
    hasMore: result.has_more,
    nextCursor: result.next_cursor,
    updatedAt: new Date(),
  };
};

const actions = {
  detail: (row) => openOrderDetail(row),
  cancel: (row) => openCancelConfirmation(row),
};
</script>

<template>
  <MmCurrentOrderTable :actions="actions" :request="request" />
</template>
```

组件不读取登录态、不调用固定 API，也不直接撤单。代理商范围、交易内核、产品分类、确认弹窗和撤单权限继续由宿主负责；默认列和查询字段均支持解析函数与业务插槽扩展。

## 历史委托表

`MmHistoryOrderTable` 统一历史委托的筛选、列、服务端分页排序、请求取消和详情动作。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。宿主注入接口并保留自身的 UID 弹窗、合约图标和详情抽屉。

```vue
<script setup lang="ts">
import {
  MmHistoryOrderTable,
  type HistoryOrderListRequest,
} from "@work-gpt/6mm-ui";

const request: HistoryOrderListRequest = async (query, { signal }) => {
  const result = await historyOrderApi.list(query, { signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const actions = {
  detail: (row) => openOrderDetail(row),
};
</script>

<template>
  <MmHistoryOrderTable :actions="actions" :request="request" />
</template>
```

组件不读取登录态，也不绑定固定接口。历史数据源、用户范围、产品分类、详情抽屉和 HTTP 响应封装继续由宿主负责。

## 条件委托与止盈止损委托表

`MmConditionOrderTable` 与 `MmTpSlOrderTable` 共用同一查询、列与格式化内核，但分别固定条件委托和止盈止损语义。宿主只需选择 `lifecycle="current"` 或 `lifecycle="history"`；组件会把 `kind` 和 `lifecycle` 一并传给注入的 `request`。

```vue
<script setup lang="ts">
import {
  MmConditionOrderTable,
  MmTpSlOrderTable,
  type ConditionOrderListRequest,
} from "@work-gpt/6mm-ui";

const request: ConditionOrderListRequest = async (query, { signal }) => {
  const result = await conditionOrderApi.list(query, { signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const actions = {
  detail: (row) => openConditionOrderDetail(row),
  cancel: (row) => openCancelConfirmation(row),
};
</script>

<template>
  <MmConditionOrderTable
    lifecycle="current"
    :actions="actions"
    :request="request"
  />
  <MmTpSlOrderTable lifecycle="history" :actions="actions" :request="request" />
</template>
```

用户 UID 弹窗、产品分类、详情抽屉、取消确认、权限和 HTTP 封装继续由宿主通过插槽、`actions` 与 `request` 接入。

## 当前持仓表

`MmPositionTable` 统一当前持仓的用户、合约、保证金模式、方向、杠杆和开仓时间筛选，以及默认列、服务端排序、分页、列设置与完整数据状态。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。宿主通过 `request` 注入仓位数据，通过 `marketPrices` 注入实时标记价；组件据此计算持仓价值、未实现盈亏和回报率，并在实时值缺失时使用接口字段回退。

```vue
<script setup lang="ts">
import { MmPositionTable, type PositionListRequest } from "@work-gpt/6mm-ui";

const request: PositionListRequest = async (query, { signal }) => {
  const result = await positionApi.list(query, { signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const marketPrices = { BTCUSDT: 70000, ETHUSDT: 3800 };
const actions = {
  detail: (row) => openPositionDetail(row),
  close: (row) => openCloseConfirmation(row),
};
</script>

<template>
  <MmPositionTable
    :actions="actions"
    :market-prices="marketPrices"
    :request="request"
  />
</template>
```

组件不会建立行情连接，也不会直接执行平仓。ClickHouse/gRPC 数据源、权限校验、确认弹窗、交易指令和业务详情继续由宿主负责；默认列均支持 `cell-*` 插槽和 `columns` 解析函数扩展。

## 历史仓位表

`MmHistoryPositionTable` 统一历史仓位的用户、合约、保证金模式、方向、杠杆、触发状态、仓位状态和平仓时间筛选，以及默认列、服务端排序、分页、列设置与完整数据状态。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。宿主通过 `request` 注入历史仓位数据，通过 `actions.detail` 保留业务详情抽屉。

```vue
<script setup lang="ts">
import {
  MmHistoryPositionTable,
  type HistoryPositionListRequest,
} from "@work-gpt/6mm-ui";

const request: HistoryPositionListRequest = async (query, { signal }) => {
  const result = await positionApi.history(query, { signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const actions = {
  detail: (row) => openHistoryPositionDetail(row),
};
</script>

<template>
  <MmHistoryPositionTable :actions="actions" :request="request" />
</template>
```

组件不访问 ClickHouse，也不解析条件单或产品分类。代理商权限、历史用户身份回退、手续费与触发方式补充、产品映射、详情抽屉和成交记录路由继续由宿主负责；默认列可通过 `cell-*` 插槽或 `columns` 解析函数扩展。

## 强平记录表

`MmLiquidationTable` 统一产品分类、用户、合约、方向和发生时间筛选，以及强平记录默认列、服务端排序、分页、列设置和完整数据状态。宿主通过 `request` 注入按仓位聚合后的强平数据，通过 `actions` 注入详情和成交记录入口。

```vue
<script setup lang="ts">
import {
  MmLiquidationTable,
  type LiquidationListRequest,
} from "@work-gpt/6mm-ui";

const request: LiquidationListRequest = async (query, { signal }) => {
  const result = await liquidationApi.list(query, { signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const actions = {
  detail: (row) => openLiquidationDetail(row),
  trades: (row) => openLiquidationTrades(row),
};
</script>

<template>
  <MmLiquidationTable :actions="actions" :request="request" />
</template>
```

组件不访问 ClickHouse，也不计算强平费规则或管理业务路由。代理商权限、产品映射、历史仓位跳转和详情费用计算继续由宿主负责；默认列可通过 `cell-*` 插槽或 `columns` 解析函数扩展。

`MmLiquidationTradesDialog` 统一强平摘要、按强平单聚合的成交明细、加载/异常/空状态与分页。宿主通过 `request` 注入数据，通过 `positionHref`、`orderTradesHref` 和对应点击事件接入自身路由；组件不会写死接口地址或业务路由。

## 合约成交表

`MmTradeFillTable` 统一关键词、合约、成交时间、用户类型、仓位模式、方向和成交角色筛选，以及历史成交默认列、服务端排序、分页、列设置和完整数据状态。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。

```vue
<script setup lang="ts">
import { MmTradeFillTable, type TradeFillListRequest } from "@work-gpt/6mm-ui";

const request: TradeFillListRequest = async (query, { signal }) => {
  const result = await tradeFillApi.list(query, { signal });
  return { rows: result.lists, total: result.count, updatedAt: new Date() };
};

const actions = {
  detail: (row) => openTradeFillDetail(row),
};
</script>

<template>
  <MmTradeFillTable :actions="actions" :request="request" />
</template>
```

组件不访问 ClickHouse，也不拼接用户权限或产品映射。代理商范围、历史用户类型、外部用户 ID、产品分类和详情抽屉继续由宿主负责；业务展示可通过 `cell-*` 插槽扩展。

## 手续费配置

`MmHandlingFeeConfig` 封装手续费等级列表、配置归属筛选、新增/修改表单、删除确认弹窗、请求 loading 和 Agent 配置状态。组件不写死接口地址和权限指令；宿主传入 `request`，并按权限提供可用的 `actions`。未提供的操作不会显示。`canEditRow` 可将数据归属与编辑权限解耦，`writeAgentId` 指定实际写入归属，`volumeEditable` 可限制宿主只修改费率。

Platform Admin 可注入完整能力：

```vue
<script setup lang="ts">
import {
  MmHandlingFeeConfig,
  type HandlingFeeConfigActions,
} from "@work-gpt/6mm-ui";
import {
  handlingFeeAdd,
  handlingFeeDelete,
  handlingFeeDetail,
  handlingFeeEdit,
  handlingFeeLists,
  handlingFeeMaxLevel,
} from "@/api/config/handling_fee";

const request = async (query) => {
  const result = await handlingFeeLists(query);
  return { rows: result.lists, total: result.count };
};

const actions: HandlingFeeConfigActions = {
  create: (value) => handlingFeeAdd(value),
  loadCreateDefaults: () => handlingFeeMaxLevel(),
  loadEditData: (row) => handlingFeeDetail({ id: row.id }),
  remove: (row) => handlingFeeDelete({ id: row.id }),
  update: (_row, value) => handlingFeeEdit(value),
};
</script>

<template>
  <MmHandlingFeeConfig
    :actions="actions"
    :owner-options="agentOptions"
    :request="request"
  />
</template>
```

Agent Admin 可以在展示平台兜底配置时开放费率编辑，并把写入目标固定为当前代理商：

```vue
<MmHandlingFeeConfig
  :actions="{ update: updateAgentFee }"
  :can-edit-row="() => true"
  :initial-agent-id="currentAgentId"
  :request="request"
  :show-owner-filter="false"
  :volume-editable="false"
  :write-agent-id="currentAgentId"
/>
```

前端编辑状态不是安全边界。Platform 的新增、修改、删除接口仍须在服务端校验 `agent_id = 0`；Agent 的查询与写入接口也须从登录身份确定代理商范围，不能信任浏览器自行提交的代理商 ID。

## 在线用户表

`MmOnlineUserTable` 内置在线用户筛选、默认列、分页、登录时间和在线时长格式化。`includeRobotUserType` 默认为 `false`，显式开启后才会在用户类型筛选中增加“机器人”。`columns` 既可传入完整列数组，也可传入接收默认列的解析函数；业务页面可在保留默认能力的同时插入 ID、推荐关系和操作列。组件会把未占用的 `cell-*`、`header-*` 插槽透传给内部 `MmProTable`，因此权限判断、确认弹窗和强制下线接口仍由应用负责。调用成功后可通过组件实例的 `reload()` 刷新当前列表。

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  MmButton,
  MmOnlineUserTable,
  type OnlineUserRow,
  type OnlineUserTableColumns,
  type OnlineUserTableExpose,
} from "@work-gpt/6mm-ui";

type AdminOnlineUser = OnlineUserRow & {
  agent_name_parse?: string;
  id: number;
};

const tableRef = ref<OnlineUserTableExpose>();
const columns: OnlineUserTableColumns<AdminOnlineUser> = (defaults) => [
  { dataIndex: "id", hideable: false, key: "id", title: "ID", width: 90 },
  ...defaults.map((column) =>
    column.key === "vip_level" ? { ...column, title: "用户等级(VIP)" } : column,
  ),
  {
    dataIndex: "agent_name_parse",
    key: "agent_relation",
    title: "推荐关系",
    width: 140,
  },
  { fixed: "right", hideable: false, key: "actions", title: "操作", width: 90 },
];

async function forceLogout(row: AdminOnlineUser): Promise<void> {
  await userApi.forceLogout({ user_id: row.id });
  await tableRef.value?.reload();
}
</script>

<template>
  <MmOnlineUserTable
    ref="tableRef"
    :columns="columns"
    :request="onlineUserApi.list"
  >
    <template #cell-actions="{ row }">
      <MmButton size="sm" variant="danger" @click="forceLogout(row)"
        >强制下线</MmButton
      >
    </template>
  </MmOnlineUserTable>
</template>
```

如果操作需要权限，宿主应在生成 `columns` 时决定是否加入操作列，并在按钮外层继续使用自身权限指令。组件不持有令牌、权限标识或业务 API。

## 用户详情弹窗

`MmUserDetailDialog` 统一用户身份、登录状态和合约汇总的展示，请求通过 `request` 注入。组件负责加载、取消过期请求、错误重试和数据状态；鉴权、数据范围、IP 地理信息查询、用户类型切换与业务路由继续由宿主负责，可分别通过 `user-type`、`login-location`、`header-actions` 插槽和 `metric-click` 事件接入。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MmUserDetailDialog, type UserDetailRequest } from "@work-gpt/6mm-ui";

const open = ref(false);
const userId = ref<number | string>();
const request: UserDetailRequest = (id, { signal }) =>
  userApi.detail({ user_id: id }, { signal });
</script>

<template>
  <MmUserDetailDialog
    v-model="open"
    :request="request"
    :user-id="userId"
    @metric-click="(metric, detail) => openUserBusiness(metric, detail.user_id)"
  />
</template>
```

## 响应式侧栏导航

`MmSidebarNav` 组合 `MmMenu`、`MmPopover`、`MmTooltip`、`MmScrollbar` 与 `MmDrawer`，统一桌面展开、图标收起、悬浮子菜单和移动抽屉。组件只维护导航展示状态并发出选中项；路由、权限和底部在线人数仍由应用适配层负责。

```vue
<script setup lang="ts">
import { ref } from "vue";
import { MmSidebarNav, type SidebarNavItem } from "@work-gpt/6mm-ui";

const activeKey = ref<string | number>("online-accounts");
const openKeys = ref<Array<string | number>>(["users"]);
const collapsed = ref(false);
const mobileOpen = ref(false);
const items: SidebarNavItem[] = [
  {
    key: "users",
    label: "用户管理",
    icon: "users",
    children: [
      { key: "online-accounts", label: "在线账户", icon: "users-round" },
      { key: "trading-accounts", label: "用户列表", icon: "users" },
    ],
  },
];

function navigate(item: { key: string | number }): void {
  window.location.hash = `/merchant/users/${String(item.key)}`;
}
</script>

<template>
  <MmSidebarNav
    v-model="activeKey"
    v-model:open-keys="openKeys"
    v-model:mobile-open="mobileOpen"
    :collapsed="collapsed"
    :items="items"
    @select="navigate"
  >
    <template #brand="{ collapsed: compact }">{{
      compact ? "6" : "6MM 管理后台"
    }}</template>
    <template #footer="{ collapsed: compact }">{{
      compact ? "7.3K" : "在线用户 7,320"
    }}</template>
  </MmSidebarNav>
</template>
```

默认开启手风琴模式，宽度为 `188px`，收起宽度为 `56px`，自动移动断点为 `900px`。可以用 `display="desktop"` 或 `display="mobile"` 强制展示模式，便于嵌入既有应用外壳。

## 应用级顶栏

`MmAppHeader` 将桌面侧栏开关、移动品牌、关键指标、上下文动作、身份、主题和账号入口组合成 54px 应用顶栏。为 `profile` 提供 `items` 时，原生头像按钮会触发带账号摘要的 `MmDropdown`，选择结果通过 `profile-select` 交给宿主处理；未提供菜单项时继续保持普通头像按钮。组件只管理展示状态并发出事件，不计算金额、不执行路由、不请求接口，也不会直接修改全局主题或控制 `MmSidebarNav`。

```vue
<script setup lang="ts">
import { ref } from "vue";
import {
  MmAppHeader,
  type AppHeaderAction,
  type AppHeaderMetric,
  type AppHeaderProfileItem,
} from "@work-gpt/6mm-ui";

const collapsed = ref(false);
const mobileOpen = ref(false);
const theme = ref<"dark" | "light">("light");
const metrics: AppHeaderMetric[] = [
  { key: "available", label: "可用", value: "9,787,646.35" },
  { key: "occupied", label: "占用", value: "162,124.99" },
  { key: "total", label: "总保证金", tone: "primary", value: "9,949,771.34" },
];
const contextActions: AppHeaderAction[] = [
  {
    icon: "triangle-alert",
    key: "guarantee",
    label: "保证金不足",
    tone: "warning",
  },
  { icon: "arrow-up-to-line", key: "deposit", label: "充值", tone: "primary" },
];
const profileItems: AppHeaderProfileItem[] = [
  { icon: "user", key: "personal-center", label: "个人中心" },
  { icon: "key-round", key: "change-password", label: "修改密码" },
  { icon: "logout", key: "logout", label: "退出登录", tone: "danger" },
];
</script>

<template>
  <MmAppHeader
    v-model:mobile-open="mobileOpen"
    v-model:sidebar-collapsed="collapsed"
    v-model:theme="theme"
    :brand="{ alt: '6MM', logo: '/logo.svg', title: '管理后台' }"
    :context-actions="contextActions"
    :identity="{ label: '商户', tone: 'merchant' }"
    :metrics="metrics"
    page-title="在线账户"
    :profile="{
      alt: '管理员',
      email: 'ops@alphaembed.com',
      fallback: '管',
      items: profileItems,
    }"
    summary-label="商户保证金数据"
    @action="({ key }) => console.log(key)"
    @profile-select="({ key }) => console.log(key)"
  />
</template>
```

`display="auto"` 默认在 `900px` 进入移动结构；`display="desktop"` 与 `display="mobile"` 可用于嵌入式预览。`brand`、`center`、`actions`、`identity` 和 `profile` 插槽可以替换默认区域；`utilities` 插槽位于主题按钮之后、账号入口之前，适合放置语言切换等宿主级工具。主题按钮只更新 `v-model:theme`，宿主仍需把值同步到根节点的 `data-mm-theme`。

## 国际化

组件库内置 `zh-CN` 和 `en-US`。`locale` 可以传固定语言，也可以传 `ref` 实现运行时切换：

```ts
import { createApp, ref } from "vue";
import MmUI, { type MmUILocaleName } from "@work-gpt/6mm-ui";
import "@work-gpt/6mm-ui/style.css";

import App from "./App.vue";

export const locale = ref<MmUILocaleName>("zh-CN");

createApp(App)
  .use(MmUI, {
    locale,
    theme: {
      light: {
        primary: "#087765",
        success: "#0b7651",
        warning: "#b45309",
        danger: "#c23838",
        info: "#2563eb",
        onPrimary: "#ffffff",
      },
      dark: {
        primary: "#0accaa",
        success: "#39d39c",
        warning: "#f1ad47",
        danger: "#fb7185",
        info: "#60a5fa",
        onPrimary: "#041b16",
      },
    },
  })
  .mount("#app");
```

切换时直接修改同一个 `ref`：

```ts
locale.value = locale.value === "zh-CN" ? "en-US" : "zh-CN";
document.documentElement.lang = locale.value;
```

未配置 `locale` 时默认使用 `zh-CN`。组件 props 显式传入的标题、占位符和按钮文案优先于内置词典；组件库只翻译自身默认文案与 ARIA 文案，业务菜单、字段名和接口消息仍建议由宿主的 `vue-i18n` 管理。

## 主题

默认使用浅色 token。通过 `data-mm-theme` 切换主题：

```ts
document.documentElement.dataset.mmTheme = "dark";
document.documentElement.dataset.mmTheme = "light";
```

安装插件时可以传入语义主题色。配置会写入 `<html>` 的公开 CSS 变量，并同时作用于 Teleport 到 `body` 的浮层组件：

```ts
import { createApp } from "vue";
import MmUI from "@work-gpt/6mm-ui";
import "@work-gpt/6mm-ui/style.css";

import App from "./App.vue";

createApp(App)
  .use(MmUI, {
    theme: {
      light: {
        primary: "#087765",
        success: "#0b7651",
        warning: "#b45309",
        danger: "#c23838",
        info: "#2563eb",
        onPrimary: "#ffffff",
      },
      dark: {
        primary: "#0accaa",
        success: "#39d39c",
        warning: "#f1ad47",
        danger: "#fb7185",
        info: "#60a5fa",
        onPrimary: "#041b16",
      },
    },
  })
  .mount("#app");
```

`light` 在 `data-mm-theme="light"` 以及未设置主题属性时生效，`dark` 在 `data-mm-theme="dark"` 时生效。直接把颜色写在 `theme` 下仍然受支持，表示明暗模式共用该颜色。

只传基础色时，`primaryHover`、`primarySoft`、`successSoft`、`warningSoft`、`dangerSoft` 和 `infoSoft` 会自动生成；也可以在每套色板中显式传入这些字段以及 `onPrimary` 覆盖派生结果。

主题属性建议设置在 `<html>` 或 `<body>` 上，而不是仅设置在业务子树上。Dialog、Drawer、Popover、Message 等组件会 Teleport 到 `body`，根级主题可保证浮层与页面保持一致。

可以在宿主主题选择器中覆盖公开 token：

```css
[data-mm-theme="light"] {
  --mm-color-primary: #087765;
  --mm-radius-md: 10px;
}
```

CSS 类统一使用 `mm-` 命名空间，token 统一使用 `--mm-*`，Vue 组件统一使用 `Mm` 前缀。

## 服务与指令

```ts
import {
  message,
  messageBox,
  vMmLoading,
  type MessageBoxResult,
} from "@work-gpt/6mm-ui";

message.success("发布任务已创建");

const result: MessageBoxResult = await messageBox.prompt(
  "请输入审批备注",
  "审批确认",
);

void result;
void vMmLoading;
```

- `message`：success、warning、error、info 消息队列。
- `messageBox`：alert、confirm、prompt Promise API。
- `v-mm-loading` / `vMmLoading`：局部加载遮罩指令。

## 组件与公开 API

完整的组件清单、配套子组件和高级导出见 [组件与公开 API](./docs/components.md)。

包导出合同：

| 入口                         | 内容                                                     |
| ---------------------------- | -------------------------------------------------------- |
| `@work-gpt/6mm-ui`           | 默认插件、组件、类型、服务、指令、composables 和共享工具 |
| `@work-gpt/6mm-ui/style.css` | token、基础样式和全部组件 CSS                            |

## 浏览器支持策略

支持仍处于官方维护周期的现代 Chrome、Edge、Firefox 和 Safari。当前版本不提供 IE、旧版 WebView 或无 CSS Custom Properties 环境的兼容层。

## 无障碍

- 交互控件具备键盘操作和可见焦点。
- 表单错误、加载与消息使用相应 ARIA 语义。
- Dialog、Drawer 和图片预览具备焦点陷阱与焦点回退。
- Playground 通过完整 axe 扫描，未关闭颜色对比规则。

自动化检查不能替代真实读屏器和业务内容审查；接入方仍需为图像、图标按钮和业务字段提供准确名称。

## 本地开发

```bash
npm ci
npm run dev
```

常用命令：

| 命令                  | 用途                                            |
| --------------------- | ----------------------------------------------- |
| `npm run typecheck`   | 检查源码、Playground 和浏览器测试类型           |
| `npm test -- --run`   | 运行 Vitest 单元与组件测试                      |
| `npm run test:a11y`   | 运行严格 axe 浏览器扫描                         |
| `npm run test:e2e`    | 运行完整 Playwright 组合流程                    |
| `npm run build`       | 生成 ESM、CSS、source map 和声明文件            |
| `npm run check`       | 依次执行 typecheck、Vitest 和 build             |

## 发布与消费验证

```bash
npm ci
npm run check
npm pack

cd tests/consumer
npm install ../../*.tgz
npm run typecheck
npm run build
```

`tests/consumer` 不使用源码别名；它安装真实 tarball，以验证默认插件、按需导入、样式入口和声明文件。

发布前更新版本并生成需要随标签提交的 `dist`：

```bash
npm version <新版本号> --no-git-tag-version
npm run check
```

检查通过后提交源码与构建产物，并创建同版本 Git Tag：

```bash
git add --all
git commit -m "chore(release): prepare v<新版本号>"
git push origin main
git tag -a v<新版本号> -m "Release v<新版本号>"
git push origin v<新版本号>
```

## 当前非目标

- 不接入或改造现有业务页面。
- 不内置路由、接口、鉴权、权限或业务状态。
- 不提供 Table 虚拟滚动；大数据量场景应在业务侧分页或后续扩展。
- 不作为 Element Plus 等完整 UI 框架的兼容层。
- 不承诺旧浏览器或服务端 DOM API 的运行时兼容。
