import { expect, test } from '@playwright/test'

test('cursor pagination previews sequential navigation and the pro-table summary', async ({ page }) => {
  await page.goto('/')

  const catalog = page.getByRole('region', { name: '组件预览目录' })
  await catalog.getByRole('textbox', { name: '搜索组件' }).fill('Cursor Pagination')

  const cursorEntry = catalog.locator('[data-component-name="Cursor Pagination"]')
  await expect(cursorEntry).toBeVisible()
  await cursorEntry.click()

  const drawer = page.getByRole('dialog', { name: '组件技术信息' })
  const cursorPreview = drawer.getByTestId('live-component-preview')
  const cursor = cursorPreview
    .locator('[data-preview-size="md"]')
    .locator('[data-mm-component="cursor-pagination"]')

  await expect(cursor).toBeVisible()
  await expect(cursor.getByText('2', { exact: true })).toHaveAttribute('aria-current', 'page')
  await cursor.getByRole('button', { name: '下一页' }).click()
  await expect(cursor.getByText('3', { exact: true })).toHaveAttribute('aria-current', 'page')

  await drawer.getByRole('button', { name: '关闭对话框' }).click()
  await page.goto('/component-info#component-pro-table-cursor-pagination')

  const section = page.locator('[data-component-section="Pro Table Cursor Pagination"]')
  await expect(section.getByRole('heading', { name: 'MmProTableCursorPagination' })).toBeVisible()
  await expect(section.locator('.mm-pro-table__pagination-summary')).toHaveText(
    '显示 16-22 条，第 2 页',
  )
  await expect(section.locator('[data-mm-component="cursor-pagination"]')).toBeVisible()
})
