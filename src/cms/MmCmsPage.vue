<template>
  <section class="mm-cms-page" :class="{ 'is-viewport': viewport }">
    <header v-if="runtime.mode === 'white_label' && showSiteSelector" class="mm-cms-site">
      <label>内容站点 <select v-model="siteId" :disabled="loading">
        <option v-for="site in sites" :key="site.site_id" :value="site.site_id">{{ site.label }}</option>
      </select></label>
      <span>各站点内容独立管理</span>
    </header>
    <p v-if="error" role="alert">{{ error }}</p>
    <p v-else-if="loading" role="status">正在加载站点…</p>
    <div v-else-if="runtime.mode === 'white_label' && !selected?.space_id">
      <p>该站点尚未初始化内容空间。</p>
      <button v-if="selected && canInitialize" type="button" :disabled="initializing" @click="initialize">初始化空内容空间</button>
    </div>
    <component :is="pageComponent" v-else :key="`${page}:${identityKey}:${selected?.space_id ?? 'platform'}`" />
  </section>
</template>
<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import { cmsRuntimeKey, type CmsRuntime } from './runtime'
import NewsCategories from './views/content/news/categories/index.vue'
import NewsList from './views/content/news/list/index.vue'
import AcademyCategories from './views/content/academy/categories/index.vue'
import AcademyCourses from './views/content/academy/courses/index.vue'
import HelpCategories from './views/content/help/categories/index.vue'
import HelpArticles from './views/content/help/articles/index.vue'
import Feedback from './views/content/feedback/list/index.vue'
import AnnouncementCategories from './views/content/announcement/categories/index.vue'
import Announcements from './views/content/announcement/list/index.vue'
import Translations from './views/content/localization/translations/index.vue'
const props = withDefaults(defineProps<{ page: CmsPage; runtime: CmsRuntime; identityKey: string; showSiteSelector?: boolean; viewport?: boolean }>(), { showSiteSelector: true, viewport: false })
export type CmsPage = 'news/categories' | 'news/list' | 'academy/categories' | 'academy/courses' | 'help/categories' | 'help/articles' | 'feedback/list' | 'announcement/categories' | 'announcement/list' | 'localization/translations'
const pages = { 'news/categories': NewsCategories, 'news/list': NewsList, 'academy/categories': AcademyCategories, 'academy/courses': AcademyCourses, 'help/categories': HelpCategories, 'help/articles': HelpArticles, 'feedback/list': Feedback, 'announcement/categories': AnnouncementCategories, 'announcement/list': Announcements, 'localization/translations': Translations }
type Site = { site_id: string; space_id: string | null; label: string }
const sites = ref<Site[]>([]), siteId = ref(''), error = ref(''), loading = ref(props.runtime.mode === 'white_label'), initializing = ref(false)
const selected = computed(() => sites.value.find(site => site.site_id === siteId.value))
const pageComponent = computed(() => pages[props.page])
const canInitialize = computed(() => props.runtime.hasPermission(['cms_news:add', 'cms_academy:add', 'cms_help:add', 'cms_announcement:add']))
const controller = new AbortController()
let active = true
function scoped(options: Record<string, any>, space: string | null | undefined) {
  if (!active || (props.runtime.mode === 'white_label' && selected.value?.space_id !== space)) throw new Error('站点已切换，请重新操作')
  if (props.runtime.mode === 'platform') return options
  if (!space) throw new Error('请选择已初始化的站点')
  // Snapshot at invocation: a late response cannot redirect a write to a new selection.
  if (options.data instanceof FormData) { const data = new FormData(); options.data.forEach((v: any, k: string) => data.append(k, v)); data.set('space_id', space); return { ...options, data } }
  return { ...options, params: { ...options.params, space_id: space } }
}
provide(cmsRuntimeKey, {
  get mode() { return props.runtime.mode },
  hasPermission: permissions => props.runtime.hasPermission(permissions),
  formatDateTime: value => props.runtime.formatDateTime(value),
  registerBeforeLeave: guard => props.runtime.registerBeforeLeave?.(guard),
  get request() {
    const space = selected.value?.space_id
    return {
      get: <T,>(options: Record<string, any>, config?: Record<string, any>) => props.runtime.request.get<T>(scoped(options, space), config),
      post: <T,>(options: Record<string, any>, config?: Record<string, any>) => props.runtime.request.post<T>(scoped(options, space), config)
    }
  }
})
async function loadSites() {
  const result = await props.runtime.request.get<{ sites: Site[] }>({ url: '/cms/sites', signal: controller.signal })
  if (!controller.signal.aborted) { sites.value = result.sites; if (!sites.value.some(s => s.site_id === siteId.value)) siteId.value = sites.value[0]?.site_id ?? '' }
}
async function initialize() {
  if (!selected.value || initializing.value) return
  initializing.value = true
  try { await props.runtime.request.post({ url: '/cms/initialize', params: { site_id: selected.value.site_id } }, { isOpenRetry: false }); await loadSites() }
  catch (e) { error.value = e instanceof Error ? e.message : '初始化失败' }
  finally { initializing.value = false }
}
onMounted(async () => { if (props.runtime.mode === 'white_label') { try { await loadSites() } catch { if (!controller.signal.aborted) error.value = '加载站点失败，请刷新重试' } finally { loading.value = false } } })
onBeforeUnmount(() => { active = false; controller.abort() })
</script>
<style scoped>
.mm-cms-page { height: 100%; min-height: 0; display: flex; flex-direction: column; gap: 10px; }
.mm-cms-page > :last-child { flex: 1; min-height: 0; }
/* A routed page may sit inside an auto-height scrollbar view. In viewport mode
   establish our own definite height, then give only the remainder to the page. */
.mm-cms-page.is-viewport {
  height: var(--mm-cms-viewport-height, calc(100vh - var(--navbar-height, 54px) - 24px));
  height: var(--mm-cms-viewport-height, calc(100dvh - var(--navbar-height, 54px) - 24px));
  min-width: 0;
  overflow: hidden;
}
.mm-cms-page.is-viewport > :last-child {
  flex: 1 1 0px;
  height: auto;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}
.mm-cms-site { flex: none; display: flex; align-items: center; gap: 16px; padding: 8px 12px; background: var(--mm-color-panel); border: 1px solid var(--mm-color-line); border-radius: 8px; }
.mm-cms-site select { padding: 5px 10px; border: 1px solid var(--mm-color-line-strong); border-radius: 5px; background: var(--mm-color-panel); color: inherit; }
.mm-cms-site span { color: var(--mm-color-text-secondary); font-size: 12px; }
</style>
