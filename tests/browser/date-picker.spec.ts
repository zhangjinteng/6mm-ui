import { expect, test } from '@playwright/test'

function dateKey(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

test('date picker commits single and range values', async ({ page }) => {
  await page.goto('/')

  const settlement = page.getByLabel('结算日期')
  await settlement.click()
  const settlementPanelId = await settlement.getAttribute('aria-controls')
  await expect(page.locator('.mm-date-picker__floating')).toHaveCSS('overflow', 'hidden')
  await page.locator(`#${settlementPanelId}`).getByRole('gridcell', { name: '2026-07-18' }).click()
  await expect(settlement).toHaveValue('2026-07-18')

  const range = page.getByLabel('回测窗口')
  const windowState = page.getByTestId('window-state')
  await range.click()
  const rangePanelId = await range.getAttribute('aria-controls')
  const rangePanel = page.locator(`#${rangePanelId}`)
  const rangePopup = page.locator('.mm-date-range-picker__panel')
  const rangeFloating = page.locator('.mm-date-range-picker__floating')
  const rangeTrigger = page.locator('.mm-date-picker--filter').filter({ has: range }).locator('.mm-input__control')
  await expect(rangeTrigger).toHaveCSS('height', '32px')
  await expect(rangeFloating).toHaveCSS('width', '312px')
  await expect(rangePopup.getByRole('button', { name: '上一年' })).toHaveCount(0)
  await expect(rangePopup.getByRole('button', { name: '下一年' })).toHaveCount(0)
  await expect(rangePopup.locator('.mm-date-panel__header strong')).toHaveText(/^\d{4}年\d{1,2}月$/)
  await expect(rangePanel.getByRole('gridcell', { name: '2026-07-12' })).toHaveCSS('height', '30px')
  await rangePanel.getByRole('gridcell', { name: '2026-07-12' }).click()
  await rangePanel.getByRole('gridcell', { name: '2026-07-22' }).click()
  await expect(range).toHaveValue('2026-07-12 → 2026-07-22')
  await expect(windowState).toContainText('2026-07-14 → 2026-07-20')
  await rangePopup.getByRole('button', { name: '确定' }).click()
  await expect(windowState).toContainText('2026-07-12 → 2026-07-22')

  const today = new Date()
  const last7Start = new Date(today)
  last7Start.setDate(today.getDate() - 6)
  const expectedShortcut = `${dateKey(last7Start)} → ${dateKey(today)}`

  await range.click()
  await rangePopup.getByRole('button', { name: '近7日' }).click()
  await expect(range).toHaveValue(expectedShortcut)
  await expect(windowState).toContainText('2026-07-12 → 2026-07-22')
  await rangePopup.getByRole('button', { name: '确定' }).click()
  await expect(windowState).toContainText(expectedShortcut)

  await range.click()
  await rangePopup.getByRole('button', { name: '昨日' }).click()
  await page.keyboard.press('Escape')
  await expect(range).toHaveValue(expectedShortcut)
  await expect(windowState).toContainText(expectedShortcut)
})
