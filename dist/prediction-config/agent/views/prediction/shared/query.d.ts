import { Game } from '../../../api/prediction/types';
export declare const options: {
    result: string[];
    sort_direction: string[];
    status: string[];
    direction: string[];
    order_source: string[];
    business_status: string[];
    fund_status: string[];
};
export declare function makeQuery(game: Game, kind: 'orders' | 'rounds', input: Record<string, unknown>): Record<string, string | number>;
export declare function defaultQueryRange(_round: boolean, now?: Date): [Date, Date];
export declare class ReadGate {
    private generation;
    private controller?;
    next(): {
        signal: AbortSignal;
        current: () => boolean;
    };
    close(): void;
}
export declare const orderFields: string[];
export declare const roundFields: string[];
export declare function validatePage(value: unknown, game: Game, kind: 'orders' | 'rounds', page: number, size: number): void;
export declare function validateDetail(value: unknown, id: string, game: Game): void;
