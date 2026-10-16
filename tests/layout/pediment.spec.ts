import { test, expect } from '@playwright/test';

test.describe('Vault Pediment: Navigation & Sheet Drawer', () => {

  test('verifies apex home link and interactive sheet reveal', async ({ page }, testInfo) => {
    const isMobile = testInfo.project.name === 'mobile';
    await page.goto('/script/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const apexAnchor = page.locator('.apex-divider-anchor');
    await expect(apexAnchor).toBeVisible();
    await expect(apexAnchor).toHaveAttribute('href', '/');

    const sheet = page.locator('.folded-sheet');
    await expect(sheet).toHaveCSS('opacity', '0');

    const trigger = page.locator('.drawer-trigger');
    if (isMobile) {
      await trigger.focus();
    } else {
      await trigger.hover();
    }

    await expect(sheet).toHaveCSS('opacity', '1');

    const corners = page.locator('.corner-vector');
    if (isMobile) {
      await expect(corners.first()).toBeHidden();
    } else {
      await expect(corners).toHaveCount(2);
      await expect(corners.first()).toBeVisible();
    }
  });

});