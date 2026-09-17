export function debugWarn(scope: string, message: string | Error): void {
  if (!import.meta.env.DEV) return

  const detail = message instanceof Error ? message.message : message
  console.warn(`[MmUI:${scope}] ${detail}`)
}
