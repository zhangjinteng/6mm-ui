import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import SymbolTagManager from "../SymbolTagManager.vue";

describe("MmSymbolTagManager", () => {
  it("renders the redesigned create dialog and keeps the create payload compatible", async () => {
    const actions = {
      create: vi.fn(async () => undefined),
      list: vi.fn(async () => ({ count: 0, parent_count: 0, lists: [] })),
      loadOptions: vi.fn(async () => []),
      remove: vi.fn(),
      update: vi.fn(),
    };
    const translationActions = {
      load: vi.fn(async () => ({
        configured_count: 0,
        languages: [
          { label: "简体中文", label_en: "Simplified Chinese", locale: "zh-CN", value: "" },
          { label: "英语", label_en: "English", locale: "en", value: "" },
          { label: "日语", label_en: "Japanese", locale: "ja", value: "" },
        ],
        tag_id: 0,
        tag_name: "",
        total: 20,
      })),
      save: vi.fn(),
      translate: vi.fn(),
    };
    const wrapper = mount(SymbolTagManager, {
      props: { actions, locale: "zh-CN", translationActions },
      global: { stubs: { teleport: true } },
    });
    await flushPromises();

    await wrapper.get("button[aria-label='新增']").trigger("click");
    expect(wrapper.text()).toContain("新增父标签或独立标签");
    expect(wrapper.text()).toContain("前端多语言");
    expect(wrapper.text()).toContain("0/20");
    expect(wrapper.text()).toContain("前台显示");
    expect(wrapper.text()).toContain("热门、新币等交易对属性应在交易对配置中维护");
    expect(wrapper.find("input[placeholder='中文名称']").exists()).toBe(true);
    expect(wrapper.find("input[placeholder='英文名称']").exists()).toBe(true);

    await wrapper.get("input[placeholder='例如：加密货币']").setValue("加密货币");
    await wrapper.get("input[placeholder='例如：crypto']").setValue("Crypto-Spot");
    await wrapper.get("input[placeholder='中文名称']").setValue("加密货币");
    await wrapper.get("input[placeholder='英文名称']").setValue("Crypto");
    await wrapper.findAll("button").find((button) => button.text().includes("编辑译文"))!.trigger("click");
    await flushPromises();
    expect(translationActions.load).toHaveBeenCalledWith(0);
    await wrapper.get("input[placeholder='请输入日语标签显示名称']").setValue("暗号資産");
    await wrapper.findAll("button").find((button) => button.text().includes("应用到表单"))!.trigger("click");
    expect(wrapper.text()).toContain("3/20");
    const visibilitySwitch = wrapper.get("button[role='switch'][aria-label='前台显示']");
    expect(visibilitySwitch.attributes("aria-checked")).toBe("true");
    await visibilitySwitch.trigger("click");
    expect(visibilitySwitch.attributes("aria-checked")).toBe("false");

    await wrapper.findAll("button").find((button) => button.text().includes("保存标签"))!.trigger("click");
    await flushPromises();
    expect(actions.create).toHaveBeenCalledWith(expect.objectContaining({
      is_enable: 0,
      tag_code: "cryptospot",
      tag_name: "加密货币",
      tag_name_en: "Crypto",
      tag_name_zh: "加密货币",
      translations: expect.objectContaining({ "zh-CN": "加密货币", en: "Crypto", ja: "暗号資産" }),
    }));
  });

  it("uses the same form layout and synchronized translations when editing", async () => {
    const row = { id: 1, parent_id: 0, tag_name: "热门", tag_code: "hot", tag_name_zh: "热门", tag_name_en: "Hot", sort: 700, is_enable: 1, symbol_count: 12 };
    const actions = {
      create: vi.fn(),
      list: vi.fn(async () => ({ count: 1, parent_count: 1, lists: [row] })),
      loadOptions: vi.fn(async () => []),
      remove: vi.fn(),
      update: vi.fn(async () => undefined),
    };
    const translationActions = {
      load: vi.fn(async () => ({
        configured_count: 3,
        languages: [
          { label: "简体中文", label_en: "Simplified Chinese", locale: "zh-CN", value: "热门" },
          { label: "英语", label_en: "English", locale: "en", value: "Hot" },
          { label: "日语", label_en: "Japanese", locale: "ja", value: "人気" },
        ],
        tag_id: 1,
        tag_name: "热门",
        total: 20,
      })),
      save: vi.fn(),
      translate: vi.fn(),
    };
    const wrapper = mount(SymbolTagManager, {
      props: { actions, locale: "zh-CN", translationActions },
      global: { stubs: { teleport: true } },
    });
    await flushPromises();

    await wrapper.find("button[aria-label='查看标签详情']").trigger("click");
    await wrapper.findAll("button").find((button) => button.text().includes("编辑标签"))!.trigger("click");
    await flushPromises();

    expect(wrapper.text()).toContain("修改标签信息与前端多语言");
    expect(wrapper.text()).toContain("前端多语言");
    expect(wrapper.text()).toContain("3/20");
    expect(wrapper.find("input[placeholder='中文名称']").exists()).toBe(true);
    expect(wrapper.find("input[placeholder='英文名称']").exists()).toBe(true);

    await wrapper.findAll("button").find((button) => button.text().includes("保存标签"))!.trigger("click");
    await flushPromises();
    expect(actions.update).toHaveBeenCalledWith(1, expect.objectContaining({
      tag_name_zh: "热门",
      tag_name_en: "Hot",
      translations: expect.objectContaining({ "zh-CN": "热门", en: "Hot", ja: "人気" }),
    }));
  });

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
    expect(wrapper.text()).not.toContain("启用 Google 翻译");
    expect(wrapper.text().indexOf("待验证")).toBeGreaterThan(wrapper.text().indexOf("并发任务数"));
  });

  it("opens tag languages below edit and only translates empty values", async () => {
    const actions = {
      create: vi.fn(),
      list: vi.fn(async () => ({ count: 1, parent_count: 1, lists: [
        { id: 1, parent_id: 0, tag_name: "热门", tag_code: "hot", tag_name_zh: "热门", tag_name_en: "Hot", sort: 700, is_enable: 1, symbol_count: 12 },
      ] })),
      loadOptions: vi.fn(async () => []),
      remove: vi.fn(),
      update: vi.fn(),
    };
    const translationActions = {
      load: vi.fn(async () => ({
        configured_count: 2,
        languages: [
          { label: "简体中文", label_en: "Simplified Chinese", locale: "zh-CN", value: "热门" },
          { label: "英语", label_en: "English", locale: "en", value: "Hot" },
          { label: "日语", label_en: "Japanese", locale: "ja", value: "" },
        ],
        tag_id: 1,
        tag_name: "热门",
        total: 3,
      })),
      save: vi.fn(async (_id: number, translations: Record<string, string>) => ({
        configured_count: 3,
        languages: [],
        tag_id: 1,
        tag_name: translations["zh-CN"],
        total: 3,
      })),
      translate: vi.fn(async () => ({ failures: {}, translations: { ja: "人気" } })),
    };
    const wrapper = mount(SymbolTagManager, {
      props: { actions, locale: "zh-CN", translationActions },
      global: { stubs: { teleport: true } },
    });
    await flushPromises();

    await wrapper.find("button[aria-label='查看标签详情']").trigger("click");
    const buttons = wrapper.findAll("button");
    const editIndex = buttons.findIndex((button) => button.text().includes("编辑标签"));
    const languagesIndex = buttons.findIndex((button) => button.text().includes("多语言"));
    expect(languagesIndex).toBe(editIndex + 1);

    await buttons[languagesIndex]!.trigger("click");
    await flushPromises();
    expect(translationActions.load).toHaveBeenCalledWith(1);
    expect(wrapper.text()).toContain("标签多语言");
    expect(wrapper.text()).toContain("已配置 2/3");

    const translateButton = wrapper.findAll("button").find((button) => button.text().includes("Google 一键翻译"));
    await translateButton!.trigger("click");
    await flushPromises();
    expect(translationActions.translate).toHaveBeenCalledWith(1, {
      source_locale: "zh-CN",
      source_text: "热门",
      target_locales: ["ja"],
    });
    expect((wrapper.get("input[placeholder='请输入日语标签显示名称']").element as HTMLInputElement).value).toBe("人気");

    const applyButton = wrapper.findAll("button").find((button) => button.text().includes("应用到表单"));
    await applyButton!.trigger("click");
    await flushPromises();
    expect(translationActions.save).toHaveBeenCalledWith(1, {
      "zh-CN": "热门",
      en: "Hot",
      ja: "人気",
    });
  });
});
