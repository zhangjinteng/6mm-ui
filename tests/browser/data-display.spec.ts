import { expect, test } from '@playwright/test'

test('image, calendar, table, and pagination compose into a controlled data workflow', async ({ page }) => {
  await page.goto('/')

  const image = page.getByTestId('evidence-image')
  const previewTrigger = image.getByRole('button', { name: '预览账户权益曲线' })
  await previewTrigger.click()
  const dialog = page.getByRole('dialog', { name: '账户权益曲线预览' })
  await expect(dialog).toBeVisible()
  await page.keyboard.press('ArrowRight')
  await expect(dialog.getByText('2 / 2')).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(dialog).toBeHidden()
  await expect(previewTrigger).toBeFocused()

  const calendar = page.getByTestId('audit-calendar')
  await calendar.getByRole('gridcell', { name: '2026-07-18' }).click()
  await expect(page.getByText('当前选择 2026-07-18')).toBeVisible()

  const table = page.getByTestId('audit-table')
  await table.getByRole('button', { name: '按盈亏 USDT升序排列' }).click()
  await expect(table.getByRole('columnheader', { name: '按盈亏 USDT降序排列' })).toHaveAttribute('aria-sort', 'ascending')
  await table.getByRole('checkbox', { name: '选择 网格 #2048' }).check()
  await expect(page.getByText('1 SELECTED')).toBeVisible()
  await table.getByRole('button', { name: '展开 网格 #2048' }).click()
  await expect(table.getByText('最近变更由 operator-07 提交，风险检查与签名验证均已记录。')).toBeVisible()

  const pagination = page.getByTestId('audit-pagination')
  await expect(pagination.getByText('共 30 条')).toBeVisible()
  await pagination.getByRole('button', { name: '下一页' }).click()
  await expect(table.getByText('网格 #1991')).toBeVisible()

  await pagination.getByRole('button', { name: '第 10 页' }).click()
  await expect(pagination.getByRole('button', { name: '第 10 页' })).toHaveAttribute('aria-current', 'page')
  await expect(table.getByText('网格 #2070')).toBeVisible()
})
