import { test, expect } from '@playwright/test';
import * as path from 'path';
import { assertNoHorizontalOverflow, assertViewportBottomDocked, assertGhostState } from '../helpers/assertions';

const outDir = path.join('tests', 'artifacts', 'output');

test.describe('Dossier Specimen: Archival Vault Aperture', () => {

  test('mounts recessed PDF aperture, extraction console, and docked drain', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-dossier/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // 1. Aperture Stage Presence
    const aperture = page.locator('.specimen-aperture');
    await expect(aperture).toBeVisible();

    // 2. Embedded Document Object
    const docObject = aperture.locator('object[type="application/pdf"]');
    await expect(docObject).toBeVisible();
    await expect(docObject).toHaveAttribute('data', /.*\.pdf(#.*)?$/);

    // 3. Extraction / Console Trigger
    const extractLink = page.locator('.aperture-extract-link');
    await expect(extractLink).toBeVisible();
    await expect(extractLink).toHaveAttribute('href', /.*\.pdf$/);

    // 4. Viewport Bounding (Aperture must be viewport-clamped, not infinite scroll)
    const box = await aperture.boundingBox();
    const viewport = page.viewportSize();
    if (box && viewport) {
      expect(box.height).toBeLessThanOrEqual(viewport.height * 0.85);
      expect(box.height).toBeGreaterThanOrEqual(300);
    }

    // 5. Layout & Drain Integrity
    await assertViewportBottomDocked(page, '.vault-drain');
    await assertGhostState(page, '.drain-link', 0.25);
    await assertNoHorizontalOverflow(page);

    await page.screenshot({ path: path.join(outDir, `dossier-aperture-${vp}.png`), fullPage: true });
  });

});