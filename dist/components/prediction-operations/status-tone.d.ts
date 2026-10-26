export type StatusTone = 'success' | 'danger' | 'primary' | 'warning' | 'neutral';
type PredictionDomain = 'direction' | 'business' | 'fund' | 'round';
export declare function predictionTone(domain: PredictionDomain, value: unknown): StatusTone;
export declare function orderStatusParts(row: Record<string, unknown>): {
    key: "business_status" | "fund_status";
    value: string;
    tone: StatusTone;
}[];
export declare function gridStatusTone(value: unknown): StatusTone;
/** Display projection only; original business/fund fields remain available in details. */
export declare function orderStatusSummary(row: Record<string, unknown>): {
    key: string;
    value: string;
    tone: StatusTone;
} | null;
export declare function orderStatusTitle(row: Record<string, unknown>): string;
/** Inspect decimal text directly, including sub-Number precision values and negative zero. */
export declare function profitTone(value: unknown): StatusTone;
export {};
