/** Report dates use UTC; source completeness is separate from this display label. */
export const isCurrentTradeSummaryPeriod = (statDate: string, now = new Date()): boolean => {
  const today = now.toISOString().slice(0, 10)
  const period = statDate.trim()
  return period === today || period === today.slice(0, 7)
}
