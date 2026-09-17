import { createApp, defineComponent } from "vue";
import { afterEach, describe, expect, it } from "vitest";

import MmUI from "../index";

describe("MmUI plugin", () => {
  const originalTheme = document.documentElement.getAttribute("data-mm-theme");

  afterEach(() => {
    document.head.querySelector("style[data-mm-ui-theme]")?.remove();
    if (originalTheme === null)
      document.documentElement.removeAttribute("data-mm-theme");
    else document.documentElement.setAttribute("data-mm-theme", originalTheme);
  });

  it("exports an installable Vue plugin", () => {
    const host = defineComponent({
      name: "TestHost",
      template: "<div />",
    });
    const app = createApp(host);

    expect(typeof MmUI.install).toBe("function");
    expect(() => app.use(MmUI)).not.toThrow();
    expect(app.component("MmAccountChangeLogTable")).toBeDefined();
    expect(app.component("MmHedgingMonitor")).toBeDefined();
    expect(app.component("MmAlert")).toBeDefined();
    expect(app.component("MmAppHeader")).toBeDefined();
    expect(app.component("MmButton")).toBeDefined();
    expect(app.component("MmAvatar")).toBeDefined();
    expect(app.component("MmBadge")).toBeDefined();
    expect(app.component("MmCard")).toBeDefined();
    expect(app.component("MmCalendar")).toBeDefined();
    expect(app.component("MmCollapse")).toBeDefined();
    expect(app.component("MmCollapseItem")).toBeDefined();
    expect(app.component("MmCursorPagination")).toBeDefined();
    expect(app.component("MmCurrentOrderTable")).toBeDefined();
    expect(app.component("MmAutocomplete")).toBeDefined();
    expect(app.component("MmCheckboxGroup")).toBeDefined();
    expect(app.component("MmForm")).toBeDefined();
    expect(app.component("MmFormItem")).toBeDefined();
    expect(app.component("MmHistoryPositionTable")).toBeDefined();
    expect(app.component("MmHistoryOrderTable")).toBeDefined();
    expect(app.component("MmHandlingFeeConfig")).toBeDefined();
    expect(app.component("MmHedgingExecutionTable")).toBeDefined();
    expect(app.component("MmDatePicker")).toBeDefined();
    expect(app.component("MmDatePickerPanel")).toBeDefined();
    expect(app.component("MmDateRangePicker")).toBeDefined();
    expect(app.component("MmDialog")).toBeDefined();
    expect(app.component("MmDrawer")).toBeDefined();
    expect(app.component("MmDescriptions")).toBeDefined();
    expect(app.component("MmDescriptionsItem")).toBeDefined();
    expect(app.component("MmEmpty")).toBeDefined();
    expect(app.component("MmFilterDrawer")).toBeDefined();
    expect(app.component("MmFeeCommissionTable")).toBeDefined();
    expect(app.component("MmInput")).toBeDefined();
    expect(app.component("MmInputNumber")).toBeDefined();
    expect(app.component("MmImage")).toBeDefined();
    expect(app.component("MmInfoGrid")).toBeDefined();
    expect(app.component("MmInfoGridItem")).toBeDefined();
    expect(app.component("MmLiquidationTable")).toBeDefined();
    expect(app.component("MmLiquidationTradesDialog")).toBeDefined();
    expect(app.component("MmLoading")).toBeDefined();
    expect(app.component("MmRadioGroup")).toBeDefined();
    expect(app.component("MmSelect")).toBeDefined();
    expect(app.component("MmSidebarNav")).toBeDefined();
    expect(app.component("MmUpload")).toBeDefined();
    expect(app.component("MmPopover")).toBeDefined();
    expect(app.component("MmMessage")).toBeDefined();
    expect(app.component("MmMessageBox")).toBeDefined();
    expect(app.component("MmMarginChangeLogTable")).toBeDefined();
    expect(app.component("MmOnlineUserTable")).toBeDefined();
    expect(app.component("MmPositionTable")).toBeDefined();
    expect(app.component("MmUserDetailDialog")).toBeDefined();
    expect(app.component("MmUserAssetTable")).toBeDefined();
    expect(app.component("MmUserTable")).toBeDefined();
    expect(app.component("MmPagination")).toBeDefined();
    expect(app.component("MmProgress")).toBeDefined();
    expect(app.component("MmProTable")).toBeDefined();
    expect(app.component("MmProTableCursorPagination")).toBeDefined();
    expect(app.component("MmQueryBar")).toBeDefined();
    expect(app.component("MmResult")).toBeDefined();
    expect(app.component("MmSegmented")).toBeDefined();
    expect(app.component("MmStatistic")).toBeDefined();
    expect(app.component("MmTag")).toBeDefined();
    expect(app.component("MmTable")).toBeDefined();
    expect(app.component("MmTypography")).toBeDefined();
    expect(app.component("MmTooltip")).toBeDefined();
    expect(app.component("MmTradeFillTable")).toBeDefined();
    expect(app.directive("mm-loading")).toBeDefined();
  });

  it("applies semantic theme colors through plugin options", () => {
    const host = defineComponent({
      name: "ThemedHost",
      template: "<div />",
    });
    const app = createApp(host);

    app.use(MmUI, {
      theme: {
        danger: "#b42318",
        info: "#175cd3",
        onPrimary: "#ffffff",
        primary: "#006b5f",
        success: "#067647",
        warning: "#b54708",
      },
    });

    const style = document.head.querySelector<HTMLStyleElement>(
      "style[data-mm-ui-theme]",
    );
    const sharedRule = style?.sheet?.cssRules[0] as CSSStyleRule;
    expect(sharedRule.selectorText).toBe(":root");
    expect(sharedRule.style.getPropertyValue("--mm-color-primary")).toBe(
      "#006b5f",
    );
    expect(sharedRule.style.getPropertyValue("--mm-color-on-primary")).toBe(
      "#ffffff",
    );
    expect(sharedRule.style.getPropertyValue("--mm-color-success")).toBe(
      "#067647",
    );
    expect(sharedRule.style.getPropertyValue("--mm-color-warning")).toBe(
      "#b54708",
    );
    expect(sharedRule.style.getPropertyValue("--mm-color-danger")).toBe(
      "#b42318",
    );
    expect(sharedRule.style.getPropertyValue("--mm-color-info")).toBe(
      "#175cd3",
    );
    expect(
      sharedRule.style.getPropertyValue("--mm-color-primary-hover"),
    ).toContain("var(--mm-color-primary)");
    expect(
      sharedRule.style.getPropertyValue("--mm-color-primary-soft"),
    ).toContain("var(--mm-color-primary)");
    expect(
      sharedRule.style.getPropertyValue("--mm-color-success-soft"),
    ).toContain("var(--mm-color-success)");
    expect(sharedRule.style.getPropertyValue("--mm-focus-ring")).toContain(
      "var(--mm-color-primary)",
    );
  });

  it("keeps explicit derived theme colors", () => {
    const app = createApp(defineComponent({ template: "<div />" }));

    app.use(MmUI, {
      theme: {
        primary: "#123456",
        primaryHover: "#234567",
        primarySoft: "#eef2f6",
        success: "#345678",
        successSoft: "#edf7f2",
      },
    });

    const style = document.head.querySelector<HTMLStyleElement>(
      "style[data-mm-ui-theme]",
    );
    const sharedRule = style?.sheet?.cssRules[0] as CSSStyleRule;
    expect(sharedRule.style.getPropertyValue("--mm-color-primary-hover")).toBe(
      "#234567",
    );
    expect(sharedRule.style.getPropertyValue("--mm-color-primary-soft")).toBe(
      "#eef2f6",
    );
    expect(sharedRule.style.getPropertyValue("--mm-color-success-soft")).toBe(
      "#edf7f2",
    );
  });

  it("applies independent light and dark theme colors", () => {
    const app = createApp(defineComponent({ template: "<div />" }));

    app.use(MmUI, {
      theme: {
        light: {
          onPrimary: "#ffffff",
          primary: "#087765",
          success: "#0b7651",
        },
        dark: {
          onPrimary: "#041b16",
          primary: "#0accaa",
          success: "#39d39c",
        },
      },
    });

    const style = document.head.querySelector<HTMLStyleElement>(
      "style[data-mm-ui-theme]",
    );
    const lightRule = style?.sheet?.cssRules[1] as CSSStyleRule;
    const darkRule = style?.sheet?.cssRules[2] as CSSStyleRule;
    expect(lightRule.selectorText).toContain("[data-mm-theme='light']");
    expect(lightRule.style.getPropertyValue("--mm-color-primary")).toBe(
      "#087765",
    );
    expect(lightRule.style.getPropertyValue("--mm-color-success")).toBe(
      "#0b7651",
    );
    expect(lightRule.style.getPropertyValue("--mm-color-on-primary")).toBe(
      "#ffffff",
    );
    expect(
      lightRule.style.getPropertyValue("--mm-color-primary-soft"),
    ).toContain("var(--mm-color-primary)");
    expect(darkRule.selectorText).toBe("[data-mm-theme='dark']");
    expect(darkRule.style.getPropertyValue("--mm-color-primary")).toBe(
      "#0accaa",
    );
    expect(darkRule.style.getPropertyValue("--mm-color-success")).toBe(
      "#39d39c",
    );
    expect(darkRule.style.getPropertyValue("--mm-color-on-primary")).toBe(
      "#041b16",
    );
    expect(
      darkRule.style.getPropertyValue("--mm-color-primary-soft"),
    ).toContain("var(--mm-color-primary)");

    document.documentElement.dataset.mmTheme = "light";
    expect(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--mm-color-primary",
      ),
    ).toBe("#087765");
    document.documentElement.dataset.mmTheme = "dark";
    expect(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--mm-color-primary",
      ),
    ).toBe("#0accaa");
  });
});
