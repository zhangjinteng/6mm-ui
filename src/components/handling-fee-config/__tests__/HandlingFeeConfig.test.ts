import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";

import HandlingFeeConfig from "../HandlingFeeConfig.vue";
import type {
  HandlingFeeConfigFormValue,
  HandlingFeeConfigRow,
} from "../types";

const platformRows: HandlingFeeConfigRow[] = [
  {
    agent_id: 0,
    id: 1,
    level: 0,
    level_name: "普通会员",
    maker_fee_rate: "0.02",
    taker_fee_rate: "0.05",
    volume_30d: "5000000",
  },
  {
    agent_id: 0,
    id: 2,
    level: 1,
    level_name: "VIP1",
    maker_fee_rate: "0.018",
    taker_fee_rate: "0.05",
    volume_30d: "10000000",
  },
];

afterEach(() => {
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

function findBodyButton(label: string): HTMLButtonElement {
  const button = Array.from(document.body.querySelectorAll("button")).find(
    (item) => item.textContent?.trim() === label,
  );
  if (!(button instanceof HTMLButtonElement))
    throw new Error(`Button not found: ${label}`);
  return button;
}

function setInput(input: HTMLInputElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event("input", { bubbles: true }));
}

describe("MmHandlingFeeConfig", () => {
  it("queries the platform by default and renders fee tiers", async () => {
    const request = vi.fn(async () => ({ rows: platformRows, total: 2 }));
    const wrapper = mount(HandlingFeeConfig, { props: { request } });

    await flushPromises();

    expect(request).toHaveBeenCalledWith(
      { agent_id: 0, page_no: 1, page_size: 20 },
      expect.objectContaining({ signal: expect.any(AbortSignal) }),
    );
    expect(wrapper.text()).toContain("平台默认");
    expect(wrapper.text()).toContain("< 5,000,000");
    expect(wrapper.text()).toContain("≥ 10,000,000");
    expect(
      wrapper.get('[data-mm-component="pro-table"]').attributes("aria-label"),
    ).toBe("手续费配置");
    wrapper.unmount();
  });

  it("creates a fee tier through the shared form dialog and reloads", async () => {
    const request = vi.fn(async () => ({ rows: platformRows, total: 2 }));
    const create = vi.fn(
      async (_value: HandlingFeeConfigFormValue) => undefined,
    );
    const loadCreateDefaults = vi.fn(async () => ({
      level_name: "VIP2",
      volume_30d_min: "10000000",
    }));
    const wrapper = mount(HandlingFeeConfig, {
      attachTo: document.body,
      props: { actions: { create, loadCreateDefaults }, request },
    });
    await flushPromises();

    findBodyButton("新增").click();
    await flushPromises();
    const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')!;
    const inputs = Array.from(
      dialog.querySelectorAll<HTMLInputElement>("input"),
    );
    expect(dialog.textContent).toContain("新增手续费配置");
    expect(inputs[0]?.value).toBe("VIP2");

    setInput(inputs[1]!, "20000000");
    setInput(inputs[2]!, "0.015");
    setInput(inputs[3]!, "0.04");
    findBodyButton("确定").click();
    await flushPromises();

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        agent_id: 0,
        level_name: "VIP2",
        maker_fee_rate: "0.015",
        taker_fee_rate: "0.04",
        volume_30d: "20000000",
        volume_30d_min: "10000000",
      }),
      expect.objectContaining({ reload: expect.any(Function) }),
    );
    expect(request).toHaveBeenCalledTimes(2);
    expect(document.body.querySelector('[role="dialog"]')).toBeNull();
    wrapper.unmount();
  });

  it("loads and submits edits and uses the custom delete dialog", async () => {
    const request = vi.fn(async () => ({ rows: platformRows, total: 2 }));
    const update = vi.fn(async () => undefined);
    const remove = vi.fn(async () => undefined);
    const loadEditData = vi.fn(async () => ({ maker_fee_rate: "0.017" }));
    const wrapper = mount(HandlingFeeConfig, {
      attachTo: document.body,
      props: { actions: { loadEditData, remove, update }, request },
    });
    await flushPromises();

    await wrapper.get('button[aria-label="编辑"]').trigger("click");
    await flushPromises();
    let dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog.textContent).toContain("修改手续费配置");
    expect(loadEditData).toHaveBeenCalledWith(platformRows[0]);
    const editInputs = Array.from(
      dialog.querySelectorAll<HTMLInputElement>("input"),
    );
    expect(editInputs[2]?.value).toBe("0.017");
    findBodyButton("确定").click();
    await flushPromises();

    expect(update).toHaveBeenCalledWith(
      platformRows[0],
      expect.objectContaining({ id: "1", maker_fee_rate: "0.017" }),
      expect.objectContaining({ reload: expect.any(Function) }),
    );

    await wrapper.get('button[aria-label="删除"]').trigger("click");
    await flushPromises();
    dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')!;
    expect(dialog.textContent).toContain("确认删除当前手续费等级?");
    expect(dialog.querySelector('[data-mm-component="alert"]')).toBeNull();
    findBodyButton("确认删除").click();
    await flushPromises();

    expect(remove).toHaveBeenCalledWith(
      platformRows[1],
      expect.objectContaining({ reload: expect.any(Function) }),
    );
    expect(request).toHaveBeenCalledTimes(3);
    wrapper.unmount();
  });

  it("renders agent-owned configurations as read only", async () => {
    const request = vi.fn(async () => ({
      rows: [{ ...platformRows[0], agent_id: 14 }],
      total: 1,
    }));
    const wrapper = mount(HandlingFeeConfig, {
      props: {
        actions: { create: vi.fn(), remove: vi.fn(), update: vi.fn() },
        initialAgentId: 14,
        ownerOptions: [{ label: "易游", value: "14" }],
        request,
        showOwnerFilter: false,
      },
    });
    await flushPromises();

    expect(request).toHaveBeenCalledWith(
      { agent_id: 14, page_no: 1, page_size: 20 },
      expect.any(Object),
    );
    expect(wrapper.text()).toContain("无法修改");
    expect(wrapper.text()).toContain("代理 ID: 14");
    expect(wrapper.find('button[aria-label="编辑"]').exists()).toBe(false);
    expect(wrapper.find('button[aria-label="删除"]').exists()).toBe(false);
    expect(
      wrapper.findAll("button").some((button) => button.text() === "新增"),
    ).toBe(false);
    wrapper.unmount();
  });

  it("can edit fallback rows for another write owner without changing their displayed owner", async () => {
    const request = vi.fn(async () => ({ rows: platformRows, total: 2 }));
    const update = vi.fn(async () => undefined);
    const wrapper = mount(HandlingFeeConfig, {
      attachTo: document.body,
      props: {
        actions: { update },
        canEditRow: () => true,
        initialAgentId: 14,
        request,
        showOwnerFilter: false,
        volumeEditable: false,
        writeAgentId: 14,
      },
    });
    await flushPromises();

    expect(wrapper.text()).toContain("平台默认");
    expect(wrapper.find('button[aria-label="编辑"]').exists()).toBe(true);
    expect(wrapper.text()).not.toContain("无法修改");

    await wrapper.get('button[aria-label="编辑"]').trigger("click");
    await flushPromises();
    const dialog = document.body.querySelector<HTMLElement>('[role="dialog"]')!;
    const inputs = Array.from(
      dialog.querySelectorAll<HTMLInputElement>("input"),
    );
    expect(inputs[1]?.disabled).toBe(true);
    setInput(inputs[2]!, "0.025");
    setInput(inputs[3]!, "0.055");
    findBodyButton("确定").click();
    await flushPromises();

    expect(update).toHaveBeenCalledWith(
      platformRows[0],
      expect.objectContaining({
        agent_id: 14,
        maker_fee_rate: "0.025",
        taker_fee_rate: "0.055",
      }),
      expect.objectContaining({ reload: expect.any(Function) }),
    );
    wrapper.unmount();
  });
});
