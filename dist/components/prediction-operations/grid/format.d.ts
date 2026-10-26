export declare const exact: (value: unknown) => string;
export declare function localTime(ms: number): string;
export declare function timestamp(value: unknown): string;
export declare const fields: Record<string, string>;
export declare const listFields: string[];
export declare const groups: {
    title: string;
    keys: string[];
}[];
export declare const statusNames: string[];
export declare const display: (key: string, value: unknown) => string;
export declare function errorInfo(error: unknown): {
    code: string;
    unauthorized: boolean;
    trace: string;
};
export declare const messages: Record<string, string>;
export declare const tableLabels: Record<string, string>;
export declare function gridTableKeys(view: string, platform?: boolean): string[];
export declare function gridTableDisplay(key: string, row: Record<string, unknown>, baseDisplay?: (key: string, value: unknown) => string): string;
