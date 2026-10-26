export interface Field {
    key: string;
    label: string;
    kind?: 'amount' | 'enum' | 'time' | 'room';
}
export declare const orderFields: Field[];
export declare const roundFields: Field[];
export declare function fieldText(row: Record<string, unknown>, field: Field, game: string): string;
export declare function operationHistoryDetailFields(game: 'UP_DOWN' | 'HIGH_LOW'): Field[];
export declare function operationTableFields(game: string, view: string): Field[];
export declare function tableFieldText(row: Record<string, unknown>, field: Field, game: string): string;
