import { UserAssetRow } from './types';
type MarketPrices = Readonly<Record<string, number | string | null | undefined>>;
export declare function formatUserAssetAmount(value: unknown): string;
export declare function calculateUserAssetPositionAmount(row: UserAssetRow, prices?: MarketPrices): number;
export declare function calculateUserAssetUnrealizedPnl(row: UserAssetRow, prices?: MarketPrices): number;
export declare function formatUserAssetPnl(value: number): string;
export {};
