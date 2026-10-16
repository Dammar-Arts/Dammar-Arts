import { Page, expect } from '@playwright/test';

export async function assertGhostState(page: Page, selector: string, maxOpacity = 0.25) {
  const el = page.locator(selector);
  await expect(el).toBeVisible();
  const opacity = await el.evaluate((node) => parseFloat(window.getComputedStyle(node).opacity));
  expect(opacity).toBeLessThanOrEqual(maxOpacity);
}

export async function assertDockedSolidState(page: Page, selector: string, minOpacity = 0.8) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(200);
  const el = page.locator(selector);
  const opacity = await el.evaluate((node) => parseFloat(window.getComputedStyle(node).opacity));
  expect(opacity).toBeGreaterThanOrEqual(minOpacity);
}

export async function assertNoHorizontalOverflow(page: Page) {
  const hasOverflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth > document.documentElement.clientWidth;
  });
  expect(hasOverflow).toBe(false);
}

export async function assertViewportBottomDocked(page: Page, selector: string) {
  const el = page.locator(selector);
  await expect(el).toBeVisible();
  const box = await el.boundingBox();
  const viewport = page.viewportSize();
  if (box && viewport) {
    expect(box.y + box.height).toBeGreaterThanOrEqual(viewport.height - 2);
  }
}