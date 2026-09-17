import { expect, test } from "@playwright/test";

const migratedVueAdminIconNames = [
  "camera",
  "circle-help",
  "clock",
  "download",
  "ellipsis",
  "ellipsis-vertical",
  "eraser",
  "eye",
  "eye-off",
  "fullscreen",
  "fullscreen-exit",
  "image",
  "mail",
  "map",
  "map-pin",
  "mic",
  "phone",
  "printer",
  "repeat-2",
  "scan-line",
  "share-2",
  "undo-2",
  "volume-2",
  "volume-x",
] as const;

test("opens the complete icon preview from the feedback console", async ({
  page,
}) => {
  await page.context().grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await page.getByTestId("icon-preview-trigger").click();

  const overlay = page.getByTestId("icon-preview-dialog");
  const dialog = overlay.getByRole("dialog", { name: "6MM UI 图标目录" });
  const icons = dialog.getByRole("listitem");

  await expect(dialog).toBeVisible();
  await expect(icons).toHaveCount(138);
  for (const name of migratedVueAdminIconNames) {
    await expect(dialog.locator(`[data-icon-name="${name}"]`)).toBeVisible();
  }
  await expect(dialog.locator('[data-icon-name="calendar"]')).toBeVisible();
  await expect(
    dialog.locator('[data-icon-name="layout-dashboard"] rect'),
  ).toHaveCount(4);
  await expect(dialog.locator('[data-icon-name="filter"]')).toBeVisible();
  await expect(dialog.locator('[data-icon-name="history"]')).toBeVisible();
  await expect(
    dialog.locator('[data-icon-name="loader-circle"]'),
  ).toBeVisible();
  await expect(dialog.locator('[data-icon-name="wallet-cards"]')).toBeVisible();
  await expect(dialog.locator('[data-icon-name="moon"]')).toBeVisible();
  await expect(dialog.locator('[data-icon-name="sun"]')).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: /^复制 <MmIcon name=".+" \/>$/ }),
  ).toHaveCount(138);

  const calendarCopy = dialog
    .locator('[data-icon-name="calendar"]')
    .getByRole("button");
  await expect(calendarCopy).toHaveAttribute(
    "aria-label",
    '复制 <MmIcon name="calendar" />',
  );
  await calendarCopy.click();
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe('<MmIcon name="calendar" />');
  await expect(calendarCopy.getByText("已复制")).toBeVisible();

  await dialog.getByRole("button", { name: "关闭预览" }).click();
  await expect(overlay).toBeHidden();
});
