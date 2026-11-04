import { expect, test } from '@playwright/test'
import { mkdirSync } from 'node:fs'

test('feature and customer-service icons inherit their themed container colors', async ({ page }) => {
  await page.goto('/tenant-features')
  await expect(page.getByRole('switch', { name: '交易排行' })).toBeEnabled()
  await expect(page.getByRole('switch', { name: '6MM客服' })).toBeEnabled()
  // Remove the playground's primary override so light/dark tokens can be tested.
  await page.addStyleTag({ content: '.features-preview { --mm-color-primary: inherit; }' })
  const icons = [
    '.mm-tenant-feature-settings__icon > .mm-icon',
    '.mm-tenant-feature-settings__group-icon > .mm-icon',
    '.mm-tenant-feature-settings__card-icon > .mm-icon',
    '.mm-tenant-feature-settings__updated > span > .mm-icon',
  ].join(', ')
  const mismatches = () => page.locator(icons).evaluateAll(elements => elements
    .filter(el => getComputedStyle(el).color !== getComputedStyle(el.parentElement!).color)
    .map(el => ({ parent: el.parentElement!.className, actual: getComputedStyle(el).color, expected: getComputedStyle(el.parentElement!).color })))
  for (const theme of ['light', 'dark']) {
    await page.evaluate(theme => { document.documentElement.dataset.mmTheme = theme }, theme)
    await expect.poll(mismatches).toEqual([])
  }
  await page.locator('.mm-tenant-feature-settings').evaluate(el => (el as HTMLElement).style.setProperty('--mm-color-primary', '#2563eb'))
  await expect.poll(mismatches).toEqual([])
  const customer = page.getByRole('switch', { name: '6MM客服' })
  await customer.click()
  await expect(customer).toHaveAttribute('aria-checked', 'true')
  await expect.poll(mismatches).toEqual([])
  await page.getByRole('switch', { name: '交易排行' }).click()
  await expect.poll(mismatches).toEqual([])
  await page.evaluate(() => { document.documentElement.dataset.mmTheme = 'light' })
  await page.locator('.mm-tenant-feature-settings').evaluate(el => (el as HTMLElement).style.removeProperty('--mm-color-primary'))
  await page.getByRole('switch', { name: '交易排行' }).click()
  await expect.poll(mismatches).toEqual([])
  await page.screenshot({ path: '/tmp/tenant-feature-icons-themed.png', animations: 'disabled' })
})

test('full-page feature settings keep their footer visible and support keyboard, discard and save', async ({ page }) => {
  const output = process.env.FEATURES_QA_OUTPUT || '/tmp/tenant-features-qa'
  mkdirSync(output, { recursive: true })
  await page.setViewportSize({ width: 1440, height: 900 })
  await page.goto('/tenant-features')
  const toggle = page.getByRole('switch', { name: '交易排行' })
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
  await page.screenshot({ path: output + '/agent-desktop.png', fullPage: true })
  await toggle.focus(); await page.keyboard.press('Space')
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByRole('button', { name: '保存配置' })).toBeEnabled()
  await page.getByRole('button', { name: '放弃修改' }).click()
  await expect(toggle).toHaveAttribute('aria-checked', 'true')
  await toggle.click(); await page.getByRole('button', { name: '保存配置' }).click()
  await expect(page.locator('.mm-tenant-feature-settings__footer [role="status"]')).toContainText('当前配置已保存')
  await expect(toggle).toHaveAttribute('aria-checked', 'false')
  await expect(page.getByRole('button', { name: '保存配置' })).toBeDisabled()
  await page.setViewportSize({ width: 390, height: 844 })
  await page.screenshot({ path: output + '/agent-mobile.png', fullPage: true })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  const footer = await page.locator('.mm-tenant-feature-settings__footer').boundingBox()
  expect(footer!.y + footer!.height).toBeLessThanOrEqual(844)
  await page.goto('/tenant-features?readonly')
  await expect(toggle).toBeDisabled()
  await expect(page.getByRole('button', { name: '保存配置' })).toBeDisabled()
  await expect(page.locator('.mm-tenant-feature-settings__footer [role="status"]')).toContainText('只读模式')
})
