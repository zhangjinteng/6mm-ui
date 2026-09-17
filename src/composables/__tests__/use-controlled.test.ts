import { effectScope, ref } from 'vue'
import { describe, expect, it, vi } from 'vitest'

import { useControlled } from '../use-controlled'

describe('useControlled', () => {
  it('stores local values when uncontrolled and emits requested changes', () => {
    const external = ref<string>()
    const onChange = vi.fn()
    const scope = effectScope()
    const state = scope.run(() => useControlled(external, 'initial', onChange))!

    expect(state.value.value).toBe('initial')
    expect(state.isControlled.value).toBe(false)

    state.value.value = 'local'

    expect(state.value.value).toBe('local')
    expect(onChange).toHaveBeenCalledWith('local')
    scope.stop()
  })

  it('uses the external value without mutating local state when controlled', () => {
    const external = ref<string | undefined>('external')
    const onChange = vi.fn()
    const scope = effectScope()
    const state = scope.run(() => useControlled(external, 'initial', onChange))!

    state.value.value = 'requested'

    expect(state.value.value).toBe('external')
    expect(state.isControlled.value).toBe(true)
    expect(onChange).toHaveBeenCalledWith('requested')

    external.value = 'updated'
    expect(state.value.value).toBe('updated')
    scope.stop()
  })
})
