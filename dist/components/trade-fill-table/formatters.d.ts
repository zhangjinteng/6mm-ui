import { TradeFillRow } from './types';
export declare function displayTradeFillValue(value: unknown): string;
export declare function formatTradeFillNumber(value: unknown): string;
export declare function formatTradeFillFixed(value: unknown, digits?: number): string;
export declare function tradeFillUserUid(row: TradeFillRow): string;
export declare function tradeFillExternalUserId(row: TradeFillRow): string;
