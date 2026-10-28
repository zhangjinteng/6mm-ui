# MmRichTextEditor

基于 [Tiptap 3](https://github.com/ueberdosis/tiptap) 的 Vue 3 富文本输入组件。可按需导入，也会随 `MmUI` 插件全量注册。使用现有 `--mm-*` 主题、中英文词典和 `MmFormItem` 校验协议。

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { MmRichTextEditor, type RichTextEditorExpose } from '@work-gpt/6mm-ui'
import '@work-gpt/6mm-ui/style.css'

const html = ref('<p>公告正文</p>')
const editor = ref<RichTextEditorExpose>()
</script>

<template>
  <MmRichTextEditor ref="editor" v-model="html" :min-height="280" :max-height="560" />
</template>
```

## 内容与工具栏

工具栏包含正文/三级标题、撤销重做、加粗、斜体、下划线、删除线、行内代码、有序/无序列表、引用、代码块、对齐、文字颜色、链接、图片 URL、表格、分割线、清除格式和 HTML 源码。选中表格单元格后显示行列操作。

从网页复制的富文本会通过剪贴板 HTML 解析。纯文本形式的 HTML 源码需通过工具栏的“HTML 源码”对话框，或实例的 `setContent` / `insertContent` 方法导入。对话框取消会保留原内容，确认后才更新 `v-model`。

导入内容遵循 Tiptap schema，不承诺任意 HTML/CSS 的原样往返；未注册的标签、属性和脚本不会成为可编辑文档内容。链接仅接受 http、https、mailto、tel 和站内 `/path` / `#anchor` 地址，图片接受 http、https 和站内地址；不接收 data URL。后端仍需按自己的展示策略验证和清洗保存内容。文件上传由宿主提供，拿到 URL 后调用 `editor.value?.editor?.chain().focus().setImage({ src: url }).run()`。

Tiptap 与 ProseMirror 是运行依赖，发布包不重复内联它们。新增扩展可通过 `extensions` 传入，需在组件挂载前确定，避免重复注册内置扩展。内置为 StarterKit（标题 1–3）、TextStyleKit、TextAlign、Image、TableKit 和 Placeholder。

## 属性

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `modelValue` / `v-model` | `string \| null` | `''` | HTML 字符串；空文档更新为 `''`，方便 required 验证 |
| `placeholder` | `string` | 随语言切换 | 空文档提示 |
| `ariaLabel` | `string` | 随语言切换 | 编辑区域名称；也支持 `aria-label` / FormItem 标签 |
| `id` | `string` | 自动生成 | 编辑区域 ID |
| `disabled` | `boolean` | `false` | 禁止编辑、工具栏操作和键盘聚焦；继承 Form 禁用状态 |
| `readonly` | `boolean` | `false` | 允许聚焦和复制，禁止编辑与工具栏修改 |
| `toolbar` | `boolean` | `true` | 显示工具栏 |
| `showCount` | `boolean` | `true` | 显示字符数，不包含 HTML 标签 |
| `minHeight` | `number \| string` | `240` | 编辑区最小高度，数字单位为 px |
| `maxHeight` | `number \| string` | 无 | 内容区最大高度，超出滚动 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 正文字号；继承 Form 尺寸 |
| `status` | `'error' \| 'warning' \| 'success'` | 无 | 状态样式；可由 FormItem 验证提供 |
| `extensions` | Tiptap `Extensions` | `[]` | 追加扩展，挂载后不动态重建 |

## 事件与插槽

| 事件 | 参数 | 触发条件 |
| --- | --- | --- |
| `update:modelValue`、`change` | HTML 字符串 | 编辑器内容变更；父组件回填不反向触发 |
| `update` | `{ html, json, text }` | 与内容变更同步，便于消费 JSON 或纯文本 |
| `focus`、`blur` | `FocusEvent` | 编辑区获得/失去焦点 |

`toolbar-end` 插槽提供 `{ editor, disabled }`，可接入宿主上传或自定义命令；`footer` 插槽提供 `{ editor, characters }`。

## 实例方法

| 方法 / 属性 | 说明 |
| --- | --- |
| `focus()`、`blur()` | 编辑区焦点控制 |
| `getHTML()` | 获取 HTML，空文档返回 `''` |
| `getJSON()` | 获取 Tiptap JSON |
| `setContent(html)` | 替换全文并触发内容事件 |
| `insertContent(html)` | 在当前选区插入 HTML |
| `clear()` | 清空并触发内容事件 |
| `editor` | Tiptap Editor 实例，挂载前为 `undefined`；直接调用其命令由宿主负责遵循只读状态 |

`setContent`、`insertContent` 和 `clear` 在禁用或只读时返回 `false`，其余时候返回 Tiptap 命令执行结果。

## 本地预览

启动组件库的开发服务后，打开 `/rich-text-editor` 可操作独立示例；`/component-info#component-rich-text-editor` 中也提供目录示例。
