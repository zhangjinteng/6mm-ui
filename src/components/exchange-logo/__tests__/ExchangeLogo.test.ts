import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import ExchangeLogo from "../ExchangeLogo.vue";

describe("MmExchangeLogo", () => {
  it("normalizes a supported exchange name and renders its vector logo", () => {
    const wrapper = mount(ExchangeLogo, { props: { name: "Gate.io", size: "sm" } });

    expect(wrapper.attributes("data-exchange")).toBe("gate");
    expect(wrapper.classes()).toContain("mm-exchange-logo--sm");
    expect(wrapper.find("svg").exists()).toBe(true);
    expect(wrapper.attributes("aria-label")).toBe("Gate.io logo");
  });

  it("renders a readable fallback for an unknown exchange", () => {
    const wrapper = mount(ExchangeLogo, { props: { name: "Alpha" } });

    expect(wrapper.find("svg").exists()).toBe(false);
    expect(wrapper.get(".mm-exchange-logo__fallback").text()).toBe("A");
  });
});
