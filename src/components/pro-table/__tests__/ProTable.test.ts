import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, ref } from "vue";
import { describe, expect, it } from "vitest";

import { MmSelect } from "../../select";
import ProTable from "../ProTable.vue";
import type { ProTableColumn } from "../types";

interface AccountRow extends Record<string, unknown> {
  id: string;
  name: string;
  status: string;
}

const columns: ProTableColumn[] = [
  {
    dataIndex: "id",
    hideable: false,
    key: "id",
    sortable: true,
    title: "账户 ID",
  },
  { dataIndex: "name", key: "name", title: "用户名" },
  { dataIndex: "status", key: "status", title: "状态" },
];
const rows: AccountRow[] = [
  { id: "A-01", name: "alice", status: "online" },
  { id: "A-02", name: "bob", status: "offline" },
];

describe("MmProTable", () => {
  it("renders the optional header before the query workspace without changing the default markup", () => {
    const withoutHeader = mount(ProTable, {
      props: { columns, data: rows, total: 2 },
    });
    const withHeader = mount(ProTable, {
      props: {
        columns,
        data: rows,
        fillHeight: true,
        queryFields: [{ key: "keyword", label: "关键词", type: "keyword" }],
        total: 2,
      },
      slots: {
        header: `
          <div data-testid="table-heading">
            <strong>自定义交易所账户</strong>
            <span>账户只负责连接与权限管理</span>
          </div>
          <div data-testid="table-summary">当前执行主账户 Binance</div>
        `,
      },
    });

    expect(withoutHeader.find("[data-pro-table-header]").exists()).toBe(false);
    const header = withHeader.get("[data-pro-table-header]");
    expect(header.element.tagName).toBe("HEADER");
    expect(header.get('[data-testid="table-heading"]').text()).toContain(
      "自定义交易所账户",
    );
    expect(header.get('[data-testid="table-summary"]').text()).toBe(
      "当前执行主账户 Binance",
    );
    expect(header.element.nextElementSibling?.classList).toContain(
      "mm-pro-table__query",
    );
    expect(withHeader.classes()).toContain("is-fill-height");
  });

  it("opts into bounded fill-height layout without changing the default mode", () => {
    const contentHeight = mount(ProTable, {
      props: { columns, data: rows, total: 2 },
    });
    const fillHeight = mount(ProTable, {
      props: { columns, data: rows, fillHeight: true, total: 2 },
    });

    expect(contentHeight.classes()).not.toContain("is-fill-height");
    expect(fillHeight.classes()).toContain("is-fill-height");
    expect(
      contentHeight.get(".mm-table__viewport").attributes("style"),
    ).toContain("max-height: 520px");
    expect(
      fillHeight.get(".mm-table__viewport").attributes("style") ?? "",
    ).not.toContain("max-height");
  });

  it("shows complete default cell content through native titles and supports opting out", async () => {
    const wrapper = mount(ProTable, {
      props: { columns, data: rows, total: 2 },
    });

    expect(
      wrapper
        .get('[data-row-key="A-01"] td[title="alice"]')
        .attributes("title"),
    ).toBe("alice");

    await wrapper.setProps({ showCellTitle: false });
    expect(wrapper.find('[data-row-key="A-01"] td[title]').exists()).toBe(
      false,
    );
  });

  it("keeps row selection internally when selected keys are uncontrolled", async () => {
    const wrapper = mount(ProTable, {
      props: { columns, data: rows, rowKey: "id", selectable: true, total: 2 },
    });

    await wrapper.get('[aria-label="选择 alice"]').setValue(true);
    await nextTick();

    expect(
      wrapper.get('[aria-label="选择 alice"]').attributes("checked"),
    ).toBeDefined();
    expect(wrapper.get('[data-row-key="A-01"]').classes()).toContain(
      "is-selected",
    );
    expect(wrapper.emitted("update:selectedRowKeys")?.at(-1)).toEqual([
      ["A-01"],
    ]);
  });

  it("keeps row selection controlled when selected keys use v-model", async () => {
    const Host = defineComponent({
      components: { ProTable },
      setup: () => ({
        columns,
        rows,
        selected: ref<Array<number | string>>(["A-02"]),
      }),
      template:
        '<ProTable v-model:selected-row-keys="selected" :columns="columns" :data="rows" row-key="id" selectable :total="2" />',
    });
    const wrapper = mount(Host);

    expect(
      wrapper.get('[aria-label="选择 bob"]').attributes("checked"),
    ).toBeDefined();
    await wrapper.get('[aria-label="选择 alice"]').setValue(true);

    expect(
      wrapper.get('[aria-label="选择 alice"]').attributes("checked"),
    ).toBeDefined();
    expect(
      wrapper.get('[aria-label="选择 bob"]').attributes("checked"),
    ).toBeDefined();
  });

  it("normalizes query, server sort, and pagination interactions", async () => {
    const wrapper = mount(ProTable, {
      props: {
        columns,
        currentPage: 2,
        data: rows,
        pageSize: 20,
        queryFields: [{ key: "keyword", label: "关键词", type: "keyword" }],
        sort: { key: "", order: null },
        total: 48,
      },
    });

    await wrapper.get('[data-query-field="keyword"] input').setValue("alice");
    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("query")?.at(-1)?.[0]).toEqual({ keyword: "alice" });
    expect(wrapper.emitted("update:currentPage")?.at(-1)).toEqual([1]);

    await wrapper.get('[aria-label="按账户 ID升序排列"]').trigger("click");
    expect(wrapper.emitted("update:sort")?.at(-1)).toEqual([
      { key: "id", order: "asc" },
    ]);
    expect(wrapper.emitted("sort-change")?.at(-1)).toEqual([
      { key: "id", order: "asc" },
    ]);

    await wrapper.get('[aria-label="第 3 页"]').trigger("click");
    expect(wrapper.emitted("update:currentPage")?.at(-1)).toEqual([3]);
  });

  it("renders a range summary with the pagination total", () => {
    const wrapper = mount(ProTable, {
      props: {
        columns,
        currentPage: 2,
        data: rows,
        pageSize: 20,
        total: 70,
      },
    });

    expect(wrapper.get(".mm-pro-table__pagination-summary").text()).toBe(
      "显示 21-40 条，第 2 页",
    );
    expect(wrapper.get(".mm-pagination__total").text()).toBe("共 70 条");
    expect(
      wrapper.get(".mm-pro-table__pagination .mm-pagination__size").text(),
    ).toContain("20 条/页");
  });

  it("supports column visibility settings while preserving required columns", async () => {
    const wrapper = mount(ProTable, {
      attachTo: document.body,
      props: { columns, data: rows, total: 2 },
    });

    await wrapper.get('[aria-label="显示字段"]').trigger("click");
    const columnsPopover = document.body.querySelector(
      ".mm-pro-table__columns-popover",
    );
    const nameToggle = document.body.querySelector<HTMLInputElement>(
      '[data-column-key="name"]',
    );
    const idToggle = document.body.querySelector<HTMLInputElement>(
      '[data-column-key="id"]',
    );
    expect(columnsPopover?.querySelector(".mm-popover__arrow")).toBeNull();
    expect(idToggle?.disabled).toBe(true);
    expect(nameToggle).not.toBeNull();
    nameToggle!.checked = false;
    nameToggle!.dispatchEvent(new Event("change", { bubbles: true }));
    await nextTick();

    expect(wrapper.findAll(".mm-table__header-table thead th")).toHaveLength(2);
    expect(wrapper.emitted("update:visibleColumnKeys")?.at(-1)?.[0]).toEqual([
      "id",
      "status",
    ]);
  });

  it("places list-level tools inside the query workspace", () => {
    const wrapper = mount(ProTable, {
      props: {
        columns,
        data: rows,
        lastUpdatedAt: "2026-07-17 12:30:00",
        queryFields: [{ key: "keyword", label: "关键词", type: "keyword" }],
        total: 2,
      },
      slots: {
        "toolbar-actions": `
          <button data-testid="simulate-empty" type="button">空结果</button>
          <button data-testid="simulate-error" type="button">模拟错误</button>
        `,
      },
    });

    const queryWorkspace = wrapper.get(".mm-pro-table__query");
    expect(queryWorkspace.find(".mm-pro-table__query-header").exists()).toBe(
      false,
    );
    expect(queryWorkspace.get(".mm-query-bar").classes()).toContain(
      "mm-query-bar--single-line",
    );
    expect(queryWorkspace.findAll("[data-query-overflow-group]")).toHaveLength(
      2,
    );
    const actionOrder = Array.from(
      queryWorkspace
        .get(".mm-query-bar__actions")
        .element.querySelectorAll<HTMLElement>("*"),
    )
      .filter((element) =>
        element.matches(
          [
            '[data-testid="simulate-empty"]',
            '[data-testid="simulate-error"]',
            '[aria-label="自动刷新间隔"]',
            '[data-query-action="query"]',
            '[data-query-action="reset"]',
            '[data-pro-table-tool="refresh"]',
            '[data-pro-table-tool="columns"]',
            '[data-pro-table-tool="filter-drawer"]',
          ].join(","),
        ),
      )
      .map(
        (element) =>
          element.getAttribute("data-testid") ||
          element.getAttribute("data-query-action") ||
          element.getAttribute("data-pro-table-tool") ||
          element.getAttribute("aria-label"),
      );

    expect(actionOrder).toEqual([
      "simulate-empty",
      "simulate-error",
      "自动刷新间隔",
      "query",
      "reset",
      "refresh",
      "columns",
      "filter-drawer",
    ]);
    expect(queryWorkspace.find('[data-testid="simulate-empty"]').exists()).toBe(
      true,
    );
    expect(queryWorkspace.find('[aria-label="自动刷新间隔"]').exists()).toBe(
      true,
    );
    expect(queryWorkspace.get('[aria-label="刷新"]').classes()).toContain(
      "is-icon-only",
    );
    expect(queryWorkspace.get('[aria-label="刷新"]').text()).toBe("");
    expect(queryWorkspace.get('[aria-label="刷新"]').attributes("title")).toBe(
      "刷新 · 上次更新 2026-07-17 12:30:00",
    );
    expect(queryWorkspace.get('[aria-label="显示字段"]').classes()).toContain(
      "is-icon-only",
    );
    expect(queryWorkspace.get('[aria-label="显示字段"]').text()).toBe("");
    expect(
      queryWorkspace.get("[data-filter-drawer-trigger]").classes(),
    ).toContain("is-icon-only");
    expect(queryWorkspace.get("[data-filter-drawer-trigger]").text()).toBe("");
    expect(wrapper.find(".mm-pro-table__toolbar").exists()).toBe(false);
    expect(wrapper.find(".mm-pro-table__standalone-tools").exists()).toBe(
      false,
    );
  });

  it("passes return context through the query bar", async () => {
    const returnContext = {
      label: "合约成交",
      route: "/admin/positionManage/tradeFills",
    };
    const wrapper = mount(ProTable, {
      props: {
        columns,
        data: rows,
        queryFields: [{ key: "keyword", label: "关键词", type: "keyword" }],
        returnContext,
        total: 2,
      },
    });

    await wrapper.get('[data-action="return-context"]').trigger("click");
    expect(wrapper.emitted("return-context")?.at(-1)).toEqual([returnContext]);
  });

  it("reuses the query schema and applied filters inside the filter drawer", async () => {
    const queryFields = [
      { key: "keyword", label: "关键词", type: "keyword" as const },
      {
        defaultValue: "all",
        key: "status",
        label: "状态",
        options: [
          { label: "全部", value: "all" },
          { label: "在线", value: "online" },
        ],
        type: "segmented" as const,
      },
    ];
    const wrapper = mount(ProTable, {
      attachTo: document.body,
      props: {
        columns,
        data: rows,
        filterDrawerSubtitle: "在线账户",
        filters: { keyword: "alice", status: "all" },
        queryFields,
        total: 2,
      },
    });

    const inlineKeys = wrapper
      .findAll(".mm-query-bar__fields [data-query-field]")
      .map((field) => field.attributes("data-query-field"));
    const trigger = wrapper.get("[data-filter-drawer-trigger]");
    expect(trigger.attributes("aria-label")).toBe(
      "更多筛选在线账户，已启用 1 项",
    );

    await trigger.trigger("click");
    await nextTick();

    const drawer = document.body.querySelector<HTMLElement>(
      '[data-mm-component="drawer"]',
    )!;
    const drawerKeys = Array.from(
      drawer.querySelectorAll<HTMLElement>("[data-query-field]"),
    ).map((field) => field.dataset.queryField);
    expect(drawerKeys).toEqual(inlineKeys);
    expect(
      drawer.querySelector<HTMLInputElement>(
        '[data-query-field="keyword"] input',
      )?.value,
    ).toBe("alice");

    const keyword = drawer.querySelector<HTMLInputElement>(
      '[data-query-field="keyword"] input',
    )!;
    keyword.value = "bob";
    keyword.dispatchEvent(new Event("input", { bubbles: true }));
    await nextTick();
    drawer
      .querySelector<HTMLButtonElement>('[data-filter-drawer-action="query"]')
      ?.click();
    await nextTick();

    expect(wrapper.emitted("query")?.at(-1)?.[0]).toEqual({
      keyword: "bob",
      status: "all",
    });
    expect(wrapper.emitted("update:filters")?.at(-1)?.[0]).toEqual({
      keyword: "bob",
      status: "all",
    });
    expect(
      document.body.querySelector('[data-mm-component="drawer"]'),
    ).toBeNull();
  });

  it("renders an inline field subset while keeping the full schema in the filter drawer", async () => {
    const queryFields = [
      { key: "keyword", label: "关键词", type: "keyword" as const },
      {
        defaultValue: "all",
        key: "status",
        label: "状态",
        options: [
          { label: "全部", value: "all" },
          { label: "在线", value: "online" },
        ],
        type: "select" as const,
      },
      {
        defaultValue: "all",
        key: "region",
        label: "地区",
        options: [
          { label: "全部", value: "all" },
          { label: "新加坡", value: "SG" },
        ],
        type: "select" as const,
      },
    ];
    const wrapper = mount(ProTable, {
      attachTo: document.body,
      props: {
        columns,
        data: rows,
        filters: { keyword: "alice", region: "all", status: "online" },
        inlineQueryFieldKeys: ["keyword"],
        queryFields,
        total: 2,
      },
    });

    const inlineKeys = wrapper
      .findAll(".mm-query-bar__fields [data-query-field]")
      .map((field) => field.attributes("data-query-field"));
    expect(inlineKeys).toEqual(["keyword"]);

    await wrapper.get("form").trigger("submit");
    expect(wrapper.emitted("query")?.at(-1)?.[0]).toEqual({
      keyword: "alice",
      region: "all",
      status: "online",
    });

    await wrapper.get('[data-query-action="reset"]').trigger("click");
    expect(wrapper.emitted("reset")?.at(-1)?.[0]).toEqual({
      keyword: "",
      region: "all",
      status: "all",
    });

    await wrapper.get("[data-filter-drawer-trigger]").trigger("click");
    await nextTick();
    const drawer = document.body.querySelector<HTMLElement>(
      '[data-mm-component="drawer"]',
    )!;
    const drawerKeys = Array.from(
      drawer.querySelectorAll<HTMLElement>("[data-query-field]"),
    ).map((field) => field.dataset.queryField);
    expect(drawerKeys).toEqual(["keyword", "status", "region"]);

    wrapper.unmount();
  });

  it("emits refresh controls and renders loading, error, and empty states", async () => {
    const wrapper = mount(ProTable, {
      props: { columns, data: [], loading: true, total: 0 },
    });
    expect(
      wrapper.get('[data-pro-table-state="loading"]').attributes("role"),
    ).toBe("status");

    await wrapper.setProps({ error: "network unavailable", loading: false });
    expect(wrapper.get('[data-pro-table-state="error"]').text()).toContain(
      "network unavailable",
    );
    await wrapper.get('[data-pro-table-action="retry"]').trigger("click");
    expect(wrapper.emitted("retry")).toHaveLength(1);

    await wrapper.setProps({ error: undefined });
    expect(wrapper.get('[data-pro-table-state="empty"]').text()).toContain(
      "暂无记录",
    );
    await wrapper.get('[data-pro-table-action="refresh"]').trigger("click");
    expect(wrapper.emitted("refresh")).toHaveLength(1);

    wrapper.findComponent(MmSelect).vm.$emit("update:modelValue", 10);
    await nextTick();
    expect(wrapper.emitted("update:autoRefreshSeconds")?.at(-1)).toEqual([10]);
  });

  it("overlays populated rows for blocking requests and keeps auto refresh lightweight", async () => {
    const wrapper = mount(ProTable, {
      props: {
        blockingLoading: true,
        columns,
        data: rows,
        queryFields: [{ key: "keyword", label: "关键词", type: "keyword" }],
        refreshing: true,
        total: 48,
      },
    });

    expect(wrapper.find('[data-row-key="A-01"]').exists()).toBe(true);
    expect(
      wrapper.get('[data-mm-component="table"]').attributes("inert"),
    ).toBeDefined();
    expect(wrapper.get('[data-pro-table-state="loading"]').classes()).toContain(
      "is-overlay",
    );
    expect(
      wrapper.get('[data-query-action="query"]').attributes("disabled"),
    ).toBeDefined();
    expect(
      wrapper.get('[aria-label="第 2 页"]').attributes("disabled"),
    ).toBeDefined();

    await wrapper.setProps({ blockingLoading: false });
    expect(wrapper.find('[data-pro-table-state="loading"]').exists()).toBe(
      false,
    );
    expect(wrapper.classes()).toContain("is-refreshing");
    expect(
      wrapper.get('[data-query-action="query"]').attributes("disabled"),
    ).toBeUndefined();
  });
});
