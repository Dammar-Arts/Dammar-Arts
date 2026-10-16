import { test, expect } from '@playwright/test';
import * as path from 'path';
import { assertNoHorizontalOverflow, assertViewportBottomDocked } from '../helpers/assertions';

const outDir = path.join('tests', 'artifacts', 'output');

test.describe('Pigment Specimen: Carousel Architecture', () => {

  test('renders 4-slide carousel and viewport drain', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/pigment/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const track = page.locator('.specimen-carousel-track');
    await expect(track).toBeVisible();

    const slides = page.locator('.carousel-slide');
    await expect(slides).toHaveCount(4);

    const mark = page.locator('.carousel-mark');
    await expect(mark).toBeVisible();
    await expect(mark).toContainText('4 PLANCHES');

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);

    await page.screenshot({ path: path.join(outDir, `pigment-gallery-${vp}.png`), fullPage: true });
  });

});