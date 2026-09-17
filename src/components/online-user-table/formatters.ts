import type { MmUILocaleMessages } from '../../locales'
import type { OnlineUserRow } from './types'

export function firstOnlineUserValue(...values: unknown[]): unknown {
  return values.find(
    (value) => value !== null && value !== undefined && String(value).trim() !== '',
  )
}

export function onlineUserLoginTime(row: OnlineUserRow): unknown {
  return firstOnlineUserValue(row.login_time, row.login_at, row.last_login_at)
}

export function onlineUserLastActiveTime(row: OnlineUserRow): unknown {
  return firstOnlineUserValue(
    row.last_active_at,
    row.last_activity_at,
    row.last_active_time,
    row.active_at,
    row.updated_at,
    onlineUserLoginTime(row),
  )
}

export function parseOnlineUserDateTime(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value < 10_000_000_000 ? value * 1000 : value
  }

  const text = String(value ?? '').trim()
  if (!text) return null
  if (/^\d+$/.test(text)) {
    const timestamp = Number(text)
    return timestamp < 10_000_000_000 ? timestamp * 1000 : timestamp
  }

  const timestamp = Date.parse(text.replace(' ', 'T'))
  return Number.isFinite(timestamp) ? timestamp : null
}

function padDatePart(value: number): string {
  return String(value).padStart(2, '0')
}

export function formatOnlineUserDateTime(value: unknown): string {
  const text = String(value ?? '').trim()
  if (!text) return '-'

  const normalized = text.replace('T', ' ')
  const matched = normalized.match(/^(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})(?::(\d{2}))?/)
  if (matched) return `${matched[1]} ${matched[2]}:${matched[3] ?? '00'}`

  const timestamp = parseOnlineUserDateTime(value)
  if (timestamp === null) return text

  const date = new Date(timestamp)
  return [
    `${date.getFullYear()}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`,
    `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}:${padDatePart(date.getSeconds())}`,
  ].join(' ')
}

export function formatOnlineUserVipLevel(value: unknown): string {
  if (value === null || value === undefined || value === '') return '-'
  const text = String(value).trim()
  return /^v/i.test(text) ? text.toUpperCase() : `V${text}`
}

export function formatOnlineUserDuration(
  row: OnlineUserRow,
  nowTimestamp: number,
  messages: MmUILocaleMessages['onlineUsers'],
): string {
  const loginTimestamp = parseOnlineUserDateTime(onlineUserLoginTime(row))
  if (loginTimestamp === null) return '-'

  const totalSeconds = Math.max(0, Math.floor((nowTimestamp - loginTimestamp) / 1000))
  if (totalSeconds < 60) return messages.lessThanMinute

  const totalMinutes = Math.floor(totalSeconds / 60)
  const days = Math.floor(totalMinutes / 1440)
  const hours = Math.floor((totalMinutes % 1440) / 60)
  const minutes = totalMinutes % 60

  if (days > 0) return hours > 0 ? messages.daysHours(days, hours) : messages.days(days)
  if (hours > 0) {
    return minutes > 0
      ? messages.hoursMinutes(hours, minutes)
      : messages.hours(hours)
  }
  return messages.minutes(minutes)
}
