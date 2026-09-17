import { expect, test } from '@playwright/test'

test('@theme light and dark tokens reach the page and teleported overlays', async ({ page }) => {
  await page.goto('/')

  const playground = page.locator('main.playground')
  const primaryButton = page.getByRole('button', { name: '执行任务' })
  const primaryButtonColors = () => primaryButton.evaluate((element) => {
    const icon = element.querySelector('.mm-icon')
    return {
      button: getComputedStyle(element).color,
      icon: icon ? getComputedStyle(icon).color : '',
    }
  })

  await expect(page.locator('html')).toHaveAttribute('data-mm-theme', 'light')
  await expect(playground).toHaveAttribute('data-mm-theme', 'light')
  await expect.poll(() => playground.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      primary: style.getPropertyValue('--mm-color-primary').trim(),
      text: style.color,
    }
  })).toEqual({ background: 'rgb(244, 246, 248)', primary: '#087765', text: 'rgb(23, 32, 51)' })
  await expect.poll(primaryButtonColors).toEqual({
    button: 'rgb(255, 255, 255)',
    icon: 'rgb(255, 255, 255)',
  })

  await page.getByRole('button', { name: '切换到暗色主题' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-mm-theme', 'dark')
  await expect(playground).toHaveAttribute('data-mm-theme', 'dark')
  await expect(page.getByLabel('组件库状态').getByText('DARK', { exact: true })).toBeVisible()
  await expect.poll(() => playground.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      background: style.backgroundColor,
      primary: style.getPropertyValue('--mm-color-primary').trim(),
      text: style.color,
    }
  })).toEqual({ background: 'rgb(8, 13, 16)', primary: '#0accaa', text: 'rgb(232, 238, 240)' })
  await expect.poll(primaryButtonColors).toEqual({
    button: 'rgb(4, 27, 22)',
    icon: 'rgb(4, 27, 22)',
  })

  await page.getByTestId('feedback-dialog-trigger').click()
  const dialog = page.getByRole('dialog', { name: '策略发布确认' })
  await expect(dialog).toBeVisible()
  expect(await dialog.evaluate((element) => {
    const style = getComputedStyle(element)
    return { background: style.backgroundColor, color: style.color }
  })).toEqual({ background: 'rgb(16, 23, 27)', color: 'rgb(232, 238, 240)' })
})

test('@theme default and semantic buttons keep their configured hover colors', async ({ page }) => {
  await page.goto('/')

  const defaultButton = page.getByRole('button', { name: '复制凭证', exact: true })
  await defaultButton.hover()
  await expect.poll(() => defaultButton.evaluate((element) => {
    const style = getComputedStyle(element)
    return { border: style.borderColor, color: style.color }
  })).toEqual({ border: 'rgb(8, 119, 101)', color: 'rgb(8, 119, 101)' })

  for (const name of ['确认入账', '风险复核', '撤销权限']) {
    const button = page.getByRole('button', { name, exact: true })
    await button.hover()

    await expect.poll(() => button.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        background: style.backgroundColor,
        border: style.borderColor,
      }
    })).toEqual(await button.evaluate((element) => {
      const background = getComputedStyle(element).backgroundColor
      return { background, border: background }
    }))
  }
})

test('@theme semantic plain buttons use panel backgrounds and semantic borders', async ({ page }) => {
  await page.goto('/')

  const expectedStyles = {
    白底成功: 'rgb(11, 118, 81)',
    白底警告: 'rgb(180, 83, 9)',
    白底危险: 'rgb(194, 56, 56)',
  }

  for (const [name, semanticColor] of Object.entries(expectedStyles)) {
    const button = page.getByRole('button', { name, exact: true })
    await expect.poll(() => button.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        background: style.backgroundColor,
        border: style.borderColor,
        color: style.color,
      }
    })).toEqual({
      background: 'rgb(255, 255, 255)',
      border: semanticColor,
      color: semanticColor,
    })
  }
})

test('@theme responsive composition switches at the documented mobile breakpoint', async ({ page }) => {
  await page.setViewportSize({ height: 900, width: 1280 })
  await page.goto('/')

  const columnCount = (selector: string) => page.locator(selector).evaluate((element) =>
    getComputedStyle(element).gridTemplateColumns.split(' ').length,
  )
  expect(await columnCount('.status-rail')).toBe(4)
  expect(await columnCount('.specimen-grid')).toBe(2)
  expect(await columnCount('.navigation-workspace')).toBe(2)

  await page.setViewportSize({ height: 844, width: 390 })
  await expect.poll(() => columnCount('.status-rail')).toBe(2)
  await expect.poll(() => columnCount('.specimen-grid')).toBe(1)
  await expect.poll(() => columnCount('.navigation-workspace')).toBe(1)
  await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
})
