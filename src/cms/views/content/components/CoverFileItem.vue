<template>
    <div class="file-list" aria-label="封面文件">
        <div class="file-item">
            <span class="file-icon">
                <img
                    v-if="!previewFailed"
                    :src="url"
                    alt="封面缩略图"
                    @error="previewFailed = true"
                />
                <MmIcon v-else name="image" :size="20" />
            </span>
            <a
                class="file-name"
                :href="downloadUrl || undefined"
                :download="fileName"
                :title="fileName"
                :aria-busy="downloading"
                :aria-disabled="downloading || !downloadUrl"
                @click.prevent.stop="download"
                >{{ fileName }}</a
            >
            <span class="file-size">{{ sizeLabel }}</span>
            <button
                class="file-remove"
                type="button"
                aria-label="移除封面"
                title="移除封面"
                :disabled="disabled"
                @click.stop="emit('remove')"
            >
                <MmIcon name="close" :size="14" />
            </button>
        </div>
        <span v-if="downloadError" class="file-error" role="alert">{{ downloadError }}</span>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { MmIcon } from "../../../../index"

const props = defineProps<{ url: string; file?: File; disabled?: boolean }>()
const emit = defineEmits<{ remove: [] }>()
const size = ref<number | null>(null)
const previewFailed = ref(false)
const downloading = ref(false)
const downloadError = ref('')
let downloadController: AbortController | undefined
const downloadUrl = computed(() => {
    try {
        const url = new URL(props.url, window.location.href)
        return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
    } catch {
        return ''
    }
})
const fileName = computed(() => {
    if (props.file) return props.file.name
    const name = downloadUrl.value ? new URL(downloadUrl.value).pathname.split('/').pop() : ''
    if (!name) return '封面图片'
    try {
        return decodeURIComponent(name)
    } catch {
        return name
    }
})
const sizeLabel = computed(() => {
    if (size.value === null) return '大小未知'
    if (size.value < 1024) return `${size.value} B`
    if (size.value < 1024 * 1024) return `${(size.value / 1024).toFixed(1)} KB`
    return `${(size.value / (1024 * 1024)).toFixed(1)} MB`
})

// Existing content stores only the URL. Do not infer a size from the image dimensions.
watch(
    () => [props.url, props.file] as const,
    async (_, __, onCleanup) => {
        downloadController?.abort()
        downloadController = undefined
        downloading.value = false
        downloadError.value = ''
        previewFailed.value = false
        size.value = props.file?.size ?? null
        if (props.file || !downloadUrl.value) return
        const controller = new AbortController()
        const timeout = window.setTimeout(() => controller.abort(), 5000)
        onCleanup(() => {
            controller.abort()
            window.clearTimeout(timeout)
        })
        try {
            const response = await fetch(downloadUrl.value, {
                method: 'HEAD',
                signal: controller.signal,
                credentials: 'omit',
                referrerPolicy: 'no-referrer'
            })
            const length = response.headers.get('content-length')
            const bytes = length && /^\d+$/.test(length) ? Number(length) : NaN
            if (response.ok && !controller.signal.aborted && Number.isFinite(bytes) && bytes >= 0)
                size.value = bytes
        } catch {
            // Remote image hosts may not expose HEAD/Content-Length through CORS.
        } finally {
            window.clearTimeout(timeout)
        }
    },
    { immediate: true }
)

async function download() {
    if (downloading.value || !downloadUrl.value) return
    const controller = new AbortController()
    downloadController = controller
    const timeout = window.setTimeout(() => controller.abort(), 15000)
    const name = fileName.value
    downloading.value = true
    downloadError.value = ''
    try {
        let blob: Blob | undefined = props.file
        if (!blob) {
            const response = await fetch(downloadUrl.value, {
                signal: controller.signal,
                credentials: 'omit',
                referrerPolicy: 'no-referrer'
            })
            if (!response.ok) throw new Error('Download failed')
            blob = await response.blob()
        }
        if (controller.signal.aborted) return
        size.value = blob.size
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = objectUrl
        link.download = name
        link.click()
        window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000)
    } catch {
        if (downloadController === controller) downloadError.value = '图片下载失败，请稍后重试'
    } finally {
        window.clearTimeout(timeout)
        if (downloadController === controller) downloading.value = false
    }
}
onBeforeUnmount(() => {
    downloadController?.abort()
    downloadController = undefined
})
</script>

<style scoped>
.file-list {
    width: 100%;
    min-width: 0;
}
.file-item {
    display: grid;
    grid-template-columns: 28px minmax(0, 1fr) auto 24px;
    align-items: center;
    gap: 6px;
    padding: 8px;
    border: 1px solid var(--mm-color-line);
    border-radius: 4px;
    background: var(--mm-color-panel);
}
.file-icon {
    display: grid;
    place-items: center;
    width: 28px;
    height: 28px;
    overflow: hidden;
    border-radius: 3px;
    background: var(--mm-color-soft);
    color: var(--mm-color-text-muted);
}
.file-icon img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
.file-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--mm-color-primary);
    font-size: 12px;
}
.file-name:hover {
    text-decoration: underline;
}
.file-name[aria-disabled='true'] {
    cursor: default;
    opacity: 0.6;
}
.file-size {
    font-size: 11px;
    white-space: nowrap;
    color: var(--mm-color-text-muted);
}
.file-remove {
    display: grid;
    place-items: center;
    width: 24px;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 3px;
    background: transparent;
    color: var(--mm-color-text-muted);
    cursor: pointer;
}
.file-remove:hover:not(:disabled) {
    color: var(--mm-color-danger);
    background: var(--mm-color-soft);
}
.file-remove:disabled {
    cursor: not-allowed;
    opacity: 0.5;
}
.file-name:focus-visible,
.file-remove:focus-visible {
    outline: 2px solid var(--mm-color-primary);
    outline-offset: 2px;
}
.file-error {
    display: block;
    margin-top: 4px;
    font-size: 12px;
    color: var(--mm-color-danger);
}
</style>
