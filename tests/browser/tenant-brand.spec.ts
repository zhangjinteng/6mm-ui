import { expect, test } from '@playwright/test'

test('template selection shows one card border for pointer and keyboard input', async ({ page }) => {
  await page.goto('/tenant-brand')
  await page.getByRole('tab', { name: '模板', exact: true }).click()

  const cards = page.locator('.mm-tenant-brand-settings__theme')
  const first = cards.nth(0)
  const second = cards.nth(1)
  const firstRadio = first.getByRole('radio')
  const secondRadio = second.getByRole('radio')
  await expect(firstRadio).toBeChecked()
  await expect(first).toHaveCSS('outline-style', 'none')
  await expect(first).toHaveCSS('box-shadow', 'none')

  await second.getByRole('img').click()
  await expect(secondRadio).toBeChecked()
  await expect(secondRadio).toBeFocused()
  await expect(second).toHaveCSS('outline-style', 'none')
  await expect(second).toHaveCSS('box-shadow', 'none')

  const templateTab = page.getByRole('tab', { name: '模板', exact: true })
  await templateTab.click()
  await page.keyboard.press('Tab')
  await expect(page.getByRole('combobox')).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(secondRadio).toBeFocused()
  await expect(second).toHaveCSS('outline-style', 'solid')
  await expect(second).toHaveCSS('outline-offset', '-2px')
  await expect(secondRadio).toHaveCSS('outline-style', 'none')

  await page.keyboard.press('ArrowLeft')
  await expect(firstRadio).toBeFocused()
  await expect(firstRadio).toBeChecked()
  await expect(first).toHaveCSS('outline-offset', '-2px')
  await expect(second).toHaveCSS('outline-style', 'none')
})
