import { expect, test } from '@playwright/test'

test('upload runs the injected request and reaches success', async ({ page }) => {
  await page.goto('/')

  const upload = page.getByTestId('advanced-upload')
  await upload.locator('input[type="file"]').setInputFiles({
    buffer: Buffer.from('{"strategy":"grid"}'),
    mimeType: 'application/json',
    name: 'strategy.json',
  })

  await expect(upload.locator('.mm-upload__file')).toContainText('strategy.json')
  await expect(upload.locator('.mm-upload__file')).toHaveClass(/is-success/)
})
