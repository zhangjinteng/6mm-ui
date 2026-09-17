import { mount } from "@vue/test-utils";
import { h } from "vue";
import { describe, expect, it } from "vitest";

import InfoGrid from "../InfoGrid.vue";
import InfoGridItem from "../InfoGridItem.vue";

describe("MmInfoGrid", () => {
  it.each(["sm", "md", "lg"] as const)("renders the %s size", (size) => {
    const wrapper = mount(InfoGrid, { props: { size } });

    expect(wrapper.classes()).toContain(`mm-info-grid--${size}`);
    expect(wrapper.attributes("data-mm-component")).toBe("info-grid");
    expect(wrapper.element.tagName).toBe("DL");
  });

  it("renders columns, capped spans, labels, values, and value classes", () => {
    const wrapper = mount(InfoGrid, {
      props: { columns: 2 },
      slots: {
        default: () => [
          h(InfoGridItem, { label: "用户 UID" }, () => "5804991015"),
          h(
            InfoGridItem,
            { label: "仓位编号", span: 3, valueClass: "is-profit" },
            () => "101184211",
          ),
        ],
      },
    });

    expect(wrapper.attributes("style")).toContain("--mm-info-grid-columns: 2");
    expect(wrapper.findAll(".mm-info-grid-item")).toHaveLength(2);
    expect(wrapper.findAll(".mm-info-grid-item")[1]!.classes()).toContain(
      "is-full",
    );
    expect(
      wrapper.findAll(".mm-info-grid-item")[1]!.attributes("style"),
    ).toContain("--mm-info-grid-span: 2");
    expect(wrapper.get("dt").text()).toBe("用户 UID");
    expect(wrapper.get("dd").text()).toBe("5804991015");
    expect(wrapper.findAll("dd")[1]!.classes()).toContain("is-profit");
  });

  it("supports a custom label slot", () => {
    const wrapper = mount(InfoGrid, {
      slots: {
        default: () =>
          h(
            InfoGridItem,
            {},
            {
              default: () => "正常",
              label: () => h("strong", "状态"),
            },
          ),
      },
    });

    expect(wrapper.get("dt strong").text()).toBe("状态");
  });

  it("styles semantic div, dt, and dd slot markup for incremental migrations", () => {
    const wrapper = mount(InfoGrid, {
      slots: {
        default:
          '<div class="mm-info-grid__item is-full"><dt>账户</dt><dd>alpha</dd></div>',
      },
    });

    expect(wrapper.get(".mm-info-grid__item").classes()).toContain("is-full");
    expect(wrapper.get("dt").text()).toBe("账户");
    expect(wrapper.get("dd").text()).toBe("alpha");
  });
});
