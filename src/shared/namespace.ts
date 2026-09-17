export type CssVarValue = string | number | undefined
export type CssVarRecord = Record<string, CssVarValue>

const namespace = 'mm'
const statePrefix = 'is-'

function joinName(block: string, blockSuffix?: string): string {
  return `${namespace}-${block}${blockSuffix ? `-${blockSuffix}` : ''}`
}

export function useNamespace(block: string) {
  const b = (blockSuffix?: string): string => joinName(block, blockSuffix)
  const e = (element?: string): string => (element ? `${b()}__${element}` : '')
  const m = (modifier?: string): string => (modifier ? `${b()}--${modifier}` : '')
  const be = (blockSuffix?: string, element?: string): string =>
    blockSuffix && element ? `${b(blockSuffix)}__${element}` : ''
  const bm = (blockSuffix?: string, modifier?: string): string =>
    blockSuffix && modifier ? `${b(blockSuffix)}--${modifier}` : ''
  const em = (element?: string, modifier?: string): string =>
    element && modifier ? `${e(element)}--${modifier}` : ''
  const bem = (blockSuffix?: string, element?: string, modifier?: string): string =>
    blockSuffix && element && modifier ? `${be(blockSuffix, element)}--${modifier}` : ''
  const is = (name: string, state = true): string => (name && state ? `${statePrefix}${name}` : '')
  const cssVarName = (...names: string[]): string => `--${namespace}-${names.join('-')}`
  const cssVar = (values: CssVarRecord): Record<string, string | number> =>
    Object.fromEntries(
      Object.entries(values)
        .filter((entry): entry is [string, string | number] => entry[1] !== undefined)
        .map(([name, value]) => [cssVarName(name), value]),
    )

  return { b, be, bem, bm, cssVar, cssVarName, e, em, is, m }
}

export type Namespace = ReturnType<typeof useNamespace>
