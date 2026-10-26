/** Local calendar days map to an inclusive start and exclusive next-day boundary. */
export declare function todayRange(now?: Date): [Date, Date];
export declare function calendarSelection(range: readonly Date[] | undefined): [string, string] | null;
export declare function calendarRange(value: unknown): [Date, Date] | undefined;
