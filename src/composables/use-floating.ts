import { computed, ref, toValue, watchEffect } from 'vue'
import type { CSSProperties, ComputedRef, MaybeRefOrGetter, Ref } from 'vue'

import { useEventListener } from './use-event-listener'

export type FloatingSide = 'bottom' | 'left' | 'right' | 'top'
export type FloatingAlignment = 'end' | 'start'
export type FloatingPlacement = FloatingSide | `${FloatingSide}-${FloatingAlignment}`

export interface FloatingOptions {
  offset?: number
  placement?: FloatingPlacement
  viewportPadding?: number
}

export interface FloatingPosition {
  floatingStyles: ComputedRef<CSSProperties>
  placement: Ref<FloatingPlacement>
  update: () => void
  x: Ref<number>
  y: Ref<number>
}

interface Coordinates {
  x: number
  y: number
}

interface Dimensions {
  height: number
  width: number
}

function opposite(side: FloatingSide): FloatingSide {
  return { bottom: 'top', left: 'right', right: 'left', top: 'bottom' }[side] as FloatingSide
}

function splitPlacement(placement: FloatingPlacement): [FloatingSide, FloatingAlignment | undefined] {
  const [side, alignment] = placement.split('-')
  return [side as FloatingSide, alignment as FloatingAlignment | undefined]
}

function coordinates(
  reference: DOMRect,
  floating: Dimensions,
  side: FloatingSide,
  alignment: FloatingAlignment | undefined,
  offset: number,
): Coordinates {
  let x = reference.left + (reference.width - floating.width) / 2
  let y = reference.top + (reference.height - floating.height) / 2

  if (side === 'top' || side === 'bottom') {
    if (alignment === 'start') x = reference.left
    if (alignment === 'end') x = reference.right - floating.width
    y = side === 'top' ? reference.top - floating.height - offset : reference.bottom + offset
  } else {
    if (alignment === 'start') y = reference.top
    if (alignment === 'end') y = reference.bottom - floating.height
    x = side === 'left' ? reference.left - floating.width - offset : reference.right + offset
  }

  return { x, y }
}

function fitsMainAxis(
  position: Coordinates,
  floating: Dimensions,
  side: FloatingSide,
  width: number,
  height: number,
  padding: number,
): boolean {
  if (side === 'top') return position.y >= padding
  if (side === 'bottom') return position.y + floating.height <= height - padding
  if (side === 'left') return position.x >= padding
  return position.x + floating.width <= width - padding
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), Math.max(min, max))
}

export function useFloating(
  referenceSource: MaybeRefOrGetter<HTMLElement | null | undefined>,
  floatingSource: MaybeRefOrGetter<HTMLElement | null | undefined>,
  options: FloatingOptions = {},
): FloatingPosition {
  const preferredPlacement = options.placement ?? 'bottom'
  const x = ref(0)
  const y = ref(0)
  const placement = ref<FloatingPlacement>(preferredPlacement)

  const update = (): void => {
    const referenceElement = toValue(referenceSource)
    const floatingElement = toValue(floatingSource)
    if (!referenceElement || !floatingElement || typeof window === 'undefined') return

    const referenceRect = referenceElement.getBoundingClientRect()
    const transformedFloatingRect = floatingElement.getBoundingClientRect()
    const floatingRect: Dimensions = {
      height: floatingElement.offsetHeight || transformedFloatingRect.height,
      width: floatingElement.offsetWidth || transformedFloatingRect.width,
    }
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    const padding = options.viewportPadding ?? 8
    const offset = options.offset ?? 8
    const [preferredSide, alignment] = splitPlacement(preferredPlacement)
    let resolvedSide = preferredSide
    let next = coordinates(referenceRect, floatingRect, resolvedSide, alignment, offset)

    if (
      !fitsMainAxis(
        next,
        floatingRect,
        resolvedSide,
        viewportWidth,
        viewportHeight,
        padding,
      )
    ) {
      const flippedSide = opposite(resolvedSide)
      const flipped = coordinates(referenceRect, floatingRect, flippedSide, alignment, offset)
      if (
        fitsMainAxis(
          flipped,
          floatingRect,
          flippedSide,
          viewportWidth,
          viewportHeight,
          padding,
        )
      ) {
        resolvedSide = flippedSide
        next = flipped
      }
    }

    x.value = clamp(next.x, padding, viewportWidth - floatingRect.width - padding)
    y.value = clamp(next.y, padding, viewportHeight - floatingRect.height - padding)
    placement.value = alignment ? `${resolvedSide}-${alignment}` : resolvedSide
  }

  useEventListener(() => (typeof window === 'undefined' ? undefined : window), 'resize', update)
  useEventListener(
    () => (typeof window === 'undefined' ? undefined : window),
    'scroll',
    update,
    true,
  )
  watchEffect(() => {
    toValue(referenceSource)
    toValue(floatingSource)
    update()
  })

  const floatingStyles = computed<CSSProperties>(() => ({
    left: `${x.value}px`,
    position: 'fixed',
    top: `${y.value}px`,
  }))

  return { floatingStyles, placement, update, x, y }
}
