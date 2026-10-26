<template>
    <div class="fixed-room-controls">
        <div class="room-tabs" role="group" aria-label="选择房间或周期">
            <span v-for="room in presentRooms" :key="room.key" class="room-tag" :class="{ active: selected === room.key }">
                <button type="button" :data-room-choice="room.key" :aria-pressed="selected === room.key" @click="emit('select', room.key)">{{ room.label }}</button>
                <button type="button" class="room-remove" :data-room-remove="room.key" :aria-label="`删除${room.label}房间`" :disabled="disabled" @click="openRemove(room)">×</button>
            </span>
            <el-button class="room-add" :data-room-add="true" :disabled="disabled || !addableRooms.length" @click="openAdd">＋ 新增周期</el-button>
        </div>
        <p v-if="!presentRooms.length" class="room-empty">暂无房间，可从固定周期中新增。保存后生效。</p>
        <el-dialog v-if="dialog" :model-value="true" :title="dialog === 'remove' ? '确认删除周期？' : '新增周期'" width="460px" append-to-body class="prediction-room-dialog mm-ui" :close-on-click-modal="false" @update:model-value="close">
            <template v-if="dialog === 'remove'">
                <p class="dialog-context">{{ description }} · {{ candidate?.label }}</p>
                <p class="dialog-description">删除后该房间将从当前配置中移除，点击保存配置后停止生效。</p>
                <p class="dialog-note">该操作不会影响已创建订单，历史订单仍保留原配置快照。后续可从固定周期中重新添加。</p>
            </template>
            <template v-else>
                <label class="dialog-label">预测周期</label>
                <el-select v-model="addKey" placeholder="请选择周期" style="width:100%" :disabled="disabled">
                    <el-option v-for="room in addableRooms" :key="room.key" :value="room.key" :label="room.label" />
                </el-select>
            </template>
            <template #footer>
                <el-button :data-room-cancel="true" @click="close">取消</el-button>
                <el-button v-if="dialog === 'remove'" type="danger" :data-room-confirm="true" :disabled="disabled" @click="confirmRemove">确认删除</el-button>
                <el-button v-else type="primary" :data-room-add-confirm="true" :disabled="disabled || !addKey" @click="confirmAdd">确认新增</el-button>
            </template>
        </el-dialog>
    </div>
</template>
<script setup lang="ts">
import { ElButton, ElDialog, ElSelect, ElOption } from 'element-plus'

import { computed, ref, watch } from 'vue'
type Room = { key: string; label: string; present: boolean; allowed: boolean }
const props = defineProps<{ rooms: Room[]; selected: string; disabled: boolean; context: string; description?: string }>()
const emit = defineEmits<{ select: [key: string]; change: [key: string, present: boolean] }>()
const presentRooms = computed(() => props.rooms.filter(room => room.present))
const addableRooms = computed(() => props.rooms.filter(room => !room.present && room.allowed))
const dialog = ref<'remove' | 'add' | ''>(''), candidate = ref<Room>(), addKey = ref(''), openedContext = ref('')
function close() { dialog.value = ''; candidate.value = undefined; addKey.value = '' }
function openRemove(room: Room) {
    if (props.disabled || !room.present) return
    openedContext.value = props.context; candidate.value = room; dialog.value = 'remove'
}
function openAdd() {
    if (props.disabled || !addableRooms.value.length) return
    openedContext.value = props.context; addKey.value = addableRooms.value[0].key; dialog.value = 'add'
}
function valid() { return !props.disabled && openedContext.value === props.context }
function confirmRemove() {
    const key = candidate.value?.key
    if (dialog.value === 'remove' && valid() && props.rooms.some(room => room.key === key && room.present)) emit('change', key!, false)
    close()
}
function confirmAdd() {
    if (dialog.value === 'add' && valid() && addableRooms.value.some(room => room.key === addKey.value)) emit('change', addKey.value, true)
    close()
}
watch(() => props.context, close, { flush: 'sync' })
</script>
<style scoped>
.fixed-room-controls { min-width:0; }
.room-tabs { display:flex; align-items:center; flex-wrap:wrap; gap:8px; margin:8px 0; }
.room-tag { display:inline-flex; align-items:center; height:32px; border:1px solid var(--el-border-color); border-radius:5px; background:var(--el-bg-color); }
.room-tag.active { color:var(--el-color-primary); border-color:var(--el-color-primary); background:var(--el-color-primary-light-9); }
.room-tag button { border:0; background:transparent; color:inherit; font:inherit; font-size:11px; font-weight:650; cursor:pointer; height:30px; padding:0 5px 0 11px; white-space:nowrap; }
.room-tag .room-remove { margin:0 4px; padding:0; width:22px; height:22px; border-radius:5px; color:var(--el-text-color-secondary); font-size:14px; font-weight:400; }
.room-tag .room-remove:hover { color:var(--el-color-danger); background:var(--el-color-danger-light-9); }
.room-tag .room-remove:disabled { cursor:not-allowed; opacity:.5; }
.room-add { height:32px; padding:0 11px; border-style:dashed; border-radius:6px; font:inherit; font-size:11px; margin:0; color:var(--el-color-primary); }
.room-empty { margin:8px 0; font-size:11px; line-height:1.7; color:var(--el-text-color-secondary); }
.dialog-context { margin:0 0 16px; font-size:11px; color:var(--el-text-color-secondary); line-height:16px; }
.dialog-description { margin:0; font-size:12px; line-height:1.7; color:var(--el-text-color-primary); }
.dialog-note { margin:10px 0 0; font-size:11px; line-height:1.6; color:var(--el-text-color-secondary); }
.dialog-label { display:block; margin-bottom:8px; font-size:12px; }
</style>
<style>
.prediction-room-dialog.el-dialog { max-width:calc(100vw - 32px); padding:0; border-radius:8px; font-family:Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif; }
.prediction-room-dialog .el-dialog__header { padding:13px 16px; margin:0; border-bottom:1px solid var(--el-border-color-lighter); }
.prediction-room-dialog .el-dialog__title { font-size:16px; font-weight:700; line-height:22px; }
.prediction-room-dialog .el-dialog__headerbtn { width:32px; height:32px; top:8px; right:8px; }
.prediction-room-dialog .el-dialog__body { padding:14px 16px; }
.prediction-room-dialog .el-dialog__footer { padding:10px 16px; border-top:1px solid var(--el-border-color-lighter); }
.prediction-room-dialog .el-dialog__footer .el-button { height:32px; min-width:76px; padding:0 12px; border-radius:5px; font-size:12px; }
.prediction-room-dialog .el-button--danger { font-weight:700; }
.prediction-room-dialog .el-select__wrapper { min-height:36px; font-size:12px; }
</style>
