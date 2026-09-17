import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import HedgingExecutionTable from "../HedgingExecutionTable.vue";

describe("MmHedgingExecutionTable", () => {
  it("keeps agent filtering optional and forwards it only for platform mode", async () => {
    const request = vi.fn(async () => ({
      count: 1,
      lists: [{
        account_name: "main",
        agent_id: 9,
        agent_name: "Agent 9",
        exchange: "Binance",
        exchange_account_id: 3,
        error_message: "",
        executed_at: "2026-09-15 10:00:00",
        filled_notional_usdt: "100",
        id: 12,
        notional_usdt: "2456.17",
        quantity: "3.437",
        reason: "first_trigger" as const,
        reason_label: "first_trigger",
        side: "SELL" as const,
        side_label: "SELL",
        status: "filled" as const,
        status_label: "filled",
        symbol: "BNBUSDT",
        target_symbol: "BNB/USDT:USDT",
        task_no: "t-platform-9",
      }],
      options: {
        accounts: [{ agent_id: 9, label: "Binance · main", value: 3 }],
        directions: [{ label: "BUY", value: "BUY" as const }],
        reasons: [{ label: "first_trigger", value: "first_trigger" as const }],
        statuses: [{ label: "filled", value: "filled" as const }],
        symbols: [{ label: "BNBUSDT", value: "BNBUSDT" }],
      },
    }));
    const wrapper = mount(HedgingExecutionTable, {
      props: {
        agentOptions: [
          { label: "全部代理", value: "" },
          { label: "Agent 9", value: "9" },
        ],
        request,
        showAgent: true,
      },
    });
    await flushPromises();

    expect(request).toHaveBeenCalledWith({ page: 1, page_size: 20 });
    expect(wrapper.text()).toContain("来源 ID");
    expect(wrapper.text()).toContain("来源昵称");
    expect(wrapper.text()).toContain("来源类型");
    expect(wrapper.text()).toContain("Agent 9");
    expect(wrapper.text()).toContain("商户");
    expect(wrapper.text()).toContain("t-platform-9");
    expect(wrapper.text()).toContain("-3.437 BNB");
    expect(wrapper.text()).toContain("-2,456.17 U");
    expect(wrapper.find(".mm-hedging-execution-table__amount-pair").classes()).toContain("is-negative");

    const selects = wrapper.findAllComponents({ name: "MmSelect" });
    selects[0]?.vm.$emit("update:modelValue", "9");
    await wrapper.vm.$nextTick();
    await wrapper.findAll("button").find((button) => button.text().includes("查询"))?.trigger("click");
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith({ agent_id: "9", page: 1, page_size: 20 });

    selects[4]?.vm.$emit("update:modelValue", "filled");
    await wrapper.vm.$nextTick();
    await wrapper.findAll("button").find((button) => button.text().includes("查询"))?.trigger("click");
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith({ agent_id: "9", page: 1, page_size: 20, status: "filled" });
    wrapper.unmount();
  });

  it("does not expose an agent filter in agent mode", async () => {
    const request = vi.fn(async () => ({
      count: 0,
      lists: [],
      options: { accounts: [], directions: [], reasons: [], statuses: [], symbols: [] },
    }));
    const wrapper = mount(HedgingExecutionTable, { props: { request } });
    await flushPromises();

    expect(request).toHaveBeenCalledWith({ page: 1, page_size: 20 });
    expect(wrapper.find('[aria-label="代理商"]').exists()).toBe(false);
    wrapper.unmount();
  });
});
