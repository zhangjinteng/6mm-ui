export type LocationView = 'current' | 'history';
export type LocationInput = {
    order_id: string;
} | {
    scope: string;
    business_id: string;
};
export interface OrderLocation {
    segment: 'up-down' | 'high-low' | 'grid';
    order_id: string;
    created_at_ms?: string;
    view?: LocationView;
}
export declare function locationInput(query?: Record<string, unknown>): LocationInput | null;
export declare function locationPlan(target: OrderLocation, segment: string, view: LocationView, permitted: (permission: string) => boolean): {
    redirect: string | null;
    range: [Date, Date];
};
/** One lifecycle shared by locator and list result. The retry count travels with redirects. */
export declare class LinkSession {
    private version;
    private controller?;
    private attempts;
    private hops;
    constructor(retry?: unknown, hops?: unknown);
    begin(): {
        signal: AbortSignal;
        current: () => boolean;
    };
    cancel(): void;
    retry(): number;
    redirect(): number;
    get retryCount(): number;
}
