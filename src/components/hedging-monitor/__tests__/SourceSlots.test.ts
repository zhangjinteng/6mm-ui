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
        "source-filter": ({ search, loading }: { search: () => void; loading: boolean }) => h("form", {
          "data-source-query": "", onSubmit: (event: Event) => { event.preventDefault(); search(); },
        }, [h("button", { type: "submit", disabled: loading }, "Select source")]),
        "cell-source_id": ({ row }: { row: { source_id: string } }) => h("span", { "data-source-id": "" }, row.source_id),
        "cell-source_name": ({ row }: { row: { source_name: string } }) => h("span", { "data-source-name": "" }, row.source_name),
        "cell-source_type": ({ row }: { row: { source_type: string } }) => h("span", { "data-source-type": "" }, row.source_type),
      },
    });
    await flushPromises();
    expect(wrapper.get("[data-source-id]").text()).toBe("300");
    expect(wrapper.get("[data-source-name]").text()).toBe("White label");
    expect(wrapper.get("[data-source-type]").text()).toBe("white_label");
    expect(wrapper.find('[aria-label="代理商"]').exists()).toBe(false);
    const pagination = wrapper.getComponent(MmPagination);
    pagination.vm.$emit("update:currentPage", 2);
    pagination.vm.$emit("current-change", 2);
    await flushPromises();
    expect(request.mock.calls.at(-1)?.[0].page).toBe(2);
    await wrapper.get("[data-source-query]").trigger("submit");
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
    slots: { "source-filter": ({ search }: { search: () => void }) => h("form", { onSubmit: (event: Event) => { event.preventDefault(); search(); } }) },
  });
  await flushPromises();
  const selects = wrapper.findAllComponents(MmSelect);
  selects[0].vm.$emit("update:modelValue", "BTCUSDT");
  selects[4].vm.$emit("update:modelValue", "8");
  await wrapper.vm.$nextTick();
  await wrapper.findAll("button").find(button => button.text() === "查询")?.trigger("click");
  await flushPromises();
  expect(request).toHaveBeenLastCalledWith({ account_id: "8", symbol: "BTCUSDT", page: 1, page_size: 20 });
  await wrapper.get("form").trigger("submit");
  await flushPromises();
  expect(request).toHaveBeenLastCalledWith({ symbol: "BTCUSDT", page: 1, page_size: 20 });
  wrapper.unmount();
});
