import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import HedgingSubjectConfig from "../HedgingSubjectConfig.vue";

describe("MmHedgingSubjectConfig", () => {
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
