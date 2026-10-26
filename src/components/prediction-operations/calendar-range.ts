/** Local calendar days map to an inclusive start and exclusive next-day boundary. */
export function todayRange(now = new Date()): [Date, Date] {
    return [new Date(now.getFullYear(), now.getMonth(), now.getDate()), new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)]
}
export function lastSevenDaysRange(now = new Date()): [Date, Date] {
    const [from, to] = todayRange(now)
    from.setDate(from.getDate() - 6)
    return [from, to]
}
function dayText(date: Date): string {
    return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-')
}
export function calendarSelection(range: readonly Date[] | undefined): [string, string] | null {
    if (!range || range.length !== 2 || range.some(date => !Number.isFinite(date.getTime())) || range[0] >= range[1]) return null
    return [dayText(range[0]), dayText(new Date(range[1].getTime() - 1))]
}
export function calendarRange(value: unknown): [Date, Date] | undefined {
    if (!Array.isArray(value) || value.length !== 2) return undefined
    const dates: Date[] = []
    for (const text of value) {
        if (typeof text !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(text)) return undefined
        const [year, month, day] = text.split('-').map(Number)
        const date = new Date(0)
        date.setFullYear(year, month - 1, day)
        date.setHours(0, 0, 0, 0)
        if (dayText(date) !== text) return undefined
        dates.push(date)
    }
    if (dates[0] > dates[1]) return undefined
    dates[1].setDate(dates[1].getDate() + 1)
    return [dates[0], dates[1]]
}
