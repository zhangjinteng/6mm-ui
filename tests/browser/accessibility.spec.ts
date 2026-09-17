import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'
import axe from 'axe-core'

declare global {
  interface Window {
    axe: typeof axe
  }
}

interface AxeViolationSummary {
  help: string
  id: string
  nodes: Array<{ failureSummary?: string; target: unknown }>
}

async function scanPage(page: Page): Promise<AxeViolationSummary[]> {
  await page.addScriptTag({ content: axe.source })
  return page.evaluate(async () => {
    const results = await window.axe.run(document, { resultTypes: ['violations'] })
    return results.violations.map(({ help, id, nodes }) => ({
      help,
      id,
      nodes: nodes.map(({ failureSummary, target }) => ({ failureSummary, target })),
    }))
  })
}

test('@a11y complete playground has no automated accessibility violations', async ({ page }) => {
  await page.goto('/')

  const invariants = await page.evaluate(() => {
    const ids = Array.from(document.querySelectorAll<HTMLElement>('[id]')).map((element) => element.id)
    return {
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
      unnamedButtons: Array.from(document.querySelectorAll('button')).filter((button) =>
        !(button.getAttribute('aria-label') || button.getAttribute('aria-labelledby') || button.textContent?.trim()),
      ).length,
    }
  })

  expect(invariants).toEqual({ duplicateIds: [], unnamedButtons: 0 })
  expect(await scanPage(page)).toEqual([])
})

test('@a11y dialog and prompt error states remain fully labelled', async ({ page }) => {
  await page.goto('/')

  const dialogTrigger = page.getByTestId('feedback-dialog-trigger')
  await dialogTrigger.click()
  const dialog = page.getByRole('dialog', { name: '策略发布确认' })
  await expect(dialog).toBeVisible()
  await expect(dialog.getByRole('button', { name: '关闭对话框' })).toBeFocused()
  expect(await scanPage(page)).toEqual([])

  await page.keyboard.press('Escape')
  await expect(dialogTrigger).toBeFocused()
  await page.getByTestId('feedback-prompt-trigger').click()
  const prompt = page.getByRole('dialog', { name: '审批备注' })
  await prompt.getByRole('button', { name: '确认' }).click()
  await expect(prompt.getByRole('alert')).toContainText('审批备注至少需要 4 个字符')
  await expect(prompt.getByRole('textbox', { name: '输入内容' })).toBeFocused()
  expect(await scanPage(page)).toEqual([])
})
