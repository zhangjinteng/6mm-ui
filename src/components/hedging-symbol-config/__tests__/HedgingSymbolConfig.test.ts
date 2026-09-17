import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import HedgingSymbolConfig from "../HedgingSymbolConfig.vue";

describe("MmHedgingSymbolConfig", () => {
  it("renders configured rows and forwards the optional agent filter", async () => {
    const request = vi.fn(async () => ({
      count: 1,
      lists: [{
        account_id: 12, account_name: "main", agent_id: 7, agent_name: "Agent 7",
        config_id: 11, configured: true as const, enabled: true, exchange: "Binance",
        exit_quantity: 1, exit_usdt: 1500, first_trigger_quantity: 2, first_trigger_usdt: 5000,
        hedge_unit: "base" as const, lifecycle_status: "active" as const,
        max_slippage_percent: 0.3, rebalance_quantity: 1, rebalance_usdt: 2000,
        symbol: "BTCUSDT", target_hedge_ratio: 100,
      }],
      options: { accounts: [{ exchange: "Binance", id: 12, is_primary: true, name: "main", sandbox: false }], exchanges: ["Binance"] },
    }));
    const wrapper = mount(HedgingSymbolConfig, {
      props: {
        agentOptions: [{ label: "全部代理商", value: "" }, { label: "Agent 7", value: "7" }],
        request,
        showAgent: true,
      },
      slots: {
        "table-header": '<header data-testid="table-header">主体详情</header>',
      },
    });
    await flushPromises();

    expect(request).toHaveBeenCalledWith({ page: 1, page_size: 20 });
    expect(wrapper.get('[data-testid="table-header"]').text()).toBe("主体详情");
    expect(wrapper.text()).toContain("Agent 7");
    expect(wrapper.text()).toContain("BTCUSDT");
    expect(wrapper.text()).toContain("按币");
    expect(wrapper.text()).not.toContain("未配置");

    wrapper.findAllComponents({ name: "MmSelect" })[0]?.vm.$emit("update:modelValue", "7");
    await wrapper.vm.$nextTick();
    await wrapper.findAll("button").find((button) => button.text().includes("查询"))?.trigger("click");
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith({ agent_id: "7", page: 1, page_size: 20 });
  });

  it("uses the initial agent id for the first request", async () => {
    const request = vi.fn(async () => ({ count: 0, lists: [], options: { accounts: [], exchanges: [] } }));
    mount(HedgingSymbolConfig, {
      props: {
        initialAgentId: 16,
        request,
        showAgent: true,
      },
    });
    await flushPromises();

    expect(request).toHaveBeenCalledWith({ agent_id: "16", page: 1, page_size: 20 });
  });
});
