import { describe, expect, it } from 'vitest'

import baseCss from '../base.css?raw'
import scrollbarCss from '../scrollbars.css?raw'
import tokenCss from '../tokens.css?raw'

describe('design styles', () => {
  it('defines the core light and dark theme tokens', () => {
    expect(tokenCss).toContain("[data-mm-theme='dark']")
    expect(tokenCss).toContain('--mm-color-primary: #0accaa')
    expect(tokenCss).toContain('--mm-color-panel: #fff')
    expect(tokenCss).toContain('--mm-font-family:')
    expect(tokenCss).toContain('--mm-space-4: 16px')
    expect(tokenCss).toContain('--mm-radius-md: 8px')
    expect(tokenCss).toContain('--mm-z-dialog: 1200')
  })

  it('keeps reset rules scoped to the component library', () => {
    expect(baseCss).toContain('.mm-ui')
    expect(baseCss).toContain('[data-mm-component]')
    expect(baseCss).not.toMatch(/(^|})\s*(html|body|\*)\s*[{,]/m)
  })

  it('defines one scoped scrollbar style for all components', () => {
    expect(scrollbarCss).toContain("[data-mm-component]")
    expect(scrollbarCss).toContain("[class^='mm-']")
    expect(scrollbarCss).toContain('scrollbar-gutter: auto')
    expect(scrollbarCss).toContain('scrollbar-width: thin')
    expect(scrollbarCss).toContain('::-webkit-scrollbar-thumb:hover')
    expect(scrollbarCss).not.toMatch(/(^|})\s*(html|body|\*)\s*[{,]/m)
  })
})
