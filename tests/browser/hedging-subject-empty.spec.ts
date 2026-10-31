import { expect, test } from '@playwright/test'

test('empty subject cell fills the table body and stays centered when resized', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/hedging-subject-empty')
  await expect(page.getByRole('status', { name: '暂无主体配置' })).toBeVisible()
  for (const height of [900, 700]) {
    await page.setViewportSize({ width: 1440, height })
    const geometry = await page.evaluate(() => {
      const body = document.querySelector('.mm-table__scroll')!.getBoundingClientRect()
      const available = document.querySelector('.mm-hedging-subject-config__body')!.getBoundingClientRect()
      const header = document.querySelector('.mm-table__header-frame')!.getBoundingClientRect()
      const cell = document.querySelector('.mm-table__empty-cell')!.getBoundingClientRect()
      const empty = document.querySelector('.mm-empty')!.getBoundingClientRect()
      const image = document.querySelector('.mm-empty__image')!.getBoundingClientRect()
      const text = document.querySelector('.mm-empty__description')!.getBoundingClientRect()
      return { heightGap: available.height - header.height - cell.height, fillGap: cell.height - empty.height,
        centerGap: Math.abs((image.top + text.bottom) / 2 - (body.top + body.bottom) / 2) }
    })
    expect(Math.abs(geometry.heightGap)).toBeLessThanOrEqual(2)
    expect(Math.abs(geometry.fillGap)).toBeLessThanOrEqual(2)
    expect(geometry.centerGap).toBeLessThanOrEqual(2)
  }
  await page.getByRole('button', { name: '切换数据' }).click()
  await expect(page.getByText('布局测试', { exact: true })).toBeVisible()
  expect(await page.locator('.mm-table__body-table tbody tr').first().evaluate(row => row.getBoundingClientRect().height)).toBeLessThan(100)
  await page.getByRole('button', { name: '切换数据' }).click()
  await expect(page.getByRole('status', { name: '暂无主体配置' })).toBeVisible()
})
