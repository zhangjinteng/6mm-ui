import { flushPromises, mount } from "@vue/test-utils";
import { h, ref, type Component } from "vue";
import { describe, expect, it, vi } from "vitest";
import HedgingMonitor from "../HedgingMonitor.vue";
import HedgingSubjectConfig from "../../hedging-subject-config/HedgingSubjectConfig.vue";
import HedgingExecutionTable from "../../hedging-execution-table/HedgingExecutionTable.vue";
import MmPagination from "../../pagination/Pagination.vue";
import MmSelect from "../../select/Select.vue";

const row = {
  id: 1, agent_id: 55, agent_name: "Real subject", source_id: "300", source_name: "White label", source_type: "white_label",
  accounts: [], exchanges: [], connected_account_count: 1, enabled_symbol_count: 1, global_enabled: true,
  account_name: "main", action_status: "balanced", actual_hedge_quantity: "-1", actual_hedge_usdt: "-100",
  calculated_at: "2026-10-15 00:00:00", config_id: 1, exchange: "Binance", exchange_account_id: 8,
  exposure_observed_at: null, health_status: "ok", long_quantity: "1", net_notional_usdt: "100", net_quantity: "1",
  position_observed_at: null, short_quantity: "0", source: "platform", status: "filled", status_label: "Ready",
  status_reason: "", switch_status: "on", symbol: "BTCUSDT", target_hedge_quantity: "-1", target_hedge_usdt: "-100",
  target_symbol: "BTC/USDT:USDT", updated_at: "2026-10-15 00:00:00", task_no: "task-1",
  error_message: "", failure_reason: "", quantity: "1", notional_usdt: "100", filled_notional_usdt: "100",
  reason: "first_trigger", reason_label: "first_trigger", side: "SELL", side_label: "SELL", executed_at: null,
};

describe.each([
  ["monitor", HedgingMonitor], ["subjects", HedgingSubjectConfig], ["executions", HedgingExecutionTable],
] as const)("hedging %s source slots", (_name, component) => {
  it("renders host source metadata and resets source before loading page one", async () => {
    const selected = ref("white_label");
    const request = vi.fn(async (query: { page: number }) => ({
      count: 60, lists: [row], options: { statuses: [], symbols: [], accounts: [], directions: [], reasons: [] },
      summary: { actual_hedge_usdt: "100", calculated_at: null, items: 1, net_exposure_usdt: "100", target_hedge_usdt: "100" },
      requestedSource: selected.value, page: query.page,
    }));
    const wrapper = mount(component as Component, {
      props: { request, showAgent: true, onReset: () => { selected.value = ""; } },
      slots: {
        "source-filter": ({ search, loading }: { search: () => void; loading: boolean }) => h("button", {
          "data-source-query": "", type: "button", disabled: loading, onClick: search,
        }, "Select source"),
        "cell-source_id": ({ row }: { row: { source_id: string } }) => h("span", { "data-source-id": "" }, row.source_id),
        "cell-source_name": ({ row }: { row: { source_name: string } }) => h("span", { "data-source-name": "" }, row.source_name),
        "cell-source_type": ({ row }: { row: { source_type: string } }) => h("span", { "data-source-type": "" }, row.source_type),
      },
    });
    await flushPromises();
    expect(wrapper.get("[data-source-id]").text()).toBe("300");
    expect(wrapper.get("[data-source-name]").text()).toBe("White label");
    expect(wrapper.get("[data-source-type]").text()).toBe("white_label");
    expect(wrapper.get('[data-query-field="agentId"]').find('[data-mm-component="select"]').exists()).toBe(false);
    const pagination = wrapper.getComponent(MmPagination);
    pagination.vm.$emit("update:currentPage", 2);
    pagination.vm.$emit("current-change", 2);
    await flushPromises();
    expect(request.mock.calls.at(-1)?.[0].page).toBe(2);
    await wrapper.get("[data-source-query]").trigger("click");
    await flushPromises();
    expect(request.mock.calls.at(-1)?.[0].page).toBe(1);
    expect((await request.mock.results.at(-1)?.value).requestedSource).toBe("white_label");
    await wrapper.findAll("button").find(button => button.text() === "重置")?.trigger("click");
    await flushPromises();
    expect((await request.mock.results.at(-1)?.value).requestedSource).toBe("");
    expect(wrapper.emitted("reset")).toHaveLength(1);
    wrapper.unmount();
  });
});

it("changing execution source clears a previous account but retains the other filters", async () => {
  const request = vi.fn(async () => ({ count: 0, lists: [], options: { statuses: [], symbols: [], accounts: [], directions: [], reasons: [] } }));
  const wrapper = mount(HedgingExecutionTable, {
    props: { request, showAgent: true },
    slots: { "source-filter": ({ search }: { search: () => void }) => h("button", { "data-source-query": "", type: "button", onClick: search }) },
  });
  await flushPromises();
  wrapper.get('[data-query-field="symbol"]').getComponent(MmSelect).vm.$emit("update:modelValue", "BTCUSDT");
  wrapper.get('[data-query-field="accountId"]').getComponent(MmSelect).vm.$emit("update:modelValue", "8");
  await wrapper.vm.$nextTick();
  await wrapper.findAll("button").find(button => button.text() === "查询")?.trigger("click");
  await flushPromises();
  expect(request).toHaveBeenLastCalledWith({ account_id: "8", symbol: "BTCUSDT", page: 1, page_size: 20 });
  await wrapper.get("[data-source-query]").trigger("click");
  await flushPromises();
  expect(request).toHaveBeenLastCalledWith({ symbol: "BTCUSDT", page: 1, page_size: 20 });
  wrapper.unmount();
});

describe.each([
  ["executions", HedgingExecutionTable,
    { keyword: "task-12", symbol: "BTCUSDT", side: "SELL", reason: "first_trigger", status: "filled", accountId: "8" },
    { keyword: "task-12", symbol: "BTCUSDT", side: "SELL", reason: "first_trigger", status: "filled", account_id: "8" }],
  ["monitor", HedgingMonitor,
    { keyword: "BTC", status: "balanced", globalEnabled: "0", symbolEnabled: "0" },
    { keyword: "BTC", status: "balanced", global_enabled: "0", symbol_enabled: "0" }],
  ["subjects", HedgingSubjectConfig,
    { enabled: "0", status: "running" },
    { enabled: "0", status: "running" }],
] as const)("hedging %s native filters", (_name, component, values, expected) => {
  it("preserves every native query parameter through the standard query workspace", async () => {
    const request = vi.fn(async () => ({ count: 1, lists: [row], options: { statuses: [], symbols: [], accounts: [], directions: [], reasons: [] } }));
    const wrapper = mount(component as Component, { props: { request, showAgent: true, showSwitchFilters: true } });
    await flushPromises();
    for (const [key, value] of Object.entries(values)) {
      const field = wrapper.get(`[data-query-field="${key}"]`);
      if (key === "keyword") await field.get("input").setValue(value);
      else {
        field.getComponent(MmSelect).vm.$emit("update:modelValue", value);
        await wrapper.vm.$nextTick();
      }
    }
    const before = request.mock.calls.length;
    await wrapper.get('[data-query-action="query"]').trigger("click");
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(before + 1);
    expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ ...expected, page: 1, page_size: 20 }));
    wrapper.unmount();
  });
});
