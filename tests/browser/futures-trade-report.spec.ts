import { expect, test } from '@playwright/test'

for (const mode of ['agent', 'platform']) {
  for (const empty of [true, false]) {
    test(`${mode} report fills its flex parent with empty=${empty}`, async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 })
      await page.goto(`/futures-trade-report?mode=${mode}&empty=${empty}`)

      const report = page.locator('.mm-futures-trade-report')
      await expect(report).toBeVisible()
      if (empty) await expect(report.locator('[data-pro-table-state="empty"]')).toBeVisible()
      else await expect(report.locator('tbody tr')).toHaveCount(1)

      await expect.poll(async () => report.evaluate(element => {
        const parent = element.parentElement!.getBoundingClientRect()
        const rect = element.getBoundingClientRect()
        return Math.abs(parent.width - rect.width)
      })).toBeLessThanOrEqual(1)

      const fields = mode === 'platform'
        ? ['period', 'symbol', 'source_type', 'source_id', 'date_range']
        : ['period', 'symbol', 'date_range']
      for (const field of fields) {
        await expect(report.locator(`[data-query-field="${field}"]`)).toBeVisible()
      }
      await expect(report.getByRole('radio', { name: '日报', exact: true })).toBeVisible()
      await expect(report.getByRole('radio', { name: '月报', exact: true })).toBeVisible()

      await page.setViewportSize({ width: 390, height: 844 })
      await expect.poll(async () => report.evaluate(element => {
        const parent = element.parentElement!.getBoundingClientRect()
        const rect = element.getBoundingClientRect()
        return Math.max(Math.abs(parent.width - rect.width), rect.right - parent.right)
      })).toBeLessThanOrEqual(1)
      await report.getByRole('button', { name: /更多筛选/ }).click()
      const drawer = page.locator('[data-mm-component="drawer"]')
      await expect(drawer).toBeVisible()
      for (const field of fields) {
        await expect(drawer.locator(`[data-query-field="${field}"]`)).toBeVisible()
      }
    })
  }
}
