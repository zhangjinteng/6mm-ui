import { expect, test } from '@playwright/test'

test('navigation components compose into a keyboard-ready workspace', async ({ page }) => {
  await page.goto('/')

  const pageHeader = page.getByTestId('strategy-page-header')
  await pageHeader.getByRole('button', { name: '返回' }).click()
  await expect(pageHeader.getByText('BACK_TO_STRATEGIES')).toBeVisible()

  const dropdown = page.getByTestId('strategy-actions')
  const dropdownTrigger = dropdown.getByRole('button', { name: '策略操作' })
  await dropdownTrigger.click()
  await expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'true')
  const dropdownPopup = page.locator('.mm-dropdown__popup')
  await expect(dropdownPopup).toBeVisible()
  const popupBeforeHover = await dropdownPopup.boundingBox()
  await dropdownPopup.getByRole('menuitem').first().hover()
  const popupAfterHover = await dropdownPopup.boundingBox()
  expect(popupBeforeHover).not.toBeNull()
  expect(popupAfterHover).not.toBeNull()
  expect(popupAfterHover!.x).toBeCloseTo(popupBeforeHover!.x, 1)
  expect(popupAfterHover!.y).toBeCloseTo(popupBeforeHover!.y, 1)
  const dropdownFrame = await dropdownPopup.evaluate((element) => {
    const popupStyle = getComputedStyle(element)
    const menu = element.querySelector<HTMLElement>('.mm-dropdown__menu')!
    const menuStyle = getComputedStyle(menu)
    const menuScrollbar = getComputedStyle(menu, '::-webkit-scrollbar')
    const menuScrollbarThumb = getComputedStyle(menu, '::-webkit-scrollbar-thumb')
    return {
      borderWidths: [popupStyle.borderTopWidth, popupStyle.borderRightWidth, popupStyle.borderBottomWidth, popupStyle.borderLeftWidth],
      menuMaxHeight: menuStyle.maxHeight,
      menuOverflowX: menuStyle.overflowX,
      menuOverflowY: menuStyle.overflowY,
      menuOverscrollBehavior: menuStyle.overscrollBehavior,
      menuRadius: menuStyle.borderRadius,
      menuScrollbarGutter: menuStyle.scrollbarGutter,
      menuScrollbarThumbBackgroundClip: menuScrollbarThumb.backgroundClip,
      menuScrollbarWidth: menuScrollbar.width,
      overflow: popupStyle.overflow,
      radius: popupStyle.borderRadius,
    }
  })
  expect(dropdownFrame.borderWidths).toEqual(['1px', '1px', '1px', '1px'])
  expect(dropdownFrame.menuMaxHeight).toBe('280px')
  expect(dropdownFrame.menuOverflowX).toBe('hidden')
  expect(dropdownFrame.menuOverflowY).toBe('auto')
  expect(dropdownFrame.menuOverscrollBehavior).toBe('contain')
  expect(dropdownFrame.menuRadius).toBe('0px')
  expect(dropdownFrame.menuScrollbarGutter).toBe('auto')
  expect(dropdownFrame.menuScrollbarThumbBackgroundClip).toBe('padding-box')
  expect(dropdownFrame.menuScrollbarWidth).toBe('8px')
  expect(dropdownFrame.overflow).toBe('hidden')
  expect(Number.parseFloat(dropdownFrame.radius)).toBeGreaterThan(0)
  await page.getByRole('menuitem', { name: '导出审计记录' }).click()
  await expect(pageHeader.getByText('ACTION_EXPORT-AUDIT')).toBeVisible()
  await expect(dropdownTrigger).toHaveAttribute('aria-expanded', 'false')

  const menu = page.getByTestId('console-menu')
  const overview = menu.getByRole('menuitem', { name: '运行概览' })
  await overview.focus()
  await overview.press('End')
  await expect(menu.getByRole('menuitem', { name: '审计日志' })).toBeFocused()
  await page.keyboard.press('Home')
  await expect(overview).toBeFocused()
  const subMenu = menu.getByRole('menuitem', { name: '执行管理' })
  await subMenu.click()
  await expect(subMenu).toHaveAttribute('aria-expanded', 'false')
  await subMenu.press('ArrowRight')
  await expect(menu.getByRole('menuitem', { name: '发布队列' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByText('SELECTED QUEUE')).toBeVisible()

  const tabs = page.getByTestId('strategy-tabs')
  await expect(page.getByTestId('lazy-orders-panel')).toHaveCount(0)
  const ordersTab = tabs.getByRole('tab', { name: '订单流' })
  await ordersTab.click()
  await expect(page.getByTestId('lazy-orders-panel')).toBeVisible()
  await ordersTab.press('End')
  await expect(tabs.getByRole('tab', { name: '变更审计' })).toHaveAttribute('aria-selected', 'true')

  const steps = page.getByTestId('release-steps')
  const connectorMetrics = await steps.evaluate((element) => {
    const stepItems = Array.from(element.querySelectorAll<HTMLElement>('.mm-step'))
    return stepItems.slice(0, -1).map((step, index) => {
      const line = step.querySelector<HTMLElement>('.mm-step__line')!.getBoundingClientRect()
      const nextIcon = stepItems[index + 1]!.querySelector<HTMLElement>('.mm-step__icon')!.getBoundingClientRect()
      return {
        lineWidth: line.width,
        nextIconCenter: nextIcon.left + nextIcon.width / 2,
        lineRight: line.right,
      }
    })
  })
  expect(connectorMetrics.every(({ lineWidth }) => lineWidth > 40)).toBe(true)
  expect(connectorMetrics.every(({ lineRight, nextIconCenter }) => Math.abs(lineRight - nextIconCenter) < 1)).toBe(true)
  const labelMetrics = await steps.evaluate((element) => Array.from(element.querySelectorAll<HTMLElement>('.mm-step')).map((step) => {
    const icon = step.querySelector<HTMLElement>('.mm-step__icon')!.getBoundingClientRect()
    const body = step.querySelector<HTMLElement>('.mm-step__body')!.getBoundingClientRect()
    return {
      bodyCenter: body.left + body.width / 2,
      bodyTop: body.top,
      iconBottom: icon.bottom,
      iconCenter: icon.left + icon.width / 2,
    }
  }))
  expect(labelMetrics.every(({ bodyTop, iconBottom }) => bodyTop >= iconBottom + 6)).toBe(true)
  expect(labelMetrics.every(({ bodyCenter, iconCenter }) => Math.abs(bodyCenter - iconCenter) < 1)).toBe(true)
  await steps.getByRole('button', { name: /执行上线/ }).click()
  await expect(steps.locator('.mm-step').nth(2)).toHaveAttribute('aria-current', 'step')
})
