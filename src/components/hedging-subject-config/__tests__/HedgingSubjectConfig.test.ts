import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import HedgingSubjectConfig from "../HedgingSubjectConfig.vue";

describe("MmHedgingSubjectConfig", () => {
  it("keeps platform and tenant subjects with agent zero distinct", async () => {
    const rows = ([['merchant', 0], ['tenant', 300], ['tenant', 301]] as const).map(([owner_type, owner_id]) => ({
      owner_type, owner_id, agent_id: 0, agent_name: `${owner_type}-${owner_id}`,
      accounts: [], exchanges: [], connected_account_count: 0, enabled_symbol_count: 0,
      global_enabled: false, status: 'disabled' as const, status_label: '已停用', updated_at: '',
    }));
    const wrapper = mount(HedgingSubjectConfig, { props: { request: async () => ({ count: 3, lists: rows }) } });
    await flushPromises();
    const rowKey = wrapper.getComponent({ name: 'MmTable' }).props('rowKey') as (row: typeof rows[number]) => string;
    expect(rows.map(rowKey)).toEqual(['merchant:0', 'tenant:300', 'tenant:301']);
    await wrapper.get('[aria-label="查看tenant-301对冲详情"]').trigger('click');
    expect(wrapper.emitted('detail')).toEqual([[rows[2]]]);
    wrapper.unmount();
  });
  it("emits the selected subject when the detail action is clicked", async () => {
    const row = {
      accounts: [],
      agent_id: 16,
      agent_name: "Alpha Embed",
      connected_account_count: 1,
      enabled_symbol_count: 5,
      exchanges: [],
      global_enabled: true,
      status: "running" as const,
      status_label: "运行中",
      updated_at: "2026-09-16 12:00:00",
    };
    const wrapper = mount(HedgingSubjectConfig, {
      props: {
        request: vi.fn(async () => ({ count: 1, lists: [row] })),
      },
    });
    await flushPromises();

    await wrapper.get('[aria-label="查看Alpha Embed对冲详情"]').trigger("click");

    expect(wrapper.emitted("detail")).toEqual([[row]]);
  });
});
