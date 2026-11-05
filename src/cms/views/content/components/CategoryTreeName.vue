<template>
    <div class="category-name" :class="{ child }">
        <button v-if="branch" type="button" :aria-expanded="expanded"
            :aria-label="(expanded ? '收起' : '展开') + name" @click.stop="$emit('toggle')">
            <MmIcon :name="expanded ? 'chevron-down' : 'chevron-right'" :size="14" />
        </button>
        <span v-else class="spacer" aria-hidden="true"></span>
        <span>{{ name }}</span>
    </div>
</template>
<script setup lang="ts">
import { MmIcon } from '../../../../index'
defineProps<{ name: string; child: boolean; branch: boolean; expanded: boolean }>()
defineEmits<{ toggle: [] }>()
</script>
<style scoped>
.category-name { display:flex; align-items:center; gap:4px; }
.category-name.child { padding-inline-start:18px; }
.category-name button, .spacer { flex:0 0 22px; width:22px; }
.category-name button { display:grid; place-items:center; height:24px; border:0; background:transparent; color:inherit; cursor:pointer; }
</style>
