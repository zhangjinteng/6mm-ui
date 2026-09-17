import { expect, test } from '@playwright/test'

test('pro table preview renders a URL return context and navigates safely', async ({ page }) => {
  await page.goto('/pro-table?mmReturnTo=%2Fcomponent-info&mmReturnLabel=%E5%90%88%E7%BA%A6%E6%88%90%E4%BA%A4')

  const returnButton = page.getByRole('button', { name: '返回合约成交', exact: true })
  await expect(returnButton).toBeVisible()
  await expect(returnButton).toHaveAttribute('title', '返回合约成交，恢复原筛选、分页和浏览位置')
  await page.setViewportSize({ height: 844, width: 390 })
  await expect(returnButton).toBeVisible()
  await expect(returnButton.locator('.mm-button__label')).toHaveText('返回合约成交')

  await returnButton.click()
  await expect(page).toHaveURL(/\/component-info$/)

  await page.goto('/pro-table?mmReturnTo=https%3A%2F%2Fexample.com&mmReturnLabel=%E5%A4%96%E9%83%A8%E9%A1%B5%E9%9D%A2')
  await expect(page.locator('[data-action="return-context"]')).toHaveCount(0)
})

test('pro table filter badge remains fully visible inside the single-line query bar', async ({ page }) => {
  await page.goto('/pro-table')

  const queryBar = page.locator('[data-mm-component="pro-table"] .mm-query-bar')
  const status = queryBar.getByRole('combobox', { name: '在线状态' })
  await status.click()
  await page.getByRole('option', { name: '在线', exact: true }).click()
  await queryBar.getByRole('button', { name: '查询', exact: true }).click()

  const badge = queryBar.locator('.mm-filter-drawer__badge .mm-badge__content')
  await expect(badge).toBeVisible()
  await expect(badge).toHaveText('1')
  const layout = await badge.evaluate((element) => {
    const badgeRect = element.getBoundingClientRect()
    const actionsRect = element.closest('.mm-query-bar__actions')!.getBoundingClientRect()
    return {
      bottomInside: badgeRect.bottom <= actionsRect.bottom,
      height: badgeRect.height,
      leftInside: badgeRect.left >= actionsRect.left,
      rightInside: badgeRect.right <= actionsRect.right,
      topInside: badgeRect.top >= actionsRect.top,
      width: badgeRect.width,
    }
  })
  expect(layout).toEqual({
    bottomInside: true,
    height: 15,
    leftInside: true,
    rightInside: true,
    topInside: true,
    width: 15,
  })
})

test('pro table preview composes querying, server sorting, columns, refresh, and recovery', async ({ page }) => {
  await page.goto('/pro-table')

  await expect(page.getByRole('heading', { name: 'MmProTable 数据工作台' })).toBeVisible()
  const proTable = page.locator('[data-mm-component="pro-table"]')
  const queryWorkspace = proTable.locator('.mm-pro-table__query')
  await expect(proTable).toBeVisible()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)
  await expect(proTable.getByText('显示 1-20 条，第 1 页', { exact: true })).toBeVisible()
  await expect(proTable.locator('.mm-pagination__total')).toHaveText('共 86 条')
  await expect(queryWorkspace.getByTestId('simulate-pro-table-empty')).toBeVisible()
  await expect(queryWorkspace.getByTestId('simulate-pro-table-error')).toBeVisible()
  await expect(queryWorkspace.getByRole('combobox', { name: '自动刷新间隔' })).toBeVisible()
  const surfaceColors = await proTable.evaluate((element) => {
    const query = element.querySelector<HTMLElement>('.mm-pro-table__query')!
    const lastCell = element.querySelector<HTMLElement>('tbody tr:last-child > td')!
    return {
      lastRowBorderWidth: getComputedStyle(lastCell).borderBottomWidth,
      query: getComputedStyle(query).backgroundColor,
      root: getComputedStyle(element).backgroundColor,
    }
  })
  expect(surfaceColors.lastRowBorderWidth).toBe('1px')
  expect(surfaceColors.root).toBe('rgb(255, 255, 255)')
  expect(surfaceColors.query).toBe(surfaceColors.root)
  const refreshButton = queryWorkspace.getByRole('button', { name: '刷新', exact: true })
  const columnsButton = queryWorkspace.getByRole('button', { name: '显示字段', exact: true })
  const filterButton = queryWorkspace.getByRole('button', { name: '更多筛选在线账户', exact: true })
  await expect(refreshButton).toBeVisible()
  await expect(refreshButton.locator('.mm-button__label')).toHaveCount(0)
  await expect(columnsButton).toBeVisible()
  await expect(columnsButton.locator('.mm-button__label')).toHaveCount(0)
  await expect(filterButton).toBeVisible()
  await expect(filterButton.locator('.mm-button__label')).toHaveCount(0)
  await expect(queryWorkspace.locator('.mm-query-bar__actions').locator('button, [role="combobox"]')).toHaveText([
    '空结果',
    '模拟错误',
    '自动刷新关闭',
    '查询',
    '重置',
    '',
    '',
    '',
  ])
  const columnsBounds = await columnsButton.boundingBox()
  const filterBounds = await filterButton.boundingBox()
  expect(columnsBounds).not.toBeNull()
  expect(filterBounds).not.toBeNull()
  expect(filterBounds!.x).toBeGreaterThan(columnsBounds!.x)
  const desktopQueryLayout = await queryWorkspace.locator('.mm-query-bar').evaluate((element) => {
    const fields = element.querySelector<HTMLElement>('.mm-query-bar__fields')!
    const actions = element.querySelector<HTMLElement>('.mm-query-bar__actions')!
    return {
      actionsTop: Math.round(actions.getBoundingClientRect().top),
      fieldsTop: Math.round(fields.getBoundingClientRect().top),
      rootHeight: Math.round(element.getBoundingClientRect().height),
    }
  })
  expect(desktopQueryLayout.actionsTop).toBe(desktopQueryLayout.fieldsTop)
  expect(desktopQueryLayout.rootHeight).toBeLessThanOrEqual(44)

  const longUsername = 'operator_002_with_a_name_that_exceeds_the_column_width'
  await queryWorkspace.getByRole('textbox', { name: '关键词' }).fill(longUsername)
  await queryWorkspace.getByRole('button', { name: '查询', exact: true }).click()
  const longUsernameRow = proTable.locator('[data-row-key="ACC-8102"]')
  await expect(longUsernameRow).toBeVisible()
  const usernameLayout = await longUsernameRow.locator('.mm-popover__trigger').evaluate((trigger) => {
    const cell = trigger.closest('td')!
    const text = trigger.querySelector<HTMLElement>('.online-accounts-pro-table__username')!
    return {
      cellWidth: cell.getBoundingClientRect().width,
      textClientWidth: text.clientWidth,
      textOverflow: getComputedStyle(text).textOverflow,
      textScrollWidth: text.scrollWidth,
      triggerWidth: trigger.getBoundingClientRect().width,
    }
  })
  expect(usernameLayout.triggerWidth).toBeLessThanOrEqual(usernameLayout.cellWidth)
  expect(usernameLayout.textScrollWidth).toBeGreaterThan(usernameLayout.textClientWidth)
  expect(usernameLayout.textOverflow).toBe('ellipsis')
  await queryWorkspace.getByRole('button', { name: '重置', exact: true }).click()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)

  const inlineFieldKeys = await queryWorkspace.locator('.mm-query-bar__fields [data-query-field]').evaluateAll((fields) => fields
    .map((field) => field.getAttribute('data-query-field')))
  expect(inlineFieldKeys).toEqual(['keyword', 'status'])
  await filterButton.click()
  const filterDrawer = page.locator('[data-mm-component="drawer"]')
  await expect(filterDrawer).toBeVisible()
  const drawerFieldKeys = await filterDrawer.locator('[data-query-field]').evaluateAll((fields) => fields
    .map((field) => field.getAttribute('data-query-field')))
  expect(drawerFieldKeys).toEqual(['keyword', 'status', 'userType', 'region'])
  const drawerStatus = filterDrawer.getByRole('combobox', { name: '在线状态' })
  await drawerStatus.click()
  const onlineOption = page.getByRole('option', { name: '在线', exact: true })
  await onlineOption.click()
  await expect(drawerStatus).toContainText('在线')
  await filterDrawer.getByRole('textbox', { name: '关键词' }).fill('alice')
  await filterDrawer.getByRole('button', { name: '查询', exact: true }).click()
  await expect(filterDrawer).toHaveCount(0)
  await expect(proTable.locator('tbody tr')).toHaveCount(1)
  await expect(proTable.getByText('alice.ops', { exact: true })).toBeVisible()

  await proTable.getByRole('button', { name: '重置', exact: true }).click()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)

  await proTable.getByRole('button', { name: '按账户 ID升序排列' }).click()
  await expect(proTable.locator('th').filter({ hasText: '账户 ID' })).toHaveAttribute('aria-sort', 'ascending')

  await queryWorkspace.getByRole('button', { name: '显示字段', exact: true }).click()
  const columnsPopover = page.locator('.mm-pro-table__columns-popover')
  await expect(columnsPopover).toBeVisible()
  await columnsPopover.getByRole('checkbox', { name: '显示登录 IP列' }).uncheck()
  await expect(proTable.getByRole('columnheader', { name: '登录 IP' })).toHaveCount(0)

  await proTable.getByRole('combobox', { name: '自动刷新间隔' }).click()
  await page.getByRole('option', { name: '60s 自动刷新' }).click()
  await expect(proTable.getByRole('combobox', { name: '自动刷新间隔' })).toContainText('60s 自动刷新')

  await queryWorkspace.getByTestId('simulate-pro-table-empty').click()
  await expect(proTable.locator('[data-pro-table-state="empty"]')).toBeVisible()
  await queryWorkspace.getByRole('button', { name: '重置', exact: true }).click()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)

  await queryWorkspace.getByTestId('simulate-pro-table-error').click()
  const errorState = proTable.locator('[data-pro-table-state="error"]')
  await expect(errorState).toBeVisible()
  await expect(errorState).toContainText('模拟网关暂时不可用')
  await errorState.getByRole('button', { name: '重新加载' }).click()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)
})

test('pro table preview hides query fields before overflowing actions', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 850 })
  await page.goto('/pro-table')

  const queryBar = page.locator('[data-mm-component="pro-table"] .mm-query-bar')
  await expect(queryBar).toBeVisible()
  const layout = await queryBar.evaluate((element) => {
    const fields = element.querySelector<HTMLElement>('.mm-query-bar__fields')!
    const actions = element.querySelector<HTMLElement>('.mm-query-bar__actions')!
    const status = element.querySelector<HTMLElement>('[data-query-field="status"]')!
    const statusControl = status.querySelector<HTMLElement>('.mm-select__control')!
    return {
      actionsTop: Math.round(actions.getBoundingClientRect().top),
      fieldsOverflow: fields.scrollWidth > fields.clientWidth,
      fieldsTop: Math.round(fields.getBoundingClientRect().top),
      keywordVisible: element.querySelector<HTMLElement>('[data-query-field="keyword"]')!.getClientRects().length > 0,
      rootHeight: Math.round(element.getBoundingClientRect().height),
      statusControlWidth: Math.round(statusControl.getBoundingClientRect().width),
      statusText: statusControl.textContent?.trim(),
      statusWidth: Math.round(status.getBoundingClientRect().width),
    }
  })

  expect(layout.actionsTop).toBe(layout.fieldsTop)
  expect(layout.fieldsOverflow).toBe(false)
  expect(layout.keywordVisible).toBe(true)
  expect(layout.rootHeight).toBe(42)
  expect(layout.statusWidth).toBe(0)
  expect(layout.statusControlWidth).toBe(0)
  expect(layout.statusText).toBe('全部状态')
  await expect(queryBar.getByTestId('simulate-pro-table-empty')).toBeVisible()
  await expect(queryBar.getByTestId('simulate-pro-table-error')).toBeVisible()
  await expect(queryBar.getByRole('button', { name: '查询', exact: true })).toBeVisible()
  await expect(queryBar.getByRole('button', { name: '更多筛选在线账户', exact: true })).toBeVisible()
})

test('pro table preview keeps narrow layouts bounded and theme-aware', async ({ page }) => {
  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/pro-table')

  const proTable = page.locator('[data-mm-component="pro-table"]')
  await expect(proTable.locator('tbody tr')).toHaveCount(20)
  const narrowQueryLayout = await proTable.locator('.mm-query-bar').evaluate((element) => {
    const fields = element.querySelector<HTMLElement>('.mm-query-bar__fields')!
    const actions = element.querySelector<HTMLElement>('.mm-query-bar__actions')!
    const controls = [
      '[data-testid="simulate-pro-table-empty"]',
      '[data-testid="simulate-pro-table-error"]',
      '[aria-label="自动刷新间隔"]',
      '[data-query-action="query"]',
      '[data-query-action="reset"]',
      '[data-pro-table-tool="refresh"]',
      '[data-pro-table-tool="columns"]',
      '[data-filter-drawer-trigger]',
    ].map((selector) => element.querySelector<HTMLElement>(selector)!)
    const hidden = controls.map((control) => control.getClientRects().length === 0)
    const visibleTops = controls
      .filter((_, index) => !hidden[index])
      .map((control) => Math.round(control.getBoundingClientRect().top))
    return {
      actionsTop: Math.round(actions.getBoundingClientRect().top),
      fieldOverflow: fields.scrollWidth > fields.clientWidth,
      fieldsTop: Math.round(fields.getBoundingClientRect().top),
      hidden,
      keywordVisible: element.querySelector<HTMLElement>('[data-query-field="keyword"]')!.getClientRects().length > 0,
      noActionWrap: new Set(visibleTops).size <= 1,
      rootHeight: Math.round(element.getBoundingClientRect().height),
      statusVisible: element.querySelector<HTMLElement>('[data-query-field="status"]')!.getClientRects().length > 0,
      statusWidth: Math.round(element.querySelector<HTMLElement>('[data-query-field="status"]')!.getBoundingClientRect().width),
    }
  })
  expect(narrowQueryLayout.actionsTop).toBe(narrowQueryLayout.fieldsTop)
  expect(narrowQueryLayout.fieldOverflow).toBe(false)
  expect(narrowQueryLayout.hidden).toEqual([true, true, true, false, false, false, false, false])
  expect(narrowQueryLayout.keywordVisible).toBe(false)
  expect(narrowQueryLayout.noActionWrap).toBe(true)
  expect(narrowQueryLayout.rootHeight).toBe(42)
  expect(narrowQueryLayout.statusVisible).toBe(false)
  expect(narrowQueryLayout.statusWidth).toBe(0)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true)
  await expect(proTable.locator('.mm-table__scroll').evaluate((element) => element.scrollWidth > element.clientWidth)).resolves.toBe(true)

  const paginationLayout = await proTable.locator('.mm-pro-table__pagination').evaluate((footer) => {
    const summary = footer.querySelector<HTMLElement>('.mm-pro-table__pagination-summary')!
    const pagination = footer.querySelector<HTMLElement>('.mm-pagination')!
    const footerStyle = getComputedStyle(footer)
    const summaryStyle = getComputedStyle(summary)
    const paginationStyle = getComputedStyle(pagination)
    return {
      flexDirection: footerStyle.flexDirection,
      footerHeight: footer.getBoundingClientRect().height,
      paginationFlexWrap: paginationStyle.flexWrap,
      summaryWhiteSpace: summaryStyle.whiteSpace,
    }
  })
  expect(paginationLayout.flexDirection).toBe('row')
  expect(paginationLayout.footerHeight).toBeLessThanOrEqual(48)
  expect(paginationLayout.paginationFlexWrap).toBe('nowrap')
  expect(paginationLayout.summaryWhiteSpace).toBe('nowrap')

  await page.getByRole('button', { name: '切换到暗色主题' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-mm-theme', 'dark')

  await proTable.getByRole('button', { name: '更多筛选在线账户', exact: true }).click()
  const drawer = page.locator('[data-mm-component="drawer"]')
  await expect(drawer).toBeVisible()
  await expect(drawer.getByRole('combobox', { name: '在线状态', exact: true })).toBeVisible()
  const bounds = await drawer.boundingBox()
  expect(bounds).not.toBeNull()
  expect(bounds!.x).toBeGreaterThanOrEqual(0)
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(390)
})
