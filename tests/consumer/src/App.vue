<script setup lang="ts">
import { reactive, ref } from 'vue'

import {
  MmCard,
  MmForm,
  MmFormItem,
  MmInput,
  MmSpace,
  MmTable,
  MmTag,
  message,
  type FormExpose,
  type FormRules,
  type TableColumn,
  type TableRow,
} from '@work-gpt/6mm-ui'

type StrategyRow = TableRow & {
  id: number
  market: string
  name: string
  status: 'ready' | 'running'
}

const formRef = ref<FormExpose>()
const saved = ref(false)
const model = reactive({ operator: '' })
const rules: FormRules = {
  operator: { message: '请输入操作员账号', required: true },
}
const columns: TableColumn<StrategyRow>[] = [
  { dataIndex: 'name', key: 'name', title: '策略' },
  { dataIndex: 'market', key: 'market', title: '市场' },
  { dataIndex: 'status', key: 'status', title: '状态' },
]
const rows: StrategyRow[] = [
  { id: 1, market: 'BTC-USDT-PERP', name: '网格策略', status: 'running' },
]

async function save(): Promise<void> {
  saved.value = Boolean(await formRef.value?.validate())
  if (saved.value) message.success('消费项目类型与运行时合同验证通过')
}
</script>

<template>
  <main class="consumer-shell">
    <MmCard title="6MM UI Consumer Contract" subtitle="默认插件、按需导入、样式和类型声明">
      <MmAlert
        :title="saved ? '配置已验证' : '等待验证'"
        :type="saved ? 'success' : 'info'"
        show-icon
      />

      <MmForm ref="formRef" :model="model" :rules="rules" label-position="top">
        <MmFormItem label="操作员账号" prop="operator">
          <MmInput v-model="model.operator" placeholder="operator-07" />
        </MmFormItem>
        <MmSpace>
          <MmButton variant="primary" @click="save">验证消费合同</MmButton>
          <MmTag type="success">ESM + TYPES + CSS</MmTag>
        </MmSpace>
      </MmForm>

      <MmTable :columns="columns" :data="rows" row-key="id">
        <template #cell-status="{ value }"><MmTag type="success">{{ value }}</MmTag></template>
      </MmTable>
    </MmCard>
  </main>
</template>

<style scoped>
:global(*) { box-sizing: border-box; }
:global(body) { min-width: 320px; margin: 0; background: var(--mm-color-bg); }
.consumer-shell { max-width: 920px; min-height: 100vh; margin: 0 auto; padding: 40px 20px; color: var(--mm-color-text); }
.consumer-shell :deep(.mm-form) { margin: 20px 0; }
</style>
