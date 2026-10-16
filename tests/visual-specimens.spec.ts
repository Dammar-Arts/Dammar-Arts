import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const outDir = path.join('tests', 'artifacts', 'output');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

test.describe('Hermetic Vault Visual Specifications', () => {
  test('Capture Pigment Gallery Specimen', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/pigment-bundle/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const track = page.locator('.specimen-carousel-track');
    await expect(track).toBeVisible();

    const slides = page.locator('.carousel-slide');
    await expect(slides).toHaveCount(4);

    const shotPath = path.join(outDir, `pigment-gallery-${vp}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
  });

  test('Capture Script Alternating Columns', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script-bundle/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const plateScript = page.locator('.plate-script, .specimen-plate');
    await expect(plateScript).toBeVisible();

    const shotPath = path.join(outDir, `script-specimen-${vp}.png`);
    await page.screenshot({ path: shotPath, fullPage: true });
  });
});
