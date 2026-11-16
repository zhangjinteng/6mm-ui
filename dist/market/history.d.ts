export declare const metricOptions: readonly [{
    readonly label: "标记价格";
    readonly value: "mark_price";
}, {
    readonly label: "指数价格";
    readonly value: "index_price";
}];
export declare const intervalOptions: readonly [{
    readonly label: "1分钟";
    readonly value: "1m";
}, {
    readonly label: "3分钟";
    readonly value: "3m";
}, {
    readonly label: "5分钟";
    readonly value: "5m";
}, {
    readonly label: "15分钟";
    readonly value: "15m";
}, {
    readonly label: "30分钟";
    readonly value: "30m";
}, {
    readonly label: "1小时";
    readonly value: "1h";
}, {
    readonly label: "2小时";
    readonly value: "2h";
}, {
    readonly label: "4小时";
    readonly value: "4h";
}, {
    readonly label: "6小时";
    readonly value: "6h";
}, {
    readonly label: "12小时";
    readonly value: "12h";
}, {
    readonly label: "1天";
    readonly value: "1d";
}, {
    readonly label: "1周";
    readonly value: "1w";
}, {
    readonly label: "1月";
    readonly value: "1mon";
}];
export declare const rangeOptions: readonly [{
    readonly label: "近24小时";
    readonly value: "24h";
}, {
    readonly label: "近7天";
    readonly value: "7d";
}, {
    readonly label: "近30天";
    readonly value: "30d";
}];
export type HistoryMetric = (typeof metricOptions)[number]['value'];
export type HistoryInterval = (typeof intervalOptions)[number]['value'];
export type HistoryRange = (typeof rangeOptions)[number]['value'];
export declare const defaultMetric: HistoryMetric;
export declare function valueColumnTitles(): string[];
export declare function formatHistoryValue(value: unknown): string;
export declare function formatHistoryTime(value: unknown, timeZone?: string): string;
