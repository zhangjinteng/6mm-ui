import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Icon from "../Icon.vue";
import { iconDefinitions, iconNames, type IconName } from "../icons";
import { referenceNavigationIconDefinitions } from "../reference-navigation-icons";

// First SVG node for each missing icon, read from the approved navigation prototypes.
const expected = {
  gauge: ["path", { d: "m12 14 4-4" }],
  timer: ["line", { x1: "10", x2: "14", y1: "2", y2: "2" }],
  "briefcase-business": ["path", { d: "M12 12h.01" }],
  radio: ["path", { d: "M16.247 7.761a6 6 0 0 1 0 8.478" }],
  target: ["circle", { cx: "12", cy: "12", r: "10" }],
  "chart-pie": ["path", { d: "M21 12c.552 0 1.005-.449.95-.998a10 10 0 0 0-8.953-8.951c-.55-.055-.998.398-.998.95v8a1 1 0 0 0 1 1z" }],
  wallet: ["path", { d: "M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" }],
  "book-open-text": ["path", { d: "M12 5v16" }],
  tags: ["path", { d: "M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z" }],
  "chart-spline": ["path", { d: "M3 3v16a2 2 0 0 0 2 2h16" }],
  percent: ["line", { x1: "19", x2: "5", y1: "5", y2: "19" }],
  "layers-3": ["path", { d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" }],
  "gamepad-2": ["line", { x1: "6", x2: "10", y1: "11", y2: "11" }],
  "user-round-check": ["path", { d: "M2 21a8 8 0 0 1 13.292-6" }],
  palette: ["path", { d: "M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z" }],
  "messages-square": ["path", { d: "M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }],
  "toggle-right": ["circle", { cx: "15", cy: "12", r: "3" }],
  "log-in": ["path", { d: "m10 17 5-5-5-5" }],
} as const;

describe("white-label and merchant navigation icons", () => {
  it.each(Object.entries(referenceNavigationIconDefinitions))("uses the corrected geometry for existing %s", (name, nodes) => {
    expect(iconDefinitions[name as IconName]).toEqual(nodes);
    const wrapper = mount(Icon, { props: { name: name as IconName } });
    expect(wrapper.element.children).toHaveLength(nodes.length);
    nodes.forEach(([tag, attributes], index) => {
      const element = wrapper.element.children[index]!;
      expect(element.tagName).toBe(tag);
      for (const [attribute, value] of Object.entries(attributes)) {
        expect(element.getAttribute(attribute)).toBe(String(value));
      }
    });
  });

  it.each(Object.entries(expected))("registers and renders the prototype %s icon", (name, firstNode) => {
    expect(iconNames).toContain(name);
    const nodes = iconDefinitions[name as IconName];
    expect(nodes[0]).toEqual(firstNode);

    const wrapper = mount(Icon, { props: { name: name as IconName, size: 15 } });
    expect(wrapper.element.children).toHaveLength(nodes.length);
    expect(wrapper.element.children[0].tagName).toBe(firstNode[0]);
    expect(wrapper.element.children[0].attributes).not.toHaveProperty("href");
    for (const [attribute, value] of Object.entries(firstNode[1])) {
      expect(wrapper.element.children[0].getAttribute(attribute)).toBe(value);
    }
    expect(wrapper.attributes("stroke")).toBe("currentColor");
    expect(wrapper.attributes("aria-hidden")).toBe("true");
  });

  it("retains filled marker details without changing the SVG accessibility contract", () => {
    const wrapper = mount(Icon, { props: { name: "palette" as IconName, label: "品牌配置" } });
    expect(wrapper.findAll('circle[fill="currentColor"]')).toHaveLength(4);
    expect(wrapper.attributes("role")).toBe("img");
    expect(wrapper.attributes("aria-label")).toBe("品牌配置");
  });
});
