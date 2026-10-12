import { expect, test } from '@playwright/test';

for (const [demo, readySelector] of [
  ['docs-demos-readonly', 'h4'],
  ['docs-demos-minPreview', 'h4'],
  ['docs-demos-history-custom', 'h3'],
  ['docs-demos-gradient-text-playground', '.ant-card'],
  ['plugins-page-html-tomd', 'h1'],
  ['docs-demos-task-running', 'h2'],
  ['docs-demos-ChatBootPage-index', '.chat-boot-demo'],
  ['docs-demos-ChatFlowContainer-index', '.chat-flow-demo'],
]) {
  test(`${demo} 在窄屏中不产生页面横向滚动`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(`/~demos/${demo}`);
    await expect(page.locator(readySelector).first()).toBeAttached();
    await expect
      .poll(() =>
        page.locator('body').evaluate((body) => ({
          width: body.scrollWidth,
          viewport: document.documentElement.clientWidth,
        })),
      )
      .toEqual({ width: 320, viewport: 320 });
  });
}

test('窄屏渐变文字配置的文本输入完整可用', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/~demos/docs-demos-gradient-text-playground');
  const input = page.getByRole('textbox');
  await expect(input).toBeVisible();
  const bounds = await input.boundingBox();
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
  expect(bounds!.width).toBeGreaterThan(100);
  await input.fill('窄屏输入测试');
  await expect(page.getByText('窄屏输入测试', { exact: true })).toBeVisible();
});

test('窄屏编辑器对比按行展示，正文有足够编辑宽度', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/~demos/docs-demos-minPreview');
  const editor = page.locator('[data-slate-editor]').last();
  await expect(editor).toBeVisible();
  const bounds = await editor.boundingBox();
  expect(bounds!.width).toBeGreaterThan(200);
  expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(320);
});

test('窄屏静态任务状态没有被最小列宽裁切', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/~demos/docs-demos-task-running');
  await expect(page.locator('h4').first()).toBeVisible();
  const rightEdges = await page
    .locator('h4')
    .evaluateAll((headings) =>
      headings.map((heading) => heading.getBoundingClientRect().right),
    );
  expect(Math.max(...rightEdges)).toBeLessThanOrEqual(320);
});

test('欢迎页首次加载保留标题和输入框，推荐卡从顶部阅读', async ({ page }) => {
  await page.setViewportSize({ width: 534, height: 640 });
  await page.goto('/~demos/docs-demos-ChatBootPage-index');
  const welcome = page.locator('.chat-boot-demo__welcome');
  await expect(welcome).toBeVisible();
  await expect(page.getByText('欢迎使用', { exact: false })).toBeInViewport();
  await expect(page.getByTestId('markdown-input-field')).toBeInViewport();
  expect(
    await page
      .getByTestId('markdown-input-field')
      .evaluate((element) => element.clientHeight),
  ).toBeGreaterThanOrEqual(100);
  expect(
    await page
      .locator('.chat-boot-demo__tabs')
      .evaluate((element) => element.clientHeight),
  ).toBeGreaterThanOrEqual(32);
  await expect
    .poll(() => welcome.evaluate((element) => element.scrollTop))
    .toBe(0);
});

test('相同正文 demo 空闲期间保留用户编辑，点击按钮才重置', async ({ page }) => {
  await page.goto('/~demos/docs-demos-same-render');
  const editor = page.locator('[data-slate-editor]');
  await expect(editor).toBeVisible();
  await editor.click();
  await page.keyboard.press('ControlOrMeta+End');
  await page.keyboard.type('DEMO_PRESERVE_EDIT');
  await expect(editor).toContainText('DEMO_PRESERVE_EDIT');
  // Wait past the former 1 second reset interval.
  await page.waitForTimeout(1200);
  await expect(editor).toContainText('DEMO_PRESERVE_EDIT');
  await page.getByRole('button', { name: '重新应用相同正文' }).click();
  await expect(editor).not.toContainText('DEMO_PRESERVE_EDIT');
});
