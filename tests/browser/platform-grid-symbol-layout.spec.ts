import { expect, test } from '@playwright/test'
import { parse, compileStyle } from '@vue/compiler-sfc'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const directory = new URL('../../src/prediction-config/platform/views/grid/config/', import.meta.url)
const pageSource = readFileSync(new URL('GlobalGridConfig.vue', directory), 'utf8')
const style = readFileSync(new URL('grid-config.css', directory), 'utf8')
const template = parse(pageSource).descriptor.template!.content
const panel = template.slice(template.indexOf('<aside'), template.indexOf('</aside>') + '</aside>'.length)

for (const width of [1512, 390]) {
  test(`platform Grid keeps each switch beside its symbol at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 })
    await page.setContent('<main id="app" class="grid-layout"></main>')
    await page.addScriptTag({ path: require.resolve('vue/dist/vue.global.prod.js') })
    await page.addScriptTag({ path: require.resolve('element-plus/dist/index.full.min.js') })
    await page.addStyleTag({ path: require.resolve('element-plus/dist/index.css') })
    await page.addStyleTag({ content: compileStyle({ source: style, id: 'grid-layout-test', filename: 'grid-config.css', scoped: false }).code })
    await page.evaluate((template) => {
      const { Vue, ElementPlus } = window as any
      const products = [{ symbol: 'BTCUSDT', configured: false }, { symbol: 'ETHUSDT', configured: true }]
      Vue.createApp({
        template,
        components: { ElSwitch: ElementPlus.ElSwitch, MmInput: { template: '<input>' }, SymbolDisplay: { props: ['symbol'], template: '<span>{{ symbol }}</span>' } },
        setup: () => ({ filtered: products, symbol: 'BTCUSDT', keyword: '', busy: false, pending: null, locked: false }),
      }).mount('#app')
    }, panel)
    for (const row of await page.locator('.symbol-row').all()) {
      const box = await row.getByRole('button').boundingBox()
      const toggle = await row.getByRole('switch').boundingBox()
      expect(box).toBeTruthy()
      expect(toggle).toBeTruthy()
      expect(toggle!.x).toBeGreaterThanOrEqual(box!.x + box!.width)
      expect(toggle!.y + toggle!.height / 2).toBeCloseTo(box!.y + box!.height / 2, 0)
    }
    await expect(page.getByRole('switch')).toHaveCount(2)
  })
}
