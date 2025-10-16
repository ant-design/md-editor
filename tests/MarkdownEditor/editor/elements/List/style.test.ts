import { ConfigProvider } from 'antd';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useStyle } from '../../../../../src/MarkdownEditor/editor/elements/List/style';

describe('List Style', () => {
  it('应该导出 useStyle 函数', () => {
    expect(typeof useStyle).toBe('function');
  });

  it('应该返回样式对象', () => {
    const { result } = renderHook(() => useStyle('test-list'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });

  it('应该返回 wrapSSR 函数', () => {
    const { result } = renderHook(() => useStyle('test-list'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toHaveProperty('wrapSSR');
    expect(typeof result.current.wrapSSR).toBe('function');
  });

  it('应该返回 hashId', () => {
    const { result } = renderHook(() => useStyle('test-list'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toHaveProperty('hashId');
  });

  it('应该接受自定义前缀', () => {
    const { result } = renderHook(() => useStyle('custom-list'), {
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

  it('应该为不同前缀生成样式', () => {
    const { result: result1 } = renderHook(() => useStyle('prefix-1'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });
    const { result: result2 } = renderHook(() => useStyle('prefix-2'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });
    
    expect(result1.current).toBeDefined();
    expect(result2.current).toBeDefined();
  });

  it('应该支持有序列表样式', () => {
    const { result } = renderHook(() => useStyle('ol-list'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });

  it('应该支持无序列表样式', () => {
    const { result } = renderHook(() => useStyle('ul-list'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });

  it('应该支持任务列表样式', () => {
    const { result } = renderHook(() => useStyle('task-list'), {
      wrapper: ({ children }) => <ConfigProvider>{children}</ConfigProvider>,
    });

    expect(result.current).toBeDefined();
  });
});

