import { expect, test } from '@playwright/test'

test('feedback components coordinate live regions, overlays, focus, and services', async ({ page }) => {
  await page.goto('/')

  const tooltipTrigger = page.getByTestId('feedback-tooltip')
  await tooltipTrigger.focus()
  const tooltip = page.getByRole('tooltip')
  await expect(tooltip).toContainText('支持 hover 与键盘 focus')
  await expect(tooltipTrigger).toHaveAttribute('aria-describedby', await tooltip.getAttribute('id') ?? '')
  await page.keyboard.press('Escape')
  await expect(tooltip).toHaveCount(0)

  await page.getByTestId('feedback-message-trigger').click()
  const queuedMessage = page.locator('.mm-message-stack .mm-message')
  await expect(queuedMessage).toContainText('策略配置已进入发布队列')
  await queuedMessage.getByRole('button', { name: '关闭消息' }).click()
  await expect(queuedMessage).toHaveCount(0)

  const dialogTrigger = page.getByTestId('feedback-dialog-trigger')
  await dialogTrigger.click()
  const dialog = page.getByRole('dialog', { name: '策略发布确认' })
  await expect(dialog).toBeVisible()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('hidden')
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(dialogTrigger).toBeFocused()
  await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('')

  await page.getByTestId('feedback-drawer-trigger').click()
  const drawer = page.getByRole('dialog', { name: '运行详情' })
  await expect(drawer).toBeVisible()
  await page.locator('[data-mm-component="drawer"]').click({ position: { x: 6, y: 6 } })
  await expect(drawer).toHaveCount(0)

  await page.getByTestId('feedback-prompt-trigger').click()
  const prompt = page.getByRole('dialog', { name: '审批备注' })
  await expect(prompt).toBeVisible()
  await prompt.getByRole('button', { name: '确认' }).click()
  await expect(prompt.getByRole('alert')).toContainText('审批备注至少需要 4 个字符')
  await prompt.getByRole('textbox', { name: '输入内容' }).fill('风险复核通过')
  await prompt.getByRole('button', { name: '确认' }).click()
  await expect(prompt).toHaveCount(0)
  await expect(page.getByText('PROMPT_风险复核通过')).toBeVisible()

  await page.getByTestId('feedback-loading-trigger').click()
  const loadingRegion = page.getByTestId('feedback-loading-region')
  await expect(loadingRegion.getByRole('status', { name: '正在同步审计记录' })).toBeVisible()
})
