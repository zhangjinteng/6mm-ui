<template>
  <div class="cms-fixture-shell">
    <header class="cms-fixture-header">CMS viewport regression</header>
    <main class="cms-fixture-scroll">
      <div class="cms-fixture-padding">
        <MmCmsPage :page="page" :runtime="runtime" identity-key="fixture" :viewport="true" />
      </div>
    </main>
  </div>
</template>
<script setup lang="ts">
import { MmCmsPage, type CmsPage, type CmsRuntime } from '../src/cms'
const params = new URLSearchParams(location.search)
const page = (params.get('page') || 'news/categories') as CmsPage
const rows = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1), row_version: '1', code: `ROW-${i + 1}`, name: `分类 ${i + 1}`, title: `内容 ${i + 1}`,
  parent_id: null, category_id: null, is_enabled: true, sort_order: i, publish_status: 'draft',
  cms_source_name: '管理员', cms_source_type: 'platform', updated_by_name: '管理员', updated_at: '2026-10-31 12:00:00',
  difficulty_levels: [1], difficulty_level: 1, category_ids: [], news_count: 0, course_count: 0, help_count: 0,
  source_type: 'platform', content: `反馈 ${i + 1}`, public_user_id_snapshot: '100', scene_name_snapshot: '交易', issue_category_name_snapshot: '其他'
}))
const runtime: CmsRuntime = {
  mode: params.get('mode') === 'white_label' ? 'white_label' : 'platform',
  hasPermission: () => false, formatDateTime: value => String(value ?? '—'),
  request: {
    async get<T>(options: Record<string, any>): Promise<T> {
      if (options.url === '/cms/sites') return { sites: [{ site_id: '1', space_id: '11', label: '站点 A' }] } as T
      if (options.url.endsWith('/metadata')) return { categories: [], scenes: [], issues: [], cms_source_options: [], source_locale: 'zh-CN', enabled_locales: ['zh-CN'] } as T
      return { lists: rows, count: 50 } as T
    },
    async post<T>(): Promise<T> { throw new Error('Read-only layout fixture') }
  }
}
</script>
<style>
html, body, #app { margin: 0; height: 100%; }
* { box-sizing: border-box; }
:root { --navbar-height: 54px; }
.cms-fixture-shell { height: 100dvh; display: flex; flex-direction: column; }
.cms-fixture-header { height: var(--navbar-height); flex: none; padding: 16px; }
.cms-fixture-scroll { flex: 1; min-height: 0; overflow: auto; }
.cms-fixture-padding { padding: 12px; }
</style>
