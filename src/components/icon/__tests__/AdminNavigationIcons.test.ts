import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Icon from "../Icon.vue";
import { iconDefinitions, iconNames, type IconName, type IconNode } from "../icons";

// Independent shapes read from the approved total-admin prototype navigation.
const prototypeIcons = {
  "calendar-clock": [
    ["path", { d: "M16 14v2.2l1.6 1" }],
    ["path", { d: "M16 2v3" }],
    ["path", { d: "M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338" }],
    ["path", { d: "M3 9h5.859" }],
    ["path", { d: "M8 2v3" }],
    ["circle", { cx: "16", cy: "16", r: "6" }],
  ],
  waves: [
    ["path", { d: "M2 12q2.5 2 5 0t5 0 5 0 5 0" }],
    ["path", { d: "M2 19q2.5 2 5 0t5 0 5 0 5 0" }],
    ["path", { d: "M2 5q2.5 2 5 0t5 0 5 0 5 0" }],
  ],
  files: [
    ["path", { d: "M15 2h-4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V8" }],
    ["path", { d: "M16.706 2.706A2.4 2.4 0 0 0 15 2v5a1 1 0 0 0 1 1h5a2.4 2.4 0 0 0-.706-1.706z" }],
    ["path", { d: "M5 7a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h8a2 2 0 0 0 1.732-1" }],
  ],
  blocks: [
    ["path", { d: "M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" }],
    ["rect", { height: "8", rx: "1", width: "8", x: "14", y: "2" }],
  ],
} as const satisfies Record<string, readonly IconNode[]>;

describe("total-admin prototype navigation icons", () => {
  it.each(Object.entries(prototypeIcons))("registers and renders the exact %s shape", (name, nodes) => {
    expect(iconNames).toContain(name);
    expect(iconDefinitions[name as IconName]).toEqual(nodes);
    const wrapper = mount(Icon, { props: { name: name as IconName } });
    expect(wrapper.element.children).toHaveLength(nodes.length);
    nodes.forEach(([tag, attrs], index) => {
      const child = wrapper.element.children[index]!;
      expect(child.tagName).toBe(tag);
      for (const [key, value] of Object.entries(attrs)) {
        expect(child.getAttribute(key)).toBe(value);
      }
    });
  });
});
