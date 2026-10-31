<template>
    <div class="content-cover">
        <MmUpload
            ref="uploadRef"
            class="content-cover__upload"
            drag
            accept="image/jpeg,image/png,image/webp"
            :limit="1"
            :max-size="5242880"
            :disabled="disabled || uploading"
            :request="uploadCover"
            @success="uploadSuccess"
            @error="uploadError"
            @exceed="emit('error', new Error('一次只能上传一张封面图片'))"
        >
            <div class="content-cover__preview">
                <img
                    v-if="modelValue"
                    :src="modelValue"
                    :alt="label"
                    draggable="false"
                    @error="coverFailed = true"
                    @load="coverFailed = false"
                />
                <div v-else class="content-cover__empty">
                    <MmIcon name="image" :size="28" />
                </div>
                <span v-if="!modelValue" class="content-cover__hint">
                    {{ uploading ? '正在上传…' : '拖动图片到此处，或点击上传' }}
                    <span class="content-cover__types">JPG / PNG / WebP，最大 5 MB</span>
                </span>
            </div>
        </MmUpload>
        <span v-if="coverFailed" class="content-cover__error" role="status">
            封面无法加载，请重新上传
        </span>
        <CoverFileItem
            v-if="modelValue"
            :url="modelValue"
            :file="uploadedCover?.url === modelValue ? uploadedCover.file : undefined"
            :disabled="disabled || uploading"
            @remove="removeCover"
        />
    </div>
</template>

<script setup lang="ts">
import { nextTick, ref, shallowRef, watch } from 'vue'
import { MmIcon, MmUpload, type UploadRequestOptions } from "../../../../index"
import CoverFileItem from './CoverFileItem.vue'

const props = withDefaults(
    defineProps<{
        modelValue: string
        label?: string
        disabled?: boolean
        upload: (file: File, signal: AbortSignal) => Promise<{ url: string }>
    }>(),
    { label: '文章封面', disabled: false }
)
const emit = defineEmits<{
    'update:modelValue': [value: string]
    'busy-change': [value: boolean]
    start: []
    success: []
    error: [error: unknown]
}>()
const uploadRef = ref<InstanceType<typeof MmUpload>>()
const uploadedCover = shallowRef<{ url: string; file: File }>()
const uploading = ref(false)
const coverFailed = ref(false)
let requestFailure: { error: unknown } | undefined

watch(
    () => props.modelValue,
    (url) => {
        coverFailed.value = false
        if (uploadedCover.value?.url !== url) uploadedCover.value = undefined
    }
)

async function uploadCover({ file, signal }: UploadRequestOptions) {
    requestFailure = undefined
    uploading.value = true
    emit('busy-change', true)
    emit('start')
    try {
        const result = await props.upload(file, signal)
        if (!signal.aborted) {
            uploadedCover.value = { url: result.url, file }
            coverFailed.value = false
            emit('update:modelValue', result.url)
        }
        return result
    } catch (error) {
        // MmUpload wraps rejected values as Error; keep API validation details for the page.
        if (!signal.aborted) requestFailure = { error }
        throw error
    } finally {
        uploading.value = false
        emit('busy-change', false)
    }
}
function clearUpload() {
    void nextTick(() => uploadRef.value?.clearFiles())
}
function uploadSuccess() {
    emit('success')
    clearUpload()
}
function uploadError(_file: unknown, error: Error) {
    emit('error', requestFailure ? requestFailure.error : error)
    requestFailure = undefined
    clearUpload()
}
function removeCover() {
    if (props.disabled || uploading.value) return
    uploadedCover.value = undefined
    coverFailed.value = false
    emit('update:modelValue', '')
}
</script>

<style scoped>
.content-cover {
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    min-width: 0;
}
.content-cover__preview {
    position: relative;
    aspect-ratio: 16 / 9;
    width: 100%;
    overflow: hidden;
}
.content-cover__preview img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}
.content-cover__empty {
    display: grid;
    place-items: center;
    height: 100%;
    color: var(--mm-color-text-muted);
    padding-bottom: 48px;
}
.content-cover__hint {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 6px 4px;
    color: var(--mm-color-text-muted);
    text-align: center;
    font-size: 12px;
}
.content-cover__types {
    display: block;
    margin-top: 6px;
    color: var(--mm-color-text-muted);
    font-size: 11px;
}
.content-cover__upload :deep(.mm-upload__dropzone) {
    padding: 0;
    min-height: 0;
    overflow: hidden;
    background: transparent;
}
.content-cover__error {
    font-size: 12px;
    color: var(--mm-color-danger);
}
</style>
