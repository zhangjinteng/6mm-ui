<template>
    <div class="academy-categories">
        <CategoryTable />
    </div>
</template>
<script setup lang="ts">
import CategoryTable from './CategoryTable.vue'
</script>
<style scoped>
.academy-categories {
    height: calc(100vh - var(--navbar-height) - 24px);
    min-height: 0;
    display: flex;
    flex-direction: column;
}
</style>
