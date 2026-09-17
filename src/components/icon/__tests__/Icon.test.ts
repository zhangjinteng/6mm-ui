import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import Icon from "../Icon.vue";
import { iconNames } from "../icons";

const agentConsoleIconNames = `
arrow-down
arrow-down-to-line
arrow-left
arrow-left-right
arrow-up
arrow-up-down
arrow-up-right
arrow-up-to-line
badge-dollar-sign
ban
banknote
bar-chart-3
bell
building-2
calendar
candlestick-chart
chart-candlestick
chart-no-axes-combined
check
chevron
chevron-down
chevron-right
circle-check
circle-check-big
circle-arrow-up
circle-dollar-sign
circle-pause
circle-x
clipboard-list
close
coins
columns
copy
database
down
external-link
file-bar-chart
file-chart-column
file-check-2
file-clock
file-text
filter
gift
globe
grid-3x3
hand-coins
history
id-card
inbox
key
key-round
landmark
layout-dashboard
left
line-chart
list
list-checks
loader-circle
lock-keyhole
logout
megaphone
menu
monitor-smartphone
moon
mouse-pointer-click
network
panel
panel-left-close
panel-right-open
party-popper
plug
plug-zap
plus
radio-tower
receipt-text
refresh
refresh-cw
right
rocket
rotate
rotate-ccw
rotate-cw
route
save
scale
scroll-text
search
search-check
search-x
server
settings
settings-2
shield-alert
shield-check
sliders-horizontal
smartphone
square-pen
store
sun
tag
terminal
trash-2
tree-branch
triangle-alert
upload
user
user-plus
user-round
users
users-round
wallet-cards
webhook
x
`
  .trim()
  .split("\n");

const extendedIconNames = `
camera
circle-help
clock
download
ellipsis
ellipsis-vertical
eraser
eye
eye-off
fullscreen
fullscreen-exit
image
mail
map
map-pin
mic
phone
printer
repeat-2
scan-line
share-2
undo-2
volume-2
volume-x
`
  .trim()
  .split("\n");

describe("MmIcon", () => {
  it("renders a named icon with accessible sizing and forwarded attributes", () => {
    const wrapper = mount(Icon, {
      attrs: { id: "status-icon" },
      props: { label: "完成", name: "check", size: 20, strokeWidth: 2 },
    });

    expect(wrapper.element.tagName).toBe("svg");
    expect(wrapper.attributes()).toMatchObject({
      "aria-label": "完成",
      id: "status-icon",
      role: "img",
      viewBox: "0 0 24 24",
    });
    expect(wrapper.attributes("style")).toContain("width: 20px");
    expect(wrapper.attributes("stroke-width")).toBe("2");
    expect(wrapper.findAll("path").length).toBeGreaterThan(0);
  });

  it("is decorative by default and supports custom SVG content", () => {
    const wrapper = mount(Icon, {
      slots: { default: '<path data-custom d="M1 1h2" />' },
    });

    expect(wrapper.attributes("aria-hidden")).toBe("true");
    expect(wrapper.find("[data-custom]").exists()).toBe(true);
  });

  it("keeps panel toggle chevrons separated from their divider", () => {
    const closing = mount(Icon, { props: { name: "panel-left-close" } });
    const opening = mount(Icon, { props: { name: "panel-right-open" } });

    expect(closing.findAll("path").map((path) => path.attributes("d"))).toEqual(
      ["M7 3v18", "M14.5 8.5 11 12l3.5 3.5"],
    );
    expect(opening.findAll("path").map((path) => path.attributes("d"))).toEqual(
      ["M17 3v18", "M9.5 8.5 13 12l-3.5 3.5"],
    );
  });

  it("renders the tree branch connector", () => {
    const wrapper = mount(Icon, { props: { name: "tree-branch" } });

    expect(wrapper.find("path").attributes("d")).toBe(
      "M5 2v10a7 7 0 0 0 7 7h8",
    );
  });

  it.each(["candlestick-chart", "chart-candlestick"] as const)(
    "renders the reference %s menu icon",
    (name) => {
      const wrapper = mount(Icon, { props: { name } });

      expect(
        wrapper.findAll("path").map((path) => path.attributes("d")),
      ).toEqual([
        "M9 5v4",
        "M9 15v2",
        "M17 3v2",
        "M17 13v3",
        "M3 3v16a2 2 0 0 0 2 2h16",
      ]);
      expect(wrapper.findAll("rect").map((rect) => rect.attributes())).toEqual([
        expect.objectContaining({ height: "6", width: "4", x: "7", y: "9" }),
        expect.objectContaining({ height: "8", width: "4", x: "15", y: "5" }),
      ]);
    },
  );

  it.each(iconNames)("renders the %s named icon", (name) => {
    const wrapper = mount(Icon, { props: { name } });

    expect(wrapper.element.childElementCount).toBeGreaterThan(0);
  });

  it("includes every reusable agent console icon", () => {
    expect(iconNames).toEqual(expect.arrayContaining(agentConsoleIconNames));
  });

  it("includes the reusable icons migrated from the Vue admin assets", () => {
    expect(iconNames).toEqual(expect.arrayContaining(extendedIconNames));
  });

  it.each([
    ["circle-arrow-up", ["m16 12-4-4-4 4", "M12 16V8"]],
    [
      "mouse-pointer-click",
      [
        "M14 4.1 12 6",
        "m5.1 8-2.9-.8",
        "m6 12-1.9 2",
        "M7.2 2.2 8 5.1",
        "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z",
      ],
    ],
    ["grid-3x3", ["M3 9h18", "M3 15h18", "M9 3v18", "M15 3v18"]],
    [
      "save",
      [
        "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
        "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
        "M7 3v4a1 1 0 0 0 1 1h7",
      ],
    ],
  ] as const)(
    "renders the prediction configuration %s icon paths",
    (name, paths) => {
      const wrapper = mount(Icon, { props: { name } });

      expect(
        wrapper.findAll("path").map((path) => path.attributes("d")),
      ).toEqual(paths);
    },
  );

  it("renders safe non-path SVG primitives from console icons", () => {
    const wrapper = mount(Icon, { props: { name: "layout-dashboard" } });

    expect(wrapper.find("rect").exists()).toBe(true);
  });
});
