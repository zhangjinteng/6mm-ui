import { GridOrder, GridPage, OrderView } from '../types';
export declare const statuses: (view: OrderView) => number[];
export declare function epoch(value: string): string;
export declare function serializeQuery(view: OrderView, values: Record<string, unknown>, page: number, size: number): string;
export declare function validateOrder(value: unknown, view?: OrderView, orderId?: string, detail?: boolean): GridOrder;
export declare function validatePage(value: unknown, view: OrderView, page: number, size: number): GridPage;
export declare class ReadGate {
    private generation;
    private controller?;
    close(): void;
    next(): {
        signal: AbortSignal;
        current: () => boolean;
    };
}
