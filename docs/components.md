# 组件与公开 API

`@work-gpt/6mm-ui` 提供完整的基础组件与 `MmDateRangePicker`、`MmQueryBar`、`MmFilterDrawer`、`MmInfoGrid`、`MmProTable`、`MmUserTable`、`MmUserAssetTable`、`MmCurrentOrderTable`、`MmHistoryOrderTable`、`MmPositionTable`、`MmHistoryPositionTable`、`MmLiquidationTable`、`MmLiquidationTradesDialog`、`MmTradeFillTable`、`MmAccountChangeLogTable`、`MmFeeCommissionTable`、`MmHandlingFeeConfig`、`MmPredictionGameConfig`、`MmOnlineUserTable`、`MmAdminLoginShell`、`MmSidebarNav`、`MmAppHeader` 等组合组件。组件使用 `Mm` 前缀，CSS 使用 `mm-`，设计 token 使用 `--mm-*`。

## 应用外壳（1）

| 组件              | 导入名              | 核心能力                                                                                                 |
| ----------------- | ------------------- | -------------------------------------------------------------------------------------------------------- |
| Admin Login Shell | `MmAdminLoginShell` | 双栏登录布局、产品能力卡片、合作伙伴走马灯、品牌与工具插槽、主题强调色和移动端响应式；鉴权逻辑由宿主注入 |

## 基础能力（11）

| 组件       | 导入名         | 核心能力                                     |
| ---------- | -------------- | -------------------------------------------- |
| Button     | `MmButton`     | 变体、尺寸、loading、icon-only、原生按钮类型 |
| Border     | `MmBorder`     | 边框、背景、圆角、间距与渲染标签             |
| Color      | `MmColor`      | 色块、值展示、可选择状态与文本对比           |
| Container  | `MmContainer`  | 最大宽度、流式布局、gutter 与渲染标签        |
| Icon       | `MmIcon`       | 内置 SVG、尺寸、颜色、旋转与可访问名称       |
| Layout     | `MmLayout`     | row/column、对齐、换行与 gap                 |
| Link       | `MmLink`       | 外链安全属性、禁用、下划线和图标插槽         |
| Text       | `MmText`       | 语义标签、尺寸、tone、权重与截断             |
| Scrollbar  | `MmScrollbar`  | 原生滚动容器、事件、键盘和滚动方法           |
| Space      | `MmSpace`      | 横纵排列、wrap、分隔符和尺寸                 |
| Typography | `MmTypography` | 标题/段落语义、复制、折叠与代码内容          |

## 表单（13）

| 组件              | 导入名                          | 核心能力                                                         |
| ----------------- | ------------------------------- | ---------------------------------------------------------------- |
| Autocomplete      | `MmAutocomplete`                | 本地/远程建议、防抖、取消与键盘选择                              |
| Checkbox          | `MmCheckbox`、`MmCheckboxGroup` | 单项/组、indeterminate、数量限制与 readonly                      |
| Date Picker Panel | `MmDatePickerPanel`             | 单日/范围、月年切换、禁用日期与键盘网格                          |
| Date Picker       | `MmDatePicker`                  | 输入解析、格式化、清空、单日与日期范围                           |
| Date Range Picker | `MmDateRangePicker`             | 六种快捷范围、手动范围、草稿摘要、清空与确认提交                 |
| Form              | `MmForm`、`MmFormItem`          | 同步/异步规则、reset、字段验证和错误聚焦                         |
| Input             | `MmInput`                       | 前后插槽、清空、密码、计数与表单状态                             |
| Input Number      | `MmInputNumber`                 | min/max、step、precision、控件和方向键                           |
| Filter Drawer     | `MmFilterDrawer`                | 筛选图标、激活数量、私有草稿、抽屉、重置与查询提交               |
| Query Bar         | `MmQueryBar`                    | 配置化关键词、选择、币种、日期、分段、可选返回上下文、重置与查询 |
| Radio             | `MmRadio`、`MmRadioGroup`       | 单项/组、按钮形态、readonly 与方向键                             |
| Select            | `MmSelect`                      | 单选/多选、过滤、远程选项、上限与键盘                            |
| Upload            | `MmUpload`                      | 选择/拖拽、校验、进度、取消、重试和注入式请求                    |

## 数据展示（33）

| 组件                        | 导入名                                 | 核心能力                                                                                                                                         |
| --------------------------- | -------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| Avatar                      | `MmAvatar`                             | 图片、文字、图标、尺寸、形状和错误回退                                                                                                           |
| Badge                       | `MmBadge`                              | 数值封顶、dot、状态类型和无障碍文本                                                                                                              |
| Calendar                    | `MmCalendar`                           | 月视图、受控月份、日期选择和日期插槽                                                                                                             |
| Card                        | `MmCard`                               | header、body、footer、阴影和 hoverable                                                                                                           |
| Collapse                    | `MmCollapse`、`MmCollapseItem`         | 多开/手风琴、受控值、禁用与键盘                                                                                                                  |
| Descriptions                | `MmDescriptions`、`MmDescriptionsItem` | 列数、边框、label、span 和响应式                                                                                                                 |
| Empty                       | `MmEmpty`                              | 默认图形、描述、操作与自定义图像                                                                                                                 |
| Image                       | `MmImage`                              | lazy、fit、加载/错误状态和多图预览                                                                                                               |
| Info Grid                   | `MmInfoGrid`、`MmInfoGridItem`         | 语义化信息网格、列数、跨列、值样式、`sm` / `md` / `lg` 密度与响应式布局                                                                          |
| Pagination                  | `MmPagination`                         | 页码、总数、跳转、页大小和边界状态                                                                                                               |
| Cursor Pagination           | `MmCursorPagination`                   | 无总数场景的上一页、下一页、当前页和加载边界状态                                                                                                 |
| Progress                    | `MmProgress`                           | line/circle、状态、格式化、颜色和 ARIA                                                                                                           |
| Pro Table                   | `MmProTable`                           | 可选上下文头部、QueryBar 行内字段子集、完整筛选抽屉、可选返回上下文、服务端排序、分页、列设置、自动刷新、可配置最大高度、可选填满容器模式与完整数据状态 |
| User Table                  | `MmUserTable`                          | 用户列表默认筛选与列、可选机器人类型、可选推荐关系筛选/展示、可选全部撤单/全部平仓回调、注入式请求、分页排序、列设置、业务单元格插槽与响应式布局 |
| User Asset Table            | `MmUserAssetTable`                     | 用户资产内部 ID/UID、可选机器人类型、可选推荐关系筛选与列、可选充值/扣减操作、注入式请求和行情价格、持仓价值/盈亏回退计算、分页排序与列设置      |
| Current Order Table         | `MmCurrentOrderTable`                  | 当前委托统一筛选与列、可选机器人类型、注入式请求、请求取消、游标栈分页、列设置及详情/撤单回调                                                    |
| History Order Table         | `MmHistoryOrderTable`                  | 历史委托统一筛选与列、可选机器人类型、注入式请求、请求取消、服务端分页排序、列设置及详情回调                                                     |
| Condition Order Table       | `MmConditionOrderTable`                | 条件委托统一筛选与列、当前/历史生命周期、注入式请求、分页、详情/撤单回调及业务单元格插槽                                                         |
| TP/SL Order Table           | `MmTpSlOrderTable`                     | 止盈止损委托预设、受限触发类型、当前/历史生命周期、注入式请求及详情/撤单回调                                                                     |
| Position Table              | `MmPositionTable`                      | 当前持仓统一筛选与列、可选机器人类型、注入式请求和行情价格、持仓价值/盈亏/回报率计算、分页排序、列设置及详情/平仓回调                            |
| History Position Table      | `MmHistoryPositionTable`               | 历史仓位统一筛选与列、可选机器人类型、注入式请求、历史盈亏与触发状态格式化、分页排序、列设置及详情回调                                           |
| Liquidation Table           | `MmLiquidationTable`                   | 强平记录统一筛选与列、注入式请求、数值格式化、分页排序、列设置及详情/成交回调                                                                    |
| Liquidation Trades Dialog   | `MmLiquidationTradesDialog`            | 强平摘要、按强平单聚合的成交明细、注入式请求、分页与宿主路由回调                                                                                 |
| Trade Fill Table            | `MmTradeFillTable`                     | 合约成交统一筛选与列、可选机器人类型、注入式请求、数值格式化、分页排序、列设置及详情回调                                                         |
| Account Change Log Table    | `MmAccountChangeLogTable`              | 合约账变/盈亏流水模式、统一筛选与列、可选机器人类型、服务端排序、稳定游标分页、详情回调和业务单元格插槽                                          |
| Fee Commission Table        | `MmFeeCommissionTable`                 | 手续费返佣统一筛选与列、数值和标签格式化、返佣列显隐、服务端分页排序及业务单元格插槽                                                             |
| Handling Fee Config         | `MmHandlingFeeConfig`                  | 手续费等级列表、配置归属筛选、新增/修改/删除弹窗、注入式读写回调，以及独立的数据归属、写入目标和行编辑权限控制                                   |
| Prediction Game Config      | `MmPredictionGameConfig`               | 涨跌/自选预测玩法、币种与周期规则、约束编辑和保存弹窗；由宿主注入读写、权限与币种图标适配器                                                      |
| Online User Table           | `MmOnlineUserTable`                    | 在线用户默认筛选与列、可选机器人类型、列解析/覆盖、自定义业务单元格、在线时长和实例刷新                                                          |
| User Detail Dialog          | `MmUserDetailDialog`                   | 注入式用户详情请求、请求取消/重试、身份与登录信息、合约汇总、业务插槽与指标跳转事件                                                              |
| Pro Table Cursor Pagination | `MmProTableCursorPagination`           | 游标分页的表格范围摘要与顺序导航                                                                                                                 |
| Pro Table Pagination        | `MmProTablePagination`                 | 表格范围摘要、页码分页和每页条数切换                                                                                                             |
| Result                      | `MmResult`                             | success/error/info/warning 结果与操作插槽                                                                                                        |
| Table                       | `MmTable`                              | 泛型列、排序、选择、展开、固定列、表体限高滚动和加载/空状态                                                                                      |
| Tag                         | `MmTag`                                | 类型、效果、尺寸、圆角、关闭与禁用                                                                                                               |
| Statistic                   | `MmStatistic`                          | 精度、前后缀、格式化和趋势                                                                                                                       |
| Segmented                   | `MmSegmented`                          | 受控值、禁用项、图标、block 与方向键                                                                                                             |

## 导航（7）

| 组件        | 导入名                              | 核心能力                                                                               |
| ----------- | ----------------------------------- | -------------------------------------------------------------------------------------- |
| Dropdown    | `MmDropdown`                        | click/hover、placement、菜单项和选择关闭                                               |
| Menu        | `MmMenu`、`MmMenuItem`、`MmSubMenu` | 纵横布局、子菜单、受控项和键盘漫游                                                     |
| App Header  | `MmAppHeader`                       | 桌面/移动顶栏、关键指标、上下文动作、身份、主题、账号 Dropdown、工具扩展插槽与受控状态 |
| Sidebar Nav | `MmSidebarNav`                      | 数据驱动侧栏、父子高亮、手风琴、图标收起、悬浮子菜单与移动抽屉                         |
| Page Header | `MmPageHeader`                      | 返回、标题、副标题、面包屑和操作插槽                                                   |
| Steps       | `MmSteps`                           | 横纵布局、状态、错误、可点击步骤和 ARIA                                                |
| Tabs        | `MmTabs`、`MmTabPane`               | line/card、禁用、lazy、受控值和方向键                                                  |

## 反馈（8）

| 组件        | 导入名                       | 核心能力                                       |
| ----------- | ---------------------------- | ---------------------------------------------- |
| Alert       | `MmAlert`                    | 类型、标题、描述、关闭、banner 与 live region  |
| Dialog      | `MmDialog`                   | Teleport、焦点陷阱、Escape、遮罩与焦点回退     |
| Drawer      | `MmDrawer`                   | 四方向、尺寸、遮罩、滚动锁定与焦点管理         |
| Loading     | `MmLoading`、`vMmLoading`    | 组件、局部指令、fullscreen 与清理              |
| Message     | `MmMessage`、`message`       | 组件、函数式队列、时长、关闭句柄与 live region |
| Message Box | `MmMessageBox`、`messageBox` | alert、confirm、prompt、Promise 与输入校验     |
| Popover     | `MmPopover`                  | placement、trigger、outside、Escape 和焦点回退 |
| Tooltip     | `MmTooltip`                  | hover/focus、延迟、禁用与 `aria-describedby`   |

## 其他（1）

| 组件    | 导入名      | 核心能力                            |
| ------- | ----------- | ----------------------------------- |
| Divider | `MmDivider` | 横向/纵向、文字位置、间距和语义分隔 |

## 默认插件

```ts
import MmUI, {
  enUS,
  install,
  useLocale,
  zhCN,
  type MmUILocaleName,
  type MmUILocaleSource,
  type MmUIOptions,
  type MmUIPlugin,
  type MmUITheme,
  type MmUIThemeColors,
} from "@work-gpt/6mm-ui";
```

- 默认导出 `MmUI`：向 Vue app 注册全部组件和 `v-mm-loading`。
- `install`：与默认插件相同的安装函数。
- `MmUIOptions`、`MmUITheme`、`MmUIThemeColors`：插件安装参数、明暗模式和语义主题色配置。
- `MmUILocaleName`、`MmUILocaleSource`：`zh-CN` / `en-US` 固定语言或响应式语言源类型。
- `zhCN`、`enUS`、`useLocale`：内置词典和当前组件库语言上下文。
- `MmUIPlugin`：插件公开类型。

## 函数式服务

| 导出                    | 说明                                   | 主要类型                                                     |
| ----------------------- | -------------------------------------- | ------------------------------------------------------------ |
| `message`               | info、success、warning、error 消息队列 | `MessageOptions`、`MessageHandler`、`MessageService`         |
| `messageBox`            | alert、confirm、prompt Promise 服务    | `MessageBoxOptions`、`MessageBoxResult`、`MessageBoxPromise` |
| `MessageBoxCancelError` | Message Box 取消/关闭错误类型          | class                                                        |

## 指令

| 导出                              | 模板名称       | 说明                                      |
| --------------------------------- | -------------- | ----------------------------------------- |
| `vMmLoading` / `loadingDirective` | `v-mm-loading` | boolean 或 Loading 配置对象驱动的局部遮罩 |

## Composables

包根入口同时导出以下组合式工具：

- `useClickOutside`
- `useControlled`
- `useEventListener`
- `useFloating`
- `useFocusTrap`
- `useFormField`
- `useId`
- `useLockScroll`
- `useLocale`
- `useMmProTable`
- `useRovingFocus`

这些工具的参数和返回类型与函数一起导出。`useMmProTable` 提供列表请求、分页/排序联动、竞态取消、重试和自动刷新；传入 `queryFields` 时会从字段默认值创建初始/重置筛选条件，返回的 `proTableBindings` 可直接通过 `v-bind` 连接 `MmProTable`。`useFormField` 主要供遵循 6MM FormItem 注入合同的自定义表单控件使用。

## 共享工具

包根入口还导出日期、文件、表单、命名空间与浮层管理工具，包括：

- 日期：`addDays`、`addMonths`、`buildCalendarMonth`、`formatDateValue`、`parseDateValue` 等。
- 查询：`cloneQueryBarValue`、`createQueryBarValue`、`materializeQueryBarValue`。
- 文件：`acceptsFile`、`createFileUid`、`formatFileSize`。
- 表单：`cloneFormValue`、`getPathValue`、`setPathValue` 及 Form 类型。
- 样式命名：`useNamespace`。
- 浮层：`acquireOverlay`。

共享工具属于低层 API。业务页面优先使用组件和服务，只有在扩展组件库能力时才直接依赖它们。

## 类型导入

每个组件入口的 props、值类型、事件相关数据结构都会从包根入口重新导出：

```ts
import type {
  AppHeaderAction,
  AppHeaderMetric,
  AppHeaderProfileItem,
  ButtonProps,
  DateRangeValue,
  FormExpose,
  FormRules,
  ProTableColumn,
  SelectOption,
  SidebarNavItem,
  TableColumn,
  TableRow,
  UploadFile,
  UploadRequest,
} from "@work-gpt/6mm-ui";
```

公开类型以生成后的 `dist/index.d.ts` 为准，消费项目的 `vue-tsc` 验证会直接读取该文件，而不是源码路径。
