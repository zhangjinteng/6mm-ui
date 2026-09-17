export interface ScrollbarProps {
  always?: boolean
  height?: number | string
  maxHeight?: number | string
  tabindex?: number
  viewClass?: string
}

export interface ScrollbarPosition {
  scrollLeft: number
  scrollTop: number
}

export interface ScrollbarExpose {
  scrollTo: (options: ScrollToOptions) => void
  setScrollLeft: (value: number) => void
  setScrollTop: (value: number) => void
  wrapRef: HTMLElement | undefined
}
