import { expect, test } from '@playwright/test';

test('首页首屏保持轻量，滚动后仍可编辑和切换演示', async ({ page }) => {
  await page.goto('/');
  const home = page.locator('.agentic-home-fullscreen');
  await expect(home.getByRole('button', { name: /开始使用/ })).toBeVisible();

  // 屏外编辑器和图表不应在首屏初始化；活动轮播允许使用一个 Canvas。
  await expect(home.locator('[contenteditable="true"]')).toHaveCount(0);
  expect(await home.locator('canvas').count()).toBeLessThanOrEqual(1);

  const support = home.locator('[data-home-section="support"]');
  await support.scrollIntoViewIfNeeded();
  const input = support.getByRole('textbox');
  await expect(input).toBeVisible();
  await input.pressSequentially('首页性能测试');
  await expect(input).toContainText('首页性能测试');

  const enhance = home.locator('[data-home-section="enhance"]');
  await enhance.scrollIntoViewIfNeeded();
  await enhance.getByText('Markdown 渲染规范', { exact: true }).click();
  await expect(
    enhance.getByRole('heading', { name: 'Markdown 富文本示例', exact: true }),
  ).toBeVisible();
});
