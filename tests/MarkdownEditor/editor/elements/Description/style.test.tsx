import { ConfigProvider } from 'antd';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useStyle } from '../../../../../src/MarkdownEditor/editor/elements/Description/style';

describe('Description Style', () => {
  it('应该导出 useStyle 函数', () => {
    expect(typeof useStyle).toBe('function');
  });

  it('应该返回样式对象', () => {
    const { result } = renderHook(() => useStyle('test-prefix'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });

  it('应该返回 wrapSSR 函数', () => {
    const { result } = renderHook(() => useStyle('test-prefix'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toHaveProperty('wrapSSR');
    expect(typeof result.current.wrapSSR).toBe('function');
  });

  it('应该返回 hashId', () => {
    const { result } = renderHook(() => useStyle('test-prefix'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toHaveProperty('hashId');
  });

  it('应该接受自定义前缀', () => {
    const { result } = renderHook(() => useStyle('custom-description'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });

  it('应该使用默认前缀', () => {
    const { result } = renderHook(() => useStyle(), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });

  it('应该处理空字符串前缀', () => {
    const { result } = renderHook(() => useStyle(''), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });

  it('应该生成一致的样式结构', () => {
    const { result: result1 } = renderHook(() => useStyle('prefix'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });
    const { result: result2 } = renderHook(() => useStyle('prefix'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });
    
    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
    expect(result1.current).toHaveProperty('wrapSSR');
    expect(result2.current).toHaveProperty('wrapSSR');
  });
});

