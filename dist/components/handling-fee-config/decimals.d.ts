/** Shift exact decimal strings; SQL/RPC fractions never pass through binary floats. */
export declare function shiftFeeDecimal(value: unknown, places: number): string;
