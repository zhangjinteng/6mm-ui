import assert from 'node:assert/strict'
import test from 'node:test'
import { shallowRef } from 'vue'
import { loadCategoryPages, useCategoryTree } from './categoryTree.ts'

test('parents and children on different API pages expand together, filtered children are not lost', async () => {
    const root = { id: 'root', parent_id: null }
    const other = { id: 'other', parent_id: null }
    const child = { id: 'child', parent_id: 'root' }
    const source = [child, other, ...Array.from({ length: 98 }, (_, i) => ({ id: String(i), parent_id: 'other' })), root]
    const { rows } = await loadCategoryPages(async (page, size) => ({
        lists: source.slice((page-1)*size, page*size), count: source.length
    }), new AbortController().signal)
    const data = shallowRef(rows)
    const tree = useCategoryTree(data)
    assert.deepEqual(tree.visibleRows.value, [other, root])
    tree.toggle(root.id)
    assert.deepEqual(tree.visibleRows.value, [other, root, child])
    tree.toggleAll()
    assert.equal(tree.visibleRows.value.length, 101)
    tree.toggleAll()
    assert.deepEqual(tree.visibleRows.value, [other, root])
    data.value = [child]
    assert.deepEqual(tree.visibleRows.value, [child])
})
