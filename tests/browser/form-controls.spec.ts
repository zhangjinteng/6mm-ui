import { expect, test } from '@playwright/test'

test('autocomplete and select support keyboard and pointer selection', async ({ page }) => {
  await page.goto('/')

  const market = page.getByLabel('市场搜索')
  await market.fill('btc')
  await expect(page.getByRole('option', { name: 'BTC / USDT · 永续' })).toBeVisible()
  await market.press('ArrowDown')
  await market.press('Enter')
  await expect(market).toHaveValue('BTC-USDT-PERP')

  const strategies = page.getByRole('combobox', { name: '策略类型' })
  await strategies.click()
  await page.getByRole('option', { name: '趋势跟随' }).click()
  await expect(strategies.locator('.mm-select__tag')).toHaveText(['网格策略', '趋势跟随'])
})

test('select filter input stays left-aligned beside selected tags', async ({ page }) => {
  await page.goto('/#strategies')

  const strategies = page.getByRole('combobox', { name: '策略类型' })
  const tag = strategies.locator('.mm-select__tag').last()
  const search = strategies.locator('.mm-select__search')
  const tagBox = await tag.boundingBox()
  const searchBox = await search.boundingBox()

  if (!tagBox || !searchBox) throw new Error('Strategy select layout is not measurable')

  expect(searchBox.x - (tagBox.x + tagBox.width)).toBeGreaterThanOrEqual(0)
  expect(searchBox.x - (tagBox.x + tagBox.width)).toBeLessThanOrEqual(6)
  await expect(search).toHaveCSS('text-align', 'left')
})

test('select values follow the sm, md, and lg font-size scale', async ({ page }) => {
  await page.goto('/')

  const fontSizes = await page.evaluate(() => {
    const host = document.createElement('div')
    host.innerHTML = ['sm', 'md', 'lg'].map((size) => `
      <div class="mm-select mm-select--${size}" data-mm-component="select" data-size="${size}">
        <span class="mm-popover__trigger">
          <span class="mm-select__control">
            <span class="mm-select__value">字号示例</span>
          </span>
        </span>
      </div>
    `).join('')
    document.body.append(host)

    return Object.fromEntries(['sm', 'md', 'lg'].map((size) => {
      const select = host.querySelector<HTMLElement>(`[data-size="${size}"]`)!
      const control = select.querySelector<HTMLElement>('.mm-select__control')!
      const value = select.querySelector<HTMLElement>('.mm-select__value')!
      return [size, {
        control: getComputedStyle(control).fontSize,
        value: getComputedStyle(value).fontSize,
      }]
    }))
  })

  expect(fontSizes).toEqual({
    sm: { control: '12px', value: '12px' },
    md: { control: '14px', value: '14px' },
    lg: { control: '16px', value: '16px' },
  })
})

test('form validation error has no top margin', async ({ page }) => {
  await page.goto('/#preview-06')

  await page.getByRole('button', { name: '验证并保存' }).click()

  const error = page.locator('.mm-form-item__error').first()
  await expect(error).toBeVisible()
  await expect(error).toHaveCSS('margin-top', '0px')
})
