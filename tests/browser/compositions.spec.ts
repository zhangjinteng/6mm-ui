import { expect, test } from '@playwright/test'

test('@composition form validation recovers without losing coordinated control state', async ({ page }) => {
  await page.goto('/')

  const account = page.getByLabel('操作员账号')
  const accountField = page.locator('.mm-form-item[data-prop="account"]')
  const form = page.locator('#preview-06 .mm-form')
  const initialFormHeight = await form.evaluate((element) => element.getBoundingClientRect().height)
  await page.getByRole('button', { name: '验证并保存' }).click()
  await expect(accountField.getByRole('alert')).toHaveText('请输入操作员账号')
  await expect(account).toBeFocused()
  await expect.poll(async () => form.evaluate((element) => element.getBoundingClientRect().height)).toBe(initialFormHeight)

  await account.fill('reserved')
  await account.blur()
  await expect(accountField.getByRole('alert')).toHaveText('该账号已被保留')

  await account.fill('operator-12')
  await account.blur()
  await expect(accountField.getByRole('alert')).toHaveCount(0)
  await page.getByLabel('并发上限').fill('5')
  await page.locator('label.mm-checkbox').filter({ hasText: '邮件' }).click()
  await page.locator('label.mm-radio').filter({ hasText: 'Taker' }).click()
  await expect(page.getByRole('checkbox', { name: '邮件' })).toBeChecked()
  await expect(page.getByRole('radio', { name: 'Taker' })).toBeChecked()
  await page.getByRole('button', { name: '验证并保存' }).click()

  const consolePanel = page.locator('.form-console')
  await expect(consolePanel.getByText('SUCCESS', { exact: true })).toBeVisible()
  await expect(consolePanel).toContainText('operator-12')
  await expect(consolePanel).toContainText('api + email')
  await expect(consolePanel).toContainText('TAKER')
  await expect(page.getByLabel('组件库状态')).toContainText('RUN COUNT02')
})

test('@composition strategy preparation remains stateful through release confirmation', async ({ page }) => {
  await page.goto('/')

  const market = page.getByLabel('市场搜索')
  await market.fill('eth')
  await page.getByRole('option', { name: 'ETH / USDT · 永续' }).click()

  const strategies = page.getByRole('combobox', { name: '策略类型' })
  await strategies.click()
  await page.getByRole('option', { name: '趋势跟随' }).click()

  const settlement = page.getByLabel('结算日期')
  await settlement.click()
  const panelId = await settlement.getAttribute('aria-controls')
  await page.locator(`#${panelId}`).getByRole('gridcell', { name: '2026-07-18' }).click()

  const upload = page.getByTestId('advanced-upload')
  await upload.locator('input[type="file"]').setInputFiles({
    buffer: Buffer.from('{"strategy":"trend"}'),
    mimeType: 'application/json',
    name: 'trend-strategy.json',
  })
  await expect(upload.locator('.mm-upload__file')).toHaveClass(/is-success/)

  const state = page.locator('.advanced-state')
  await expect(state).toContainText('ETH-USDT-PERP')
  await expect(state).toContainText('grid + trend')
  await expect(state).toContainText('2026-07-18')

  await page.getByTestId('release-steps').getByRole('button', { name: /执行上线/ }).click()
  await expect(page.getByTestId('release-steps').locator('.mm-step').nth(2)).toHaveAttribute('aria-current', 'step')

  await page.getByTestId('feedback-dialog-trigger').click()
  const dialog = page.getByRole('dialog', { name: '策略发布确认' })
  await dialog.getByRole('button', { name: '确认发布' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page.locator('.feedback-console')).toContainText('DIALOG_CONFIRMED')

  await expect(state).toContainText('ETH-USDT-PERP')
  await expect(state).toContainText('grid + trend')
  await expect(state).toContainText('2026-07-18')
})
