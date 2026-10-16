import { test, expect } from '@playwright/test';
import * as path from 'path';
import { assertNoHorizontalOverflow, assertViewportBottomDocked, assertGhostState } from '../helpers/assertions';

const outDir = path.join('tests', 'artifacts', 'output');

test.describe('Objects Facet: Specimen Architecture', () => {

  test('renders solitary artifact plate, metadata, and docked drain', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/object/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const accession = page.locator('.specimen-accession');
    await expect(accession).toBeVisible();
    await expect(accession).toContainText('OBJECT');

    const slide = page.locator('.carousel-slide img, .plate-artwork img').first();
    await expect(slide).toBeVisible();

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertGhostState(page, '.drain-link', 0.25);
    await assertNoHorizontalOverflow(page);

    await page.screenshot({ path: path.join(outDir, `objects-specimen-${vp}.png`), fullPage: true });
  });

});