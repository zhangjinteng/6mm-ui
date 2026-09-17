import type { PaginationSize } from '../pagination'

export interface CursorPaginationProps {
  ariaLabel?: string
  currentPage?: number
  disabled?: boolean
  hasMore?: boolean
  hasPrevious?: boolean
  loading?: boolean
  nextLabel?: string
  previousLabel?: string
  size?: PaginationSize
}
