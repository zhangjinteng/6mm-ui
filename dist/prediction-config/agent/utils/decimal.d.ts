/**
 * Converts a decimal value to plain notation while preserving all meaningful
 * fractional digits. Trailing fractional zeroes and negative zero are removed.
 */
export declare function normalizeDecimal(value: unknown): string | null;
export declare function formatSignedDecimal(value: unknown): string;
