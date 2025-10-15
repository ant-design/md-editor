import { describe, expect, it, vi } from 'vitest';

describe('scrollTo 工具函数 - 简化测试', () => {
  it('应该导出 scrollTo 函数', async () => {
    const scrollToModule = await import('../../src/utils/scrollTo');
    expect(typeof scrollToModule.default).toBe('function');
  });

  it('应该接受目标位置参数', async () => {
    const scrollToModule = await import('../../src/utils/scrollTo');
    expect(() => scrollToModule.default(100)).not.toThrow();
  });

  it('应该接受选项参数', async () => {
    const scrollToModule = await import('../../src/utils/scrollTo');
    expect(() =>
      scrollToModule.default(100, { duration: 500 }),
    ).not.toThrow();
  });

  it('应该接受回调函数', async () => {
    const scrollToModule = await import('../../src/utils/scrollTo');
    const callback = vi.fn();
    expect(() =>
      scrollToModule.default(100, { callback }),
    ).not.toThrow();
  });

  it('应该接受自定义容器', async () => {
    const scrollToModule = await import('../../src/utils/scrollTo');
    const container = document.createElement('div');
    expect(() =>
      scrollToModule.default(100, { container }),
    ).not.toThrow();
  });
});


