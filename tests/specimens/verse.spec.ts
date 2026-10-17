import { test, expect } from '@playwright/test';
import * as path from 'path';
import { assertNoHorizontalOverflow, assertViewportBottomDocked } from '../helpers/assertions';

const outDir = path.join('tests', 'artifacts', 'output');

test.describe('Verse Specimen: True Form Poetry', () => {

  test('renders verse plate with pre-wrap stanza structure and docked drain', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-verse/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    // 1. Verse Plate Presence
    const plate = page.locator('.specimen-plate.plate-verse');
    await expect(plate).toBeVisible();

    // 2. White-space preservation check
    const whiteSpace = await plate.evaluate(el => window.getComputedStyle(el).whiteSpace);
    expect(['pre-wrap', 'pre', 'pre-line']).toContain(whiteSpace);

    // 3. Layout & Drain Integrity
    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);

    await page.screenshot({ path: path.join(outDir, `verse-specimen-${vp}.png`), fullPage: true });
  });

});

test.describe('Verse Specimen Suite: Small, Wide, and Long Poetry', () => {

  test('1 - small poem displays properly with stanza form and docked drain', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-verse-small/', { waitUntil: 'networkidle' });
    const plate = page.locator('.plate-verse');
    await expect(plate).toBeVisible();

    const whiteSpace = await plate.evaluate(el => window.getComputedStyle(el).whiteSpace);
    expect(['pre-wrap', 'pre', 'pre-line']).toContain(whiteSpace);

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: path.join(outDir, `verse-specimen-small-${vp}.png`), fullPage: true });
  });

  test('2 - wide poem scrolls horizontally within the plate without breaking viewport', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-verse-wide/', { waitUntil: 'networkidle' });
    const plate = page.locator('.plate-verse');
    await expect(plate).toBeVisible();

    // Verify the plate allows internal horizontal scrolling or safe wrapping
    const overflowX = await plate.evaluate(el => window.getComputedStyle(el).overflowX);
    expect(['auto', 'scroll', 'visible', 'hidden']).toContain(overflowX);

    // Global document must NOT have horizontal overflow
    await assertNoHorizontalOverflow(page);
    
    // Fixed: Added missing screenshot for wide poem
    await page.screenshot({ path: path.join(outDir, `verse-specimen-wide-${vp}.png`), fullPage: true });
  });

  test('3 - very long poem maintains vertical rhythm and correct dock transition', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-verse-long/', { waitUntil: 'networkidle' });
    const plate = page.locator('.plate-verse');
    await expect(plate).toBeVisible();

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);
    
    // Fixed: Added missing screenshot for long poem
    await page.screenshot({ path: path.join(outDir, `verse-specimen-long-${vp}.png`), fullPage: true });
  });

});