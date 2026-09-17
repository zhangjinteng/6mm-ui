import { LiquidationRow } from './types';
export declare function displayLiquidationValue(value: unknown): string;
export declare function formatLiquidationDecimal(value: unknown, maximumFractionDigits: number, minimumFractionDigits?: number): string;
export declare function liquidationUserUid(row: LiquidationRow): string;
