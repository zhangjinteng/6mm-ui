import { expect, test } from '@playwright/test'

const pages = ['news/categories', 'news/list', 'academy/categories', 'academy/courses', 'help/categories', 'help/articles',
  'feedback/list', 'announcement/categories', 'announcement/list', 'localization/translations']
for (const name of pages) test(`${name}: no site request/loading interstitial or duplicate bootstrap`, async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(String(error)))
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto(`/cms-viewport?page=${name}&mode=white_label&inline=1`)
  if (name !== 'localization/translations') await expect(page.locator('.mm-pro-table')).toBeVisible()
  else await expect(page.locator('.translation-toolbar')).toBeVisible()
  await expect(page.getByText('正在加载站点…', { exact: true })).toHaveCount(0)
  if (name !== 'localization/translations') {
    await expect(page.getByText('ROW-1', { exact: true })).toBeVisible()
    await expect(page.locator('.mm-cms-site')).toHaveCount(0)
  } else {
    await expect(page.locator('.mm-cms-site')).toBeVisible()
    await expect(page.locator('.mm-cms-site select')).toHaveValue('1')
  }
  const calls: string[] = await page.evaluate(() => (window as any).cmsRequests)
  expect(calls).not.toContain('/cms/sites')
  expect(calls.filter(url => url.endsWith('/metadata'))).toHaveLength(name === 'academy/categories' ? 0 : 1)
  if (name !== 'localization/translations') {
    expect(calls.filter(url => !url.endsWith('/metadata'))).toHaveLength(1)
    const rect = await page.locator('.mm-pro-table__pagination').boundingBox()
    expect(rect!.y + rect!.height).toBeLessThanOrEqual(789)
  }
  expect(errors).toEqual([])
  if (name === 'news/list') await page.screenshot({ path: '/tmp/agent-cms-inline-news.png', fullPage: true })
})
