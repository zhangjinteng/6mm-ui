<template>
  <div class="profile-actions">
    <MmButton v-if="canIncrease" data-user-profile-action="balance-increase" size="sm" @click="$emit('increase')"><template #icon><CirclePlus :size="14" data-lucide="circle-plus" aria-hidden="true" /></template><span>余额调增</span></MmButton>
    <MmButton v-if="canDecrease" data-user-profile-action="balance-decrease" size="sm" @click="$emit('decrease')"><template #icon><CircleMinus :size="14" data-lucide="circle-minus" aria-hidden="true" /></template><span>余额扣减</span></MmButton>
    <MmButton :disabled="!canResetPassword" data-user-profile-action="reset-password" size="sm" @click="$emit('reset-password')"><template #icon><KeyRound :size="14" data-lucide="key-round" aria-hidden="true" /></template><span>重置密码</span></MmButton>
  </div>
</template>
<script setup lang="ts">
import { CirclePlus, CircleMinus, KeyRound } from '@lucide/vue'
import { MmButton } from '../button'
defineProps<{ canIncrease: boolean; canDecrease: boolean; canResetPassword: boolean }>()
defineEmits<{ increase: []; decrease: []; 'reset-password': [] }>()
</script>
<style scoped>
.profile-actions { display: flex; flex-wrap: wrap; gap: 8px; }
</style>
