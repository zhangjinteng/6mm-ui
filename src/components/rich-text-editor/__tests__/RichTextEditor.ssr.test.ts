// @vitest-environment node
import { renderToString } from '@vue/server-renderer'
import { createSSRApp, h } from 'vue'
import { expect, it } from 'vitest'

import RichTextEditor from '../RichTextEditor.vue'

it('can render on the server without creating a DOM editor', async () => {
  const html = await renderToString(createSSRApp({ render: () => h(RichTextEditor, { modelValue: '<p>公告</p>' }) }))
  expect(html).toContain('data-mm-component="rich-text-editor"')
  expect(html).toContain('mm-rich-text-editor__content')
})
