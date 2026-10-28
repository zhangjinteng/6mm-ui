import { expect, test } from '@playwright/test'

test('rich editor formats text, imports HTML, pastes rich text, and updates the bound HTML', async ({ page }) => {
  await page.goto('/rich-text-editor')
  const editor = page.getByRole('textbox', { name: '公告内容', exact: true })
  const output = page.getByTestId('editor-html')
  await expect(editor.locator('h2')).toHaveText('产品更新公告')
  await editor.fill('公告正文')
  await editor.press('ControlOrMeta+A')
  await page.getByRole('button', { name: '加粗', exact: true }).click()
  await expect(editor.locator('strong')).toHaveText('公告正文')
  await expect(output).toContainText('<strong>公告正文</strong>')
  await page.getByRole('button', { name: '撤销', exact: true }).click()
  await expect(editor.locator('strong')).toHaveCount(0)

  await page.getByRole('button', { name: 'HTML 源码', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'HTML 源码' })
  await dialog.getByRole('textbox', { name: 'HTML 源码' }).fill('<h2>导入公告</h2><p><u>支持 HTML</u></p>')
  await dialog.getByRole('button', { name: '确认', exact: true }).click()
  await expect(editor.locator('h2')).toHaveText('导入公告')
  await expect(editor.locator('u')).toHaveText('支持 HTML')

  await editor.focus()
  await editor.press('ControlOrMeta+A')
  await editor.evaluate(element => {
    const clipboardData = new DataTransfer()
    clipboardData.setData('text/html', '<p>网页粘贴 <em>斜体</em></p>')
    clipboardData.setData('text/plain', '网页粘贴 斜体')
    element.dispatchEvent(new ClipboardEvent('paste', { bubbles: true, cancelable: true, clipboardData }))
  })
  await expect(editor.locator('em')).toHaveText('斜体')
  await expect(output).toContainText('<em>斜体</em>')
})

test('links validate URLs and tables expose working row and column actions', async ({ page }) => {
  await page.goto('/rich-text-editor')
  const editor = page.getByRole('textbox', { name: '公告内容', exact: true })
  await editor.fill('查看详情')
  await editor.press('ControlOrMeta+A')
  await page.getByRole('button', { name: '链接', exact: true }).click()
  const linkDialog = page.getByRole('dialog', { name: '链接', exact: true })
  await linkDialog.getByRole('textbox', { name: '地址' }).fill('javascript:alert(1)')
  await linkDialog.getByRole('button', { name: '确认', exact: true }).click()
  await expect(linkDialog.getByRole('alert')).toBeVisible()
  await linkDialog.getByRole('textbox', { name: '地址' }).fill('https://6mm.com')
  await linkDialog.getByRole('button', { name: '确认', exact: true }).click()
  await expect(editor.locator('a')).toHaveAttribute('href', 'https://6mm.com')

  await page.getByRole('button', { name: '清空', exact: true }).click()
  await page.getByRole('button', { name: '插入表格', exact: true }).click()
  await expect(editor.locator('tr')).toHaveCount(3)
  await page.getByRole('button', { name: '下方插入行', exact: true }).click()
  await expect(editor.locator('tr')).toHaveCount(4)
  await page.getByRole('button', { name: '右侧插入列', exact: true }).click()
  await expect(editor.locator('tr').first().locator('th, td')).toHaveCount(4)
  await page.getByRole('button', { name: '删除表格', exact: true }).click()
  await expect(editor.locator('table')).toHaveCount(0)
})

test('readonly, disabled, and external replacement behave consistently', async ({ page }) => {
  await page.goto('/rich-text-editor')
  const editor = page.getByRole('textbox', { name: '公告内容', exact: true })
  await page.getByText('只读', { exact: true }).click()
  await expect(editor).toHaveAttribute('contenteditable', 'false')
  await expect(page.getByRole('button', { name: '加粗', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: '加载内容' }).click()
  await expect(editor.locator('h2')).toHaveText('服务维护通知')
  await page.getByText('只读', { exact: true }).click()
  await expect(editor).toHaveAttribute('contenteditable', 'true')
  await page.getByText('禁用', { exact: true }).click()
  await expect(editor).toHaveAttribute('tabindex', '-1')
  await expect(page.getByRole('button', { name: 'HTML 源码', exact: true })).toBeDisabled()
})

test('editor remains contained in desktop and mobile viewports and dark theme', async ({ page }) => {
  await page.goto('/rich-text-editor')
  for (const [width, height] of [[1440, 900], [390, 844]]) {
    await page.setViewportSize({ width, height })
    const overflow = await page.evaluate(() => {
      const root = document.querySelector<HTMLElement>('.mm-rich-text-editor')!
      return { page: document.documentElement.scrollWidth > innerWidth, toolbar: root.querySelector<HTMLElement>('[role="toolbar"]')!.scrollWidth > root.clientWidth }
    })
    expect(overflow).toEqual({ page: false, toolbar: false })
    await page.screenshot({ path: `test-results/rich-text-editor-${width}.png`, fullPage: true })
  }
  await page.evaluate(() => { document.documentElement.dataset.mmTheme = 'dark' })
  await expect(page.locator('.mm-rich-text-editor')).toHaveCSS('background-color', 'rgb(16, 23, 27)')
  await page.screenshot({ path: 'test-results/rich-text-editor-dark.png', fullPage: true })
})
