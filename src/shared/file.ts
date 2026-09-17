let fileSequence = 0

export function createFileUid(prefix = 'mm-file'): string {
  fileSequence += 1
  return `${prefix}-${Date.now().toString(36)}-${fileSequence.toString(36)}`
}

export function acceptsFile(file: Pick<File, 'name' | 'type'>, accept?: string): boolean {
  if (!accept?.trim()) return true
  const name = file.name.toLowerCase()
  const mime = file.type.toLowerCase()
  return accept.split(',').some((entry) => {
    const rule = entry.trim().toLowerCase()
    if (!rule) return false
    if (rule.startsWith('.')) return name.endsWith(rule)
    if (rule.endsWith('/*')) return mime.startsWith(rule.slice(0, -1))
    return mime === rule
  })
}

export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const value = bytes / 1024 ** index
  return `${Number(value.toFixed(value >= 10 || index === 0 ? 0 : 1))} ${units[index]}`
}
