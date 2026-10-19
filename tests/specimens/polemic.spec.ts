import { test, expect } from '@playwright/test';
import * as path from 'path';
import { assertNoHorizontalOverflow, assertViewportBottomDocked } from '../helpers/assertions';

const outDir = path.join('tests', 'artifacts', 'output');

test.describe('Polemic Suite 1: Structural DOM & Layout', () => {

  test('short polemic mounts .plate-polemic and tract text', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-polemic-short/', { waitUntil: 'networkidle' });

    const plate = page.locator('.specimen-plate.plate-polemic');
    await expect(plate).toBeVisible();
    await expect(plate.locator('p').first()).toContainText('Generative AI reduces the cost of producing content');

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: path.join(outDir, `polemic-short-${vp}.png`), fullPage: true });
  });

  test('long polemic mounts headings, paragraphs, and lists without overflow', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-polemic-long/', { waitUntil: 'networkidle' });

    const plate = page.locator('.specimen-plate.plate-polemic');
    await expect(plate).toBeVisible();
    await expect(plate.locator('h1, h2').first()).toBeVisible();
    expect(await plate.locator('p').count()).toBeGreaterThan(10);
    expect(await plate.locator('li').count()).toBeGreaterThan(5);

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: path.join(outDir, `polemic-long-${vp}.png`), fullPage: true });
  });

  test('footnotes polemic mounts inline sup refs and bottom backrefs', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-polemic-footnotes/', { waitUntil: 'networkidle' });

    const plate = page.locator('.specimen-plate.plate-polemic');
    await expect(plate.locator('sup[id^="fnref:"] a.footnote-ref').first()).toBeVisible();
    await expect(plate.locator('.footnotes ol li[id^="fn:"]').first()).toBeVisible();
    await expect(plate.locator('.footnotes a.footnote-backref').first()).toBeVisible();

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: path.join(outDir, `polemic-footnotes-${vp}.png`), fullPage: true });
  });

  test('image polemic mounts figure, image src, alt text, and figcaption', async ({ page }, testInfo) => {
    const vp = testInfo.project.name;
    await page.goto('/script/specimen-polemic-image/', { waitUntil: 'networkidle' });

    const figure = page.locator('.specimen-plate.plate-polemic figure');
    await expect(figure).toBeVisible();

    const img = figure.locator('img');
    await expect(img).toHaveAttribute('src', /Gemini-generated-joke-contains-AI-tagging\.jpg/);
    expect((await img.getAttribute('alt'))?.trim().length).toBeGreaterThan(10);
    expect((await figure.locator('figcaption').textContent())?.trim().length).toBeGreaterThan(10);

    await assertViewportBottomDocked(page, '.vault-drain');
    await assertNoHorizontalOverflow(page);
    await page.screenshot({ path: path.join(outDir, `polemic-image-${vp}.png`), fullPage: true });
  });

});

test.describe('Polemic Suite 2: Visual & Chromatic Contracts', () => {

  test('preserves warm ivory vault pediment outside the dark plate', async ({ page }) => {
    await page.goto('/script/specimen-polemic-short/', { waitUntil: 'networkidle' });
    const pedimentBg = await page.locator('.vault-pediment').evaluate(el => window.getComputedStyle(el).backgroundColor);
    expect(pedimentBg).toBe('rgb(245, 244, 240)'); // #F5F4F0
  });

  test('renders crushed burgundy plate surface (#1F1516) with lateral borders stripped', async ({ page }) => {
    await page.goto('/script/specimen-polemic-short/', { waitUntil: 'networkidle' });
    const styles = await page.locator('.specimen-plate.plate-polemic').evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { bg: cs.backgroundColor, bl: cs.borderLeftWidth, br: cs.borderRightWidth };
    });
    expect(styles.bg).toBe('rgb(31, 21, 22)');
    expect(styles.bl).toBe('0px');
    expect(styles.br).toBe('0px');
  });

  test('renders cinnabar red (#D32F2F) on headings', async ({ page }) => {
    await page.goto('/script/specimen-polemic-long/', { waitUntil: 'networkidle' });
    const color = await page.locator('.plate-polemic :is(h1, h2, h3)').first().evaluate(el => window.getComputedStyle(el).color);
    expect(color).toBe('rgb(211, 47, 47)');
  });

  test('renders cinnabar red (#D32F2F) hairline frame on embedded figures/images', async ({ page }) => {
    await page.goto('/script/specimen-polemic-image/', { waitUntil: 'networkidle' });
    const borderColor = await page.locator('.plate-polemic img').evaluate(el => {
      const imgBorder = window.getComputedStyle(el).borderTopColor;
      const figBorder = el.closest('figure') ? window.getComputedStyle(el.closest('figure')!).borderTopColor : '';
      return imgBorder === 'rgb(211, 47, 47)' ? imgBorder : figBorder;
    });
    expect(borderColor).toBe('rgb(211, 47, 47)');
  });

});

test.describe('Polemic Suite 3: Typographic Contracts', () => {

  test('applies Crimson Pro and softened ivory to body paragraphs', async ({ page }) => {
    await page.goto('/script/specimen-polemic-short/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const pStyles = await page.locator('.plate-polemic p').first().evaluate(el => {
      const cs = window.getComputedStyle(el);
      return { font: cs.fontFamily, color: cs.color };
    });
    expect(pStyles.font).toContain('Crimson Pro');
    expect(pStyles.color).toBe('rgba(245, 244, 240, 0.88)');
  });

  test('applies IBM Plex Sans contrast font to polemic headings', async ({ page }) => {
    await page.goto('/script/specimen-polemic-long/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const hFont = await page.locator('.plate-polemic :is(h1, h2, h3)').first().evaluate(el => window.getComputedStyle(el).fontFamily);
    expect(hFont).toContain('IBM Plex Sans');
  });

});