<script setup lang="ts">
import { ref } from "vue";

import {
  MmHandlingFeeConfig,
  type HandlingFeeConfigActions,
  type HandlingFeeConfigFormValue,
  type HandlingFeeConfigListRequest,
  type HandlingFeeConfigRow,
} from "../src";

const rows = ref<HandlingFeeConfigRow[]>([
  {
    agent_id: 0,
    id: 1,
    level: 0,
    level_name: "普通会员",
    maker_fee_rate: "0.02",
    taker_fee_rate: "0.05",
    volume_30d: "5000000",
  },
  {
    agent_id: 0,
    id: 2,
    level: 1,
    level_name: "VIP1",
    maker_fee_rate: "0.018",
    taker_fee_rate: "0.05",
    volume_30d: "10000000",
  },
  {
    agent_id: 0,
    id: 3,
    level: 2,
    level_name: "VIP2",
    maker_fee_rate: "0.016",
    taker_fee_rate: "0.04",
    volume_30d: "50000000",
  },
  {
    agent_id: 14,
    id: 14_001,
    level: 0,
    level_name: "普通会员",
    maker_fee_rate: "0.025",
    taker_fee_rate: "0.055",
    volume_30d: "7000000",
  },
  {
    agent_id: 14,
    id: 14_002,
    level: 1,
    level_name: "VIP1",
    maker_fee_rate: "0.02",
    taker_fee_rate: "0.05",
    volume_30d: "15000000",
  },
]);

const request: HandlingFeeConfigListRequest = async ({
  agent_id,
  page_no,
  page_size,
}) => {
  const matching = rows.value
    .filter((row) => Number(row.agent_id) === agent_id)
    .sort((a, b) => Number(a.volume_30d) - Number(b.volume_30d));
  const start = (page_no - 1) * page_size;
  return {
    rows: matching.slice(start, start + page_size),
    total: matching.length,
  };
};

const actions: HandlingFeeConfigActions = {
  create: (value) => {
    const platformRows = rows.value.filter((row) => Number(row.agent_id) === 0);
    const level =
      Math.max(...platformRows.map((row) => Number(row.level)), 0) + 1;
    rows.value.push({
      ...value,
      id: Math.max(...rows.value.map((row) => Number(row.id)), 0) + 1,
      level,
      level_name: `VIP${level}`,
    });
  },
  loadCreateDefaults: () => {
    const platformRows = rows.value.filter((row) => Number(row.agent_id) === 0);
    const highest = platformRows.sort(
      (a, b) => Number(b.level) - Number(a.level),
    )[0];
    return {
      level_name: `VIP${Number(highest?.level || 0) + 1}`,
      volume_30d_min: String(highest?.volume_30d || 0),
    };
  },
  loadEditData: (row) => ({
    agent_id: Number(row.agent_id),
    id: row.id,
    level_name: row.level_name,
    maker_fee_rate: String(row.maker_fee_rate),
    taker_fee_rate: String(row.taker_fee_rate),
    volume_30d: String(row.volume_30d),
    volume_30d_min: String(row.volume_30d_min || 0),
  }),
  remove: (row) => {
    rows.value = rows.value.filter(
      (item) => String(item.id) !== String(row.id),
    );
  },
  update: (row, value: HandlingFeeConfigFormValue) => {
    const index = rows.value.findIndex(
      (item) => String(item.id) === String(row.id),
    );
    if (index >= 0) rows.value[index] = { ...rows.value[index]!, ...value };
  },
};
</script>

<template>
  <main class="handling-fee-preview">
    <MmHandlingFeeConfig
      :actions="actions"
      :owner-options="[
        { label: '平台默认', value: '0' },
        { label: '易游', value: '14' },
      ]"
      :request="request"
    />
  </main>
</template>

<style scoped>
.handling-fee-preview {
  box-sizing: border-box;
  height: 100vh;
  padding: 12px;
  background: var(--mm-color-page);
}
</style>
