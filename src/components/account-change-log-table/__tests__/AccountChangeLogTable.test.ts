import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import { MmQueryBar } from "../../query-bar";
import type { QueryBarField, QueryBarSegmentedField } from "../../query-bar";
import AccountChangeLogTable from "../AccountChangeLogTable.vue";
import type { AccountChangeLogListQuery } from "../types";

describe("MmAccountChangeLogTable", () => {
  it("normalizes the initial cursor query and renders the default account-change columns", async () => {
    const request = vi.fn(async () => ({
      hasMore: false,
      hasPrevious: false,
      rows: [
        {
          agent_user_id: "external-1001",
          amount: "-1.25",
          change_type: "HANDLING_FEE",
          created_at: "2026-08-10 08:00:00",
          id: 101,
          product_category: "crypto",
          reference_id: "trade-1",
          symbol: "BTCUSDT",
          user: { nice_name: "Alice", username: "alice" },
          user_id: 9001,
          user_type: 1,
          wallet_balance_after: "98.75",
          wallet_balance_before: "100",
        },
        {
          amount: "10",
          change_type: "ADJUST_ISOLATED_MARGIN",
          created_at: "2026-08-10 08:01:00",
          id: 102,
          symbol: "ETHUSDT",
          user_id: 9002,
          wallet_balance_after: "108.75",
          wallet_balance_before: "98.75",
        },
      ],
    }));
    const wrapper = mount(AccountChangeLogTable, { props: { request } });

    await flushPromises();

    expect(request).toHaveBeenCalledWith(
      {
        change_type: "",
        cursor: undefined,
        end_time: "",
        keyword: "",
        order_by: "id",
        order_dir: "desc",
        page_size: 20,
        start_time: "",
        symbol: "",
        user_type: "",
      },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    const keywordField = (
      wrapper.findComponent(MmQueryBar).props("fields") as QueryBarField[]
    ).find((field) => field.key === "keyword");
    expect(keywordField).toEqual(
      expect.objectContaining({
        label: "用户 UID",
        maxlength: 20,
        placeholder: "请输入用户 UID",
      }),
    );
    expect(
      wrapper.get('[data-mm-component="pro-table"]').attributes("aria-label"),
    ).toBe("资金流水数据");
    expect(wrapper.findAll("thead th").map((header) => header.text())).toEqual(
      expect.arrayContaining([
        "用户 UID",
        "流水 ID",
        "类型",
        "合约",
        "账户余额变动(U)",
        "账变前账户余额(U)",
        "账变后账户余额(U)",
        "时间",
      ]),
    );
    expect(wrapper.text()).toContain("手续费");
    expect(wrapper.text()).toContain("调整逐仓保证金");
    expect(wrapper.text()).toContain("-1.25");
    expect(wrapper.text()).toContain("98.75");
    wrapper.unmount();
  });

  it("supports query normalization and bidirectional cursor navigation", async () => {
    const request = vi.fn(async (query: { cursor?: string }) => ({
      hasMore: query.cursor !== "cursor-next",
      hasPrevious: query.cursor === "cursor-next",
      nextCursor: query.cursor ? undefined : "cursor-next",
      previousCursor: query.cursor ? "cursor-prev" : undefined,
      rows: [{ id: query.cursor ? 2 : 1, user_id: 9001 }],
    }));
    const wrapper = mount(AccountChangeLogTable, { props: { request } });
    await flushPromises();

    const queryBar = wrapper.findComponent(MmQueryBar);
    queryBar.vm.$emit("query", {
      change_type: "handling_fee",
      keyword: "9001",
      symbol: "btc",
      time_range: ["2026-08-01", "2026-08-02"],
      user_type: 1,
    });
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        change_type: "handling_fee",
        cursor: undefined,
        end_time: "2026-08-02 23:59:59",
        keyword: "9001",
        start_time: "2026-08-01 00:00:00",
        symbol: "btc",
        user_type: 1,
      }),
      expect.any(Object),
    );

    await wrapper.get('button[aria-label="下一页"]').trigger("click");
    await flushPromises();
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ cursor: "cursor-next" }),
      expect.any(Object),
    );

    await wrapper.get('button[aria-label="上一页"]').trigger("click");
    await flushPromises();
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ cursor: "cursor-prev" }),
      expect.any(Object),
    );
    wrapper.unmount();
  });

  it("adds pnl identity and income columns and invokes the optional detail action", async () => {
    const request = vi.fn(async () => ({
      hasMore: false,
      hasPrevious: false,
      rows: [
        {
          agent_user_id: "external-1001",
          amount: "8.5",
          change_type: "FUNDING_FEE_SETTLE",
          id: 10,
          user: { nice_name: "Alice", username: "alice" },
          user_id: 9001,
        },
      ],
    }));
    const detail = vi.fn();
    const wrapper = mount(AccountChangeLogTable, {
      props: { actions: { detail }, mode: "pnl", request },
    });
    await flushPromises();

    expect(wrapper.findAll("thead th").map((header) => header.text())).toEqual(
      expect.arrayContaining(["用户名", "外部用户 ID", "收支方向", "操作"]),
    );
    expect(wrapper.text()).toContain("资金费收入");
    expect(wrapper.text()).toContain("收入");

    await wrapper.get('button[aria-label="查看详情"]').trigger("click");
    expect(detail).toHaveBeenCalledWith(expect.objectContaining({ id: 10 }));
    wrapper.unmount();
  });

  it("supports business slots and exposes reload", async () => {
    const request = vi.fn(async () => ({ rows: [{ id: 1, user_id: 9001 }] }));
    const wrapper = mount(AccountChangeLogTable, {
      props: { request },
      slots: {
        "cell-id": ({ row }: { row: { id: number } }) => `FLOW:${row.id}`,
        "cell-user_id": ({ row }: { row: { user_id: number } }) =>
          `UID:${row.user_id}`,
        "cell-symbol": ({ row }: { row: { symbol?: string } }) =>
          `SYMBOL:${row.symbol ?? "-"}`,
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain("UID:9001");
    expect(wrapper.text()).toContain("FLOW:1");
    expect(wrapper.text()).toContain("SYMBOL:-");
    await (wrapper.vm as unknown as { reload: () => Promise<void> }).reload();
    expect(request).toHaveBeenCalledTimes(2);
    wrapper.unmount();
  });

  it("includes robot filtering only when explicitly enabled", async () => {
    const request = vi.fn(async () => ({ rows: [] }));
    const wrapper = mount(AccountChangeLogTable, { props: { request } });
    await flushPromises();

    const queryBar = wrapper.findComponent(MmQueryBar);
    const userTypeField = () =>
      (queryBar.props("fields") as QueryBarField[]).find(
        (field) => field.key === "user_type",
      ) as QueryBarSegmentedField | undefined;

    expect(userTypeField()?.options).not.toContainEqual({
      label: "机器人",
      value: 3,
    });
    expect(userTypeField()?.width).toBe(154);

    await wrapper.setProps({ includeRobotUserType: true });
    await flushPromises();

    expect(userTypeField()?.options).toContainEqual({
      label: "机器人",
      value: 3,
    });
    expect(userTypeField()?.width).toBe(208);

    queryBar.vm.$emit("query", { user_type: 3 });
    await flushPromises();
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ user_type: 3 }),
      expect.objectContaining({
        filters: expect.objectContaining({ user_type: 3 }),
        signal: expect.any(AbortSignal),
      }),
    );
    wrapper.unmount();
  });

  it("hides user type and omits it from requests when disabled", async () => {
    const request = vi.fn(async (_query: AccountChangeLogListQuery) => ({
      rows: [{ id: 103, user_id: 9003, user_type: 1 }],
    }));
    const wrapper = mount(AccountChangeLogTable, {
      props: { request, showUserType: false },
    });
    await flushPromises();

    const fields = wrapper.findComponent(MmQueryBar).props(
      "fields",
    ) as QueryBarField[];
    expect(fields.some((field) => field.key === "user_type")).toBe(false);
    expect(wrapper.findAll("thead th").map((header) => header.text())).not.toContain(
      "用户类型",
    );
    expect(request.mock.calls[0]?.[0]).not.toHaveProperty("user_type");
    wrapper.unmount();
  });

  it("inserts custom query fields without moving pro-table tools and exposes applied filters", async () => {
    const request = vi.fn(async () => ({ rows: [] }));
    const queryFields = (defaultFields: QueryBarField[]): QueryBarField[] => {
      const keywordIndex = defaultFields.findIndex(
        (field) => field.key === "keyword",
      );
      const agentField: QueryBarField = {
        key: "agent_id",
        label: "推荐关系",
        type: "select",
        defaultValue: "",
        placeholder: "全部推荐关系",
        clearable: true,
        options: [
          { label: "全部推荐关系", value: "" },
          { label: "平台用户", value: 0 },
          { label: "代理商 A", value: 8 },
        ],
        width: 180,
      };

      return [
        ...defaultFields.slice(0, keywordIndex + 1),
        agentField,
        ...defaultFields.slice(keywordIndex + 1),
      ];
    };
    const wrapper = mount(AccountChangeLogTable, {
      props: { queryFields, request },
    });
    await flushPromises();

    const queryBar = wrapper.findComponent(MmQueryBar);
    expect(
      (queryBar.props("fields") as QueryBarField[]).map((field) => field.key),
    ).toEqual([
      "keyword",
      "agent_id",
      "user_type",
      "change_type",
      "symbol",
      "time_range",
    ]);
    expect(wrapper.get(".mm-query-bar__fields").text()).toContain("推荐关系");
    expect(
      wrapper
        .get(".mm-pro-table__tools")
        .find('[data-query-action="query"]')
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .get(".mm-pro-table__tools")
        .find('[data-query-action="reset"]')
        .exists(),
    ).toBe(true);
    expect(
      wrapper
        .get(".mm-pro-table__tools")
        .find('[data-pro-table-tool="refresh"]')
        .exists(),
    ).toBe(true);

    queryBar.vm.$emit("query", {
      agent_id: 8,
      change_type: "",
      keyword: "",
      symbol: "",
      time_range: null,
      user_type: "",
    });
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith(
      expect.any(Object),
      expect.objectContaining({
        filters: expect.objectContaining({ agent_id: 8 }),
        signal: expect.any(AbortSignal),
      }),
    );
    wrapper.unmount();
  });
});
