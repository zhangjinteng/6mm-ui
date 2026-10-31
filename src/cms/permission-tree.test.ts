import { describe, expect, it } from 'vitest'
import { cmsPermissionItems, cmsPermissionSubmission, type CmsPermissionNode } from './permission-tree'

const tree: CmsPermissionNode[] = [{ id: 1, name: '内容管理', type: 'M', children: [
  { id: 2, name: '新闻列表', type: 'C', perms: 'cms_news:lists', children: [
    { id: 3, name: '新增', type: 'A', perms: 'cms_news:add' },
    { id: 4, name: '发布', type: 'A', perms: 'cms_news:publish' },
  ] },
  { id: 5, name: '课程列表', type: 'C', perms: 'cms_academy:lists', children: [
    { id: 6, name: '新增', type: 'A', perms: 'cms_academy:add' },
  ] },
] }]
describe('CMS page and action grants', () => {
  it('keeps list-only permissions and disambiguates same-named actions by page', () => {
    expect(cmsPermissionItems(tree[0], node => node.name!)).toEqual([
      { id: 2, name: '新闻列表' }, { id: 3, name: '新闻列表 / 新增' },
      { id: 4, name: '新闻列表 / 发布' }, { id: 5, name: '课程列表' }, { id: 6, name: '课程列表 / 新增' },
    ])
  })
  it('round-trips a read-only role without silently dropping page permissions or granting writes', () => {
    expect(cmsPermissionSubmission(tree, [2, 5])).toEqual([2, 5, 1])
  })
  it('an action includes only its own ancestor page and catalogue', () => {
    expect(cmsPermissionSubmission(tree, ['4'])).toEqual([4, 2, 1])
    expect(cmsPermissionSubmission(tree, [])).toEqual([])
  })
  it('preserves legacy leaf-only navigation behavior outside CMS', () => {
    const legacy = [{ id: 10, name: '用户', children: [{ id: 11, name: '用户列表' }] }]
    expect(cmsPermissionItems(legacy[0], node => node.name!)).toEqual([{ id: 11, name: '用户列表' }])
    expect(cmsPermissionSubmission(legacy, [11])).toEqual([11, 10])
  })
  it('distinguishes identically named classification pages by their CMS catalogue', () => {
    const node: CmsPermissionNode = { id: 20, type: 'M', name: '内容管理', children: [
      { id: 21, type: 'M', name: '新闻', children: [{ id: 22, type: 'C', name: '分类管理', perms: 'cms_news_category:lists', children: [
        { id: 23, type: 'A', name: '新增', perms: 'cms_news_category:add' },
      ] }] },
    ] }
    expect(cmsPermissionItems(node, item => item.name!)).toEqual([
      { id: 22, name: '新闻 / 分类管理' }, { id: 23, name: '新闻 / 分类管理 / 新增' },
    ])
  })
})
