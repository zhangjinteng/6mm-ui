export type ReportDateStatus = 'processing' | 'completed';
/** Reports use UTC statistical dates; the UI label does not describe source completeness. */
export declare const isCurrentReportPeriod: (statDate: unknown, now?: Date) => boolean;
export declare const resolveReportDateStatus: (statDate: unknown, now?: Date) => ReportDateStatus;
