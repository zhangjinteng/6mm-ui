export type PaginationSize = 'lg' | 'md' | 'sm'

export interface PaginationProps {
  currentPage?: number
  disabled?: boolean
  pageSize?: number
  pageSizes?: number[]
  pagerCount?: number
  showJumper?: boolean
  showSizeChanger?: boolean
  showTotal?: boolean
  size?: PaginationSize
  total?: number
}
