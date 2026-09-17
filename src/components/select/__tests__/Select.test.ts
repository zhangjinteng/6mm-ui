import { mount } from "@vue/test-utils";
import { defineComponent, nextTick, ref } from "vue";
import { describe, expect, it, vi } from "vitest";

import Select from "../Select.vue";

const options = [
  { label: "Maker", value: "maker" },
  { label: "Taker", value: "taker" },
  { disabled: true, label: "已停用", value: "legacy" },
];

describe("MmSelect", () => {
  it("shows the placeholder when an empty-value option is selected", async () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: "",
        options: [
          { label: "全部", value: "" },
          { label: "代理 A", value: "agent-a" },
        ],
        placeholder: "推荐关系：全部",
      },
    });
    const value = wrapper.get(".mm-select__value");

    expect(value.classes()).toContain("is-placeholder");
    expect(value.text()).toBe("推荐关系：全部");

    await wrapper.setProps({ modelValue: "agent-a" });
    expect(value.classes()).not.toContain("is-placeholder");
    expect(value.text()).toBe("代理 A");
  });

  it.each(["sm", "md", "lg"] as const)(
    "uses the %s control font size for its selected value",
    (size) => {
      const wrapper = mount(Select, {
        attachTo: document.body,
        props: { modelValue: "maker", options, size },
      });
      const controlStyle = window.getComputedStyle(
        wrapper.get(".mm-select__control").element,
      );
      const valueStyle = window.getComputedStyle(
        wrapper.get(".mm-select__value").element,
      );

      expect(valueStyle.fontSize).toBe(controlStyle.fontSize);
      wrapper.unmount();
    },
  );

  it("keeps the filter input left-aligned beside selected tags", () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: {
        filterable: true,
        modelValue: ["maker"],
        multiple: true,
        options,
      },
    });
    const tagsStyle = window.getComputedStyle(
      wrapper.get(".mm-select__tags").element,
    );
    const searchStyle = window.getComputedStyle(
      wrapper.get(".mm-select__search").element,
    );

    expect(tagsStyle.flexGrow).toBe("0");
    expect(searchStyle.textAlign).toBe("left");
  });

  it("centers a font-independent arrow inside a square icon box", async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { modelValue: "", options },
    });
    const arrow = wrapper.get(".mm-select__arrow");
    const closedStyle = window.getComputedStyle(arrow.element);

    expect(closedStyle.display).toBe("grid");
    expect(closedStyle.placeItems).toBe("center");
    expect(closedStyle.width).toBe("20px");
    expect(closedStyle.height).toBe("20px");
    expect(closedStyle.lineHeight).toBe("1");
    expect(arrow.text()).toBe("");
    expect(arrow.get("path").attributes("d")).toBe("m6 9 6 6 6-6");

    await wrapper.get(".mm-select__control").trigger("click");
    expect(wrapper.classes()).toContain("is-open");
    expect(arrow.get("path").attributes("d")).toBe("m18 15-6-6-6 6");
  });

  it("opens a listbox and selects options with ArrowDown and Enter", async () => {
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { modelValue: "maker", name: "feeMode", options },
    });
    const control = wrapper.get(".mm-select__control");

    expect(control.attributes()).toMatchObject({
      "aria-expanded": "false",
      role: "combobox",
    });
    expect(wrapper.get('input[type="hidden"]').attributes("name")).toBe(
      "feeMode",
    );
    await control.trigger("click");
    expect(document.body.querySelectorAll('[role="option"]')).toHaveLength(3);
    const dropdown = document.body.querySelector<HTMLElement>(
      ".mm-select__dropdown",
    );
    expect(window.getComputedStyle(dropdown!).scrollbarGutter).toBe("auto");

    await control.trigger("keydown", { key: "ArrowDown" });
    await control.trigger("keydown", { key: "Enter" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual(["taker"]);
    expect(wrapper.emitted("change")?.at(-1)).toEqual(["taker"]);
  });

  it("supports multiple selection and maximum selection limits", async () => {
    const Host = defineComponent({
      components: { Select },
      setup: () => ({ options, value: ref<string[]>(["maker"]) }),
      template:
        '<Select v-model="value" multiple :max="2" :options="options" />',
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await wrapper.get(".mm-select__control").trigger("click");
    const taker = document.body.querySelector<HTMLButtonElement>(
      '[data-value="taker"]',
    );
    taker?.click();
    await nextTick();

    expect((wrapper.vm as unknown as { value: string[] }).value).toEqual([
      "maker",
      "taker",
    ]);
    expect(wrapper.findAll(".mm-select__tag")).toHaveLength(2);
  });

  it("collapses selected tags after maxTagCount and shows the remaining count", () => {
    const wrapper = mount(Select, {
      props: {
        maxTagCount: 2,
        modelValue: ["maker", "taker", "legacy"],
        multiple: true,
        options,
      },
    });

    expect(wrapper.findAll(".mm-select__tag").map((tag) => tag.text())).toEqual(
      ["Maker", "Taker", "+1"],
    );
    expect(wrapper.get(".mm-select__tag--overflow").text()).toBe("+1");
  });

  it("filters local options and cancels stale remote queries", async () => {
    const signals: AbortSignal[] = [];
    const remoteMethod = vi.fn((query: string, signal: AbortSignal) => {
      signals.push(signal);
      return Promise.resolve([{ label: query.toUpperCase(), value: query }]);
    });
    const wrapper = mount(Select, {
      attachTo: document.body,
      props: { filterable: true, modelValue: "", options, remoteMethod },
    });
    const search = wrapper.get(".mm-select__search");

    await search.setValue("b");
    await search.setValue("e");
    await Promise.resolve();
    await nextTick();
    expect(signals[0]?.aborted).toBe(true);
    expect(document.body.textContent).toContain("E");
  });
});
