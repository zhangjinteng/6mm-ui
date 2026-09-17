export const componentCategories = [
  "基础能力",
  "表单",
  "数据展示",
  "导航",
  "反馈",
  "其他",
] as const;
export type ComponentCategory = (typeof componentCategories)[number];
export interface ComponentCatalogItem {
  category: ComponentCategory;
  group: string;
  name: string;
}

export const componentCatalog: ComponentCatalogItem[] = [
  { category: "基础能力", group: "01", name: "Button" },
  { category: "基础能力", group: "01", name: "Border" },
  { category: "基础能力", group: "02", name: "Color" },
  { category: "基础能力", group: "05", name: "Container" },
  { category: "基础能力", group: "01", name: "Icon" },
  { category: "基础能力", group: "04", name: "Layout" },
  { category: "基础能力", group: "01", name: "Link" },
  { category: "基础能力", group: "03", name: "Text" },
  { category: "基础能力", group: "04", name: "Scrollbar" },
  { category: "基础能力", group: "04", name: "Space" },
  { category: "基础能力", group: "05", name: "Typography" },
  { category: "表单", group: "07", name: "Autocomplete" },
  { category: "表单", group: "06", name: "Checkbox" },
  { category: "表单", group: "07", name: "Date Picker Panel" },
  { category: "表单", group: "07", name: "Date Picker" },
  { category: "表单", group: "07", name: "Date Range Picker" },
  { category: "表单", group: "06", name: "Form" },
  { category: "表单", group: "06", name: "Input" },
  { category: "表单", group: "06", name: "Input Number" },
  { category: "表单", group: "07", name: "Filter Drawer" },
  { category: "表单", group: "07", name: "Query Bar" },
  { category: "表单", group: "06", name: "Radio" },
  { category: "表单", group: "07", name: "Select" },
  { category: "表单", group: "07", name: "Upload" },
  { category: "数据展示", group: "08", name: "Avatar" },
  { category: "数据展示", group: "08", name: "Badge" },
  { category: "数据展示", group: "11", name: "Calendar" },
  { category: "数据展示", group: "08", name: "Card" },
  { category: "数据展示", group: "10", name: "Collapse" },
  { category: "数据展示", group: "10", name: "Descriptions" },
  { category: "数据展示", group: "10", name: "Info Grid" },
  { category: "数据展示", group: "08", name: "Empty" },
  { category: "数据展示", group: "11", name: "Image" },
  { category: "数据展示", group: "11", name: "Pagination" },
  { category: "数据展示", group: "11", name: "Cursor Pagination" },
  { category: "数据展示", group: "09", name: "Progress" },
  { category: "数据展示", group: "11", name: "Pro Table" },
  { category: "数据展示", group: "11", name: "Pro Table Cursor Pagination" },
  { category: "数据展示", group: "11", name: "Pro Table Pagination" },
  { category: "数据展示", group: "09", name: "Result" },
  { category: "数据展示", group: "11", name: "Table" },
  { category: "数据展示", group: "08", name: "Tag" },
  { category: "数据展示", group: "09", name: "Statistic" },
  { category: "数据展示", group: "09", name: "Segmented" },
  { category: "导航", group: "12", name: "Dropdown" },
  { category: "导航", group: "13", name: "Menu" },
  { category: "导航", group: "13", name: "App Header" },
  { category: "导航", group: "13", name: "Sidebar Nav" },
  { category: "导航", group: "12", name: "Page Header" },
  { category: "导航", group: "12", name: "Steps" },
  { category: "导航", group: "13", name: "Tabs" },
  { category: "反馈", group: "14", name: "Alert" },
  { category: "反馈", group: "14", name: "Dialog" },
  { category: "反馈", group: "14", name: "Drawer" },
  { category: "反馈", group: "14", name: "Loading" },
  { category: "反馈", group: "14", name: "Message" },
  { category: "反馈", group: "14", name: "Message Box" },
  { category: "反馈", group: "07", name: "Popover" },
  { category: "反馈", group: "14", name: "Tooltip" },
  { category: "其他", group: "05", name: "Divider" },
];

const componentUsage: Record<string, string> = {
  Alert:
    '<MmAlert title="信息提示" description="常规状态说明。" type="info" show-icon />\n<MmAlert title="运行正常" description="主备节点延迟均低于 30ms。" type="success" show-icon />\n<MmAlert title="需要关注" description="保证金使用率接近阈值。" type="warning" show-icon />\n<MmAlert title="连接异常" description="行情连接已经中断。" type="error" show-icon />',
  Autocomplete:
    '<MmAutocomplete model-value="BTC-USDT" size="sm" :suggestions="[\'BTC-USDT\', \'ETH-USDT\']" />\n<MmAutocomplete model-value="BTC-USDT" size="md" :suggestions="[\'BTC-USDT\', \'ETH-USDT\']" />\n<MmAutocomplete model-value="BTC-USDT" size="lg" :suggestions="[\'BTC-USDT\', \'ETH-USDT\']" />',
  Avatar:
    '<MmAvatar fallback="LG" size="lg" />\n<MmAvatar fallback="MD" size="md" />\n<MmAvatar fallback="SM" size="sm" />\n<MmAvatar fallback="SQ" shape="square" size="lg" />',
  Badge:
    '<MmBadge :value="8" type="primary"><MmAvatar fallback="PR" /></MmBadge>\n<MmBadge dot type="success" aria-label="在线"><MmAvatar fallback="OK" /></MmBadge>\n<MmBadge :value="32" type="info"><MmAvatar fallback="IN" /></MmBadge>\n<MmBadge :value="6" type="warning"><MmAvatar fallback="WA" /></MmBadge>\n<MmBadge :max="99" :value="128" type="danger"><MmAvatar fallback="ER" /></MmBadge>',
  Border: '<MmBorder padding="16px" radius="md">内容区域</MmBorder>',
  Button:
    '<MmButton size="sm" variant="primary">保存配置</MmButton>\n<MmButton size="md" variant="primary">保存配置</MmButton>\n<MmButton size="lg" variant="primary">保存配置</MmButton>',
  Calendar: '<MmCalendar model-value="2026-07-16" displayed-month="2026-07" />',
  Card: '<MmCard title="策略状态" subtitle="最近更新 1 分钟前">运行正常</MmCard>',
  Checkbox:
    '<MmCheckbox :model-value="true" size="sm">API 通知</MmCheckbox>\n<MmCheckbox :model-value="true" size="md">API 通知</MmCheckbox>\n<MmCheckbox :model-value="true" size="lg">API 通知</MmCheckbox>',
  Collapse:
    '<MmCollapse :model-value="[\'risk\']">\n  <MmCollapseItem name="risk" title="风险约束">最大回撤 8%</MmCollapseItem>\n</MmCollapse>',
  Color:
    '<MmColor label="Primary" selectable show-value value="#087765" />\n<MmColor label="Success" selectable show-value value="#0b7651" />\n<MmColor label="Warning" selectable show-value value="#b45309" />\n<MmColor label="Danger" selectable show-value value="#c23838" />\n<MmColor label="Ink" selectable show-value value="#172033" />',
  Container: '<MmContainer :gutter="24" size="xl">页面内容</MmContainer>',
  "Cursor Pagination":
    '<MmCursorPagination :current-page="2" has-more size="sm" />\n<MmCursorPagination :current-page="2" has-more size="md" />\n<MmCursorPagination :current-page="2" has-more size="lg" />',
  "Date Picker":
    '<MmDatePicker model-value="2026-07-16" size="sm" trigger-variant="filter" />\n<MmDatePicker model-value="2026-07-16" size="md" trigger-variant="filter" />\n<MmDatePicker model-value="2026-07-16" size="lg" trigger-variant="filter" />',
  "Date Picker Panel":
    '<MmDatePickerPanel model-value="2026-07-16" displayed-month="2026-07" />',
  "Date Range Picker":
    "<MmDateRangePicker :model-value=\"['2026-07-01', '2026-07-16']\" />",
  Descriptions:
    '<MmDescriptions :column="1" bordered>\n  <MmDescriptionsItem label="状态">运行中</MmDescriptionsItem>\n</MmDescriptions>',
  "Info Grid":
    '<MmInfoGrid :columns="2" size="md">\n  <MmInfoGridItem label="用户 UID">5804991015</MmInfoGridItem>\n  <MmInfoGridItem label="用户类型">实盘</MmInfoGridItem>\n  <MmInfoGridItem label="仓位编号" :span="2">101184211</MmInfoGridItem>\n</MmInfoGrid>',
  Dialog:
    '<MmDialog :model-value="true" title="发布确认">确认发布当前策略？</MmDialog>',
  Divider: '<MmDivider label="策略参数" align="start" />',
  Drawer:
    '<MmDrawer :model-value="true" placement="right" title="运行详情">抽屉内容</MmDrawer>',
  Dropdown:
    '<MmDropdown :items="[{ label: \'编辑\', value: \'edit\' }]">\n  <template #trigger="{ triggerAttrs }"><MmButton v-bind="triggerAttrs">操作</MmButton></template>\n</MmDropdown>',
  Empty: '<MmEmpty description="暂无运行记录" />',
  "Filter Drawer":
    "<MmFilterDrawer\n  subtitle=\"在线账户\"\n  :fields=\"[{ key: 'keyword', label: '关键词', type: 'keyword' }, { defaultValue: 'all', key: 'userType', label: '用户类型', type: 'segmented', options: ['all', 'live', 'internal'] }]\"\n/>",
  Form: '<MmForm :model="{ name: \'\' }">\n  <MmFormItem label="策略名称"><MmInput placeholder="输入名称" /></MmFormItem>\n</MmForm>',
  Icon: '<MmIcon name="check" :size="16" />\n<MmIcon name="alert" :size="16" />\n<MmIcon name="calendar" :size="16" />\n<MmIcon name="search" :size="16" />\n<MmIcon name="settings" :size="16" />\n<MmIcon name="user" :size="16" />',
  Image: '<MmImage alt="账户权益曲线" preview src="/chart.png" />',
  Input:
    '<MmInput model-value="网格策略 #2048" size="sm" />\n<MmInput model-value="网格策略 #2048" size="md" />\n<MmInput model-value="网格策略 #2048" size="lg" />',
  "Input Number":
    '<MmInputNumber :model-value="10" size="sm" />\n<MmInputNumber :model-value="10" size="md" />\n<MmInputNumber :model-value="10" size="lg" />',
  Layout: '<MmLayout direction="row" :gap="12">布局内容</MmLayout>',
  Link: '<MmLink href="#" tone="primary">Primary</MmLink>\n<MmLink href="#">Default</MmLink>\n<MmLink href="#" tone="muted">Muted</MmLink>\n<MmLink href="#" tone="danger">Danger</MmLink>',
  Loading: '<MmLoading :visible="true" text="正在加载" />',
  Menu: '<MmMenu model-value="overview">\n  <MmMenuItem value="overview">运行概览</MmMenuItem>\n</MmMenu>',
  "App Header":
    "<MmAppHeader\n  page-title=\"在线账户\"\n  summary-label=\"商户保证金数据\"\n  :brand=\"{ alt: '6MM', logo: '/logo.svg', title: '管理后台' }\"\n  :metrics=\"[{ key: 'available', label: '可用', value: '9,787,646.35' }, { key: 'total', label: '总保证金', tone: 'primary', value: '9,949,771.34' }]\"\n  :context-actions=\"[{ key: 'deposit', label: '充值', icon: 'arrow-up-to-line', tone: 'primary' }]\"\n  :identity=\"{ label: '商户', tone: 'merchant' }\"\n  :profile=\"{ alt: '管理员', fallback: '管' }\"\n/>",
  "Sidebar Nav":
    "<MmSidebarNav\n  model-value=\"online-accounts\"\n  :open-keys=\"['users']\"\n  :items=\"[{ key: 'users', label: '用户管理', icon: 'users', children: [{ key: 'online-accounts', label: '在线账户', icon: 'users-round' }] }]\"\n>\n  <template #brand=\"{ collapsed }\">{{ collapsed ? '6' : '6MM 管理后台' }}</template>\n  <template #footer=\"{ collapsed }\">{{ collapsed ? '7.3K' : '在线用户 7,320' }}</template>\n</MmSidebarNav>",
  Message:
    '<MmMessage :duration="0" message="普通信息提示" type="info" />\n<MmMessage :duration="0" message="配置保存成功" type="success" />\n<MmMessage :duration="0" message="保证金接近阈值" type="warning" />\n<MmMessage :duration="0" message="请求执行失败" type="error" />',
  "Message Box":
    '<MmMessageBox :model-value="true" message="确认执行该操作？" title="操作确认" type="confirm" />',
  "Page Header":
    '<MmPageHeader show-back subtitle="BTC-USDT-PERP" title="网格策略 #2048" />',
  Pagination:
    '<MmPagination :current-page="1" :page-size="20" size="sm" :total="128" />\n<MmPagination :current-page="1" :page-size="20" size="md" :total="128" />\n<MmPagination :current-page="1" :page-size="20" size="lg" :total="128" />',
  Popover:
    '<MmPopover placement="bottom" :width="240">\n  <MmButton>查看说明</MmButton>\n  <template #content>弹出内容</template>\n</MmPopover>',
  Progress:
    '<MmProgress :percentage="42" />\n<MmProgress :percentage="76" status="success" />\n<MmProgress :percentage="63" status="warning" />\n<MmProgress :percentage="28" status="error" />',
  "Pro Table":
    "<MmProTable\n  :columns=\"[{ dataIndex: 'name', key: 'name', title: '策略' }, { dataIndex: 'status', key: 'status', title: '状态' }]\"\n  :data=\"[{ id: 1, name: '网格 #2048', status: 'RUNNING' }]\"\n  row-key=\"id\"\n  :total=\"1\"\n/>",
  "Pro Table Cursor Pagination":
    '<MmProTableCursorPagination :current-page="2" has-more :page-size="15" :row-count="7" />',
  "Pro Table Pagination":
    '<MmProTablePagination :current-page="1" :page-size="15" :page-sizes="[15, 30]" />',
  "Query Bar":
    "<MmQueryBar :fields=\"[{ key: 'keyword', label: '关键词', type: 'keyword' }, { key: 'status', label: '状态', type: 'segmented', options: ['全部', '在线'] }]\" />",
  Radio:
    '<MmRadio model-value="maker" size="sm" value="maker">Maker</MmRadio>\n<MmRadio model-value="maker" size="md" value="maker">Maker</MmRadio>\n<MmRadio model-value="maker" size="lg" value="maker">Maker</MmRadio>',
  Result:
    '<MmResult status="success" title="校验通过" subtitle="配置可以安全发布" />',
  Scrollbar: '<MmScrollbar always :height="240">可滚动内容</MmScrollbar>',
  Segmented:
    "<MmSegmented :model-value=\"'24h'\" :options=\"['24h', '7d', '30d']\" size=\"sm\" />\n<MmSegmented :model-value=\"'24h'\" :options=\"['24h', '7d', '30d']\" size=\"md\" />\n<MmSegmented :model-value=\"'24h'\" :options=\"['24h', '7d', '30d']\" size=\"lg\" />",
  Select:
    '<MmSelect model-value="running" size="sm" :options="[{ label: \'运行中\', value: \'running\' }]" />\n<MmSelect model-value="running" size="md" :options="[{ label: \'运行中\', value: \'running\' }]" />\n<MmSelect model-value="running" size="lg" :options="[{ label: \'运行中\', value: \'running\' }]" />',
  Space: '<MmSpace :size="8"><span>项目 A</span><span>项目 B</span></MmSpace>',
  Statistic:
    '<MmStatistic title="账户净值" :value="82430.5" :precision="2" prefix="¥" trend="up" />\n<MmStatistic title="最大回撤" :value="8.24" :precision="2" suffix="%" trend="down" />\n<MmStatistic title="活动策略" :value="12" trend="neutral" />',
  Steps:
    "<MmSteps :current=\"1\" :items=\"[{ title: '配置锁定' }, { title: '风险复核' }, { title: '执行上线' }]\" />",
  Table:
    "<MmTable :columns=\"[{ key: 'name', dataIndex: 'name', title: '策略' }]\" :data=\"[{ id: 1, name: '网格 #2048' }]\" row-key=\"id\" />",
  Tabs: '<MmTabs model-value="summary">\n  <MmTabPane name="summary" label="运行摘要">面板内容</MmTabPane>\n</MmTabs>',
  Tag: '<MmTag type="default">DEFAULT</MmTag>\n<MmTag type="primary">PRIMARY</MmTag>\n<MmTag type="success">SUCCESS</MmTag>\n<MmTag type="info">INFO</MmTag>\n<MmTag type="warning">WARNING</MmTag>\n<MmTag type="danger">DANGER</MmTag>',
  Text: '<MmText size="sm" tone="primary">账户总览 ¥82,430.18</MmText>\n<MmText size="md" tone="primary">账户总览 ¥82,430.18</MmText>\n<MmText size="lg" tone="primary">账户总览 ¥82,430.18</MmText>',
  Tooltip:
    '<MmTooltip content="查看策略详情">\n  <template #default="{ triggerAttrs }"><MmButton v-bind="triggerAttrs">悬停查看</MmButton></template>\n</MmTooltip>',
  Typography:
    '<MmTypography copyable title="接口签名说明">请求必须携带签名。</MmTypography>',
  Upload: '<MmUpload accept=".json,.csv" drag :limit="2" />',
};

const componentExtraImports: Record<string, string[]> = {
  Badge: ["MmAvatar"],
  Collapse: ["MmCollapseItem"],
  Descriptions: ["MmDescriptionsItem"],
  "Info Grid": ["MmInfoGridItem"],
  Dropdown: ["MmButton"],
  Form: ["MmFormItem", "MmInput"],
  Menu: ["MmMenuItem"],
  Popover: ["MmButton"],
  Tabs: ["MmTabPane"],
  Tooltip: ["MmButton"],
};

const catalogGroupLabels: Record<string, string> = {
  "01": "动作、图标与链接",
  "02": "语义色与对比度",
  "03": "文本层级",
  "04": "布局与滚动",
  "05": "内容容器与排版",
  "06": "表单与字段选择",
  "07": "复合输入与浮层",
  "08": "身份与状态展示",
  "09": "指标与结果反馈",
  "10": "结构化信息披露",
  "11": "数据、媒体与日期",
  "12": "页面导航与流程",
  "13": "工作区导航",
  "14": "反馈与遮罩",
};

export interface ComponentTechnicalDetails extends ComponentCatalogItem {
  anchor: string;
  componentName: string;
  description: string;
  example: string;
}

export function componentAnchor(name: string): string {
  return `component-${name.toLowerCase().replaceAll(" ", "-")}`;
}

export function getComponentTechnicalDetails(
  item: ComponentCatalogItem,
): ComponentTechnicalDetails {
  const componentName = `Mm${item.name.replaceAll(" ", "")}`;
  const imports = [componentName, ...(componentExtraImports[item.name] ?? [])];
  const usage = componentUsage[item.name] ?? `<${componentName} />`;
  const indentedUsage = usage
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

  return {
    ...item,
    anchor: componentAnchor(item.name),
    componentName,
    description: `${item.name} 属于${item.category}组件，当前示例覆盖${catalogGroupLabels[item.group]}场景。`,
    example: `<script setup lang="ts">\nimport { ${imports.join(", ")} } from '@work-gpt/6mm-ui'\nimport '@work-gpt/6mm-ui/style.css'\n</script>\n\n<template>\n${indentedUsage}\n</template>`,
  };
}

export const componentTechnicalDetails = componentCatalog.map(
  getComponentTechnicalDetails,
);
