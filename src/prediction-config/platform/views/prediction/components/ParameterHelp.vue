<template>
    <el-popover v-if="description" v-model:visible="visible" trigger="click" placement="top" :width="300" :title="label">
        <p class="prediction-help-copy">{{ description }}</p>
        <template #reference>
            <button type="button" class="prediction-help-button" :aria-label="`${label}说明`" :aria-expanded="visible" @click.stop @keydown.esc.prevent="visible = false">
                <el-icon><QuestionFilled /></el-icon>
            </button>
        </template>
    </el-popover>
</template>
<script setup lang="ts">
import { ElPopover, ElIcon } from 'element-plus'

import { computed, ref } from 'vue'
import { QuestionFilled } from '@element-plus/icons-vue'
const props = defineProps<{ label: string; content?: string }>()
const visible = ref(false)
const descriptions: Record<string, string> = {
    '下注开放时长': '场次开放后保持可下注的时间；倒计时结束立即封盘，不再接受新订单。本版固定为 30 秒。',
    '目标返奖率': '例如 90% 表示平台按 90% 的理论返奖水平计算赔率。',
    '最低赔率': '当前最低赔率用于接单校验，低于下限时无法受理；最终倍率以封盘为准。',
    '最高赔率': '动态赔率不会高于此值。',
    '固定赔率': '上涨和下跌使用相同赔率。用户下单时锁定当前周期的赔率，后续配置变更不影响历史订单。',
    '单笔最小额': '用户创建一笔预测订单时允许输入的最低下注金额。',
    '单笔最大额': '用户创建一笔预测订单时允许输入的最高下注金额。',
    '最小下注金额': '用户创建一笔预测订单时允许输入的最低下注金额。',
    '最大下注金额': '用户创建一笔预测订单时允许输入的最高下注金额。',
    '周期': '用户选择的预测时长。不同周期独立配置；变更只影响新订单，历史订单保留原周期快照。',
    '房间启用': '保存后控制当前房间是否接受本站新订单，已受理订单仍按原规则结算。',
}
const description = computed(() => props.content ?? descriptions[props.label] ?? '')
</script>
<style scoped>
.prediction-help-button { display:inline-flex; align-items:center; justify-content:center; vertical-align:middle; width:20px; height:20px; padding:0; margin-left:5px; border:0; border-radius:50%; background:transparent; color:var(--el-text-color-secondary); cursor:pointer; font-size:15px; }
.prediction-help-button:hover,.prediction-help-button:focus-visible { color:var(--el-color-primary); }
.prediction-help-button:focus-visible { outline:2px solid var(--el-color-primary); outline-offset:2px; }
.prediction-help-copy { margin:0; line-height:1.7; white-space:pre-line; color:var(--el-text-color-regular); }
</style>
