import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, nextTick } from "vue";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { QueryBarField } from "../../components/query-bar";
import { useMmProTable } from "../use-pro-table";
import type { UseMmProTableReturn } from "../use-pro-table";

interface AccountRow extends Record<string, unknown> {
  id: string;
  name: string;
}

let controller: UseMmProTableReturn<AccountRow>;

function mountController(
  request: Parameters<typeof useMmProTable<AccountRow>>[0]["request"],
  options: Partial<Parameters<typeof useMmProTable<AccountRow>>[0]> = {},
) {
  const Host = defineComponent({
    setup() {
      controller = useMmProTable<AccountRow>({ request, ...options });
      return () =>
        h("div", controller.rows.value.map((row) => row.name).join(","));
    },
  });
  return mount(Host);
}

afterEach(() => {
  vi.useRealTimers();
});

describe("useMmProTable", () => {
  it("derives filter defaults and exposes component bindings", async () => {
    const queryFields: QueryBarField[] = [
      { key: "keyword", label: "关键词", type: "keyword" },
      {
        defaultValue: "all",
        key: "status",
        label: "状态",
        options: [
          { label: "全部", value: "all" },
          { label: "在线", value: "online" },
        ],
        type: "select",
      },
    ];
    const request = vi.fn(async () => ({
      rows: [{ id: "1", name: "alice" }],
      total: 1,
    }));
    const wrapper = mountController(request, {
      initialFilters: { keyword: "seed" },
      queryFields,
    });
    await flushPromises();

    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: { keyword: "seed", status: "all" },
        reason: "initial",
      }),
    );
    expect(controller.proTableBindings.value).toMatchObject({
      currentPage: 1,
      data: [{ id: "1", name: "alice" }],
      filters: { keyword: "seed", status: "all" },
      queryFields,
      total: 1,
    });

    controller.proTableBindings.value["onUpdate:pageSize"](50);
    await nextTick();
    await flushPromises();
    expect(controller.pageSize.value).toBe(50);
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ pageSize: 50, reason: "state-change" }),
    );

    controller.query({ keyword: "changed", status: "online" });
    await flushPromises();
    controller.reset();
    await flushPromises();
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: { keyword: "seed", status: "all" },
        reason: "reset",
      }),
    );
    wrapper.unmount();
  });

  it("loads data and normalizes query, pagination, and server sort requests", async () => {
    const request = vi.fn(async ({ page }: { page: number }) => ({
      rows: [{ id: String(page), name: `page-${page}` }],
      total: 42,
    }));
    const wrapper = mountController(request, {
      initialFilters: { keyword: "" },
      initialPageSize: 20,
      initialSort: { key: "createdAt", order: "desc" },
    });
    await flushPromises();

    expect(controller.rows.value[0]?.name).toBe("page-1");
    expect(controller.total.value).toBe(42);
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: { keyword: "" },
        page: 1,
        pageSize: 20,
        reason: "initial",
        sort: { key: "createdAt", order: "desc" },
      }),
    );

    controller.currentPage.value = 2;
    await nextTick();
    await flushPromises();
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ page: 2, reason: "state-change" }),
    );

    controller.query({ keyword: "alice" });
    await nextTick();
    await flushPromises();
    expect(controller.currentPage.value).toBe(1);
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({
        filters: { keyword: "alice" },
        page: 1,
        reason: "query",
      }),
    );
    wrapper.unmount();
  });

  it("aborts stale requests and retains existing rows when a refresh fails", async () => {
    const pending: Array<{
      reject: (error: Error) => void;
      resolve: (value: { rows: AccountRow[]; total: number }) => void;
      signal: AbortSignal;
    }> = [];
    const request = vi.fn(
      ({ signal }: { signal: AbortSignal }) =>
        new Promise<{ rows: AccountRow[]; total: number }>(
          (resolve, reject) => {
            pending.push({ reject, resolve, signal });
          },
        ),
    );
    const wrapper = mountController(request);
    await nextTick();
    expect(pending).toHaveLength(1);

    void controller.reload();
    await nextTick();
    expect(pending[0]?.signal.aborted).toBe(true);
    pending[1]?.resolve({ rows: [{ id: "fresh", name: "fresh" }], total: 1 });
    await flushPromises();
    expect(controller.rows.value[0]?.name).toBe("fresh");

    void controller.reload();
    await nextTick();
    pending[2]?.reject(new Error("network unavailable"));
    await flushPromises();
    expect(controller.error.value).toBe("network unavailable");
    expect(controller.rows.value[0]?.name).toBe("fresh");
    wrapper.unmount();
  });

  it("blocks manual interactions while keeping timer refreshes lightweight", async () => {
    const pending: Array<{
      resolve: (value: { rows: AccountRow[]; total: number }) => void;
    }> = [];
    const request = vi
      .fn()
      .mockResolvedValueOnce({ rows: [{ id: "1", name: "alice" }], total: 1 })
      .mockImplementation(
        () =>
          new Promise<{ rows: AccountRow[]; total: number }>((resolve) => {
            pending.push({ resolve });
          }),
      );
    const wrapper = mountController(request);
    await flushPromises();

    const manualRequest = controller.reload("manual");
    await nextTick();
    expect(controller.refreshing.value).toBe(true);
    expect(controller.blockingLoading.value).toBe(true);
    expect(controller.proTableBindings.value.blockingLoading).toBe(true);

    pending[0]?.resolve({ rows: [{ id: "2", name: "bob" }], total: 1 });
    await manualRequest;
    expect(controller.blockingLoading.value).toBe(false);

    const autoRequest = controller.reload("auto");
    await nextTick();
    expect(controller.refreshing.value).toBe(true);
    expect(controller.blockingLoading.value).toBe(false);
    expect(controller.proTableBindings.value.blockingLoading).toBe(false);

    pending[1]?.resolve({ rows: [{ id: "3", name: "carol" }], total: 1 });
    await autoRequest;
    wrapper.unmount();
  });

  it("runs opt-in auto refresh only while visible and cleans up on unmount", async () => {
    vi.useFakeTimers();
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    const request = vi.fn(async () => ({
      rows: [{ id: "live", name: "live" }],
      total: 1,
    }));
    const wrapper = mountController(request, { initialAutoRefreshSeconds: 5 });
    await flushPromises();
    expect(request).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(5000);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ reason: "auto" }),
    );

    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "hidden",
    });
    await vi.advanceTimersByTimeAsync(5000);
    expect(request).toHaveBeenCalledTimes(2);

    wrapper.unmount();
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      value: "visible",
    });
    await vi.advanceTimersByTimeAsync(5000);
    expect(request).toHaveBeenCalledTimes(2);
  });
});
