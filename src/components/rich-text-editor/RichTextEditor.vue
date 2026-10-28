<script setup lang="ts">
import {
  AlignCenter, AlignLeft, AlignRight, Bold, Code, CodeXml, Columns3,
  ImagePlus, Italic, Link, List, ListOrdered, Minus, Quote, Redo2,
  RemoveFormatting, Rows3, Strikethrough, Table2, Trash2, Underline, Undo2,
} from '@lucide/vue'
import type { Editor } from '@tiptap/core'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import { TableKit } from '@tiptap/extension-table'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyleKit } from '@tiptap/extension-text-style'
import StarterKit from '@tiptap/starter-kit'
import { EditorContent, useEditor } from '@tiptap/vue-3'
import { computed, ref, useAttrs, watch, watchEffect, type Component } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useId } from '../../composables/use-id'
import { useLocale } from '../../composables/use-locale'
import { MmButton } from '../button'
import { MmDialog } from '../dialog'
import { MmInput } from '../input'
import { MmTooltip } from '../tooltip'
import type { RichTextEditorExpose, RichTextEditorProps, RichTextEditorValue } from './types'

defineOptions({ inheritAttrs: false, name: 'MmRichTextEditor' })

const props = withDefaults(defineProps<RichTextEditorProps>(), {
  disabled: false,
  extensions: () => [],
  minHeight: 240,
  modelValue: '',
  readonly: false,
  showCount: true,
  toolbar: true,
})
const emit = defineEmits<{
  blur: [event: FocusEvent]
  change: [html: string]
  focus: [event: FocusEvent]
  update: [value: RichTextEditorValue]
  'update:modelValue': [html: string]
}>()
const attrs = useAttrs()
const { messages } = useLocale()
const labels = computed(() => messages.value.richTextEditor)
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id,
  size: () => props.size,
  status: () => props.status,
})
const locked = computed(() => field.disabled.value || props.readonly)
const revision = ref(0)
const dialog = ref<'html' | 'image' | 'link' | null>(null)
const draft = ref('')
const imageAlt = ref('')
const dialogError = ref('')
const dialogFormId = useId('mm-editor-dialog')
const rootAttrs = computed(() => Object.fromEntries(Object.entries(attrs)
  .filter(([key]) => !['aria-label', 'aria-labelledby', 'aria-describedby'].includes(key))))

function validUrl(value: string, image = false): boolean {
  if (/^(?:\/(?!\/)|#)/.test(value)) return true
  try {
    const protocol = new URL(value).protocol
    return (image ? ['https:', 'http:'] : ['https:', 'http:', 'mailto:', 'tel:']).includes(protocol)
  } catch {
    return false
  }
}

const safeImage = Image.extend({
  parseHTML() {
    return [{
      tag: 'img[src]',
      getAttrs: element => validUrl(element.getAttribute('src') ?? '', true) ? null : false,
    }]
  },
})

function htmlOf(current: Editor | undefined): string {
  return !current || current.isEmpty ? '' : current.getHTML()
}

const editor = useEditor({
  content: props.modelValue ?? '',
  editable: !locked.value,
  extensions: [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: {
        defaultProtocol: 'https',
        openOnClick: false,
        isAllowedUri: (url, context) => context.defaultValidate(url) && validUrl(url),
      },
    }),
    TextStyleKit,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
    safeImage,
    TableKit.configure({ table: { renderWrapper: true } }),
    Placeholder.configure({ placeholder: () => props.placeholder ?? labels.value.placeholder }),
    ...props.extensions,
  ],
  onTransaction: () => { revision.value += 1 },
  onUpdate: ({ editor: current }) => {
    const html = htmlOf(current)
    emit('update:modelValue', html)
    emit('change', html)
    emit('update', { html, json: current.getJSON(), text: current.getText() })
    void field.onChange()
  },
  onFocus: ({ event }) => emit('focus', event),
  onBlur: ({ event }) => {
    emit('blur', event)
    void field.onBlur()
  },
})

watch([() => props.modelValue, editor], ([value, current]) => {
  if (current && (value ?? '') !== htmlOf(current)) {
    current.commands.setContent(value ?? '', { emitUpdate: false })
  }
})

watchEffect(() => {
  const current = editor.value
  if (!current) return
  current.setEditable(!locked.value, false)
  const labelledBy = String(attrs['aria-labelledby'] ?? field.labelledBy.value ?? '')
  current.setOptions({ editorProps: { attributes: {
    id: field.id.value,
    class: 'mm-rich-text-editor__document',
    role: 'textbox',
    'aria-multiline': 'true',
    'aria-readonly': String(props.readonly),
    'aria-disabled': String(field.disabled.value),
    'aria-invalid': String(field.status.value === 'error'),
    'aria-label': props.ariaLabel ?? String(attrs['aria-label'] ?? (labelledBy ? '' : labels.value.label)),
    'aria-labelledby': labelledBy,
    'aria-describedby': [field.describedBy.value, attrs['aria-describedby']].filter(Boolean).join(' '),
    'data-placeholder': props.placeholder ?? labels.value.placeholder,
    tabindex: field.disabled.value ? '-1' : '0',
  } } })
})

watch(locked, value => { if (value) dialog.value = null })

interface ToolbarTool {
  key: string
  icon: Component
  label: string
  active?: boolean
  unavailable?: boolean
  run: () => unknown
}

const tools = computed<ToolbarTool[][]>(() => {
  void revision.value
  const current = editor.value
  const active = (name: string, attributes?: Record<string, unknown>) => current?.isActive(name, attributes) ?? false
  return [
    [
      { key: 'undo', icon: Undo2, label: labels.value.undo, run: () => current?.chain().focus().undo().run(), unavailable: !current?.can().undo() },
      { key: 'redo', icon: Redo2, label: labels.value.redo, run: () => current?.chain().focus().redo().run(), unavailable: !current?.can().redo() },
    ],
    [
      { key: 'bold', icon: Bold, label: labels.value.bold, active: active('bold'), run: () => current?.chain().focus().toggleBold().run() },
      { key: 'italic', icon: Italic, label: labels.value.italic, active: active('italic'), run: () => current?.chain().focus().toggleItalic().run() },
      { key: 'underline', icon: Underline, label: labels.value.underline, active: active('underline'), run: () => current?.chain().focus().toggleUnderline().run() },
      { key: 'strike', icon: Strikethrough, label: labels.value.strike, active: active('strike'), run: () => current?.chain().focus().toggleStrike().run() },
      { key: 'code', icon: Code, label: labels.value.code, active: active('code'), run: () => current?.chain().focus().toggleCode().run() },
    ],
    [
      { key: 'bulletList', icon: List, label: labels.value.bulletList, active: active('bulletList'), run: () => current?.chain().focus().toggleBulletList().run() },
      { key: 'orderedList', icon: ListOrdered, label: labels.value.orderedList, active: active('orderedList'), run: () => current?.chain().focus().toggleOrderedList().run() },
      { key: 'blockquote', icon: Quote, label: labels.value.blockquote, active: active('blockquote'), run: () => current?.chain().focus().toggleBlockquote().run() },
      { key: 'codeBlock', icon: CodeXml, label: labels.value.codeBlock, active: active('codeBlock'), run: () => current?.chain().focus().toggleCodeBlock().run() },
    ],
    [
      { key: 'left', icon: AlignLeft, label: labels.value.alignLeft, active: current?.isActive({ textAlign: 'left' }), run: () => current?.chain().focus().setTextAlign('left').run() },
      { key: 'center', icon: AlignCenter, label: labels.value.alignCenter, active: current?.isActive({ textAlign: 'center' }), run: () => current?.chain().focus().setTextAlign('center').run() },
      { key: 'right', icon: AlignRight, label: labels.value.alignRight, active: current?.isActive({ textAlign: 'right' }), run: () => current?.chain().focus().setTextAlign('right').run() },
    ],
    [
      { key: 'link', icon: Link, label: labels.value.link, active: active('link'), run: () => openDialog('link') },
      { key: 'image', icon: ImagePlus, label: labels.value.image, run: () => openDialog('image') },
      { key: 'table', icon: Table2, label: labels.value.table, active: active('table'), run: () => current?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
      { key: 'horizontalRule', icon: Minus, label: labels.value.horizontalRule, run: () => current?.chain().focus().setHorizontalRule().run() },
      { key: 'clearFormatting', icon: RemoveFormatting, label: labels.value.clearFormatting, run: () => current?.chain().focus().unsetAllMarks().clearNodes().unsetTextAlign().run() },
      { key: 'html', icon: CodeXml, label: labels.value.html, run: () => openDialog('html') },
    ],
  ]
})

const tableTools = computed(() => {
  void revision.value
  const current = editor.value
  return [
    { key: 'addRow', icon: Rows3, label: labels.value.addRow, run: () => current?.chain().focus().addRowAfter().run() },
    { key: 'deleteRow', icon: Rows3, label: labels.value.deleteRow, run: () => current?.chain().focus().deleteRow().run() },
    { key: 'addColumn', icon: Columns3, label: labels.value.addColumn, run: () => current?.chain().focus().addColumnAfter().run() },
    { key: 'deleteColumn', icon: Columns3, label: labels.value.deleteColumn, run: () => current?.chain().focus().deleteColumn().run() },
    { key: 'deleteTable', icon: Trash2, label: labels.value.deleteTable, run: () => current?.chain().focus().deleteTable().run() },
  ]
})

const inTable = computed(() => { void revision.value; return editor.value?.isActive('table') ?? false })
const blockType = computed(() => { void revision.value; return editor.value?.isActive('heading') ? String(editor.value.getAttributes('heading').level) : 'paragraph' })
const textColor = computed(() => { void revision.value; return editor.value?.getAttributes('textStyle').color || '#172033' })
const characterCount = computed(() => { void revision.value; return Array.from(editor.value?.getText() ?? '').length })
const dialogTitle = computed(() => dialog.value === 'html' ? labels.value.html : dialog.value === 'image' ? labels.value.image : labels.value.link)
const contentStyle = computed(() => ({
  '--mm-editor-min-height': dimension(props.minHeight),
  '--mm-editor-max-height': dimension(props.maxHeight),
}))

function dimension(value: number | string | undefined): string | undefined {
  return typeof value === 'number' ? `${value}px` : value
}

function setBlock(event: Event): void {
  if (locked.value) return
  const value = (event.target as HTMLSelectElement).value
  if (value === 'paragraph') editor.value?.chain().focus().setParagraph().run()
  else editor.value?.chain().focus().setHeading({ level: Number(value) as 1 | 2 | 3 }).run()
}

function setColor(event: Event): void {
  if (!locked.value) editor.value?.chain().focus().setColor((event.target as HTMLInputElement).value).run()
}

function openDialog(kind: 'html' | 'image' | 'link'): void {
  if (locked.value) return
  draft.value = kind === 'html' ? htmlOf(editor.value) : kind === 'link' ? editor.value?.getAttributes('link').href ?? '' : ''
  imageAlt.value = ''
  dialogError.value = ''
  dialog.value = kind
}

function applyDialog(): void {
  const current = editor.value
  if (!current || locked.value) return
  if (dialog.value === 'html') current.commands.setContent(draft.value)
  else if (dialog.value === 'link') {
    const href = draft.value.trim()
    if (!href) current.chain().focus().extendMarkRange('link').unsetLink().run()
    else if (!validUrl(href)) { dialogError.value = labels.value.invalidUrl; return }
    else current.chain().focus().extendMarkRange('link').setLink({ href }).run()
  } else if (dialog.value === 'image') {
    const src = draft.value.trim()
    if (!validUrl(src, true)) { dialogError.value = labels.value.invalidImageUrl; return }
    current.chain().focus().setImage({ src, alt: imageAlt.value.trim() }).run()
  }
  dialog.value = null
}

defineExpose<RichTextEditorExpose>({
  blur: () => { editor.value?.commands.blur() },
  clear: () => !locked.value && (editor.value?.commands.clearContent() ?? false),
  get editor() { return editor.value },
  focus: () => { editor.value?.commands.focus() },
  getHTML: () => htmlOf(editor.value),
  getJSON: () => editor.value?.getJSON(),
  insertContent: html => !locked.value && (editor.value?.commands.insertContent(html) ?? false),
  setContent: html => !locked.value && (editor.value?.commands.setContent(html) ?? false),
})
</script>

<template>
  <div
    v-bind="rootAttrs"
    class="mm-rich-text-editor"
    :class="[`mm-rich-text-editor--${field.size.value}`, field.status.value && `is-${field.status.value}`, { 'is-disabled': field.disabled.value, 'is-readonly': readonly }]"
    data-mm-component="rich-text-editor"
    :style="contentStyle"
  >
    <div v-if="toolbar" class="mm-rich-text-editor__toolbar" role="toolbar" :aria-label="labels.toolbar">
      <select class="mm-rich-text-editor__block" :aria-label="labels.blockType" :value="blockType" :disabled="locked" @change="setBlock">
        <option value="paragraph">{{ labels.paragraph }}</option>
        <option v-for="level in [1, 2, 3]" :key="level" :value="String(level)">{{ labels.heading(level) }}</option>
      </select>
      <div v-for="(group, index) in tools" :key="index" class="mm-rich-text-editor__group">
        <MmTooltip v-for="tool in group" :key="tool.key" :content="tool.label">
          <template #default="{ triggerAttrs }">
            <button v-bind="triggerAttrs" class="mm-rich-text-editor__tool" :class="{ 'is-active': tool.active }" type="button" :aria-label="tool.label" :aria-pressed="tool.active" :disabled="locked || !editor || tool.unavailable" @mousedown.prevent @click="tool.run()">
              <component :is="tool.icon" :size="16" :stroke-width="1.75" aria-hidden="true" />
            </button>
          </template>
        </MmTooltip>
      </div>
      <label class="mm-rich-text-editor__color" :title="labels.color">
        <span class="mm-sr-only">{{ labels.color }}</span>
        <input type="color" :value="textColor" :disabled="locked" @input="setColor" />
      </label>
      <slot name="toolbar-end" :editor="editor" :disabled="locked" />
    </div>
    <div v-if="toolbar && inTable" class="mm-rich-text-editor__table-tools" role="group" :aria-label="labels.tableTools">
      <button v-for="tool in tableTools" :key="tool.key" class="mm-rich-text-editor__table-tool" type="button" :disabled="locked" @mousedown.prevent @click="tool.run()">
        <component :is="tool.icon" :size="14" aria-hidden="true" />{{ tool.label }}
      </button>
    </div>
    <EditorContent class="mm-rich-text-editor__content" :editor="editor" />
    <footer v-if="showCount || $slots.footer" class="mm-rich-text-editor__footer">
      <slot name="footer" :editor="editor" :characters="characterCount"><span>{{ labels.characters(characterCount) }}</span></slot>
    </footer>

    <MmDialog :model-value="dialog !== null" :title="dialogTitle" :width="dialog === 'html' ? 720 : 480" @update:model-value="value => { if (!value) dialog = null }">
      <form :id="dialogFormId" class="mm-rich-text-editor__dialog-form" @submit.prevent="applyDialog">
        <label v-if="dialog === 'html'" class="mm-rich-text-editor__label">
          <span>{{ labels.html }}</span>
          <textarea v-model="draft" class="mm-rich-text-editor__source" spellcheck="false" />
        </label>
        <template v-else>
          <label class="mm-rich-text-editor__label"><span>{{ labels.url }}</span><MmInput v-model="draft" placeholder="https://" :status="dialogError ? 'error' : undefined" @input="dialogError = ''" /></label>
          <label v-if="dialog === 'image'" class="mm-rich-text-editor__label"><span>{{ labels.imageAlt }}</span><MmInput v-model="imageAlt" /></label>
        </template>
        <p v-if="dialogError" class="mm-rich-text-editor__error" role="alert">{{ dialogError }}</p>
      </form>
      <template #footer>
        <MmButton size="sm" @click="dialog = null">{{ messages.common.cancel }}</MmButton>
        <MmButton v-if="dialog === 'link' && editor?.isActive('link')" size="sm" @click="draft = ''; applyDialog()">{{ labels.unlink }}</MmButton>
        <MmButton size="sm" variant="primary" native-type="submit" :form="dialogFormId" :disabled="locked">{{ messages.common.confirm }}</MmButton>
      </template>
    </MmDialog>
  </div>
</template>

<style src="./rich-text-editor.css"></style>
