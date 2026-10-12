import { expect, test } from '@playwright/test';

test('首页在 JavaScript 执行前已具备完整首屏布局', async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    javaScriptEnabled: false,
    viewport: { width: 1440, height: 960 },
  });
  const page = await context.newPage();
  try {
    await page.goto('/');
    const styles = page.locator('head style[data-styled]');
    await expect(styles).toHaveCount(1);
    await expect(styles).toHaveAttribute(
      'data-styled-version',
      /\d+\.\d+\.\d+/,
    );
    expect(await styles.textContent()).toContain('/*!sc*/');

    const button = page.getByRole('button', { name: '开始使用', exact: true });
    await expect(button).toBeVisible();
    await expect(button).toHaveCSS('height', '48px');
    const buttonBox = await button.boundingBox();
    expect(Math.abs(buttonBox!.x + buttonBox!.width / 2 - 720)).toBeLessThan(2);

    const card = page.locator('[data-carousel-card="intro"]');
    await expect(card).toHaveCSS('position', 'absolute');
    await expect(
      card.getByText('智能增效，精准可控', { exact: true }),
    ).toBeVisible();
    const cardBox = await card.boundingBox();
    expect(cardBox?.width).toBeCloseTo(406, 0);
    expect(cardBox?.height).toBeCloseTo(660, 0);
  } finally {
    await context.close();
  }
});

test('无后缀静态页面自带对应 HTML，不借用首页内容', async ({ request }) => {
  for (const route of [
    '/components/SuggestionList/index.html',
    '/~demos/docs-demos-suggestion-list-basic/index.html',
  ]) {
    const response = await request.get(route);
    expect(response.ok()).toBe(true);
    const html = await response.text();
    expect(html).not.toContain('agentic-home-fullscreen');
    if (route.startsWith('/components/')) {
      expect(html).toContain('SuggestionList 追问建议');
    } else {
      expect(html).not.toContain('rp-nav');
    }
  }
});
