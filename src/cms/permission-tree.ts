export type CmsMenuId = string | number
export interface CmsPermissionNode {
  id: CmsMenuId
  name?: string
  type?: string
  perms?: string
  children?: CmsPermissionNode[]
}

/** CMS list access remains selectable even when a page has write-action children. */
export function cmsPermissionItems(
  node: CmsPermissionNode,
  name: (node: CmsPermissionNode) => string,
  parentPage = '',
  depth = 0,
): { id: CmsMenuId; name: string }[] {
  const children = node.children ?? []
  const isCmsPage = node.type === 'C' && !!node.perms?.startsWith('cms_')
  const label = name(node)
  const contextualLabel = parentPage ? `${parentPage} / ${label}` : label
  const context = isCmsPage || (node.type === 'M' && depth > 0) ? contextualLabel : parentPage
  const items = !children.length || isCmsPage
    ? [{ id: node.id, name: isCmsPage || (node.type === 'A' && node.perms?.startsWith('cms_')) ? contextualLabel : label }]
    : []
  return [...items, ...children.flatMap(child => cmsPermissionItems(child, name, context, depth + 1))]
}

/** Action selection implies ancestors; selecting list access never grants its actions. */
export function cmsPermissionSubmission(nodes: CmsPermissionNode[], selectedIds: CmsMenuId[]): CmsMenuId[] {
  const selected = new Set(selectedIds.map(String))
  const included = new Set<string>()
  const result: CmsMenuId[] = []
  function visit(node: CmsPermissionNode): boolean {
    const children = node.children ?? []
    let keep = (!children.length || (node.type === 'C' && node.perms?.startsWith('cms_')))
      && selected.has(String(node.id))
    for (const child of children) if (visit(child)) keep = true
    if (keep && !included.has(String(node.id))) {
      included.add(String(node.id))
      result.push(node.id)
    }
    return !!keep
  }
  nodes.forEach(visit)
  return result
}
