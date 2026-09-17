import { onScopeDispose, ref, toValue } from 'vue'
import type { MaybeRefOrGetter, Ref } from 'vue'

interface DocumentLockState {
  count: number
  overflow: string
}

export interface ScrollLock {
  isLocked: Ref<boolean>
  lock: () => void
  unlock: () => void
}

const documentLocks = new WeakMap<Document, DocumentLockState>()

export function useLockScroll(
  source?: MaybeRefOrGetter<Document | null | undefined>,
): ScrollLock {
  const isLocked = ref(false)
  let lockedDocument: Document | undefined

  const resolveDocument = (): Document | undefined => {
    if (source !== undefined) return toValue(source) ?? undefined
    return typeof document === 'undefined' ? undefined : document
  }

  const lock = (): void => {
    if (isLocked.value) return

    const targetDocument = resolveDocument()
    if (!targetDocument?.body) return

    const state = documentLocks.get(targetDocument) ?? {
      count: 0,
      overflow: targetDocument.body.style.overflow,
    }
    if (state.count === 0) targetDocument.body.style.overflow = 'hidden'
    state.count += 1
    documentLocks.set(targetDocument, state)
    lockedDocument = targetDocument
    isLocked.value = true
  }

  const unlock = (): void => {
    if (!isLocked.value || !lockedDocument) return

    const state = documentLocks.get(lockedDocument)
    if (state) {
      state.count = Math.max(0, state.count - 1)
      if (state.count === 0) {
        lockedDocument.body.style.overflow = state.overflow
        documentLocks.delete(lockedDocument)
      }
    }
    lockedDocument = undefined
    isLocked.value = false
  }

  onScopeDispose(unlock)

  return { isLocked, lock, unlock }
}
