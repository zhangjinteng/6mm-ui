import { expect, test } from '@playwright/test'

test('renders the shared ProTable workflow on the online accounts route only', async ({ page }) => {
  await page.goto('/sidebar-nav#/merchant/users/online-accounts')

  const proTable = page.locator('[data-mm-component="pro-table"]')
  await expect(proTable).toHaveCount(1)
  await expect(proTable).toHaveAttribute('aria-label', '商户在线账户高级表格')
  await expect(proTable.locator('tbody tr')).toHaveCount(20)
  await expect(proTable.getByRole('textbox', { name: '关键词' })).toBeVisible()
  await expect(proTable.getByRole('button', { name: '更多筛选在线账户' })).toBeVisible()
  await expect(proTable).toHaveClass(/is-fill-height/)
  await expect(page.locator('.sidebar-nav-preview-page__surface')).toHaveCount(0)

  const sidebar = page.locator('[data-mm-component="sidebar-nav"]')
  await expect(sidebar).toHaveCSS('width', '240px')

  const shellLayout = await page.getByTestId('sidebar-nav-preview-page').evaluate((preview) => {
    const sidebarRect = preview.querySelector<HTMLElement>('[data-mm-component="sidebar-nav"]')!.getBoundingClientRect()
    const workspaceRect = preview.querySelector<HTMLElement>('.sidebar-nav-preview-page__workspace')!.getBoundingClientRect()
    return {
      sidebarRight: sidebarRect.right,
      workspaceLeft: workspaceRect.left,
    }
  })
  expect(shellLayout.workspaceLeft).toBeGreaterThanOrEqual(shellLayout.sidebarRight)

  const workspace = page.locator('.sidebar-nav-preview-page__workspace')
  const tableScroll = proTable.locator('.mm-table__scroll')
  const pagination = proTable.locator('.mm-pro-table__pagination')
  const viewportLayout = await page.evaluate(() => {
    const root = document.scrollingElement!
    const workspace = document.querySelector<HTMLElement>('.sidebar-nav-preview-page__workspace')!
    const tableScroll = document.querySelector<HTMLElement>('.mm-table__scroll')!
    const pagination = document.querySelector<HTMLElement>('.mm-pro-table__pagination')!
    return {
      documentClientHeight: root.clientHeight,
      documentScrollHeight: root.scrollHeight,
      paginationBottom: pagination.getBoundingClientRect().bottom,
      tableClientHeight: tableScroll.clientHeight,
      tableScrollHeight: tableScroll.scrollHeight,
      viewportHeight: window.innerHeight,
      workspaceClientHeight: workspace.clientHeight,
      workspaceOverflowY: getComputedStyle(workspace).overflowY,
      workspaceScrollHeight: workspace.scrollHeight,
    }
  })
  expect(viewportLayout.documentScrollHeight).toBeLessThanOrEqual(viewportLayout.documentClientHeight)
  expect(viewportLayout.workspaceOverflowY).toBe('hidden')
  expect(viewportLayout.workspaceScrollHeight).toBeLessThanOrEqual(viewportLayout.workspaceClientHeight)
  expect(viewportLayout.tableScrollHeight).toBeGreaterThan(viewportLayout.tableClientHeight)
  expect(viewportLayout.paginationBottom).toBeLessThanOrEqual(viewportLayout.viewportHeight)

  const fixedSectionsBeforeScroll = await proTable.evaluate((element) => ({
    headerTop: element.querySelector('thead th')!.getBoundingClientRect().top,
    paginationTop: element.querySelector<HTMLElement>('.mm-pro-table__pagination')!.getBoundingClientRect().top,
    queryTop: element.querySelector<HTMLElement>('.mm-pro-table__query')!.getBoundingClientRect().top,
  }))
  await tableScroll.evaluate((element) => { element.scrollTop = 160 })
  const fixedSectionsAfterScroll = await proTable.evaluate((element) => ({
    headerTop: element.querySelector('thead th')!.getBoundingClientRect().top,
    paginationTop: element.querySelector<HTMLElement>('.mm-pro-table__pagination')!.getBoundingClientRect().top,
    queryTop: element.querySelector<HTMLElement>('.mm-pro-table__query')!.getBoundingClientRect().top,
  }))
  expect(await tableScroll.evaluate((element) => element.scrollTop)).toBeGreaterThan(0)
  expect(Math.abs(fixedSectionsAfterScroll.headerTop - fixedSectionsBeforeScroll.headerTop)).toBeLessThanOrEqual(1)
  expect(Math.abs(fixedSectionsAfterScroll.paginationTop - fixedSectionsBeforeScroll.paginationTop)).toBeLessThanOrEqual(1)
  expect(Math.abs(fixedSectionsAfterScroll.queryTop - fixedSectionsBeforeScroll.queryTop)).toBeLessThanOrEqual(1)

  await page.getByRole('menuitem', { name: '用户C2C' }).click()
  await expect(page).toHaveURL(/\/sidebar-nav#\/merchant\/users\/user-c2c$/)
  await expect(proTable).toHaveCount(0)
  await expect(page.locator('.sidebar-nav-preview-page__surface')).toBeVisible()
  await expect(workspace).toHaveCSS('overflow-y', 'auto')
})

test('keeps the fixed actions column readable on phone screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/sidebar-nav#/merchant/users/online-accounts')

  const proTable = page.locator('[data-mm-component="pro-table"]')
  const actionsHeader = proTable.locator('th.is-fixed-right')
  const firstActionsCell = proTable.locator('tbody tr').first().locator('td.is-fixed-right')
  const actionButton = firstActionsCell.getByRole('button')

  await expect(actionsHeader).toHaveText('操作')
  await expect(actionButton).toBeVisible()

  const layout = await actionsHeader.evaluate((header) => ({
    clientWidth: header.clientWidth,
    scrollWidth: header.scrollWidth,
    width: header.getBoundingClientRect().width,
  }))
  expect(layout.width).toBeGreaterThanOrEqual(64)
  expect(layout.scrollWidth).toBeLessThanOrEqual(layout.clientWidth)

  const cellBox = await firstActionsCell.boundingBox()
  const buttonBox = await actionButton.boundingBox()
  expect(buttonBox?.x).toBeGreaterThanOrEqual(cellBox?.x ?? 0)
  expect((buttonBox?.x ?? 0) + (buttonBox?.width ?? 0)).toBeLessThanOrEqual((cellBox?.x ?? 0) + (cellBox?.width ?? 0))
})

test('renders the merchant user list workflow on the trading accounts route', async ({ page }) => {
  await page.goto('/sidebar-nav#/merchant/users/trading-accounts')

  const proTable = page.locator('[data-mm-component="pro-table"]')
  await expect(proTable).toHaveCount(1)
  await expect(proTable).toHaveAttribute('aria-label', '商户用户列表高级表格')
  await expect(proTable.locator('tbody tr')).toHaveCount(20)
  await expect(proTable.locator('.mm-pro-table__pagination-summary')).toHaveText('显示 1-20 条，第 1 页')
  await expect(proTable.locator('.mm-pagination__total')).toHaveText('共 68 条')
  await expect(page.getByRole('menuitem', { name: '用户列表' })).toHaveAttribute('aria-current', 'page')

  await expect(proTable.getByRole('textbox', { name: '关键词' })).toBeVisible()
  await expect(proTable.getByRole('button', { name: '设置新用户默认类型，当前实盘' })).toBeVisible()
  await expect(proTable.getByRole('button', { name: '查询', exact: true })).toBeVisible()
  await expect(proTable.getByRole('button', { name: '重置', exact: true })).toBeVisible()
  await expect(proTable.getByRole('columnheader', { name: '用户 UID' })).toBeVisible()
  await expect(proTable.getByRole('columnheader', { name: '登录 IP' })).toBeVisible()
  await expect(proTable.getByRole('columnheader', { name: '最后登录时间' })).toBeVisible()

  await proTable.getByRole('button', { name: '设置新用户默认类型，当前实盘' }).click()
  const defaultTypeDialog = page.getByRole('dialog', { name: '新客类型' })
  await expect(defaultTypeDialog).toBeVisible()
  await expect(defaultTypeDialog).toContainText('仅对新客生效')
  await expect(defaultTypeDialog).toContainText('请选择新客默认类型。')
  await expect(defaultTypeDialog).toContainText('已有用户保持不变。')
  await expect(defaultTypeDialog.getByRole('radio', { name: /实盘/ })).toBeChecked()
  await defaultTypeDialog.getByRole('radio', { name: /内盘/ }).check()
  await defaultTypeDialog.getByRole('button', { name: '取消', exact: true }).click()
  await expect(defaultTypeDialog).toBeHidden()
  await expect(proTable.getByRole('button', { name: '设置新用户默认类型，当前实盘' })).toBeVisible()

  await proTable.getByRole('button', { name: '设置新用户默认类型，当前实盘' }).click()
  await defaultTypeDialog.getByRole('radio', { name: /内盘/ }).check()
  await defaultTypeDialog.getByRole('button', { name: '确认保存', exact: true }).click()
  await expect(defaultTypeDialog).toBeHidden()
  await expect(proTable.getByRole('button', { name: '设置新用户默认类型，当前内盘' })).toBeVisible()

  const keyword = proTable.getByRole('textbox', { name: '关键词' })
  await keyword.fill('user_0012')
  await proTable.getByRole('button', { name: '查询' }).click()
  await expect(proTable.locator('tbody tr')).toHaveCount(1)
  await expect(proTable).toContainText('936002780')
  await expect(proTable.locator('.mm-pro-table__pagination-summary')).toHaveText('显示 1-1 条，第 1 页')
  await expect(proTable.locator('.mm-pagination__total')).toHaveText('共 1 条')

  await keyword.fill('')
  await proTable.getByRole('button', { name: '查询' }).click()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)
  await proTable.getByRole('button', { name: '第 2 页' }).click()
  await expect(proTable).toContainText('936007301')
  await expect(proTable.locator('.mm-pro-table__pagination-summary')).toHaveText('显示 21-40 条，第 2 页')
  await expect(proTable.locator('.mm-pagination__total')).toHaveText('共 68 条')
  await proTable.getByRole('button', { name: '第 1 页' }).click()

  await proTable.getByRole('button', { name: '查看用户 936001273' }).click()
  const detail = page.getByRole('dialog', { name: '用户详情' })
  await expect(detail).toBeVisible()
  await expect(detail).toHaveClass(/trading-account-detail-dialog/)
  await expect(detail).not.toHaveClass(/mm-drawer__panel/)
  await expect(detail.locator('[data-mm-component="card"]')).toHaveCount(5)
  await expect(detail.locator('[data-mm-component="statistic"]')).toHaveCount(23)
  await expect(detail.getByTestId('trading-account-detail')).toContainText('user_0001')
  await expect(detail.getByTestId('trading-account-detail')).toContainText('EXT-8101')
  await expect(detail.getByRole('tab', { name: '用户合约' })).toHaveAttribute('aria-selected', 'true')
  await expect(detail.getByRole('tab', { name: '用户现货' })).toBeVisible()
  await expect(detail.getByRole('tab', { name: '用户C2C' })).toBeVisible()
  await detail.getByRole('button', { name: '关闭对话框' }).click()
  await expect(detail).toBeHidden()
})

test('keeps the trading accounts page bounded and usable on phone screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/sidebar-nav#/merchant/users/trading-accounts')

  const proTable = page.locator('[data-mm-component="pro-table"]')
  await expect(proTable).toHaveClass(/is-fill-height/)
  await expect(proTable.getByRole('textbox', { name: '关键词' })).toHaveCount(0)
  await expect(proTable.getByRole('button', { name: '查询', exact: true })).toBeVisible()
  await expect(proTable.locator('[data-filter-drawer-trigger]')).toBeVisible()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)

  const layout = await page.evaluate(() => {
    const root = document.scrollingElement!
    const tableScroll = document.querySelector<HTMLElement>('.mm-table__scroll')!
    return {
      documentClientWidth: root.clientWidth,
      documentScrollWidth: root.scrollWidth,
      tableClientWidth: tableScroll.clientWidth,
      tableScrollWidth: tableScroll.scrollWidth,
    }
  })
  expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)
  expect(layout.tableScrollWidth).toBeGreaterThan(layout.tableClientWidth)

  await expect(proTable.getByRole('button', { name: '设置新用户默认类型，当前实盘' })).toHaveCount(0)

  await proTable.getByRole('button', { name: '查看用户 936001273' }).click()
  const detail = page.getByRole('dialog', { name: '用户详情' })
  await expect(detail).toBeVisible()
  const detailBox = await detail.boundingBox()
  expect(detailBox?.width).toBeLessThanOrEqual(390)
  await expect(detail.getByRole('tab', { name: '用户合约' })).toBeVisible()
})

test('renders the standalone user asset table on the asset route', async ({ page }) => {
  await page.goto('/sidebar-nav#/merchant/users/user-assets')

  const proTable = page.locator('[data-mm-component="pro-table"]')
  await expect(proTable).toHaveAttribute('aria-label', '商户用户资产高级表格')
  await expect(page.getByRole('menuitem', { name: '用户资产' })).toHaveAttribute('aria-current', 'page')
  await expect(proTable.locator('tbody tr')).toHaveCount(20)
  await expect(proTable.getByRole('columnheader', { name: '用户 UID' })).toBeVisible()
  await expect(proTable.getByRole('columnheader', { name: '钱包余额(U)' })).toBeVisible()
  await expect(proTable.getByRole('columnheader', { name: '持仓量(U)' })).toBeVisible()
  await expect(proTable.getByRole('columnheader', { name: '未实现盈亏(U)' })).toBeVisible()
  await expect(proTable.locator('.mm-pagination__total')).toHaveText('共 47 条')

  const keyword = proTable.getByRole('textbox', { name: '关键词' })
  await keyword.fill('asset_0012')
  await proTable.getByRole('button', { name: '查询', exact: true }).click()
  await expect(proTable.locator('tbody tr')).toHaveCount(1)
  await expect(proTable).toContainText('资产用户 12')
})

test('keeps the user asset table usable on phone screens', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/sidebar-nav#/merchant/users/user-assets')

  const proTable = page.locator('[data-mm-component="pro-table"]')
  await expect(proTable).toHaveClass(/is-fill-height/)
  await expect(proTable.getByRole('textbox', { name: '关键词' })).toHaveCount(0)
  await expect(proTable.locator('[data-filter-drawer-trigger]')).toBeVisible()
  await expect(proTable.locator('tbody tr')).toHaveCount(20)

  const layout = await page.evaluate(() => {
    const root = document.scrollingElement!
    const tableScroll = document.querySelector<HTMLElement>('.mm-table__scroll')!
    return {
      documentClientWidth: root.clientWidth,
      documentScrollWidth: root.scrollWidth,
      tableClientWidth: tableScroll.clientWidth,
      tableScrollWidth: tableScroll.scrollWidth,
    }
  })
  expect(layout.documentScrollWidth).toBeLessThanOrEqual(layout.documentClientWidth)
  expect(layout.tableScrollWidth).toBeGreaterThan(layout.tableClientWidth)
})

test('composes MmAppHeader and MmSidebarNav into a responsive desktop shell', async ({ page }) => {
  await page.goto('/sidebar-nav')

  const header = page.locator('[data-mm-component="app-header"]')
  const sidebar = page.locator('[data-mm-component="sidebar-nav"]')
  await expect(header).toHaveCount(1)
  await expect(header).toHaveAttribute('data-app-header-mode', 'desktop')
  await expect(sidebar).toHaveCount(1)
  await expect(sidebar).toHaveAttribute('data-sidebar-mode', 'expanded')
  await expect(sidebar).toHaveCSS('height', `${await page.evaluate(() => window.innerHeight)}px`)
  await expect(page.locator('#app > *')).toHaveCount(1)
  await expect(page.getByRole('menu', { name: '商户管理菜单' })).toBeVisible()
  await expect(page.getByRole('menuitem', { name: '在线账户' })).toHaveAttribute('aria-current', 'page')

  const profileButton = page.getByRole('button', { name: '账号菜单：管理员' })
  await profileButton.focus()
  const profileFocusStyle = await profileButton.evaluate((button) => {
    const avatar = button.querySelector<HTMLElement>('.mm-avatar')!
    return {
      avatarBoxShadow: getComputedStyle(avatar).boxShadow,
      buttonBoxShadow: getComputedStyle(button).boxShadow,
      buttonHeight: button.getBoundingClientRect().height,
      buttonUsesMmButton: button.classList.contains('mm-button'),
      buttonWidth: button.getBoundingClientRect().width,
    }
  })
  expect(profileFocusStyle.buttonBoxShadow).toBe('none')
  expect(profileFocusStyle.buttonUsesMmButton).toBe(false)
  expect(profileFocusStyle.avatarBoxShadow).toContain('inset')
  expect(profileFocusStyle.buttonWidth).toBe(profileFocusStyle.buttonHeight)

  await profileButton.click()
  const profileMenu = page.locator('.mm-app-header__profile-popover')
  await expect(profileMenu).toBeVisible()
  await expect(profileButton).toHaveAttribute('aria-expanded', 'true')
  await expect(profileMenu).toHaveCSS('animation-name', 'mm-app-header-profile-popover-enter')
  await expect(profileMenu).toContainText('管理员')
  await expect(profileMenu).toContainText('ops@alphaembed.com')
  await expect(profileMenu.getByRole('menuitem')).toHaveCount(3)
  const personalCenterIcon = profileMenu
    .locator('[data-app-header-profile-item="personal-center"] .mm-menu-item__icon')
  await expect(personalCenterIcon).toHaveCSS('height', '16px')
  await expect(personalCenterIcon.locator('.mm-icon')).toHaveCSS('display', 'block')
  await expect(profileMenu.getByRole('menuitem', { name: '退出登录' })).toHaveClass(/is-danger/)

  const profileButtonBox = await profileButton.boundingBox()
  const profileMenuBox = await profileMenu.boundingBox()
  expect(profileMenuBox?.y).toBeGreaterThanOrEqual(profileButtonBox?.y ?? 0)
  expect(profileMenuBox?.x).toBeLessThanOrEqual((profileButtonBox?.x ?? 0) + (profileButtonBox?.width ?? 0))
  expect((profileMenuBox?.x ?? 0) + (profileMenuBox?.width ?? 0)).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth))

  await profileMenu.getByRole('menuitem', { name: '个人中心' }).click()
  await expect(profileMenu).toHaveCount(0)
  await expect(page.getByTestId('sidebar-nav-preview-page')).toHaveAttribute('data-last-event', 'PROFILE / PERSONAL-CENTER')

  await page.getByRole('button', { name: '收起菜单' }).click()
  await expect(sidebar).toHaveAttribute('data-sidebar-mode', 'collapsed')
  await expect(page.getByRole('button', { name: '展开菜单' })).toBeVisible()

  await page.getByRole('button', { name: '切换深色主题' }).click()
  await expect(page.getByTestId('sidebar-nav-preview-page')).toHaveAttribute('data-mm-theme', 'dark')
  await expect(page.locator('html')).toHaveAttribute('data-mm-theme', 'dark')
  await expect(page.getByRole('button', { name: '切换浅色主题' })).toBeVisible()

  await page.getByRole('button', { name: '展开菜单' }).click()

  await page.getByRole('menuitem', { name: '用户列表' }).click()
  await expect(page).toHaveURL(/\/sidebar-nav#\/merchant\/users\/trading-accounts$/)
  await expect(page.getByRole('menuitem', { name: '用户列表' })).toHaveAttribute('aria-current', 'page')
})

test('shares the mobile navigation state between MmAppHeader and MmSidebarNav', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/sidebar-nav')

  const header = page.locator('[data-mm-component="app-header"]')
  await expect(header).toHaveAttribute('data-app-header-mode', 'mobile')
  await expect(page.getByRole('button', { name: '打开导航菜单' })).toHaveAttribute('aria-expanded', 'false')

  await page.getByRole('button', { name: '打开导航菜单' }).click()
  await expect(page.getByRole('button', { name: '关闭导航菜单' })).toHaveAttribute('aria-expanded', 'true')

  const drawer = page.locator('.mm-sidebar-nav__drawer').getByRole('dialog')
  await expect(drawer).toBeVisible()
  await expect(drawer.locator('[data-mm-component="sidebar-nav"]')).toHaveAttribute('data-sidebar-mode', 'mobile')

  await drawer.getByRole('menuitem', { name: '用户列表' }).click()
  await expect(page).toHaveURL(/\/sidebar-nav#\/merchant\/users\/trading-accounts$/)
  await expect(drawer).toBeHidden()
  await expect(page.getByRole('button', { name: '打开导航菜单' })).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('sidebar-nav-preview-page')).toHaveAttribute('data-last-event', 'MOBILE NAV / CLOSED')
})

test('does not lock scrolling on other playground routes', async ({ page }) => {
  await page.goto('/component-info')

  const metrics = await page.evaluate(() => ({
    clientHeight: document.documentElement.clientHeight,
    overflow: getComputedStyle(document.body).overflow,
    scrollHeight: document.documentElement.scrollHeight,
  }))
  expect(metrics.scrollHeight).toBeGreaterThan(metrics.clientHeight)
  expect(metrics.overflow).not.toBe('hidden')

  await page.evaluate(() => window.scrollTo(0, 600))
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0)
})
