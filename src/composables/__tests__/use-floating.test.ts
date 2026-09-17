import { effectScope, ref } from 'vue'
import { describe, expect, it } from 'vitest'

import { useFloating } from '../use-floating'

function rect(left: number, top: number, width: number, height: number): DOMRect {
  return {
    bottom: top + height,
    height,
    left,
    right: left + width,
    top,
    width,
    x: left,
    y: top,
    toJSON: () => ({}),
  }
}

describe('useFloating', () => {
  it('flips and shifts a floating element into the viewport', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 120 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 100 })
    const reference = document.createElement('button')
    const floating = document.createElement('div')
    reference.getBoundingClientRect = () => rect(95, 80, 20, 10)
    floating.getBoundingClientRect = () => rect(0, 0, 50, 30)

    const scope = effectScope()
    const position = scope.run(() =>
      useFloating(ref(reference), ref(floating), {
        offset: 8,
        placement: 'bottom-start',
        viewportPadding: 8,
      }),
    )!

    position.update()

    expect(position.placement.value).toBe('top-start')
    expect(position.x.value).toBe(62)
    expect(position.y.value).toBe(42)
    expect(position.floatingStyles.value).toMatchObject({
      left: '62px',
      position: 'fixed',
      top: '42px',
    })
    scope.stop()
  })

  it('positions with layout dimensions while the floating element is transformed', () => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1280 })
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 })
    const reference = document.createElement('button')
    const floating = document.createElement('div')
    reference.getBoundingClientRect = () => rect(1000, 100, 32, 28)
    floating.getBoundingClientRect = () => rect(0, 0, 265.95, 372.33)
    Object.defineProperty(floating, 'offsetWidth', { configurable: true, value: 270 })
    Object.defineProperty(floating, 'offsetHeight', { configurable: true, value: 378 })

    const scope = effectScope()
    const position = scope.run(() =>
      useFloating(ref(reference), ref(floating), {
        offset: 6,
        placement: 'bottom-end',
      }),
    )!

    position.update()

    expect(position.x.value).toBe(762)
    expect(position.y.value).toBe(134)
    scope.stop()
  })

  it('is safe when elements are unavailable', () => {
    const scope = effectScope()
    const position = scope.run(() => useFloating(ref(null), ref(null)))!

    expect(() => position.update()).not.toThrow()
    expect(position.x.value).toBe(0)
    expect(position.y.value).toBe(0)
    scope.stop()
  })
})
