import { expect, test } from '@playwright/test'

const pages = ['news/categories', 'news/list', 'academy/categories', 'academy/courses', 'help/categories', 'help/articles', 'feedback/list', 'announcement/categories', 'announcement/list']
for (const name of pages) test(`${name} keeps pagination visible and scrolls table rows internally`, async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto(`/cms-viewport?page=${name}`)
  const pagination = page.locator('.mm-pro-table__pagination')
  await expect(pagination).toBeVisible()
  await expect(page.getByText('ROW-1', { exact: true })).toBeVisible()
  const measure = () => page.evaluate(() => {
    const outer = document.querySelector('.cms-fixture-scroll')!
    const footer = document.querySelector('.mm-pro-table__pagination')!.getBoundingClientRect()
    const scroll = document.querySelector('.mm-table__scroll')!
    return { outerOverflow: outer.scrollHeight - outer.clientHeight, bottom: footer.bottom, height: innerHeight,
      tableOverflow: scroll.scrollHeight - scroll.clientHeight }
  })
  let rect = await measure()
  expect(rect.outerOverflow).toBeLessThanOrEqual(1)
  expect(rect.bottom).toBeLessThanOrEqual(rect.height - 11)
  expect(rect.tableOverflow).toBeGreaterThan(0)
  const footerBeforeScroll = rect.bottom
  await page.locator('.mm-table__scroll').evaluate(element => { element.scrollTop = 400 })
  expect((await measure()).bottom).toBe(footerBeforeScroll)
  expect(await page.locator('.cms-fixture-scroll').evaluate(element => element.scrollTop)).toBe(0)
  await page.setViewportSize({ width: 1280, height: 650 })
  rect = await measure()
  expect(rect.outerOverflow).toBeLessThanOrEqual(1)
  expect(rect.bottom).toBeLessThanOrEqual(rect.height - 11)
})

test('white-label site toolbar fits above the viewport table', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 800 })
  await page.goto('/cms-viewport?page=news/list&mode=white_label')
  await expect(page.locator('.mm-cms-site')).toBeVisible()
  await expect(page.getByText('ROW-1', { exact: true })).toBeVisible()
  const geometry = await page.evaluate(() => ({
    overflow: document.querySelector('.cms-fixture-scroll')!.scrollHeight - document.querySelector('.cms-fixture-scroll')!.clientHeight,
    bottom: document.querySelector('.mm-pro-table__pagination')!.getBoundingClientRect().bottom,
    height: innerHeight
  }))
  expect(geometry.overflow).toBeLessThanOrEqual(1)
  expect(geometry.bottom).toBeLessThanOrEqual(geometry.height - 11)
})
