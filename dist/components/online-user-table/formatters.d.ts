import { MmUILocaleMessages } from '../../locales';
import { OnlineUserRow } from './types';
export declare function firstOnlineUserValue(...values: unknown[]): unknown;
export declare function onlineUserLoginTime(row: OnlineUserRow): unknown;
export declare function onlineUserLastActiveTime(row: OnlineUserRow): unknown;
export declare function parseOnlineUserDateTime(value: unknown): number | null;
export declare function formatOnlineUserDateTime(value: unknown): string;
export declare function formatOnlineUserVipLevel(value: unknown): string;
export declare function formatOnlineUserDuration(row: OnlineUserRow, nowTimestamp: number, messages: MmUILocaleMessages['onlineUsers']): string;
