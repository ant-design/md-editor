import { expect, test } from '@playwright/test';

const demoId = 'docs-demos-suggestion-list-basic';

test('文档预览只显示示例，站点导航保留在外层', async ({ page }) => {
  await page.goto('/components/SuggestionList');
  const demo = page.locator(`[data-demo-id="${demoId}"]`);
  await demo.scrollIntoViewIfNeeded();
  const frame = page.frameLocator(`iframe[data-demo-frame="${demoId}"]`);

  await expect(frame.getByText('💬 建议列表组件 SuggestionList')).toBeVisible();
  await expect(frame.getByRole('banner')).toHaveCount(0);
  await expect(frame.locator('.rp-nav, .rp-sidebar, .rp-doc')).toHaveCount(0);
  await expect(page.getByRole('banner')).toHaveCount(1);
  await expect(
    page.getByRole('heading', { name: '代码演示', exact: true }),
  ).toBeVisible();

  await demo.getByRole('button', { name: 'Expand Code' }).click();
  const collapse = demo.getByRole('button', { name: 'Collapse Code' });
  await expect(collapse).toHaveAttribute('aria-expanded', 'true');
  await expect(
    demo.getByRole('link', { name: '在新窗口打开该示例（源码见 docs/demos）' }),
  ).toHaveAttribute('href', `/~demos/${demoId}`);
  await collapse.click();
  await expect(demo.locator('.demo-card__source')).toHaveCount(0);
});

test('独立打开示例保留交互且不渲染站点顶栏', async ({ page }) => {
  await page.goto(`/~demos/${demoId}`);
  await expect(page.getByText('💬 建议列表组件 SuggestionList')).toBeVisible();
  await expect(page.getByRole('banner')).toHaveCount(0);
  await expect(page.locator('.rp-nav, .rp-sidebar, .rp-doc')).toHaveCount(0);

  const suggestion = '脚注与引用在 Bubble / Markdown 里怎么配？';
  await page
    .getByRole('button', { name: `选择建议：${suggestion}` })
    .first()
    .click();
  await expect(page.getByRole('alert')).toContainText(suggestion);
});
