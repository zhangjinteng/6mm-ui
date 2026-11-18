import { IconName } from '../icon';
export type DashboardPeriod = 'today' | 'yesterday' | '7' | '30' | 'month' | 'last-month';
export interface DashboardPayload {
    scope: 'platform' | 'tenant' | 'merchant';
    range: {
        start: string;
        end: string;
    };
    currency: string;
    blocks: Record<string, {
        state: 'ready' | 'error';
        data: any;
    }>;
    merchant_users?: any;
}
export interface DashboardCard {
    key: string;
    label: string;
    value: unknown;
    unit?: string;
    icon: IconName;
    detail?: string;
}
export interface DashboardPanel {
    key: string;
    title: string;
    subtitle?: string;
    kind: 'line' | 'bar' | 'donut' | 'rank' | 'list';
    series?: {
        name: string;
        values: (number | null)[];
    }[];
    labels?: string[];
    items?: {
        name: string;
        value: unknown;
        detail?: string;
        display?: string;
    }[];
    unit?: string;
    note?: string;
}
export declare const dashboardPeriods: {
    label: string;
    value: string;
}[];
export declare const dashboardPalette: string[];
export declare function dashboardNumber(value: unknown, unit?: string): string;
export declare function dashboardView(payload: DashboardPayload, view: string): {
    cards: DashboardCard[];
    panels: DashboardPanel[];
};
export declare function coverageNote(coverage: any): string;
export declare function statusLabel(status: string): string;
export declare function dashboardChart(panel: DashboardPanel): Record<string, any>;
