import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import SymbolTagManager from "../SymbolTagManager.vue";

describe("MmSymbolTagManager", () => {
  const deletionRow = { id: 7, parent_id: 0, tag_name: "Crypto", tag_code: "crypto", tag_name_zh: "加密货币", tag_name_en: "Crypto", sort: 800, is_enable: 1, symbol_count: 2 };
  function deletionActions() {
    return {
      create: vi.fn(),
      list: vi.fn(async () => ({ count: 1, parent_count: 1, lists: [deletionRow] })),
      loadOptions: vi.fn(async () => []),
      remove: vi.fn(async (_id: number) => undefined),
      update: vi.fn(),
    };
  }

  it("moves deletion into the edit footer with cancel styling and preserves confirmation", async () => {
    const actions = deletionActions();
    const wrapper = mount(SymbolTagManager, { props: { actions }, global: { stubs: { teleport: true } } });
    await flushPromises();
    const edit = wrapper.get("button[aria-label='编辑标签']");
    expect(edit.attributes('title')).toBe('编辑标签');
    expect(edit.get('svg').attributes('style')).toContain('14px');
    expect(edit.get('path').attributes('d')).toBe('M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7');
    await edit.trigger('click');
    await flushPromises();
    expect(wrapper.find('.mm-symbol-tag-manager__drawer-actions').exists()).toBe(false);
    expect((wrapper.get("input[placeholder='例如：加密货币']").element as HTMLInputElement).value).toBe('Crypto');
    const footer = wrapper.get('.mm-symbol-tag-manager__dialog-footer');
    expect(footer.findAll('button').map(button => button.text())).toEqual(['取消', '删除标签', '保存标签']);
    expect(footer.findAll('button')[1]!.classes()).toEqual(footer.findAll('button')[0]!.classes());
    await wrapper.get("input[placeholder='例如：加密货币']").setValue('未保存名称');
    await footer.findAll('button')[1]!.trigger('click');
    expect(actions.remove).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('确认删除标签“加密货币”？');
    await wrapper.get('[data-message-box-cancel]').trigger('click');
    await flushPromises();
    expect(actions.remove).not.toHaveBeenCalled();
    expect((wrapper.get("input[placeholder='例如：加密货币']").element as HTMLInputElement).value).toBe('未保存名称');
    await footer.findAll('button')[1]!.trigger('click');
    await wrapper.get('[data-message-box-confirm]').trigger('click');
    await flushPromises();
    expect(actions.remove).toHaveBeenCalledExactlyOnceWith(7);
    expect(actions.update).not.toHaveBeenCalled();
    expect(actions.list).toHaveBeenCalledTimes(2);
    expect(wrapper.find('.mm-symbol-tag-manager__dialog-footer').exists()).toBe(false);
    wrapper.unmount();
  });

  it("keeps the edit form on delete failure and blocks concurrent save/delete/close", async () => {
    const actions = deletionActions();
    let rejectDelete!: (reason: Error) => void;
    actions.remove.mockImplementation(() => new Promise((_resolve, reject) => { rejectDelete = reject; }));
    const wrapper = mount(SymbolTagManager, { props: { actions }, global: { stubs: { teleport: true } } });
    await flushPromises();
    await wrapper.get("button[aria-label='编辑标签']").trigger('click');
    await flushPromises();
    await wrapper.get("input[placeholder='例如：加密货币']").setValue('保留草稿');
    const footer = wrapper.get('.mm-symbol-tag-manager__dialog-footer');
    await footer.findAll('button')[1]!.trigger('click');
    await wrapper.get('[data-message-box-confirm]').trigger('click');
    await flushPromises();
    expect(actions.remove).toHaveBeenCalledExactlyOnceWith(7);
    expect(wrapper.get('.mm-symbol-tag-manager__dialog-footer').findAll('button').map(button => button.attributes('disabled'))).toEqual(['', '', '']);
    await footer.findAll('button')[2]!.trigger('click');
    expect(actions.update).not.toHaveBeenCalled();
    rejectDelete(new Error('该标签仍有关联，不能删除'));
    await flushPromises();
    expect(wrapper.text()).toContain('该标签仍有关联，不能删除');
    expect((wrapper.get("input[placeholder='例如：加密货币']").element as HTMLInputElement).value).toBe('保留草稿');
    expect(footer.findAll('button')[1]!.attributes('disabled')).toBeUndefined();
    expect(actions.list).toHaveBeenCalledOnce();
    wrapper.unmount();
  });

  it("does not offer deletion for a new tag or without delete permission", async () => {
    const actions = deletionActions();
    const wrapper = mount(SymbolTagManager, { props: { actions, canDelete: false }, global: { stubs: { teleport: true } } });
    await flushPromises();
    await wrapper.get("button[aria-label='编辑标签']").trigger('click');
    await flushPromises();
    expect(wrapper.get('.mm-symbol-tag-manager__dialog-footer').findAll('button').map(button => button.text())).toEqual(['取消', '保存标签']);
    await wrapper.setProps({ canDelete: true });
    await wrapper.get('.mm-symbol-tag-manager__dialog-footer button').trigger('click');
    await wrapper.get("button[aria-label='新增']").trigger('click');
    await flushPromises();
    expect(wrapper.get('.mm-symbol-tag-manager__dialog-footer').findAll('button').map(button => button.text())).toEqual(['取消', '保存标签']);
    wrapper.unmount();
  });

  it("preserves deletion-only permissions without allowing updates and supports English labels", async () => {
    const actions = deletionActions();
    const wrapper = mount(SymbolTagManager, { props: { actions, canUpdate: false, locale: 'en-US' }, global: { stubs: { teleport: true } } });
    await flushPromises();
    await wrapper.get("button[aria-label='Edit Tag']").trigger('click');
    await flushPromises();
    const footer = wrapper.get('.mm-symbol-tag-manager__dialog-footer');
    expect(footer.findAll('button').map(button => button.text())).toEqual(['Cancel', 'Delete Tag']);
    expect(wrapper.get("input[placeholder='e.g. Crypto']").attributes('disabled')).toBeDefined();
    await footer.findAll('button')[1]!.trigger('click');
    await wrapper.get('[data-message-box-confirm]').trigger('click');
    await flushPromises();
    expect(actions.remove).toHaveBeenCalledExactlyOnceWith(7);
    expect(actions.update).not.toHaveBeenCalled();
    wrapper.unmount();
  });

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
      tag_code: "crypto-spot",
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

    await wrapper.get("button[aria-label='编辑标签']").trigger("click");
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

    await wrapper.get("button[aria-label='编辑标签']").trigger("click");
    await wrapper.get("button[role='switch'][aria-label='前台显示']").trigger("click");
    await wrapper.findAll('button').find(button => button.text() === '保存标签')!.trigger('click');
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

  it("keeps optional translation settings accessible in the read-only detail drawer", async () => {
    const actions = {
      create: vi.fn(),
      list: vi.fn(async () => ({ count: 1, parent_count: 1, lists: [
        { id: 1, parent_id: 0, tag_name: "Crypto", tag_code: "crypto", tag_name_zh: "加密货币", tag_name_en: "Crypto", sort: 800, is_enable: 1, symbol_count: 2 },
      ] })),
      loadOptions: vi.fn(async () => []),
      remove: vi.fn(),
      update: vi.fn(),
    };
    const translationSettingsActions = {
      load: vi.fn(async () => ({ space_id: "merchant:7", space_revision: "1", target_locales: ["en"], provider: "google", api_version: "v2", credential_ref: "database", credential_configured: true, supported: true, concurrency_limit: 3, request_timeout_seconds: 30, max_attempts: 3, is_enabled: true })),
      save: vi.fn(),
      testConnection: vi.fn(),
    };
    const wrapper = mount(SymbolTagManager, {
      props: { actions, locale: "zh-CN", translationSettingsActions, canUpdate: false, canDelete: false },
      global: { stubs: { teleport: true } },
    });
    await flushPromises();

    await wrapper.find("button[aria-label='查看标签详情']").trigger("click");
    const buttons = wrapper.findAll("button");
    const translationIndex = buttons.findIndex((button) => button.text().includes("翻译设置"));
    expect(wrapper.find("button[aria-label='编辑标签']").exists()).toBe(false);
    expect(translationIndex).toBeGreaterThanOrEqual(0);
    expect(buttons[translationIndex]!.classes()).toContain('mm-translation-settings-button');

    await buttons[translationIndex]!.trigger("click");
    await flushPromises();
    expect(translationSettingsActions.load).toHaveBeenCalledOnce();
    expect(wrapper.text()).toContain("Cloud Translation Basic v2");
    expect(wrapper.text()).toContain("并发上限");
    expect(wrapper.text()).toContain("目标语言");
    expect(wrapper.text()).toContain("最大尝试次数");
    expect(wrapper.text()).not.toContain("启用 Google 翻译");
  });

  it("opens languages from the direct edit dialog and saves translated drafts with the tag", async () => {
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

    await wrapper.get("button[aria-label='编辑标签']").trigger("click");
    await flushPromises();
    const buttons = wrapper.findAll("button");
    const languagesIndex = buttons.findIndex((button) => button.text().includes("编辑译文"));
    expect(languagesIndex).toBeGreaterThanOrEqual(0);

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
    expect(translationActions.save).not.toHaveBeenCalled();
    await wrapper.findAll('button').find(button => button.text() === '保存标签')!.trigger('click');
    await flushPromises();
    expect(actions.update).toHaveBeenCalledWith(1, expect.objectContaining({ translations: {
      "zh-CN": "热门",
      en: "Hot",
      ja: "人気",
    } }));
  });
});
