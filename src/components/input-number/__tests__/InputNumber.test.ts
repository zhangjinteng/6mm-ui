import { mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import { describe, expect, it } from "vitest";

import InputNumber from "../InputNumber.vue";
import { MmForm, MmFormItem } from "../../form";

describe("MmInputNumber", () => {
  it("steps, clamps, and rounds numeric values", async () => {
    const wrapper = mount(InputNumber, {
      props: { max: 3, min: 0, modelValue: 2, precision: 1, step: 0.5 },
    });

    await wrapper.get(".mm-input-number__increase").trigger("click");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([2.5]);

    await wrapper.get("input").setValue("9");
    await wrapper.get("input").trigger("blur");
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([3]);
  });

  it("supports keyboard steps and spinbutton accessibility", async () => {
    const wrapper = mount(InputNumber, {
      attrs: { "aria-label": "Risk threshold" },
      props: {
        disabled: false,
        max: 10,
        min: 0,
        modelValue: 4,
        name: "risk",
        step: 2,
      },
    });
    const input = wrapper.get("input");

    expect(input.attributes()).toMatchObject({
      "aria-label": "Risk threshold",
      "aria-valuemax": "10",
      "aria-valuemin": "0",
      "aria-valuenow": "4",
      name: "risk",
      role: "spinbutton",
    });
    await input.trigger("keydown", { key: "ArrowDown" });
    expect(wrapper.emitted("update:modelValue")?.at(-1)).toEqual([2]);
  });

  it("renders a suffix inside the input without removing step controls", () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 8 },
      slots: { suffix: "小时" },
    });

    expect(wrapper.get(".mm-input__suffix").text()).toBe("小时");
    expect(wrapper.find(".mm-input-number__controls").exists()).toBe(true);
  });

  it("inherits form disabled state for the input and step controls", () => {
    const Host = defineComponent({
      components: { InputNumber, MmForm, MmFormItem },
      setup: () => ({ model: ref({ limit: 2 }) }),
      template:
        '<MmForm disabled :model="model"><MmFormItem prop="limit"><InputNumber v-model="model.limit" /></MmFormItem></MmForm>',
    });
    const wrapper = mount(Host);

    expect(wrapper.get("input").attributes("disabled")).toBeDefined();
    expect(
      wrapper.get(".mm-input-number__increase").attributes("disabled"),
    ).toBeDefined();
    expect(
      wrapper.get(".mm-input-number__decrease").attributes("disabled"),
    ).toBeDefined();
  });
});
