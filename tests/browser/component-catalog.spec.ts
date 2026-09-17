import { expect, test } from '@playwright/test'

test('header navigation links home and component information', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.setViewportSize({ height: 1080, width: 1920 })
  await page.goto('/#strategies')

  const header = page.locator('.masthead')
  const home = header.getByRole('link', { name: 'HOME', exact: true })
  const sidebarNav = header.getByRole('link', { name: 'SIDEBAR NAV', exact: true })
  const componentInfo = header.getByRole('link', { name: 'COMPONENT INFO', exact: true })

  await expect(home).toHaveAttribute('href', '/')
  await expect(sidebarNav).toHaveAttribute('href', '/sidebar-nav')
  await expect(componentInfo).toHaveAttribute('href', '/component-info')
  await expect(header.locator('.masthead__nav-link')).toHaveText([
    'HOME',
    'SIDEBAR NAV',
    'COMPONENT INFO',
    'PRO TABLE',
  ])

  await componentInfo.click()
  await expect(page).toHaveURL(/\/component-info$/)

  const menu = page.getByRole('navigation', { name: '组件菜单' })
  const menuLinks = menu.getByRole('link')
  const sections = page.locator('[data-component-section]')

  await expect(menuLinks).toHaveCount(59)
  await expect(sections).toHaveCount(59)
  await expect(page.getByTestId('live-component-preview')).toHaveCount(59)
  await expect(page.locator('[data-usage-example]')).toHaveCount(1)

  const componentInfoDrawer = page.locator('.component-info-drawer')
  const componentInfoUsage = componentInfoDrawer.locator('[data-usage-example]')
  const colorSection = page.locator('[data-component-section="Color"]')
  const colorPreview = colorSection.getByTestId('live-component-preview')
  await expect(colorPreview).toHaveAttribute('data-preview-mode', 'compact')
  await expect(colorPreview.locator('[data-mm-component="color"]')).toHaveCount(3)
  for (const size of ['sm', 'md', 'lg']) {
    await expect(colorPreview.locator(`[data-preview-size="${size}"] [data-mm-component="color"]`)).toHaveClass(new RegExp(`mm-color--${size}`))
  }
  await colorSection.getByRole('button', { name: '查看代码' }).click()
  await expect(componentInfoUsage).toContainText('MmColor label="Danger"')

  const buttonPreview = page.locator('[data-component-section="Button"]').getByTestId('live-component-preview')
  await expect(buttonPreview.locator('[data-mm-component="button"]')).toHaveCount(3)

  const calendarPreview = page.locator('[data-component-section="Calendar"]').getByTestId('live-component-preview')
  const calendar = calendarPreview.locator('[data-mm-component="calendar"]')
  const calendarPanel = calendar.locator('[data-mm-component="date-picker-panel"]')
  await expect(calendar).toBeVisible()
  await expect.poll(async () => {
    const [calendarBox, panelBox] = await Promise.all([
      calendar.boundingBox(),
      calendarPanel.boundingBox(),
    ])
    return {
      fillsCalendar: Math.abs((calendarBox?.width ?? 0) - (panelBox?.width ?? 0)) <= 2,
      widerThanFormerCap: (panelBox?.width ?? 0) > 292,
    }
  }).toEqual({ fillsCalendar: true, widerThanFormerCap: true })

  const sizePreviews = [
    { component: 'Autocomplete', selector: '.mm-input', sizeClass: 'mm-input' },
    { component: 'Button', selector: '[data-mm-component="button"]', sizeClass: 'mm-button' },
    { component: 'Checkbox', selector: '[data-mm-component="checkbox"]', sizeClass: 'mm-checkbox' },
    { component: 'Cursor Pagination', selector: '[data-mm-component="cursor-pagination"]', sizeClass: 'mm-pagination' },
    { component: 'Date Picker', selector: '.mm-input', sizeClass: 'mm-input' },
    { component: 'Input', selector: '.mm-input', sizeClass: 'mm-input' },
    { component: 'Input Number', selector: '.mm-input', sizeClass: 'mm-input' },
    { component: 'Pagination', selector: '[data-mm-component="pagination"]', sizeClass: 'mm-pagination' },
    { component: 'Radio', selector: '[data-mm-component="radio"]', sizeClass: 'mm-radio' },
    { component: 'Segmented', selector: '[data-mm-component="segmented"]', sizeClass: 'mm-segmented' },
    { component: 'Select', selector: '[data-mm-component="select"]', sizeClass: 'mm-select' },
    { component: 'Text', selector: '[data-mm-component="text"]', sizeClass: 'mm-text' },
  ]
  for (const preview of sizePreviews) {
    const section = page.locator(`[data-component-section="${preview.component}"]`)
    const matrix = section.locator(`[data-size-preview="${preview.component}"]`)
    await expect(matrix.locator('[data-preview-size]')).toHaveCount(3)
    await section.getByRole('button', { name: '查看代码' }).click()
    for (const size of ['sm', 'md', 'lg']) {
      await expect(matrix.locator(`[data-preview-size="${size}"] ${preview.selector}`)).toHaveClass(new RegExp(`${preview.sizeClass}--${size}`))
      await expect(componentInfoUsage).toContainText(`size="${size}"`)
    }
  }

  const tagPreview = page.locator('[data-component-section="Tag"]').getByTestId('live-component-preview')
  await expect(tagPreview.locator('[data-mm-component="tag"]')).toHaveCount(3)
  for (const size of ['sm', 'md', 'lg']) {
    await expect(tagPreview.locator(`[data-preview-size="${size}"] [data-mm-component="tag"]`)).toHaveClass(new RegExp(`mm-tag--${size}`))
  }

  const radioPreview = page.locator('[data-component-section="Radio"]').getByTestId('live-component-preview')
  const selectedRadio = radioPreview.locator('[data-preview-size="md"] label.mm-radio')
  await expect(radioPreview.locator('[data-preview-size="md"]').getByRole('radio', { name: 'Maker' })).toBeChecked()
  const selectedRadioColor = await selectedRadio.evaluate((element) => getComputedStyle(element).color)
  await selectedRadio.hover()
  await expect(selectedRadio).toHaveCSS('color', selectedRadioColor)

  const tableLink = menu.getByRole('link', { name: 'Table', exact: true })
  await tableLink.click()
  await expect(page).toHaveURL(/\/component-info#component-table$/)

  const tableSection = page.locator('[data-component-section="Table"]')
  await expect(tableSection).toBeInViewport()
  await tableSection.getByRole('button', { name: '查看代码' }).click()
  await expect(componentInfoUsage).toContainText('<MmTable')
  await componentInfoDrawer.getByRole('button', { name: '复制', exact: true }).click()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('MmTable')
})

test('component catalog lists, filters, searches, and opens copyable technical details', async ({ context, page }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/')

  const catalog = page.getByRole('region', { name: '组件预览目录' })
  const entries = catalog.locator('[data-component-name]')

  await expect(catalog).toBeVisible()
  await expect(entries).toHaveCount(59)
  await expect(catalog.locator('button:not([data-mm-component="button"])')).toHaveCount(0)

  await catalog.getByRole('button', { name: '筛选表单组件，共 13 个' }).click()
  await expect(entries).toHaveCount(13)

  await catalog.getByRole('button', { name: '筛选全部组件，共 59 个' }).click()
  await catalog.getByRole('textbox', { name: '搜索组件' }).fill('Dialog')
  await expect(entries).toHaveCount(1)
  await expect(entries).toHaveAttribute('data-component-name', 'Dialog')

  await entries.click()
  const technicalDrawer = page.getByRole('dialog', { name: '组件技术信息' })
  await expect(technicalDrawer).toBeVisible()
  await expect(technicalDrawer.getByRole('heading', { name: 'MmDialog' })).toBeVisible()
  await expect(technicalDrawer.getByText('@work-gpt/6mm-ui', { exact: true })).toBeVisible()
  await expect(technicalDrawer.getByTestId('technical-example')).toContainText('<MmDialog')
  const livePreview = technicalDrawer.getByTestId('live-component-preview')
  await expect(livePreview).toBeVisible()
  await expect(livePreview).toHaveAttribute('data-preview-component', 'Dialog')
  await expect(livePreview).toHaveAttribute('data-preview-mode', 'compact')

  await livePreview.getByTestId('dialog-preview-trigger').click()
  const previewDialog = page.getByRole('dialog', { name: 'Dialog 组件预览' })
  await expect(previewDialog).toBeVisible()
  await previewDialog.getByRole('button', { name: '确认' }).click()
  await expect(previewDialog).toBeHidden()

  await technicalDrawer.getByRole('button', { name: '复制', exact: true }).click()
  await expect(technicalDrawer.getByRole('button', { name: '已复制', exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toContain('MmDialog')

  await technicalDrawer.getByRole('button', { name: '查看实际示例' }).click()
  await expect(technicalDrawer).toBeHidden()
  await expect(page.locator('#preview-14')).toBeFocused()
})

test('app header previews desktop, tablet, and phone states on home and component info', async ({ page }) => {
  await page.goto('/')

  const catalog = page.getByRole('region', { name: '组件预览目录' })
  await catalog.getByRole('textbox', { name: '搜索组件' }).fill('App Header')
  await catalog.locator('[data-component-name="App Header"]').click()

  const technicalDrawer = page.getByRole('dialog', { name: '组件技术信息' })
  const preview = technicalDrawer.getByTestId('app-header-preview')
  const appHeader = preview.locator('[data-mm-component="app-header"]')

  await expect(appHeader).toHaveAttribute('data-app-header-mode', 'mobile')
  await expect(appHeader.locator('[data-app-header-brand]')).toContainText('在线账户')

  await preview.getByRole('button', { name: '切换到桌面预览' }).click()
  await expect(appHeader).toHaveAttribute('data-app-header-mode', 'desktop')
  await expect(appHeader.getByRole('region', { name: '商户保证金数据' })).toContainText('9,949,771.34')

  await appHeader.getByRole('button', { name: '充值' }).click()
  await expect(preview.getByTestId('app-header-event')).toHaveText('ACTION / DEPOSIT')
  await appHeader.getByRole('button', { name: '收起菜单' }).click()
  await expect(preview.getByTestId('app-header-event')).toHaveText('SIDEBAR / COLLAPSED')
  await appHeader.getByRole('button', { name: '切换深色主题' }).click()
  await expect(preview.getByTestId('app-header-event')).toHaveText('THEME / DARK')
  await expect(appHeader).toHaveAttribute('data-app-header-theme', 'dark')

  await preview.getByRole('button', { name: '切换到平板预览' }).click()
  await expect(appHeader).toHaveAttribute('data-app-header-mode', 'mobile')
  await expect(appHeader.locator('[data-app-header-identity-icon]')).toBeVisible()
  await expect(appHeader.locator('.mm-app-header__identity-dot')).toHaveCount(0)
  const mobileToggle = appHeader.locator('[data-app-header-toggle="mobile"]')
  await expect(mobileToggle).toHaveAccessibleName('打开导航菜单')
  await mobileToggle.click()
  await expect(mobileToggle).toHaveAttribute('aria-expanded', 'true')
  await expect(mobileToggle).toHaveAccessibleName('关闭导航菜单')
  await expect(preview.getByTestId('app-header-event')).toHaveText('MOBILE NAV / OPEN')

  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/component-info#component-app-header')
  const section = page.locator('[data-component-section="App Header"]')
  await expect(section.getByRole('heading', { name: 'MmAppHeader' })).toBeVisible()
  await section.getByRole('button', { name: '查看代码' }).click()
  await expect(page.locator('.component-info-drawer [data-usage-example]')).toContainText('<MmAppHeader')

  const expandedPreview = section.getByTestId('app-header-preview')
  await expandedPreview.getByRole('button', { name: '切换到手机预览' }).click()
  const phoneHeader = expandedPreview.locator('[data-mm-component="app-header"]')
  await expect(phoneHeader).toHaveAttribute('data-app-header-mode', 'mobile')
  await expect(phoneHeader.locator('[data-app-header-brand]')).toContainText('管理后台')
  await expect(phoneHeader.locator('[data-app-header-identity-icon]')).toBeVisible()
  await expect(phoneHeader.locator('.mm-app-header__identity-dot')).toHaveCount(0)
  await expect(page.locator('html')).not.toHaveClass(/mobile-navigation-open/)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('query bar has an independent homepage specimen with query and reset snapshots', async ({ page }) => {
  await page.goto('/#preview-query-bar')

  const section = page.getByRole('region', { name: 'MmQueryBar' })
  const queryBar = section.locator('[data-mm-component="query-bar"]')

  await expect(section).toBeVisible()
  await expect(queryBar.locator('[data-query-field]')).toHaveCount(5)
  const compactControlHeights = await queryBar.evaluate((element) => ({
    buttons: Array.from(element.querySelectorAll<HTMLElement>('.mm-query-bar__actions .mm-button'))
      .map((control) => control.getBoundingClientRect().height),
    coin: element.querySelector<HTMLElement>('[data-query-field="coin"] .mm-input__control')?.getBoundingClientRect().height,
    dateRange: element.querySelector<HTMLElement>('[data-query-field="range"] .mm-input__control')?.getBoundingClientRect().height,
    keyword: element.querySelector<HTMLElement>('[data-query-field="keyword"] .mm-input__control')?.getBoundingClientRect().height,
    segmented: element.querySelector<HTMLElement>('[data-query-field="status"] .mm-segmented')?.getBoundingClientRect().height,
    select: element.querySelector<HTMLElement>('[data-query-field="level"] .mm-select__control')?.getBoundingClientRect().height,
  }))
  expect(compactControlHeights).toEqual({
    buttons: [28, 28],
    coin: 28,
    dateRange: 28,
    keyword: 28,
    segmented: 28,
    select: 28,
  })
  await queryBar.locator('[data-query-field="keyword"] input').fill('alice')
  await queryBar.getByRole('button', { name: '查询' }).click()
  await expect(section.getByTestId('query-bar-event')).toHaveText('QUERY')
  await expect(section.getByTestId('query-bar-snapshot')).toContainText('alice')

  await queryBar.getByRole('button', { name: '重置' }).click()
  await expect(queryBar.locator('[data-query-field="keyword"] input')).toHaveValue('')
  await expect(section.getByTestId('query-bar-event')).toHaveText('RESET')
})

test('query bar catalog preview composes common filters and resets its draft', async ({ page }) => {
  await page.goto('/')

  const catalog = page.getByRole('region', { name: '组件预览目录' })
  await catalog.getByRole('textbox', { name: '搜索组件' }).fill('Query Bar')
  await catalog.locator('[data-component-name="Query Bar"]').click()

  const technicalDrawer = page.getByRole('dialog', { name: '组件技术信息' })
  const preview = technicalDrawer.getByTestId('live-component-preview')
  const queryBar = preview.locator('[data-mm-component="query-bar"]')

  await expect(queryBar).toBeVisible()
  await expect(queryBar.locator('[data-query-field]')).toHaveCount(5)
  await queryBar.locator('[data-query-field="keyword"] input').fill('alice')
  await expect(queryBar.locator('[data-query-field="keyword"] input')).toHaveValue('alice')
  await queryBar.getByRole('button', { name: '重置' }).click()
  await expect(queryBar.locator('[data-query-field="keyword"] input')).toHaveValue('')

  await technicalDrawer.getByRole('button', { name: '查看实际示例' }).click()
  await expect(technicalDrawer).toBeHidden()
  await expect(page.locator('#preview-query-bar')).toBeFocused()
})

test('filter drawer is interactive on home and component info', async ({ page }) => {
  await page.goto('/')

  const catalog = page.getByRole('region', { name: '组件预览目录' })
  await catalog.getByRole('textbox', { name: '搜索组件' }).fill('Filter Drawer')
  await catalog.locator('[data-component-name="Filter Drawer"]').click()

  const technicalDrawer = page.getByRole('dialog', { name: '组件技术信息' })
  const preview = technicalDrawer.getByTestId('live-component-preview')
  const trigger = preview.getByRole('button', { name: '更多筛选在线账户，已启用 1 项' })
  await expect(trigger).toBeVisible()
  await trigger.click()

  const filterOverlay = page.locator('.mm-filter-drawer__overlay')
  const filterDrawer = filterOverlay.getByRole('dialog')
  await expect(filterDrawer).toBeVisible()
  await expect(filterDrawer).toContainText('在线账户 · 6 个筛选项')
  await expect(filterDrawer.locator('[data-query-field]')).toHaveCount(6)

  const username = filterDrawer.locator('[data-query-field="username"] input')
  await username.fill('draft-user')
  await filterDrawer.getByRole('button', { name: '关闭对话框' }).click()
  await expect(trigger).toBeFocused()

  await trigger.click()
  await expect(filterDrawer.locator('[data-query-field="username"] input')).toHaveValue('')
  await filterDrawer.locator('[data-query-field="username"] input').fill('committed-user')
  await filterDrawer.getByRole('button', { name: '查询' }).click()
  await expect(preview.getByRole('button', { name: '更多筛选在线账户，已启用 2 项' })).toBeVisible()

  await page.setViewportSize({ height: 844, width: 390 })
  await page.goto('/component-info#component-filter-drawer')
  const section = page.locator('[data-component-section="Filter Drawer"]')
  await expect(section.getByRole('heading', { name: 'MmFilterDrawer' })).toBeVisible()
  await section.getByRole('button', { name: '查看代码' }).click()
  await expect(page.locator('.component-info-drawer [data-usage-example]')).toContainText('MmFilterDrawer')
  await section.getByRole('button', { name: '更多筛选在线账户，已启用 1 项' }).click()

  const narrowDrawer = page.locator('.mm-filter-drawer__overlay').getByRole('dialog')
  const firstField = narrowDrawer.locator('[data-query-field="account"]')
  const secondField = narrowDrawer.locator('[data-query-field="username"]')
  const firstBox = await firstField.boundingBox()
  const secondBox = await secondField.boundingBox()
  expect(secondBox?.y).toBeGreaterThan(firstBox?.y ?? 0)
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})

test('sidebar navigation previews expanded, accordion, collapsed, and mobile states', async ({ page }) => {
  await page.goto('/component-info#component-sidebar-nav')

  const section = page.locator('[data-component-section="Sidebar Nav"]')
  const preview = section.getByTestId('live-component-preview')
  const sidebar = preview.locator('[data-mm-component="sidebar-nav"][data-sidebar-mode="expanded"]')

  await expect(section.getByRole('heading', { name: 'MmSidebarNav' })).toBeVisible()
  await expect(sidebar).toBeVisible()
  await expect(sidebar.locator('[data-sidebar-group="users"]')).toHaveClass(/is-active-path/)
  await expect(sidebar.locator('[data-sidebar-item="online-accounts"]')).toHaveAttribute('aria-current', 'page')

  await sidebar.locator('[data-sidebar-group="funds"] .mm-sub-menu__trigger').click()
  await expect(sidebar.locator('[data-sidebar-group="funds"]')).toHaveClass(/is-open/)
  await expect(sidebar.locator('[data-sidebar-group="users"]')).not.toHaveClass(/is-open/)
  await sidebar.locator('[data-sidebar-item="guarantee"]').click()
  await expect(preview.getByTestId('sidebar-active-route')).toHaveText('#/merchant/funds/guarantee')

  await preview.getByTestId('sidebar-collapse-toggle').click()
  const collapsed = preview.locator('[data-mm-component="sidebar-nav"][data-sidebar-mode="collapsed"]')
  await expect(collapsed).toBeVisible()
  await expect(collapsed.getByRole('button', { name: '资金管理' })).toHaveClass(/is-active-path/)

  await preview.getByTestId('sidebar-mobile-toggle').click()
  const mobileDrawer = page.locator('.mm-sidebar-nav__drawer').getByRole('dialog')
  await expect(mobileDrawer).toBeVisible()
  await expect(mobileDrawer).toContainText('管理后台')
  await mobileDrawer.getByRole('button', { name: '关闭对话框' }).click()
  await expect(mobileDrawer).toBeHidden()
  await section.getByRole('button', { name: '查看代码' }).click()
  await expect(page.locator('.component-info-drawer [data-usage-example]')).toContainText('MmSidebarNav')
})

test('autocomplete dropdown uses a compact theme-aware scrollbar', async ({ page }) => {
  await page.goto('/component-info#component-autocomplete')

  const section = page.locator('[data-component-section="Autocomplete"]')
  const input = section.locator('[data-preview-size="md"] input')
  await input.focus()

  const dropdown = page.locator('.mm-autocomplete__dropdown:visible')
  await expect(dropdown).toBeVisible()
  const scrollbarStyle = await dropdown.evaluate((element) => {
    const style = getComputedStyle(element)
    const scrollbar = getComputedStyle(element, '::-webkit-scrollbar')
    const thumb = getComputedStyle(element, '::-webkit-scrollbar-thumb')
    return {
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      overscrollBehavior: style.overscrollBehavior,
      scrollbarGutter: style.scrollbarGutter,
      scrollbarWidth: style.scrollbarWidth,
      thumbBackgroundClip: thumb.backgroundClip,
      webkitScrollbarWidth: scrollbar.width,
    }
  })

  expect(scrollbarStyle).toEqual({
    overflowX: 'hidden',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarGutter: 'auto',
    scrollbarWidth: 'thin',
    thumbBackgroundClip: 'padding-box',
    webkitScrollbarWidth: '8px',
  })
})

test('select dropdown uses a compact theme-aware scrollbar', async ({ page }) => {
  await page.goto('/component-info#component-select')

  const section = page.locator('[data-component-section="Select"]')
  await section.locator('[data-preview-size="md"] .mm-select__control').click()

  const dropdown = page.locator('.mm-select__dropdown:visible')
  await expect(dropdown).toBeVisible()
  const scrollbarStyle = await dropdown.evaluate((element) => {
    const style = getComputedStyle(element)
    const scrollbar = getComputedStyle(element, '::-webkit-scrollbar')
    const thumb = getComputedStyle(element, '::-webkit-scrollbar-thumb')
    return {
      overflowX: style.overflowX,
      overflowY: style.overflowY,
      overscrollBehavior: style.overscrollBehavior,
      scrollbarGutter: style.scrollbarGutter,
      scrollbarWidth: style.scrollbarWidth,
      thumbBackgroundClip: thumb.backgroundClip,
      webkitScrollbarWidth: scrollbar.width,
    }
  })

  expect(scrollbarStyle).toEqual({
    overflowX: 'hidden',
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    scrollbarGutter: 'auto',
    scrollbarWidth: 'thin',
    thumbBackgroundClip: 'padding-box',
    webkitScrollbarWidth: '8px',
  })
})
