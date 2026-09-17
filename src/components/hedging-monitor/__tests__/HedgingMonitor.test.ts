import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import HedgingMonitor from "../HedgingMonitor.vue";

describe("MmHedgingMonitor", () => {
  it("loads rows and keeps the platform agent dimension optional", async () => {
    const request = vi.fn(async () => ({
      count: 1,
      lists: [{
        account_name: "main", action_status: "balanced", actual_hedge_quantity: "-0.5", actual_hedge_usdt: "-50",
        agent_id: 9, agent_name: "Agent 9", calculated_at: "2026-09-15 10:00:00", config_id: 1, exchange: "Binance",
        exchange_account_id: 2, exposure_observed_at: null, health_status: "ok", id: 3, long_quantity: "1", net_notional_usdt: "100",
        net_quantity: "1", position_observed_at: null, short_quantity: "0", source: "6MM", status: "balanced" as const,
        status_label: "对冲正常", status_reason: "", switch_status: "on", symbol: "BTCUSDT", target_hedge_quantity: "-1",
        target_hedge_usdt: "-100", target_symbol: "BTC/USDT:USDT", updated_at: "2026-09-15 10:00:00",
      }],
      options: { statuses: [{ label: "对冲正常", value: "balanced" as const }] },
      summary: { actual_hedge_usdt: "100", calculated_at: "2026-09-15 10:00:00", items: 1, net_exposure_usdt: "100", target_hedge_usdt: "100" },
    }));
    const wrapper = mount(HedgingMonitor, {
      props: {
        agentOptions: [{ label: "全部代理", value: "" }, { label: "Agent 9", value: "9" }],
        request,
        showAgent: true,
        showSwitchFilters: true,
      },
    });
    await flushPromises();

    expect(request).toHaveBeenCalledWith({ global_enabled: "1", page: 1, page_size: 20, symbol_enabled: "1" });
    expect(wrapper.text()).toContain("来源 ID");
    expect(wrapper.text()).toContain("来源昵称");
    expect(wrapper.text()).toContain("来源类型");
    expect(wrapper.find(".mm-tag").text()).toBe("商户");
    expect(wrapper.text()).toContain("9");
    expect(wrapper.text()).toContain("Agent 9");
    expect(wrapper.text()).toContain("BTCUSDT");
    const exchangeLogo = wrapper.get('[data-mm-component="exchange-logo"]');
    expect(exchangeLogo.attributes("data-exchange")).toBe("binance");
    expect(exchangeLogo.attributes("style")).toContain("--mm-exchange-logo-size: 20px");
    expect(exchangeLogo.classes()).not.toContain("mm-exchange-logo--sm");
    expect(wrapper.text()).toContain("对冲进度");
    expect(wrapper.text()).toContain("50.00%");
    expect(wrapper.text()).toContain("对冲正常");

    const selects = wrapper.findAllComponents({ name: "MmSelect" });
    selects[2]?.vm.$emit("update:modelValue", "1");
    selects[3]?.vm.$emit("update:modelValue", "0");
    await wrapper.vm.$nextTick();
    await wrapper.findAll("button").find((button) => button.text().includes("查询"))?.trigger("click");
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith({ global_enabled: "1", page: 1, page_size: 20, symbol_enabled: "0" });

    await wrapper.findAll("button").find((button) => button.text().includes("重置"))?.trigger("click");
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith({ global_enabled: "1", page: 1, page_size: 20, symbol_enabled: "1" });
    wrapper.unmount();
  });
});
