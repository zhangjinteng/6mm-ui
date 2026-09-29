import { UserContractAccount, UserContractMetrics, UserContractOrderGroup, UserContractPositionGroup, UserContractRow } from './types';
/** Merge one page only. key(row) is the identifier used by TradeKernel on that host. */
export declare function mergeUserContractRows<Row extends UserContractRow>(rows: Row[], sources: {
    accounts?: UserContractAccount[];
    positions?: UserContractPositionGroup[];
    orders?: UserContractOrderGroup[];
    metrics?: UserContractMetrics[];
    marketPrice?: (symbol: string) => number | null | undefined;
}, key?: (row: Row) => number | string): Row[];
