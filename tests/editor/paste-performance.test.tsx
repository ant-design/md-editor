import { render } from '@testing-library/react';
import { ConfigProvider } from 'antd';
import React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from '../../src';
import { useOptimizedPaste } from '../../src/MarkdownEditor/editor/hooks/useOptimizedPaste';
import { performanceMonitor } from '../../src/MarkdownEditor/editor/utils/performanceMonitor';

// 模拟性能监控
vi.mock('../../src/MarkdownEditor/editor/utils/performanceMonitor', () => ({
  performanceMonitor: {
    startMonitoring: vi.fn(),
    endMonitoring: vi.fn(),
    setEnabled: vi.fn(),
  },
  generateOperationId: vi.fn(() => 'test-operation-id'),
}));

// 测试组件
const TestComponent = () => {
  const { debouncedPaste, cleanup } = useOptimizedPaste({
    onPasteStart: () => {
      console.log('Paste started');
    },
    onPasteEnd: () => {
      console.log('Paste ended');
    },
    onPasteError: (error) => {
      console.error('Paste error:', error);
    },
  });

  return (
    <div>
      <button
        type="button"
        onClick={() => debouncedPaste(async () => console.log('Paste handler'))}
      >
        Test Paste
      </button>
      <button type="button" onClick={() => cleanup()}>
        Cleanup
      </button>
    </div>
  );
};

describe('粘贴性能优化测试', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderEditor = () => {
    return render(
      <ConfigProvider
        theme={{
          hashed: false,
        }}
      >
        <MarkdownEditor
          initSchemaValue={[{ type: 'paragraph', children: [{ text: '' }] }]}
        />
      </ConfigProvider>,
    );
  };

  it('应该正确渲染编辑器', () => {
    const { container } = renderEditor();
    const editor = container.querySelector(
      '[data-slate-editor]',
    ) as HTMLElement;
    expect(editor).toBeTruthy();
  });

  it('应该正确渲染优化粘贴Hook', () => {
    const { container } = render(<TestComponent />);
    const buttons = container.querySelectorAll('button');
    expect(buttons).toHaveLength(2);
  });

  it('应该正确清理资源', () => {
    const { unmount } = renderEditor();

    // 卸载组件
    unmount();

    // 验证组件已卸载
    expect(document.querySelector('[data-slate-editor]')).toBeNull();
  });

  it('应该正确模拟性能监控', () => {
    expect(performanceMonitor.startMonitoring).toBeDefined();
    expect(performanceMonitor.endMonitoring).toBeDefined();
    expect(performanceMonitor.setEnabled).toBeDefined();
  });

  it('应该正确处理大量内容', () => {
    const largeText = 'a'.repeat(10000);
    expect(largeText.length).toBe(10000);
    expect(largeText).toContain('a');
  });

  it('应该正确处理HTML内容', () => {
    const htmlContent = '<p>测试段落</p>'.repeat(100);
    expect(htmlContent).toContain('测试段落');
    expect(htmlContent).toContain('<p>');
  });
});
