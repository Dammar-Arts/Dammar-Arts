import { test } from '@playwright/test';
import {
  assertGhostState,
  assertDockedSolidState,
  assertViewportBottomDocked
} from '../helpers/assertions';

test.describe('Vault Drain: Viewport Docking & Opacity States', () => {

  test('verifies sticky dock and ghost-to-solid transition on script specimen', async ({ page }) => {
    await page.goto('/script/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertGhostState(page, '.drain-link', 0.25);
    await assertDockedSolidState(page, '.drain-link', 0.8);
  });

});