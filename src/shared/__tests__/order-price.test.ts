import { describe, expect, it } from 'vitest'

import { formatCurrentOrderPrice } from '../../components/current-order-table/formatters'
import { formatHistoryOrderPrice } from '../../components/history-order-table/formatters'

describe.each([
  ['current orders', formatCurrentOrderPrice],
  ['history orders', formatHistoryOrderPrice],
] as const)('%s price formatting', (_name, format) => {
  it.each([
    ['0.100', '0.1'],
    ['0.0033', '0.0033'],
    ['2338.9300', '2338.93'],
    ['82726.000000000000000000', '82726'],
    ['70000.126', '70000.126'],
    ['1.23456', '1.2346'],
    ['1.99999', '2'],
    ['0.00001', '0'],
    ['-0.00001', '0'],
    ['3.3e-3', '0.0033'],
    [0, '0'],
    [null, '0'],
    [undefined, '0'],
    ['invalid', '0'],
    [Infinity, '0'],
  ])('formats %s as %s with no more than four decimals', (value, expected) => {
    expect(format(value)).toBe(expected)
  })
})
