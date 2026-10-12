import { expect, test } from '@playwright/test';

test('轮播连续切换、键盘选择和显式翻面即时响应', async ({ page }) => {
  await page.goto('/');
  const carousel = page.locator('[data-home-carousel]');
  await carousel.getByRole('tab', { name: '01.精准预期', exact: true }).click();
  await carousel.getByRole('tab', { name: '03.精准交付', exact: true }).click();
  const lastTab = carousel.getByRole('tab', {
    name: '05.精准赋能',
    exact: true,
  });
  await lastTab.click();
  await expect(lastTab).toHaveAttribute('aria-selected', 'true');
  await lastTab.press('Home');
  await expect(
    carousel.getByRole('tab', { name: 'intro.设计原则', exact: true }),
  ).toBeFocused();

  const activeCard = carousel.locator('[data-carousel-card="intro"]');
  await activeCard.getByRole('button', { name: '查看卡片详情' }).click();
  await expect(activeCard).toHaveAttribute('data-flipped', 'true');
  await activeCard
    .getByRole('button', { name: '返回卡片概览' })
    .press('Escape');
  await expect(activeCard).toHaveAttribute('data-flipped', 'false');
});

test('手机演示标签和展台导航完整可操作', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const enhance = page.locator('[data-home-section="enhance"]');
  await enhance.scrollIntoViewIfNeeded();
  const cardTab = enhance.getByRole('tab', { name: /卡片/ });
  await cardTab.click();
  await expect(cardTab).toHaveAttribute('aria-selected', 'true');
  await cardTab.press('Home');
  const markdownTab = enhance.getByRole('tab', { name: /Markdown/ });
  await expect(markdownTab).toBeFocused();
  await expect(
    enhance.getByRole('heading', { name: 'Markdown 富文本示例', exact: true }),
  ).toBeVisible();
  const tabPanel = enhance.getByRole('tabpanel');
  const panelBox = await tabPanel.boundingBox();
  expect(panelBox?.width).toBeLessThanOrEqual(390);

  const showroom = page.locator('[data-home-section="showroom"]');
  await showroom.scrollIntoViewIfNeeded();
  const navigation = showroom
    .getByRole('group', { name: '样板间', exact: true })
    .nth(1);
  await navigation
    .getByRole('button', { name: '样板间 1', exact: true })
    .click();
  const lastSlide = navigation.getByRole('button', {
    name: '样板间 5',
    exact: true,
  });
  await lastSlide.click();
  await expect(lastSlide).toHaveAttribute('aria-current', 'true');
  await expect(
    showroom.getByRole('button', { name: '样板间 5', pressed: true }),
  ).toBeVisible();
  const pageWidth = await page.evaluate(
    () => document.documentElement.scrollWidth,
  );
  expect(pageWidth).toBe(390);
});
