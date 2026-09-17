import { AccountChangeLogMode } from './types';
export declare function formatAccountChangeAmount(value: unknown): string;
export declare function formatAccountChangeBalance(value: unknown): string;
export declare function resolveAccountChangeType(value: unknown, amount: unknown, mode: AccountChangeLogMode): string;
