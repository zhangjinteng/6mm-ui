export declare const hasPermission: (permissions: readonly string[], permission: string) => boolean;
export declare function dateRangeQuery(range: unknown, timeField?: string): Record<string, string>;
export declare function defaultQueryRange(view: 'rounds' | 'current' | 'history', now?: Date): [Date, Date];
export declare const orderChoices: {
    direction: string[];
    order_source: string[];
    business_status: string[];
    fund_status: string[];
    result: string[];
    sort_field: string[];
    sort_direction: string[];
};
export declare const roundChoices: {
    status: string[];
    result: string[];
    sort_field: string[];
    sort_direction: string[];
};
export declare function buildQuery(game: 'UP_DOWN' | 'HIGH_LOW', round: boolean, filters: Record<string, unknown>, page: number, pageSize: number): Record<string, string | number>;
export declare function validateStrategy(s: Record<string, unknown>): string[];
