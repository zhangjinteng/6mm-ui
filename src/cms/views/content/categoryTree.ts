import { computed, ref, type Ref } from 'vue'

// The CMS endpoints paginate flat rows. A parent and its children need not be on the same page.
export async function loadCategoryPages<T>(page: (n: number, size: number) => Promise<{ lists: T[]; count: number }>, signal: AbortSignal) {
    const first = await page(1, 100)
    const rows = [...first.lists]
    for (let n = 2; n <= Math.ceil(first.count / 100); n++) {
        signal.throwIfAborted()
        rows.push(...(await page(n, 100)).lists)
    }
    return { rows, total: rows.length }
}

export function useCategoryTree<T extends { id: string; parent_id?: unknown }>(rows: Ref<T[]>) {
    const expanded = ref(new Set<string>())
    const groups = computed(() => {
        const roots: T[] = []
        const children = new Map<string, T[]>()
        const ids = new Set(rows.value.map(r => r.id))
        for (const row of rows.value) {
            const parent = String(row.parent_id ?? '')
            // When only a child matches a server-side filter, don't hide the result.
            if (!parent || !ids.has(parent)) roots.push(row)
            else {
                if (!children.has(parent)) children.set(parent, [])
                children.get(parent)!.push(row)
            }
        }
        return { roots, children }
    })
    const visibleRows = computed(() => groups.value.roots.flatMap(root =>
        [root, ...(expanded.value.has(root.id) ? groups.value.children.get(root.id) ?? [] : [])]))
    const allExpanded = computed(() => groups.value.children.size > 0 &&
        [...groups.value.children.keys()].every(id => expanded.value.has(id)))
    function toggle(id: string) {
        if (expanded.value.has(id)) expanded.value.delete(id)
        else expanded.value.add(id)
    }
    function toggleAll() {
        expanded.value = allExpanded.value ? new Set() : new Set(groups.value.children.keys())
    }
    return { visibleRows, expanded, groups, allExpanded, toggle, toggleAll }
}
