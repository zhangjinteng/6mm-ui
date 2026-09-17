<template>
  <section class="mm-symbol-tag-manager">
    <MmProTable
      :aria-label="copy.tableAria"
      :columns="columns"
      columns-configurable
      :data="visibleRows"
      :empty-text="copy.noData"
      :error="pageError"
      filter-drawer
      :filter-drawer-subtitle="copy.filterSubtitle"
      :filter-drawer-title="copy.filterTitle"
      :filters="filters"
      fill-height
      :inline-query-field-keys="['keyword', 'parent_id', 'is_enable']"
      :loading="loading"
      :query-fields="queryFields"
      row-key="id"
      show-cell-title
      :show-pagination="false"
      :total="visibleRows.length"
      @query="handleQuery"
      @refresh="load"
      @reset="handleReset"
      @update:filters="filters = $event"
    >
      <template #toolbar-actions>
        <MmButton v-if="canCreate" :aria-label="copy.add" size="sm" variant="primary" @click="openCreate(0)">
          <template #icon><MmIcon name="plus" :size="14" /></template>{{ copy.add }}
        </MmButton>
        <MmButton size="sm" @click="toggleAll">
          <template #icon><MmIcon :name="isAllExpanded ? 'chevron-up' : 'chevron-down'" :size="14" /></template>
          {{ isAllExpanded ? copy.collapseAll : copy.expandAll }}
        </MmButton>
      </template>

      <template #cell-tag_name="{ row }">
        <div class="mm-symbol-tag-manager__name" :style="{ paddingLeft: `${row._level * 18}px` }">
          <button
            v-if="row._hasChildren"
            class="mm-symbol-tag-manager__toggle"
            type="button"
            :aria-label="row._expanded ? copy.collapseTag : copy.expandTag"
            @click.stop="toggleRow(row)"
          >
            <MmIcon :name="row._expanded ? 'chevron-down' : 'chevron-right'" :size="14" />
          </button>
          <span v-else-if="row._level > 0" class="mm-symbol-tag-manager__branch">
            <MmIcon name="tree-branch" :size="18" :stroke-width="1" />
          </span>
          <span v-else class="mm-symbol-tag-manager__spacer"></span>
          <span>{{ row.tag_name || '-' }}</span>
        </div>
      </template>
      <template #cell-tag_code="{ row }">
        <MmTag v-if="row.tag_code" effect="soft" size="sm" type="info">{{ row.tag_code }}</MmTag>
        <span v-else>-</span>
      </template>
      <template #cell-is_enable="{ row }">
        <MmTag :type="Number(row.is_enable) === 1 ? 'success' : 'danger'" effect="soft" round size="sm">
          {{ Number(row.is_enable) === 1 ? copy.enabled : copy.disabled }}
        </MmTag>
      </template>
      <template #cell-actions="{ row }">
        <div class="mm-symbol-tag-manager__actions">
          <MmButton icon-only :aria-label="copy.detail" size="sm" :title="copy.detail" @click.stop="openDetail(row)">
            <template #icon><MmIcon name="panel-left-close" :size="15" /></template>
          </MmButton>
        </div>
      </template>
    </MmProTable>

    <MmDrawer v-model="detailVisible" :aria-label="copy.detail" placement="right" :size="500" @closed="detailRow = null">
      <template #header>
        <div class="mm-symbol-tag-manager__drawer-title">
          <strong>{{ copy.detail }}</strong>
          <span>{{ detailName }} · {{ detailRow?.id ?? '-' }}</span>
        </div>
      </template>
      <div v-if="detailRow" class="mm-symbol-tag-manager__drawer-content">
        <MmDescriptions class="mm-symbol-tag-manager__descriptions" :title="copy.tagInfo" :column="1" bordered size="sm">
          <MmDescriptionsItem :label="copy.tagId">{{ detailRow.id }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.parent">{{ detailParentName }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.name">{{ displayText(detailRow.tag_name) }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.code">{{ displayText(detailRow.tag_code) }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.zhName">{{ displayText(detailRow.tag_name_zh) }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.enName">{{ displayText(detailRow.tag_name_en) }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.sort">{{ displayText(detailRow.sort) }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.pairCount">{{ displayText(detailRow.symbol_count) }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.status">{{ Number(detailRow.is_enable) === 1 ? copy.enabled : copy.disabled }}</MmDescriptionsItem>
          <MmDescriptionsItem :label="copy.updatedAt">{{ formatDateTime(detailRow.updated_at) }}</MmDescriptionsItem>
        </MmDescriptions>

        <section class="mm-symbol-tag-manager__drawer-actions" :aria-label="copy.availableActions">
          <h3>{{ copy.availableActions }}</h3>
          <div>
            <button v-if="canCreate && Number(detailRow.parent_id) === 0" type="button" @click="runDetailAction('add-child')">
              <MmIcon name="plus" :size="15" /><span>{{ copy.addChild }}</span><MmIcon name="chevron-right" :size="15" />
            </button>
            <button v-if="canUpdate" type="button" @click="runDetailAction('toggle-status')">
              <MmIcon :name="Number(detailRow.is_enable) === 1 ? 'eye-off' : 'eye'" :size="15" />
              <span>{{ Number(detailRow.is_enable) === 1 ? copy.hideTag : copy.showTag }}</span>
              <MmIcon name="chevron-right" :size="15" />
            </button>
            <button v-if="canUpdate" type="button" @click="runDetailAction('edit')">
              <MmIcon name="square-pen" :size="15" /><span>{{ copy.edit }}</span><MmIcon name="chevron-right" :size="15" />
            </button>
            <button v-if="translationConfigActions" type="button" @click="runDetailAction('translation-config')">
              <MmIcon name="globe" :size="15" /><span>{{ locale.toLowerCase().startsWith('en') ? 'Google Translate Configuration' : 'Google 翻译配置' }}</span><MmIcon name="chevron-right" :size="15" />
            </button>
            <button v-if="canDelete" class="is-danger" type="button" @click="runDetailAction('delete')">
              <MmIcon name="trash-2" :size="15" /><span>{{ copy.delete }}</span><MmIcon name="chevron-right" :size="15" />
            </button>
          </div>
        </section>
      </div>
      <template #footer><MmButton @click="detailVisible = false">{{ copy.close }}</MmButton></template>
    </MmDrawer>

    <MmDialog
      v-model="dialog.visible"
      :close-on-click-modal="false"
      :show-close="!dialog.saving"
      :title="dialog.editingId ? copy.dialogEdit : copy.dialogCreate"
      width="600px"
      @close="resetForm"
    >
      <MmAlert v-if="formError" closable :title="formError" type="error" @close="formError = ''" />
      <MmForm ref="formRef" :model="form" :rules="formRules" label-width="100px" @submit.prevent="save">
        <MmFormItem :label="copy.parent" prop="parent_id">
          <MmSelect v-model="form.parent_id" :disabled="dialog.saving" :options="parentDialogOptions" :placeholder="copy.parent" />
        </MmFormItem>
        <MmFormItem :label="copy.name" prop="tag_name" required>
          <MmInput v-model="form.tag_name" :disabled="dialog.saving" :maxlength="255" :placeholder="copy.name" />
        </MmFormItem>
        <MmFormItem :label="copy.code" prop="tag_code" required>
          <MmInput v-model="form.tag_code" :disabled="dialog.saving" :maxlength="64" :placeholder="copy.code" @update:model-value="normalizeCode" />
        </MmFormItem>
        <MmFormItem :label="copy.zhName" prop="tag_name_zh" required>
          <MmInput v-model="form.tag_name_zh" :disabled="dialog.saving" :maxlength="255" :placeholder="copy.zhName" />
        </MmFormItem>
        <MmFormItem :label="copy.enName" prop="tag_name_en" required>
          <MmInput v-model="form.tag_name_en" :disabled="dialog.saving" :maxlength="255" :placeholder="copy.enName" />
        </MmFormItem>
        <MmFormItem :label="copy.sort" prop="sort" required>
          <MmInputNumber v-model="form.sort" :disabled="dialog.saving" :max="999999" :min="0" />
        </MmFormItem>
        <MmFormItem :label="copy.status" prop="is_enable" required>
          <MmRadioGroup v-model="form.is_enable">
            <MmRadio :value="1">{{ copy.enabled }}</MmRadio>
            <MmRadio :value="0">{{ copy.disabled }}</MmRadio>
          </MmRadioGroup>
        </MmFormItem>
      </MmForm>
      <template #footer>
        <div class="mm-symbol-tag-manager__dialog-footer">
          <MmButton size="sm" :disabled="dialog.saving" @click="dialog.visible = false">{{ copy.cancel }}</MmButton>
          <MmButton size="sm" :loading="dialog.saving" variant="primary" @click="save">{{ copy.confirm }}</MmButton>
        </div>
      </template>
    </MmDialog>

    <TranslationConfigDialog
      v-if="translationConfigActions"
      v-model="translationConfigVisible"
      :actions="translationConfigActions"
      :locale="locale"
    />

    <MmMessageBox
      v-model="deleteVisible"
      :cancel-button-text="copy.cancel"
      :confirm-button-text="copy.delete"
      :message="deleteMessage"
      :title="copy.deleteTitle"
      type="confirm"
      @action="handleDeleteAction"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, shallowRef } from "vue";
import MmAlert from "../alert/Alert.vue";
import MmButton from "../button/Button.vue";
import MmDescriptions from "../descriptions/Descriptions.vue";
import MmDescriptionsItem from "../descriptions/DescriptionsItem.vue";
import MmDialog from "../dialog/Dialog.vue";
import MmDrawer from "../drawer/Drawer.vue";
import MmForm from "../form/Form.vue";
import MmFormItem from "../form/FormItem.vue";
import type { FormExpose } from "../form";
import MmIcon from "../icon/Icon.vue";
import MmInput from "../input/Input.vue";
import MmInputNumber from "../input-number/InputNumber.vue";
import MmMessageBox from "../message-box/MessageBox.vue";
import type { MessageBoxAction } from "../message-box";
import MmProTable from "../pro-table/ProTable.vue";
import type { ProTableColumn } from "../pro-table";
import type { QueryBarField, QueryBarValue } from "../query-bar";
import MmRadio from "../radio/Radio.vue";
import MmRadioGroup from "../radio/RadioGroup.vue";
import MmSelect from "../select/Select.vue";
import type { SelectOption } from "../select";
import type { TableKey, TableRow } from "../table";
import MmTag from "../tag/Tag.vue";
import type { FormRules } from "../../shared/form";
import type { SymbolTagActionName, SymbolTagFormValue, SymbolTagManagerLabels, SymbolTagManagerProps, SymbolTagRow } from "./types";
import TranslationConfigDialog from "./TranslationConfigDialog.vue";

defineOptions({ name: "MmSymbolTagManager" });

const props = withDefaults(defineProps<SymbolTagManagerProps>(), {
  canCreate: true,
  canDelete: true,
  canUpdate: true,
  labels: () => ({}),
  locale: "zh-CN",
});
const emit = defineEmits<{
  "action-error": [action: SymbolTagActionName, error: unknown];
  "action-success": [action: Exclude<SymbolTagActionName, "list">, row?: SymbolTagRow];
}>();

const zh: SymbolTagManagerLabels = {
  actions: "操作", add: "新增", addChild: "新增子标签", all: "全部", availableActions: "可用操作", cancel: "取消", childTag: "子标签", close: "关闭",
  code: "标签编码", codeHint: "仅支持小写字母、数字和下划线", collapseAll: "全部折叠", collapseTag: "折叠标签", confirm: "确定", delete: "删除标签",
  deleteConfirm: "确认删除标签“{name}”？", deleteDescription: "删除后，当前标签及其关联关系将立即失效，此操作不可撤销。", deleteTitle: "删除标签",
  detail: "查看标签详情", dialogCreate: "添加标签", dialogEdit: "修改标签", dialogSubtitleCreate: "", dialogSubtitleEdit: "", disabled: "隐藏", display: "显示状态",
  displayHint: "", edit: "编辑标签", enabled: "显示", enName: "英文名称", expandAll: "全部展开", expandTag: "展开标签", filterSubtitle: "可按标签名称、父级标签和状态组合筛选",
  filterTitle: "筛选交易对标签", hideTag: "隐藏标签", invalidCode: "仅支持小写字母、数字、下划线", loadingDescription: "正在准备当前查询的数据，请稍候。",
  loadingTitle: "正在加载数据", name: "标签名称", nameHint: "", noData: "暂无交易对标签", notice: "", pairCount: "交易对数量", pairHint: "", parent: "父级标签",
  parentFilter: "父级标签", parentHint: "", query: "查询", refresh: "刷新", required: "请完整填写必填项", reset: "重置", rootOnly: "根标签", rootOption: "根标签",
  rootTag: "根标签", save: "保存", searchPlaceholder: "名称 / 编码", showTag: "显示标签", sort: "排序", sortHint: "", status: "状态", statusFilter: "状态",
  tableAria: "交易对标签", tagId: "标签 ID", tagInfo: "标签信息", total: "", translation: "", translationCount: "", updatedAt: "更新时间", zhName: "中文名称",
};
const en: SymbolTagManagerLabels = {
  actions: "Actions", add: "Add", addChild: "Add Child Tag", all: "All", availableActions: "Available Actions", cancel: "Cancel", childTag: "Child Tag", close: "Close",
  code: "Tag Code", codeHint: "Lowercase letters, numbers, and underscores only", collapseAll: "Collapse All", collapseTag: "Collapse Tag", confirm: "Confirm", delete: "Delete Tag",
  deleteConfirm: "Delete tag “{name}”?", deleteDescription: "The tag and its associations will be removed immediately. This action cannot be undone.", deleteTitle: "Delete Tag",
  detail: "View Tag Details", dialogCreate: "Add Tag", dialogEdit: "Edit Tag", dialogSubtitleCreate: "", dialogSubtitleEdit: "", disabled: "Hidden", display: "Status",
  displayHint: "", edit: "Edit Tag", enabled: "Visible", enName: "English Name", expandAll: "Expand All", expandTag: "Expand Tag", filterSubtitle: "Filter by tag name, parent, and status",
  filterTitle: "Filter Trading Pair Tags", hideTag: "Hide Tag", invalidCode: "Lowercase letters, numbers, and underscores only", loadingDescription: "Preparing data for the current query.",
  loadingTitle: "Loading Data", name: "Tag Name", nameHint: "", noData: "No trading pair tags", notice: "", pairCount: "Trading Pairs", pairHint: "", parent: "Parent Tag",
  parentFilter: "Parent Tag", parentHint: "", query: "Search", refresh: "Refresh", required: "Complete all required fields", reset: "Reset", rootOnly: "Root Tag", rootOption: "Root Tag",
  rootTag: "Root Tag", save: "Save", searchPlaceholder: "Name / Code", showTag: "Show Tag", sort: "Sort", sortHint: "", status: "Status", statusFilter: "Status",
  tableAria: "Trading Pair Tags", tagId: "Tag ID", tagInfo: "Tag Information", total: "", translation: "", translationCount: "", updatedAt: "Updated At", zhName: "Chinese Name",
};

const copy = computed(() => ({ ...(props.locale.toLowerCase().startsWith("en") ? en : zh), ...props.labels }));
type TagRow = SymbolTagRow & TableRow & { children?: TagRow[] };
type VisibleTagRow = TagRow & { _expanded: boolean; _hasChildren: boolean; _level: number };
type DetailAction = "add-child" | "delete" | "edit" | "toggle-status" | "translation-config";

const rows = ref<TagRow[]>([]);
const filters = ref<QueryBarValue>(defaultFilters());
const loading = ref(false);
const pageError = ref("");
const expandedKeys = ref<Set<TableKey>>(new Set());
const detailVisible = ref(false);
const translationConfigVisible = ref(false);
const detailRow = shallowRef<VisibleTagRow | null>(null);
const deleteVisible = ref(false);
const deleteTarget = shallowRef<TagRow>();
const formError = ref("");
const formRef = shallowRef<FormExpose>();
const dialog = reactive({ visible: false, saving: false, editingId: 0 });
const form = reactive<SymbolTagFormValue>(newForm());

const columns = computed<ProTableColumn<VisibleTagRow>[]>(() => [
  { align: "left", hideable: false, key: "tag_name", title: copy.value.name, width: 260 },
  { align: "left", key: "tag_code", title: copy.value.code, width: 200 },
  { align: "left", dataIndex: "tag_name_zh", key: "tag_name_zh", title: copy.value.zhName, width: 200, formatter: displayText },
  { align: "left", dataIndex: "tag_name_en", key: "tag_name_en", title: copy.value.enName, width: 200, formatter: displayText },
  { align: "left", dataIndex: "sort", key: "sort", title: copy.value.sort, width: 200, formatter: displayText },
  { align: "left", dataIndex: "symbol_count", key: "symbol_count", title: copy.value.pairCount, width: 200, formatter: displayText },
  { align: "left", key: "is_enable", title: copy.value.status, width: 90 },
  { align: "left", dataIndex: "updated_at", key: "updated_at", title: copy.value.updatedAt, width: 200, formatter: formatDateTime },
  { align: "center", fixed: "right", hideable: false, key: "actions", title: copy.value.actions, width: 56 },
]);

const rootRows = computed(() => rows.value.filter((item) => Number(item.parent_id) === 0));
const parentFilterOptions = computed<SelectOption[]>(() => [
  { label: props.locale.toLowerCase().startsWith("en") ? "All Parents" : "全部父级", value: "" },
  { label: copy.value.rootOption, value: "0" },
  ...rootRows.value.map((item) => ({ label: item.tag_name_zh || item.tag_name || item.tag_code, value: String(item.id) })),
]);
const parentDialogOptions = computed<SelectOption[]>(() => [
  { label: copy.value.rootOption, value: 0 },
  ...rootRows.value.filter((item) => item.id !== dialog.editingId).map((item) => ({ label: item.tag_name_zh || item.tag_name || item.tag_code, value: item.id })),
]);
const queryFields = computed<QueryBarField[]>(() => [
  { clearable: true, defaultValue: "", key: "keyword", label: copy.value.name, placeholder: copy.value.searchPlaceholder, type: "keyword", width: 210 },
  { defaultValue: "", key: "parent_id", label: copy.value.parentFilter, options: parentFilterOptions.value, type: "select", width: 200 },
  { defaultValue: "", key: "is_enable", label: copy.value.statusFilter, options: [
    { label: props.locale.toLowerCase().startsWith("en") ? "All Statuses" : "全部状态", value: "" },
    { label: copy.value.enabled, value: "1" }, { label: copy.value.disabled, value: "0" },
  ], type: "select", width: 150 },
]);

const treeRows = computed(() => buildTree(rows.value));
const normalizedFilters = computed(() => ({
  keyword: String(filters.value.keyword || "").toLowerCase(),
  parent_id: String(filters.value.parent_id ?? ""),
  is_enable: String(filters.value.is_enable ?? ""),
}));
const filteredRows = computed(() => filterTree(treeRows.value));
const expandableKeys = computed<TableKey[]>(() => {
  const keys: TableKey[] = [];
  const collect = (items: TagRow[]) => items.forEach((item) => {
    if (childrenOf(item).length) { keys.push(item.id); collect(childrenOf(item)); }
  });
  collect(filteredRows.value);
  return keys;
});
const isAllExpanded = computed(() => expandableKeys.value.length > 0 && expandableKeys.value.every((key) => expandedKeys.value.has(key)));
const visibleRows = computed(() => flatten(filteredRows.value));
const detailName = computed(() => displayText(detailRow.value?.tag_name_zh || detailRow.value?.tag_name || detailRow.value?.tag_code));
const detailParentName = computed(() => {
  if (!detailRow.value || Number(detailRow.value.parent_id) === 0) return copy.value.rootOption;
  const parent = rows.value.find((item) => String(item.id) === String(detailRow.value?.parent_id));
  return displayText(parent?.tag_name_zh || parent?.tag_name || parent?.tag_code);
});
const deleteMessage = computed(() => deleteTarget.value
  ? `${format(copy.value.deleteConfirm, { name: deleteTarget.value.tag_name_zh || deleteTarget.value.tag_name || deleteTarget.value.tag_code })} ${copy.value.deleteDescription}`
  : "");
const formRules = computed<FormRules>(() => ({
  tag_name: [{ required: true, message: `${copy.value.required}: ${copy.value.name}`, trigger: "blur" }],
  tag_code: [
    { required: true, message: `${copy.value.required}: ${copy.value.code}`, trigger: "blur" },
    { pattern: /^[a-z0-9_]+$/, message: copy.value.invalidCode, trigger: "blur" },
  ],
  tag_name_zh: [{ required: true, message: `${copy.value.required}: ${copy.value.zhName}`, trigger: "blur" }],
  tag_name_en: [{ required: true, message: `${copy.value.required}: ${copy.value.enName}`, trigger: "blur" }],
  sort: [{ required: true, message: `${copy.value.required}: ${copy.value.sort}`, trigger: "blur" }],
  is_enable: [{ required: true, message: `${copy.value.required}: ${copy.value.status}`, trigger: "change" }],
}));

function defaultFilters(): QueryBarValue { return { keyword: "", parent_id: "", is_enable: "" }; }
function newForm(): SymbolTagFormValue { return { parent_id: 0, sort: 1000, tag_name: "", tag_code: "", tag_name_zh: "", tag_name_en: "", is_enable: 1 }; }
function displayText(value: unknown): string { return value === null || value === undefined || value === "" ? "-" : String(value); }
function format(template: string, values: Record<string, string | number>): string {
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, String(value)), template);
}
function formatDateTime(value: unknown): string {
  if (!value) return "-";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return String(value);
  const parts = new Intl.DateTimeFormat("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value || "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}
function errorMessage(error: unknown): string { return error instanceof Error && error.message ? error.message : String(error || copy.value.loadingTitle); }
function childrenOf(row: TagRow): TagRow[] { return Array.isArray(row.children) ? row.children : []; }
function buildTree(data: TagRow[]): TagRow[] {
  const map = new Map<number, TagRow>();
  const roots: TagRow[] = [];
  data.forEach((item) => map.set(Number(item.id), { ...item, children: [] }));
  map.forEach((item) => {
    const parent = map.get(Number(item.parent_id));
    if (parent && item.id !== parent.id) parent.children?.push(item);
    else roots.push(item);
  });
  return roots;
}
function filterTree(items: TagRow[]): TagRow[] {
  return items.reduce<TagRow[]>((result, row) => {
    const allChildren = childrenOf(row);
    const children = filterTree(allChildren);
    const text = `${row.tag_name || ""} ${row.tag_code || ""} ${row.tag_name_zh || ""} ${row.tag_name_en || ""}`.toLowerCase();
    const keywordMatch = !normalizedFilters.value.keyword || text.includes(normalizedFilters.value.keyword);
    const statusMatch = !normalizedFilters.value.is_enable || String(row.is_enable) === normalizedFilters.value.is_enable;
    const selectedParent = normalizedFilters.value.parent_id;
    const parentMatch = !selectedParent || String(row.parent_id) === selectedParent || String(row.id) === selectedParent;
    if ((keywordMatch && statusMatch && parentMatch) || children.length) {
      result.push({ ...row, children: keywordMatch && statusMatch && (!selectedParent || String(row.id) === selectedParent) ? allChildren : children });
    }
    return result;
  }, []);
}
function flatten(items: TagRow[], level = 0): VisibleTagRow[] {
  return items.flatMap((row) => {
    const children = childrenOf(row);
    const expanded = expandedKeys.value.has(row.id);
    const current: VisibleTagRow = { ...row, _expanded: expanded, _hasChildren: children.length > 0, _level: level };
    return expanded ? [current, ...flatten(children, level + 1)] : [current];
  });
}
function toggleRow(row: VisibleTagRow) {
  const next = new Set(expandedKeys.value);
  next.has(row.id) ? next.delete(row.id) : next.add(row.id);
  expandedKeys.value = next;
}
function toggleAll() { expandedKeys.value = isAllExpanded.value ? new Set() : new Set(expandableKeys.value); }
function handleQuery(value: QueryBarValue) { filters.value = { ...defaultFilters(), ...value }; expandedKeys.value = new Set(expandableKeys.value); }
function handleReset(value: QueryBarValue) { filters.value = { ...defaultFilters(), ...value }; expandedKeys.value = new Set(expandableKeys.value); }
async function load() {
  loading.value = true;
  pageError.value = "";
  try {
    const result = await props.actions.list({});
    rows.value = Array.isArray(result?.lists) ? result.lists.map((item) => ({ ...item })) : [];
    expandedKeys.value = new Set(expandableKeys.value);
  } catch (error) {
    pageError.value = errorMessage(error);
    emit("action-error", "list", error);
  } finally { loading.value = false; }
}
function openDetail(row: VisibleTagRow) { detailRow.value = row; detailVisible.value = true; }
function resetForm() { Object.assign(form, newForm()); formError.value = ""; formRef.value?.clearValidate(); }
function openCreate(parentId: number) { dialog.editingId = 0; resetForm(); form.parent_id = parentId; dialog.visible = true; }
function openEdit(row: TagRow) {
  dialog.editingId = row.id;
  Object.assign(form, { parent_id: row.parent_id, sort: row.sort, tag_name: row.tag_name, tag_code: row.tag_code, tag_name_zh: row.tag_name_zh, tag_name_en: row.tag_name_en, is_enable: row.is_enable });
  formError.value = "";
  dialog.visible = true;
}
function normalizeCode(value: unknown) { form.tag_code = String(value || "").trim().toLowerCase().replace(/[^a-z0-9_]/g, ""); }
async function save() {
  if (dialog.saving || !(await formRef.value?.validate())) return;
  dialog.saving = true;
  formError.value = "";
  const payload: SymbolTagFormValue = { ...form, parent_id: Number(form.parent_id || 0), sort: Number(form.sort), tag_name: form.tag_name.trim(), tag_code: form.tag_code.trim(), tag_name_zh: form.tag_name_zh.trim(), tag_name_en: form.tag_name_en.trim(), is_enable: Number(form.is_enable) };
  try {
    if (dialog.editingId) { await props.actions.update(dialog.editingId, payload); emit("action-success", "update"); }
    else { await props.actions.create(payload); emit("action-success", "create"); }
    dialog.visible = false;
    await load();
  } catch (error) {
    formError.value = errorMessage(error);
    emit("action-error", dialog.editingId ? "update" : "create", error);
  } finally { dialog.saving = false; }
}
async function toggleStatus(row: TagRow) {
  try {
    await props.actions.update(row.id, { parent_id: row.parent_id, sort: row.sort, tag_name: row.tag_name, tag_code: row.tag_code, tag_name_zh: row.tag_name_zh, tag_name_en: row.tag_name_en, is_enable: Number(row.is_enable) === 1 ? 0 : 1 });
    emit("action-success", "update", row);
    await load();
  } catch (error) { pageError.value = errorMessage(error); emit("action-error", "update", error); }
}
function requestDelete(row: TagRow) { deleteTarget.value = row; deleteVisible.value = true; }
async function handleDeleteAction(action: MessageBoxAction) {
  if (action !== "confirm" || !deleteTarget.value) return;
  const row = deleteTarget.value;
  try { await props.actions.remove(row.id); emit("action-success", "delete", row); deleteTarget.value = undefined; await load(); }
  catch (error) { pageError.value = errorMessage(error); emit("action-error", "delete", error); }
}
function runDetailAction(action: DetailAction) {
  const row = detailRow.value;
  if (!row) return;
  detailVisible.value = false;
  if (action === "add-child") openCreate(row.id);
  else if (action === "toggle-status") void toggleStatus(row);
  else if (action === "delete") requestDelete(row);
  else if (action === "translation-config") translationConfigVisible.value = true;
  else openEdit(row);
}

onMounted(load);
defineExpose({ reload: load });
</script>

<style>
.mm-symbol-tag-manager{height:100%;min-height:420px;overflow:hidden}.mm-symbol-tag-manager>.mm-pro-table{height:100%}
.mm-symbol-tag-manager .mm-table th:not(.is-fixed-right),.mm-symbol-tag-manager .mm-table td:not(.is-fixed-right){border-right:0}
.mm-symbol-tag-manager .mm-pro-table__auto-refresh{display:none}.mm-symbol-tag-manager__actions{display:flex;justify-content:center;gap:6px}
.mm-symbol-tag-manager__name{display:flex;min-width:0;align-items:center;gap:6px}.mm-symbol-tag-manager__toggle{display:inline-flex;width:20px;height:20px;flex:0 0 20px;align-items:center;justify-content:center;padding:0;border:0;color:var(--mm-color-text-secondary);background:transparent;cursor:pointer}
.mm-symbol-tag-manager__spacer{width:20px;flex:0 0 20px}.mm-symbol-tag-manager__branch{display:inline-flex;width:20px;height:20px;flex:0 0 20px;align-items:center;justify-content:center;color:var(--mm-color-line-strong)}
.mm-symbol-tag-manager__drawer-title{display:flex;min-width:0;flex-direction:column;gap:1px}.mm-symbol-tag-manager__drawer-title strong{color:var(--mm-color-text);font-weight:var(--mm-font-weight-bold)}.mm-symbol-tag-manager__drawer-title span{overflow:hidden;color:var(--mm-color-text-subtle);font-size:var(--mm-font-size-xs);font-weight:var(--mm-font-weight-medium);text-overflow:ellipsis;white-space:nowrap}
.mm-symbol-tag-manager__drawer-content{display:grid;gap:18px}.mm-symbol-tag-manager__descriptions .mm-descriptions__title,.mm-symbol-tag-manager__descriptions .mm-descriptions-item__label,.mm-symbol-tag-manager__descriptions .mm-descriptions-item__content{font-size:12px}.mm-symbol-tag-manager__descriptions .mm-descriptions-item--horizontal{grid-template-columns:128px minmax(0,1fr)}
.mm-symbol-tag-manager__drawer-actions{display:grid;gap:10px;padding-top:14px;border-top:1px solid var(--mm-color-line)}.mm-symbol-tag-manager__drawer-actions h3{margin:0;color:var(--mm-color-text);font-size:12px;font-weight:var(--mm-font-weight-semibold)}.mm-symbol-tag-manager__drawer-actions>div{display:grid;gap:7px}
.mm-symbol-tag-manager__drawer-actions button{display:grid;width:100%;min-height:38px;align-items:center;gap:10px;padding:0 12px;border:1px solid var(--mm-color-line);border-radius:var(--mm-radius-md);color:var(--mm-color-text);background:var(--mm-color-panel);cursor:pointer;font:inherit;font-size:12px;grid-template-columns:16px minmax(0,1fr) 16px;text-align:left;transition:border-color var(--mm-duration-fast) var(--mm-ease-standard),background var(--mm-duration-fast) var(--mm-ease-standard),color var(--mm-duration-fast) var(--mm-ease-standard)}
.mm-symbol-tag-manager__drawer-actions button:hover{border-color:var(--mm-color-primary);color:var(--mm-color-primary);background:var(--mm-color-primary-soft)}.mm-symbol-tag-manager__drawer-actions button.is-danger{color:var(--mm-color-danger)}.mm-symbol-tag-manager__drawer-actions button.is-danger:hover{border-color:var(--mm-color-danger);background:var(--mm-color-danger-soft)}
.mm-symbol-tag-manager__dialog-footer{display:flex;justify-content:flex-end;gap:8px}
</style>
