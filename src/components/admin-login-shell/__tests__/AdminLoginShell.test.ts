import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import AdminLoginShell from "../AdminLoginShell.vue";

describe("MmAdminLoginShell", () => {
  it("renders the shared showcase and partner marquee", () => {
    const wrapper = mount(AdminLoginShell);

    expect(wrapper.attributes("data-mm-component")).toBe("admin-login-shell");
    expect(wrapper.findAll(".mm-admin-login-shell__card")).toHaveLength(24);
    expect(
      wrapper.findAll(".mm-admin-login-shell__partner-brand"),
    ).toHaveLength(20);
    expect(wrapper.get("h1").text()).toBe("6MM 管理后台");
  });

  it("keeps application-specific controls in named slots", () => {
    const wrapper = mount(AdminLoginShell, {
      slots: {
        form: '<form data-testid="login-form">登录表单</form>',
        tools: '<button data-testid="language-switch">简体中文</button>',
      },
    });

    expect(wrapper.get('[data-testid="login-form"]').text()).toBe("登录表单");
    expect(wrapper.get('[data-testid="language-switch"]').text()).toBe(
      "简体中文",
    );
  });

  it("uses bundled artwork for translated cards that omit image paths", () => {
    const wrapper = mount(AdminLoginShell, {
      props: {
        showcaseLanes: [
          [{ description: "Description", title: "Translated title" }],
        ],
      },
    });

    expect(
      wrapper.get(".mm-admin-login-shell__card-image").attributes("src"),
    ).toBeTruthy();
    expect(wrapper.text()).toContain("Translated title");
  });
});
