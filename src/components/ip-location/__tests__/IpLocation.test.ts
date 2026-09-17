import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import IpLocation from "../IpLocation.vue";

describe("MmIpLocation", () => {
  it("renders a resolved location with an emoji derived from the country code", () => {
    const wrapper = mount(IpLocation, {
      props: {
        info: {
          city: "Mountain View",
          country_code: "US",
          kind: "resolved",
          region: "California",
          timezone: "America/Los_Angeles",
        },
        ip: "8.8.8.8",
        showTooltip: false,
      },
    });

    expect(wrapper.get("[data-ip-location-ip]").text()).toBe("8.8.8.8");
    expect(wrapper.get("[data-ip-location-flag]").text()).toBe("🇺🇸");
    expect(wrapper.get("[data-ip-location-address]").text()).toContain(
      "Mountain View",
    );
  });

  it("supports location-first display and an IP label", () => {
    const wrapper = mount(IpLocation, {
      props: {
        info: { city: "Singapore", country_code: "SG", kind: "resolved" },
        ip: "23.249.26.132",
        locationFirst: true,
        showIpLabel: true,
        showTooltip: false,
      },
    });

    expect(wrapper.classes()).toContain("mm-ip-location--location-first");
    expect(wrapper.get("[data-ip-location-ip]").text()).toBe(
      "IP: 23.249.26.132",
    );
  });

  it("uses localized names supplied by 6mm-addr", () => {
    const wrapper = mount(IpLocation, {
      props: {
        info: {
          city: "Tung Chung",
          city_names: { en: "Tung Chung", zh: "东涌" },
          country: "Hong Kong",
          country_code: "HK",
          country_names: { en: "Hong Kong", zh: "香港" },
          kind: "resolved",
          region: "Islands",
          region_names: { en: "Islands", zh: "离岛区" },
        },
        showIp: false,
        showTooltip: false,
      },
    });

    expect(wrapper.get("[data-ip-location-address]").text()).toBe(
      "东涌 / 离岛区 / 香港",
    );
  });

  it("renders private and unavailable states without remote flag assets", () => {
    const privateLocation = mount(IpLocation, {
      props: {
        info: { kind: "private" },
        ip: "10.0.0.1",
        showTooltip: false,
      },
    });
    const unavailableLocation = mount(IpLocation, {
      props: {
        info: { kind: "unavailable" },
        ip: "203.0.113.1",
        showTooltip: false,
      },
    });

    expect(privateLocation.text()).toContain("本地/内网地址");
    expect(privateLocation.find("img").exists()).toBe(false);
    expect(unavailableLocation.text()).toContain("地区待解析");
  });

  it("renders a dash when no IP or location is available", () => {
    const wrapper = mount(IpLocation);
    expect(wrapper.text()).toBe("-");
  });
});
