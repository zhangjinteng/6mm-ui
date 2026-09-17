import type { QueryBarField, QueryBarFieldValue, QueryBarValue } from './types'

export function cloneQueryBarFieldValue(value: QueryBarFieldValue): QueryBarFieldValue {
  return Array.isArray(value) ? [value[0], value[1]] : value
}

export function cloneQueryBarValue(value: QueryBarValue): QueryBarValue {
  return Object.fromEntries(
    Object.entries(value).map(([key, fieldValue]) => [key, cloneQueryBarFieldValue(fieldValue)]),
  )
}

function emptyQueryBarFieldValue(field: QueryBarField): QueryBarFieldValue {
  return field.type === 'date-range' ? null : ''
}

export function queryBarFieldDefault(field: QueryBarField): QueryBarFieldValue {
  return cloneQueryBarFieldValue(field.defaultValue !== undefined
    ? field.defaultValue
    : emptyQueryBarFieldValue(field))
}

export function createQueryBarValue(fields: QueryBarField[]): QueryBarValue {
  return Object.fromEntries(fields.map((field) => [field.key, queryBarFieldDefault(field)]))
}

export function materializeQueryBarValue(value: QueryBarValue, fields: QueryBarField[]): QueryBarValue {
  const next = cloneQueryBarValue(value)
  for (const field of fields) {
    if (next[field.key] === undefined) next[field.key] = queryBarFieldDefault(field)
  }
  return next
}
