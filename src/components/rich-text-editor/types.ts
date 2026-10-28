import type { Editor, Extensions, JSONContent } from '@tiptap/core'

import type { FormControlSize, FormControlStatus } from '../../shared/form'

export interface RichTextEditorValue {
  html: string
  json: JSONContent
  text: string
}

export interface RichTextEditorProps {
  ariaLabel?: string
  disabled?: boolean
  /** Extra nodes, marks, and plugins. Do not duplicate the built-in extensions. */
  extensions?: Extensions
  id?: string
  maxHeight?: number | string
  minHeight?: number | string
  modelValue?: string | null
  placeholder?: string
  readonly?: boolean
  showCount?: boolean
  size?: FormControlSize
  status?: FormControlStatus
  toolbar?: boolean
}

export interface RichTextEditorExpose {
  blur: () => void
  clear: () => boolean
  editor: Editor | undefined
  focus: () => void
  getHTML: () => string
  getJSON: () => JSONContent | undefined
  insertContent: (html: string) => boolean
  setContent: (html: string) => boolean
}
