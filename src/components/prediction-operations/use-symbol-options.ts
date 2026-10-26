import { ref, watch, onBeforeUnmount, type Ref } from 'vue'
export function useSymbolOptions(allowed: Ref<boolean>, loader?: (signal?: AbortSignal) => Promise<string[]>, identityKey?: () => string) {
    const symbols = ref<string[]>([])
    let controller: AbortController | undefined
    watch([allowed, () => identityKey?.()], async ([value]) => {
        controller?.abort()
        symbols.value = []
        if (!value || !loader) return
        const read = controller = new AbortController()
        try {
            const rows = await loader(read.signal)
            if (!read.signal.aborted) symbols.value = rows.filter(symbol => typeof symbol === 'string')
        } catch { /* Historical symbols remain searchable when the directory is unavailable. */ }
    }, { immediate: true })
    onBeforeUnmount(() => controller?.abort())
    return symbols
}
