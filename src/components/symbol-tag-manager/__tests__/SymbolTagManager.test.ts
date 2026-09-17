import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import SymbolTagManager from "../SymbolTagManager.vue";

describe("MmSymbolTagManager", () => {
  it("loads a hierarchy and delegates updates through the shared action contract", async () => {
    const actions = {
      create: vi.fn(async () => undefined),
      list: vi.fn(async () => ({
        count: 2,
        parent_count: 1,
        lists: [
          { id: 1, parent_id: 0, tag_name: "Crypto", tag_code: "crypto", tag_name_zh: "加密货币", tag_name_en: "Crypto", sort: 800, is_enable: 1, symbol_count: 2 },
          { id: 2, parent_id: 1, tag_name: "Layer1", tag_code: "layer1", tag_name_zh: "Layer1", tag_name_en: "Layer1", sort: 700, is_enable: 1, symbol_count: 1 },
        ],
      })),
      loadOptions: vi.fn(async () => [
        { id: 1, parent_id: 0, tag_name: "Crypto", tag_code: "crypto", tag_name_zh: "加密货币", tag_name_en: "Crypto", sort: 800, is_enable: 1, symbol_count: 2 },
      ]),
      remove: vi.fn(async () => undefined),
      update: vi.fn(async () => undefined),
    };
    const wrapper = mount(SymbolTagManager, {
      props: { actions, locale: "zh-CN" },
      global: { stubs: { teleport: true } },
    });
    await flushPromises();

    expect(actions.list).toHaveBeenCalledWith({});
    expect(wrapper.text()).toContain("Crypto");
    expect(wrapper.text()).toContain("加密货币");
    expect(wrapper.text()).toContain("Layer1");
    expect(wrapper.text()).toContain("中文名称");
    expect(wrapper.text()).toContain("英文名称");

    await wrapper.find("button[aria-label='查看标签详情']").trigger("click");
    const toggleButton = wrapper.findAll("button").find((button) => button.text().includes("隐藏标签"));
    expect(toggleButton).toBeTruthy();
    await toggleButton!.trigger("click");
    await flushPromises();
    expect(actions.update).toHaveBeenCalledWith(1, expect.objectContaining({ is_enable: 0, tag_code: "crypto" }));
  });

  it("uses English copy and can hide write operations", async () => {
    const actions = {
      create: vi.fn(),
      list: vi.fn(async () => ({ count: 0, parent_count: 0, lists: [] })),
      loadOptions: vi.fn(async () => []),
      remove: vi.fn(),
      update: vi.fn(),
    };
    const wrapper = mount(SymbolTagManager, {
      props: { actions, canCreate: false, canDelete: false, canUpdate: false, locale: "en-US" },
      global: { stubs: { teleport: true } },
    });
    await flushPromises();

    expect(wrapper.text()).toContain("No trading pair tags");
    expect(wrapper.find("button[aria-label='Add Tag']").exists()).toBe(false);
  });

  it("opens the optional Google translation configuration below the edit action", async () => {
    const actions = {
      create: vi.fn(),
      list: vi.fn(async () => ({ count: 1, parent_count: 1, lists: [
        { id: 1, parent_id: 0, tag_name: "Crypto", tag_code: "crypto", tag_name_zh: "加密货币", tag_name_en: "Crypto", sort: 800, is_enable: 1, symbol_count: 2 },
      ] })),
      loadOptions: vi.fn(async () => []),
      remove: vi.fn(),
      update: vi.fn(),
    };
    const translationConfigActions = {
      load: vi.fn(async () => ({ provider: "google" as const, api_version: "v2" as const, api_key_mask: "AIza****1234", api_key_set: true, concurrency: 3, is_enabled: true, verify_status: "pending" as const, verified_at: null, last_error: null })),
      save: vi.fn(),
      test: vi.fn(),
    };
    const wrapper = mount(SymbolTagManager, {
      props: { actions, locale: "zh-CN", translationConfigActions },
      global: { stubs: { teleport: true } },
    });
    await flushPromises();

    await wrapper.find("button[aria-label='查看标签详情']").trigger("click");
    const buttons = wrapper.findAll("button");
    const editIndex = buttons.findIndex((button) => button.text().includes("编辑标签"));
    const translationIndex = buttons.findIndex((button) => button.text().includes("Google 翻译配置"));
    expect(translationIndex).toBe(editIndex + 1);

    await buttons[translationIndex]!.trigger("click");
    await flushPromises();
    expect(translationConfigActions.load).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain("Cloud Translation Basic v2");
    expect(wrapper.text()).toContain("并发任务数");
  });
});
