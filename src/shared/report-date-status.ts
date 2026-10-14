export type ReportDateStatus = 'processing' | 'completed'

/** Reports use UTC statistical dates; the UI label does not describe source completeness. */
export const isCurrentReportPeriod = (statDate: unknown, now = new Date()): boolean => {
  const value = String(statDate ?? '').trim()
  const today = now.toISOString().slice(0, 10)
  const day = value.match(/^\d{4}-\d{2}-\d{2}(?=$|[ T])/)?.[0]
  return day ? day === today : value === today.slice(0, 7)
}

export const resolveReportDateStatus = (statDate: unknown, now = new Date()): ReportDateStatus =>
  isCurrentReportPeriod(statDate, now) ? 'processing' : 'completed'
