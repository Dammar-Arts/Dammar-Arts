import { test, expect } from '@playwright/test';
import * as path from 'path';
import { assertNoHorizontalOverflow } from '../helpers/assertions';

const outDir = path.join('tests', 'artifacts', 'output');

test.describe('Script Specimen: Alternating Plate Columns', () => {

  test('renders reading column with alternating specimen figures', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const plate = page.locator('.plate-script');
    await expect(plate).toBeVisible();

    const figures = page.locator('.specimen-fig');
    await expect(figures).toHaveCount(2);

    await assertNoHorizontalOverflow(page);

    await page.screenshot({ path: path.join(outDir, `script-specimen-${vp}.png`), fullPage: true });
  });

});