<script setup lang="ts">
import { onBeforeUnmount, reactive, ref, watch } from 'vue'

import { useFormField } from '../../composables/use-form-field'
import { useLocale } from '../../composables/use-locale'
import { acceptsFile, createFileUid, formatFileSize } from '../../shared/file'
import type {
  UploadFile,
  UploadProps,
  UploadRequestTask,
} from './types'

defineOptions({ name: 'MmUpload' })

const props = withDefaults(defineProps<UploadProps>(), {
  accept: undefined,
  autoUpload: true,
  beforeUpload: undefined,
  directory: false,
  disabled: false,
  drag: false,
  limit: Number.POSITIVE_INFINITY,
  maxSize: Number.POSITIVE_INFINITY,
  modelValue: () => [],
  multiple: false,
  name: 'file',
  readonly: false,
  request: undefined,
  size: undefined,
  status: undefined,
})
const emit = defineEmits<{
  abort: [file: UploadFile]
  change: [files: UploadFile[]]
  error: [file: UploadFile, error: Error]
  exceed: [files: File[], currentFiles: UploadFile[]]
  progress: [file: UploadFile, percentage: number]
  remove: [file: UploadFile]
  success: [file: UploadFile, response: unknown]
  'update:modelValue': [files: UploadFile[]]
}>()
const { messages } = useLocale()

const inputRef = ref<HTMLInputElement>()
const files = ref<UploadFile[]>([...props.modelValue])
const dragging = ref(false)
const active = new Map<string, { abort?: () => void; controller: AbortController }>()
const field = useFormField({
  disabled: () => props.disabled,
  id: () => props.id,
  size: () => props.size,
  status: () => props.status,
})

watch(() => props.modelValue, (value) => { files.value = [...value] })

function emitFiles(): void {
  const snapshot = [...files.value]
  emit('update:modelValue', snapshot)
  emit('change', snapshot)
}

function open(): void {
  if (!field.disabled.value && !props.readonly) inputRef.value?.click()
}

function failure(file: UploadFile, message: string): void {
  file.status = 'fail'
  file.error = message
  const error = new Error(message)
  emit('error', file, error)
}

async function addFiles(incoming: File[]): Promise<void> {
  if (field.disabled.value || props.readonly || !incoming.length) return
  if (files.value.length + incoming.length > props.limit) {
    emit('exceed', incoming, [...files.value])
    return
  }

  const ready: UploadFile[] = []
  for (const raw of incoming) {
    const file = reactive<UploadFile>({
      name: raw.name,
      percentage: 0,
      raw,
      size: raw.size,
      status: 'ready',
      type: raw.type,
      uid: createFileUid(),
    })
    files.value.push(file)

    if (!acceptsFile(raw, props.accept)) failure(file, messages.value.upload.invalidType(raw.name))
    else if (raw.size > props.maxSize) failure(file, messages.value.upload.fileTooLarge(raw.name))
    else if (props.beforeUpload) {
      try {
        if (await props.beforeUpload(raw) === false) failure(file, messages.value.upload.preflightRejected(raw.name))
        else ready.push(file)
      } catch (reason) {
        failure(file, reason instanceof Error ? reason.message : messages.value.upload.preflightFailed(raw.name))
      }
    } else ready.push(file)
  }
  emitFiles()
  if (props.autoUpload && props.request) ready.forEach((file) => void upload(file))
}

function normalizeTask(result: Promise<unknown> | UploadRequestTask): UploadRequestTask {
  return result instanceof Promise ? { promise: result } : result
}

async function upload(file: UploadFile): Promise<void> {
  if (!props.request || !file.raw || field.disabled.value || props.readonly) return
  abort(file.uid)
  const controller = new AbortController()
  file.status = 'uploading'
  file.error = undefined
  emitFiles()

  try {
    const task = normalizeTask(props.request({
      file: file.raw,
      onProgress: (percentage) => {
        if (controller.signal.aborted) return
        file.percentage = Math.max(0, Math.min(100, Math.round(percentage)))
        emit('progress', file, file.percentage)
        emitFiles()
      },
      signal: controller.signal,
    }))
    active.set(file.uid, { abort: task.abort, controller })
    const response = await task.promise
    if (controller.signal.aborted) return
    file.percentage = 100
    file.response = response
    file.status = 'success'
    emit('success', file, response)
    emitFiles()
  } catch (reason) {
    if (controller.signal.aborted) return
    failure(file, reason instanceof Error ? reason.message : messages.value.upload.uploadFailed(file.name))
    emitFiles()
  } finally {
    if (active.get(file.uid)?.controller === controller) active.delete(file.uid)
  }
}

function abort(uid?: string): void {
  const targets = uid ? [uid] : [...active.keys()]
  targets.forEach((target) => {
    const request = active.get(target)
    if (!request) return
    request.controller.abort()
    request.abort?.()
    active.delete(target)
    const file = files.value.find((entry) => entry.uid === target)
    if (file) {
      file.status = 'ready'
      file.percentage = 0
      emit('abort', file)
    }
  })
}

function remove(file: UploadFile): void {
  if (field.disabled.value || props.readonly) return
  abort(file.uid)
  files.value = files.value.filter((entry) => entry.uid !== file.uid)
  emit('remove', file)
  emitFiles()
}

function retry(file: UploadFile): void {
  file.status = 'ready'
  file.percentage = 0
  void upload(file)
}

function submit(): void {
  files.value.filter((file) => file.status === 'ready').forEach((file) => void upload(file))
}

function clearFiles(): void {
  abort()
  files.value = []
  emitFiles()
}

function onInput(event: Event): void {
  const input = event.target as HTMLInputElement
  void addFiles(Array.from(input.files ?? []))
  input.value = ''
}

function onDrop(event: DragEvent): void {
  dragging.value = false
  void addFiles(Array.from(event.dataTransfer?.files ?? []))
}

onBeforeUnmount(() => abort())
defineExpose({ abort, clearFiles, open, submit })
</script>

<template>
  <div class="mm-upload" :class="[`mm-upload--${field.size.value}`, field.status.value && `is-${field.status.value}`, { 'is-disabled': field.disabled.value, 'is-dragging': dragging, 'is-readonly': readonly }]" data-mm-component="upload">
    <input
      :id="field.id.value"
      ref="inputRef"
      class="mm-upload__input"
      type="file"
      :name="name"
      :accept="accept"
      :multiple="multiple"
      :disabled="field.disabled.value || readonly"
      :aria-label="messages.upload.chooseFiles"
      :aria-describedby="field.describedBy.value"
      :aria-invalid="field.status.value === 'error' ? 'true' : undefined"
      :webkitdirectory="directory ? '' : undefined"
      @change="onInput"
    />
    <div
      class="mm-upload__dropzone"
      :class="{ 'is-drag': drag }"
      role="button"
      :tabindex="field.disabled.value || readonly ? -1 : 0"
      :aria-disabled="field.disabled.value || readonly ? 'true' : undefined"
      @click="open"
      @keydown.enter.prevent="open"
      @keydown.space.prevent="open"
      @dragenter.prevent="drag && (dragging = true)"
      @dragover.prevent
      @dragleave.prevent="dragging = false"
      @drop.prevent="onDrop"
    >
      <slot :open="open" :files="files">
        <span class="mm-upload__mark" aria-hidden="true">↑</span>
        <span>
          <strong>{{ drag ? messages.upload.dragOrChoose : messages.upload.chooseFile }}</strong>
          <small>{{ accept ? messages.upload.acceptedTypes(accept) : messages.upload.customRequest }}</small>
        </span>
      </slot>
    </div>

    <ul v-if="files.length" class="mm-upload__list" :aria-label="messages.upload.files">
      <li v-for="file in files" :key="file.uid" class="mm-upload__file" :class="`is-${file.status}`">
        <span class="mm-upload__file-mark" aria-hidden="true">{{ file.status === 'success' ? '✓' : file.status === 'fail' ? '!' : '↥' }}</span>
        <span class="mm-upload__file-info">
          <strong>{{ file.name }}</strong>
          <small>{{ formatFileSize(file.size) }}<template v-if="file.error"> · {{ file.error }}</template></small>
          <span v-if="file.status === 'uploading'" class="mm-upload__progress" :style="{ '--mm-upload-progress': `${file.percentage}%` }" role="progressbar" :aria-valuenow="file.percentage" aria-valuemin="0" aria-valuemax="100" />
        </span>
        <span class="mm-upload__file-actions">
          <button v-if="file.status === 'fail' && request && !readonly" type="button" :aria-label="messages.upload.retry(file.name)" @click="retry(file)">{{ messages.upload.retryText }}</button>
          <button v-if="!readonly" type="button" :aria-label="messages.upload.remove(file.name)" @click="remove(file)">×</button>
        </span>
      </li>
    </ul>
  </div>
</template>

<style src="./upload.css"></style>
