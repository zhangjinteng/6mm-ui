export interface PlainDate {
    day: number;
    month: number;
    year: number;
}
export interface CalendarCell extends PlainDate {
    currentMonth: boolean;
    value: string;
    weekend: boolean;
}
export declare function isLeapYear(year: number): boolean;
export declare function daysInMonth(year: number, month: number): number;
export declare function formatDateValue(date: PlainDate): string;
export declare function parseDateValue(value: string): PlainDate | null;
export declare function addDays(value: string, amount: number): string;
export declare function addMonths(value: string, amount: number): string;
export declare function compareDateValues(left: string, right: string): number;
export declare function todayDateValue(): string;
export declare function formatDate(value: string, pattern?: string): string;
export declare function parseFormattedDate(input: string, pattern?: string): string | null;
export declare function buildCalendarMonth(monthValue: string, firstDayOfWeek?: 0 | 1): CalendarCell[];
