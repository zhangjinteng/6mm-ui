<script setup lang="ts">
import { ref } from 'vue'

import { MmButton, MmCheckbox, MmRichTextEditor, type RichTextEditorExpose } from '../src'

const content = ref('<h2>产品更新公告</h2><p>欢迎使用 <strong>6MM</strong>。请在发布前检查公告内容。</p><ul><li>交易体验优化</li><li>账户通知更新</li></ul>')
const readonly = ref(false)
const disabled = ref(false)
const editor = ref<RichTextEditorExpose>()

function loadContent(): void {
  content.value = '<h2>服务维护通知</h2><p>维护时间：<strong>02:00–03:00</strong></p><p>期间可以正常查询账户。</p>'
}
</script>

<template>
  <main class="editor-preview">
    <header class="editor-preview__header">
      <h1>富文本编辑器</h1>
      <div class="editor-preview__actions">
        <MmCheckbox v-model="readonly">只读</MmCheckbox>
        <MmCheckbox v-model="disabled">禁用</MmCheckbox>
        <MmButton size="sm" @click="loadContent">加载内容</MmButton>
        <MmButton size="sm" :disabled="readonly || disabled" @click="editor?.clear()">清空</MmButton>
      </div>
    </header>
    <MmRichTextEditor ref="editor" v-model="content" :readonly="readonly" :disabled="disabled" :min-height="320" :max-height="560" aria-label="公告内容" />
    <details class="editor-preview__output" open><summary>HTML</summary><pre data-testid="editor-html">{{ content }}</pre></details>
  </main>
</template>

<style scoped>
.editor-preview { box-sizing: border-box; width: min(1040px, 100%); margin: 32px auto; padding: 0 20px; font-family: var(--mm-font-family); color: var(--mm-color-text); }
.editor-preview__header { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 20px; }
.editor-preview h1 { margin: 0; font-size: 22px; font-weight: 600; }
.editor-preview__actions { display: flex; align-items: center; flex-wrap: wrap; gap: 12px; }
.editor-preview__output { margin-top: 24px; border-top: 1px solid var(--mm-color-line); padding-top: 16px; font-size: 13px; }
.editor-preview__output summary { cursor: pointer; color: var(--mm-color-text-muted); }
.editor-preview__output pre { white-space: pre-wrap; overflow-wrap: anywhere; font: 12px/1.8 var(--mm-font-family-mono); }
@media (max-width: 480px) { .editor-preview { margin: 20px auto; padding: 0 12px; } }
</style>
