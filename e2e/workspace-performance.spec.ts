import { expect, test } from '@playwright/test';

test('只读文件预览使用轻量正文，HTML 填满面板剩余高度', async ({ page }) => {
  await page.goto('/~demos/docs-demos-workspace-file-demo');
  await page
    .getByRole('button', { name: '文件：API文档-文本.md', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'API 文档（示例）' }),
  ).toBeVisible();
  await expect(page.locator('[data-slate-editor]')).toHaveCount(0);

  await page.getByRole('button', { name: '返回文件列表', exact: true }).click();
  await page
    .getByRole('button', { name: '文件：hello.html', exact: true })
    .click();
  const preview = page.locator('.ant-workspace-file-preview');
  const iframe = preview.locator('iframe');
  await expect(iframe).toBeVisible();
  await expect(
    page
      .frameLocator('.ant-workspace-file-preview iframe')
      .getByRole('heading', { name: '你好，HTML！' }),
  ).toBeVisible();
  await expect
    .poll(() => iframe.evaluate((element) => element.clientHeight))
    .toBeGreaterThan(300);
  expect(
    await preview.evaluate(
      (element) => element.scrollHeight - element.clientHeight,
    ),
  ).toBeLessThanOrEqual(1);

  await preview.getByText('代码', { exact: true }).click();
  await expect(iframe).toHaveCount(0);
  await expect(preview.locator('code')).toContainText(/<!doctype html>/i);
  await expect(page.locator('[data-slate-editor]')).toHaveCount(0);
});

test('窄屏标签在自身区域滚动，搜索建议支持键盘操作', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/~demos/docs-demos-workspace-demo');
  const workspace = page.getByTestId('workspace');
  await expect(workspace).toBeVisible();
  expect(
    await workspace.evaluate(
      (element) => element.scrollWidth - element.clientWidth,
    ),
  ).toBeLessThanOrEqual(1);
  expect(
    await workspace.evaluate(
      (element) => element.scrollHeight - element.clientHeight,
    ),
  ).toBeLessThanOrEqual(1);
  await workspace.getByText('浏览器', { exact: true }).click();
  await page
    .getByRole('button', { name: '搜索 LLM 技术趋势 共2个结果', exact: true })
    .press('Enter');
  await expect(
    page.getByRole('link', { name: 'LLM 趋势摘要（示例）' }),
  ).toBeVisible();
});

test('减少动态模式禁用标签计数动画', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/~demos/docs-demos-workspace-demo');
  const digit = page.locator('.ant-workspace-tab-count-digit').first();
  await expect(digit).toBeVisible();
  await expect(digit).toHaveCSS('animation-name', 'none');
});

test('窄屏 HTML 操作栏换行后保留标题和预览空间', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto('/~demos/docs-demos-workspace-realtime-demo');
  await page.getByText('HTML 预览', { exact: true }).click();
  const header = page.locator('.ant-workspace-realtime-header');
  const title = header.locator('.ant-workspace-realtime-header-left');
  await expect(title).toContainText('创建 HTML 文件');
  expect(
    await title.evaluate((element) => element.clientWidth),
  ).toBeGreaterThan(100);
  expect(await header.evaluate((element) => element.clientHeight)).toBeLessThan(
    130,
  );
  await expect(
    page
      .frameLocator('.ant-workspace-html-preview-iframe')
      .getByRole('heading', { name: '实时 HTML 预览演示' }),
  ).toBeVisible();
  expect(
    await page
      .locator('.ant-workspace-html-preview-iframe')
      .evaluate((element) => element.clientHeight),
  ).toBeGreaterThan(300);
});

test('Shell 演示的流式更新不丢首行或重复末行', async ({ page }) => {
  await page.goto('/~demos/docs-demos-workspace-realtime-demo');
  const output = page.locator('.ant-workspace-realtime-content code');
  await expect(output).toContainText('webpack compiled successfully');
  const text = await output.textContent();
  expect(text).toContain('$ npm install @ant-design/agentic-ui');
  expect(text?.match(/webpack compiled successfully/g)).toHaveLength(1);
  await expect(page.locator('[data-slate-editor]')).toHaveCount(0);
});

test('流式正文更新不会打断用户向上阅读', async ({ page }) => {
  await page.goto('/~demos/docs-demos-workspace-demo');
  await page.getByRole('button', { name: '重新演示', exact: true }).click();
  const content = page.locator('.ant-workspace-realtime-content');
  await expect
    .poll(() =>
      content.evaluate(
        (element) => element.scrollHeight - element.clientHeight,
      ),
    )
    .toBeGreaterThan(100);
  await expect
    .poll(() => content.evaluate((element) => element.scrollTop))
    .toBeGreaterThan(50);
  await content.hover();
  await page.mouse.wheel(0, -2000);
  await expect
    .poll(() => content.evaluate((element) => element.scrollTop))
    .toBe(0);
  const initialLength = (await content.textContent())?.length ?? 0;
  await expect
    .poll(async () => (await content.textContent())?.length ?? 0)
    .toBeGreaterThan(initialLength + 200);
  expect(await content.evaluate((element) => element.scrollTop)).toBe(0);
});

test('演示首屏展示完整概览，文件入口可操作', async ({ page }) => {
  await page.goto('/~demos/docs-demos-workspace-demo');
  await expect(
    page.getByRole('heading', { name: '从资料检索，到成果交付' }),
  ).toBeVisible();
  await page.getByRole('button', { name: '查看交付文件', exact: true }).click();
  await page
    .getByRole('button', { name: '文件：调研简报.md', exact: true })
    .click();
  await expect(
    page.getByRole('heading', { name: 'Agentic UI 调研简报', exact: true }),
  ).toBeVisible();
  await expect(page.locator('[data-slate-editor]')).toHaveCount(0);
});

test('实时演示可以重播并下载实际 HTML 文件', async ({ page }) => {
  await page.goto('/~demos/docs-demos-workspace-realtime-demo');
  await page.getByRole('button', { name: '重新演示', exact: true }).click();
  await page.getByText('HTML 预览', { exact: true }).click();
  await expect(
    page.getByRole('button', { name: '下载 HTML', exact: true }),
  ).toBeEnabled();
  const downloadEvent = page.waitForEvent('download');
  await page.getByRole('button', { name: '下载 HTML', exact: true }).click();
  expect((await downloadEvent).suggestedFilename()).toBe('report.html');
});

test('文档页为工作台保留完整预览高度和宽度', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/demos-pages/workspace');
  const frame = page.locator(
    'iframe[data-demo-frame="docs-demos-workspace-demo"]',
  );
  await expect(frame).toBeVisible();
  await expect(
    page.locator('[data-demo-id="docs-demos-workspace-demo"]'),
  ).toHaveCSS('border-top-width', '1px');
  await expect(
    page.locator('[data-demo-id="docs-demos-workspace-demo"]'),
  ).toHaveCSS('border-top-style', 'solid');
  expect(
    await frame.evaluate((element) => element.clientWidth),
  ).toBeGreaterThan(750);
  expect(await frame.evaluate((element) => element.clientHeight)).toBe(560);
  await expect(
    page
      .frameLocator('iframe[data-demo-frame="docs-demos-workspace-demo"]')
      .getByRole('heading', { name: '从资料检索，到成果交付' }),
  ).toBeVisible();
  await expect
    .poll(() =>
      page
        .frameLocator('iframe[data-demo-frame="docs-demos-workspace-demo"]')
        .locator('body')
        .evaluate((element) => element.scrollHeight),
    )
    .toBeLessThanOrEqual(560);
});

test('自定义处理任务重置后停止更新，设置输入保持焦点', async ({ page }) => {
  await page.goto('/~demos/docs-demos-workspace-custom-demo');
  await page.getByText('处理任务', { exact: true }).click();
  await page.getByRole('button', { name: '开始处理', exact: true }).click();
  await expect(page.getByText(/已处理 [1-9] \/ 10 份文档/)).toBeVisible();
  await page.getByRole('button', { name: /重\s*置/, exact: true }).click();
  await expect(page.getByText('准备就绪', { exact: true })).toBeVisible();
  await expect(
    page.getByRole('button', { name: /重\s*置/, exact: true }),
  ).toBeDisabled();
  // Wait past two former update intervals and ensure cancellation sticks.
  await page.waitForTimeout(600);
  await expect(page.getByText('准备就绪', { exact: true })).toBeVisible();

  await page.goto('/~demos/docs-demos-workspace-advanced-demo');
  await page.getByText('设置', { exact: true }).click();
  const title = page.getByLabel('工作台标题', { exact: true });
  await title.fill('新版发布工作台');
  await expect(title).toBeFocused();
  await title.pressSequentially('测试');
  await expect(title).toHaveValue('新版发布工作台测试');
  await page.getByRole('button', { name: '重新演示构建', exact: true }).click();
  const output = page.locator('.ant-workspace-realtime-content code');
  await expect(output).toContainText('Build completed in 1.2s.');
  const text = await output.textContent();
  expect(text?.match(/\$ pnpm run build/g)).toHaveLength(1);
  expect(text?.match(/Build completed in 1\.2s\./g)).toHaveLength(1);
});

test('Workspace 演示在窄屏保留固定高度且不横向溢出', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const demos = [
    'workspace-demo',
    'workspace-file-demo',
    'workspace-realtime-demo',
    'workspace-custom-demo',
    'workspace-advanced-demo',
    'workspace-task-demo',
    'workspace-browser-demo',
    'workspace-empty-demo',
    'workspace-header-extra-demo',
    'workspace-file-actionref-demo',
    'workspace-file-search-demo',
    'workspace-file-share-demo',
    'workspace-file-tree-demo',
    'workspace-file-list-tree-switch-demo',
    'workspace-file-large-demo',
    'workspace-file-custom-preview-flow',
  ];
  for (const demo of demos) {
    await test.step(demo, async () => {
      await page.goto(`/~demos/docs-demos-${demo}`);
      await expect(page.getByTestId('workspace')).toBeVisible();
      const size = await page.locator('body').evaluate((element) => ({
        width: element.scrollWidth,
        height: element.scrollHeight,
      }));
      expect(size.width).toBeLessThanOrEqual(320);
      expect(size.height).toBeLessThanOrEqual(740);
      expect(
        await page
          .getByTestId('workspace')
          .evaluate((element) => element.getBoundingClientRect().bottom),
      ).toBeLessThanOrEqual(560);
    });
  }
});
