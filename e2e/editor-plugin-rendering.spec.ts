import { expect, test } from '@playwright/test';

test('嵌套 Markdown 预览保持完整，代码编辑器仅为可见源码挂载', async ({
  page,
}) => {
  await page.goto('/~demos/plugin-group-code-local-preview');
  const markdown = page.locator(
    '[data-testid="code-container"][data-lang="markdown"]',
  );
  const formula = markdown.getByRole('heading', {
    name: '数学公式（KaTeX）',
    exact: true,
  });
  const activeLanguages = () =>
    page
      .locator('[data-testid="ace-editor-container"]')
      .evaluateAll((hosts) =>
        hosts
          .map((host) =>
            host
              .closest('[data-testid="code-container"]')
              ?.getAttribute('data-lang'),
          )
          .sort(),
      );
  await expect(formula).toBeVisible();
  await expect(markdown.getByRole('table')).toHaveCount(1);
  await expect.poll(activeLanguages).toEqual(['html', 'javascript']);

  await markdown.getByText('代码', { exact: true }).click();
  await expect(formula).toHaveCount(0);
  await expect.poll(activeLanguages).toEqual(['html', 'markdown']);
  await markdown.getByText('预览', { exact: true }).click();
  await expect(formula).toBeVisible();
  await expect.poll(activeLanguages).toEqual(['html', 'javascript']);

  for (const language of ['html', 'javascript']) {
    await page
      .locator(`[data-testid="code-container"][data-lang="${language}"]`)
      .getByRole('button', { name: '展开/收起', exact: true })
      .click();
  }
  await expect.poll(activeLanguages).toEqual([]);
  await expect(formula).toBeVisible();
  await expect(markdown.getByRole('table')).toHaveCount(1);
});

test('窄屏插件预览不撑宽页面', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/~demos/plugin-group-code-local-preview');
  await expect(
    page.getByRole('heading', { name: '数学公式（KaTeX）', exact: true }),
  ).toBeVisible();
  const widths = await page.evaluate(() => ({
    page: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
    blocks: [
      ...document.querySelectorAll('[data-testid="code-container"]'),
    ].map((block) => block.getBoundingClientRect().right),
  }));
  expect(widths.page).toBe(widths.viewport);
  for (const right of widths.blocks) expect(right).toBeLessThanOrEqual(390);
});
