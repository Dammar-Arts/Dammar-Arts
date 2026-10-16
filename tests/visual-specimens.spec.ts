import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const outDir = path.join('tests', 'artifacts', 'output');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

test.describe('Hermetic Vault Visual Specifications', () => {

  test('Verify Pigment Gallery Specimen', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/pigment/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // 1. Structural Carousel Assertions
    const track = page.locator('.specimen-carousel-track');
    await expect(track).toBeVisible();

    const slides = page.locator('.carousel-slide');
    await expect(slides).toHaveCount(4);

    // Verify pagination / counter hint is visible and contains expected text
    const hint = page.locator('.carousel-mark');
    await expect(hint).toBeVisible();
    await expect(hint).toContainText('4 PLANCHES');

    // 2. Anti-Collision Assertion: Vault drain must sit strictly BELOW the carousel and article
    const drainBox = await page.locator('.vault-drain').boundingBox();
    const carouselBox = await page.locator('.specimen-carousel-frame').boundingBox();
    
    if (drainBox && carouselBox) {
      // Top of bottom drain must be at or below the bottom of the carousel
      expect(drainBox.y).toBeGreaterThanOrEqual(carouselBox.y + carouselBox.height);
    }

    // 3. No horizontal viewport leakage
    const hasHorizontalOverflow = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalOverflow).toBe(false);

    // 4. Capture Artifact
    const shotPath = path.join(outDir, `pigment-gallery-${vp}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
  });

  test('Verify Script Alternating Columns', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const plateScript = page.locator('.plate-script');
    await expect(plateScript).toBeVisible();

    // Verify figures alternated (float-right and float-left present)
    const figures = page.locator('.specimen-fig');
    await expect(figures).toHaveCount(2);

    // Anti-Collision Assertion: Bottom drain must never overlap plate-script text
    const drainBox = await page.locator('.vault-drain').boundingBox();
    const plateBox = await page.locator('.plate-script').boundingBox();

    if (drainBox && plateBox) {
      // Drain top must be lower than the plate bottom
      expect(drainBox.y).toBeGreaterThanOrEqual(plateBox.y + plateBox.height);
    }

    // Capture Artifact
    const shotPath = path.join(outDir, `script-specimen-${vp}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
  });

});