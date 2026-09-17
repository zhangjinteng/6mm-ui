export declare function conditionOrderTriggerOperator(triggerType?: string, side?: string): '≤' | '≥';
export declare function formatConditionOrderLeverage(value: unknown): string;
export declare function formatConditionOrderQuantity(value: unknown, accountChange?: boolean): string;
export declare function formatConditionOrderPrice(value: unknown): string;
export declare function isCancelableConditionOrderStatus(value: unknown): boolean;
