export type StatisticTrend = 'down' | 'neutral' | 'up';
export interface StatisticProps {
    decimalSeparator?: string;
    formatter?: (value: number | string) => string;
    groupSeparator?: string;
    precision?: number;
    prefix?: string;
    suffix?: string;
    title?: string;
    trend?: StatisticTrend;
    value?: number | string;
}
