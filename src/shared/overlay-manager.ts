const activeOverlays: number[] = []
let nextOverlayId = 0

export interface OverlayHandle {
  isTopmost: () => boolean
  release: () => void
  zIndex: number
}

export function acquireOverlay(baseZIndex = 1200): OverlayHandle {
  const id = ++nextOverlayId
  activeOverlays.push(id)
  let released = false

  return {
    isTopmost: () => !released && activeOverlays.at(-1) === id,
    release: () => {
      if (released) return
      released = true
      const index = activeOverlays.indexOf(id)
      if (index >= 0) activeOverlays.splice(index, 1)
    },
    zIndex: baseZIndex + id * 2,
  }
}
