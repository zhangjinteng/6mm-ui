<script setup lang="ts">
import { computed, nextTick, onMounted, onScopeDispose, ref, watch } from 'vue'

import { MmContainer, MmIcon, MmTypography } from '../src'

import CatalogComponentPreview from './CatalogComponentPreview.vue'
import { componentCategories, componentTechnicalDetails } from './component-catalog'

const theme = ref<'dark' | 'light'>('light')
const activeAnchor = ref(componentTechnicalDetails[0]?.anchor ?? '')
const technicalAnchor = ref(componentTechnicalDetails[0]?.anchor ?? '')
let masonryFrame = 0
let masonryObserver: ResizeObserver | undefined
let sectionObserver: IntersectionObserver | undefined

const activeTechnicalDetails = computed(() => componentTechnicalDetails.find((item) => item.anchor === technicalAnchor.value) ?? componentTechnicalDetails[0])

const catalogGroups = computed(() => componentCategories.map((category) => ({
  category,
  items: componentTechnicalDetails.filter((item) => item.category === category),
})).filter((group) => group.items.length > 0))

watch(theme, (value) => {
  document.documentElement.dataset.mmTheme = value
}, { immediate: true })

function syncHash(): void {
  const anchor = window.location.hash.slice(1)
  if (!componentTechnicalDetails.some((item) => item.anchor === anchor)) return
  activeAnchor.value = anchor
  technicalAnchor.value = anchor
}

function jumpToComponent(anchor: string): void {
  activeAnchor.value = anchor
  technicalAnchor.value = anchor
  window.history.pushState(null, '', `#${anchor}`)
  window.requestAnimationFrame(() => {
    const target = document.getElementById(anchor)
    if (!target) return
    const top = target.getBoundingClientRect().top + window.scrollY - 18
    window.scrollTo({ top, behavior: 'auto' })
  })
}

function showTechnicalDetails(anchor: string): void {
  activeAnchor.value = anchor
  technicalAnchor.value = anchor
  window.history.replaceState(null, '', `#${anchor}`)
  if (window.innerWidth > 1120) return
  void nextTick(() => {
    document.querySelector('.component-info-drawer')?.scrollIntoView({ block: 'nearest' })
  })
}

function layoutMasonry(): void {
  if (masonryFrame) window.cancelAnimationFrame(masonryFrame)
  masonryFrame = window.requestAnimationFrame(() => {
    masonryFrame = 0
    const content = document.querySelector<HTMLElement>('.component-info-content')
    if (!content) return
    const styles = window.getComputedStyle(content)
    const rowHeight = Number.parseFloat(styles.gridAutoRows) || 8
    const rowGap = Number.parseFloat(styles.rowGap) || 16
    const sections = Array.from(content.querySelectorAll<HTMLElement>('.component-info-section'))
    for (const section of sections) {
      section.style.gridRowEnd = 'auto'
      const height = section.getBoundingClientRect().height
      section.style.gridRowEnd = `span ${Math.ceil((height + rowGap) / (rowHeight + rowGap))}`
    }
  })
}

onMounted(() => {
  window.addEventListener('hashchange', syncHash)
  window.addEventListener('resize', layoutMasonry)
  syncHash()

  void nextTick(() => {
    if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView({ block: 'start' })
    layoutMasonry()
    masonryObserver = new ResizeObserver(layoutMasonry)
    document.querySelectorAll<HTMLElement>('.component-info-section').forEach((section) => masonryObserver?.observe(section))
    sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => left.boundingClientRect.top - right.boundingClientRect.top)[0]
      if (visible?.target.id) activeAnchor.value = visible.target.id
    }, { rootMargin: '-12% 0px -72% 0px', threshold: 0 })
    document.querySelectorAll<HTMLElement>('[data-component-section]').forEach((section) => sectionObserver?.observe(section))
  })
})

onScopeDispose(() => {
  window.removeEventListener('hashchange', syncHash)
  window.removeEventListener('resize', layoutMasonry)
  if (masonryFrame) window.cancelAnimationFrame(masonryFrame)
  masonryObserver?.disconnect()
  sectionObserver?.disconnect()
})
</script>

<template>
  <main class="component-info-page mm-ui" :data-mm-theme="theme">
    <MmContainer class="component-info-shell" :gutter="24" :padded="false" size="xl">
      <div class="component-info-layout">
        <aside class="component-info-sidebar">
          <header>
            <span>COMPONENT MENU</span>
            <b>{{ componentTechnicalDetails.length.toString().padStart(2, '0') }}</b>
          </header>
          <nav aria-label="组件菜单">
            <section v-for="group in catalogGroups" :key="group.category">
              <h2>{{ group.category }}</h2>
              <a
                v-for="item in group.items"
                :key="item.name"
                :href="`#${item.anchor}`"
                :aria-label="item.name"
                :aria-current="activeAnchor === item.anchor ? 'location' : undefined"
                :class="{ 'is-active': activeAnchor === item.anchor }"
                @click.prevent="jumpToComponent(item.anchor)"
              >
                <span>{{ item.name }}</span>
                <em aria-hidden="true">{{ item.group }}</em>
              </a>
            </section>
          </nav>
        </aside>

        <div class="component-info-content">
          <section
            v-for="(item, index) in componentTechnicalDetails"
            :id="item.anchor"
            :key="item.name"
            class="component-info-section"
            :data-component-section="item.name"
            :aria-labelledby="`${item.anchor}-title`"
          >
            <header class="component-info-section__header">
              <div class="component-info-section__index">{{ String(index + 1).padStart(2, '0') }}</div>
              <div>
                <span>{{ item.category }} / {{ item.group }}</span>
                <h2 :id="`${item.anchor}-title`">{{ item.componentName }}</h2>
                <p>{{ item.description }}</p>
              </div>
              <div class="component-info-section__actions">
                <code
                  :class="{ 'is-active': technicalAnchor === item.anchor }"
                  role="button"
                  tabindex="0"
                  @click="showTechnicalDetails(item.anchor)"
                  @keydown.enter.prevent="showTechnicalDetails(item.anchor)"
                  @keydown.space.prevent="showTechnicalDetails(item.anchor)"
                >查看代码</code>
                <code>{{ item.name }}</code>
              </div>
            </header>

            <div class="component-info-section__workspace">
              <CatalogComponentPreview :name="item.name" />
            </div>
          </section>
        </div>

        <aside v-if="activeTechnicalDetails" class="component-info-drawer" aria-label="技术抽屉">
          <div class="component-info-drawer__panel">
            <header class="component-info-drawer__header">
              <span>技术抽屉</span>
              <strong>{{ activeTechnicalDetails.componentName }}</strong>
            </header>

            <div class="component-info-drawer__code">
              <MmTypography
                class="component-info-example"
                :copy-text="activeTechnicalDetails.example"
                copyable
                data-usage-example
                density="compact"
                :level="3"
                title="Usage"
              >
                <pre><code>{{ activeTechnicalDetails.example }}</code></pre>
              </MmTypography>
            </div>
          </div>
        </aside>
      </div>
    </MmContainer>
  </main>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }
:global(html),
:global(body),
:global(#app) { min-width: 320px; min-height: 100%; margin: 0; }
:global(html) { scroll-behavior: smooth; }
:global(body) { background: #0c1215; font-family: var(--mm-font-family); }

.component-info-page { min-height: 100vh; padding: 28px 0 64px; color: var(--mm-color-text); background-color: var(--mm-color-bg); background-image: linear-gradient(var(--mm-color-line) 1px, transparent 1px), linear-gradient(90deg, var(--mm-color-line) 1px, transparent 1px); background-size: 32px 32px; transition: color var(--mm-duration-normal), background-color var(--mm-duration-normal); }
.component-info-shell { width: min(100%, 1814px); max-width: none; position: relative; margin-inline: auto; }

.component-info-layout { display: grid; grid-template-columns: 238px minmax(0, 1180px) minmax(280px, 360px); align-items: start; gap: 18px; }
.component-info-sidebar { max-height: calc(100vh - 36px); position: sticky; top: 18px; display: grid; grid-template-rows: auto minmax(0, 1fr); overflow: hidden; border: 1px solid var(--mm-color-line); background: color-mix(in srgb, var(--mm-color-panel) 96%, transparent); box-shadow: var(--mm-shadow-sm); }
.component-info-sidebar > header { min-height: 46px; display: flex; align-items: center; justify-content: space-between; gap: 12px; border-bottom: 1px solid var(--mm-color-line); padding: 0 12px; }
.component-info-sidebar > header span { color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .09em; }
.component-info-sidebar > header b { color: var(--mm-color-primary); font: 800 12px/1 var(--mm-font-family-mono); }
.component-info-sidebar > nav { overflow: auto; padding: 10px; }
.component-info-sidebar section + section { margin-top: 14px; }
.component-info-sidebar h2 { margin: 0 8px 6px; color: var(--mm-color-text-subtle); font: 700 9px/1 var(--mm-font-family-mono); letter-spacing: .08em; }
.component-info-sidebar a { min-height: 30px; display: flex; align-items: center; justify-content: space-between; gap: 8px; border-left: 2px solid transparent; padding: 6px 8px; color: var(--mm-color-text-muted); text-decoration: none; transition: color var(--mm-duration-fast), border-color var(--mm-duration-fast), background var(--mm-duration-fast); }
.component-info-sidebar a span { overflow: hidden; font-size: var(--mm-font-size-xs); font-weight: 650; text-overflow: ellipsis; white-space: nowrap; }
.component-info-sidebar a em { color: var(--mm-color-text-subtle); font: 700 8px/1 var(--mm-font-family-mono); font-style: normal; }
.component-info-sidebar a:hover, .component-info-sidebar a.is-active { border-left-color: var(--mm-color-primary); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); }
.component-info-sidebar a:focus-visible { outline: 0; box-shadow: inset var(--mm-focus-ring); }

.component-info-content { width: 1180px; max-width: 100%; min-width: 0; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); grid-auto-rows: 8px; align-items: start; gap: 16px; }
.component-info-section { min-width: 0; align-self: start; overflow: hidden; scroll-margin-top: 18px; border: 1px solid var(--mm-color-line); background: color-mix(in srgb, var(--mm-color-panel) 98%, transparent); box-shadow: var(--mm-shadow-sm); }
.component-info-section:target { border-color: color-mix(in srgb, var(--mm-color-primary) 46%, var(--mm-color-line)); box-shadow: 0 0 0 1px var(--mm-color-primary-soft), var(--mm-shadow-md); }
.component-info-section__header { display: grid; grid-template-columns: auto minmax(0, 1fr) auto; align-items: start; gap: 10px 10px; border-bottom: 1px solid var(--mm-color-line); padding: 14px; background: linear-gradient(90deg, color-mix(in srgb, var(--mm-color-primary-soft) 45%, var(--mm-color-soft)), var(--mm-color-soft) 60%); }
.component-info-section__index { width: 38px; height: 38px; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--mm-color-primary) 42%, var(--mm-color-line)); color: var(--mm-color-primary); background: var(--mm-color-panel); font: 800 10px/1 var(--mm-font-family-mono); }
.component-info-section__header > div:nth-child(2) { min-width: 0; display: grid; gap: 4px; }
.component-info-section__header span { color: var(--mm-color-primary); font: 700 8px/1 var(--mm-font-family-mono); letter-spacing: .09em; }
.component-info-section__header h2 { margin: 0; font-size: 20px; line-height: 1.1; letter-spacing: -.03em; }
.component-info-section__header p { margin: 0; color: var(--mm-color-text-muted); font-size: var(--mm-font-size-xs); line-height: 1.55; }
.component-info-section__actions { display: grid; justify-items: end; gap: 8px; align-self: center; }
.component-info-section__actions > code { border: 1px solid var(--mm-color-line); padding: 5px 7px; color: var(--mm-color-text-subtle); background: var(--mm-color-panel); font: 700 9px/1 var(--mm-font-family-mono); white-space: nowrap; }
.component-info-section__actions > code[role='button'] { cursor: pointer; transition: border-color var(--mm-duration-fast), color var(--mm-duration-fast), background var(--mm-duration-fast), box-shadow var(--mm-duration-fast); }
.component-info-section__actions > code[role='button']:hover, .component-info-section__actions > code[role='button'].is-active { border-color: color-mix(in srgb, var(--mm-color-primary) 36%, var(--mm-color-line)); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); }
.component-info-section__actions > code[role='button']:focus-visible { outline: 0; box-shadow: var(--mm-focus-ring); }
.component-info-section__workspace { display: grid; grid-template-columns: minmax(0, 1fr); align-items: start; gap: 14px; padding: 12px; }
.component-info-section[data-component-section='App Header'] .component-info-section__workspace { grid-template-columns: 1fr; }
.component-info-drawer { max-height: calc(100vh - 36px); position: sticky; top: 18px; min-width: 0; }
.component-info-drawer__panel { display: grid; grid-template-rows: auto minmax(0, 1fr); overflow: hidden; border: 1px solid color-mix(in srgb, var(--mm-color-primary) 14%, var(--mm-color-line)); border-radius: 12px; background: color-mix(in srgb, var(--mm-color-panel) 96%, var(--mm-color-primary-soft)); box-shadow: 0 16px 42px rgb(15 23 42 / 10%); }
.component-info-drawer__header { min-width: 0; display: grid; gap: 6px; border-bottom: 1px solid var(--mm-color-line); padding: 17px 16px 18px; background: color-mix(in srgb, var(--mm-color-panel) 94%, var(--mm-color-primary-soft)); }
.component-info-drawer__header span { color: var(--mm-color-text); font-size: var(--mm-font-size-sm); font-weight: 800; line-height: 1; }
.component-info-drawer__header strong { min-width: 0; overflow-wrap: anywhere; color: var(--mm-color-text-muted); font-size: 22px; font-weight: 450; line-height: 1.15; }
.component-info-drawer__code { min-height: 0; display: grid; padding: 18px 16px 16px; background: color-mix(in srgb, var(--mm-color-panel) 92%, transparent); }
.component-info-example { min-width: 0; gap: 9px; }
.component-info-drawer .component-info-example { min-height: 0; display: grid; grid-template-rows: auto minmax(0, 1fr); gap: 12px; border: 0; border-radius: 0; background: transparent; box-shadow: none; }
.component-info-drawer .component-info-example :deep(.mm-typography__header) { min-height: 28px; align-items: center; padding: 0; }
.component-info-drawer .component-info-example :deep(.mm-typography__body) { min-height: 0; overflow: hidden; }
.component-info-example :deep(.mm-typography__title) { color: var(--mm-color-text); font-size: var(--mm-font-size-sm); line-height: 1; }
.component-info-example :deep(.mm-typography__actions button) { min-height: 26px; border: 1px solid var(--mm-color-line); padding: 0 9px; color: var(--mm-color-text-muted); background: var(--mm-color-panel); font-size: var(--mm-font-size-xs); }
.component-info-example :deep(.mm-typography__actions button:hover) { border-color: color-mix(in srgb, var(--mm-color-primary) 36%, var(--mm-color-line)); color: var(--mm-color-primary); background: var(--mm-color-primary-soft); }
.component-info-example pre { max-height: calc(100vh - 196px); min-height: 0; overflow: auto; border: 1px solid #223238; border-radius: 10px; margin: 0; padding: 16px 17px; color: #d8f7ee; background: #071615; font: 11px/1.75 var(--mm-font-family-mono); overflow-wrap: anywhere; tab-size: 2; white-space: pre-wrap; word-break: break-word; }
.component-info-example code { font: inherit; }

@media (max-width: 1814px) {
  .component-info-layout { grid-template-columns: 220px minmax(0, 1fr) minmax(260px, 320px); gap: 14px; }
  .component-info-content { width: auto; }
}

@media (max-width: 1120px) {
  .component-info-layout { grid-template-columns: 220px minmax(0, 1fr); }
  .component-info-content { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .component-info-drawer { grid-column: 2; max-height: none; position: static; }
  .component-info-example pre { max-height: 360px; }
}

@media (max-width: 820px) {
  :global(html) { scroll-behavior: auto; }
  .component-info-page { padding-top: 14px; }
  .component-info-layout { grid-template-columns: 1fr; }
  .component-info-content { grid-template-columns: 1fr; }
  .component-info-sidebar { max-height: none; position: static; }
  .component-info-drawer { grid-column: auto; }
  .component-info-sidebar > nav { display: flex; overflow-x: auto; gap: 12px; padding: 10px; }
  .component-info-sidebar section { flex: 0 0 174px; }
  .component-info-sidebar section + section { margin-top: 0; }
  .component-info-section { scroll-margin-top: 12px; }
}

@media (max-width: 560px) {
  .component-info-section__header { grid-template-columns: auto minmax(0, 1fr); padding: 14px; }
  .component-info-section__actions { grid-column: 2; justify-items: start; }
  .component-info-section__workspace { padding: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  :global(html) { scroll-behavior: auto; }
}
</style>
