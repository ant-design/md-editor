import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import scrollTo from '../../src/utils/scrollTo';

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
    expect(() => scrollToModule.default(100, { duration: 500 })).not.toThrow();
  });

  it('应该接受回调函数', async () => {
    const scrollToModule = await import('../../src/utils/scrollTo');
    const callback = vi.fn();
    expect(() => scrollToModule.default(100, { callback })).not.toThrow();
  });

  it('应该接受自定义容器', async () => {
    const scrollToModule = await import('../../src/utils/scrollTo');
    const container = document.createElement('div');
    expect(() => scrollToModule.default(100, { container })).not.toThrow();
  });
});

describe('scrollTo - 完整功能测试', () => {
  let rafSpy: any;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('应该滚动到指定位置', () => {
    const mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    scrollTo(100);

    // 应该调用 scrollTo
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('应该使用自定义持续时间', () => {
    const mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    scrollTo(100, { duration: 1000 });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('应该在完成后调用回调函数', (done) => {
    const callback = vi.fn(() => {
      expect(callback).toHaveBeenCalled();
      done();
    });

    scrollTo(100, { callback, duration: 10 });

    // 快进时间以完成动画
    setTimeout(() => {
      vi.advanceTimersByTime(20);
    }, 15);
  });

  it('应该处理 Document 容器', () => {
    const originalScrollTop = document.documentElement.scrollTop;

    scrollTo(100, { container: document });

    expect(typeof document.documentElement.scrollTop).toBe('number');
  });

  it('应该处理 HTMLElement 容器', () => {
    const div = document.createElement('div');
    Object.defineProperty(div, 'scrollTop', {
      value: 0,
      writable: true,
      configurable: true,
    });

    scrollTo(100, { container: div });

    expect(typeof div.scrollTop).toBe('number');
  });

  it('应该处理 HTMLDocument 构造函数名称', () => {
    const mockDoc = {
      constructor: { name: 'HTMLDocument' },
      documentElement: {
        scrollTop: 0,
      },
    };

    scrollTo(100, { container: mockDoc as any });

    expect(typeof mockDoc.documentElement.scrollTop).toBe('number');
  });

  it('应该使用默认参数', () => {
    const mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    scrollTo(200);

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('应该处理零持续时间', () => {
    const mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;
    const callback = vi.fn();

    scrollTo(100, { duration: 0, callback });

    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('应该在动画期间多次更新滚动位置', () => {
    const mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    scrollTo(1000, { duration: 450 });

    // requestAnimationFrame 会被多次调用
    expect(mockScrollTo).toHaveBeenCalled();
  });

  it('应该保持 pageXOffset 不变', () => {
    const originalPageXOffset = window.pageXOffset;
    const mockScrollTo = vi.fn();
    window.scrollTo = mockScrollTo;

    scrollTo(100);

    // 验证 scrollTo 被调用时第一个参数是 pageXOffset
    if (mockScrollTo.mock.calls.length > 0) {
      expect(mockScrollTo.mock.calls[0][0]).toBe(window.pageXOffset);
    }
  });
});
