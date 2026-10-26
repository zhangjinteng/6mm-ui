export declare const INT64_MAX = 9223372036854775807n;
export declare function unsigned(value: unknown, max?: bigint, zero?: boolean): value is string;
export declare function decimalText(value: unknown): string;
export declare function compareDecimal(a: string, b: string): number;
export declare function safeCount(value: string): number | null;
export declare function timeText(value: unknown): string;
export declare function roomLabel(duration: string, game?: string): string;
export declare function enumLabel(value: unknown): string;
export declare function errorMessage(error: unknown): string;
