import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) => readFileSync(new URL(path, import.meta.url), 'utf8')

describe('prediction configuration package boundary', () => {
  it('owns the styles of the controls used by the optional entry', () => {
    const entry = source('./index.ts')
    for (const name of ['alert', 'button', 'card', 'dialog', 'drawer', 'empty', 'form', 'form-item', 'icon', 'input', 'message', 'message-box', 'option', 'popover', 'select', 'switch', 'tag']) {
      expect(entry).toContain(`element-plus/es/components/${name}/style/css`)
    }
  })

  it('does not force Element Plus on core-only consumers', () => {
    expect(source('../index.ts')).not.toContain('prediction-config')
    expect(source('../index.ts')).not.toContain('element-plus')
  })

  it('inherits host theme colors instead of hard-coding one host brand', () => {
    const theme = source('./theme.css')
    expect(theme).toContain('--el-color-primary: var(--mm-color-primary)')
    expect(theme).not.toMatch(/#[\da-f]{3,8}\b/i)
  })

  it('provides its own grid loading boundary without a globally registered directive', () => {
    const page = source('./agent/views/grid/config/index.vue')
    expect(page).not.toContain('v-loading')
    expect(page).toContain('import PredictionLoadingRegion')
    expect(page).toContain('class="grid-loading-region"')
    expect(page).toContain('<div class="grid-layout">')
  })

  it('keeps the inner viewport height instead of stretching it to all symbol rows', () => {
    const root = source('./MmPredictionGameConfig.vue')
    expect(root).not.toContain('height:100%')
    expect(root).not.toContain('flex:1')
    expect(source('./platform/views/config/prediction/index.vue')).toContain('height: calc(100dvh')
  })
})
