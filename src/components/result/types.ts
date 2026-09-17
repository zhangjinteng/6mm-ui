export type ResultStatus = 'error' | 'info' | 'success' | 'warning'

export interface ResultProps {
  status?: ResultStatus
  subtitle?: string
  title?: string
}
