import { formatTradeReportDecimal } from '../futures-trade-report/formatters'

const missing = (value: unknown) => value === null || value === undefined || value === ''
export const formatDistributionBalance = (value: unknown): string => missing(value) ? '-' : formatTradeReportDecimal(value, 2)
export const formatDistributionCount = (value: unknown): string => missing(value) ? '-' : formatTradeReportDecimal(value, 0)
/** Server percentages are percentage points, not fractions and not visible-page sums. */
export const formatDistributionShare = (value: unknown): string => missing(value) ? '-' : `${formatTradeReportDecimal(value, 2)}%`
