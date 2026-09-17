import { useId as useVueId } from 'vue'

export function useId(prefix = 'mm'): string {
  return `${prefix}-${useVueId()}`
}
