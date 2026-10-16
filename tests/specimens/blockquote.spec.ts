import { test, expect } from '@playwright/test';
import { assertNoHorizontalOverflow } from '../helpers/assertions';

test.describe('Specimen Typography: Chevron Blockquote', () => {

  test('renders markdown quote with open hairline amber chevron marker', async ({ page }) => {
    await page.goto('/script/specimen-1/', { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const quote = page.locator('.specimen-plate blockquote');
    await expect(quote).toBeVisible();

    // 1. Strip default browser/generic blockquote border
    const borderLeftStyle = await quote.evaluate(el => window.getComputedStyle(el).borderLeftStyle);
    expect(borderLeftStyle).toBe('none');

    // 2. Check amber chevron pseudo-element styling
    const beforeStyles = await quote.evaluate(el => {
      const style = window.getComputedStyle(el, '::before');
      return {
        content: style.content,
        borderTopColor: style.borderTopColor,
        borderRightColor: style.borderRightColor,
        transform: style.transform
      };
    });

    expect(beforeStyles.content).not.toBe('none');
    // rgba(194, 142, 66...) or rgb(194, 142, 66)
    expect(beforeStyles.borderTopColor).toContain('194, 142, 66');
    expect(beforeStyles.borderRightColor).toContain('194, 142, 66');

    await assertNoHorizontalOverflow(page);
  });

});